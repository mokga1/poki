// localStorage 저장 (칸 4개). 깨진 데이터는 조용히 무시하고 null.
// 게임 상태의 s.slot(0~3) 칸에 저장한다. 엔딩 도감은 모든 칸이 함께 쓴다.
import { CHARACTERS } from './data/characters.js';

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
