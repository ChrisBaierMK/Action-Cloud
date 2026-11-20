// Behaviour checks on the built page: the clickable plan, arrows, the sponsor packages, the one form, no-JS and small screens.
const { chromium } = require('playwright');
const base = 'file://' + process.argv[2];
const ok = (name, cond, extra) => console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : ''));
(async () => {
  // the redirect of the short address needs a real server; everything else runs from the files
  const http = require('http'), fs = require('fs'), path = require('path');
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const server = http.createServer((q, r) => { let f = path.join(process.argv[2], decodeURIComponent(q.url.split('?')[0])); if (f.endsWith(path.sep) || (fs.existsSync(f) && fs.statSync(f).isDirectory())) f = path.join(f, 'index.html'); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); } }); });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  const web = 'http://127.0.0.1:' + server.address().port;
  const b = await chromium.launch();
  for (const lang of ['', 'en/']) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const errs = []; p.on('pageerror', e => errs.push(String(e)));
    await p.goto(base + '/' + lang + 'index.html');
    await p.waitForTimeout(200);
    await p.locator('#park').scrollIntoViewIfNeeded();
    const cur = () => p.$$eval('.spot[aria-current]', l => l.map(x => x.getAttribute('data-spot')).join());
    const spots = await p.$$eval('.spot', l => l.map(x => x.getAttribute('data-spot')).join(','));
    ok(lang + 'plan: every number from 1 to 20 is on the picture once, in order', spots === Array.from({ length: 20 }, (_, i) => i + 1).join(','), spots);
    ok(lang + 'plan: every room links to a card that exists and is named for screen readers', await p.$$eval('.spot', l => l.every(x => document.getElementById(x.getAttribute('href').slice(1)) && x.textContent.trim().length > 4)));
    const nums = await p.$$eval('.map-rail > li', l => l.map(x => x.querySelector('.num').lastChild.textContent.trim() === x.getAttribute('data-n')));
    const order = await p.$$eval('.map-rail > li', l => l.map(x => +x.getAttribute('data-n')));
    ok(lang + 'plan: 21 cards in the order of their numbers, each carrying its number', nums.length === 21 && nums.every(Boolean) && order.every((n, i) => i === 0 || n >= order[i - 1]), order.join(','));
    ok(lang + 'plan: room 1 is chosen at the start', (await cur()) === '1' && (await p.$$eval('.chips a[aria-current]', l => l.map(x => x.getAttribute('data-group')).join())) === 'w');
    // the rooms cover the whole picture: a tap anywhere chooses exactly one
    const holes = await p.evaluate(() => { const b = document.querySelector('.map-pic').getBoundingClientRect(); let bad = 0; for (let y = 2; y < 100; y += 4) for (let x = 2; x < 100; x += 4) { const e = document.elementFromPoint(b.left + b.width * x / 100, b.top + b.height * y / 100); if (!e || !e.closest('.spot')) bad++; } return bad; });
    ok(lang + 'plan: a tap anywhere on the picture lands in a room', holes === 0, String(holes));
    const y0map = await p.evaluate(() => scrollY);
    const pb = await p.$eval('.map-pic', e => { const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; });
    await p.mouse.click(pb.x + pb.w * 0.80, pb.y + pb.h * 0.55); await p.waitForTimeout(250);   // the floor of room 8, away from its disc
    const shown = await p.evaluate(() => { const r = document.querySelector('.map-rail').getBoundingClientRect(); const c = document.getElementById('loc-8').getBoundingClientRect(); return c.left >= r.left - 2 && c.right <= r.right + 2; });
    ok(lang + 'plan: a tap on the floor of a room brings up its card and lights its number', shown && (await cur()) === '8' && (await p.$$eval('.chips a[aria-current]', l => l.map(x => x.getAttribute('data-group')).join())) === 'j');
    ok(lang + 'plan: choosing a room does not move the page or the address', Math.abs((await p.evaluate(() => scrollY)) - y0map) < 3 && !/#loc/.test(p.url()));
    ok(lang + 'plan: screen readers hear which place came up', (await p.$eval('[data-say]', e => e.textContent)).length > 10);
    await p.click('.map-side [data-next]'); await p.waitForTimeout(800);
    ok(lang + 'plan: the arrow goes to the next place and the number follows', (await cur()) === '9');
    await p.click('.chips a[data-group="s"]'); await p.waitForTimeout(250);
    ok(lang + 'plan: a group chip jumps to its first place', (await cur()) === '15');
    await p.mouse.click(pb.x + pb.w * 0.69, pb.y + pb.h * 0.50); await p.waitForTimeout(250);
    await p.click('.map-side [data-next]'); await p.waitForTimeout(800);
    ok(lang + 'plan: room 7 has two cards under the same number', (await cur()) === '7' && await p.evaluate(() => { const r = document.querySelector('.map-rail').getBoundingClientRect(); const c = document.getElementById('loc-7-2').getBoundingClientRect(); return Math.abs(c.left - r.left) < 4; }));
    // with a mouse, resting on a room is enough; the page itself does not move
    await p.locator('#park').scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
    const hb = await p.$eval('.map-pic', e => { const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; });
    const yh = await p.evaluate(() => scrollY);
    await p.mouse.move(hb.x + hb.w * 0.10, hb.y + hb.h * 0.08, { steps: 4 }); await p.waitForTimeout(400);   // the floor of room 2, away from its disc
    const up3 = await p.evaluate(() => { const r = document.querySelector('.map-rail').getBoundingClientRect(); const c = document.getElementById('loc-2').getBoundingClientRect(); return Math.abs(c.left - r.left) < 4; });
    ok(lang + 'plan: resting the mouse on a room brings up its card and lights its number', up3 && (await cur()) === '2');
    await p.mouse.move(hb.x + hb.w * 0.59, hb.y + hb.h * 0.08, { steps: 3 }); await p.mouse.move(hb.x + hb.w * 0.59, hb.y - 60, { steps: 2 }); await p.waitForTimeout(400);
    ok(lang + 'plan: a fast pass over other rooms on the way out changes nothing', (await cur()) === '2');
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
    ok(lang + 'form: the page has one form, a Netlify form named action', (await p.$$eval('form', f => f.map(x => x.getAttribute('name') + (x.hasAttribute('data-netlify') ? '' : '!')).join(','))) === 'action');
    ok(lang + 'form: a package chosen on its card opens the form on the sponsor answer, with the package stored under its Romanian name', await p.$eval('input[name="ajutor"]:checked', c => c.getAttribute('data-key')) === 'sponsor' && !(await p.$eval('[data-group="sponsor"]', g => g.hidden)) && /^Partener de /.test(await p.$eval('#f-package', x => x.value)));
    ok(lang + 'form: the old anchors crew, join and contact are still on the form stop', await p.evaluate(() => ['crew', 'join', 'contact'].every(id => document.getElementById(id) && document.getElementById(id).closest('#action'))));
    // the one form: one question, then one short line for the chosen answer, then name and contact
    const act = pg => pg.evaluate(() => { const f = document.querySelector('form[name="action"]'), c = f.querySelector('input[name="ajutor"]:checked'), seen = e => e.offsetParent !== null && !e.closest('.hp'), bar = document.querySelector('.bar').getBoundingClientRect().bottom, box = e => e.getBoundingClientRect(); const row = c && box(c.closest('.choice')), send = box(f.querySelector('button[type=submit]')), ct = f.querySelector('[data-contact]'); return { n: f.querySelectorAll('input[name="ajutor"]').length, key: c ? c.getAttribute('data-key') : '', open: [...f.querySelectorAll('[data-group]')].filter(g => !g.hidden).map(g => g.getAttribute('data-group')).join(), rest: !f.querySelector('[data-rest]').hidden, rows: [...f.querySelectorAll('.choice')].filter(seen).length, fields: [...f.querySelectorAll('input:not([type=radio]):not([type=hidden]), select, textarea')].filter(seen).length, send: send.top >= bar && send.bottom <= innerHeight, rowSeen: !!row && row.top >= bar - 1 && row.bottom <= innerHeight, contact: ct.type + '/' + f.querySelector('label[for="a-contact"] [data-label]').textContent, subject: f.querySelector('[name=subject]').value, wide: document.documentElement.scrollWidth - innerWidth }; });
    const ph = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
    await ph.goto(base + '/' + lang + 'index.html'); await ph.waitForTimeout(300);
    const f0 = await act(ph);
    ok(lang + 'form: five answers, nothing chosen and no fields until one is', f0.n === 5 && f0.rows === 5 && f0.key === '' && f0.open === '' && !f0.rest && f0.fields === 0, JSON.stringify(f0));
    await ph.click('.hero .actions a[data-tip="stiri"]'); await ph.waitForTimeout(1500);
    const f1 = await act(ph);
    ok(lang + 'form: "Join the Action Crew" shows the news answer alone, asks for name and email, and Send is on screen', f1.key === 'stiri' && f1.open === 'stiri' && f1.rows === 1 && f1.fields === 2 && /^email\/E-?mail$/.test(f1.contact) && f1.send && f1.rowSeen && /noutăți/.test(f1.subject), JSON.stringify(f1));
    await ph.click('[data-change]'); await ph.waitForTimeout(200);
    const f1b = await act(ph);
    await ph.click('.choice:has(input[data-key="afacere"])'); await ph.waitForTimeout(900);
    const f2 = await act(ph);
    ok(lang + 'form: "Change the answer" brings the five back; another answer swaps the one line and keeps its row and Send on screen', f1b.rows === 5 && f2.key === 'afacere' && f2.open === 'afacere' && f2.rows === 1 && f2.fields === 3 && /^text\//.test(f2.contact) && f2.send && f2.rowSeen && /AFACERE/.test(f2.subject) && f2.wide <= 0, JSON.stringify(f2));
    const most = [];
    for (const k of ['spatiu', 'sponsor', 'afacere', 'crew', 'stiri']) { await ph.click('[data-change]'); await ph.click('.choice:has(input[data-key="' + k + '"])'); await ph.waitForTimeout(150); const a = await act(ph); most.push(a.fields + (a.send && a.rowSeen ? '' : '!')); }
    ok(lang + 'form: no answer asks for more than four fields, and each keeps its row and Send on a phone screen', most.every(x => /^[1-4]$/.test(x)), most.join(','));
    // what is accepted as a way to reach the person, and what is sent
    const valid = await ph.evaluate(() => { const f = document.querySelector('form[name="action"]'); document.querySelector('[data-change]').click(); f.querySelector('input[data-key="sponsor"]').click(); const n = f.querySelector('#a-name'), c = f.querySelector('#a-contact'); const t = (name, v) => { n.value = name; c.value = v; return f.checkValidity(); }; const r = { bad: [t('Ana', 'x'), t('Ana', '   '), t('Ana', '0722'), t('Ana', 'ana@gmail'), t('  ', '0722 123 456')], good: [t('Ana', '0722 123 456'), t('Ana', '+40 722 123 456'), t('Ana', 'ana@example.com')] }; f.querySelector('#a-company').value = 'Firma'; f.querySelector('#a-space').value = 'nu trebuie trimis'; t('Ana', '0722 123 456'); let sent = null; f.addEventListener('submit', e => { e.preventDefault(); sent = [...new FormData(f).keys()].join(); }); f.querySelector('button[type=submit]').click(); r.sent = sent; return r; });
    ok(lang + 'form: the contact must look like a phone number or an email address, and the name cannot be blank', valid.bad.every(x => x === false) && valid.good.every(x => x === true), JSON.stringify(valid));
    ok(lang + 'form: only the chosen line is sent', valid.sent === 'form-name,language,subject,bot-field,ajutor,sponsor-firma,pachet,name,contact', String(valid.sent));
    for (const [tip, key] of [['spatiu', 'spatiu'], ['cunosc', 'spatiu'], ['SPONSOR', 'sponsor'], ['<script>', '']]) {
      await ph.goto(base + '/' + lang + 'index.html?tip=' + encodeURIComponent(tip) + '#action'); await ph.waitForTimeout(800);
      const t = await act(ph);
      ok(lang + 'form: a link with ?tip=' + tip + (key ? ' opens on its answer with the fields and Send on screen' : ' does no harm'), t.key === key && (key ? t.rows === 1 && t.send && t.rowSeen : t.rows === 5 && !t.rest), JSON.stringify(t));
    }
    await ph.goto(base + '/' + lang + 'index.html#crew'); await ph.waitForTimeout(800);
    ok(lang + 'form: the old sign-up link #crew opens the news answer', (await act(ph)).key === 'stiri');
    await ph.close();
    // a laptop: a double click keeps its answer, nothing slides under the top bar, and at the very end of the page the question is still in sight
    for (const [w, h] of [[1440, 900], [1366, 650], [1024, 768]]) {
      const lp = await b.newPage({ viewport: { width: w, height: h } });
      await lp.goto(base + '/' + lang + 'index.html'); await lp.waitForTimeout(300);
      await lp.keyboard.press('End'); await lp.waitForTimeout(900);
      const end = await lp.evaluate(() => { const bar = document.querySelector('.bar').getBoundingClientRect().bottom, l = document.querySelector('.choices legend').getBoundingClientRect(), r = [...document.querySelectorAll('.choice')].map(x => x.getBoundingClientRect()); return l.top >= bar - 1 && r.every(x => x.top >= bar && x.bottom <= innerHeight); });
      await lp.dblclick('.choice:has(input[data-key="crew"])'); await lp.waitForTimeout(900);
      const dc = await act(lp);
      ok(lang + `form at ${w}x${h}: at the end of the page the question and all five answers are in sight; a double click keeps its answer, its row and Send on screen`, end && dc.key === 'crew' && dc.rowSeen && dc.send, JSON.stringify({ end, key: dc.key, row: dc.rowSeen, send: dc.send }));
      await lp.close();
    }
    // the short address, followed for real over http
    const rd = await b.newPage({ viewport: { width: 390, height: 844 } });
    await rd.goto(web + '/' + lang + 'action/?tip=cunosc'); await rd.waitForTimeout(900);
    const stub = require('fs').readFileSync(process.argv[2] + '/' + lang + 'action/index.html', 'utf8');
    ok(lang + 'form: the short address sends people on to the form and keeps the chosen answer', new URL(rd.url()).pathname === '/' + lang && /tip=cunosc/.test(rd.url()) && /#action$/.test(rd.url()) && (await act(rd)).key === 'spatiu' && stub.includes('og-action.jpg') && stub.includes('<noscript><meta http-equiv="refresh" content="0; url=../#action"></noscript>') && !stub.includes('<form'), rd.url());
    await rd.close();
    ok(lang + 'shop: the clothing shop is gone from the page (no stop, no link, no clothes rail)', !(await p.$('#shop')) && !(await p.$('.rack')) && (await p.$$eval('a[href]', l => l.filter(a => /(^|\/)shop\//.test(a.getAttribute('href'))).length)) === 0 && !require('fs').existsSync(process.argv[2] + '/shop'));
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
  ok('no JS: all 21 place cards are in the page', (await q.$$eval('.map-rail .card', l => l.filter(x => x.offsetParent !== null).length)) === 21);
  await q.locator('#park').scrollIntoViewIfNeeded(); await q.click('.spot[data-spot="4"] .disc'); await q.waitForTimeout(400);
  ok('no JS: a number on the plan still leads to its card', await q.evaluate(() => { const r = document.querySelector('.map-rail').getBoundingClientRect(); const c = document.getElementById('loc-4').getBoundingClientRect(); return location.hash === '#loc-4' && c.left >= r.left - 2 && c.left < r.right; }));
  const tiny = await q.$$eval('.spot', l => l.filter(a => { const r = [...a.querySelectorAll('.hit')].map(x => x.getBoundingClientRect()); const w = Math.max(...r.map(b => b.right)) - Math.min(...r.map(b => b.left)), h = Math.max(...r.map(b => b.bottom)) - Math.min(...r.map(b => b.top)); return w < 24 || h < 24; }).length);
  ok('phone: every room is a target of at least 24 by 24 px', tiny === 0, String(tiny));
  ok('no JS: arrows hidden, swipe hint shown', await q.$eval('.arrows', e => getComputedStyle(e).display === 'none') && await q.$eval('.swipe', e => getComputedStyle(e).display !== 'none'));
  ok('no JS: the form shows every line and can still be sent', (await q.$$eval('form[name="action"] [data-group]', l => l.filter(g => g.offsetParent !== null).length)) === 5 && (await q.$$eval('form[name="action"] [required]', l => l.map(x => x.name).filter(n => n !== 'ajutor').join())) === 'name,contact');
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
  server.close();
})();
