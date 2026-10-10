import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../../games/princess/src/rules.js';
import { ENEMIES } from '../../games/princess/src/data/enemies.js';

// 단순 전투 시뮬: 매 턴 공격, HP 40% 아래면 물약(최대 3개)
function fight(s, enemyId, rng) {
  const b = R.battleStats(s), e = { ...ENEMIES[enemyId] };
  let hp = b.maxHp, pots = 3, turn = 0;
  for (let t = 0; t < 60; t++) {
    if (hp < b.maxHp * 0.4 && pots > 0) { hp = Math.min(b.maxHp, hp + 30); pots--; }
    else { e.hp -= R.damage(b.atk, e.def, rng).dmg; if (e.hp <= 0) return true; }
    turn += 1;
    const strong = e.boss && turn % 3 === 0;
    hp -= R.damage(Math.round(e.atk * (strong ? 1.4 : 1)), b.def, rng).dmg;
    if (hp <= 0) return false;
  }
  return false;
}
function rate(s, id, n = 400) { let w = 0; for (let i = 0; i < n; i++) w += fight(s, id, Math.random); return w / n; }
function build(level, stat, gear) {
  const s = R.newGame('ruby', 't');
  s.level = level;
  for (const k of ['vit', 'str']) s.stats[k] = stat;
  Object.assign(s.equip, gear);
  return s;
}

test('시작하자마자 숲 졸개를 한 방에 쓰러뜨리지는 못한다', () => {
  const atk = R.battleStats(R.newGame('ruby', 't')).atk;
  for (const id of ['slime', 'bunny', 'squirrel']) assert.ok(ENEMIES[id].hp > atk * 1.15, id);
});
test('시작 직후에도 숲 졸개는 대체로 이긴다', () => {
  assert.ok(rate(R.newGame('sapphire', 't'), 'slime') >= 0.85);
});
test('시작 직후(레벨 1)는 숲 보스에게 대체로 진다', () => {
  assert.ok(rate(build(1, 25, {}), 'mushroom') <= 0.3);
});
test('1년차 말(레벨 4, 힘·체력 45, 나무검)이면 숲 보스를 대체로 이긴다', () => {
  assert.ok(rate(build(4, 45, { weapon: 'wood' }), 'mushroom') >= 0.6);
});
test('2년차 중반(레벨 7, 60, 기사검)이면 동굴 보스 가능', () => {
  assert.ok(rate(build(7, 60, { weapon: 'knight' }), 'golem') >= 0.5);
});
test('2년차 말(레벨 10, 70, 기사검·기사드레스)이면 얼음 성 보스 가능', () => {
  assert.ok(rate(build(10, 70, { weapon: 'knight', outfit: 'knightdress' }), 'frosty') >= 0.5);
});
test('3년차(레벨 12, 힘·체력 80, 기사검·기사드레스)면 마왕을 이길 수 있다', () => {
  assert.ok(rate(build(12, 80, { weapon: 'knight', outfit: 'knightdress' }), 'grr') >= 0.5);
});
test('3년차라도 약하면(레벨 8, 50) 마왕은 어렵다', () => {
  assert.ok(rate(build(8, 50, {}), 'grr') <= 0.3);
});
