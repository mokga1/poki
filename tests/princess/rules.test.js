import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../../games/princess/src/rules.js';
import { ACTIVITIES } from '../../games/princess/src/data/activities.js';

const fresh = (id = 'ruby') => R.newGame(id, '테스트');

test('newGame: 시작 능력치/돈/HP', () => {
  const s = fresh('ruby');
  assert.equal(s.gold, 200);
  assert.equal(s.stats.str, 25); assert.equal(s.stats.vit, 25); assert.equal(s.stats.int, 15);
  assert.equal(s.stats.fat, 0); assert.equal(s.month, 1);
  assert.equal(s.equip.outfit, 'apron');
  assert.equal(s.hp, R.battleStats(s).maxHp);
});

test('dateInfo: 1달째 = 1년차 3월 12살 봄, 12달째 = 2월 겨울', () => {
  assert.deepEqual(R.dateInfo(1), { year: 1, mon: 3, age: 12, season: 'spring' });
  assert.deepEqual(R.dateInfo(12), { year: 1, mon: 2, age: 12, season: 'winter' });
  assert.deepEqual(R.dateInfo(13), { year: 2, mon: 3, age: 13, season: 'spring' });
  assert.equal(R.dateInfo(8).season, 'autumn'); // 10월
});

test('addStats: 0~100 범위, 돈은 음수 불가', () => {
  const s = fresh();
  s.stats.str = 98; s.gold = 10;
  const ch = R.addStats(s, { str: 6, int: -50, gold: -30 });
  assert.equal(s.stats.str, 100); assert.equal(s.stats.int, 0); assert.equal(s.gold, 0);
  assert.deepEqual(ch, { str: 2, int: -15, gold: -10 });
});

test('applyActivity: 공부는 돈을 쓰고 능력치를 올린다', () => {
  const s = fresh();
  const r = R.applyActivity(s, ACTIVITIES.sword);
  assert.equal(s.gold, 170); assert.equal(s.stats.str, 31); assert.equal(s.stats.fat, 10);
  assert.equal(r.tired, false); assert.equal(s.counts.sword, 1);
});

test('applyActivity: 피로 70 이상이면 효과·수입 절반', () => {
  const s = fresh(); s.stats.fat = 70;
  const r = R.applyActivity(s, ACTIVITIES.bakery);
  assert.equal(r.tired, true); assert.equal(s.gold, 230); assert.equal(s.stats.fat, 82);
});

test('canAfford / applyActivity: 돈이 모자라면 못 한다', () => {
  const s = fresh(); s.gold = 10;
  assert.equal(R.canAfford(s, ACTIVITIES.magic), false);
  assert.throws(() => R.applyActivity(s, ACTIVITIES.magic));
  assert.equal(R.canAfford(s, ACTIVITIES.rest), true);
});

test('피로 100이면 병 → recover 로 피로 30', () => {
  const s = fresh(); s.stats.fat = 95;
  const r = R.applyActivity(s, ACTIVITIES.hunter);
  assert.equal(r.sick, true); assert.equal(s.sick, true);
  R.recover(s);
  assert.equal(s.sick, false); assert.equal(s.stats.fat, 30);
});

test('advanceMonth: 36달째를 넘기면 true(엔딩)', () => {
  const s = fresh(); s.month = 35;
  assert.equal(R.advanceMonth(s), false); assert.equal(s.month, 36);
  assert.equal(R.advanceMonth(s), true);
});

test('buy/equip/unequip: 보너스 반영, 해제 시 HP 줄임, 중복 구매 불가', () => {
  const s = fresh(); s.gold = 500;
  assert.equal(R.buy(s, 'necklace'), true); assert.equal(s.gold, 440);
  assert.equal(R.buy(s, 'necklace'), false);
  const base = R.battleStats(s).maxHp;
  R.equip(s, 'necklace');
  assert.equal(R.battleStats(s).maxHp, base + 10);
  s.hp = base + 10;
  R.unequip(s, 'acc');
  assert.equal(s.hp, base);
  assert.equal(R.buy(s, 'potion'), true); assert.equal(s.potions.potion, 3);
});

test('buy: 돈 부족이면 false, 돈 그대로', () => {
  const s = fresh(); s.gold = 10;
  assert.equal(R.buy(s, 'tiara'), false); assert.equal(s.gold, 10);
});

test('equip 보너스가 effStats 에 들어간다', () => {
  const s = fresh(); s.owned.push('tiara'); R.equip(s, 'tiara');
  assert.equal(R.effStats(s).gra, s.stats.gra + 5);
});

test('damage: 결정적 rng', () => {
  const seq = (...v) => { let i = 0; return () => v[i++]; };
  assert.deepEqual(R.damage(20, 10, seq(0.5, 0.5)), { dmg: 15, crit: false });
  assert.deepEqual(R.damage(20, 10, seq(0.05, 0.5)), { dmg: 23, crit: true });
  assert.equal(R.damage(1, 100, seq(0.5, 0)).dmg, 1);
});

test('gainExp: 여러 레벨 한 번에', () => {
  const s = fresh();
  const ups = R.gainExp(s, R.expToNext(1) + R.expToNext(2));
  assert.equal(ups, 2); assert.equal(s.level, 3); assert.equal(s.exp, 0);
});

test('지역 해금', () => {
  const s = fresh();
  assert.equal(R.isRegionOpen(s, 'forest'), true);
  assert.equal(R.isRegionOpen(s, 'cave'), false);
  s.gems.push('forest'); assert.equal(R.isRegionOpen(s, 'cave'), true);
  s.gems.push('cave'); assert.equal(R.isRegionOpen(s, 'ice'), true);
  assert.equal(R.isRegionOpen(s, 'tower'), false);
  s.gems.push('ice'); assert.equal(R.isRegionOpen(s, 'tower'), true);
});

test('rollTile 확률 구간', () => {
  assert.equal(R.rollTile(() => 0.0), 'battle');
  assert.equal(R.rollTile(() => 0.6), 'chest');
  assert.equal(R.rollTile(() => 0.8), 'spring');
  assert.equal(R.rollTile(() => 0.95), 'flower');
});

test('엔딩 우선순위', () => {
  const s = fresh();
  assert.equal(R.evaluateEnding(s), 'normal');
  s.counts.bakery = 8; assert.equal(R.evaluateEnding(s), 'bakery');
  s.stats.int = 80; assert.equal(R.evaluateEnding(s), 'scholar');
  s.gems = ['forest', 'cave', 'ice', 'tower']; s.stats.str = 75;
  assert.equal(R.evaluateEnding(s), 'hero');
  s.friendDemon = true; s.stats.cha = 65; assert.equal(R.evaluateEnding(s), 'peace');
  s.stats.cha = 75; s.stats.gra = 75; assert.equal(R.evaluateEnding(s), 'queen');
});
