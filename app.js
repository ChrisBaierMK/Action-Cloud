(function () {
  "use strict";

  var SHOP = window.SHOP;
  var fmt = new Intl.NumberFormat("en-IE", { style: "currency", currency: SHOP.currency, maximumFractionDigits: 0 });
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };

  // ---------- product photos ----------
  // One photo per product colour: img/p/<product id>-<colour name>.webp
  function garment(p, colorName) {
    return '<img src="img/p/' + p.id + "-" + colorName.toLowerCase() + '.webp" alt="" draggable="false" decoding="async">';
  }


  // ---------- the rack: one hanging piece per product colour ----------
  var track = $("track");
  var pieces = [];

  var shelf = $("shelf");
  SHOP.products.forEach(function (p) {
    var onShelf = p.kind === "cap" || p.kind === "beanie";
    p.colors.forEach(function (c, ci) {
      var li = document.createElement("li");
      li.className = (onShelf ? "sit sit-" : "hang hang-") + p.kind;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "piece";
      btn.setAttribute("aria-label", p.name + ", " + c.name + ", " + fmt.format(p.price));
      btn.innerHTML = '<span class="cloth">' + garment(p, c.name) + "</span>" +
        '<span class="label"><b>' + p.name + "</b><span>" + fmt.format(p.price) + "</span></span>";
      btn.addEventListener("click", function () { openProduct(p, ci, btn.querySelector(".cloth")); });
      li.appendChild(btn);
      (onShelf ? shelf : track).appendChild(li);
      if (!onShelf) pieces.push({ el: li, a: 0, w: 0, gain: 0.8 + Math.random() * 0.5 });
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
    art.innerHTML = garment(p, c.name);
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
      var li = document.createElement("li");
      li.innerHTML = '<div class="thumb">' + garment(p, l.color) + "</div>" +
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
