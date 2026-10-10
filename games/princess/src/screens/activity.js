// 활동 결과 연출: 장면 → "첫째 주… 넷째 주!" → 능력치 결과
import { activityScene, ACT_LOOK } from '../art/activityScenes.js';
import { avatar } from '../art/avatar.js';
import { STAT_NAMES } from '../rules.js';
import { popNumbers, sparkles, wait } from '../ui.js';
import { sfx } from '../sound.js';

const WEEKS = ['첫째 주…', '둘째 주…', '셋째 주…', '넷째 주!'];

// params: { act, res, done }
export function render(root, ctx, { act, res, done }) {
  const s = ctx.state;
  const { mood, ...equip } = ACT_LOOK[act.id] || {};
  root.innerHTML = `${activityScene(act.id)}
    <div class="act-title chip">${act.icon} ${act.name}</div>
    <div class="act-girl hop">${avatar(s, 'act', { equip, mood: res.tired ? 'hurt' : mood })}</div>
    <div class="frame act-progress"><div class="lbl">${WEEKS[0]}</div><div class="bar" style="--c:#ec4f94;--c2:#ffb3d8"><i style="width:0%"></i></div></div>
    <div class="frame act-result" hidden>
      <div class="ribbon">이번 달 결과</div>
      <p class="line">“${act.line}”</p>
      <div class="rows"></div>
      <p class="note"></p>
      <button class="pill">다음 달로 ▶</button>
    </div>`;
  sparkles(root, 10);
  run(root, act, res, done);
}

async function run(root, act, res, done) {
  const lbl = root.querySelector('.act-progress .lbl');
  const fill = root.querySelector('.act-progress i');
  for (let i = 0; i < WEEKS.length; i++) {
    lbl.textContent = WEEKS[i];
    fill.style.width = `${((i + 1) / WEEKS.length) * 100}%`;
    sfx('tick');
    await wait(650);
  }
  root.querySelector('.act-progress').hidden = true;
  root.querySelector('.act-girl').classList.remove('hop');

  const box = root.querySelector('.act-result');
  const rows = box.querySelector('.rows');
  const ch = res.changes;
  rows.innerHTML = Object.entries(ch).map(([k, v]) => `
    <div class="res-row ${(k === 'fat' ? v > 0 : v < 0) ? 'minus' : ''}">
      <span>${k === 'gold' ? '🪙 돈' : STAT_NAMES[k]}</span><b>${v > 0 ? '+' : ''}${v}${k === 'gold' ? ' G' : ''}</b>
    </div>`).join('') || '<div class="res-row"><span>변화 없음</span></div>';
  const notes = [];
  if (res.tired) notes.push('😵 너무 피곤해서 집중을 잘 못 했어요… (효과 절반)');
  if (res.sick) notes.push('🤒 앗, 열이 나기 시작했어요! 다음 달은 쉬어야 해요.');
  box.querySelector('.note').textContent = notes.join(' ');
  box.hidden = false;
  box.classList.add('pop-in');
  sfx(res.tired ? 'down' : 'up');
  popNumbers(root.querySelector('.act-girl'), Object.fromEntries(Object.entries(ch).filter(([k]) => k !== 'fat')));
  box.querySelector('button').addEventListener('click', () => { sfx('click'); done(); }, { once: true });
}
