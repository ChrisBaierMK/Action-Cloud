// Behaviour checks on the built page: the clickable plan, arrows, package pre-selection, no-JS and small screens.
const { chromium } = require('playwright');
const base = 'file://' + process.argv[2];
const ok = (name, cond, extra) => console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : ''));
(async () => {
  const b = await chromium.launch();
  for (const lang of ['', 'en/']) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const errs = []; p.on('pageerror', e => errs.push(String(e)));
    await p.goto(base + '/' + lang + 'index.html');
    await p.waitForTimeout(200);
    await p.locator('#park').scrollIntoViewIfNeeded();
    const cur = () => p.$$eval('.spot[aria-current]', l => l.map(x => x.getAttribute('data-spot')).join());
    const spots = await p.$$eval('.spot', l => l.map(x => x.getAttribute('data-spot')).join(','));
    ok(lang + 'plan: every number from 1 to 21 is on the picture once, in order', spots === Array.from({ length: 21 }, (_, i) => i + 1).join(','), spots);
    ok(lang + 'plan: every room links to a card that exists and is named for screen readers', await p.$$eval('.spot', l => l.every(x => document.getElementById(x.getAttribute('href').slice(1)) && x.textContent.trim().length > 4)));
    const nums = await p.$$eval('.map-rail > li', l => l.map(x => x.querySelector('.num').lastChild.textContent.trim() === x.getAttribute('data-n')));
    const order = await p.$$eval('.map-rail > li', l => l.map(x => +x.getAttribute('data-n')));
    ok(lang + 'plan: 22 cards in the order of their numbers, each carrying its number', nums.length === 22 && nums.every(Boolean) && order.every((n, i) => i === 0 || n >= order[i - 1]), order.join(','));
    ok(lang + 'plan: room 1 is chosen at the start', (await cur()) === '1' && (await p.$$eval('.chips a[aria-current]', l => l.map(x => x.getAttribute('data-group')).join())) === 'w');
    // the rooms cover the whole picture: a tap anywhere chooses exactly one
    const holes = await p.evaluate(() => { const b = document.querySelector('.map-pic').getBoundingClientRect(); let bad = 0; for (let y = 2; y < 100; y += 4) for (let x = 2; x < 100; x += 4) { const e = document.elementFromPoint(b.left + b.width * x / 100, b.top + b.height * y / 100); if (!e || !e.closest('.spot')) bad++; } return bad; });
    ok(lang + 'plan: a tap anywhere on the picture lands in a room', holes === 0, String(holes));
    const y0map = await p.evaluate(() => scrollY);
    const pb = await p.$eval('.map-pic', e => { const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; });
    await p.mouse.click(pb.x + pb.w * 0.80, pb.y + pb.h * 0.55); await p.waitForTimeout(250);   // the floor of room 9, away from its disc
    const shown = await p.evaluate(() => { const r = document.querySelector('.map-rail').getBoundingClientRect(); const c = document.getElementById('loc-9').getBoundingClientRect(); return c.left >= r.left - 2 && c.right <= r.right + 2; });
    ok(lang + 'plan: a tap on the floor of a room brings up its card and lights its number', shown && (await cur()) === '9' && (await p.$$eval('.chips a[aria-current]', l => l.map(x => x.getAttribute('data-group')).join())) === 'j');
    ok(lang + 'plan: choosing a room does not move the page or the address', Math.abs((await p.evaluate(() => scrollY)) - y0map) < 3 && !/#loc/.test(p.url()));
    ok(lang + 'plan: screen readers hear which place came up', (await p.$eval('[data-say]', e => e.textContent)).length > 10);
    await p.click('.map-side [data-next]'); await p.waitForTimeout(800);
    ok(lang + 'plan: the arrow goes to the next place and the number follows', (await cur()) === '10');
    await p.click('.chips a[data-group="s"]'); await p.waitForTimeout(250);
    ok(lang + 'plan: a group chip jumps to its first place', (await cur()) === '16');
    await p.mouse.click(pb.x + pb.w * 0.69, pb.y + pb.h * 0.50); await p.waitForTimeout(250);
    await p.click('.map-side [data-next]'); await p.waitForTimeout(800);
    ok(lang + 'plan: room 8 has two cards under the same number', (await cur()) === '8' && await p.evaluate(() => { const r = document.querySelector('.map-rail').getBoundingClientRect(); const c = document.getElementById('loc-8-2').getBoundingClientRect(); return Math.abs(c.left - r.left) < 4; }));
    // with a mouse, resting on a room is enough; the page itself does not move
    await p.locator('#park').scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
    const hb = await p.$eval('.map-pic', e => { const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; });
    const yh = await p.evaluate(() => scrollY);
    await p.mouse.move(hb.x + hb.w * 0.10, hb.y + hb.h * 0.08, { steps: 4 }); await p.waitForTimeout(400);   // the floor of room 3, away from its disc
    const up3 = await p.evaluate(() => { const r = document.querySelector('.map-rail').getBoundingClientRect(); const c = document.getElementById('loc-3').getBoundingClientRect(); return Math.abs(c.left - r.left) < 4; });
    ok(lang + 'plan: resting the mouse on a room brings up its card and lights its number', up3 && (await cur()) === '3');
    await p.mouse.move(hb.x + hb.w * 0.59, hb.y + hb.h * 0.08, { steps: 3 }); await p.mouse.move(hb.x + hb.w * 0.59, hb.y - 60, { steps: 2 }); await p.waitForTimeout(400);
    ok(lang + 'plan: a fast pass over other rooms on the way out changes nothing', (await cur()) === '3');
    const discs = await p.$$eval('.spot', l => l.map(a => { const b = a.querySelector('.disc').getBoundingClientRect(); return { n: a.getAttribute('data-spot'), x: b.left + b.width / 2, y: b.top + b.height / 2 }; }));
    const wrong = [];
    for (const dsc of discs) { await p.mouse.move(dsc.x, dsc.y, { steps: 2 }); await p.waitForTimeout(260); const c = await cur(); if (c !== dsc.n) wrong.push(dsc.n + '>' + c); }
    ok(lang + 'plan: every number answers to the mouse with its own card', wrong.length === 0, wrong.join(' '));
    ok(lang + 'plan: hovering never moves the page or the address', Math.abs((await p.evaluate(() => scrollY)) - yh) < 3 && !/#loc/.test(p.url()));
    await p.mouse.move(2, 2);
    await p.locator('#tier-rail').scrollIntoViewIfNeeded();
    const before = await p.$eval('#tier-rail .rail', r => r.scrollLeft);
    await p.click('#tier-rail [data-next]'); await p.waitForTimeout(700);
    const after = await p.$eval('#tier-rail .rail', r => r.scrollLeft);
    ok(lang + 'tiers: next arrow scrolls the rail', after > before + 100, before + ' -> ' + after);
    ok(lang + 'tiers: back arrow enabled after moving, and still focusable', (await p.getAttribute('#tier-rail [data-prev]', 'aria-disabled')) === 'false' && !(await p.isDisabled('#tier-rail [data-prev]')));
    const third = await p.$$eval('#tier-rail .tier h3', h => h[2].textContent);
    await p.$$eval('#tier-rail .tier a[data-pick]', a => a[2].click()); await p.waitForTimeout(300);
    ok(lang + 'tiers: choosing a package pre-selects it in the form', await p.$eval('#f-package', s => s.options[s.selectedIndex].text) === third, third);
    const tiers = await p.$$eval('#tier-rail .tier', t => t.length), opts = await p.$$eval('#f-package option', o => o.length);
    await p.locator('#sponsors').scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
    const y0 = await p.evaluate(() => scrollY);
    await p.$$eval('.ladder a', a => a[6].click()); await p.waitForTimeout(900);
    const seen = await p.evaluate(() => { const c = document.getElementById('pachet-sustinator').getBoundingClientRect(); return c.left >= 0 && c.right <= innerWidth + 1; });
    ok(lang + 'tiers: a price chip brings its package into view without moving the page', seen && Math.abs((await p.evaluate(() => scrollY)) - y0) < 5);
    // the visitor estimate: three figures, each with its range, under the word "estimate", with the planned-not-built note
    const crowd = await p.$eval('.crowd', c => ({ est: c.querySelector('.est').textContent.trim(), n: [...c.querySelectorAll('li strong')].map(x => x.textContent.replace(/\s+/g, ' ').trim()), spans: [...c.querySelectorAll('li small')].map(x => x.textContent.trim()), note: c.querySelector(':scope > p').textContent, how: !!c.querySelector('details summary') }));
    ok(lang + 'estimate: three figures under the word estimate, each with its range or its remainder', /^Estima(re|te)$/.test(crowd.est) && crowd.n.length === 3 && /50[.,]000/.test(crowd.n[0]) && /75[.,]000/.test(crowd.n[1]) && /^6 (din|in) 10$/.test(crowd.n[2]) && /32[.,]000.*77[.,]000/.test(crowd.spans[0]) && /45[.,]000.*110[.,]000/.test(crowd.spans[1]), crowd.n.join(' | '));
    ok(lang + 'estimate: says the park is planned and these are not counts, and offers the method', /(nu construit|not built)/.test(crowd.note) && /(nu numărători|not counts)/.test(crowd.note) && crowd.how);
    ok(lang + 'estimate: no reach, impression or unique-visitor figure anywhere on the page', !(await p.evaluate(() => /impresii|impressions|reach|vizitatori unici|unique visitors|140[.,]000|210[.,]000/i.test(document.body.innerText))));
    ok(lang + 'tiers: 7 price chips', (await p.$$eval('.ladder a', a => a.length)) === 7);
    ok(lang + 'tiers: 7 cards, 8 form options', tiers === 7 && opts === 8, tiers + '/' + opts);
    await p.locator('#shop').scrollIntoViewIfNeeded(); await p.waitForTimeout(1400);
    const hang = await p.$$eval('.rack-track .hang', l => l.length);
    ok(lang + 'rack: 12 pieces hang on the rail, all linking to the shop', hang === 12 && await p.$$eval('.rack-track a.piece', a => a.every(x => /shop\/\?lang=/.test(x.getAttribute('href')))), String(hang));
    ok(lang + 'rack: pieces are visible once on screen', await p.$$eval('.rack-track .piece', a => a.every(x => getComputedStyle(x).opacity === '1')));
    const r0 = await p.$eval('.rack-track', r => r.scrollLeft);
    await p.click('.rack [data-next]'); await p.waitForTimeout(900);
    const r1 = await p.$eval('.rack-track', r => r.scrollLeft);
    ok(lang + 'rack: arrow moves the rail', r1 > r0 + 100, r0 + ' -> ' + r1);
    const box = await p.$eval('.rack-track', r => { const b = r.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
    await p.mouse.move(box.x, box.y); await p.mouse.down(); await p.mouse.move(box.x + 200, box.y, { steps: 8 });
    const swing = await p.$$eval('.rack-track .hang', l => l.some(x => /rotate/.test(x.style.transform)));
    await p.mouse.up(); await p.waitForTimeout(300);
    const r2 = await p.$eval('.rack-track', r => r.scrollLeft);
    ok(lang + 'rack: dragging moves the rail and the pieces swing', r2 < r1 - 100 && swing, r1 + ' -> ' + r2 + ', swing ' + swing);
    ok(lang + 'rack: a drag does not open the shop', /index\.html/.test(p.url()) || !/shop/.test(p.url()), p.url());
    ok(lang + 'forms: sponsor and crew are Netlify forms', (await p.$$eval('form[data-netlify]', f => f.map(x => x.getAttribute('name')).join(','))) === 'crew,sponsor');
    ok(lang + 'pictures: every image has alt text and a tag', await p.$$eval('main img', i => i.every(x => x.alt.length > 3)) && await p.$$eval('main .media', m => m.every(x => x.querySelector('.tag'))));
    const dupe = await p.$$eval('main img', i => { const s = i.map(x => x.getAttribute('src')), d = s.filter((x, k) => s.indexOf(x) !== k); return [...new Set(d)]; });
    ok(lang + 'pictures: each used once', dupe.length === 0, dupe.join(', '));
    ok(lang + 'links: every in-page link has a target', await p.$$eval('a[href^="#"]', a => a.every(x => document.getElementById(x.getAttribute('href').slice(1)))));
    ok(lang + 'no script errors', errs.length === 0, errs.join(' | '));
    await p.close();
  }
  // Without JavaScript everything is still there
  const ctx = await b.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const q = await ctx.newPage(); await q.goto(base + '/index.html');
  ok('no JS: all 22 place cards are in the page', (await q.$$eval('.map-rail .card', l => l.filter(x => x.offsetParent !== null).length)) === 22);
  await q.locator('#park').scrollIntoViewIfNeeded(); await q.click('.spot[data-spot="4"] .disc'); await q.waitForTimeout(400);
  ok('no JS: a number on the plan still leads to its card', await q.evaluate(() => { const r = document.querySelector('.map-rail').getBoundingClientRect(); const c = document.getElementById('loc-4').getBoundingClientRect(); return location.hash === '#loc-4' && c.left >= r.left - 2 && c.left < r.right; }));
  const tiny = await q.$$eval('.spot', l => l.filter(a => { const r = [...a.querySelectorAll('.hit')].map(x => x.getBoundingClientRect()); const w = Math.max(...r.map(b => b.right)) - Math.min(...r.map(b => b.left)), h = Math.max(...r.map(b => b.bottom)) - Math.min(...r.map(b => b.top)); return w < 24 || h < 24; }).length);
  ok('phone: every room is a target of at least 24 by 24 px', tiny === 0, String(tiny));
  ok('no JS: arrows hidden, swipe hint shown', await q.$eval('.arrows', e => getComputedStyle(e).display === 'none') && await q.$eval('.swipe', e => getComputedStyle(e).display !== 'none'));
  ok('no JS: clothes on the rack are visible', await q.$$eval('.rack-track .piece', a => a.length === 12 && a.every(x => getComputedStyle(x).opacity === '1')));
  ok('no JS: no sideways overflow', await q.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await ctx.close();
  // Small phone and large desktop
  for (const [w, h] of [[360, 640], [768, 1024], [1920, 1080]]) {
    const r = await b.newPage({ viewport: { width: w, height: h } }); await r.goto(base + '/index.html'); await r.waitForTimeout(150);
    ok(`layout ${w}x${h}: no sideways overflow`, await r.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const clipped = await r.$$eval('.btn', bs => bs.filter(x => x.offsetParent && x.scrollWidth > x.clientWidth + 1).map(x => x.textContent.trim()));
    ok(`layout ${w}x${h}: no button text clipped`, clipped.length === 0, clipped.join(', '));
    const small = await r.$$eval('a.btn, button', bs => bs.filter(x => x.offsetParent && (x.getBoundingClientRect().height < 40)).map(x => x.textContent.trim() + ':' + Math.round(x.getBoundingClientRect().height)));
    ok(`layout ${w}x${h}: tap targets at least 40px tall`, small.length === 0, small.join(', '));
    await r.close();
  }
  await b.close();
})();
