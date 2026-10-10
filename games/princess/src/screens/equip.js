// 장비 화면: 4칸 슬롯 + 가진 장비. 누르면 장착, 다시 누르면 벗기.
import { room } from '../art/scenes.js';
import { avatar, itemIcon } from '../art/avatar.js';
import { ITEMS, SLOT_NAMES } from '../data/items.js';
import { equip, unequip, battleStats, dateInfo } from '../rules.js';
import { sparkles, bonusText } from '../ui.js';
import { sfx } from '../sound.js';

const SLOTS = ['weapon', 'outfit', 'hat', 'acc'];
const BATTLE_ROWS = [['maxHp', '❤️ 최대HP'], ['maxMp', '💧 최대MP'], ['atk', '⚔️ 공격'], ['matk', '✨ 마법'], ['def', '🛡️ 방어']];

export function render(root, ctx, { done } = {}) {
  const s = ctx.state;
  let prev = battleStats(s);

  root.innerHTML = `${room(dateInfo(s.month).season)}
    <div class="topbar">
      <button class="home" data-back>← 돌아가기</button>
      <span class="logo">🎀 장비 고르기</span>
      <span class="spacer"></span>
      <span class="chip">🧪 물약 ${s.potions.potion || 0} · 🍬 사탕 ${s.potions.ether || 0} · 💖 큰 물약 ${s.potions.bigpotion || 0}</span>
    </div>
    <div class="shop-stage"><div class="avatar-wrap breathe" data-preview></div></div>
    <div class="frame shop-panel equip-panel">
      <div class="ribbon">무엇을 입을까요?</div>
      <div class="slots"></div>
      <div class="bstats"></div>
      <div class="owned"></div>
    </div>`;
  sparkles(root, 8);

  const draw = (diffFrom) => {
    root.querySelector('[data-preview]').innerHTML = avatar(s, 'eq', { mood: diffFrom ? 'joy' : 'smile' });
    root.querySelector('.slots').innerHTML = SLOTS.map((slot) => {
      const id = s.equip[slot];
      return `<div class="slot"><span class="sl">${SLOT_NAMES[slot]}</span><div class="ico">${id ? itemIcon(id) : '<span class="none">없음</span>'}</div><span class="sn">${id ? ITEMS[id].name : '-'}</span></div>`;
    }).join('');
    const b = battleStats(s);
    root.querySelector('.bstats').innerHTML = BATTLE_ROWS.map(([k, label]) => {
      const d = diffFrom ? b[k] - diffFrom[k] : 0;
      return `<span>${label} <b>${b[k]}</b>${d ? `<em class="${d > 0 ? 'up' : 'down'}">${d > 0 ? '+' : ''}${d}</em>` : ''}</span>`;
    }).join('');
    root.querySelector('.owned').innerHTML = SLOTS.map((slot) => {
      const items = s.owned.filter((id) => ITEMS[id].slot === slot);
      return `<div class="orow"><span class="sl">${SLOT_NAMES[slot]}</span>${items.length ? items.map((id) =>
        `<button class="icard small ${s.equip[slot] === id ? 'on' : ''}" data-item="${id}" title="${bonusText(ITEMS[id])}">
          <div class="ico">${itemIcon(id)}</div><div class="in">${ITEMS[id].name}</div>${s.equip[slot] === id ? '<span class="worn">장착중</span>' : ''}</button>`).join('')
        : '<span class="empty">상점에서 사 올 수 있어요</span>'}</div>`;
    }).join('');
  };
  draw();

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-back]')) {
      sfx('click'); ctx.save();
      if (done) done(); else ctx.go('home');
      return;
    }
    const card = e.target.closest('[data-item]');
    if (!card) return;
    const id = card.dataset.item, slot = ITEMS[id].slot;
    prev = battleStats(s);
    if (s.equip[slot] === id) {
      if (slot === 'outfit' && id === 'apron') return; // 기본 옷은 벗지 않는다
      unequip(s, slot);
      sfx('click');
    } else {
      equip(s, id);
      sfx('up');
    }
    ctx.save();
    draw(prev);
  });
}
