// 상점: 진열 카드 + 입어보기 미리보기 + 사기
import { shopBg } from '../art/shopScenes.js';
import { avatar, itemIcon } from '../art/avatar.js';
import { ITEMS, SLOT_NAMES } from '../data/items.js';
import { buy, equip } from '../rules.js';
import { modal, toast, sparkles, bonusText, josa } from '../ui.js';
import { sfx } from '../sound.js';

const TABS = ['weapon', 'outfit', 'hat', 'acc', 'use'];

// params: { special?: boolean, done?: () => void }
export function render(root, ctx, { special = false, done } = {}) {
  const s = ctx.state;
  const list = Object.values(ITEMS).filter((it) => (special ? it.shop === 'special' : it.shop === 'normal'));
  const tabs = TABS.filter((t) => list.some((it) => it.slot === t));
  let tab = tabs[0];
  let picked = null;

  root.innerHTML = `${shopBg(special)}
    <div class="topbar">
      <button class="home" data-back>← 나가기</button>
      <span class="logo">${special ? '🐱 냥냥이의 특별 상점' : '🛍️ 반짝반짝 상점'}</span>
      <span class="spacer"></span>
      <span class="chip gold" data-gold>🪙 ${s.gold} G</span>
    </div>
    <div class="shop-stage"><div class="avatar-wrap breathe" data-preview></div><div class="shop-hint chip">👗 입어보기</div></div>
    <div class="frame shop-panel">
      <div class="ribbon">${special ? '오늘만 파는 물건이다냥!' : '무엇을 살까요?'}</div>
      <div class="tabs">${tabs.map((t) => `<button class="tab" data-tab="${t}">${SLOT_NAMES[t]}</button>`).join('')}</div>
      <div class="igrid"></div>
      <div class="detail"></div>
    </div>`;
  sparkles(root, 10);

  const preview = root.querySelector('[data-preview]');
  const grid = root.querySelector('.igrid');
  const detail = root.querySelector('.detail');

  const drawPreview = () => {
    const it = picked && ITEMS[picked];
    const tryOn = it && it.slot !== 'use' ? { [it.slot]: it.id } : {};
    preview.innerHTML = avatar(s, 'shop', { equip: tryOn, mood: it ? 'joy' : 'smile' });
  };
  const drawGrid = () => {
    root.querySelectorAll('.tab').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
    grid.innerHTML = list.filter((it) => it.slot === tab).map((it) => {
      const owned = it.slot !== 'use' && s.owned.includes(it.id);
      const count = it.slot === 'use' ? s.potions[it.id] || 0 : 0;
      return `<button class="icard ${picked === it.id ? 'on' : ''} ${owned ? 'owned' : ''}" data-item="${it.id}">
        <div class="ico">${itemIcon(it.id)}</div><div class="in">${it.name}</div>
        <div class="ip">${owned ? '가지고 있어요' : `🪙 ${it.price}`}</div>${count ? `<span class="cnt">×${count}</span>` : ''}</button>`;
    }).join('');
  };
  const drawDetail = () => {
    const it = picked && ITEMS[picked];
    if (!it) { detail.innerHTML = '<p class="dhint">물건을 누르면 거울 속 공주님이 입어봐요 ✨</p>'; return; }
    const owned = it.slot !== 'use' && s.owned.includes(it.id);
    const poor = s.gold < it.price;
    detail.innerHTML = `<div class="dtext"><b>${it.name}</b><span class="dbonus">${bonusText(it)}</span><span class="ddesc">${it.desc}</span></div>
      ${owned ? '<span class="chip">이미 있어요 ♡</span>'
        : `<button class="pill ${poor ? 'off' : 'gold'}" data-buy>${poor ? '돈이 부족해요' : `🪙 ${it.price} G 사기`}</button>`}`;
  };
  const redraw = () => { drawGrid(); drawDetail(); drawPreview(); root.querySelector('[data-gold]').textContent = `🪙 ${s.gold} G`; };
  redraw();

  root.addEventListener('click', async (e) => {
    const t = e.target;
    if (t.closest('[data-back]')) {
      sfx('click'); ctx.save();
      if (done) done(); else ctx.go('home');
      return;
    }
    const tb = t.closest('[data-tab]');
    if (tb) { sfx('click'); tab = tb.dataset.tab; picked = null; redraw(); return; }
    const card = t.closest('[data-item]');
    if (card) { sfx('click'); picked = card.dataset.item; redraw(); return; }
    const b = t.closest('[data-buy]');
    if (b && !b.classList.contains('off')) {
      const it = ITEMS[picked];
      if (!buy(s, it.id)) { toast('살 수 없어요'); return; }
      sfx('coin');
      ctx.save();
      redraw();
      toast(`${josa(it.name, '을')} 샀어요!`);
      if (it.slot !== 'use') {
        const ans = await modal({
          title: '새 물건이에요!',
          html: `<div class="buy-ico">${itemIcon(it.id)}</div><b>${josa(it.name, '을')}</b> 바로 장착할까요?`,
          buttons: [{ id: 'yes', label: '지금 장착!' }, { id: 'no', label: '나중에', kind: 'sub' }],
        });
        if (ans === 'yes') { equip(s, it.id); ctx.save(); sfx('up'); redraw(); }
      }
    }
  });
}
