// 무사수행 보드: 구불구불한 길 위 7칸(마지막은 보스)을 한 칸씩 나아간다
import { regionBg } from '../art/regionScenes.js';
import { avatar } from '../art/avatar.js';
import { monster } from '../art/monsters.js';
import { LULU } from '../art/npcs.js';
import { REGIONS } from '../data/regions.js';
import { ITEMS } from '../data/items.js';
import { ENEMIES } from '../data/enemies.js';
import { battleStats, rollTile, addStats, STAT_NAMES } from '../rules.js';
import { modal, wait, esc, josa, sparkles } from '../ui.js';
import { sfx, music } from '../sound.js';

// 칸 위치(화면 % 좌표). 마지막이 보스.
const NODES = [[11, 80], [24, 63], [38, 75], [51, 58], [64, 70], [76, 52], [88, 30]];
const START = [4, 88];
const TILE_ICON = { battle: '⚔️', chest: '🎁', spring: '⛲', flower: '🌼', flee: '💨', boss: '👑' };

export function newTrip(regionId, done) {
  const region = REGIONS.find((r) => r.id === regionId);
  return {
    region: regionId,
    tiles: [...Array.from({ length: region.steps }, () => rollTile()), 'boss'],
    pos: -1, marks: [], gold: 0, exp: 0, done,
  };
}

// params: { trip }
export function render(root, ctx, { trip }) {
  const s = ctx.state;
  const region = REGIONS.find((r) => r.id === trip.region);
  music('adventure');
  const at = (i) => (i < 0 ? START : NODES[i]);

  root.innerHTML = `${regionBg(region.id)}
    <svg class="path-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline points="${[START, ...NODES].map(([x, y]) => `${x},${y}`).join(' ')}" fill="none" stroke="#fff" stroke-width="14" stroke-dasharray="1 30" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
    </svg>
    ${NODES.map(([x, y], i) => {
      const boss = i === NODES.length - 1;
      const mark = trip.marks[i];
      return `<div class="node ${boss ? 'boss' : ''} ${mark ? 'done' : ''} ${i === trip.pos + 1 ? 'next' : ''}" style="left:${x}%;top:${y}%">
        ${boss ? `<div class="boss-face">${monster(region.boss)}</div>` : `<span>${mark ? TILE_ICON[mark] : '?'}</span>`}</div>`;
    }).join('')}
    <div class="token" style="left:${at(trip.pos)[0]}%;top:${at(trip.pos)[1]}%">${avatar(s, 'tk')}</div>
    <div class="topbar">
      <span class="logo">${region.icon} ${region.name}</span>
      <span class="chip">🚩 ${Math.max(0, trip.pos + 1)} / ${NODES.length}</span>
      <span class="spacer"></span>
      <span class="chip gold">🪙 ${s.gold} G</span>
    </div>
    <div class="frame adv-panel">
      <div class="adv-stats">
        <div><span>HP</span><div class="hpbar"><i style="width:${(s.hp / battleStats(s).maxHp) * 100}%"></i></div><b>${s.hp}/${battleStats(s).maxHp}</b></div>
        <div><span>MP</span><div class="hpbar mp"><i style="width:${(s.mp / battleStats(s).maxMp) * 100}%"></i></div><b>${s.mp}/${battleStats(s).maxMp}</b></div>
        <div class="pots">🧪 ${s.potions.potion || 0} · 🍬 ${s.potions.ether || 0} · 💖 ${s.potions.bigpotion || 0} · Lv.${s.level}</div>
      </div>
      <button class="pill" data-go>${trip.pos + 1 === NODES.length - 1 ? '👑 보스에게!' : '앞으로! 👣'}</button>
      <button class="pill sub" data-home>🏠 마을로</button>
    </div>`;
  sparkles(root, 10);

  let busy = false;
  root.addEventListener('click', async (e) => {
    if (busy) return;
    if (e.target.closest('[data-home]')) {
      sfx('click');
      const ok = await modal({ title: '마을로 돌아갈까요?', html: '이번 달 모험은 여기까지 해요.', buttons: [{ id: 'yes', label: '돌아가기' }, { id: 'no', label: '더 모험할래요', kind: 'sub' }] });
      if (ok === 'yes') finishTrip(ctx, trip, 'home');
      return;
    }
    if (!e.target.closest('[data-go]')) return;
    busy = true;
    sfx('step');
    trip.pos += 1;
    const [x, y] = at(trip.pos);
    const token = root.querySelector('.token');
    token.classList.add('walking');
    token.style.left = `${x}%`;
    token.style.top = `${y}%`;
    await wait(750);
    token.classList.remove('walking');
    await resolveTile(root, ctx, trip, region);
    busy = false;
  });
}

async function resolveTile(root, ctx, trip, region) {
  const s = ctx.state;
  const tile = trip.tiles[trip.pos];
  const back = () => ctx.go('adventure', { trip });

  if (tile === 'battle' || tile === 'boss') {
    const enemyId = tile === 'boss' ? region.boss : region.enemies[Math.floor(Math.random() * region.enemies.length)];
    if (tile === 'boss') {
      sfx('boss');
      await modal({
        title: '보스 등장!',
        html: `<div class="boss-intro">${monster(enemyId)}</div><b>${josa(ENEMIES[enemyId].name, '이')}</b> 길을 막고 있어요!`,
        buttons: [{ id: 'go', label: '맞서 싸운다! ⚔️' }],
      });
    }
    ctx.go('battle', {
      enemyId, region: region.id,
      done: async (result, info = {}) => {
        trip.gold += info.gold || 0;
        trip.exp += info.exp || 0;
        if (result === 'lose') return finishTrip(ctx, trip, 'lose');
        trip.marks[trip.pos] = result === 'win' ? (tile === 'boss' ? 'boss' : 'battle') : 'flee';
        if (tile === 'boss' && result === 'win') {
          await ctx.runEvents('bossWin', { enemyId, info });
          return finishTrip(ctx, trip, 'clear');
        }
        back();
      },
    });
    return;
  }

  trip.marks[trip.pos] = tile;
  if (tile === 'chest') {
    const tier = region.tier;
    const gold = (20 + Math.floor(Math.random() * 41)) * tier;
    s.gold += gold;
    trip.gold += gold;
    const got = [`🪙 돈 <b>${gold} G</b>`];
    if (Math.random() < 0.3) { s.potions.potion = (s.potions.potion || 0) + 1; got.push('🧪 <b>물약</b> 1개'); }
    if (Math.random() < 0.1) {
      const pool = Object.values(ITEMS).filter((it) => it.shop === 'normal' && it.slot !== 'use' && !s.owned.includes(it.id) && it.price <= 100 * tier);
      if (pool.length) { const it = pool[Math.floor(Math.random() * pool.length)]; s.owned.push(it.id); got.push(`✨ <b>${it.name}</b>!!`); }
    }
    sfx('chest');
    await modal({ title: '보물상자 발견! 🎁', html: `<div class="chest-pop">🎁</div>${got.join('<br>')}`, buttons: [{ id: 'ok', label: '야호!' }] });
  } else if (tile === 'spring') {
    const b = battleStats(s);
    s.hp = b.maxHp; s.mp = b.maxMp;
    sfx('heal');
    await modal({ title: '요정의 샘 ⛲', html: '반짝이는 샘물을 마셨어요.<br><b>HP와 MP</b>가 가득 찼어요!', buttons: [{ id: 'ok', label: '상쾌해!' }] });
  } else if (tile === 'flower') {
    const k = ['vit', 'str', 'int', 'mgc', 'cha', 'gra'][Math.floor(Math.random() * 6)];
    addStats(s, { [k]: 1 });
    sfx('up');
    await modal({ title: '꽃밭에서 쉬었어요 🌼', html: `꽃향기를 맡으며 잠깐 쉬었어요.<br><b>${STAT_NAMES[k]} +1</b>`, buttons: [{ id: 'ok', label: '좋아요' }] });
  }
  back();
}

async function finishTrip(ctx, trip, outcome) {
  const s = ctx.state;
  const b = battleStats(s);
  if (outcome === 'lose') {
    await modal({
      title: '루루가 구해줬어요',
      html: `<div class="lulu-mini">${LULU}</div>쓰러진 <b>${esc(josa(s.name, '을'))}</b> 루루가 집까지 데려왔어요.<br>"괜찮아요! 다음엔 더 강해져서 다시 가요!"<br><small>(잃어버린 건 없어요)</small>`,
      buttons: [{ id: 'ok', label: '다음엔 꼭 이길 거야!' }],
    });
  }
  const title = outcome === 'clear' ? '모험 대성공! 🎉' : outcome === 'lose' ? '이번 모험 정리' : '모험 끝!';
  await modal({
    title,
    html: `이번 달 모험에서<br>🪙 <b>${trip.gold} G</b> · ⭐ 경험치 <b>${trip.exp}</b><br>지금 레벨: <b>Lv.${s.level}</b>`,
    buttons: [{ id: 'ok', label: '집으로 🏠' }],
  });
  s.hp = b.maxHp; s.mp = b.maxMp;
  trip.done();
}
