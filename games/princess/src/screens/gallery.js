// 엔딩 도감: 본 엔딩은 그림과 제목, 못 본 엔딩은 ? 와 힌트
import { selectBg } from '../art/scenes.js';
import { avatar } from '../art/avatar.js';
import { CHARACTERS } from '../data/characters.js';
import { ENDINGS } from '../data/endings.js';
import { loadGallery } from '../state.js';
import { modal, fillName, sparkles } from '../ui.js';
import { sfx } from '../sound.js';

const COLORS = { throne: '#ffd1e6', peace: '#e3dcff', hero: '#ffe3c4', magic: '#d8c9ff', library: '#f3e2c8', ballroom: '#f2c4e0', bakery: '#ffe0b8', flower: '#d8f5d0', field: '#d6efff' };
const GIRLS = Object.values(CHARACTERS);

// params: { back: 'title' | 'home' }
export function render(root, ctx, { back = 'title' } = {}) {
  const seen = loadGallery();
  root.innerHTML = `${selectBg()}
    <button class="home title-back" data-back>← 돌아가기</button>
    <div class="select-title">📜 엔딩 도감</div>
    <div class="select-sub">모은 엔딩 ${seen.length} / ${ENDINGS.length}</div>
    <div class="gallery">${ENDINGS.map((en, i) => {
      const got = seen.includes(en.id);
      const girl = GIRLS[i % GIRLS.length];
      return `<button class="gcard ${got ? 'got' : ''}" data-id="${en.id}" style="--bgc:${COLORS[en.scene]}">
        <span class="gno">${i + 1}</span>
        <div class="gpic">${got ? avatar(girl, 'g', { equip: { outfit: en.outfit, hat: en.hat }, mood: 'joy' }) : '<span class="q">?</span>'}</div>
        <div class="gt">${got ? en.title : '???'}</div>
        ${got ? '' : `<div class="gh">${en.hint}</div>`}
      </button>`;
    }).join('')}</div>`;
  sparkles(root, 12);

  root.addEventListener('click', async (e) => {
    if (e.target.closest('[data-back]')) {
      sfx('click');
      ctx.go(back === 'home' && ctx.state ? 'home' : 'title');
      return;
    }
    const card = e.target.closest('.gcard.got');
    if (!card) return;
    sfx('click');
    const en = ENDINGS.find((x) => x.id === card.dataset.id);
    await modal({ title: en.title, html: `<p class="gtext">${fillName(en.text, '공주님')}</p>`, buttons: [{ id: 'ok', label: '닫기' }] });
  });
}
