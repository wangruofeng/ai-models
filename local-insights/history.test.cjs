const test = require('node:test');
const assert = require('node:assert/strict');
const { buildInsights, exactDate } = require('./history.cjs');
const { isLocal } = require('./server.cjs');
const model = (id, date, p = 'openai') => ({ p, id, n: id, sota: { source: 'https://openai.com/models' }, release: { date, source: `https://openai.com/${date}` } });
const snapshot = (date, models) => ({ date, revision: date, data: { models } });
test('counts deduplicate exact entrances and retain last daily observation in Shanghai timezone', () => {
  const a = model('a', '2026-01-01');
  const result = buildInsights([snapshot('2026-01-01', [a]), snapshot('2026-01-01', [a, model('b', '2026-01-02')])], { models: [a, a, { ...a, p: 'hosted' }] }, '2026-01-02T17:00:00Z');
  assert.deepEqual(result.history.map(x => [x.date, x.models, x.providers]), [['2026-01-01', 2, 1], ['2026-01-03', 2, 2]]);
});
test('former flagship survives and later release corrections apply; providers and same-day releases merge', () => {
  const a = model('a', '2026-01-01');
  const former = { ...a, sota: undefined, release: { date: '2026-01-02', source: a.release.source } };
  const result = buildInsights([snapshot('2026-01-01', [a])], { models: [former, model('b', '2026-01-12'), model('b', '2026-01-12', 'hosted'), model('c', '2026-02-01'), model('d', '2026-02-01')] }, '2026-03-01T00:00:00Z');
  const vendor = result.releases[0];
  assert.deepEqual(vendor.events.map(x => [x.date, x.gapDays]), [['2026-01-02', null], ['2026-01-12', 10], ['2026-02-01', 20]]);
  assert.equal(vendor.latestGap, 20);
  assert.equal(vendor.medianGap, 15);
  assert.equal(vendor.events[1].releases.length, 1);
});
test('partial, invalid dates and unknown developers do not create artificial intervals', () => {
  const result = buildInsights([], { models: [model('a', '2026-01'), model('b', '2026-02-30'), { ...model('c', '2026-02-01'), sota: { source: 'https://unknown.example/a' } }, model('d', '2026-01-01')] }, '2026-03-01T00:00:00Z');
  assert.equal(result.coverage.partialDate, 1);
  assert.equal(result.coverage.missingDate, 1);
  assert.equal(result.coverage.unknownDeveloper, 1);
  assert.equal(result.releases[0].medianGap, null);
  assert.equal(exactDate('2024-02-29'), true);
  assert.equal(exactDate('2026-02-29'), false);
});
test('local access requires both loopback host and socket, with no forwarding headers', () => {
  const req = (host, remoteAddress, extra = {}) => ({ headers: { host, ...extra }, socket: { remoteAddress } });
  assert.equal(isLocal(req('localhost:3457', '127.0.0.1')), true);
  assert.equal(isLocal(req('[::1]:3457', '::1')), true);
  assert.equal(isLocal(req('example.com', '127.0.0.1')), false);
  assert.equal(isLocal(req('localhost:3457', '192.168.1.8')), false);
  assert.equal(isLocal(req('localhost:3457', '127.0.0.1', { 'x-forwarded-for': '1.2.3.4' })), false);
});
