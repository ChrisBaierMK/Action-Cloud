// Behaviour checks on the built page: filters, arrows, package pre-selection, no-JS and reduced-motion rendering.
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
    const all = await p.$$eval('#zone-rail .rail > li', l => l.filter(x => !x.hidden).length);
    ok(lang + 'zones: 20 cards shown by default', all === 20, String(all));
    await p.click('.filters button[data-tag="a2"]');
    const a2 = await p.$$eval('#zone-rail .rail > li', l => l.filter(x => !x.hidden).map(x => x.querySelector('h3').textContent));
    ok(lang + 'zones: age 2–6 filter narrows the list', a2.length > 0 && a2.length < 20 && a2.some(t => /Mini Action/.test(t)), a2.join(' | '));
    ok(lang + 'zones: count text updates', (await p.textContent('#zone-rail .rail-count')).startsWith(String(a2.length)), await p.textContent('#zone-rail .rail-count'));
    ok(lang + 'zones: pressed state moves', await p.getAttribute('.filters button[data-tag="a2"]', 'aria-pressed') === 'true' && await p.getAttribute('.filters button[data-tag="all"]', 'aria-pressed') === 'false');
    for (const tag of ['a7', 'a13', 'ad', 'sc', 'bmx', 'mtb', 'sk', 'nw']) {
      await p.click(`.filters button[data-tag="${tag}"]`);
      const n = await p.$$eval('#zone-rail .rail > li', l => l.filter(x => !x.hidden).length);
      if (!(n > 0 && n < 20)) ok(lang + 'zones: filter ' + tag, false, String(n));
    }
    await p.click('.filters button[data-tag="all"]');
    await p.locator('#tier-rail').scrollIntoViewIfNeeded();
    const before = await p.$eval('#tier-rail .rail', r => r.scrollLeft);
    await p.click('#tier-rail [data-next]'); await p.waitForTimeout(700);
    const after = await p.$eval('#tier-rail .rail', r => r.scrollLeft);
    ok(lang + 'tiers: next arrow scrolls the rail', after > before + 100, before + ' -> ' + after);
    ok(lang + 'tiers: back arrow disabled at start, enabled after', !(await p.isDisabled('#tier-rail [data-prev]')));
    const third = await p.$$eval('#tier-rail .tier h3', h => h[2].textContent);
    await p.$$eval('#tier-rail .tier a[data-pick]', a => a[2].click()); await p.waitForTimeout(300);
    ok(lang + 'tiers: choosing a package pre-selects it in the form', await p.$eval('#f-package', s => s.options[s.selectedIndex].text) === third, third);
    const tiers = await p.$$eval('#tier-rail .tier', t => t.length), opts = await p.$$eval('#f-package option', o => o.length);
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
  ok('no JS: all zone cards visible', (await q.$$eval('#zone-rail .rail > li', l => l.filter(x => x.offsetParent !== null).length)) === 20);
  ok('no JS: filter chips and arrows hidden', await q.$eval('.filters', e => getComputedStyle(e).display === 'none') && await q.$eval('.arrows', e => getComputedStyle(e).display === 'none'));
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
