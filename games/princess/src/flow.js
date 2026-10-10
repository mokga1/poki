// 한 달의 흐름: 달 시작(이벤트·병) → 활동 → 달 끝(이벤트) → 다음 달 / 엔딩
import { ACTIVITIES, CATEGORIES } from './data/activities.js';
import { applyActivity, canAfford, recover, advanceMonth, battleStats, maxedGains, STAT_NAMES } from './rules.js';
import { REGIONS, GEM_INFO } from './data/regions.js';
import { ENEMIES } from './data/enemies.js';
import { newTrip } from './screens/adventure.js';
import { modal, toast, fillName } from './ui.js';
import { sfx } from './sound.js';

// 이벤트 훅 (Task 8 에서 채운다)
export let runEvents = async () => {};
export function setEventRunner(fn) { runEvents = fn; }

// 메인 화면이 그려질 때마다 부른다. 그 달에 처음일 때만 동작한다.
export async function startMonth(ctx) {
  const s = ctx.state;
  if (s.startedMonth === s.month) return;
  s.startedMonth = s.month; // 같은 달에 다시 불려도 한 번만 (저장은 이벤트가 끝난 뒤: 도중에 새로고침하면 다시 본다)
  const ran = await runEvents(ctx, 'monthStart');
  ctx.save();
  if (ran && !s.sick) ctx.go('home'); // 선물·보석 표시를 새로 그린다
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
      const maxed = maxedGains(s, a);
      const money = a.income ? `<span class="earn">+${a.income} G</span>` : a.cost ? `<span class="${ok ? 'cost' : 'cost no'}">-${a.cost} G</span>` : '<span class="free">무료</span>';
      return `<button class="pick ${ok ? '' : 'off'}" data-close="${a.id}">
        <span class="pi">${a.icon}</span><span class="pn">${a.name}</span><span class="pg">${fmtGain(a)}</span>${money}
        ${ok ? '' : '<span class="nomoney">돈이 부족해요</span>'}${maxed.length ? `<span class="maxed">${maxed.map((k) => STAT_NAMES[k]).join('·')} MAX ✨</span>` : ''}</button>`;
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

// 무사수행: 지역 고르기 → 모험 보드 → 달 끝
const BOSS_LEVEL = { forest: 4, cave: 7, ice: 10, tower: 12 };
export async function chooseRegion(ctx) {
  const s = ctx.state;
  const id = await modal({
    title: '⚔️ 어디로 모험을 떠날까요?',
    html: `<div class="pick-grid regions">${REGIONS.map((r) => {
      const open = r.need(s);
      const has = s.gems.includes(r.gem);
      return `<button class="pick ${open ? '' : 'off'}" data-close="${r.id}">
        <span class="pi">${open ? r.icon : '🔒'}</span><span class="pn">${r.name}</span>
        <span class="pg">${open ? `보스: ${ENEMIES[r.boss].name}<br>권장 레벨 ${BOSS_LEVEL[r.id]}` : r.lock}</span>
        ${has ? `<span class="free">⭐ ${GEM_INFO[r.gem].name} 획득</span>` : open ? `<span class="cost">${GEM_INFO[r.gem].name}이 있어요</span>` : ''}
      </button>`;
    }).join('')}</div>`,
    buttons: [{ id: 'cancel', label: '그만두기', kind: 'sub' }],
  });
  if (!id || id === 'cancel') return;
  const b = battleStats(s);
  s.hp = b.maxHp; s.mp = b.maxMp;
  await new Promise((done) => ctx.go('adventure', { trip: newTrip(id, done) }));
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
