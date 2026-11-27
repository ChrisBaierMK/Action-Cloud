#!/bin/bash
# Builds docs/decks/dewalt.html into a PDF in the Higgsfield sandbox. Usage: bash setup.sh <sha>
set -e
S=$1; R=https://raw.githubusercontent.com/ChrisBaierMK/Action-Cloud/$S
C=https://d8j0ntlcm91z4.cloudfront.net/user_3KmvnmSnlHZl97Gv5M4VI8n9jkc
mkdir -p ~/deck/f ~/deck/i ~/deck/r && cd ~/deck
curl -sfL $R/docs/decks/dewalt.html -o deck.html
for p in "b400 barlow-latin-400" "b400x barlow-latin-ext-400" "b600 barlow-latin-600" "b600x barlow-latin-ext-600" "bc800 barlow-semi-condensed-latin-800" "bc800x barlow-semi-condensed-latin-ext-800"; do set -- $p; curl -sfL $R/assets/fonts/$2-normal.woff2 -o f/$1.woff2; done
curl -sfL $R/assets/img/logo-yellow.webp -o /tmp/ac.webp && convert /tmp/ac.webp -trim +repage i/ac.png
curl -sfL https://cheilegradistei.ro/images/logo.png -o i/cg.png
curl -sfL "https://vectorseek.com/wp-content/uploads/2023/08/Dewalt-Logo-Vector.svg-.png" -o /tmp/dw.png && convert /tmp/dw.png -fuzz 12% -trim +repage i/dewalt.png
curl -sf $C/hf_20261126_073040_277735e1-832e-4e0f-9ee2-c1c229304638.png -o /tmp/ext.png && convert /tmp/ext.png -resize 1400x -quality 82 i/ext.jpg
curl -sf $C/hf_20261125_231656_3e410122-9b44-4097-944a-c1e396e0591e.png -o /tmp/demo.png && convert /tmp/demo.png -resize 1200x -quality 82 i/demo.jpg
curl -sf $C/hf_20261125_230142_f744c7e9-5bbb-48ca-97b3-070583a1e159.png -o /tmp/crew.png && convert /tmp/crew.png -resize 1400x -quality 82 i/crew.jpg
for f in action-camp build-2012-2023 park-brasov event-night rider-inverted founder; do curl -sfL $R/assets/img/$f.webp -o /tmp/$f.webp && convert /tmp/$f.webp -quality 85 r/$f.jpg; done
for f in resort-aerial resort-terrace pepsi-airbag rider-air; do curl -sfL $R/docs/decks/real/$f.jpg -o r/$f.jpg; done
cat > mk.js <<'J'
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:960,height:1024}});
await p.goto('file://'+process.cwd()+'/deck.html');await p.waitForTimeout(1000);
await p.pdf({path:'Action-Cloud-x-DEWALT.pdf',width:'960px',height:'1024px',printBackground:true});
const n=await p.$$eval('section.p',s=>s.length);
for(let i=0;i<n;i++){const el=(await p.$$('section.p'))[i];await el.screenshot({path:`pg${i+1}.png`});}
const r=await p.$$eval('section.p',ss=>ss.map((s,i)=>{const f=s.querySelector('.foot');return (i+1)+':'+Math.round(f.getBoundingClientRect().bottom-s.getBoundingClientRect().top)+(s.scrollHeight>1024?' OVERFLOW '+s.scrollHeight:'')}));
console.log(r.join(' '));
const miss=await p.$$eval('img',is=>is.filter(i=>!i.naturalWidth).map(i=>i.src));console.log('missing',miss);
await b.close();})();
J
ls -la i r f
