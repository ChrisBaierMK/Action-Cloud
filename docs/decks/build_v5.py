import re
h = open('deck.html').read()
p = re.split(r'(?=<section class="p">)', h)
head = p[0]
secs = p[1:]
secs[-1], tail = secs[-1].split('</section>', 1)
secs[-1] += '</section>\n\n'
old_outside, old_story, old_build = secs[1], secs[2], secs[3]

extra_css = '''
.card{background:var(--k2);border-top:4px solid var(--y);padding:16px 18px}
.card .kick{margin-bottom:4px}
.card h3{font-size:22px;margin-bottom:6px}
.card p{font-size:13px;color:#DDD7CC}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mega{font:800 92px/.85 BC;color:var(--y)}
.quote{font:800 30px/1.05 BC;text-transform:uppercase}
.ms{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.ms div{background:var(--k2);padding:14px 16px;border-left:4px solid var(--y)}
.ms b{font:800 30px/1 BC;color:var(--y);display:block}
.ms span{font:800 15px/1.1 BC;text-transform:uppercase;display:block;margin:6px 0 3px}
.ms p{font-size:12px;color:var(--m)}
</style>'''
head = head.replace('</style>', extra_css, 1)

TOP = lambda n, t, cg=False: (f'<div class="top"><img class="dw" src="i/dewalt.png"><span class="x">×</span><img src="i/ac.png">'
      + ('<span class="x">×</span><img class="cg" src="i/cg.png">' if cg else '')
      + f'<span class="sec">{n} · {t}</span><span class="tag">Guaranteed tough.</span></div>')
FOOT = lambda s='Action Cloud × Cheile Grădiștei · DEWALT proposal': f'<div class="foot"><span>{s}</span><b>Hărman · Brașov · RO</b></div>'
REAL = '<span class="viz" style="color:var(--y)">REAL PHOTO</span>'
VIZ = '<span class="viz">VISUALISATION</span>'

def renum(s, n, t):
    return re.sub(r'<span class="sec">[^<]*</span>', f'<span class="sec">{n} · {t}</span>', s, count=1)

# 1 COVER
cover = f'''<section class="p">
  {TOP("01","Proposal",True)}
  <div class="img" style="height:600px;flex:none"><img src="i/ext.jpg"><span class="lbl">Proposal · DEWALT Indoor Bikepark</span>{VIZ}</div>
  <div class="pad" style="padding-top:28px">
    <p class="kick">A partnership proposal for DEWALT Romania</p>
    <h1 style="font-size:64px">DEWALT Indoor Bikepark.</h1>
    <p class="lead" style="font-size:19px;color:var(--w);max-width:820px;margin-top:14px">We are moving Romania's largest indoor bikepark into the mountains. <span class="y">We want to build it with DEWALT.</span></p>
  </div>
  <div class="stripe" style="margin-top:auto"></div>
  {FOOT()}
</section>

'''

# 2 THE DEAL ON ONE PAGE
deal = f'''<section class="p">
  {TOP("02","The deal on one page")}
  <div class="pad" style="padding-bottom:16px">
    <p class="kick">If you read only one page, read this one</p>
    <h2>One building. One build story. <span class="y">One brand: DEWALT.</span></h2>
  </div>
  <div class="grid3" style="margin:0 32px">
    <div class="card"><p class="kick">What</p><h3>The building</h3><p>A 1,302 m² hall (21.35 × 61 m) named <b>DEWALT Indoor Bikepark</b>, wrapped in DEWALT yellow on the outside.</p></div>
    <div class="card"><p class="kick">Where</p><h3>Cheile Grădiștei</h3><p>Inside the Cheile Grădiștei Bike Park, Fundata: a mountain resort with 150,000+ visitors a year and international championships.</p></div>
    <div class="card"><p class="kick">Story</p><h3>The Build</h3><p>A reel series from demolition of the old park to the first drop-in, filmed with DEWALT tools in every shot. DEWALT gets the rights.</p></div>
  </div>
  <div class="grid2" style="margin:10px 32px 0">
    <div class="card"><p class="kick">Why DEWALT</p><h3>The tools build the sponsorship</h3><p>Most sponsors put a logo on something. Here the product does the work on camera: cutting, screwing and rebuilding 800 m² of ramps. It is "Guaranteed tough" shown, not said.</p></div>
    <div class="card"><p class="kick">Category</p><h3>The only tool brand</h3><p>The interior zones go to other partners, from other categories. No other tool brand anywhere in the building.</p></div>
  </div>
  <div style="margin:18px 32px 0;display:grid;grid-template-columns:1.15fr 1fr;gap:0;flex:none">
    <div class="yb" style="padding:22px 24px"><p class="kick">The investment</p><div class="mega" style="color:var(--k)">€135,000</div><p style="font-size:14px;margin-top:10px;font-weight:600">One partnership. Paid in 3 milestones, each one tied to something DEWALT can see: contract, hall standing, opening day.</p></div>
    <div style="background:#000;padding:22px 24px"><p class="kick">What that is per visitor</p><div style="font:800 52px/1 BC;color:var(--w)">€0.90</div><p style="font-size:13px;color:var(--m);margin-top:6px">per resort visitor in year one (€135,000 ÷ 150,000)</p><div style="font:800 40px/1 BC;color:var(--y);margin-top:12px">€0.18</div><p style="font-size:13px;color:var(--m);margin-top:6px">per visitor if the hall stands 5 years at today's visitor numbers. The building keeps working; the price is paid once.</p></div>
  </div>
  {FOOT()}
</section>

'''

# 3 STORY (existing)
story = renum(old_story, "03", "Our story")

# 4 WHY DEWALT
why = f'''<section class="p">
  {TOP("04","Why DEWALT")}
  <div class="img" style="height:430px;flex:none"><img src="i/demo.jpg"><span class="lbl">Reel 01 · Demolition</span>{VIZ}</div>
  <div class="pad" style="padding-bottom:18px">
    <p class="kick">The moment</p>
    <h2>We have to take the park apart. <span class="y">Then build it again, in the mountains.</span></h2>
    <p class="lead">This is not a logo on a banner. It is a real job, on camera, from start to finish: dismantle 800 m² of plywood ramps, move them, raise a 61 m hall and rebuild every ramp inside it. The tools that do that job are the story.</p>
  </div>
  <div class="grid3" style="margin:0 32px">
    <div class="card"><p class="kick">Real jobsite</p><h3>Not a studio shoot</h3><p>A real crew, real dust, real deadlines. Every cut and every screw is filmed as it happens.</p></div>
    <div class="card"><p class="kick">Real conditions</p><h3>1,300 m, Carpathians</h3><p>Built in the mountains through the cold season. Exactly where "Guaranteed tough" has to be true.</p></div>
    <div class="card"><p class="kick">Real result</p><h3>A park kids ride</h3><p>The proof is permanent: every ride on these ramps is a ride on something DEWALT tools built.</p></div>
  </div>
  {FOOT()}
</section>

'''

# 5 THE BUILD (existing, single big rebuild image instead of two)
b = old_build
b = renum(b, "05", "The Build · reel series")
b = re.sub(r'<div style="display:grid;grid-template-columns:1fr 1fr;flex:none">.*?</div>\s*</div>',
           f'<div class="img" style="height:380px;flex:none"><img src="i/crew.jpg"><span class="lbl">Reel 04 · The rebuild</span>{VIZ}</div>',
           b, count=1, flags=re.S)
build = b

# 6 OUTSIDE (existing)
outside = renum(old_outside, "06", "The outside")

# 7 VENUE + PROOF
venue = f'''<section class="p">
  {TOP("07","The venue",True)}
  <div class="img" style="height:360px;flex:none"><img src="r/resort-aerial.jpg"><span class="lbl">Cheile Grădiștei Bike Park</span>{REAL}</div>
  <div class="pad" style="padding-bottom:16px">
    <p class="kick">Fundata · 1,300 m · Carpathians</p>
    <h2>Big brands are already here. <span class="y">The tool category is open.</span></h2>
  </div>
  <div class="stats" style="margin:0 32px 12px">
    <div><b>150K+</b><span>annual visitors</span></div>
    <div><b>800+</b><span>beds · 5 hotels · 17 villas</span></div>
    <div><b>100+</b><span>international championships hosted</span></div>
    <div><b>FOTE</b><span>official 2027 venue · UCI · IBU · WES</span></div>
  </div>
  <div class="grid2" style="margin:0 32px">
    <div><div class="img" style="height:210px"><img src="r/pepsi-airbag.jpg"><span class="lbl">Pepsi · bike park airbags</span>{REAL}</div><div class="cap"><h3>Pepsi said yes</h3><p>Two branded airbags in the bike park, sponsored through an Action Cloud proposal like this one</p></div></div>
    <div><div class="img" style="height:210px"><img src="r/resort-terrace.jpg"><span class="lbl">The resort</span>{REAL}</div><div class="cap"><h3>Families, riders, skiers</h3><p>Hotels, villas and terraces around the bike park, busy in summer and winter</p></div></div>
  </div>
  {FOOT("Sources · Cheile Grădiștei · FRC · IBU · UEC · COSR")}
</section>

'''

# 8 OFFER
offer = f'''<section class="p">
  {TOP("08","The offer")}
  <div class="pad" style="padding-bottom:14px">
    <p class="kick">The offer</p>
    <h2>DEWALT builds it. <span class="y">€135,000.</span></h2>
  </div>
  <div style="margin:0 32px">
    <table class="tbl">
      <tr><th>What DEWALT gets</th><th>Details</th><th style="text-align:right"></th></tr>
      <tr><td class="n y">The name</td><td>"DEWALT Indoor Bikepark" on every sign, map and post that names the building</td><td class="pr">✓</td></tr>
      <tr><td class="n">The outside</td><td>Full wrap: roof, long walls, gable ends · gate banner + black-and-yellow stripes</td><td class="pr">✓</td></tr>
      <tr><td class="n">The Build</td><td>5 reels: demolition, move, hall goes up, rebuild, first drop-in · opening film</td><td class="pr">✓</td></tr>
      <tr><td class="n">The rights</td><td>Raw footage and finished reels for DEWALT channels, ads and PR</td><td class="pr">✓</td></tr>
      <tr><td class="n">The category</td><td>Only tool brand in the building · first right on the next phase</td><td class="pr">✓</td></tr>
    </table>
  </div>
  <div class="pad" style="padding-top:20px;padding-bottom:0">
    <p class="kick">How DEWALT pays · 3 milestones, nothing paid for promises</p>
    <div class="ms">
      <div><b>50%</b><span>At signature</span><p>Hall ordered. Reel 01 (demolition) starts filming.</p></div>
      <div><b>30%</b><span>Hall standing</span><p>DEWALT wrap visible in the bike park. Reels 02–03 out.</p></div>
      <div><b>20%</b><span>Opening day</span><p>First drop-in, opening film, Reels 04–05 out.</p></div>
    </div>
  </div>
  <div class="pad" style="padding-top:18px">
    <p class="kick">The next step is small</p>
    <p style="font:800 24px/1.15 BC;text-transform:uppercase">A 20-minute call. We show you the hall plan and the reel plan. <span class="y">You decide after that.</span></p>
  </div>
  <div class="stripe" style="margin-top:auto"></div>
  <div class="yb" style="padding:22px 32px;display:flex;justify-content:space-between;align-items:center;flex:none">
    <div><p class="kick">Contact</p><h2 style="color:var(--k)">Christoph Baier</h2><p style="font-size:15px">Founder · Action Cloud</p></div>
    <div style="text-align:right;font:800 20px/1.4 BC;text-transform:uppercase">actioncloud.ro<br>@action.cloud</div>
  </div>
  {FOOT("Action Cloud × Cheile Grădiștei · DEWALT proposal · visualisations are illustrative")}
</section>

'''

open('deck.html', 'w').write(head + cover + deal + story + why + build + outside + venue + offer + tail)
print('ok')
