// 턴제 전투: 공격 / 마법 / 물약 / 도망
import { regionBg } from '../art/regionScenes.js';
import { avatar } from '../art/avatar.js';
import { monster } from '../art/monsters.js';
import { ENEMIES } from '../data/enemies.js';
import { ITEMS } from '../data/items.js';
import { GEM_INFO } from '../data/regions.js';
import { battleStats, effStats, damage, gainExp } from '../rules.js';
import { wait, esc, josa } from '../ui.js';
import { sfx, music } from '../sound.js';

const SPELLS = [
  { id: 'fire', name: '불꽃', icon: '🔥', mp: 5, desc: '마법 공격' },
  { id: 'heal', name: '치유', icon: '💚', mp: 6, desc: 'HP 회복' },
  { id: 'star', name: '반짝 별', icon: '🌟', mp: 10, desc: '강한 마법 (마력 40)', need: 40 },
];

// params: { enemyId, region, done(result, info) }  result = 'win' | 'lose' | 'flee'
export function render(root, ctx, { enemyId, region, done }) {
  const s = ctx.state;
  const e = { ...ENEMIES[enemyId] };
  e.maxHp = e.hp;
  let busy = false;
  let turn = 0;
  music(e.boss ? 'boss' : 'battle');

  root.innerHTML = `${regionBg(region)}
    <div class="topbar">
      <span class="logo">${e.boss ? '👑 보스 전투!' : '⚔️ 전투!'}</span>
      <span class="spacer"></span>
      <span class="chip" data-pots></span>
    </div>
    <div class="frame bt-hp me"><div class="nm"><span>${esc(s.name)}</span><span class="lv">Lv.${s.level}</span></div>
      <div class="hpbar"><i data-hhp></i></div><div class="sm" data-hhpt></div>
      <div class="hpbar mp"><i data-hmp></i></div><div class="sm" data-hmpt></div></div>
    <div class="frame bt-hp en"><div class="nm"><span>${e.name}</span>${e.boss ? '<span class="lv boss">BOSS</span>' : ''}</div>
      <div class="hpbar en"><i data-ehp></i></div><div class="sm" data-ehpt></div></div>
    <div class="hero-b float" data-hero>${avatar(s, 'bt')}</div>
    <div class="enemy ${e.boss ? 'boss' : ''}" data-enemy><div class="squish">${monster(enemyId)}</div></div>
    <div class="fx" data-fx></div>
    <div class="bt-bottom">
      <div class="frame msg"><span data-msg></span></div>
      <div class="cmds" data-cmds></div>
    </div>`;

  const $ = (q) => root.querySelector(q);
  const heroEl = $('[data-hero]'), enemyEl = $('[data-enemy]'), fx = $('[data-fx]');

  const say = (html) => { const m = $('[data-msg]'); m.innerHTML = html; m.classList.remove('pop-in'); void m.offsetWidth; m.classList.add('pop-in'); };
  const refresh = () => {
    const bs = battleStats(s);
    $('[data-hhp]').style.width = `${(s.hp / bs.maxHp) * 100}%`;
    $('[data-hmp]').style.width = `${(s.mp / bs.maxMp) * 100}%`;
    $('[data-ehp]').style.width = `${(Math.max(0, e.hp) / e.maxHp) * 100}%`;
    $('[data-hhpt]').textContent = `HP ${s.hp} / ${bs.maxHp}`;
    $('[data-hmpt]').textContent = `MP ${s.mp} / ${bs.maxMp}`;
    $('[data-ehpt]').textContent = `HP ${Math.max(0, e.hp)} / ${e.maxHp}`;
    $('[data-pots]').textContent = `🧪 ${s.potions.potion || 0} · 🍬 ${s.potions.ether || 0} · 💖 ${s.potions.bigpotion || 0}`;
  };
  const heroFace = (mood) => { heroEl.innerHTML = avatar(s, 'bt', { mood }); };
  const anim = (el, cls, ms) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); return wait(ms); };
  const pop = (target, text, color) => {
    const r = target.getBoundingClientRect(), rr = root.getBoundingClientRect();
    const n = document.createElement('div');
    n.className = 'dmg-pop';
    n.textContent = text;
    if (color) n.style.setProperty('--o', color);
    n.style.left = `${r.left - rr.left + r.width / 2}px`;
    n.style.top = `${r.top - rr.top + r.height * 0.2}px`;
    fx.appendChild(n);
    setTimeout(() => n.remove(), 1300);
  };
  const burst = (target, chars, n = 10) => {
    const r = target.getBoundingClientRect(), rr = root.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'burst';
      p.textContent = chars[i % chars.length];
      const a = (i / n) * Math.PI * 2;
      p.style.left = `${r.left - rr.left + r.width / 2}px`;
      p.style.top = `${r.top - rr.top + r.height / 2}px`;
      p.style.setProperty('--tx', `${Math.cos(a) * (60 + Math.random() * 50)}px`);
      p.style.setProperty('--ty', `${Math.sin(a) * (60 + Math.random() * 50)}px`);
      fx.appendChild(p);
      setTimeout(() => p.remove(), 900);
    }
  };

  // ---------- 명령 버튼 ----------
  const showCmds = (mode) => {
    const box = $('[data-cmds]');
    box.className = `cmds ${mode === 'main' ? '' : 'sub'}`;
    if (!mode) { box.innerHTML = ''; return; }
    if (mode === 'main') {
      box.innerHTML = `
        <button class="mbtn" data-cmd="attack" style="--a:#ffa6a6;--b:#f0606e;--s:#c2414f"><span class="e">⚔️</span>공격</button>
        <button class="mbtn" data-cmd="magic" style="--a:#d7c1ff;--b:#9b6cff;--s:#7450d6"><span class="e">✨</span>마법</button>
        <button class="mbtn" data-cmd="items" style="--a:#b6ecc2;--b:#55c47a;--s:#3a9c58"><span class="e">🧪</span>물약</button>
        <button class="mbtn ${e.boss ? 'off' : ''}" data-cmd="flee" style="--a:#e2e6ee;--b:#aab3c4;--s:#7f889a"><span class="e">💨</span>도망</button>`;
      return;
    }
    const back = '<button class="mbtn" data-cmd="back" style="--a:#fff;--b:#ffe6f1;--s:#f2b5d0;color:#c0508c;text-shadow:none"><span class="e">↩️</span>뒤로</button>';
    if (mode === 'magic') {
      const mg = effStats(s).mgc;
      box.innerHTML = SPELLS.map((sp) => {
        const locked = sp.need && mg < sp.need;
        const off = locked || s.mp < sp.mp;
        return `<button class="mbtn ${off ? 'off' : ''}" data-spell="${sp.id}" style="--a:#d7c1ff;--b:#9b6cff;--s:#7450d6"><span class="e">${locked ? '🔒' : sp.icon}</span>${sp.name}<small>${locked ? `마력 ${sp.need} 필요` : `MP ${sp.mp}`}</small></button>`;
      }).join('') + back;
    } else {
      box.innerHTML = ['potion', 'ether', 'bigpotion'].map((id) => {
        const n = s.potions[id] || 0;
        return `<button class="mbtn ${n ? '' : 'off'}" data-use="${id}" style="--a:#b6ecc2;--b:#55c47a;--s:#3a9c58"><span class="e">${{ potion: '🧪', ether: '🍬', bigpotion: '💖' }[id]}</span>${ITEMS[id].name}<small>×${n}</small></button>`;
      }).join('') + back;
    }
  };

  // ---------- 행동 ----------
  const hitEnemy = async (r, label) => {
    e.hp -= r.dmg;
    sfx(r.crit ? 'crit' : 'hit');
    anim(enemyEl, 'hit', 500);
    pop(enemyEl, `${r.dmg}${r.crit ? '!' : ''}`, r.crit ? '#ff9f1a' : null);
    refresh();
    say(`${label} <b>${e.name}</b>에게 <b>${r.dmg}</b> 데미지!${r.crit ? ' <b>크리티컬!</b> ✨' : ''}`);
    await wait(900);
  };

  const enemyTurn = async () => {
    turn += 1;
    const strong = e.boss && turn % 3 === 0;
    const bs = battleStats(s);
    const r = damage(Math.round(e.atk * (strong ? 1.4 : 1)), bs.def);
    say(`<b>${e.name}</b>의 ${strong ? '<b>필살</b> ' : ''}${e.skill}!${strong ? '!' : ''}`);
    await anim(enemyEl, 'lunge-l', 450);
    s.hp = Math.max(0, s.hp - r.dmg);
    sfx('hurt');
    heroFace('hurt');
    anim(heroEl, 'shake', 400);
    if (strong) anim(root, 'shake', 400);
    pop(heroEl, `-${r.dmg}`, '#7a8bb5');
    refresh();
    say(`<b>${esc(s.name)}</b>에게 <b>${r.dmg}</b> 데미지…${r.crit ? ' 아야야!' : ''}`);
    await wait(800);
    if (s.hp > 0) heroFace('smile');
  };

  const act = async (fn) => {
    if (busy) return;
    busy = true;
    showCmds(null);
    const result = await fn();
    if (result === 'skip') { busy = false; showCmds('main'); return; }
    if (e.hp <= 0) return win();
    if (result === 'fled') return;
    await wait(250);
    await enemyTurn();
    if (s.hp <= 0) return lose();
    busy = false;
    say('어떻게 할까요?');
    showCmds('main');
  };

  const attack = async () => {
    sfx('swing');
    await anim(heroEl, 'lunge-r', 420);
    await hitEnemy(damage(battleStats(s).atk, e.def), `<b>${esc(s.name)}</b>의 공격!`);
  };

  const cast = async (sp) => {
    const bs = battleStats(s);
    s.mp -= sp.mp;
    refresh();
    sfx('magic');
    if (sp.id === 'heal') {
      const amount = Math.round(bs.matk * 1.2) + 10;
      s.hp = Math.min(bs.maxHp, s.hp + amount);
      burst(heroEl, ['💚', '✦', '♡'], 10);
      pop(heroEl, `+${amount}`, '#2fa866');
      refresh();
      say(`치유 마법! HP가 <b>${amount}</b> 회복됐어요 💚`);
      await wait(900);
      return;
    }
    await anim(heroEl, 'cast', 400);
    burst(enemyEl, sp.id === 'fire' ? ['🔥', '✦'] : ['🌟', '✦', '✧'], sp.id === 'fire' ? 10 : 16);
    await wait(250);
    await hitEnemy(damage(Math.round(bs.matk * (sp.id === 'fire' ? 1.5 : 2.5)), e.def), `${sp.icon} <b>${sp.name}</b> 마법!`);
  };

  const use = async (id) => {
    const it = ITEMS[id], bs = battleStats(s);
    s.potions[id] -= 1;
    sfx('heal');
    if (it.heal) {
      const before = s.hp;
      s.hp = Math.min(bs.maxHp, s.hp + it.heal);
      pop(heroEl, `+${s.hp - before}`, '#2fa866');
      say(`${josa(it.name, '을')} 마셨어요! HP <b>+${s.hp - before}</b>`);
    } else {
      const before = s.mp;
      s.mp = Math.min(bs.maxMp, s.mp + it.mana);
      pop(heroEl, `+${s.mp - before}`, '#7a6cf0');
      say(`마나 사탕을 먹었어요! MP <b>+${s.mp - before}</b>`);
    }
    burst(heroEl, ['♡', '✦'], 8);
    refresh();
    await wait(900);
  };

  const flee = async () => {
    if (e.boss) { say('보스에게서는 도망칠 수 없어요!'); return 'skip'; }
    sfx('click');
    if (Math.random() < battleStats(s).flee) {
      say('후다닥! 무사히 도망쳤어요 💨');
      await anim(heroEl, 'run-away', 700);
      finish('flee');
      return 'fled';
    }
    say('앗, 도망치지 못했어요!');
    await wait(800);
    return null;
  };

  // ---------- 끝 ----------
  const finishPanel = (html, label, cb) => {
    const box = $('[data-cmds]');
    box.className = 'cmds sub';
    box.innerHTML = `<button class="mbtn" data-end style="--a:#ffe28a;--b:#f2c230;--s:#c49512"><span class="e">➡️</span>${label}</button>`;
    say(html);
    box.querySelector('[data-end]').addEventListener('click', () => { sfx('click'); cb(); }, { once: true });
  };
  let finished = false;
  const finish = (result, info = {}) => { if (finished) return; finished = true; done(result, info); };

  const win = async () => {
    await anim(enemyEl, 'defeat', 700);
    enemyEl.style.visibility = 'hidden';
    const bs = battleStats(s);
    const gold = Math.round(e.gold * bs.goldRate);
    s.gold += gold;
    s.wins += 1;
    const ups = gainExp(s, e.exp);
    const lines = [`🎉 <b>승리!</b> 경험치 <b>+${e.exp}</b> · 돈 <b>+${gold} G</b>`];
    const info = { exp: e.exp, gold, gem: null, drop: null };
    if (ups) {
      const nb = battleStats(s);
      s.hp = nb.maxHp; s.mp = nb.maxMp;
      lines.push(`⬆️ 레벨 업! <b>Lv.${s.level}</b> (HP·MP 회복)`);
    }
    if (e.boss && !s.gems.includes(e.gem)) {
      s.gems.push(e.gem);
      info.gem = e.gem;
      lines.push(`⭐ <b>${josa(GEM_INFO[e.gem].name, '을')}</b> 되찾았어요!`);
      if (e.drop) {
        if (!s.owned.includes(e.drop)) { s.owned.push(e.drop); info.drop = e.drop; lines.push(`🎁 <b>${josa(ITEMS[e.drop].name, '을')}</b> 받았어요!`); }
      }
    }
    heroFace('joy');
    sfx(ups ? 'levelup' : 'win');
    refresh();
    finishPanel(lines.join('<br>'), '계속', () => finish('win', info));
  };

  const lose = async () => {
    heroFace('hurt');
    sfx('lose');
    await anim(heroEl, 'faint', 700);
    finishPanel(`앗… <b>${esc(josa(s.name, '이'))}</b> 쓰러지고 말았어요…`, '계속', () => finish('lose'));
  };

  // ---------- 입력 ----------
  root.addEventListener('click', (ev) => {
    const t = ev.target.closest('button');
    if (!t || busy && !t.dataset.end) return;
    if (t.classList.contains('off') && !t.dataset.cmd) return;
    const { cmd, spell, use: useId } = t.dataset;
    if (cmd === 'attack') act(attack);
    else if (cmd === 'magic') { sfx('click'); showCmds('magic'); }
    else if (cmd === 'items') { sfx('click'); showCmds('items'); }
    else if (cmd === 'back') { sfx('click'); showCmds('main'); }
    else if (cmd === 'flee') act(flee);
    else if (spell && !t.classList.contains('off')) act(() => cast(SPELLS.find((x) => x.id === spell)));
    else if (useId && !t.classList.contains('off')) act(() => use(useId));
  });

  refresh();
  if (e.boss) {
    anim(root, 'shake', 500);
    say(`👑 보스 <b>${josa(e.name, '이')}</b> 나타났다!`);
  } else {
    say(`앗! <b>${josa(e.name, '이')}</b> 나타났다!`);
  }
  showCmds('main');
}
