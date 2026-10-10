// 한 달의 흐름: 달 시작(이벤트·병) → 활동 → 달 끝(이벤트) → 다음 달 / 엔딩
import { ACTIVITIES, CATEGORIES } from './data/activities.js';
import { applyActivity, canAfford, recover, advanceMonth, STAT_NAMES } from './rules.js';
import { modal, toast, fillName } from './ui.js';
import { sfx } from './sound.js';

// 이벤트 훅 (Task 8 에서 채운다)
export let runEvents = async () => {};
export function setEventRunner(fn) { runEvents = fn; }

// 메인 화면이 그려질 때마다 부른다. 그 달에 처음일 때만 동작한다.
export async function startMonth(ctx) {
  const s = ctx.state;
  if (s.startedMonth === s.month) return;
  s.startedMonth = s.month;
  ctx.save();
  await runEvents(ctx, 'monthStart');
  if (s.sick) {
    await modal({
      title: '열이 나요 🤒',
      html: `${fillName("{name이}", s.name)} 너무 무리해서 감기에 걸렸어요.<br>이번 달은 따뜻한 수프를 먹으며 푹 쉬어요.<br><small>(피로가 30으로 줄어요)</small>`,
      buttons: [{ id: 'ok', label: '푹 쉬자…' }],
    });
    recover(s);
    await endMonth(ctx);
  }
}

export async function endMonth(ctx) {
  await runEvents(ctx, 'monthEnd');
  const done = advanceMonth(ctx.state);
  ctx.save();
  ctx.go(done ? 'ending' : 'home');
}

const fmtGain = (act) => {
  const parts = Object.entries(act.gain).map(([k, v]) => `${STAT_NAMES[k]} ${v > 0 ? '+' : ''}${v}`);
  return parts.join(' · ');
};

// 공부/아르바이트/휴식 고르기
export async function chooseActivity(ctx, cat) {
  const s = ctx.state;
  const list = Object.values(ACTIVITIES).filter((a) => a.cat === cat);
  const id = await modal({
    title: `${CATEGORIES[cat].icon} ${CATEGORIES[cat].name}`,
    cls: 'pick-modal',
    html: `<div class="pick-grid">${list.map((a) => {
      const ok = canAfford(s, a);
      const money = a.income ? `<span class="earn">+${a.income} G</span>` : a.cost ? `<span class="${ok ? 'cost' : 'cost no'}">-${a.cost} G</span>` : '<span class="free">무료</span>';
      return `<button class="pick ${ok ? '' : 'off'}" data-close="${a.id}">
        <span class="pi">${a.icon}</span><span class="pn">${a.name}</span><span class="pg">${fmtGain(a)}</span>${money}
        ${ok ? '' : '<span class="nomoney">돈이 부족해요</span>'}</button>`;
    }).join('')}</div>`,
    buttons: [{ id: 'cancel', label: '그만두기', kind: 'sub' }],
  });
  if (!id || id === 'cancel') return;
  await doActivity(ctx, ACTIVITIES[id]);
}

export async function doActivity(ctx, act) {
  const s = ctx.state;
  if (!canAfford(s, act)) { toast('돈이 부족해요'); return; }
  // 여기서는 저장하지 않는다: 연출 중에 새로고침하면 그 달을 처음부터 다시 고르게 (달이 넘어갈 때 저장)
  const res = applyActivity(s, act);
  await new Promise((done) => ctx.go('activity', { act, res, done }));
  await endMonth(ctx);
}

export function talkToLulu(ctx, advice) {
  sfx('click');
  return modal({
    title: '루루의 한마디',
    html: `<div class="lulu-talk">${advice}</div>`,
    buttons: [{ id: 'ok', label: '고마워 루루!' }],
  });
}
