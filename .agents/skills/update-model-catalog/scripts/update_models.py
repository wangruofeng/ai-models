#!/usr/bin/env python3
"""同步 Pi 模型目录；默认仅预览，--write 才写入。仅使用 Python 标准库。"""
import argparse
from collections import Counter
from datetime import datetime
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

URL = 'https://pi.dev/models'
ROOT = Path(__file__).resolve().parents[4]
FIELDS = ['context', 'input', 'output', 'cacheRead', 'cacheWrite']


class CatalogParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.models, self.providers = [], []
        self.row = self.cell = None
        self.link = False
        self.group = None
        self.group_text = ''

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'tr' and attrs.get('data-model-group') == 'true':
            self.group = attrs['data-model-group-provider']
            self.group_text = ''
        if tag == 'tr' and attrs.get('data-model-row') == 'true':
            self.row = {'provider': attrs['data-model-provider'], 'id': attrs['data-model-id']}
            self.values = []
        if self.row is not None:
            if tag == 'a':
                self.row.update(href=attrs['href'], name='')
                self.link = True
            if tag == 'td':
                self.cell = ''

    def handle_data(self, value):
        if self.group is not None:
            self.group_text += value
        if self.row is not None:
            if self.link:
                self.row['name'] += value
            if self.cell is not None:
                self.cell += value

    def handle_endtag(self, tag):
        if tag == 'a':
            self.link = False
        if tag == 'td' and self.cell is not None:
            self.values.append(self.cell.strip())
            self.cell = None
        if tag == 'tr':
            if self.group is not None:
                count = re.search(r'\(([\d,]+) models?\)', self.group_text)
                if not count:
                    raise ValueError('无法解析 provider 模型数量')
                self.providers.append({'provider': self.group, 'count': int(count[1].replace(',', ''))})
                self.group = None
            if self.row is not None:
                if len(self.values) != 5 or not self.row.get('name'):
                    raise ValueError('模型表格结构已变化')
                self.row.update(zip(FIELDS, self.values))
                self.models.append(self.row)
                self.row = None


def number(value):
    value = value.replace(',', '').replace('$', '').strip()
    if value == 'Varies':
        return value
    if value in ('—', '–', '-', 'N/A', ''):
        return None
    if not re.fullmatch(r'\d+(?:\.\d+)?', value):
        raise ValueError(f'无法识别的数值：{value!r}')
    return float(value) if '.' in value else int(value)


def keyed(models):
    result = {(m['p'], m['id']): m for m in models}
    if len(result) != len(models):
        raise ValueError('存在重复 provider/model ID')
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true')
    parser.add_argument('--html', type=Path, help='使用本地原始 HTML，跳过网络请求')
    args = parser.parse_args()
    if args.html:
        html = args.html.read_text()
    else:
        with urlopen(Request(URL, headers={'User-Agent': 'ai-models-catalog-sync/1.0'}), timeout=60) as response:
            html = response.read().decode('utf-8')
    table = CatalogParser()
    table.feed(html)
    total = re.search(r'id="modelsCount"[^>]*>\s*([\d,]+)\s*/\s*([\d,]+)', html)
    if not total or int(total[1].replace(',', '')) != int(total[2].replace(',', '')):
        raise ValueError('无法确认源站完整模型总数')
    expected = int(total[2].replace(',', ''))
    counts = Counter(m['provider'] for m in table.models)
    if not expected or len(table.models) != expected:
        raise ValueError('源站模型总数与提取结果不一致')
    if len(table.providers) != len(counts) or any(counts[p['provider']] != p['count'] for p in table.providers):
        raise ValueError('provider 分组与提取数量不一致')
    if len({p['provider'] for p in table.providers}) != len(table.providers):
        raise ValueError('provider 分组重复')
    models = [dict(zip(['p', 'n', 'id', 'ctx', 'in', 'out', 'cr', 'cw'],
                      [m['provider'], m['name'], m['id']] + [number(m[k]) for k in FIELDS])) for m in table.models]
    source = keyed(models)
    old = json.loads((ROOT / 'data.json').read_text())
    previous = keyed(old['models'])
    for model in models:
        prior = previous.get((model['p'], model['id']), {})
        for field in ('sota', 'traits'):
            if field in prior:
                model[field] = prior[field]
    supplements = [m for m in old['models'] if 'source' in m]
    for model in supplements:
        key = (model['p'], model['id'])
        if key in source:
            raise ValueError(f'源站与官方补充条目冲突，需要人工核对：{key}')
    providers = [p['provider'] for p in table.providers]
    for model in supplements:
        if model['p'] not in providers:
            providers.append(model['p'])
        index = max((i + 1 for i, m in enumerate(models) if m['p'] == model['p']), default=len(models))
        models.insert(index, model)
    current = keyed(models)
    counts = Counter(m['p'] for m in models)
    data = {'providers': [{'name': p, 'count': counts[p]} for p in providers], 'models': models}
    raw = {'providers': table.providers, 'models': table.models, 'total': expected}
    date = datetime.now(ZoneInfo('Asia/Taipei')).strftime('%Y-%m-%d')
    readme_path = ROOT / 'README.md'
    readme = readme_path.read_text()
    readme, replacements = re.subn(r'\d+ 个模型', f'{len(models)} 个模型', readme)
    if not replacements or '## 数据\n' not in readme:
        raise ValueError('README 结构已变化，需要更新统计替换逻辑')
    readme = re.sub(r'\d+ 个 provider', f'{len(providers)} 个 provider', readme)
    readme = re.sub(r'N / \d+', f'N / {len(models)}', readme)
    readme = re.sub(r'\n+最近同步：[^\n]*\n*', '\n\n', readme)
    note = f'\n最近同步：{date}。pi.dev/models 源站共 {expected} 个模型，另保留 {len(supplements)} 个官方补充条目，合计 {len(models)} 个模型、{len(providers)} 个 provider。\n'
    readme = re.sub(r'## 数据\n+', '## 数据\n' + note + '\n', readme, count=1)
    summary = {'source': expected, 'supplements': len(supplements), 'total': len(models), 'providers': len(providers),
               'added': len(current.keys() - previous.keys()), 'removed': len(previous.keys() - current.keys()),
               'updated': sum(current[k] != previous[k] for k in current.keys() & previous.keys()), 'written': args.write}
    if args.write:
        (ROOT / 'data.json').write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')
        (ROOT / 'reference').mkdir(exist_ok=True)
        (ROOT / 'reference/pi-models-data.json').write_text(json.dumps(raw, ensure_ascii=False, indent=2) + '\n')
        readme_path.write_text(readme)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, KeyError) as error:
        raise SystemExit(f'更新失败：{error}')
