// Screenshots every slide of a built page at desktop and phone size and reports layout problems.
// usage: node shot.js <site dir> <out dir> [page]
const { chromium } = require('playwright');
const base = process.argv[2], out = process.argv[3], page = process.argv[4] || 'index.html';
(async () => {
  const b = await chromium.launch();
  for (const [name, w, h] of [['d', 1440, 900], ['m', 390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto('file://' + base + '/' + page);
    await p.evaluate(async () => {
      document.querySelectorAll('img').forEach(i => i.loading = 'eager');
      await document.fonts.ready;
      await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    });
    const info = await p.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      height: document.documentElement.scrollHeight,
      slides: [...document.querySelectorAll('.slide')].map(s => s.id + ':' + Math.round(s.getBoundingClientRect().height)),
      broken: [...document.images].filter(i => !i.naturalWidth).map(i => i.getAttribute('src')),
    }));
    console.log(name, JSON.stringify(info), errs.join(' | '));
    const secs = await p.$$('.slide');
    for (let i = 0; i < secs.length; i++) {
      const id = await secs[i].getAttribute('id');
      await secs[i].screenshot({ path: `${out}/${name}-${String(i).padStart(2, '0')}-${id}.png` });
    }
  }
  await b.close();
})();
