// 타이틀 화면
import { titleBg, CROWN_SVG } from '../art/scenes.js';
import { avatar } from '../art/avatar.js';
import { CHARACTERS } from '../data/characters.js';
import { hasSave, load, clearSave } from '../state.js';
import { modal, sparkles } from '../ui.js';
import { sfx, music } from '../sound.js';

export function render(root, ctx) {
  music('home');
  const saved = hasSave();
  const [a, b, c, d] = Object.values(CHARACTERS).map((ch, i) =>
    `<div class="float" style="animation-delay:${-i * 0.8}s">${avatar(ch, 't', { mood: i % 2 ? 'joy' : 'smile' })}</div>`);
  root.innerHTML = `${titleBg()}
    <a class="home title-back" href="../../index.html">← 메뉴</a>
    <div class="title-girls l">${a}${b}</div>
    <div class="title-girls r">${c}${d}</div>
    <div class="title-logo"><div class="crown float">${CROWN_SVG}</div><h1>꼬마 공주 키우기</h1><p>별빛 왕관을 되찾는 3년의 이야기</p></div>
    <div class="title-btns">
      <button class="pill" data-act="new">✨ 처음부터</button>
      ${saved ? '<button class="pill gold" data-act="continue">📖 이어하기</button>' : ''}
      <button class="pill sub" data-act="gallery">📜 엔딩 도감</button>
    </div>`;
  sparkles(root, 18);

  root.querySelector('.title-btns').addEventListener('click', async (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (!act) return;
    sfx('click');
    if (act === 'continue') {
      ctx.state = load();
      ctx.go('home');
    } else if (act === 'gallery') {
      ctx.go('gallery', { back: 'title' });
    } else if (act === 'new') {
      if (saved) {
        const ok = await modal({
          title: '처음부터 할까요?',
          html: '지금까지 키운 공주님의 기록이 지워져요.<br>(엔딩 도감은 그대로 남아요)',
          buttons: [{ id: 'yes', label: '새로 시작' }, { id: 'no', label: '취소', kind: 'sub' }],
        });
        if (ok !== 'yes') return;
        clearSave();
      }
      ctx.go('select');
    }
  });
}
