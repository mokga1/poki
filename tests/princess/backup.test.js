import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { save, load, exportSlot, importData, loadGallery, addToGallery, backupFileName } from '../../games/princess/src/state.js';
import { newGame } from '../../games/princess/src/rules.js';

function fakeStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}
beforeEach(() => { globalThis.window = { localStorage: fakeStorage() }; });

const game = (slot, name) => Object.assign(newGame('rose', name), { slot, month: 17, gold: 345 });

test('내보낸 파일을 다른 칸으로 불러오면 그대로 이어할 수 있다', () => {
  save(game(0, '하랑'));
  const text = exportSlot(0);
  const s = importData(text, 2);
  assert.equal(s.name, '하랑');
  assert.equal(s.slot, 2);
  assert.equal(load(2).month, 17);
  assert.equal(load(2).gold, 345);
});

test('다른 기기(빈 저장소)에서도 불러올 수 있고 엔딩 도감도 함께 옮겨진다', () => {
  save(game(1, '하랑'));
  addToGallery('queen');
  const text = exportSlot(1);
  globalThis.window = { localStorage: fakeStorage() }; // 새 기기
  addToGallery('bakery');
  importData(text, 0);
  assert.equal(load(0).name, '하랑');
  assert.deepEqual(loadGallery().sort(), ['bakery', 'queen']);
});

test('저장 파일이 아니면 거절하고 칸은 그대로', () => {
  save(game(3, '그대로'));
  for (const bad of ['', 'garbage{', '{"hello":1}', JSON.stringify({ app: 'princess', save: { v: 1, charId: 'nobody' } })]) {
    assert.equal(importData(bad, 3), null);
  }
  assert.equal(load(3).name, '그대로');
});

test('빈 칸은 내보낼 게 없다', () => {
  assert.equal(exportSlot(2), null);
});

test('파일 이름에 공주 이름과 날짜가 들어간다', () => {
  assert.equal(backupFileName(game(0, '하랑')), '꼬마공주-하랑-2년차7월.json');
  assert.equal(backupFileName(game(0, 'a/b:c')), '꼬마공주-a_b_c-2년차7월.json');
});
