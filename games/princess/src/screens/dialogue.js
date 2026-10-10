// 대화창: 화면 아래 비주얼노벨식 대화. 글자가 한 글자씩 나오고, 누르면 다음으로.
// dialogue(ctx, scenes) → Promise<선택지 번호 | null>
// scene = { who, text, mood?, pic?, choices?: [label] }   text 의 **굵게**, {name}/{name이} 사용 가능
import { avatar } from '../art/avatar.js';
import { monster } from '../art/monsters.js';
import { LULU, NYANG, LEO, MOMO, KONG, RIVALS } from '../art/npcs.js';
import { CHARACTERS } from '../data/characters.js';
import { fillName, esc } from '../ui.js';
import { sfx } from '../sound.js';

const NPC = {
  lulu: ['루루', LULU], nyang: ['냥냥이', NYANG], leo: ['레오 왕자', LEO], momo: ['모모 할머니', MOMO], kong: ['콩이', KONG],
};
const BOSSES = { mushroom: '뭉게', golem: '또각이', frosty: '프로스티', grr: '그르릉' };

function speaker(ctx, who, mood) {
  const s = ctx.state;
  if (who === 'princess') return [s.name, avatar(s, 'dlg', { mood }), 'princess'];
  if (NPC[who]) return [NPC[who][0], NPC[who][1], who];
  if (BOSSES[who]) return [BOSSES[who], monster(who), 'boss'];
  if (RIVALS[who]) return [RIVALS[who].name, avatar(RIVALS[who], 'rv', { mood }), 'princess'];
  return ['', '', 'none'];
}

export function dialogue(ctx, scenes) {
  return new Promise((resolve) => {
    const back = document.createElement('div');
    back.className = 'dlg-back';
    back.innerHTML = `<div class="dlg-pic"></div>
      <div class="dlg-portrait"></div>
      <div class="frame dlg-box"><div class="dlg-name"></div><div class="dlg-text"></div><div class="dlg-next">▼</div><div class="dlg-choices"></div></div>`;
    document.getElementById('overlay').appendChild(back);
    const $ = (q) => back.querySelector(q);

    let i = -1, typing = null, full = '', html = '';
    const show = () => {
      i += 1;
      if (i >= scenes.length) { back.remove(); resolve(null); return; }
      const sc = scenes[i];
      const [name, portrait, kind] = speaker(ctx, sc.who, sc.mood || 'smile');
      $('.dlg-name').textContent = name;
      $('.dlg-name').hidden = !name;
      const p = $('.dlg-portrait');
      p.className = `dlg-portrait ${kind}`;
      p.innerHTML = portrait;
      p.classList.remove('pop-in'); void p.offsetWidth; if (portrait) p.classList.add('pop-in');
      $('.dlg-pic').innerHTML = sc.pic ? `<span class="pop-in">${sc.pic}</span>` : '';
      $('.dlg-choices').innerHTML = '';
      $('.dlg-next').hidden = true;
      html = fillName(esc(sc.text), ctx.state.name).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
      full = html.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
      let n = 0;
      const t = $('.dlg-text');
      t.textContent = '';
      clearInterval(typing);
      typing = setInterval(() => {
        n += 1;
        t.textContent = full.slice(0, n);
        if (n % 3 === 0) sfx('blip');
        if (n >= full.length) done();
      }, 28);
    };
    const done = () => {
      clearInterval(typing);
      typing = null;
      $('.dlg-text').innerHTML = html;
      const sc = scenes[i];
      if (sc.choices) {
        $('.dlg-choices').innerHTML = sc.choices.map((c, k) => `<button class="pill ${k ? 'sub' : ''}" data-choice="${k}">${c}</button>`).join('');
      } else {
        $('.dlg-next').hidden = false;
      }
    };
    back.addEventListener('click', (e) => {
      const ch = e.target.closest('[data-choice]');
      if (ch) { sfx('click'); back.remove(); resolve(Number(ch.dataset.choice)); return; }
      if (typing) { done(); return; }
      if (scenes[i].choices) return;
      sfx('click');
      show();
    });
    show();
  });
}
