(function () {
  "use strict";

  var SHOP = window.SHOP;
  var fmt = new Intl.NumberFormat("en-IE", { style: "currency", currency: SHOP.currency, maximumFractionDigits: 0 });
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- garment drawings ----------
  var MARK = '<g class="mark"><path d="M14 36a11 11 0 0 1-1.6-21.9A15 15 0 0 1 41 9.5 11 11 0 0 1 56 20a8 8 0 0 1-2 16Z"/></g>';

  function garment(kind, hex) {
    var ink = isLight(hex) ? "#1B2A4A" : "#FFFFFF";
    var shade = "rgba(0,0,0,.14)";
    var mark = function (x, y, s) {
      return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="none" stroke="' + ink + '" stroke-width="5">' + MARK + "</g>";
    };
    switch (kind) {
      case "hoodie":
        return (
          '<svg viewBox="0 0 220 240" role="img" aria-hidden="true">' +
          '<path fill="' + hex + '" d="M78 30 Q110 4 142 30 L150 44 Q110 30 70 44 Z"/>' +
          '<path fill="' + hex + '" d="M70 40 Q110 56 150 40 L188 62 L206 196 L180 202 L166 98 L166 226 L54 226 L54 98 L40 202 L14 196 L32 62 Z"/>' +
          '<path fill="' + shade + '" d="M82 40 Q110 62 138 40 Q110 50 82 40 Z"/>' +
          '<path fill="' + shade + '" d="M78 168 L142 168 L152 210 L68 210 Z"/>' +
          '<rect fill="' + shade + '" x="54" y="214" width="112" height="12"/>' +
          '<line x1="102" y1="50" x2="100" y2="92" stroke="' + ink + '" stroke-width="2"/>' +
          '<line x1="118" y1="50" x2="120" y2="92" stroke="' + ink + '" stroke-width="2"/>' +
          mark(88, 104, 0.7) +
          "</svg>"
        );
      case "tee":
        return (
          '<svg viewBox="0 0 220 240" role="img" aria-hidden="true">' +
          '<path fill="' + hex + '" stroke="rgba(0,0,0,.12)" stroke-width="1.5" d="M74 28 L92 20 Q110 34 128 20 L146 28 L200 66 L178 102 L160 92 L160 224 L60 224 L60 92 L42 102 L20 66 Z"/>' +
          '<path fill="none" stroke="' + shade + '" stroke-width="4" d="M92 21 Q110 38 128 21"/>' +
          mark(122, 62, 0.42) +
          "</svg>"
        );
      case "cap":
        return (
          '<svg viewBox="0 0 220 240" role="img" aria-hidden="true">' +
          '<path fill="' + hex + '" d="M38 150 Q40 70 112 66 Q176 66 184 150 Z"/>' +
          '<path fill="' + shade + '" d="M110 66 Q100 100 104 150 L98 150 Q94 100 110 66 Z"/>' +
          '<path fill="' + hex + '" d="M150 146 Q206 140 214 160 Q190 176 140 162 Z"/>' +
          '<path fill="' + shade + '" d="M150 146 Q206 140 214 160 Q180 156 146 156 Z"/>' +
          '<circle fill="' + shade + '" cx="111" cy="68" r="5"/>' +
          mark(52, 92, 0.62) +
          "</svg>"
        );
      case "beanie":
        return (
          '<svg viewBox="0 0 220 240" role="img" aria-hidden="true">' +
          '<circle fill="' + hex + '" cx="110" cy="50" r="22"/>' +
          '<circle fill="' + shade + '" cx="110" cy="50" r="22"/>' +
          '<path fill="' + hex + '" d="M50 164 Q46 70 110 66 Q174 70 170 164 Z"/>' +
          '<g stroke="' + shade + '" stroke-width="3">' +
          '<line x1="74" y1="90" x2="70" y2="160"/><line x1="92" y1="76" x2="90" y2="160"/><line x1="110" y1="70" x2="110" y2="160"/><line x1="128" y1="76" x2="130" y2="160"/><line x1="146" y1="90" x2="150" y2="160"/>' +
          "</g>" +
          '<rect fill="' + hex + '" x="44" y="156" width="132" height="46" rx="8"/>' +
          '<rect fill="' + shade + '" x="44" y="156" width="132" height="46" rx="8"/>' +
          '<rect fill="#FFFFFF" x="92" y="168" width="36" height="22" rx="2"/>' +
          '<g transform="translate(97 171) scale(.42)" fill="none" stroke="#1B2A4A" stroke-width="6">' + MARK + "</g>" +
          "</svg>"
        );
    }
    return "";
  }

  function isLight(hex) {
    var n = parseInt(hex.slice(1), 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
  }

  // ---------- rack ----------
  var rack = document.getElementById("rack");

  SHOP.products.forEach(function (p) {
    var li = document.createElement("li");
    li.className = "item item-" + p.kind;
    var state = { color: p.colors[0], size: p.sizes.length === 1 ? p.sizes[0] : null };

    var hanger = p.kind === "hoodie" || p.kind === "tee"
      ? '<svg class="hanger" viewBox="0 0 120 40" aria-hidden="true"><path d="M60 2 a6 6 0 1 1 6 6 q-6 2 -6 8 L8 36 h104 L60 16"/></svg>'
      : '<svg class="hook" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 0 v22 a8 8 0 1 1 -8 8"/></svg>';

    var swatches = p.colors.map(function (c, i) {
      return '<button type="button" class="swatch" style="--c:' + c.hex + '" aria-label="' + c.name + '" aria-pressed="' + (i === 0) + '" data-i="' + i + '"></button>';
    }).join("");

    var sizes = p.sizes.length === 1
      ? '<p class="one-size">One size</p>'
      : '<fieldset class="sizes"><legend>Size</legend>' + p.sizes.map(function (s) {
          return '<label><input type="radio" name="size-' + p.id + '" value="' + s + '"><span>' + s + "</span></label>";
        }).join("") + "</fieldset>";

    li.innerHTML =
      hanger +
      '<div class="art">' + garment(p.kind, state.color.hex) + "</div>" +
      '<div class="tag">' +
        '<h3>' + p.name + "</h3>" +
        '<p class="price">' + fmt.format(p.price) + "</p>" +
        '<p class="blurb">' + p.blurb + "</p>" +
        '<div class="swatches" role="group" aria-label="Colour">' + swatches + '<span class="color-name">' + state.color.name + "</span></div>" +
        sizes +
        '<button type="button" class="btn add">Add to bag</button>' +
        '<p class="hint" role="status"></p>' +
      "</div>";

    var art = li.querySelector(".art");
    var colorName = li.querySelector(".color-name");
    var hint = li.querySelector(".hint");

    li.querySelectorAll(".swatch").forEach(function (b) {
      b.addEventListener("click", function () {
        state.color = p.colors[+b.dataset.i];
        li.querySelectorAll(".swatch").forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        art.innerHTML = garment(p.kind, state.color.hex);
        colorName.textContent = state.color.name;
      });
    });

    li.querySelectorAll('input[type="radio"]').forEach(function (r) {
      r.addEventListener("change", function () {
        state.size = r.value;
        hint.textContent = "";
        li.classList.remove("needs-size");
      });
    });

    li.querySelector(".add").addEventListener("click", function () {
      if (!state.size) {
        hint.textContent = "Pick a size first.";
        li.classList.add("needs-size");
        var first = li.querySelector('input[type="radio"]');
        if (first) first.focus();
        return;
      }
      addToBag(p, state.color, state.size);
      hint.textContent = "Added " + p.name + " (" + state.color.name + ", " + state.size + ") to your bag.";
    });

    rack.appendChild(li);
  });

  // ---------- bag ----------
  var KEY = "actioncloud-bag";
  var bag = load();

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(bag)); } catch (e) { /* storage unavailable */ }
  }
  function find(id) {
    for (var i = 0; i < SHOP.products.length; i++) if (SHOP.products[i].id === id) return SHOP.products[i];
    return null;
  }

  function addToBag(p, color, size) {
    var key = p.id + "|" + color.name + "|" + size;
    var line = bag.filter(function (l) { return l.key === key; })[0];
    if (line) line.qty += 1;
    else bag.push({ key: key, id: p.id, color: color.name, size: size, qty: 1 });
    save();
    renderBag();
    var count = document.querySelector(".bag-count");
    if (!reduceMotion) { count.classList.remove("bump"); void count.offsetWidth; count.classList.add("bump"); }
  }

  var itemsEl = document.getElementById("bag-items");
  var emptyEl = document.getElementById("bag-empty");
  var footEl = document.getElementById("bag-foot");
  var totalEl = document.getElementById("bag-total");

  function renderBag() {
    bag = bag.filter(function (l) { return find(l.id); });
    var count = 0, total = 0;
    itemsEl.innerHTML = "";
    bag.forEach(function (l) {
      var p = find(l.id);
      count += l.qty;
      total += l.qty * p.price;
      var hex = (p.colors.filter(function (c) { return c.name === l.color; })[0] || p.colors[0]).hex;
      var li = document.createElement("li");
      li.innerHTML =
        '<div class="thumb">' + garment(p.kind, hex) + "</div>" +
        '<div class="line-info"><p class="line-name">' + p.name + '</p><p class="line-meta">' + l.color + ", " + l.size + "</p>" +
        '<div class="qty"><button type="button" aria-label="Remove one ' + p.name + '" data-d="-1">−</button><span>' + l.qty + '</span><button type="button" aria-label="Add one ' + p.name + '" data-d="1">+</button></div></div>' +
        '<p class="line-price">' + fmt.format(l.qty * p.price) + "</p>";
      li.querySelectorAll(".qty button").forEach(function (b) {
        b.addEventListener("click", function () {
          l.qty += +b.dataset.d;
          if (l.qty <= 0) bag.splice(bag.indexOf(l), 1);
          save();
          renderBag();
        });
      });
      itemsEl.appendChild(li);
    });
    document.querySelector(".bag-count").textContent = count;
    totalEl.textContent = fmt.format(total);
    emptyEl.hidden = bag.length > 0;
    footEl.hidden = bag.length === 0;
    itemsEl.hidden = bag.length === 0;
  }

  // drawer
  var drawer = document.getElementById("bag");
  var scrim = document.getElementById("scrim");
  var opener = document.querySelector(".bag-btn");
  var lastFocus = null;

  function openBag() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    scrim.hidden = false;
    requestAnimationFrame(function () { drawer.classList.add("open"); scrim.classList.add("open"); });
    drawer.querySelector(".close").focus();
    document.addEventListener("keydown", onKey);
  }
  function closeBag() {
    drawer.classList.remove("open");
    scrim.classList.remove("open");
    document.removeEventListener("keydown", onKey);
    setTimeout(function () { drawer.hidden = true; scrim.hidden = true; }, reduceMotion ? 0 : 220);
    if (lastFocus) lastFocus.focus();
  }
  function onKey(e) {
    if (e.key === "Escape") return closeBag();
    if (e.key !== "Tab") return;
    var f = drawer.querySelectorAll("button:not([hidden]), a[href]");
    f = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  opener.addEventListener("click", openBag);
  drawer.querySelector(".close").addEventListener("click", closeBag);
  scrim.addEventListener("click", closeBag);

  document.getElementById("checkout").addEventListener("click", function () {
    if (SHOP.checkoutUrl) { window.location.href = SHOP.checkoutUrl; return; }
    var n = document.getElementById("checkout-notice");
    n.hidden = false;
    n.innerHTML = 'Online checkout isn\'t open yet. Email <a href="mailto:chris@actioncloud.co?subject=Merch%20order">chris@actioncloud.co</a> with your bag and we\'ll sort it out.';
  });

  renderBag();

  // ---------- hero: headline rolls onto the ramp ----------
  var ride = document.getElementById("ride");
  if (ride && !reduceMotion) {
    var start = null, dur = 1400, from = -100;
    ride.setAttribute("startOffset", from + "%");
    var step = function (t) {
      if (start === null) start = t;
      var k = Math.min(1, (t - start) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      ride.setAttribute("startOffset", (from * (1 - e)).toFixed(2) + "%");
      if (k < 1) requestAnimationFrame(step);
    };
    setTimeout(function () { requestAnimationFrame(step); }, 200);
  }
})();
