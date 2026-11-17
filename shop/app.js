(function () {
  "use strict";

  var SHOP = window.SHOP;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };

  // ---------- language ----------
  var I18N = window.I18N, LOCALE = { en: "en-IE", ro: "ro-RO", hu: "hu-HU", de: "de-DE" };
  var lang = (function () {
    var saved = null; try { saved = localStorage.getItem("actioncloud-lang"); } catch (e) { /* storage unavailable */ }
    var pick = new URLSearchParams(location.search).get("lang") || saved || (navigator.language || "en").slice(0, 2).toLowerCase();
    return I18N[pick] ? pick : "en";
  })();
  function t(key, vars) {
    var s = I18N[lang][key] || I18N.en[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace("{" + k + "}", vars[k]); });
    return s;
  }
  var MAIL = '<a href="mailto:chris@actioncloud.co">chris@actioncloud.co</a>';
  var fmt = new Intl.NumberFormat(LOCALE[lang], { style: "currency", currency: SHOP.currency, currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 });
  document.documentElement.lang = lang;
  document.title = t("meta.title");
  document.querySelector('meta[name="description"]').setAttribute("content", t("meta.desc"));
  document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
  document.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
  $("lang").value = lang;
  if (lang === "en") { var pk = document.getElementById("park-link"); if (pk) pk.setAttribute("href", "../en/"); }
  $("lang").addEventListener("change", function () {
    try { localStorage.setItem("actioncloud-lang", this.value); } catch (e) { /* storage unavailable */ }
    var u = new URL(location.href); u.searchParams.set("lang", this.value); location.href = u.toString();
  });
  function sizeName(s) { return s === "One size" ? t("size.one") : s; }

  // ---------- product photos ----------
  // One photo per product colour: img/p/<product id>-<colour name>.webp
  // A product with `views` has one photo per side instead (...-front.webp, ...-back.webp);
  // the first entry in `views` is the side that hangs on the rail.
  function photo(p, colorName, view) {
    return "img/p/" + p.id + "-" + colorName.toLowerCase() + (p.views ? "-" + (view || p.views[0]) : "") + ".webp";
  }
  function garment(p, colorName, view, alt) {
    return '<img src="' + photo(p, colorName, view) + '" alt="' + (alt || "") + '" draggable="false" decoding="async">';
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
      btn.setAttribute("aria-label", p.name + ", " + t("color." + c.name) + ", " + fmt.format(p.price));
      btn.innerHTML = '<span class="cloth">' + garment(p, c.name) + "</span>" +
        '<span class="label"><b>' + p.name + "</b><span>" + fmt.format(p.price) + "</span></span>";
      btn.addEventListener("click", function () { openProduct(p, ci, btn.querySelector(".cloth")); });
      li.appendChild(btn);
      (onShelf ? shelf : track).appendChild(li);
      if (!onShelf) pieces.push({ el: li, a: 0, w: 0, gain: 0.8 + Math.random() * 0.5 });
    });
  });

  // swing physics: each piece is a damped pendulum pushed by how fast the rack moves.
  // The hanger goes with the rail and the hem trails behind: pieces moving left lean
  // with their hems to the right, and the other way round. (A positive angle swings
  // the hem left, so the push is against the direction of travel.)
  var dragging = false, coast = 0, moved = false, startX = 0, startScroll = 0, prevX = 0, vel = 0;
  var lastX = track.scrollLeft, running = false;
  function tick() {
    var x = track.scrollLeft, v = Math.max(-70, Math.min(70, x - lastX));
    lastX = x;
    var alive = Math.abs(v) > 0.05;
    for (var i = 0; i < pieces.length; i++) {
      var s = pieces[i];
      s.w += -0.055 * s.a - 0.085 * s.w - v * 0.045 * s.gain;
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

  // opening: pieces drop onto the rail (CSS), then swing and settle
  if (!reduce) { pieces.forEach(function (s, i) { s.el.style.setProperty("--i", i); s.a = 11 * (i % 2 ? 1 : -1) * (0.6 + Math.random() * 0.6); }); setTimeout(wake, 350); }
  Array.prototype.forEach.call(shelf.children, function (li, i) { li.style.setProperty("--i", i); });

  // ambient life: a draught runs along the rail now and then, hovering nudges a piece,
  // and scrolling the page tugs everything
  function gust() {
    if (reduce || document.hidden || dragging) return;
    var d = Math.random() < 0.5 ? -1 : 1;
    pieces.forEach(function (s, i) { setTimeout(function () { s.w += d * (0.28 + Math.random() * 0.22); wake(); }, i * 110); });
  }
  setInterval(gust, 3400);
  pieces.forEach(function (s) {
    s.el.addEventListener("pointerenter", function (e) {
      if (e.pointerType === "mouse" && !dragging) { s.w += (Math.random() < 0.5 ? -1 : 1) * 1.0; wake(); }
    });
  });
  var lastY = window.scrollY;
  window.addEventListener("scroll", function () {
    var dy = Math.max(-40, Math.min(40, window.scrollY - lastY)); lastY = window.scrollY;
    pieces.forEach(function (s) { s.w += dy * 0.014 * s.gain; }); wake();
  }, { passive: true });

  // ---------- bag state ----------
  var KEY = "actioncloud-bag", bag = [];
  try { bag = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { bag = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(bag)); } catch (e) { /* storage unavailable */ } }
  function find(id) { return SHOP.products.filter(function (p) { return p.id === id; })[0]; }

  // ---------- product sheet ----------
  var dlg = $("product"), art = $("p-art"), cur = null;

  function drawProduct() {
    var p = cur.p, c = p.colors[cur.ci], sides = p.views && p.views.length > 1;
    art.innerHTML = garment(p, c.name, cur.view, cur.view ? p.name + ", " + t("p." + cur.view) : "");
    $("p-views").hidden = !sides;
    $("p-views").innerHTML = !sides ? "" : ["front", "back"].filter(function (v) { return p.views.indexOf(v) > -1; }).map(function (v) {
      return '<button type="button" class="view" aria-pressed="' + (v === cur.view) + '" data-v="' + v + '">' + t("p." + v) + "</button>";
    }).join("");
    $("p-name").textContent = p.name;
    $("p-price").textContent = fmt.format(p.price);
    $("p-blurb").textContent = t("blurb." + p.id);
    $("p-hint").textContent = "";
    $("p-colors").innerHTML = p.colors.map(function (k, i) {
      return '<button type="button" class="swatch" style="--c:' + k.hex + '" aria-label="' + t("color." + k.name) + '" aria-pressed="' + (i === cur.ci) + '" data-i="' + i + '"></button>';
    }).join("") + '<span class="color-name">' + t("color." + c.name) + "</span>";
    $("p-sizes").innerHTML = p.sizes.map(function (s) {
      return '<button type="button" role="radio" class="size" aria-checked="' + (s === cur.size) + '" data-s="' + s + '">' + sizeName(s) + "</button>";
    }).join("");
  }
  $("p-colors").addEventListener("click", function (e) {
    var b = e.target.closest(".swatch"); if (!b) return;
    cur.ci = +b.dataset.i; drawProduct(); art.firstChild.classList.add("swap"); $("p-colors").querySelector('[aria-pressed="true"]').focus();
  });
  $("p-sizes").addEventListener("click", function (e) {
    var b = e.target.closest(".size"); if (!b) return;
    cur.size = b.dataset.s; drawProduct(); $("p-sizes").querySelector('[aria-checked="true"]').focus();
  });
  $("p-views").addEventListener("click", function (e) {
    var b = e.target.closest(".view"); if (!b || b.dataset.v === cur.view) return;
    cur.view = b.dataset.v; drawProduct(); art.firstChild.classList.add("swap"); $("p-views").querySelector('[aria-pressed="true"]').focus();
  });

  // materials and size chart, for products that name a spec in shop-config.js
  function drawSpec(p) {
    var s = p.spec && SHOP.specs && SHOP.specs[p.spec];
    $("p-spec").hidden = !s;
    if (!s) return;
    $("p-spec-list").innerHTML = [["material", t("spec.material." + s.material)], ["fit", t("spec.fit")], ["finish", t("spec.finish")], ["care", t("spec.care")]].map(function (r) {
      return "<div><dt>" + t("spec.h." + r[0]) + "</dt><dd>" + r[1] + "</dd></div>";
    }).join("");
    $("p-chart").innerHTML = "<thead><tr>" + ["size", "chest", "length", "sleeve"].map(function (k) {
      return '<th scope="col">' + t("chart." + k) + "</th>";
    }).join("") + "</tr></thead><tbody>" + s.chart.map(function (r) {
      return '<tr><th scope="row">' + r[0] + "</th><td>" + r[1] + "</td><td>" + r[2] + "</td><td>" + r[3] + "</td></tr>";
    }).join("") + "</tbody>";
  }

  function openProduct(p, ci, src) {
    cur = { p: p, ci: ci, size: p.sizes.length === 1 ? p.sizes[0] : null, view: p.views ? p.views[0] : null };
    // fetch the other side now so the front/back switch doesn't show an empty frame
    (p.views || []).slice(1).forEach(function (v) { new Image().src = photo(p, p.colors[ci].name, v); });
    var show = function () { drawProduct(); drawSpec(p); dlg.showModal(); document.querySelector(".p-info").scrollTop = 0; };
    if (document.startViewTransition && !reduce && src) {
      src.style.viewTransitionName = "piece";
      var t = document.startViewTransition(function () {
        src.style.viewTransitionName = ""; show(); art.style.viewTransitionName = "piece";
      });
      t.finished.finally(function () { art.style.viewTransitionName = ""; });
    } else show();
  }

  // the piece in the panel leans toward the pointer
  art.addEventListener("pointermove", function (e) {
    if (reduce || e.pointerType !== "mouse") return;
    var r = art.getBoundingClientRect();
    art.style.setProperty("--rx", (-((e.clientY - r.top) / r.height - 0.5) * 16).toFixed(1) + "deg");
    art.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 24).toFixed(1) + "deg");
  });
  art.addEventListener("pointerleave", function () { art.style.setProperty("--rx", "0deg"); art.style.setProperty("--ry", "0deg"); });

  $("p-add").addEventListener("click", function () {
    if (!cur.size) { $("p-hint").textContent = t("p.pick"); var f = $("p-sizes").querySelector(".size"); if (f) f.focus(); return; }
    var c = cur.p.colors[cur.ci], key = cur.p.id + "|" + c.name + "|" + cur.size;
    var line = bag.filter(function (l) { return l.key === key; })[0];
    if (line) line.qty += 1; else bag.push({ key: key, id: cur.p.id, color: c.name, size: cur.size, qty: 1 });
    save(); renderBag(); dlg.close(); $("bag").showModal(); var n = document.querySelector(".bag-count"); n.classList.remove("bump"); void n.offsetWidth; n.classList.add("bump");
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
        '<div><p class="line-name">' + p.name + '</p><p class="line-meta">' + t("color." + l.color) + ", " + sizeName(l.size) + "</p>" +
        '<div class="qty"><button type="button" aria-label="' + t("bag.minus", { name: p.name }) + '" data-d="-1">−</button><span>' + l.qty + '</span><button type="button" aria-label="' + t("bag.plus", { name: p.name }) + '" data-d="1">+</button></div></div>' +
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
    n.innerHTML = t("bag.notice", { mail: MAIL });
  });

  renderBag();

  // ---------- contact form ----------
  var form = $("contact-form"), sent = $("contact-sent"), statusEl = $("f-status");
  var WORDS = { "A ramp for my school": "school", "Sponsor or partner": "partner", "Something else": "other" };
  function topic() { return form.querySelector('input[name="topic"]:checked').value; }
  function applyTopic() {
    var key = WORDS[topic()];
    form.querySelectorAll("[data-for]").forEach(function (el) {
      var on = el.getAttribute("data-for") === key;
      el.hidden = !on;
      el.querySelectorAll("input").forEach(function (i) { i.disabled = !on; });
    });
    $("l-message").textContent = t("form.msg." + key);
  }
  function check(input) {
    if (input.disabled || input.type === "radio" || input.type === "hidden" || input.name === "bot-field") return true;
    var v = input.value.trim(), ok = v.length > 0;
    if (ok && input.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    var err = $("e-" + input.name);
    err.textContent = ok ? "" : t("err." + input.name);
    input.setAttribute("aria-invalid", String(!ok));
    return ok;
  }
  form.querySelectorAll('input[name="topic"]').forEach(function (r) { r.addEventListener("change", applyTopic); });
  form.querySelectorAll("input, textarea").forEach(function (i) {
    i.addEventListener("blur", function () { if (i.value.trim() || i.getAttribute("aria-invalid") === "true") check(i); });
    i.addEventListener("input", function () { if (i.getAttribute("aria-invalid") === "true") check(i); });
  });
  applyTopic();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fields = Array.prototype.slice.call(form.querySelectorAll("input, textarea"));
    var bad = fields.filter(function (i) { return !check(i); });
    if (bad.length) { bad[0].focus(); statusEl.textContent = ""; return; }
    var btn = $("f-send"), email = $("f-email").value.trim();
    btn.disabled = true; btn.textContent = t("form.sending"); statusEl.textContent = "";
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(form)).toString() })
      .then(function (r) { if (!r.ok) throw new Error(r.status); })
      .then(function () {
        form.hidden = true; sent.hidden = false;
        $("sent-text").textContent = t("form.sentText", { email: email });
        sent.focus(); form.reset(); applyTopic();
      })
      .catch(function () {
        statusEl.innerHTML = t("form.fail", { mail: MAIL });
      })
      .then(function () { btn.disabled = false; btn.textContent = t("form.send"); });
  });
  $("send-another").addEventListener("click", function () { sent.hidden = true; form.hidden = false; $("f-name").focus(); });
})();
