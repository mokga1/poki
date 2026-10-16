// localStorage 저장 (칸 4개). 깨진 데이터는 조용히 무시하고 null.
// 게임 상태의 s.slot(0~3) 칸에 저장한다. 엔딩 도감은 모든 칸이 함께 쓴다.
import { CHARACTERS } from './data/characters.js';
import { dateInfo, MAX_MONTH } from './rules.js';

export const SLOTS = 4;
const OLD_KEY = 'princess-save-v1'; // 칸이 생기기 전의 저장
const slotKey = (n) => `${OLD_KEY}-slot${n}`;
const GALLERY_KEY = 'princess-endings-v1';

export function parseSave(text) {
  try {
    const s = JSON.parse(text);
    if (!s || s.v !== 1 || !CHARACTERS[s.charId] || !Number.isInteger(s.month) || !s.stats || !s.equip) return null;
    return s;
  } catch {
    return null;
  }
}

const store = () => {
  try { return window.localStorage; } catch { return null; }
};
const read = (n) => {
  try { return parseSave(store()?.getItem(slotKey(n)) ?? null); } catch { return null; }
};

// 예전 한 칸 저장을 첫 빈 칸으로 옮긴다
function migrate() {
  try {
    const st = store();
    const old = parseSave(st?.getItem(OLD_KEY) ?? null);
    if (!old) return;
    for (let n = 0; n < SLOTS; n++) {
      if (!read(n)) {
        st.setItem(slotKey(n), JSON.stringify({ ...old, slot: n }));
        st.removeItem(OLD_KEY);
        return;
      }
    }
  } catch { /* 무시 */ }
}

export function listSlots() {
  migrate();
  return Array.from({ length: SLOTS }, (_, n) => read(n));
}
export function load(n) {
  migrate();
  const s = read(n);
  if (s) s.slot = n;
  return s;
}
export const hasSave = () => listSlots().some(Boolean);

export function save(s) {
  try { store()?.setItem(slotKey(s.slot ?? 0), JSON.stringify(s)); } catch { /* 저장 공간 없음: 무시 */ }
}
export function clearSave(n) {
  try { store()?.removeItem(slotKey(n)); } catch { /* 무시 */ }
}

// ---------- 저장 파일 (다른 기기·브라우저로 옮기기, 백업) ----------
export function exportSlot(n) {
  const s = read(n);
  if (!s) return null;
  return JSON.stringify({ app: 'princess', v: 1, savedAt: new Date().toISOString(), save: s, endings: loadGallery() });
}

// 저장 파일 내용을 n번 칸에 넣는다. 올바른 파일이 아니면 null (칸은 그대로)
export function importData(text, n) {
  try {
    const data = JSON.parse(text);
    if (!data || data.app !== 'princess') return null;
    const s = parseSave(JSON.stringify(data.save));
    if (!s) return null;
    s.slot = n;
    save(s);
    if (Array.isArray(data.endings)) data.endings.forEach((id) => typeof id === 'string' && addToGallery(id));
    return s;
  } catch {
    return null;
  }
}

export function backupFileName(s) {
  const d = dateInfo(Math.min(s.month, MAX_MONTH));
  const name = String(s.name).replace(/[\\/:*?"<>|\s]/g, '_');
  return `꼬마공주-${name}-${d.year}년차${d.mon}월.json`;
}

// 브라우저에 "이 사이트 저장을 함부로 지우지 말아줘" 요청 (지원 안 하면 조용히 넘어감)
export function requestPersist() {
  try { navigator.storage?.persist?.().catch(() => {}); } catch { /* 무시 */ }
}

export function loadGallery() {
  try {
    const a = JSON.parse(store()?.getItem(GALLERY_KEY) || '[]');
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}
export function addToGallery(id) {
  const g = loadGallery();
  if (!g.includes(id)) g.push(id);
  try { store()?.setItem(GALLERY_KEY, JSON.stringify(g)); } catch { /* 무시 */ }
}
