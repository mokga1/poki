# 꼬마 공주 키우기 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 프린세스메이커풍 키우기 + 턴제 전투 RPG를 `games/princess/`에 추가하고 허브에 연결한다.

**Architecture:** 빌드 없는 ES 모듈 정적 웹앱. 순수 규칙(`rules.js`)·데이터(`data/`)·그림(`art/`, SVG 문자열 생성 함수)·화면(`screens/`)을 분리한다.
화면 전환은 `main.js`의 작은 라우터가 담당하고, 대화/결과 연출은 `await` 가능한 Promise 기반 오버레이로 만들어 한 달 흐름을 직선 코드로 쓴다.
규칙은 Node 내장 테스트로, 그림·연출은 브라우저(정적 서버 `static`, 포트 8002)로 확인한다.

**Tech Stack:** HTML/CSS/JS(ES2022 모듈), 인라인 SVG, Web Audio API, localStorage, Google Fonts(Jua, Gowun Dodum), Node 22 `node --test`.

**Spec:** `docs/superpowers/specs/2026-10-10-princess-raising-design.md` · 시안: `docs/superpowers/mockups/princess-mockup.html`

## Global Constraints

- 한국어 UI, 아이(글 잘 읽음) 대상. 무섭거나 어른스러운 내용 금지. 패배해도 돈·아이템을 잃지 않는다.
- 외부 이미지/오디오 파일 없음. 그림은 전부 코드 SVG, 소리는 Web Audio.
- 시안(`princess-mockup.html`)의 그림체·색·프레임/리본/버튼 스타일을 그대로 따른다. 공주 SVG는 viewBox `0 0 300 420`.
- 능력치 키: `vit`(체력) `str`(힘) `int`(지능) `mgc`(마력) `cha`(매력) `gra`(기품) `fat`(피로). 범위 0~100.
- 기간 36달. 1달째 = 1년차 3월, 12살. 시작 돈 200G. 시작 능력치 각 15 + 캐릭터 보너스(+10 두 개), 피로 0.
- 저장 키: `princess-save-v1`(진행), `princess-endings-v1`(도감, 새 게임에도 유지).
- PC·태블릿 가로 화면 기준(최소 1024×640에서 잘리지 않음). 터치 클릭 동작.
- 커밋 메시지 끝에 `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **깨진/옛 저장 데이터** — localStorage에 이상한 값이 있으면 타이틀에서 '이어하기'가 안 보이고 오류 없이 새로 시작 가능해야 함 → Task 2 `parseSave` 테스트.
2. **돈 부족** — 돈이 모자란 공부·물건은 고를 수 없고, 돈은 절대 음수가 되지 않음 → Task 1 `canAfford`/`buy`/`addStats` 테스트.
3. **피로 100 → 병** — 다음 달 강제 휴식 후 피로 30, 그 달도 정상적으로 지나감 → Task 1 `applyActivity`/`recover` 테스트.
4. **장비 해제 시 HP/MP 초과** — 최대HP 보너스 장비를 벗으면 현재 HP가 새 최대치로 줄어야 함 → Task 1 `unequip` 테스트.
5. **36달째 끝** — 37달째 화면이 나오지 않고 바로 엔딩으로 감 → Task 1 `advanceMonth` 테스트.

---

## 파일 구조

```
games/princess/
  index.html  style.css
  src/
    main.js      라우터·공통 컨텍스트
    rules.js     순수 규칙 (테스트 대상)
    state.js     localStorage 저장/불러오기/도감 + parseSave(순수)
    ui.js        모달·토스트·숫자 팝업·반짝이
    sound.js     BGM(home/adventure/battle/boss/ending) + SFX
    data/ characters.js items.js activities.js enemies.js regions.js events.js endings.js
    art/  avatar.js npcs.js monsters.js scenes.js
    screens/ title.js select.js home.js activity.js dialogue.js shop.js equip.js adventure.js battle.js ending.js gallery.js
tests/princess/ rules.test.js state.test.js balance.test.js
```

화면 모듈 공통 인터페이스: `export function render(root, ctx)` — `root`는 비워진 `#screen` 요소, `ctx = { state, go(name, params), save(), sound }`.
오버레이 인터페이스(Promise): `dialogue(scenes) → Promise<number|null>`(고른 선택지 번호), `modal(html, buttons) → Promise<string>`.

---

### Task 1: 데이터 + 순수 규칙 + 테스트

**Files:**
- Create: `games/princess/src/data/characters.js`, `items.js`, `activities.js`, `enemies.js`, `regions.js`, `endings.js`
- Create: `games/princess/src/rules.js`
- Test: `tests/princess/rules.test.js`

**Interfaces (Produces):**
- `CHARACTERS[id] = { id, name, trait, tags[], bonus{stat:n}, hair[2], hairHi, eye[2], dress[2], style:'pony'|'long'|'twin'|'bob', k, k2, t, intro }` (ids: ruby, sapphire, rose, emerald — 색은 시안 값)
- `ITEMS[id] = { id, slot:'weapon'|'outfit'|'hat'|'acc'|'use', name, price, desc, bonus{atk,matk,def,maxHp,maxMp,flee,goldRate,vit..gra}, heal?, mana?, shop:'normal'|'special'|null }`
  - weapon: wood, knight, starwand, rainbow(special), heartsword(boss)
  - outfit: apron(기본, price 0), knightdress, robe, ballgown, stardress(boss)
  - hat: flower, witch, silver, tiara · acc: necklace, cape, clover, wings(special)
  - use: potion(heal 30), ether(mana 15), bigpotion(heal 999, special)
- `ACTIVITIES[id] = { id, cat:'study'|'job'|'rest', name, icon, cost, income, gain{stat:n}, line }` — 스펙 표 그대로 (sword, magic, manners, school, dance, bakery, florist, library, cleaning, hunter, rest, picnic)
- `ENEMIES[id] = { id, name, hp, atk, def, exp, gold, boss?, gem?, drop? }` · `REGIONS = [{ id, name, enemies[], boss, gem, need(state)→bool, steps:6 }]`
- `ENDINGS = [{ id, title, text, scene, hint, cond(eff, state)→bool }]` (스펙 표 순서, 마지막 `normal`은 항상 true)
- `rules.js`: `STATS, STAT_NAMES, MAX_MONTH, clamp, newGame(charId, name), equipBonus(s), effStats(s), battleStats(s), addStats(s, delta)→changed, canAfford(s, act), applyActivity(s, act)→{changes, tired, sick}, recover(s), advanceMonth(s)→boolean(끝났나), dateInfo(month)→{year, mon, age, season}, buy(s, id)→boolean, equip(s, id), unequip(s, slot), damage(atk, def, rng)→{dmg, crit}, expToNext(level), gainExp(s, exp)→levelsGained, isRegionOpen(s, regionId), rollTile(rng), evaluateEnding(s)→endingId`

- [ ] **Step 1: 실패하는 테스트 작성** — `tests/princess/rules.test.js`

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../../games/princess/src/rules.js';
import { ACTIVITIES } from '../../games/princess/src/data/activities.js';

const fresh = (id = 'ruby') => R.newGame(id, '테스트');

test('newGame: 시작 능력치/돈/HP', () => {
  const s = fresh('ruby');
  assert.equal(s.gold, 200);
  assert.equal(s.stats.str, 25); assert.equal(s.stats.vit, 25); assert.equal(s.stats.int, 15);
  assert.equal(s.stats.fat, 0); assert.equal(s.month, 1);
  assert.equal(s.equip.outfit, 'apron');
  assert.equal(s.hp, R.battleStats(s).maxHp);
});

test('dateInfo: 1달째 = 1년차 3월 12살 봄, 12달째 = 2월 겨울', () => {
  assert.deepEqual(R.dateInfo(1), { year: 1, mon: 3, age: 12, season: 'spring' });
  assert.deepEqual(R.dateInfo(12), { year: 1, mon: 2, age: 12, season: 'winter' });
  assert.deepEqual(R.dateInfo(13), { year: 2, mon: 3, age: 13, season: 'spring' });
  assert.equal(R.dateInfo(8).season, 'autumn'); // 10월
});

test('addStats: 0~100 범위, 돈은 음수 불가', () => {
  const s = fresh();
  s.stats.str = 98; s.gold = 10;
  const ch = R.addStats(s, { str: 6, int: -50, gold: -30 });
  assert.equal(s.stats.str, 100); assert.equal(s.stats.int, 0); assert.equal(s.gold, 0);
  assert.deepEqual(ch, { str: 2, int: -15, gold: -10 });
});

test('applyActivity: 공부는 돈을 쓰고 능력치를 올린다', () => {
  const s = fresh();
  const r = R.applyActivity(s, ACTIVITIES.sword);
  assert.equal(s.gold, 170); assert.equal(s.stats.str, 31); assert.equal(s.stats.fat, 10);
  assert.equal(r.tired, false); assert.equal(s.counts.sword, 1);
});

test('applyActivity: 피로 70 이상이면 효과·수입 절반', () => {
  const s = fresh(); s.stats.fat = 70;
  const r = R.applyActivity(s, ACTIVITIES.bakery);
  assert.equal(r.tired, true); assert.equal(s.gold, 230); assert.equal(s.stats.fat, 82);
});

test('canAfford / applyActivity: 돈이 모자라면 못 한다', () => {
  const s = fresh(); s.gold = 10;
  assert.equal(R.canAfford(s, ACTIVITIES.magic), false);
  assert.throws(() => R.applyActivity(s, ACTIVITIES.magic));
  assert.equal(R.canAfford(s, ACTIVITIES.rest), true);
});

test('피로 100이면 병 → recover 로 피로 30', () => {
  const s = fresh(); s.stats.fat = 95;
  const r = R.applyActivity(s, ACTIVITIES.hunter);
  assert.equal(r.sick, true); assert.equal(s.sick, true);
  R.recover(s);
  assert.equal(s.sick, false); assert.equal(s.stats.fat, 30);
});

test('advanceMonth: 36달째를 넘기면 true(엔딩)', () => {
  const s = fresh(); s.month = 35;
  assert.equal(R.advanceMonth(s), false); assert.equal(s.month, 36);
  assert.equal(R.advanceMonth(s), true);
});

test('buy/equip/unequip: 보너스 반영, 해제 시 HP 줄임, 중복 구매 불가', () => {
  const s = fresh(); s.gold = 500;
  assert.equal(R.buy(s, 'necklace'), true); assert.equal(s.gold, 440);
  assert.equal(R.buy(s, 'necklace'), false);
  const base = R.battleStats(s).maxHp;
  R.equip(s, 'necklace');
  assert.equal(R.battleStats(s).maxHp, base + 10);
  s.hp = base + 10;
  R.unequip(s, 'acc');
  assert.equal(s.hp, base);
  assert.equal(R.buy(s, 'potion'), true); assert.equal(s.potions.potion, 3);
});

test('buy: 돈 부족이면 false, 돈 그대로', () => {
  const s = fresh(); s.gold = 10;
  assert.equal(R.buy(s, 'tiara'), false); assert.equal(s.gold, 10);
});

test('equip 보너스가 effStats 에 들어간다', () => {
  const s = fresh(); s.owned.push('tiara'); R.equip(s, 'tiara');
  assert.equal(R.effStats(s).gra, s.stats.gra + 5);
});

test('damage: 결정적 rng', () => {
  const seq = (...v) => { let i = 0; return () => v[i++]; };
  assert.deepEqual(R.damage(20, 10, seq(0.5, 0.5)), { dmg: 15, crit: false });
  assert.deepEqual(R.damage(20, 10, seq(0.05, 0.5)), { dmg: 23, crit: true });
  assert.equal(R.damage(1, 100, seq(0.5, 0)).dmg, 1);
});

test('gainExp: 여러 레벨 한 번에', () => {
  const s = fresh();
  const ups = R.gainExp(s, R.expToNext(1) + R.expToNext(2));
  assert.equal(ups, 2); assert.equal(s.level, 3); assert.equal(s.exp, 0);
});

test('지역 해금', () => {
  const s = fresh();
  assert.equal(R.isRegionOpen(s, 'forest'), true);
  assert.equal(R.isRegionOpen(s, 'cave'), false);
  s.gems.push('forest'); assert.equal(R.isRegionOpen(s, 'cave'), true);
  s.gems.push('cave'); assert.equal(R.isRegionOpen(s, 'ice'), true);
  assert.equal(R.isRegionOpen(s, 'tower'), false);
  s.gems.push('ice'); assert.equal(R.isRegionOpen(s, 'tower'), true);
});

test('rollTile 확률 구간', () => {
  assert.equal(R.rollTile(() => 0.0), 'battle');
  assert.equal(R.rollTile(() => 0.6), 'chest');
  assert.equal(R.rollTile(() => 0.8), 'spring');
  assert.equal(R.rollTile(() => 0.95), 'flower');
});

test('엔딩 우선순위', () => {
  const s = fresh();
  assert.equal(R.evaluateEnding(s), 'normal');
  s.counts.bakery = 8; assert.equal(R.evaluateEnding(s), 'bakery');
  s.stats.int = 80; assert.equal(R.evaluateEnding(s), 'scholar');
  s.gems = ['forest', 'cave', 'ice', 'tower']; s.stats.str = 75;
  assert.equal(R.evaluateEnding(s), 'hero');
  s.friendDemon = true; s.stats.cha = 65; assert.equal(R.evaluateEnding(s), 'peace');
  s.stats.cha = 75; s.stats.gra = 75; assert.equal(R.evaluateEnding(s), 'queen');
});
```

- [ ] **Step 2: 실행해서 실패 확인** — Run: `node --test tests/princess/` → FAIL (모듈 없음)

- [ ] **Step 3: 데이터 파일 작성** — 스펙 표의 수치를 그대로 옮긴다. 적 수치(초안, Task 10에서 조정):

| id | 이름 | hp | atk | def | exp | gold |
|---|---|---|---|---|---|---|
| slime | 말랑 슬라임 | 16 | 7 | 1 | 4 | 8 |
| bunny | 꽃 토끼 | 20 | 9 | 2 | 5 | 10 |
| squirrel | 도토리 다람쥐 | 22 | 10 | 3 | 6 | 12 |
| mushroom (boss, gem forest, drop heartsword 아님/돈 120) | 대왕 버섯 뭉게 | 80 | 14 | 5 | 30 | 120 |
| bat | 박쥐 박박이 | 36 | 16 | 5 | 10 | 18 |
| turtle | 돌멩이 거북 | 48 | 14 | 10 | 12 | 20 |
| crab | 수정 게 | 42 | 18 | 7 | 12 | 22 |
| golem (boss, gem cave) | 수정 골렘 또각이 | 150 | 24 | 12 | 60 | 200 |
| snowman | 눈사람 뭉치 | 60 | 22 | 10 | 16 | 26 |
| icefairy | 얼음 요정 링 | 55 | 26 | 8 | 17 | 28 |
| penguin | 펭귄 기사 | 75 | 24 | 14 | 18 | 30 |
| frosty (boss, gem ice, drop stardress) | 눈의 여왕 프로스티 | 220 | 32 | 16 | 90 | 300 |
| ghost | 꼬마 유령 부우 | 90 | 30 | 14 | 22 | 34 |
| sheep | 구름 양 | 100 | 28 | 18 | 22 | 34 |
| soldier | 장난감 병정 | 110 | 34 | 20 | 25 | 40 |
| grr (boss, gem tower, drop heartsword) | 심술 마왕 그르릉 | 340 | 42 | 24 | 150 | 500 |

`regions.js`: forest(need: 항상) · cave(need: gems에 forest) · ice(need: gems에 cave) · tower(need: gems 3개 이상).
`endings.js` 조건(eff = 장비 포함 능력치, s = 상태, gems4 = s.gems.length === 4):
queen `gems4 && gra>=70 && cha>=70` · peace `gems4 && s.friendDemon && cha>=60` · hero `gems4 && str>=70` · wizard `mgc>=70 && int>=60` · knight `str>=70 && vit>=60` · scholar `int>=75` · dancer `cha>=75` · diplomat `gra>=75` · adventurer `s.level>=15 || s.wins>=40` · bakery `counts.bakery>=8` · florist `counts.florist>=8` · normal `true`.

- [ ] **Step 4: `rules.js` 작성**

```js
// 게임 규칙(순수 함수). 화면·저장과 무관해서 node --test 로 검사한다.
import { CHARACTERS } from './data/characters.js';
import { ITEMS } from './data/items.js';
import { REGIONS } from './data/regions.js';
import { ENDINGS } from './data/endings.js';

export const STATS = ['vit', 'str', 'int', 'mgc', 'cha', 'gra'];
export const STAT_NAMES = { vit: '체력', str: '힘', int: '지능', mgc: '마력', cha: '매력', gra: '기품', fat: '피로' };
export const MAX_MONTH = 36;
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function newGame(charId, name) {
  const c = CHARACTERS[charId];
  const stats = { vit: 15, str: 15, int: 15, mgc: 15, cha: 15, gra: 15, fat: 0 };
  for (const [k, v] of Object.entries(c.bonus)) stats[k] += v;
  const s = {
    v: 1, charId, name, month: 1, gold: 200, stats, level: 1, exp: 0,
    equip: { weapon: null, outfit: 'apron', hat: null, acc: null },
    owned: ['apron'], potions: { potion: 2, ether: 0, bigpotion: 0 },
    gems: [], friendDemon: false, counts: {}, wins: 0, flags: {}, sick: false,
  };
  const b = battleStats(s); s.hp = b.maxHp; s.mp = b.maxMp;
  return s;
}

export function equipBonus(s) {
  const b = {};
  for (const id of Object.values(s.equip)) {
    if (!id) continue;
    for (const [k, v] of Object.entries(ITEMS[id].bonus || {})) b[k] = (b[k] || 0) + v;
  }
  return b;
}

export function effStats(s) {
  const b = equipBonus(s), o = {};
  for (const k of [...STATS, 'fat']) o[k] = s.stats[k] + (b[k] || 0);
  return o;
}

export function battleStats(s) {
  const b = equipBonus(s), e = effStats(s), L = s.level;
  return {
    maxHp: 30 + e.vit + L * 5 + (b.maxHp || 0),
    maxMp: 10 + Math.floor(e.mgc / 2) + (b.maxMp || 0),
    atk: 5 + Math.floor(e.str / 2) + L * 2 + (b.atk || 0),
    matk: 5 + Math.floor(e.mgc * 0.6) + (b.matk || 0),
    def: Math.floor(e.vit / 5) + L + (b.def || 0),
    flee: 0.6 + (b.flee || 0),
    goldRate: 1 + (b.goldRate || 0),
  };
}

// 능력치/돈 변화를 적용하고 실제로 바뀐 양을 돌려준다.
export function addStats(s, delta) {
  const changed = {};
  for (const [k, v] of Object.entries(delta)) {
    if (!v) continue;
    if (k === 'gold') {
      const before = s.gold; s.gold = Math.max(0, s.gold + v);
      if (s.gold !== before) changed.gold = s.gold - before;
      continue;
    }
    const before = s.stats[k]; s.stats[k] = clamp(before + v, 0, 100);
    if (s.stats[k] !== before) changed[k] = s.stats[k] - before;
  }
  return changed;
}

export const canAfford = (s, act) => s.gold >= (act.cost || 0);

export function applyActivity(s, act) {
  if (!canAfford(s, act)) throw new Error('돈이 부족해요');
  const tired = act.cat !== 'rest' && s.stats.fat >= 70;
  const delta = {};
  for (const [k, v] of Object.entries(act.gain)) delta[k] = tired && k !== 'fat' && v > 0 ? Math.ceil(v / 2) : v;
  const income = Math.round((act.income || 0) * (tired ? 0.5 : 1) * battleStats(s).goldRate);
  delta.gold = income - (act.cost || 0);
  const changes = addStats(s, delta);
  s.counts[act.id] = (s.counts[act.id] || 0) + 1;
  const sick = s.stats.fat >= 100;
  if (sick) s.sick = true;
  return { changes, tired, sick };
}

export function recover(s) { s.sick = false; s.stats.fat = 30; }

export function advanceMonth(s) { s.month += 1; return s.month > MAX_MONTH; }

export function dateInfo(month) {
  const year = Math.floor((month - 1) / 12) + 1;
  const mon = ((month + 1) % 12) + 1;
  const season = mon >= 3 && mon <= 5 ? 'spring' : mon <= 8 && mon >= 6 ? 'summer' : mon >= 9 && mon <= 11 ? 'autumn' : 'winter';
  return { year, mon, age: 11 + year, season };
}

export function buy(s, id) {
  const it = ITEMS[id];
  if (s.gold < it.price) return false;
  if (it.slot === 'use') { s.potions[id] = (s.potions[id] || 0) + 1; }
  else { if (s.owned.includes(id)) return false; s.owned.push(id); }
  s.gold -= it.price;
  return true;
}

function clampHpMp(s) { const b = battleStats(s); s.hp = Math.min(s.hp, b.maxHp); s.mp = Math.min(s.mp, b.maxMp); }
export function equip(s, id) { s.equip[ITEMS[id].slot] = id; clampHpMp(s); }
export function unequip(s, slot) { s.equip[slot] = slot === 'outfit' ? 'apron' : null; clampHpMp(s); }

export function damage(atk, def, rng = Math.random) {
  const crit = rng() < 0.1;
  const base = Math.max(1, atk - def / 2);
  return { dmg: Math.max(1, Math.round(base * (0.85 + rng() * 0.3) * (crit ? 1.5 : 1))), crit };
}

export const expToNext = (level) => level * 12;
export function gainExp(s, exp) {
  s.exp += exp; let ups = 0;
  while (s.exp >= expToNext(s.level)) { s.exp -= expToNext(s.level); s.level += 1; ups += 1; }
  return ups;
}

export const isRegionOpen = (s, id) => REGIONS.find((r) => r.id === id).need(s);

export function rollTile(rng = Math.random) {
  const r = rng() * 100;
  return r < 55 ? 'battle' : r < 75 ? 'chest' : r < 90 ? 'spring' : 'flower';
}

export function evaluateEnding(s) {
  const e = effStats(s);
  return ENDINGS.find((en) => en.cond(e, s)).id;
}
```

`damage(20,10)` 검산: crit=0.5<0.1 false, base 15, ×(0.85+0.15)=15 ✓. crit: 15×1×1.5=22.5→23 ✓.
`applyActivity(bakery, fat 70)`: gain{vit+1,cha+1,fat+12} → tired, 수입 30 → gold 230, fat 82 ✓.

- [ ] **Step 5: 테스트 통과 확인** — Run: `node --test tests/princess/` → 모두 PASS
- [ ] **Step 6: Commit** — `feat(princess): game data and pure rules with tests`

---

### Task 2: 저장/불러오기 (`state.js`)

**Files:** Create `games/princess/src/state.js` · Test `tests/princess/state.test.js`

**Produces:** `parseSave(text)→state|null`, `save(s)`, `load()→state|null`, `hasSave()`, `clearSave()`, `loadGallery()→string[]`, `addToGallery(id)`

- [ ] **Step 1: 실패하는 테스트**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSave } from '../../games/princess/src/state.js';
import { newGame } from '../../games/princess/src/rules.js';

test('parseSave: 정상 저장은 복원', () => {
  const s = newGame('rose', '로즈');
  assert.deepEqual(parseSave(JSON.stringify(s)), s);
});
test('parseSave: 깨진 데이터는 null', () => {
  for (const bad of [null, '', 'garbage{', '42', '{"v":0}', JSON.stringify({ v: 1, charId: 'nobody', month: 3 }),
    JSON.stringify({ v: 1, charId: 'ruby', month: 'x' })]) assert.equal(parseSave(bad), null);
});
```

- [ ] **Step 2:** `node --test tests/princess/` → FAIL
- [ ] **Step 3: 구현**

```js
// localStorage 저장. 깨진 데이터는 조용히 무시하고 null.
import { CHARACTERS } from './data/characters.js';

const SAVE_KEY = 'princess-save-v1';
const GALLERY_KEY = 'princess-endings-v1';

export function parseSave(text) {
  try {
    const s = JSON.parse(text);
    if (!s || s.v !== 1 || !CHARACTERS[s.charId] || !Number.isInteger(s.month) || !s.stats || !s.equip) return null;
    return s;
  } catch { return null; }
}
const store = () => { try { return window.localStorage; } catch { return null; } };
export function save(s) { try { store()?.setItem(SAVE_KEY, JSON.stringify(s)); } catch {} }
export function load() { return parseSave(store()?.getItem(SAVE_KEY) ?? null); }
export const hasSave = () => load() !== null;
export function clearSave() { try { store()?.removeItem(SAVE_KEY); } catch {} }
export function loadGallery() {
  try { const a = JSON.parse(store()?.getItem(GALLERY_KEY) || '[]'); return Array.isArray(a) ? a : []; } catch { return []; }
}
export function addToGallery(id) {
  const g = loadGallery(); if (!g.includes(id)) g.push(id);
  try { store()?.setItem(GALLERY_KEY, JSON.stringify(g)); } catch {}
}
```

- [ ] **Step 4:** PASS 확인 · **Step 5: Commit** `feat(princess): save/load with corrupt-data guard`

---

### Task 3: 틀 + 공주 SVG + 타이틀 + 캐릭터 고르기  *(체크포인트 ①의 앞부분)*

**Files:** Create `index.html`, `style.css`, `src/main.js`, `src/ui.js`, `src/art/avatar.js`, `src/art/scenes.js`(title/select 배경), `src/screens/title.js`, `src/screens/select.js`

**Produces:**
- `avatar(charOrState, idPrefix, opts?) → svgString` — `charOrState`가 상태면 `CHARACTERS[s.charId]`와 `s.equip` 사용, 캐릭터면 기본 앞치마. `opts.equip`로 미리보기 장비 덮어쓰기.
  장비 그림: weapon 5종(오른손), outfit 5종(치마·상의·소매 모양이 다름: 앞치마=시안 / 기사=은색 흉갑+파란 치마+어깨갑 / 로브=보라 긴 로브+별 무늬 / 무도회=3단 넓은 치마+리본 / 별빛=흰금색+별 반짝이),
  hat 4종, acc 4종(목걸이=가슴, 망토·날개=몸 뒤 레이어, 클로버=머리핀). 레이어 순서: 뒤(망토/날개, 뒷머리) → 다리 → 옷 → 무기 → 팔·소매 → 얼굴 → 앞머리 → 모자/핀.
- `main.js`: `go(name, params)` — `#screen`을 비우고 `screens[name].render(root, ctx)`. `ctx.state`는 현재 게임, `ctx.save()`는 `state.save(ctx.state)`.
- `ui.js`: `modal({title, html, buttons:[{id,label,kind}]}) → Promise<id>`, `toast(text)`, `popNumbers(el, changes)`(+6! 숫자 팝업), `sparkles(container, n)`.
- `style.css`: 시안의 `.frame .ribbon .mbtn .chip .bar .sparkle` 및 애니메이션(float, breathe, blink, twinkle, squish, pop, shake, flash)을 옮김.

- [ ] **Step 1:** 시안의 CSS·`avatar()`·캐릭터 데이터를 모듈로 옮기고 위 장비 레이어 전부 구현
- [ ] **Step 2:** 타이틀(성·하늘 배경, 로고 "👑 꼬마 공주 키우기", [처음부터] [이어하기(hasSave일 때만)] [엔딩 도감] [← 메뉴 `../../index.html`]). 이어하기가 있을 때 처음부터를 누르면 "저장된 게임이 지워져요" 확인 모달.
- [ ] **Step 3:** 캐릭터 고르기(시안 ①) → [시작] → 이름 입력 모달(기본값 캐릭터 이름, 1~8자, 빈칸이면 인라인 경고 후 진행 안 함) → `newGame` → `go('home')` (프롤로그 이벤트는 Task 8에서 연결)
- [ ] **Step 4: 브라우저 확인** — `preview_start static` → `http://localhost:8002/games/princess/` : 콘솔 오류 0, 4명 카드, 선택 반짝임, 이름 입력. 임시 디버그 페이지 없이 `avatar()`를 장비 조합별로 확인하려면 콘솔에서 `document.body.innerHTML = avatar(...)`로 스크린샷.
- [ ] **Step 5: Commit** `feat(princess): title, character select, equippable avatar art`

### Task 4: 공주의 방(메인 화면) + 계절  *(체크포인트 ①)*

**Files:** Create `src/screens/home.js`; Modify `src/art/scenes.js`(room(season))

- [ ] **Step 1:** `scenes.room(season)` — 시안의 방. 창밖: 봄 벚꽃 가지·분홍 하늘 / 여름 해·뭉게구름·파란 하늘 / 가을 단풍나무·노을 / 겨울 눈 쌓인 창틀·밤하늘. 떠다니는 입자(꽃잎/반짝 햇살/낙엽/눈송이) CSS 애니메이션.
- [ ] **Step 2:** `home.render`: 상단 바(`🌸 1년차 3월 · 12살`, 돈, 소리 버튼), 공주(현재 장비), 이름표, 루루 + 말풍선(`lulu.advice(state)` — 피로 60↑ 쉬라는 말, 돈 50↓ 알바 권유, 다음 보스 권장 레벨 등 5~6가지 중 상황에 맞는 것), 능력치 7개 바(`기본 (+보너스)`), 버튼 8개. 보석 획득 수를 작은 별 4개로 표시.
- [ ] **Step 3: 브라우저 확인 + 사용자 체크포인트 ①** (스크린샷 공유, Ctrl+F5 안내)
- [ ] **Step 4: Commit** `feat(princess): home room with seasons and stat panel`

### Task 5: 매달 스케줄 흐름  *(체크포인트 ②)*

**Files:** Create `src/screens/activity.js`; Modify `home.js`, `main.js`(`runMonth`)

**Produces:** `async runMonth(ctx, kind, payload)` in `main.js`: 
1) `kind==='activity'` → `applyActivity` → `activity.play(result)`(활동 장면 카드: 공주 + 활동 소품 SVG 배경, "하루… 이틀… 한 달!" 진행 바 2초, 능력치 증가 숫자 팝업, 피곤/병 문구)
2) 이벤트 훅 `await runEvents(ctx, 'monthEnd')` (Task 8 전까지는 빈 함수)
3) `advanceMonth` → true면 `go('ending')`, 아니면 `save()` 후 `go('home')`.
- 달 시작 시 `state.sick`이면 "열이 나요… 이번 달은 푹 쉬어요" 모달 → `recover` → 위 2~3단계.

- [ ] **Step 1:** 공부/알바/휴식 버튼 → 선택 모달(카드 그리드: 아이콘, 이름, 효과 `힘+6 체력+2`, 비용/수입; 돈 부족 카드는 흐리게 + "돈이 부족해요", 눌러도 안 넘어감)
- [ ] **Step 2:** 활동 장면 12종 소품(검술 허수아비, 마법진, 찻잔, 칠판, 리본 무대, 빵, 꽃, 책장, 빗자루, 숲 덫, 침대, 돗자리) — `scenes.activity(id)`
- [ ] **Step 3:** `runMonth` + 병 처리 + 자동 저장 + 타이틀 '이어하기' 연결
- [ ] **Step 4: 브라우저 확인** — 3달 진행 후 새로고침 → 이어하기로 같은 달·능력치 복원. 피로 강제 100 만들어 병 → 다음 달 휴식 확인. **체크포인트 ②**
- [ ] **Step 5: Commit** `feat(princess): monthly schedule, results, sickness, autosave`

### Task 6: 상점 + 장비  *(체크포인트 ③)*

**Files:** Create `src/screens/shop.js`, `src/screens/equip.js`

- [ ] **Step 1:** 상점: 탭(무기/옷/모자/액세서리/물약), 진열 카드(아이템 아이콘 SVG = 해당 장비만 확대 그림, 이름, 효과, 가격, 산 것은 "가지고 있어요"), 카드 클릭 → 오른쪽 미리보기 공주가 그 장비로 바뀜(`avatar(state,'pv',{equip})`), [사기] → `buy` → 코인 소리 + 토스트. 돈 부족이면 버튼에 "돈이 부족해요". `special` 아이템은 `opts.special`일 때만(냥냥이 이벤트).
- [ ] **Step 2:** 장비: 4칸 슬롯 + 가진 장비 목록, 누르면 `equip`/같은 걸 다시 누르면 `unequip`, 공주 즉시 갱신, 능력치 변화 초록/빨강 표시, 물약 개수 표시.
- [ ] **Step 3: 브라우저 확인 체크포인트 ③** · **Commit** `feat(princess): shop with try-on preview and equipment screen`

### Task 7: 적 그림 + 모험 보드 + 턴제 전투  *(체크포인트 ④)*

**Files:** Create `src/art/monsters.js`, `src/screens/adventure.js`, `src/screens/battle.js`; Modify `src/art/scenes.js`(forest, cave, ice, tower 배경)

**Produces:** `monster(id) → svgString`(16종, 시안 슬라임 수준), `async adventure(ctx, regionId) → void`, `async battle(ctx, enemyId) → 'win'|'lose'|'flee'`

- [ ] **Step 1:** 적 16종 SVG + 지역 배경 4종(숲=시안, 동굴=보라 수정·반딧불, 얼음 성=하늘색 얼음 기둥·눈, 탑=분홍 구름 위 별밤)
- [ ] **Step 2:** 무사수행 버튼 → 지역 선택 모달(잠긴 지역은 자물쇠 + "초록 별을 찾으면 열려요") → 보드: 구불길 위 7칸, 공주 말, [앞으로!] [마을로 돌아가기], 시작 시 HP/MP 가득. 칸: `rollTile` → battle(지역 일반 적 랜덤) / chest(돈 20~60×지역단계, 30% 물약, 10% 상점 장비 중 안 가진 것) / spring(HP·MP 회복) / flower(랜덤 능력치+1). 마지막 칸 보스(이름 배너 + 화면 흔들림).
- [ ] **Step 3:** 전투(시안 ③): 공격/마법(불꽃 MP5 ×1.5, 치유 MP6 matk×1.2 회복, 반짝 별 MP10 ×2.5는 마력 40↑) /물약/도망(보스 불가). 적 행동: `damage(enemy.atk, def)`. 연출: 돌진, 흔들림·깜빡, 데미지 팝업, 크리티컬 문구, 마법 입자. 승리 → `gainExp`, 돈×goldRate, `wins++`, 레벨업 축하, 보스면 `gems.push` + drop 장비 지급(이미 있으면 돈). 이미 가진 보석의 보스는 돈만. 패배 → 루루 구출 문구, 모험 종료.
- [ ] **Step 4:** 모험이 끝나면 `runMonth`의 2~3단계로 이어짐.
- [ ] **Step 5: 브라우저 확인** — 숲 끝까지 진행, 승리·패배·도망·물약 각각 1회. **체크포인트 ④** · **Commit** `feat(princess): adventure board, turn-based battle, 16 monsters`

### Task 8: 대화 시스템 + 이야기·이벤트  *(체크포인트 ⑤)*

**Files:** Create `src/screens/dialogue.js`, `src/art/npcs.js`, `src/data/events.js`; Modify `main.js`(`runEvents`), `battle.js`(보스 후 대화)

**Produces:** `dialogue(scenes) → Promise<number|null>` — `scenes = [{ who:'lulu'|'princess'|'nyang'|'leo'|'momo'|'kong'|'grr'|boss id, text, choices?: [label] }]`; 아래쪽 대화창, 초상화, 한 글자씩 출력(클릭하면 즉시 전체 → 다음).
`EVENTS = [{ id, hook:'monthStart'|'monthEnd'|'bossWin', once, chance?, when(s, ctx)→bool, run: async (s, api) => void }]`, `api = { say(scenes)→Promise<choice>, add(delta)→changes(숫자 팝업 포함), give(itemId), shop({special:true}) }`.

- [ ] **Step 1:** NPC 초상화 6종 + 보스 초상화는 `monster(id)` 재사용
- [ ] **Step 2:** 이벤트 데이터 (모든 대사를 실제로 작성):
  - prologue(1달 시작, once) — 마왕이 보석을 훔친 이야기, 루루 등장, 3년 목표, 버튼 안내
  - birthday(매년 첫 달, 2·3년차 = 13·25달) — 케이크, 선물: 13달 하트 목걸이, 25달 요정 날개 (1년차 첫 달은 프롤로그가 대신하고 꽃 화관 선물)
  - harvest(매년 10월 = 8·20·32달 monthEnd) — 대회 4종 선택 → 점수 = 관련 두 능력치 합 + 0~20 랜덤, 라이벌 점수 = 60/90/120(연차별) → 1등 상금 100×연차 + 트로피 문구, 아니면 위로 사탕(ether)
  - bossWin: mushroom(뭉게 사과) / golem(또각이 수수께끼 하나 → 맞히면 보너스 지능+3, 틀려도 보석은 줌) / frosty(친구 되기, 겨울 녹음) / grr(고백 → [같이 놀자!]=friendDemon, [혼내준다])
  - towerOpen(보석 3개가 된 다음 달, once) — 구름 계단 연출 대사
  - grrLetter(18달, once) — "흥! 보석 절대 못 찾을걸! …근데 너 뭐 하고 노니?" 편지
  - festivalSoon(30달, once) — 축제 6달 전, 남은 보석 안내
  - 랜덤(monthEnd, 25%, 같은 달 최대 1개, 각 once 아님): nyang(특별 상점) / kong(강아지 선택지) / leo(다과회) / momo(마법 수프, 30% 맛 이상 피로+10) / squirrel(동전 도둑, 힘 40↑면 되찾고 +30G, 아니면 -20G) / rainyday(지능+3) / wish(별똥별 3지선다)
- [ ] **Step 3:** 훅 연결 — `monthStart`(프롤로그·생일·탑 개방·편지·축제 알림) → 스케줄 → `monthEnd`(수확제·랜덤) ; 보스 승리 직후 `bossWin`
- [ ] **Step 4: 브라우저 확인 체크포인트 ⑤** · **Commit** `feat(princess): dialogue system, story and seasonal events`

### Task 9: 엔딩 + 도감  *(체크포인트 ⑥ 앞부분)*

**Files:** Create `src/screens/ending.js`, `src/screens/gallery.js`; Modify `src/data/endings.js`(문구), `src/art/scenes.js`(엔딩 배경 7종: throne, peace(꽃밭+그르릉), hero(언덕+깃발), magic(마법탑), library, bakery, flower, ballroom, field — 엔딩별 지정)

- [ ] **Step 1:** 별빛 축제 도입 대사(보석 4개면 왕관이 빛나며 회색 구름이 걷힘, 아니면 "보석은 다 못 찾았지만…") → 엔딩 화면: 배경 + 엔딩 의상 공주 + 제목 배너 + 후일담(3~4문장) + 꽃잎 + 최종 능력치 요약 + [도감에 기록됐어요!] → `addToGallery`, `clearSave`, [타이틀로]
- [ ] **Step 2:** 도감: 12칸, 본 엔딩은 축소 그림+제목, 못 본 건 "?" + `hint`. 타이틀·메인 양쪽에서 열림.
- [ ] **Step 3:** 브라우저에서 엔딩 확인용으로 콘솔에서 `state.month=36` 등 조작해 3종 이상 확인 · **Commit** `feat(princess): 12 endings and ending gallery`

### Task 10: 소리 + 허브 연결 + 밸런스  *(체크포인트 ⑥)*

**Files:** Create `src/sound.js`, `tests/princess/balance.test.js`; Modify `index.html`(허브), 각 화면에 효과음 호출

- [ ] **Step 1:** `sound.js` (신데렐라 `sound.js` 패턴: 첫 입력 후 AudioContext, 음소거 토글은 localStorage `princess-mute`) — `music('home'|'adventure'|'battle'|'boss'|'ending')`, `sfx('click'|'up'|'coin'|'hit'|'crit'|'magic'|'heal'|'win'|'lose'|'levelup'|'chest')`
- [ ] **Step 2: 밸런스 시뮬레이션 테스트**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../../games/princess/src/rules.js';
import { ENEMIES } from '../../games/princess/src/data/enemies.js';

// 단순 전투 시뮬: 매 턴 공격, HP 40% 아래면 물약(최대 3개)
function fight(s, enemyId, rng) {
  const b = R.battleStats(s), e = { ...ENEMIES[enemyId] };
  let hp = b.maxHp, pots = 3;
  for (let t = 0; t < 60; t++) {
    if (hp < b.maxHp * 0.4 && pots > 0) { hp = Math.min(b.maxHp, hp + 30); pots--; }
    else { e.hp -= R.damage(b.atk, e.def, rng).dmg; if (e.hp <= 0) return true; }
    hp -= R.damage(e.atk, b.def, rng).dmg; if (hp <= 0) return false;
  }
  return false;
}
function rate(s, id, n = 300) { let w = 0; for (let i = 0; i < n; i++) w += fight(s, id, Math.random); return w / n; }
function build(level, stat, gear) {
  const s = R.newGame('ruby', 't'); s.level = level;
  for (const k of ['vit', 'str']) s.stats[k] = stat;
  Object.assign(s.equip, gear); return s;
}

test('1년차 말(레벨 4, 힘·체력 45, 나무검)이면 숲 보스를 대체로 이긴다', () => {
  assert.ok(rate(build(4, 45, { weapon: 'wood' }), 'mushroom') >= 0.6);
});
test('시작 직후(레벨 1)는 숲 보스에게 대체로 진다', () => {
  assert.ok(rate(build(1, 25, {}), 'mushroom') <= 0.3);
});
test('3년차(레벨 12, 힘·체력 80, 기사검·기사드레스)면 마왕을 이길 수 있다', () => {
  assert.ok(rate(build(12, 80, { weapon: 'knight', outfit: 'knightdress' }), 'grr') >= 0.5);
});
test('2년차 중반(레벨 7, 60, 기사검)이면 동굴 보스 가능', () => {
  assert.ok(rate(build(7, 60, { weapon: 'knight' }), 'golem') >= 0.5);
});
```

실패하면 `enemies.js` 수치를 조정해서 통과시킨다(규칙 공식은 건드리지 않는다).
- [ ] **Step 3:** 허브 `index.html`에 세 번째 카드 추가: `<a class="game-card princess" href="games/princess/index.html">` 👑 / 꼬마 공주 키우기 / 공주를 키우고 모험을 떠나요! (hover 테두리 `#ffc94d`)
- [ ] **Step 4:** 전체 `node --test tests/princess/` PASS, 브라우저로 처음부터 3~4달 + 모험 1회 + 콘솔 조작으로 엔딩 확인, 1024×640 레이아웃 확인. **체크포인트 ⑥**
- [ ] **Step 5: Commit** `feat(princess): music and sfx, hub card, balance pass` → 사용자 확인 후 `git push`(GitHub Pages 배포)
