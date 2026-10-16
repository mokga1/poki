// 저장 칸 고르기 (4칸). mode: 'new' = 새로 시작할 칸, 'continue' = 이어할 칸
import { selectBg } from '../art/scenes.js';
import { avatar } from '../art/avatar.js';
import { SLOTS, listSlots, load, clearSave, exportSlot, importData, backupFileName } from '../state.js';
import { dateInfo, MAX_MONTH } from '../rules.js';
import { gemStars } from './home.js';
import { modal, toast, sparkles, esc } from '../ui.js';
import { sfx } from '../sound.js';

export function render(root, ctx, { mode = 'continue' } = {}) {
  const slots = listSlots();
  root.innerHTML = `${selectBg()}
    <button class="home title-back" data-back>← 처음으로</button>
    <div class="select-title">${mode === 'new' ? '어느 칸에 새 공주님을 키울까요?' : '어느 공주님과 이어서 할까요?'}</div>
    <div class="select-sub">저장 칸은 ${SLOTS}개예요. 칸마다 다른 공주님을 키울 수 있어요 ♡</div>
    <div class="slots-row">${slots.map((s, n) => {
      if (!s) {
        return `<button class="slot-card empty ${mode === 'continue' ? 'off' : ''}" data-slot="${n}">
          <span class="sno">${n + 1}</span><span class="plus">+</span><span class="sname">빈 칸</span>
          <span class="sinfo">${mode === 'new' ? '여기서 시작!' : ''}</span></button>`;
      }
      const d = dateInfo(Math.min(s.month, MAX_MONTH));
      return `<button class="slot-card" data-slot="${n}">
        <span class="sno">${n + 1}</span><span class="sexp" data-exp="${n}" title="저장 파일로 받기">💾</span><span class="sdel" data-del="${n}" title="지우기">🗑️</span>
        <div class="spic">${avatar(s, `sl${n}`)}</div>
        <span class="sname">${esc(s.name)} 공주</span>
        <span class="sinfo">${s.month > MAX_MONTH ? '🎆 별빛 축제' : `${d.year}년차 ${d.mon}월`} · Lv.${s.level}</span>
        <span class="sgems">${gemStars(s)}</span></button>`;
    }).join('')}</div>
    <div class="backup-bar">
      <button class="pill sub" data-import>📂 저장 파일 불러오기</button>
      <span>다른 기기나 브라우저로 옮길 때는 💾 버튼으로 저장 파일을 받아두세요</span>
      <input type="file" accept=".json,application/json" hidden>
    </div>`;
  sparkles(root, 12);

  const fileInput = root.querySelector('input[type=file]');
  fileInput.addEventListener('change', () => importFile(ctx, fileInput.files[0], slots, mode));

  root.addEventListener('click', async (e) => {
    if (e.target.closest('[data-back]')) { sfx('click'); ctx.go('title'); return; }
    if (e.target.closest('[data-import]')) { sfx('click'); fileInput.value = ''; fileInput.click(); return; }
    const exp = e.target.closest('[data-exp]');
    if (exp) { sfx('coin'); downloadSlot(Number(exp.dataset.exp)); return; }
    const del = e.target.closest('[data-del]');
    if (del) {
      const n = Number(del.dataset.del);
      sfx('click');
      const ok = await modal({
        title: '이 칸을 지울까요?',
        html: `<b>${esc(slots[n].name)} 공주님</b>의 기록이 지워져요.<br>(엔딩 도감은 그대로 남아요)`,
        buttons: [{ id: 'yes', label: '지우기' }, { id: 'no', label: '취소', kind: 'sub' }],
      });
      if (ok === 'yes') { clearSave(n); ctx.go('slots', { mode }); }
      return;
    }
    const card = e.target.closest('[data-slot]');
    if (!card) return;
    const n = Number(card.dataset.slot);
    sfx('click');
    if (mode === 'continue') {
      if (!slots[n]) { toast('빈 칸이에요'); return; }
      ctx.state = load(n);
      ctx.go(ctx.state.month > MAX_MONTH ? 'ending' : 'home');
      return;
    }
    if (slots[n]) {
      const ok = await modal({
        title: '이 칸에 새로 시작할까요?',
        html: `지금 이 칸의 <b>${esc(slots[n].name)} 공주님</b> 기록이 지워져요.`,
        buttons: [{ id: 'yes', label: '새로 시작' }, { id: 'no', label: '취소', kind: 'sub' }],
      });
      if (ok !== 'yes') return;
      clearSave(n);
    }
    ctx.go('select', { slot: n });
  });
}

// n번 칸을 파일로 내려받기
function downloadSlot(n) {
  const text = exportSlot(n);
  if (!text) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  a.download = backupFileName(JSON.parse(text).save);
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  toast('💾 저장 파일을 받았어요! (다운로드 폴더를 확인하세요)');
}

// 저장 파일을 골라 어느 칸에 넣을지 묻고 불러오기
async function importFile(ctx, file, slots, mode) {
  if (!file) return;
  const text = await file.text();
  const pick = await modal({
    title: '어느 칸에 불러올까요?',
    html: `<div class="import-slots">${slots.map((s, n) => `<button class="pill ${s ? 'sub' : ''}" data-close="${n}">${n + 1}번 칸 · ${s ? `${esc(s.name)} 공주 (덮어쓰기)` : '빈 칸'}</button>`).join('')}</div>`,
    buttons: [{ id: 'cancel', label: '취소', kind: 'sub' }],
  });
  if (pick === 'cancel' || pick == null) return;
  const n = Number(pick);
  if (slots[n]) {
    const ok = await modal({
      title: '덮어쓸까요?',
      html: `${n + 1}번 칸의 <b>${esc(slots[n].name)} 공주님</b> 기록 위에 불러와요.`,
      buttons: [{ id: 'yes', label: '덮어쓰기' }, { id: 'no', label: '취소', kind: 'sub' }],
    });
    if (ok !== 'yes') return;
  }
  const s = importData(text, n);
  if (!s) {
    await modal({ title: '불러올 수 없어요', html: '이 파일은 꼬마 공주 키우기 저장 파일이 아니거나 망가졌어요.', buttons: [{ id: 'ok', label: '확인' }] });
    return;
  }
  sfx('chest');
  toast(`📂 ${s.name} 공주님을 ${n + 1}번 칸에 불러왔어요!`);
  ctx.go('slots', { mode: mode === 'new' ? 'continue' : mode });
}
