const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const fs = require('node:fs/promises');
const path = require('node:path');
const run = promisify(execFile);
const root = path.resolve(__dirname, '..');
const day = value => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date(value));
const vendors = [
  ['OpenAI', /(^|\.)openai\.com$/], ['Anthropic', /(^|\.)(anthropic|claude)\.com$/],
  ['Google', /(^|\.)(google\.com|google\.dev|deepmind\.google)$|^blog\.google$/],
  ['DeepSeek', /(^|\.)deepseek\.com$/], ['Moonshot AI', /(^|\.)(kimi\.(com|ai)|moonshot\.(ai|cn))$/],
  ['MiniMax', /(^|\.)(minimax\.(io|cn)|minimaxi\.com)$/], ['Z.ai', /(^|\.)(z\.ai|bigmodel\.cn)$/],
  ['Qwen', /(^|\.)(qwen\.ai|qwencloud\.com|aliyun\.com|alibabacloud\.com)$/],
  ['Meta', /(^|\.)(meta\.ai|fb\.com)$/], ['Mistral AI', /(^|\.)mistral\.ai$/],
  ['xAI', /(^|\.)x\.ai$/], ['Xiaomi MiMo', /(^|\.)(mi\.com|xiaomi\.com)$/],
  ['Tencent', /(^|\.)tencent\.com$/], ['StepFun', /(^|\.)stepfun\.com$/],
  ['Thinking Machines Lab', /(^|\.)thinkingmachines\.ai$/], ['Reflection', /(^|\.)reflection\.ai$/],
  ['Cohere', /(^|\.)cohere\.com$/], ['NVIDIA', /(^|\.)nvidia\.com$/],
  ['ByteDance', /(^|\.)(bytedance\.com|volcengine\.com)$/], ['Upstage', /(^|\.)upstage\.ai$/]
];
function developer(model) {
  let url;
  try { url = new URL(model.sota.source); } catch { return null; }
  if (url.hostname === 'huggingface.co') {
    const org = url.pathname.split('/')[1].toLowerCase();
    return ({ inclusionai: 'inclusionAI', tencent: 'Tencent', 'zai-org': 'Z.ai', moonshotai: 'Moonshot AI', minimaxai: 'MiniMax' })[org] || null;
  }
  if (url.hostname === 'arxiv.org' && /^(ling|ring)-/.test(model.id)) return 'inclusionAI';
  return vendors.find(([, host]) => host.test(url.hostname))?.[0] || null;
}
function exactDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
function buildInsights(snapshots, current, generatedAt = new Date().toISOString()) {
  const byDay = new Map();
  const identities = new Map();
  let missingDate = 0, partialDate = 0, unknownDeveloper = 0;
  // Ascending history ensures later corrections of the same exact (p,id) win.
  for (const snapshot of [...snapshots, { date: day(generatedAt), data: current, revision: 'working-tree' }]) {
    const models = snapshot.data.models;
    const modelKeys = new Set(models.map(m => JSON.stringify([m.p, m.id])));
    byDay.set(snapshot.date, { date: snapshot.date, models: modelKeys.size,
      providers: new Set(models.map(m => m.p)).size, revision: snapshot.revision });
    for (const m of models) {
      const key = JSON.stringify([m.p, m.id]);
      if (m.sota) {
        const prior = identities.get(key);
        identities.set(key, { ...m, release: m.release || prior?.release });
      } else if (identities.has(key) && m.release) {
        // A former flagship remains a historical event; accept later date corrections.
        identities.set(key, { ...identities.get(key), release: m.release });
      }
    }
  }
  const grouped = new Map();
  for (const m of identities.values()) {
    const vendor = developer(m);
    if (!vendor) { unknownDeveloper++; continue; }
    const date = m.release?.date;
    if (!exactDate(date)) { if (/^\d{4}-\d{2}$/.test(date || '')) partialDate++; else missingDate++; continue; }
    if (!grouped.has(vendor)) grouped.set(vendor, new Map());
    const events = grouped.get(vendor);
    if (!events.has(date)) events.set(date, new Map());
    // Same vendor/day is one event, same source is one release reference across platforms.
    const releases = events.get(date);
    const source = m.release.source;
    if (!releases.has(source)) releases.set(source, { name: m.n, names: [], source,
      secondary: m.release.sourceType === 'secondary', ids: [] });
    const entry = releases.get(source);
    if (!entry.ids.includes(m.id)) entry.ids.push(m.id);
    if (!entry.names.includes(m.n)) entry.names.push(m.n);
    entry.name = entry.names.join(' / ');
  }
  const releases = [...grouped].map(([name, days]) => {
    const events = [...days].sort(([a], [b]) => a.localeCompare(b)).map(([date, entries], index, ordered) => ({
      date, releases: [...entries.values()],
      gapDays: index ? Math.round((Date.parse(date) - Date.parse(ordered[index - 1][0])) / 86400000) : null
    }));
    const gaps = events.map(e => e.gapDays).filter(n => n !== null).sort((a, b) => a - b);
    const middle = Math.floor(gaps.length / 2);
    return { name, events, latestGap: events.at(-1).gapDays,
      medianGap: gaps.length ? (gaps.length % 2 ? gaps[middle] : (gaps[middle - 1] + gaps[middle]) / 2) : null };
  }).sort((a, b) => a.name.localeCompare(b.name));
  const entries = new Map(current.models.map(model => [JSON.stringify([model.p, model.id]), model]));
  const providers = new Map();
  const context = { short: 0, medium: 0, long: 0, unknown: 0 };
  const weights = { open: 0, closed: 0, unknown: 0 };
  for (const model of entries.values()) {
    providers.set(model.p, (providers.get(model.p) || 0) + 1);
    if (!Number.isFinite(model.ctx) || model.ctx <= 0) context.unknown++;
    else if (model.ctx < 128000) context.short++;
    else if (model.ctx < 1000000) context.medium++;
    else context.long++;
    if (model.traits?.openWeights === true) weights.open++;
    else if (model.traits?.openWeights === false) weights.closed++;
    else weights.unknown++;
  }
  const largest = [...providers].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 5);
  const profile = { total: entries.size, largest, context, weights };
  return { generatedAt, profile, history: [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date)), releases,
    coverage: { commits: snapshots.length, missingDate, partialDate, unknownDeveloper, historicalEntrances: identities.size } };
}
let cached, inflight;
async function getInsights() {
  const head = (await run('git', ['rev-parse', 'HEAD'], { cwd: root })).stdout.trim();
  const stat = await fs.stat(path.join(root, 'data.json'));
  const key = `${head}:${stat.mtimeMs}:${stat.size}:${day(Date.now())}`;
  if (cached?.key === key) return cached.value;
  if (inflight?.key === key) return inflight.promise;
  const promise = (async () => {
    const log = (await run('git', ['log', '--reverse', '--format=%H%x09%cI', '--', 'data.json'], { cwd: root, maxBuffer: 2e6 })).stdout.trim();
    const snapshots = [];
    for (const line of log.split('\n').filter(Boolean)) {
      const [revision, time] = line.split('\t');
      const { stdout } = await run('git', ['show', `${revision}:data.json`], { cwd: root, maxBuffer: 12e6 });
      const data = JSON.parse(stdout);
      if (!Array.isArray(data.models)) throw new Error('Historical snapshot has no models array');
      snapshots.push({ revision: revision.slice(0, 8), date: day(time), data });
    }
    const current = JSON.parse(await fs.readFile(path.join(root, 'data.json'), 'utf8'));
    const value = buildInsights(snapshots, current);
    cached = { key, value };
    return value;
  })();
  inflight = { key, promise };
  try { return await promise; } finally { if (inflight?.promise === promise) inflight = null; }
}
module.exports = { getInsights, buildInsights, exactDate, developer };
