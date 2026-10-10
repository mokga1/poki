import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickEvents } from '../../games/princess/src/story.js';
import { newGame } from '../../games/princess/src/rules.js';

const E = [
  { id: 'a', hook: 'monthStart', once: true, when: (s) => s.month === 1 },
  { id: 'b', hook: 'monthEnd', when: () => true },
  { id: 'r1', hook: 'monthEnd', random: true, when: () => true },
  { id: 'r2', hook: 'monthEnd', random: true, when: () => true },
  { id: 'r3', hook: 'monthEnd', random: true, when: () => false },
];
const ids = (list) => list.map((e) => e.id);

test('once 이벤트는 flags 에 기록되면 다시 안 나온다', () => {
  const s = newGame('ruby', 't');
  assert.deepEqual(ids(pickEvents(E, s, 'monthStart', {}, () => 0.9)), ['a']);
  s.flags.a = true;
  assert.deepEqual(ids(pickEvents(E, s, 'monthStart', {}, () => 0.9)), []);
});

test('랜덤 손님은 25% 확률로 조건 맞는 것 중 하나만', () => {
  const s = newGame('ruby', 't');
  assert.deepEqual(ids(pickEvents(E, s, 'monthEnd', {}, () => 0.5)), ['b']);
  const seq = [0.1, 0.99];
  let i = 0;
  assert.deepEqual(ids(pickEvents(E, s, 'monthEnd', {}, () => seq[i++])), ['b', 'r2']);
});

test('같은 손님이 두 달 연속 나오지 않는다', () => {
  const s = newGame('ruby', 't');
  s.flags.lastRandom = 'r2';
  const seq = [0.1, 0.99];
  let i = 0;
  assert.deepEqual(ids(pickEvents(E, s, 'monthEnd', {}, () => seq[i++])), ['b', 'r1']);
});
