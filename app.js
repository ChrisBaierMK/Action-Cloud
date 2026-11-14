(function () {
  "use strict";

  var SHOP = window.SHOP;
  var fmt = new Intl.NumberFormat("en-IE", { style: "currency", currency: SHOP.currency, maximumFractionDigits: 0 });
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };

  // ---------- garment drawings ----------
  var LOGO_RATIO = 256 / 472;

  function isLight(hex) {
    var n = parseInt(hex.slice(1), 16);
    return (((n >> 16) & 255) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 150;
  }

  function garment(kind, hex) {
    var light = isLight(hex);
    var ink = light ? "#141414" : "#ECC820";
    var shade = "rgba(0,0,0,.16)";
    var shine = light ? "rgba(255,255,255,.28)" : "rgba(255,255,255,.07)";
    var logo = function (x, y, w) {
      var file = light ? "img/action-cloud-logo-black.webp" : "img/action-cloud-logo-yellow.webp";
      return '<image href="' + file + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + (w * LOGO_RATIO).toFixed(1) + '"/>';
    };
    switch (kind) {
      case "hoodie":
        return '<svg viewBox="8 0 204 232" aria-hidden="true">' +
          '<path fill="' + hex + '" d="M78 30 Q110 4 142 30 L150 44 Q110 30 70 44 Z"/>' +
          '<path fill="' + hex + '" d="M70 40 Q110 56 150 40 L188 62 L206 196 L180 202 L166 98 L166 226 L54 226 L54 98 L40 202 L14 196 L32 62 Z"/>' +
          '<path fill="' + shine + '" d="M70 40 L32 62 L14 196 L24 198 L44 70 Z"/>' +
          '<path fill="' + shade + '" d="M82 40 Q110 62 138 40 Q110 50 82 40 Z"/>' +
          '<path fill="' + shade + '" d="M78 168 L142 168 L152 210 L68 210 Z"/>' +
          '<rect fill="' + shade + '" x="54" y="214" width="112" height="12"/>' +
          '<line x1="102" y1="50" x2="100" y2="92" stroke="' + ink + '" stroke-width="2"/>' +
          '<line x1="118" y1="50" x2="120" y2="92" stroke="' + ink + '" stroke-width="2"/>' +
          logo(72, 100, 76) + "</svg>";
      case "tee":
        return '<svg viewBox="14 14 192 216" aria-hidden="true">' +
          '<path fill="' + hex + '" d="M74 28 L92 20 Q110 34 128 20 L146 28 L200 66 L178 102 L160 92 L160 224 L60 224 L60 92 L42 102 L20 66 Z"/>' +
          '<path fill="' + shine + '" d="M74 28 L20 66 L42 102 L50 97 L34 68 Z"/>' +
          '<path fill="none" stroke="' + shade + '" stroke-width="4" d="M92 21 Q110 38 128 21"/>' +
          logo(118, 56, 34) + "</svg>";
      case "cap":
        return '<svg viewBox="28 52 164 150" aria-hidden="true">' +
          '<path fill="' + hex + '" d="M36 156 Q36 64 110 60 Q184 64 184 156 Q110 142 36 156 Z"/>' +
          '<path fill="' + shine + '" d="M36 156 Q36 78 92 63 Q52 90 48 154 Z"/>' +
          '<g fill="none" stroke="' + shade + '" stroke-width="2.5"><path d="M110 62 Q72 96 62 150"/><path d="M110 62 Q148 96 158 150"/><path d="M110 62 V146"/></g>' +
          '<path fill="' + hex + '" d="M50 150 Q110 140 170 150 Q186 168 172 184 Q110 200 48 184 Q34 168 50 150 Z"/>' +
          '<path fill="' + shade + '" d="M50 150 Q110 140 170 150 Q186 168 172 184 Q110 200 48 184 Q34 168 50 150 Z"/>' +
          '<path fill="rgba(0,0,0,.22)" d="M50 150 Q110 140 170 150 L168 156 Q110 147 52 156 Z"/>' +
          '<circle fill="' + hex + '" cx="110" cy="62" r="6"/><circle fill="' + shade + '" cx="110" cy="62" r="6"/>' +
          logo(66, 96, 88) + "</svg>";
      case "beanie":
        return '<svg viewBox="36 24 148 184" aria-hidden="true">' +
          '<circle fill="' + hex + '" cx="110" cy="50" r="22"/><circle fill="' + shade + '" cx="110" cy="50" r="22"/>' +
          '<path fill="' + hex + '" d="M50 164 Q46 70 110 66 Q174 70 170 164 Z"/>' +
          '<g stroke="' + shade + '" stroke-width="3"><line x1="74" y1="90" x2="70" y2="160"/><line x1="92" y1="76" x2="90" y2="160"/><line x1="110" y1="70" x2="110" y2="160"/><line x1="128" y1="76" x2="130" y2="160"/><line x1="146" y1="90" x2="150" y2="160"/></g>' +
          '<rect fill="' + hex + '" x="44" y="156" width="132" height="46" rx="8"/><rect fill="' + shade + '" x="44" y="156" width="132" height="46" rx="8"/>' +
          '<rect fill="#141414" x="80" y="164" width="60" height="32" rx="2"/>' +
          '<image href="img/action-cloud-logo-yellow.webp" x="85" y="167" width="50" height="27"/>' + "</svg>";
    }
    return "";
  }

  var HANGER = '<svg class="hanger" viewBox="0 0 160 60" aria-hidden="true"><path d="M80 24 V14 a8 8 0 1 0 -8 -8" /><path d="M80 24 L12 54 H148 Z"/></svg>';
  var CLIP = '<svg class="clip" viewBox="0 0 40 60" preserveAspectRatio="none" aria-hidden="true"><path d="M20 60 V14 a8 8 0 1 0 -8 -8"/></svg>';

  // ---------- the rack: one hanging piece per product colour ----------
  var track = $("track");
  var pieces = [];

  SHOP.products.forEach(function (p) {
    p.colors.forEach(function (c, ci) {
      var li = document.createElement("li");
      li.className = "hang hang-" + p.kind;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "piece";
      btn.setAttribute("aria-label", p.name + ", " + c.name + ", " + fmt.format(p.price));
      btn.innerHTML = (p.kind === "hoodie" || p.kind === "tee" ? HANGER : CLIP) +
        '<span class="cloth">' + garment(p.kind, c.hex) + "</span>" +
        '<span class="label"><b>' + p.name + "</b><span>" + fmt.format(p.price) + "</span></span>";
      btn.addEventListener("click", function () { openProduct(p, ci, btn.querySelector(".cloth")); });
      li.appendChild(btn);
      track.appendChild(li);
      pieces.push({ el: li, a: 0, w: 0, gain: 0.8 + Math.random() * 0.5 });
    });
  });

  // swing physics: each piece is a damped pendulum pushed by how fast the rack moves
  var dragging = false, coast = 0, moved = false, startX = 0, startScroll = 0, prevX = 0, vel = 0;
  var lastX = track.scrollLeft, running = false;
  function tick() {
    var x = track.scrollLeft, v = Math.max(-70, Math.min(70, x - lastX));
    lastX = x;
    var alive = Math.abs(v) > 0.05;
    for (var i = 0; i < pieces.length; i++) {
      var s = pieces[i];
      s.w += -0.055 * s.a - 0.085 * s.w + v * 0.045 * s.gain;
      s.a += s.w;
      if (s.a > 16) { s.a = 16; s.w = 0; } else if (s.a < -16) { s.a = -16; s.w = 0; }
      if (Math.abs(s.a) > 0.03 || Math.abs(s.w) > 0.03) { alive = true; s.el.style.transform = "rotate(" + s.a.toFixed(2) + "deg)"; }
      else { s.a = 0; s.w = 0; s.el.style.transform = ""; }
    }
    if (alive || dragging || coast) requestAnimationFrame(tick); else running = false;
  }
  function wake() { if (!running && !reduce) { running = true; lastX = track.scrollLeft; requestAnimationFrame(tick); } }
  track.addEventListener("scroll", wake, { passive: true });

  // mouse drag with a throw; touch uses the browser's own scrolling
  track.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    dragging = true; moved = false; coast = 0;
    startX = prevX = e.clientX; startScroll = track.scrollLeft; vel = 0;
  });
  window.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add("grabbing"); }
    if (moved) { track.scrollLeft = startScroll - dx; vel = prevX - e.clientX; prevX = e.clientX; wake(); }
  });
  window.addEventListener("pointerup", function () {
    if (!dragging) return;
    dragging = false; track.classList.remove("grabbing");
    if (moved && !reduce) { coast = vel; glide(); }
    if (moved) setTimeout(function () { moved = false; }, 0);
  });
  function glide() {
    if (Math.abs(coast) < 0.4) { coast = 0; return; }
    track.scrollLeft += coast; coast *= 0.92; wake();
    requestAnimationFrame(glide);
  }
  track.addEventListener("click", function (e) { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true);
  track.addEventListener("dragstart", function (e) { e.preventDefault(); });

  function nudge(dir) { track.scrollBy({ left: dir * track.clientWidth * 0.7, behavior: reduce ? "auto" : "smooth" }); }
  $("prev").addEventListener("click", function () { nudge(-1); });
  $("next").addEventListener("click", function () { nudge(1); });

  // one opening moment: the pieces arrive swinging and settle
  if (!reduce) { pieces.forEach(function (s, i) { s.a = 9 * (i % 2 ? 1 : -1) * (0.6 + Math.random() * 0.6); }); wake(); }

  // ---------- bag state ----------
  var KEY = "actioncloud-bag", bag = [];
  try { bag = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { bag = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(bag)); } catch (e) { /* storage unavailable */ } }
  function find(id) { return SHOP.products.filter(function (p) { return p.id === id; })[0]; }

  // ---------- product sheet ----------
  var dlg = $("product"), art = $("p-art"), cur = null;

  function drawProduct() {
    var p = cur.p, c = p.colors[cur.ci];
    art.innerHTML = garment(p.kind, c.hex);
    $("p-name").textContent = p.name;
    $("p-price").textContent = fmt.format(p.price);
    $("p-blurb").textContent = p.blurb;
    $("p-hint").textContent = "";
    $("p-colors").innerHTML = p.colors.map(function (k, i) {
      return '<button type="button" class="swatch" style="--c:' + k.hex + '" aria-label="' + k.name + '" aria-pressed="' + (i === cur.ci) + '" data-i="' + i + '"></button>';
    }).join("") + '<span class="color-name">' + c.name + "</span>";
    $("p-sizes").innerHTML = p.sizes.map(function (s) {
      return '<button type="button" role="radio" class="size" aria-checked="' + (s === cur.size) + '" data-s="' + s + '">' + s + "</button>";
    }).join("");
  }
  $("p-colors").addEventListener("click", function (e) {
    var b = e.target.closest(".swatch"); if (!b) return;
    cur.ci = +b.dataset.i; drawProduct(); $("p-colors").querySelector('[aria-pressed="true"]').focus();
  });
  $("p-sizes").addEventListener("click", function (e) {
    var b = e.target.closest(".size"); if (!b) return;
    cur.size = b.dataset.s; drawProduct(); $("p-sizes").querySelector('[aria-checked="true"]').focus();
  });

  function openProduct(p, ci, src) {
    cur = { p: p, ci: ci, size: p.sizes.length === 1 ? p.sizes[0] : null };
    var show = function () { drawProduct(); dlg.showModal(); };
    if (document.startViewTransition && !reduce && src) {
      src.style.viewTransitionName = "piece";
      var t = document.startViewTransition(function () {
        src.style.viewTransitionName = ""; show(); art.style.viewTransitionName = "piece";
      });
      t.finished.finally(function () { art.style.viewTransitionName = ""; });
    } else show();
  }

  $("p-add").addEventListener("click", function () {
    if (!cur.size) { $("p-hint").textContent = "Pick a size first."; var f = $("p-sizes").querySelector(".size"); if (f) f.focus(); return; }
    var c = cur.p.colors[cur.ci], key = cur.p.id + "|" + c.name + "|" + cur.size;
    var line = bag.filter(function (l) { return l.key === key; })[0];
    if (line) line.qty += 1; else bag.push({ key: key, id: cur.p.id, color: c.name, size: cur.size, qty: 1 });
    save(); renderBag(); dlg.close(); $("bag").showModal();
  });

  // ---------- bag drawer ----------
  function renderBag() {
    bag = bag.filter(function (l) { return find(l.id); });
    var count = 0, total = 0, list = $("bag-items");
    list.innerHTML = "";
    bag.forEach(function (l) {
      var p = find(l.id); count += l.qty; total += l.qty * p.price;
      var hex = (p.colors.filter(function (c) { return c.name === l.color; })[0] || p.colors[0]).hex;
      var li = document.createElement("li");
      li.innerHTML = '<div class="thumb">' + garment(p.kind, hex) + "</div>" +
        '<div><p class="line-name">' + p.name + '</p><p class="line-meta">' + l.color + ", " + l.size + "</p>" +
        '<div class="qty"><button type="button" aria-label="Remove one ' + p.name + '" data-d="-1">−</button><span>' + l.qty + '</span><button type="button" aria-label="Add one ' + p.name + '" data-d="1">+</button></div></div>' +
        '<p class="line-price">' + fmt.format(l.qty * p.price) + "</p>";
      li.querySelectorAll(".qty button").forEach(function (b) {
        b.addEventListener("click", function () {
          l.qty += +b.dataset.d; if (l.qty <= 0) bag.splice(bag.indexOf(l), 1);
          save(); renderBag();
        });
      });
      list.appendChild(li);
    });
    document.querySelector(".bag-count").textContent = count;
    $("bag-total").textContent = fmt.format(total);
    $("bag-empty").hidden = bag.length > 0;
    $("bag-foot").hidden = list.hidden = bag.length === 0;
  }

  $("open-bag").addEventListener("click", function () { $("bag").showModal(); });
  document.querySelectorAll("dialog").forEach(function (d) {
    d.addEventListener("click", function (e) { if (e.target === d || e.target.closest("[data-close]")) d.close(); });
  });
  $("checkout").addEventListener("click", function () {
    if (SHOP.checkoutUrl) { window.location.href = SHOP.checkoutUrl; return; }
    var n = $("checkout-notice"); n.hidden = false;
    n.innerHTML = 'Online checkout isn\'t open yet. Email <a href="mailto:chris@actioncloud.co?subject=Merch%20order">chris@actioncloud.co</a> with your bag and we\'ll sort it out.';
  });

  renderBag();
})();
