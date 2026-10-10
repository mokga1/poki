// 메인 화면: 공주의 방
import { room, particles } from '../art/scenes.js';
import { avatar } from '../art/avatar.js';
import { LULU } from '../art/npcs.js';
import { dateInfo, effStats, STAT_NAMES, MAX_MONTH } from '../rules.js';
import { REGIONS, GEM_INFO } from '../data/regions.js';
import { sparkles, esc } from '../ui.js';
import { sfx, music, toggleMute, isMuted } from '../sound.js';

const STAT_STYLE = {
  vit: ['❤️', '#ff7f9e', '#ffb8c9'], str: ['💪', '#ff8a4c', '#ffc39b'], int: ['📖', '#4c9dff', '#a8d1ff'], mgc: ['🔮', '#9b6cff', '#cfbaff'],
  cha: ['🌸', '#f05ba7', '#ffb3d8'], gra: ['👑', '#e3a51a', '#ffe08a'], fat: ['💤', '#9aa3b5', '#d6dbe6'],
};
const SEASON_ICON = { spring: '🌸', summer: '🌻', autumn: '🍁', winter: '⛄' };

const MENU = [
  { id: 'study', icon: '📚', label: '공부', c: ['#8fc8ff', '#5b9cf0', '#3f78c8'] },
  { id: 'job', icon: '🧁', label: '아르바이트', c: ['#ffcf7a', '#f5a63b', '#c97f1c'] },
  { id: 'rest', icon: '🛏️', label: '휴식', c: ['#b6ecc2', '#6fcf8a', '#3fa45f'] },
  { id: 'adventure', icon: '⚔️', label: '무사수행', c: ['#ff9cc7', '#ec4f94', '#c33a78'] },
  { id: 'shop', icon: '🛍️', label: '상점', c: ['#d7c1ff', '#a483f5', '#7a5ad0'] },
  { id: 'equip', icon: '🎀', label: '장비', c: ['#ffb6a8', '#f57f6c', '#c95a49'] },
  { id: 'talk', icon: '🧚', label: '루루와 대화', c: ['#a8eef0', '#4fc8d0', '#2f9ea6'] },
  { id: 'gallery', icon: '📜', label: '엔딩 도감', c: ['#ffe28a', '#f2c230', '#c49512'] },
];

// 보스 권장 레벨
const BOSS_LEVEL = { forest: 4, cave: 7, ice: 10, tower: 12 };

export function luluAdvice(s) {
  const { season } = dateInfo(s.month);
  const left = MAX_MONTH - s.month + 1;
  const nextRegion = REGIONS.find((r) => !s.gems.includes(r.gem) && r.need(s));
  if (s.stats.fat >= 60) return '요즘 많이 <b>피곤해</b> 보여요… 이번 달은 푹 쉬는 게 어때요? 🛏️';
  if (s.gold < 40) return '지갑이 텅텅 비었어요! <b>아르바이트</b>로 돈을 모아볼까요? 🪙';
  if (s.month === 1) return '봄이 왔어요! 🌷 먼저 <b>공부</b>로 실력을 키우고, 준비가 되면 <b>모험</b>도 떠나봐요!';
  if (left <= 6) return `별빛 축제까지 <b>${left}달</b> 남았어요! ${s.gems.length < 4 ? `보석은 ${s.gems.length}개… 조금만 더 힘내요!` : '보석도 다 모았어요! 마음껏 꾸며봐요 ✨'}`;
  if (nextRegion && s.level >= BOSS_LEVEL[nextRegion.id]) return `지금이라면 <b>${nextRegion.name}</b>의 보스도 이길 수 있을 것 같아요! ⚔️`;
  if (nextRegion && s.month % 3 === 0) return `<b>${nextRegion.name}</b>의 보스는 레벨 ${BOSS_LEVEL[nextRegion.id]}쯤이면 이길 수 있어요. 모험으로 레벨을 올려봐요!`;
  return {
    spring: '꽃이 활짝 피었어요! 이번 달엔 <b>무엇을</b> 할까요?',
    summer: '햇살이 쨍쨍! <b>모험</b>하기 딱 좋은 날씨예요.',
    autumn: '가을엔 <b>수확제</b>가 열려요! 실력을 뽐내봐요.',
    winter: '눈이 소복소복… 따뜻하게 <b>공부</b>하는 건 어때요?',
  }[season];
}

export function gemStars(s) {
  return Object.entries(GEM_INFO).map(([k, g]) => {
    const has = s.gems.includes(k);
    return `<svg viewBox="0 0 24 24" title="${g.name}"><path d="M12 1.5l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.6l-6.4 3.5 1.4-7.1-5.3-5 7.2-.9z" fill="${has ? g.color : '#f3e6ee'}" stroke="${has ? '#fff' : '#e3c6d6'}" stroke-width="1.5"/></svg>`;
  }).join('');
}

export function render(root, ctx) {
  const s = ctx.state;
  const d = dateInfo(s.month);
  const eff = effStats(s);
  music('home');

  root.innerHTML = `${room(d.season)}${particles(d.season)}
    <div class="topbar">
      <button class="home" data-act="title">← 타이틀</button>
      <span class="logo">👑 꼬마 공주 키우기</span>
      <span class="spacer"></span>
      <span class="chip">${SEASON_ICON[d.season]} ${d.year}년차 ${d.mon}월 · ${d.age}살</span>
      <span class="chip gems" title="별 보석">${gemStars(s)}</span>
      <span class="chip gold">🪙 ${s.gold} G</span>
      <button class="chip" data-act="mute">${isMuted() ? '🔇' : '🔊'}</button>
    </div>
    <div class="stage">
      <div class="glow"></div>
      <div class="avatar-wrap breathe">${avatar(s, 'home')}</div>
      <div class="nameplate">✦ ${esc(s.name)} 공주 ✦<small>Lv.${s.level}</small></div>
      <div class="fairy float" data-act="talk">${LULU}</div>
      <div class="bubble">${luluAdvice(s)}</div>
    </div>
    <div class="side">
      <div class="frame stats">
        <div class="ribbon">공주의 능력치</div>
        ${['vit', 'str', 'int', 'mgc', 'cha', 'gra', 'fat'].map((k) => {
          const [ic, c, c2] = STAT_STYLE[k];
          const bonus = eff[k] - s.stats[k];
          return `<div class="stat" style="--c:${c};--c2:${c2}"><span class="ic">${ic}</span>${STAT_NAMES[k]}
            <div class="bar"><i style="width:${Math.min(100, eff[k])}%"></i></div>
            <span class="num">${s.stats[k]}${bonus ? `<em>+${bonus}</em>` : ''}</span></div>`;
        }).join('')}
      </div>
      <div class="frame menu">
        <div class="ribbon">이번 달 할 일</div>
        ${MENU.map((m) => `<button class="mbtn" data-act="${m.id}" style="--a:${m.c[0]};--b:${m.c[1]};--s:${m.c[2]}"><span class="e">${m.icon}</span>${m.label}</button>`).join('')}
      </div>
    </div>`;
  sparkles(root.querySelector('.stage'), 10);

  root.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (!act) return;
    sfx('click');
    if (act === 'title') { ctx.save(); ctx.go('title'); return; }
    if (act === 'mute') { e.target.closest('button').textContent = toggleMute() ? '🔇' : '🔊'; return; }
    ctx.action(act);
  });
}
