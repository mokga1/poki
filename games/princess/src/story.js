// 이벤트 실행기: 어떤 이벤트가 일어날지 고르고(pickEvents), 대화·보상을 처리한다.
import { EVENTS } from './data/events.js';
import { ITEMS } from './data/items.js';
import { addStats, effStats, STAT_NAMES } from './rules.js';
import { setEventRunner } from './flow.js';
import { dialogue } from './screens/dialogue.js';
import { toast, josa } from './ui.js';
import { sfx } from './sound.js';

const RANDOM_CHANCE = 0.25;

// 이번 훅에서 일어날 이벤트 목록 (순수 함수: 테스트 대상)
export function pickEvents(events, s, hook, data, rng = Math.random) {
  const ok = (e) => e.hook === hook && !(e.once && s.flags[e.id]) && e.when(s, data);
  const fixed = events.filter((e) => !e.random && ok(e));
  if (hook !== 'monthEnd') return fixed;
  const pool = events.filter((e) => e.random && ok(e) && e.id !== s.flags.lastRandom);
  if (pool.length && rng() < RANDOM_CHANCE) fixed.push(pool[Math.floor(rng() * pool.length)]);
  return fixed;
}

function makeApi(ctx) {
  const s = ctx.state;
  return {
    say: (scenes) => dialogue(ctx, scenes),
    eff: () => effStats(s),
    add(delta) {
      const ch = addStats(s, delta);
      const txt = Object.entries(ch).map(([k, v]) => `${STAT_NAMES[k]} ${v > 0 ? '+' : ''}${v}`).join(' · ');
      if (txt) { toast(`✨ ${txt}`); sfx('up'); }
      return ch;
    },
    gold(n) {
      const ch = addStats(s, { gold: n });
      if (ch.gold) { toast(`🪙 ${ch.gold > 0 ? '+' : ''}${ch.gold} G`); sfx('coin'); }
    },
    give(id) {
      const it = ITEMS[id];
      if (it.slot === 'use') s.potions[id] = (s.potions[id] || 0) + 1;
      else if (s.owned.includes(id)) { s.gold += 100; toast(`${josa(it.name, '은')} 이미 있어서 100 G로 바꿨어요`); sfx('coin'); return; }
      else s.owned.push(id);
      toast(`🎁 ${josa(it.name, '을')} 받았어요! (장비 화면에서 입을 수 있어요)`);
      sfx('chest');
    },
    shop: () => new Promise((done) => ctx.go('shop', { special: true, done })),
  };
}

export function installStory() {
  setEventRunner(async (ctx, hook, data = {}) => {
    const s = ctx.state;
    const list = pickEvents(EVENTS, s, hook, data);
    for (const ev of list) {
      if (ev.once) s.flags[ev.id] = true;
      if (ev.random) s.flags.lastRandom = ev.id;
      await ev.run(s, makeApi(ctx), data);
    }
    return list.length;
  });
}
