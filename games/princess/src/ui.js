// 공통 UI: 모달, 토스트, 숫자 팝업, 반짝이
import { STAT_NAMES } from './rules.js';

const overlay = () => document.getElementById('overlay');

// 모달을 띄우고, data-close="id" 를 가진 요소를 누르면 그 id 로 끝난다.
// onMount(el, close) 로 입력 검사 같은 직접 제어도 할 수 있다.
export function modal({ title = '', html = '', buttons = [], cls = '', onMount } = {}) {
  return new Promise((resolve) => {
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = `
      <div class="frame modal pop-in ${cls}">
        ${title ? `<div class="ribbon">${title}</div>` : ''}
        <div class="body">${html}</div>
        ${buttons.length ? `<div class="btns">${buttons.map((b) =>
          `<button class="pill ${b.kind || ''}" data-close="${b.id}">${b.label}</button>`).join('')}</div>` : ''}
      </div>`;
    const close = (id) => { back.remove(); resolve(id); };
    back.addEventListener('click', (e) => {
      const t = e.target.closest('[data-close]');
      if (t && !t.classList.contains('off')) close(t.dataset.close);
    });
    overlay().appendChild(back);
    onMount?.(back.querySelector('.modal'), close);
  });
}

let toastTimer = null;
export function toast(text) {
  const el = document.getElementById('toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// 능력치 변화를 "+6 힘!" 숫자로 차례로 띄운다.
export function popNumbers(anchor, changes) {
  const r = anchor.getBoundingClientRect();
  const entries = Object.entries(changes);
  entries.forEach(([k, v], i) => {
    setTimeout(() => {
      const n = document.createElement('div');
      n.className = 'num-pop';
      const label = k === 'gold' ? 'G' : ` ${STAT_NAMES[k]}`;
      n.textContent = `${v > 0 ? '+' : ''}${v}${label}`;
      if (v < 0) n.style.setProperty('--o', '#7a8bb5');
      if (k === 'gold') n.style.setProperty('--o', '#d39a12');
      n.style.left = `${r.left + r.width / 2 - 50 + (i % 2 ? 40 : -40)}px`;
      n.style.top = `${r.top + r.height * 0.3}px`;
      document.getElementById('app').appendChild(n);
      setTimeout(() => n.remove(), 1500);
    }, i * 260);
  });
}

export function sparkles(container, n = 14) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = i % 3 ? '✦' : '✧';
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${8 + Math.random() * 84}%`;
    s.style.fontSize = `${10 + Math.random() * 16}px`;
    s.style.animationDelay = `${Math.random() * 2.4}s`;
    container.appendChild(s);
  }
}

// 받침에 맞는 조사: josa('루비', '이') → '루비가', josa('하랑', '이') → '하랑이'
const JOSA = { 이: ['이', '가'], 은: ['은', '는'], 을: ['을', '를'], 과: ['과', '와'], 아: ['아', '야'], 이랑: ['이랑', '랑'], 이에요: ['이에요', '예요'] };
export function josa(word, key) {
  const c = word.charCodeAt(word.length - 1);
  const batchim = c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
  return word + JOSA[key][batchim ? 0 : 1];
}
// "{name}의 꿈" / "{name이} 웃었어요" 처럼 이름과 조사를 채운다. 이름은 HTML 안전하게 바꾼다.
export function fillName(text, name) {
  return text.replace(/\{name(이랑|이에요|이|은|을|과|아)?\}/g, (_, k) => esc(k ? josa(name, k) : name));
}

export const wait =(ms) => new Promise((r) => setTimeout(r, ms));
export const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
