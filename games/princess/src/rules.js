// 게임 규칙(순수 함수). 화면·저장과 무관해서 node --test 로 검사한다.
import { CHARACTERS } from './data/characters.js';
import { ITEMS } from './data/items.js';
import { REGIONS } from './data/regions.js';
import { ENDINGS } from './data/endings.js';

export const STATS = ['vit', 'str', 'int', 'mgc', 'cha', 'gra'];
export const STAT_NAMES = { vit: '체력', str: '힘', int: '지능', mgc: '마력', cha: '매력', gra: '기품', fat: '피로' };
export const MAX_MONTH = 36;
export const STAT_MAX = 200; // 피로(fat)만 0~100
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function newGame(charId, name) {
  const c = CHARACTERS[charId];
  const stats = { vit: 15, str: 15, int: 15, mgc: 15, cha: 15, gra: 15, fat: 0 };
  for (const [k, v] of Object.entries(c.bonus)) stats[k] += v;
  const s = {
    v: 1, charId, name, month: 1, gold: 200, stats, level: 1, exp: 0,
    equip: { weapon: null, outfit: 'apron', hat: null, acc: null },
    owned: ['apron'], potions: { potion: 2, ether: 0, bigpotion: 0 },
    gems: [], friendDemon: false, counts: {}, wins: 0, flags: {}, sick: false,
  };
  const b = battleStats(s);
  s.hp = b.maxHp; s.mp = b.maxMp;
  return s;
}

export function equipBonus(s) {
  const b = {};
  for (const id of Object.values(s.equip)) {
    if (!id) continue;
    for (const [k, v] of Object.entries(ITEMS[id].bonus || {})) b[k] = (b[k] || 0) + v;
  }
  return b;
}

export function effStats(s) {
  const b = equipBonus(s), o = {};
  for (const k of [...STATS, 'fat']) o[k] = s.stats[k] + (b[k] || 0);
  return o;
}

export function battleStats(s) {
  const b = equipBonus(s), e = effStats(s), L = s.level;
  return {
    maxHp: 30 + e.vit + L * 5 + (b.maxHp || 0),
    maxMp: 10 + Math.floor(e.mgc / 2) + (b.maxMp || 0),
    atk: 5 + Math.floor(e.str / 2) + L * 2 + (b.atk || 0),
    matk: 5 + Math.floor(e.mgc * 0.6) + (b.matk || 0),
    def: Math.floor(e.vit / 5) + L + (b.def || 0),
    flee: 0.6 + (b.flee || 0),
    goldRate: 1 + (b.goldRate || 0),
  };
}

// 능력치/돈 변화를 적용하고 실제로 바뀐 양을 돌려준다.
export function addStats(s, delta) {
  const changed = {};
  for (const [k, v] of Object.entries(delta)) {
    if (!v) continue;
    if (k === 'gold') {
      const before = s.gold;
      s.gold = Math.max(0, s.gold + v);
      if (s.gold !== before) changed.gold = s.gold - before;
      continue;
    }
    const before = s.stats[k];
    s.stats[k] = clamp(before + v, 0, k === 'fat' ? 100 : STAT_MAX);
    if (s.stats[k] !== before) changed[k] = s.stats[k] - before;
  }
  return changed;
}

export const canAfford = (s, act) => s.gold >= (act.cost || 0);

// 한 달 활동 적용. 피로 70 이상이면 효과·수입 절반, 피로 100이면 병.
export function applyActivity(s, act) {
  if (!canAfford(s, act)) throw new Error('돈이 부족해요');
  const tired = act.cat !== 'rest' && s.stats.fat >= 70;
  const delta = {};
  for (const [k, v] of Object.entries(act.gain)) delta[k] = tired && k !== 'fat' && v > 0 ? Math.ceil(v / 2) : v;
  const income = Math.round((act.income || 0) * (tired ? 0.5 : 1) * battleStats(s).goldRate);
  delta.gold = income - (act.cost || 0);
  const changes = addStats(s, delta);
  s.counts[act.id] = (s.counts[act.id] || 0) + 1;
  const sick = s.stats.fat >= 100;
  if (sick) s.sick = true;
  return { changes, tired, sick };
}

// 이 활동이 올려주는 능력치 중 이미 최고(200)인 것
export const maxedGains = (s, act) => Object.entries(act.gain).filter(([k, v]) => k !== 'fat' && v > 0 && s.stats[k] >= STAT_MAX).map(([k]) => k);

export function recover(s) {
  s.sick = false;
  s.stats.fat = 30;
}

export function advanceMonth(s) {
  s.month += 1;
  return s.month > MAX_MONTH;
}

export function dateInfo(month) {
  const year = Math.floor((month - 1) / 12) + 1;
  const mon = ((month + 1) % 12) + 1;
  const season = mon >= 3 && mon <= 5 ? 'spring' : mon >= 6 && mon <= 8 ? 'summer' : mon >= 9 && mon <= 11 ? 'autumn' : 'winter';
  return { year, mon, age: 11 + year, season };
}

export function buy(s, id) {
  const it = ITEMS[id];
  if (s.gold < it.price) return false;
  if (it.slot === 'use') s.potions[id] = (s.potions[id] || 0) + 1;
  else if (s.owned.includes(id)) return false;
  else s.owned.push(id);
  s.gold -= it.price;
  return true;
}

function clampHpMp(s) {
  const b = battleStats(s);
  s.hp = Math.min(s.hp, b.maxHp);
  s.mp = Math.min(s.mp, b.maxMp);
}
export function equip(s, id) { s.equip[ITEMS[id].slot] = id; clampHpMp(s); }
export function unequip(s, slot) { s.equip[slot] = slot === 'outfit' ? 'apron' : null; clampHpMp(s); }

export function damage(atk, def, rng = Math.random) {
  const crit = rng() < 0.1;
  const base = Math.max(1, atk - def / 2);
  return { dmg: Math.max(1, Math.round(base * (0.85 + rng() * 0.3) * (crit ? 1.5 : 1))), crit };
}

export const expToNext = (level) => level * 12;
export function gainExp(s, exp) {
  s.exp += exp;
  let ups = 0;
  while (s.exp >= expToNext(s.level)) {
    s.exp -= expToNext(s.level);
    s.level += 1;
    ups += 1;
  }
  return ups;
}

export const isRegionOpen = (s, id) => REGIONS.find((r) => r.id === id).need(s);

export function rollTile(rng = Math.random) {
  const r = rng() * 100;
  return r < 55 ? 'battle' : r < 75 ? 'chest' : r < 90 ? 'spring' : 'flower';
}

export function evaluateEnding(s) {
  const e = effStats(s);
  return ENDINGS.find((en) => en.cond(e, s)).id;
}
