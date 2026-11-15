/* Ballerina shop. One IIFE, vanilla JS, no dependencies. */
(function () {
  "use strict";

  var SHOP = window.SHOP;
  var I18N = window.I18N;
  var doc = document;

  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }
  function el(tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduced = motion.matches;

  /* ------------------------------------------------------------------ *
   * Languages
   * ------------------------------------------------------------------ */

  var lang = pickLang();

  function pickLang() {
    var fromUrl = new URLSearchParams(window.location.search).get("lang");
    var nav = (window.navigator.language || "").slice(0, 2).toLowerCase();
    var tries = [fromUrl, store.get("ballerina.lang"), nav, I18N.fallback];
    for (var i = 0; i < tries.length; i++) {
      if (tries[i] && I18N.strings[tries[i]]) return tries[i];
    }
    return I18N.fallback;
  }

  function raw(key) {
    var s = I18N.strings[lang] && I18N.strings[lang][key];
    if (s == null) s = I18N.strings[I18N.fallback][key];
    return s;
  }

  function t(key, vars) {
    var s = raw(key);
    if (s == null) return key;
    return s.replace(/\{(\w+)\}/g, function (m, k) { return vars && k in vars ? vars[k] : m; });
  }

  /* A string that is only [SOMETHING] is an undecided fact: mark it. */
  function isTbd(s) { return /^\s*\[[^\]]+\]\s*$/.test(s); }

  function setText(node, s) {
    node.textContent = s;
    node.classList.toggle("tbd", isTbd(s));
  }

  /* Put a translatable message into a live element; it follows language changes. */
  function say(node, key) {
    if (key) { node.setAttribute("data-i18n", key); setText(node, t(key)); }
    else { node.removeAttribute("data-i18n"); node.textContent = ""; }
  }

  function handSrc(key) {
    var shared = I18N.handShared.indexOf(key) !== -1;
    var sub = lang === I18N.fallback || shared ? "" : lang + "/";
    return "img/hand/" + sub + key + ".png";
  }

  function applyI18n() {
    doc.documentElement.lang = lang;
    doc.title = t("meta.title");
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.desc"));

    $$("[data-i18n]").forEach(function (n) { setText(n, t(n.getAttribute("data-i18n"))); });
    $$("[data-i18n-aria]").forEach(function (n) { n.setAttribute("aria-label", t(n.getAttribute("data-i18n-aria"))); });
    $$("[data-i18n-alt]").forEach(function (n) { n.alt = t(n.getAttribute("data-i18n-alt")); });
    $$("[data-hand]").forEach(function (img) {
      var key = img.getAttribute("data-hand");
      var src = handSrc(key);
      if (img.getAttribute("src") !== src) img.setAttribute("src", src);
      img.alt = img.hasAttribute("data-quiet") ? "" : t(key);
    });
    $$("[data-lang-field]").forEach(function (n) { n.value = lang; });
  }

  function setLang(next) {
    if (!I18N.strings[next]) return;
    lang = next;
    store.set("ballerina.lang", lang);
    var url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState(null, "", url);
    renderAll();
  }

  function initLang() {
    var select = $("#lang");
    Object.keys(I18N.langs).forEach(function (code) {
      var o = el("option", null, I18N.langs[code]);
      o.value = code;
      o.lang = code;
      select.appendChild(o);
    });
    select.value = lang;
    /* One language: no switch to show. */
    select.closest(".lang").hidden = Object.keys(I18N.langs).length < 2;
    select.addEventListener("change", function () { setLang(select.value); });
  }

  /* ------------------------------------------------------------------ *
   * Products
   * ------------------------------------------------------------------ */

  function product(id) {
    for (var i = 0; i < SHOP.products.length; i++) if (SHOP.products[i].id === id) return SHOP.products[i];
    return null;
  }
  function colorOf(p, id) {
    for (var i = 0; i < p.colors.length; i++) if (p.colors[i].id === id) return p.colors[i];
    return null;
  }
  function pText(p, field) {
    var s = raw("p." + p.id + "." + field);
    return s == null ? p[field] : s;
  }
  function colorName(c) {
    var s = raw("color." + c.id);
    return s == null ? c.name : s;
  }
  function sizeName(s) { return s === "One size" ? t("size.one") : s; }
  function photo(p, c, view) { return "img/p/" + p.id + "-" + c.id + "-" + view + ".webp"; }

  function money(n) {
    if (n == null) return t("price.tbd");
    if (!SHOP.currency) return String(n);
    try {
      return new Intl.NumberFormat(lang, { style: "currency", currency: SHOP.currency }).format(n);
    } catch (e) { return n + " " + SHOP.currency; }
  }

  /* ------------------------------------------------------------------ *
   * The rail: one hanging piece per product colour
   * ------------------------------------------------------------------ */

  var stage = $("#rail");
  var track = $("#track");
  var pieces = [];   /* { li, btn, p, c, a, w, gain, swings } */

  function buildRail() {
    var i = 0;
    SHOP.products.forEach(function (p) {
      p.colors.forEach(function (c) {
        var where = p.where === "hooks" || p.where === "bench" ? p.where : "barre";
        var li = el("li", "item item--" + where);
        li.style.setProperty("--i", i);

        var refl = el("img", "refl");
        refl.src = photo(p, c, p.views[0]);
        refl.alt = "";
        refl.setAttribute("aria-hidden", "true");
        refl.draggable = false;
        li.appendChild(refl);

        if (where === "hooks") li.appendChild(el("span", "hookboard"));
        if (where === "bench") li.appendChild(el("span", "bench"));

        var btn = el("button", "piece");
        btn.type = "button";
        btn.setAttribute("aria-haspopup", "dialog");
        var img = el("img");
        img.src = photo(p, c, p.views[0]);
        img.alt = "";
        img.width = 896;
        img.height = 1120;
        img.draggable = false;
        btn.appendChild(img);
        btn.addEventListener("click", function () { openProduct(p.id, c.id, btn); });
        li.appendChild(btn);
        track.appendChild(li);

        pieces.push({
          li: li, btn: btn, p: p, c: c,
          a: 0, w: 0,
          gain: 0.016 + (i * 7 % 5) * 0.003,    /* slightly different per piece */
          swings: where !== "bench"
        });
        i++;
      });
    });
  }

  function labelRail() {
    pieces.forEach(function (x) {
      /* No product names on the first screen: the name is the accessible label only. */
      x.btn.setAttribute("aria-label", t("rail.open", { name: pText(x.p, "name"), color: colorName(x.c), price: money(x.p.price) }));
    });
  }

  /* Swing: each piece is a damped pendulum pushed by how fast the rail moves. */
  var K = 0.03, DAMP = 0.045, MAX = 26;
  var lastLeft = 0, lastTime = 0, running = false;

  function wake() {
    if (running || reduced) return;
    running = true;
    lastTime = 0;
    window.requestAnimationFrame(tick);
  }

  function tick(now) {
    var dt = lastTime ? Math.min((now - lastTime) / 16.67, 3) : 1;
    lastTime = now;
    var left = stage.scrollLeft;
    var v = left - lastLeft;          /* px the rail moved since the last frame */
    lastLeft = left;
    var busy = Math.abs(v) > 0.05 || gliding || !!drag;

    for (var i = 0; i < pieces.length; i++) {
      var x = pieces[i];
      if (!x.swings) continue;
      x.w += (-K * x.a - DAMP * x.w) * dt - x.gain * v;
      x.a += x.w * dt;
      if (x.a > MAX) { x.a = MAX; x.w = 0; }
      if (x.a < -MAX) { x.a = -MAX; x.w = 0; }
      if (Math.abs(x.a) > 0.03 || Math.abs(x.w) > 0.03) busy = true;
      else { x.a = 0; x.w = 0; }
      x.li.style.setProperty("--a", x.a.toFixed(2) + "deg");
    }

    if (busy && !reduced) window.requestAnimationFrame(tick);
    else running = false;
  }

  function still() {
    pieces.forEach(function (x) { x.a = 0; x.w = 0; x.li.style.removeProperty("--a"); });
  }

  function dropIn() {
    if (reduced) return;
    stage.classList.add("is-dropping");
    pieces.forEach(function (x, i) {
      if (!x.swings) return;
      window.setTimeout(function () {
        x.w += (i % 2 ? -1 : 1) * (1.1 + (i % 3) * 0.35);
        wake();
      }, i * 70 + 320);
    });
    window.setTimeout(function () { stage.classList.remove("is-dropping"); }, pieces.length * 70 + 900);
  }

  /* Mouse drag with a throw and glide. Touch uses native scrolling. */
  var drag = null, gliding = false, glideV = 0, dragEndedAt = -1e9;

  function glide() {
    if (!gliding) return;
    glideV *= 0.94;
    var before = stage.scrollLeft;
    stage.scrollLeft = before + glideV;
    if (Math.abs(glideV) < 0.3 || stage.scrollLeft === before) { gliding = false; return; }
    window.requestAnimationFrame(glide);
  }

  function initDrag() {
    stage.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      gliding = false;
      drag = { x: e.clientX, left: stage.scrollLeft, moved: false, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
    });
    window.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 5) { drag.moved = true; stage.classList.add("is-dragging"); }
      if (!drag.moved) return;
      stage.scrollLeft = drag.left - dx;
      var dt = e.timeStamp - drag.lastT;
      if (dt > 0) {
        drag.v = drag.v * 0.6 + ((drag.lastX - e.clientX) / dt) * 16.67 * 0.4;
        drag.lastX = e.clientX;
        drag.lastT = e.timeStamp;
      }
      wake();
    });
    function end(e) {
      if (!drag) return;
      var d = drag;
      drag = null;
      stage.classList.remove("is-dragging");
      if (!d.moved) return;
      dragEndedAt = window.performance.now();
      if (!reduced && e.timeStamp - d.lastT < 90 && Math.abs(d.v) > 1) {
        glideV = Math.max(-70, Math.min(70, d.v));
        gliding = true;
        window.requestAnimationFrame(glide);
      }
    }
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    /* A drag must not open the piece it started on. */
    stage.addEventListener("click", function (e) {
      if (window.performance.now() - dragEndedAt < 120) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    stage.addEventListener("dragstart", function (e) { e.preventDefault(); });
  }

  function moveRail(dir, far) {
    gliding = false;
    var step = far ? stage.clientWidth * 0.8 : Math.max(160, stage.clientWidth * 0.3);
    stage.scrollBy({ left: dir * step, behavior: reduced ? "auto" : "smooth" });
  }

  function initRailControls() {
    var prev = $("#railPrev"), next = $("#railNext");
    function ends() {
      var max = stage.scrollWidth - stage.clientWidth;
      prev.setAttribute("aria-disabled", String(stage.scrollLeft <= 1));
      next.setAttribute("aria-disabled", String(stage.scrollLeft >= max - 1));
    }
    prev.addEventListener("click", function () { moveRail(-1, true); });
    next.addEventListener("click", function () { moveRail(1, true); });
    stage.addEventListener("scroll", function () { wake(); ends(); }, { passive: true });
    window.addEventListener("resize", ends);
    stage.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); moveRail(-1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); moveRail(1); }
      else if (e.key === "Home") { e.preventDefault(); stage.scrollTo({ left: 0, behavior: reduced ? "auto" : "smooth" }); }
      else if (e.key === "End") { e.preventDefault(); stage.scrollTo({ left: stage.scrollWidth, behavior: reduced ? "auto" : "smooth" }); }
    });
    ends();
    window.addEventListener("load", ends);
  }

  /* ------------------------------------------------------------------ *
   * Dialogs
   * ------------------------------------------------------------------ */

  function openDialog(dlg, opener) {
    dlg._opener = opener || doc.activeElement;
    dlg.showModal();
    doc.documentElement.classList.add("is-locked");
  }

  function initDialogs() {
    $$("dialog").forEach(function (dlg) {
      dlg.addEventListener("click", function (e) {
        if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
      });
      dlg.addEventListener("close", function () {
        if (!$("dialog[open]")) doc.documentElement.classList.remove("is-locked");
        var o = dlg._opener;
        if (o && doc.contains(o) && typeof o.focus === "function") o.focus();
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Product panel
   * ------------------------------------------------------------------ */

  var sheet = $("#product");
  var cur = null;   /* { p, c, view, size } */

  function chip(group, name, value, label, checked, swatch) {
    var wrap = el("label", "chip");
    var input = el("input");
    input.type = "radio";
    input.name = name;
    input.value = value;
    input.checked = checked;
    var face = el("span", "scrap " + ["e1", "e2", "e3"][group.children.length % 3]);
    if (swatch !== undefined) {
      var dot = el("span", "swatch" + (swatch ? "" : " swatch--tbd"));
      if (swatch) dot.style.background = swatch;
      face.appendChild(dot);
    }
    var txt = el("span", null, label);
    if (isTbd(label)) txt.className = "tbd";
    face.appendChild(txt);
    wrap.appendChild(input);
    wrap.appendChild(face);
    group.appendChild(wrap);
    return input;
  }

  function clearChips(group) { $$(".chip", group).forEach(function (n) { n.remove(); }); }

  function openProduct(id, colorId, opener) {
    var p = product(id);
    if (!p) return;
    cur = { p: p, c: colorOf(p, colorId) || p.colors[0], view: p.views[0], size: p.sizes.length === 1 ? p.sizes[0] : null };
    say($("#pSizeErr"), null);
    say($("#pStatus"), null);
    $$("details", sheet).forEach(function (d) { d.open = false; });
    renderProduct();
    openDialog(sheet, opener);
    $(".sheet__paper", sheet).scrollTop = 0;
  }

  function renderPhoto() {
    var img = $("#pImg");
    img.src = photo(cur.p, cur.c, cur.view);
    img.alt = t("p.photo", { name: pText(cur.p, "name"), color: colorName(cur.c), view: t("p." + cur.view) });
  }

  function renderProduct() {
    if (!cur) return;
    var p = cur.p;
    $("#pName").textContent = pText(p, "name");
    setText($("#pPrice"), money(p.price));
    setText($("#pBlurb"), pText(p, "blurb"));
    setText($("#pColorName"), colorName(cur.c));
    $("#pStandIn").hidden = !SHOP.standIn;
    renderPhoto();

    var views = $("#pViews");
    clearChips(views);
    p.views.forEach(function (v) {
      chip(views, "view", v, t("p." + v), v === cur.view).addEventListener("change", function () {
        cur.view = v;
        renderPhoto();
      });
    });
    views.hidden = p.views.length < 2;

    var colors = $("#pColors");
    clearChips(colors);
    p.colors.forEach(function (c) {
      chip(colors, "color", c.id, colorName(c), c.id === cur.c.id, c.hex).addEventListener("change", function () {
        cur.c = c;
        setText($("#pColorName"), colorName(c));
        renderPhoto();
      });
    });

    var sizes = $("#pSizes");
    clearChips(sizes);
    p.sizes.forEach(function (s) {
      chip(sizes, "size", s, sizeName(s), s === cur.size).addEventListener("change", function () {
        cur.size = s;
        say($("#pSizeErr"), null);
      });
    });

    var spec = SHOP.specs[p.spec] || {};
    setText($("#pMaterials"), spec.materials || t("p.materials.tbd"));
    var chart = $("#pChart");
    chart.textContent = "";
    if (spec.chart && spec.chart.rows) {
      var table = el("table"), head = el("tr");
      head.appendChild(el("th", null, t("p.size")));
      spec.chart.measures.forEach(function (m) { head.appendChild(el("th", null, m + (spec.chart.unit ? " (" + spec.chart.unit + ")" : ""))); });
      table.appendChild(head);
      Object.keys(spec.chart.rows).forEach(function (s) {
        var tr = el("tr");
        tr.appendChild(el("th", null, sizeName(s)));
        spec.chart.rows[s].forEach(function (n) { tr.appendChild(el("td", null, String(n))); });
        table.appendChild(tr);
      });
      chart.appendChild(table);
    } else {
      var none = el("p");
      setText(none, t("p.chart.tbd"));
      chart.appendChild(none);
    }
  }

  function initProduct() {
    $("#pForm").addEventListener("submit", function (e) {
      e.preventDefault();
      if (!cur) return;
      if (!cur.size) {
        say($("#pSizeErr"), "p.size.err");
        say($("#pStatus"), null);
        var first = $("#pSizes input");
        if (first) first.focus();
        return;
      }
      addToBag(cur.p.id, cur.c.id, cur.size);
      say($("#pStatus"), null);
      window.setTimeout(function () { say($("#pStatus"), "p.added"); }, 30);
    });
  }

  /* ------------------------------------------------------------------ *
   * Bag (saved in localStorage)
   * ------------------------------------------------------------------ */

  var BAG_KEY = "ballerina.bag";
  var bag = loadBag();
  var bagDlg = $("#bag");

  function loadBag() {
    var out = [];
    try {
      var saved = JSON.parse(store.get(BAG_KEY) || "[]");
      if (!Array.isArray(saved)) return out;
      saved.forEach(function (it) {
        var p = it && product(it.id);
        if (!p || !colorOf(p, it.color) || p.sizes.indexOf(it.size) === -1) return;
        var q = Math.floor(Number(it.qty));
        if (!(q >= 1)) return;
        out.push({ id: it.id, color: it.color, size: it.size, qty: Math.min(q, 99) });
      });
    } catch (e) { /* unreadable: start empty */ }
    return out;
  }

  function saveBag() { store.set(BAG_KEY, JSON.stringify(bag)); }

  function addToBag(id, color, size) {
    var hit = null;
    bag.forEach(function (it) { if (it.id === id && it.color === color && it.size === size) hit = it; });
    if (hit) hit.qty = Math.min(hit.qty + 1, 99);
    else bag.push({ id: id, color: color, size: size, qty: 1 });
    saveBag();
    renderBag();
  }

  function renderBag() {
    var count = 0, total = 0, priced = true;
    var list = $("#bagList");
    var focusKey = doc.activeElement && doc.activeElement.getAttribute && doc.activeElement.getAttribute("data-key");
    list.textContent = "";

    bag.forEach(function (it, index) {
      var p = product(it.id), c = colorOf(p, it.color), name = pText(p, "name");
      count += it.qty;
      if (p.price == null) priced = false; else total += p.price * it.qty;

      var li = el("li", "line");
      var img = el("img", "line__img");
      img.src = photo(p, c, p.views[0]);
      img.alt = "";
      img.width = 64; img.height = 80; img.loading = "lazy";
      li.appendChild(img);

      var body = el("div");
      body.appendChild(el("p", "line__name", name));
      var meta = el("p", "line__meta");
      var cn = el("span"); setText(cn, colorName(c));
      var pr = el("span"); setText(pr, money(p.price));
      meta.appendChild(cn);
      meta.appendChild(doc.createTextNode(" · " + sizeName(it.size) + " · "));
      meta.appendChild(pr);
      body.appendChild(meta);

      var row = el("div", "line__row");
      var qty = el("span", "qty");
      var less = el("button", "scrap e2 mini", "−");
      less.type = "button";
      less.setAttribute("aria-label", t("bag.less", { name: name }));
      less.setAttribute("data-key", index + "-");
      var n = el("b", null, String(it.qty));
      n.setAttribute("aria-label", t("bag.qty", { n: it.qty }));
      n.setAttribute("role", "img");
      var more = el("button", "scrap e2 mini", "+");
      more.type = "button";
      more.setAttribute("aria-label", t("bag.more", { name: name }));
      more.setAttribute("data-key", index + "+");
      qty.appendChild(less); qty.appendChild(n); qty.appendChild(more);
      row.appendChild(qty);

      var rm = el("button", "linkbtn", t("bag.remove.word"));
      rm.type = "button";
      rm.setAttribute("aria-label", t("bag.remove", { name: name }));
      row.appendChild(rm);
      body.appendChild(row);
      li.appendChild(body);
      list.appendChild(li);

      function drop() {
        bag.splice(index, 1);
        saveBag(); renderBag();
        ($("#bagList button") || $("[data-close]", bagDlg)).focus();
      }
      less.addEventListener("click", function () {
        if (it.qty <= 1) return drop();
        it.qty -= 1; saveBag(); renderBag();
      });
      more.addEventListener("click", function () { it.qty = Math.min(it.qty + 1, 99); saveBag(); renderBag(); });
      rm.addEventListener("click", drop);
    });

    if (focusKey) {
      var again = $('[data-key="' + focusKey + '"]', list);
      if (again) again.focus();
    }

    $("#bagEmpty").hidden = bag.length > 0;
    $("#bagFoot").hidden = bag.length === 0;
    setText($("#bagTotal"), priced ? money(total) : t("price.tbd"));
    $("#bagCount").textContent = String(count);
    $("#bagOpen").setAttribute("aria-label", t("bag.open", { n: count }));
    if (bag.length === 0) say($("#checkoutMsg"), null);
  }

  function initBag() {
    $("#bagOpen").addEventListener("click", function () {
      say($("#checkoutMsg"), null);
      openDialog(bagDlg, $("#bagOpen"));
    });
    /* Honest checkout: with no checkout URL, say orders are not open. Never pretend to pay. */
    $("#checkout").addEventListener("click", function () {
      if (!SHOP.checkoutUrl) {
        say($("#checkoutMsg"), null);
        window.setTimeout(function () { say($("#checkoutMsg"), "bag.closed"); }, 30);
        return;
      }
      var items = bag.map(function (it) { return [it.id, it.color, it.size, it.qty].join(":"); }).join(",");
      var url = new URL(SHOP.checkoutUrl, window.location.href);
      url.searchParams.set("items", items);
      url.searchParams.set("lang", lang);
      window.location.href = url.toString();
    });
    window.addEventListener("storage", function (e) {
      if (e.key === BAG_KEY) { bag = loadBag(); renderBag(); }
    });
  }

  /* ------------------------------------------------------------------ *
   * Netlify forms: inline validation, honeypot, sent state
   * ------------------------------------------------------------------ */

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function errBox(input) { return doc.getElementById(input.getAttribute("aria-describedby")); }

  function check(input) {
    var v = input.value.trim(), key = null;
    if (input.required && !v) key = input.getAttribute("data-err-required");
    else if (input.type === "email" && v && !EMAIL.test(v)) key = input.getAttribute("data-err-invalid");
    var box = errBox(input);
    if (key) { input.setAttribute("aria-invalid", "true"); say(box, key); }
    else { input.removeAttribute("aria-invalid"); say(box, null); }
    return !key;
  }

  function initForms() {
    $$("form[data-form]").forEach(function (form) {
      form.noValidate = true;
      var fields = $$("[data-err-required]", form);
      var status = $(".form__status", form);
      var button = $('button[type="submit"]', form);
      var sent = form.parentNode.querySelector(".sent");

      fields.forEach(function (input) {
        input.addEventListener("blur", function () { if (input.value.trim() || input.hasAttribute("aria-invalid")) check(input); });
        input.addEventListener("input", function () { if (input.hasAttribute("aria-invalid")) check(input); });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var bad = fields.filter(function (input) { return !check(input); });
        if (bad.length) { bad[0].focus(); return; }

        function done() {
          form.hidden = true;
          sent.hidden = false;
          sent.focus();
        }
        if (form.elements["bot-field"].value) return done();   /* a bot filled the trap: send nothing */

        say(status, null);
        button.disabled = true;
        say(button, "form.sending");
        window.fetch(form.getAttribute("action") || "/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(new FormData(form)).toString()
        }).then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          done();
        }).catch(function () {
          say(status, "form.fail");
        }).then(function () {
          button.disabled = false;
          say(button, button.getAttribute("data-label"));
        });
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Strip, footer
   * ------------------------------------------------------------------ */

  function initStrip() {
    var run = $("#stripRun"), set = $(".strip__set", run), strip = run.closest(".strip");
    /* Copies fill the band so the loop has no gap. They are hidden from assistive tech. */
    function quiet(node) {
      node.setAttribute("aria-hidden", "true");
      $$("img", node).forEach(function (img) {
        img.alt = "";
        img.setAttribute("data-quiet", "");
        img.loading = "eager";   /* same files as the first set, already fetched */
      });
      return node;
    }
    $$("li", set).forEach(function (li) { set.appendChild(quiet(li.cloneNode(true))); });
    run.appendChild(quiet(set.cloneNode(true)));

    var btn = $("#stripPause"), icon = $(".strip__icon", btn);
    btn.addEventListener("click", function () {
      var paused = strip.classList.toggle("is-paused");
      btn.setAttribute("aria-pressed", String(paused));
      btn.setAttribute("data-i18n-aria", paused ? "strip.play" : "strip.pause");
      btn.setAttribute("aria-label", t(paused ? "strip.play" : "strip.pause"));
      icon.textContent = paused ? "▶" : "II";
    });
  }

  function renderFooter() {
    function fill(id, value, href, text) {
      var slot = doc.getElementById(id);
      slot.textContent = "";
      if (!value) { setText(slot, text); return; }
      slot.classList.remove("tbd");
      var a = el("a", null, text);
      a.href = href;
      slot.appendChild(a);
    }
    var c = SHOP.contact || {};
    fill("footInstagram", c.instagram, "https://www.instagram.com/" + c.instagram + "/", c.instagram ? "@" + c.instagram : t("foot.handle"));
    fill("footTiktok", c.tiktok, "https://www.tiktok.com/@" + c.tiktok, c.tiktok ? "@" + c.tiktok : t("foot.handle"));
    fill("footEmail", c.email, "mailto:" + c.email, c.email || t("foot.email"));
  }

  /* ------------------------------------------------------------------ */

  function renderAll() {
    applyI18n();
    labelRail();
    renderProduct();
    renderBag();
    renderFooter();
  }

  function onMotionChange() {
    reduced = motion.matches;
    if (reduced) { gliding = false; still(); }
  }
  if (motion.addEventListener) motion.addEventListener("change", onMotionChange);
  else if (motion.addListener) motion.addListener(onMotionChange);

  initLang();
  buildRail();
  initStrip();
  renderAll();
  initDrag();
  initRailControls();
  initDialogs();
  initProduct();
  initBag();
  initForms();
  dropIn();
})();
