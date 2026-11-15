#!/usr/bin/env python3
"""同步 Pi 模型目录；默认仅预览，--write 才写入。仅使用 Python 标准库。"""
import argparse
from collections import Counter
from datetime import datetime
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

URL = 'https://pi.dev/models'
ROOT = Path(__file__).resolve().parents[4]
FIELDS = ['context', 'input', 'output', 'cacheRead', 'cacheWrite']

# DeepSeek 未单独公布缓存写入价。上下文采用官方 /models 文档的精确值。
# 条目被源站下架后此处会残留，同步时打印警告提醒清理。
MANUAL_OVERRIDES = {
    ('deepseek', 'deepseek-v4-pro'): {'ctx': 1048576, 'cw': None},
    ('deepseek', 'deepseek-flash'): {'ctx': 1048576, 'cw': None},
}
SUBSCRIPTION_PROVIDERS = {'zai', 'zai-coding-cn'}


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
        for field in ('sota', 'traits', 'imageGeneration', 'release'):
            if field in prior:
                model[field] = prior[field]
        model.update(MANUAL_OVERRIDES.get((model['p'], model['id']), {}))
        if model['p'] in SUBSCRIPTION_PROVIDERS:
            model.update({'in': None, 'out': None, 'cr': None, 'cw': None})
    stale = MANUAL_OVERRIDES.keys() - source.keys()
    if stale:
        print(f'警告：人工覆盖的条目已不在源站，请清理 MANUAL_OVERRIDES：{sorted(stale)}', file=sys.stderr)
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
    note = f'最近同步：{date}。pi.dev/models 源站共 {expected} 个模型，另保留 {len(supplements)} 个官方补充条目，合计 {len(models)} 个模型、{len(providers)} 个 provider。'
    readme, replacements = re.subn(r'(?m)^## 数据\n\n最近同步：[^\n]*$', f'## 数据\n\n{note}', readme)
    if replacements != 1:
        raise ValueError('README 的「数据」章节需要且只能有一条同步摘要')
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
