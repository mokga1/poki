// 캐릭터 고르기 + 이름 짓기
import { selectBg } from '../art/scenes.js';
import { avatar } from '../art/avatar.js';
import { CHARACTERS } from '../data/characters.js';
import { newGame } from '../rules.js';
import { modal, sparkles, esc } from '../ui.js';
import { sfx } from '../sound.js';

export function render(root, ctx, { slot = 0 } = {}) {
  let picked = 'ruby';
  root.innerHTML = `${selectBg()}
    <button class="home title-back" data-back>← 처음으로</button>
    <div class="select-title">누구를 키워볼까요?</div>
    <div class="select-sub">공주님을 한 명 골라 이름을 지어주세요 ♡</div>
    <div class="cards">${Object.values(CHARACTERS).map((c) => `
      <div class="card" data-id="${c.id}" style="--k:${c.k};--k2:${c.k2};--t:${c.t}">
        <div class="gem"></div>
        <div class="pic">${avatar(c, 'c')}</div>
        <div class="nm">${c.name}</div><div class="tr">${c.trait}</div>
        <div class="tag">${c.tags.map((t) => `<span>${t}</span>`).join('')}</div>
      </div>`).join('')}</div>
    <div class="select-intro"></div>
    <button class="pill select-go">이 공주님으로 시작! ✨</button>`;
  sparkles(root, 14);

  const intro = root.querySelector('.select-intro');
  const pick = (id) => {
    picked = id;
    root.querySelectorAll('.card').forEach((el) => el.classList.toggle('picked', el.dataset.id === id));
    intro.textContent = `💬 ${CHARACTERS[id].intro}`;
  };
  pick(picked);

  root.querySelector('.cards').addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (card) { sfx('click'); pick(card.dataset.id); }
  });
  root.querySelector('[data-back]').addEventListener('click', () => ctx.go('title'));

  root.querySelector('.select-go').addEventListener('click', async () => {
    sfx('click');
    const c = CHARACTERS[picked];
    let name = c.name;
    const res = await modal({
      title: '이름을 지어주세요',
      html: `<div style="width:150px;height:200px;margin:0 auto">${avatar(c, 'n', { mood: 'joy' })}</div>
        <input type="text" maxlength="8" value="${esc(c.name)}"><div class="err"></div>
        <div class="btns"><button class="pill" data-submit>좋아요!</button><button class="pill sub" data-close="cancel">다시 고를래요</button></div>`,
      onMount(el, close) {
        const input = el.querySelector('input');
        const err = el.querySelector('.err');
        input.focus(); input.select();
        const submit = () => {
          const v = input.value.trim();
          if (!v) { err.textContent = '이름을 한 글자 이상 적어주세요'; input.focus(); return; }
          name = v;
          close('ok');
        };
        input.addEventListener('input', () => { err.textContent = ''; });
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
        el.querySelector('[data-submit]').addEventListener('click', submit);
      },
    });
    if (res !== 'ok') return;
    ctx.state = newGame(picked, name);
    ctx.state.slot = slot;
    ctx.save();
    ctx.go('home');
  });
}
