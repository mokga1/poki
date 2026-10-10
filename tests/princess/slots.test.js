import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { SLOTS, save, load, listSlots, clearSave, hasSave } from '../../games/princess/src/state.js';
import { newGame } from '../../games/princess/src/rules.js';

// 브라우저 localStorage 흉내
function fakeStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    keys: () => [...m.keys()],
  };
}
beforeEach(() => { globalThis.window = { localStorage: fakeStorage() }; });

const game = (slot, name = '공주') => Object.assign(newGame('rose', name), { slot });

test('저장 칸은 4개', () => {
  assert.equal(SLOTS, 4);
  assert.deepEqual(listSlots(), [null, null, null, null]);
  assert.equal(hasSave(), false);
});

test('칸마다 따로 저장되고 따로 불러온다', () => {
  save(game(2, '하랑'));
  save(game(0, '루비'));
  assert.equal(load(2).name, '하랑');
  assert.equal(load(0).name, '루비');
  assert.equal(load(1), null);
  assert.deepEqual(listSlots().map((s) => s && s.name), ['루비', null, '하랑', null]);
  assert.equal(hasSave(), true);
});

test('한 칸만 지운다', () => {
  save(game(1, 'a'));
  save(game(3, 'b'));
  clearSave(1);
  assert.equal(load(1), null);
  assert.equal(load(3).name, 'b');
});

test('예전 한 칸 저장은 1번 칸으로 옮겨진다', () => {
  const old = newGame('ruby', '옛날공주');
  window.localStorage.setItem('princess-save-v1', JSON.stringify(old));
  const slots = listSlots();
  assert.equal(slots[0].name, '옛날공주');
  assert.equal(slots[0].slot, 0);
  assert.equal(window.localStorage.getItem('princess-save-v1'), null);
});

test('1번 칸이 차 있으면 예전 저장은 빈 칸으로 옮겨진다', () => {
  save(game(0, '지금공주'));
  window.localStorage.setItem('princess-save-v1', JSON.stringify(newGame('ruby', '옛날공주')));
  assert.deepEqual(listSlots().map((s) => s && s.name), ['지금공주', '옛날공주', null, null]);
});

test('깨진 칸은 빈 칸으로 본다', () => {
  window.localStorage.setItem('princess-save-v1-slot2', 'garbage{');
  assert.equal(load(2), null);
});
