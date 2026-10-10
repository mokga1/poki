// 별빛 축제 → 엔딩 화면. 본 엔딩은 도감에 기록하고 진행 저장은 지운다.
import { festivalBg, endingBg } from '../art/endingScenes.js';
import { avatar } from '../art/avatar.js';
import { monster } from '../art/monsters.js';
import { ENDINGS } from '../data/endings.js';
import { evaluateEnding, effStats, STAT_NAMES } from '../rules.js';
import { addToGallery, clearSave, loadGallery } from '../state.js';
import { dialogue } from './dialogue.js';
import { fillName, sparkles } from '../ui.js';
import { sfx, music } from '../sound.js';

export async function render(root, ctx) {
  const s = ctx.state;
  const lit = s.gems.length === 4;
  music('ending');
  root.innerHTML = `${festivalBg(lit)}<div class="end-girl">${avatar(s, 'fest', { mood: 'joy' })}</div>`;
  sparkles(root, lit ? 24 : 8);

  await dialogue(ctx, lit ? [
    { who: null, pic: '🎆', text: '3년이 흘러, 드디어 **별빛 축제**의 밤이 찾아왔어요.' },
    { who: 'lulu', text: '{name}, 준비됐어? 네 개의 별 보석을 왕관에 끼우자!' },
    { who: null, pic: '👑', text: '초록, 파랑, 하양, 분홍… 보석이 하나씩 제자리를 찾자, 별빛 왕관이 눈부시게 빛나기 시작했어요!' },
    { who: null, pic: '✨', text: '회색 구름이 걷히고, 왕국 곳곳에 다시 꽃이 피어났어요. 사람들의 환호성이 밤하늘에 울려 퍼졌지요.' },
    { who: 'lulu', text: '해냈어, {name}! 정말 정말 멋졌어! 그럼… 이제 {name}의 미래를 볼까?' },
  ] : [
    { who: null, pic: '🎆', text: '3년이 흘러, 드디어 **별빛 축제**의 밤이 찾아왔어요.' },
    { who: 'lulu', text: `보석은 ${s.gems.length}개밖에 못 찾았지만… 괜찮아! {name은} 3년 동안 정말 열심히 자랐는걸.` },
    { who: 'lulu', text: '왕관은 언젠가 또 찾으면 돼. 자, 이제 {name}의 미래를 볼까?' },
  ]);

  const id = evaluateEnding(s);
  const en = ENDINGS.find((e) => e.id === id);
  const isNew = !loadGallery().includes(id);
  addToGallery(id);
  clearSave();
  const e = effStats(s);

  const look = { outfit: en.outfit, hat: en.hat, weapon: id === 'hero' || id === 'knight' ? 'knight' : id === 'wizard' ? 'starwand' : null, acc: null };
  root.innerHTML = `${endingBg(en.scene)}
    <div class="petals">${Array.from({ length: 24 }, (_, i) => `<i style="left:${(i * 37) % 100}%;animation-duration:${6 + (i % 5)}s;animation-delay:${-(i % 7)}s">${['🌸', '✨', '💮', '⭐'][i % 4]}</i>`).join('')}</div>
    <div class="end-stage">
      ${id === 'peace' ? `<div class="end-friend wobble">${monster('grr')}</div>` : ''}
      <div class="end-girl2 breathe">${avatar(s, 'end', { equip: look, mood: 'joy' })}</div>
    </div>
    <div class="end-banner pop-in"><small>ENDING ${ENDINGS.indexOf(en) + 1}</small>${en.title}${isNew ? '<span class="new">NEW!</span>' : ''}</div>
    <div class="frame end-text">
      <p>${fillName(en.text, s.name)}</p>
      <div class="end-stats">${['vit', 'str', 'int', 'mgc', 'cha', 'gra'].map((k) => `<span>${STAT_NAMES[k]} <b>${e[k]}</b></span>`).join('')}
        <span>Lv <b>${s.level}</b></span><span>보석 <b>${s.gems.length}/4</b></span></div>
      <div class="end-btns"><button class="pill" data-act="gallery">📜 엔딩 도감</button><button class="pill sub" data-act="title">타이틀로</button></div>
    </div>`;
  sparkles(root, 16);
  sfx('fanfare');
  root.addEventListener('click', (ev) => {
    const act = ev.target.closest('[data-act]')?.dataset.act;
    if (!act) return;
    sfx('click');
    ctx.state = null;
    if (act === 'gallery') ctx.go('gallery', { back: 'title' });
    else ctx.go('title');
  });
}

