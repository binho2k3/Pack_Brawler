/* Local, opt-in playtest journal. No network or account mutation. */
'use strict';
const Playtest = (() => {
  const VERSION = 1, SEED = 57241, LIMIT = 30, EVENT_LIMIT = 2000;
  const ACTIVE = ['prepare', 'combat1', 'combat2', 'supply', 'review'];
  const EXCLUDED = ['paused', 'hidden', 'energy', 'gap'];
  const CATEGORIES = [...ACTIVE, ...EXCLUDED];
  const ACTIONS = ['start', 'move', 'invalidMove', 'rotate', 'bench', 'merge', 'buy', 'sell', 'soldItems', 'reroll', 'supply', 'retry', 'energyPurchase'];
  const clone = value => JSON.parse(JSON.stringify(value));
  const cases = ['attack', 'balanced', 'haste'].flatMap(preset => [3, 5].map(bag => ({id: `${preset}-${bag}`, preset, bag, stage: 1})));
  function rulesKey(G) {
    const text = JSON.stringify([G.TYPES, G.STAGES, G.ENERGY, G.COMBAT_RULES, G.LOADOUT_PRESETS]) + Object.keys(G).filter(k => typeof G[k] === 'function').map(k => k + G[k].toString()).join('');
    let hash = 2166136261;
    for (const c of text) hash = Math.imul(hash ^ c.charCodeAt(0), 16777619);
    return (hash >>> 0).toString(16);
  }
  function fixture(G, id, now) {
    const config = cases.find(c => c.id === id);
    if (!config) throw new Error('Unknown playtest case');
    const p = G.newProfile(now);
    p.seed = SEED; p.bagSize = config.bag; p.cleared = [0]; G.selectLoadout(p, config.preset);
    return {p, r: G.newRun(p, config.stage), config: clone(config)};
  }
  function create(config, rules, mono, wall, id, qa = false) {
    return {version: VERSION, id, config: clone(config), rules, seed: SEED, startedAt: wall, updatedAt: wall, endedAt: null, status: 'active',
      clock: {last: mono, category: 'prepare'}, seconds: Object.fromEntries(CATEGORIES.map(k => [k, 0])),
      counts: Object.fromEntries(ACTIONS.map(k => [k, 0])), events: [], attempts: [], flags: {qa, speed2: false, gap: false, truncated: false}, feedback: {decision: '', next: ''}};
  }
  function advance(record, mono, wall, next = record.clock.category) {
    if (record.status !== 'active' || !Number.isFinite(mono)) return;
    const delta = Math.max(0, mono - record.clock.last);
    let category = record.clock.category;
    // A long unobserved foreground gap is not reliable thinking/combat time.
    if (delta > 2000 && ACTIVE.includes(category)) {category = 'gap'; record.flags.gap = true;}
    record.seconds[category] += delta / 1000;
    if (category === 'combat2' && delta > 0) record.flags.speed2 = true;
    record.clock.last = Math.max(record.clock.last, mono);
    record.clock.category = CATEGORIES.includes(next) ? next : 'paused';
    record.updatedAt = Math.max(record.updatedAt, Number.isFinite(wall) ? wall : record.updatedAt);
  }
  function totals(record) {
    const sum = keys => keys.reduce((s, k) => s + record.seconds[k], 0);
    return {active: sum(ACTIVE), excluded: sum(EXCLUDED), observed: sum(CATEGORIES), combat: record.seconds.combat1 + record.seconds.combat2,
      simulatedCombat: record.attempts.reduce((n, a) => n + (a.result?.duration || 0), 0)};
  }
  function event(record, kind, round, data = {}) {
    if (record.status !== 'active') return;
    if (Object.hasOwn(record.counts, kind)) record.counts[kind]++;
    if (kind === 'sell') record.counts.soldItems += data.count || 1;
    if (record.events.length >= EVENT_LIMIT) {record.flags.truncated = true; return;}
    record.events.push({kind, round, at: totals(record).observed, data: clone(data)});
  }
  function attempt(record, r, G, energy) {
    if (record.status !== 'active') return;
    record.attempts.push({round: r.round, ordinal: record.attempts.filter(a => a.round === r.round).length + 1,
      energyBefore: energy, hp: r.hp, funds: r.travelFunds, benchCount: r.bench.length, occupied: r.items.reduce((n, it) => n + G.cells(it).length, 0),
      gear: r.items.map(it => ({type: it.type, tier: it.tier, x: it.x, y: it.y, rot: it.rot})), result: null});
  }
  function result(record, report) {
    const a = record.attempts.at(-1);
    if (record.status !== 'active' || !a || a.result || a.round !== report.round) return false;
    a.result = clone(report);
    return true;
  }
  function finish(record, status, mono, wall) {
    if (record.status !== 'active' || !['won', 'stopped', 'abandoned', 'interrupted'].includes(status)) return false;
    advance(record, mono, wall); record.status = status; record.endedAt = record.updatedAt; return true;
  }
  function timing(record) {
    if (record.flags.qa) return 'qa';
    if (record.status !== 'won') return 'incomplete';
    if (record.flags.gap) return 'gap';
    if (record.flags.speed2) return 'speed2';
    const seconds = totals(record).active;
    return seconds < 180 ? 'short' : seconds > 300 ? 'long' : 'within';
  }
  function valid(record) {
    return !!(record && record.version === VERSION && typeof record.id === 'string' && record.id.length < 100 &&
      cases.some(c => c.id === record.config?.id && c.stage === record.config.stage && c.bag === record.config.bag && c.preset === record.config.preset) &&
      typeof record.rules === 'string' && Number.isFinite(record.startedAt) && Number.isFinite(record.updatedAt) &&
      ['active', 'won', 'stopped', 'abandoned', 'interrupted'].includes(record.status) && record.seconds && CATEGORIES.every(k => Number.isFinite(record.seconds[k]) && record.seconds[k] >= 0) &&
      record.counts && ACTIONS.every(k => Number.isFinite(record.counts[k]) && record.counts[k] >= 0) && record.clock && Number.isFinite(record.clock.last) && CATEGORIES.includes(record.clock.category) &&
      Array.isArray(record.attempts) && record.attempts.length <= 500 && record.attempts.every(a => a && Number.isInteger(a.round) && a.round >= 1 && a.round <= 5 && Array.isArray(a.gear) && a.gear.length <= 25 && a.gear.every(g => g && typeof g.type === 'string') && ['occupied','benchCount','hp','funds','ordinal','energyBefore'].every(k => Number.isFinite(a[k])) && a.gear.every(g => ['tier','x','y'].every(k => Number.isFinite(g[k])) && typeof g.rot === 'boolean') && (!a.result || Number.isFinite(a.result.duration) && a.result.duration >= 0 && typeof a.result.won === 'boolean' && Number.isFinite(a.result.endHp))) &&
      Array.isArray(record.events) && record.events.length <= EVENT_LIMIT && record.events.every(e => e && typeof e.kind === 'string' && Number.isFinite(e.at) && Number.isInteger(e.round) && e.round >= 1 && e.round <= 5) && record.flags &&
      ['qa', 'speed2', 'gap', 'truncated'].every(k => typeof record.flags[k] === 'boolean') && record.feedback && ['decision', 'next'].every(k => typeof record.feedback[k] === 'string' && record.feedback[k].length <= 500));
  }
  function restore(raw) {
    const records = [], seen = new Set();
    for (const item of Array.isArray(raw?.records) ? raw.records : []) if (valid(item) && item.status !== 'active' && !seen.has(item.id)) {records.push(clone(item)); seen.add(item.id);}
    if (valid(raw?.active) && !seen.has(raw.active.id)) {
      const interrupted = clone(raw.active);
      if (interrupted.status === 'active') {interrupted.status = 'interrupted'; interrupted.endedAt = interrupted.updatedAt;}
      records.push(interrupted);
    }
    return records.slice(-LIMIT);
  }
  function archive(records, record) {
    return [...records.filter(v => v.id !== record.id), clone(record)].slice(-LIMIT);
  }
  function feedback(record, decision, next) {
    record.feedback = {decision: String(decision).slice(0, 500), next: String(next).slice(0, 500)};
  }
  function cohort(records, rules) {
    return cases.map(config => {
      const matching = records.filter(r => r.config.id === config.id && r.rules === rules && !r.flags.qa && r.status !== 'active');
      const eligible = matching.filter(r => ['short', 'within', 'long'].includes(timing(r)));
      return {id: config.id, runs: matching.length, wins: matching.filter(r => r.status === 'won').length,
        incomplete: matching.filter(r => r.status !== 'won').length, timingSamples: eligible.length,
        meanActive: eligible.length ? eligible.reduce((sum, r) => sum + totals(r).active, 0) / eligible.length : null,
        within: eligible.filter(r => timing(r) === 'within').length};
    });
  }
  function exportData(records, active = null) {return JSON.stringify({schema: 'pack-brawler-playtest', version: VERSION, units: 'seconds', seed: SEED,
    note: 'Local opt-in playtests. Technical QA, x2, incomplete trips and foreground gaps are labelled; no inference of fun or balance.', records, active}, null, 2);}
  return {VERSION, SEED, LIMIT, EVENT_LIMIT, cases, CATEGORIES, ACTIONS, fixture, rulesKey, create, advance, totals, event, attempt, result, finish, timing, valid, restore, archive, feedback, cohort, exportData};
})();
if (typeof module !== 'undefined' && module.exports) module.exports = Playtest;
