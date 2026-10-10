import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startMonth, setEventRunner } from '../../games/princess/src/flow.js';
import { newGame } from '../../games/princess/src/rules.js';

test('달 시작 이벤트(프롤로그 등) 도중에 새로고침해도 다시 볼 수 있게, 끝나기 전엔 저장하지 않는다', async () => {
  const s = newGame('ruby', 't');
  const saves = [];
  const ctx = { state: s, save: () => saves.push(JSON.parse(JSON.stringify(s))), go: () => {} };
  let savedBeforeEventEnded = null;
  setEventRunner(async () => { savedBeforeEventEnded = saves.length; return 1; });
  await startMonth(ctx);
  assert.equal(savedBeforeEventEnded, 0);
  assert.equal(saves.at(-1).startedMonth, 1);
});

test('같은 달에 두 번 불려도 이벤트는 한 번만', async () => {
  const s = newGame('ruby', 't');
  const ctx = { state: s, save: () => {}, go: () => {} };
  let runs = 0;
  setEventRunner(async () => { runs += 1; return 0; });
  await startMonth(ctx);
  await startMonth(ctx);
  assert.equal(runs, 1);
});
