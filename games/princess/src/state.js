// localStorage 저장. 깨진 데이터는 조용히 무시하고 null.
import { CHARACTERS } from './data/characters.js';

const SAVE_KEY = 'princess-save-v1';
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

export function save(s) {
  try { store()?.setItem(SAVE_KEY, JSON.stringify(s)); } catch { /* 저장 공간 없음: 무시 */ }
}
export function load() {
  try { return parseSave(store()?.getItem(SAVE_KEY) ?? null); } catch { return null; }
}
export const hasSave = () => load() !== null;
export function clearSave() {
  try { store()?.removeItem(SAVE_KEY); } catch { /* 무시 */ }
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
