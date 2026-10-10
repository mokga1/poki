import { test } from 'node:test';
import assert from 'node:assert/strict';
import { josa, fillName } from '../../games/princess/src/ui.js';

test('josa: 받침 있으면 이/은/을, 없으면 가/는/를', () => {
  assert.equal(josa('루비', '이'), '루비가');
  assert.equal(josa('하랑', '이'), '하랑이');
  assert.equal(josa('로즈', '은'), '로즈는');
  assert.equal(josa('에메랄드', '을'), '에메랄드를');
  assert.equal(josa('Amy', '이'), 'Amy가');
});

test('fillName: 이름·조사 채우고 HTML 은 안전하게', () => {
  assert.equal(fillName('{name이} 웃었어요. {name}의 꿈', '하랑'), '하랑이 웃었어요. 하랑의 꿈');
  assert.equal(fillName('{name은}', '<b>'), '&lt;b&gt;는');
});
