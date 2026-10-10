import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSave } from '../../games/princess/src/state.js';
import { newGame } from '../../games/princess/src/rules.js';

test('parseSave: 정상 저장은 복원', () => {
  const s = newGame('rose', '로즈');
  assert.deepEqual(parseSave(JSON.stringify(s)), s);
});

test('parseSave: 깨진 데이터는 null', () => {
  for (const bad of [null, '', 'garbage{', '42', '{"v":0}', JSON.stringify({ v: 1, charId: 'nobody', month: 3 }),
    JSON.stringify({ v: 1, charId: 'ruby', month: 'x' })]) {
    assert.equal(parseSave(bad), null, String(bad));
  }
});
