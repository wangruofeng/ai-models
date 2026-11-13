#!/usr/bin/env python3
"""只读检查 SOTA 更新范围、格式和日期，输出标记数量。"""
import argparse
import datetime
import json
from pathlib import Path
from urllib.parse import urlparse


def validate(before, after, date):
    datetime.date.fromisoformat(date)
    if set(before) != set(after):
        raise ValueError('顶层字段发生变化')
    for key in before.keys() - {'models'}:
        if before[key] != after[key]:
            raise ValueError(f'非 models 字段发生变化：{key}')
    old, new = before['models'], after['models']
    if len(old) != len(new):
        raise ValueError('模型数量发生变化')
    counts = dict(added=0, removed=0, updated=0, unchanged=0)
    seen, providers = set(), set()
    total = 0
    for a, b in zip(old, new):
        key = (b['p'], b['id'])
        if key in seen:
            raise ValueError(f'重复模型：{key}')
        seen.add(key)
        if {k: v for k, v in a.items() if k != 'sota'} != {
            k: v for k, v in b.items() if k != 'sota'}:
            raise ValueError(f'非 sota 字段或模型顺序发生变化：{key}')
        if 'sota' in b:
            s = b['sota']
            if not isinstance(s, dict):
                raise ValueError(f'sota 须为对象，未标记时应删除字段：{key}')
            cats = s.get('categories')
            if (not isinstance(cats, list) or not cats
                    or any(not isinstance(c, str) for c in cats)
                    or len(set(cats)) != len(cats)
                    or not set(cats) <= {'general', 'reasoning', 'coding', 'image'}):
                raise ValueError(f'能力分类无效：{key}')
            verified = s.get('verifiedAt')
            datetime.date.fromisoformat(verified)
            source = urlparse(s.get('source', ''))
            if source.scheme != 'https' or not source.netloc:
                raise ValueError(f'来源 URL 无效：{key}')
            if a.get('sota') != s and verified != date:
                raise ValueError(f'变更标记须填写本轮日期：{key}')
            total += 1
            providers.add(b['p'])
        was, now = 'sota' in a, 'sota' in b
        kind = ('added' if not was and now else
                'removed' if was and not now else
                'updated' if a.get('sota') != b.get('sota') else 'unchanged')
        counts[kind] += 1
    return dict(models=len(new), sota=total, providers=len(providers), **counts)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--before', required=True, type=Path, help='修改前工作区快照')
    parser.add_argument('--after', type=Path, default=Path('data.json'))
    parser.add_argument('--date', required=True, help='本轮核对日期 YYYY-MM-DD')
    args = parser.parse_args()
    try:
        result = validate(json.loads(args.before.read_text()),
                          json.loads(args.after.read_text()), args.date)
    except (ValueError, KeyError, TypeError, OSError) as exc:
        parser.exit(1, f'校验失败：{exc}\n')
    print(json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    main()
