// Action Cloud: small enhancements. The page reads fine without this file;
// it adds the clickable plan, rail arrows, the swinging clothes rack, the price chips and package pre-selection.
(function () {
  "use strict";
  var d = document, root = d.documentElement;
  root.classList.add("js");

  // Highlight the chapter you are in
  var links = {};
  d.querySelectorAll(".chapters a").forEach(function (a) { links[a.getAttribute("data-for")] = a; });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var ch = e.target.getAttribute("data-chapter");
        Object.keys(links).forEach(function (k) {
          if (k === ch) links[k].setAttribute("aria-current", "true"); else links[k].removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    d.querySelectorAll("#top, [data-chapter]").forEach(function (s) { io.observe(s); });
  }

  // Rails: arrow buttons scroll one card at a time
  d.querySelectorAll("[data-rail]").forEach(function (box) {
    var rail = box.querySelector(".rail"), prev = box.querySelector("[data-prev]"), next = box.querySelector("[data-next]");
    if (!rail || !prev || !next) return;
    function step() {
      var card = rail.querySelector("li");
      return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || 16) : 320;
    }
    var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // aria-disabled, not disabled: an arrow that reaches the end keeps the keyboard focus
    function state() {
      prev.setAttribute("aria-disabled", rail.scrollLeft < 8);
      next.setAttribute("aria-disabled", rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8);
    }
    prev.addEventListener("click", function () { rail.scrollBy({ left: -step(), behavior: calm ? "auto" : "smooth" }); });
    next.addEventListener("click", function () { rail.scrollBy({ left: step(), behavior: calm ? "auto" : "smooth" }); });
    rail.addEventListener("scroll", state, { passive: true });
    window.addEventListener("resize", state);
    state();
  });

  // The plan you click: a tap anywhere in a room brings up its card, and the number follows the card you swipe to.
  // Without this the rooms are plain links to the cards.
  d.querySelectorAll("[data-map]").forEach(function (map) {
    var rail = map.querySelector(".map-rail"), pic = map.querySelector(".map-pic");
    if (!rail) return;
    var cards = Array.prototype.slice.call(rail.children), spots = map.querySelectorAll(".spot"), chips = map.querySelectorAll(".chips a");
    var say = map.querySelector("[data-say]"), active = -1, waiting = false;
    var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function left(li) { return li.offsetLeft - (parseFloat(getComputedStyle(rail).paddingLeft) || 0); }
    function mark(list, attr, value) {
      Array.prototype.forEach.call(list, function (el) {
        if (el.getAttribute(attr) === value) el.setAttribute("aria-current", "true"); else el.removeAttribute("aria-current");
      });
    }
    function show(i, chosen) {
      var li = cards[i];
      if (!li) return;
      if (i !== active) {
        active = i;
        mark(spots, "data-spot", li.getAttribute("data-n"));
        mark(chips, "data-group", li.getAttribute("data-group"));
        // this picture and its neighbours are fetched now; the rest stay lazy
        [i - 1, i, i + 1].forEach(function (k) { var im = cards[k] && cards[k].querySelector("img"); if (im) im.loading = "eager"; });
      }
      if (!chosen) return;
      rail.scrollTo({ left: left(li), behavior: "auto" });       // far jumps do not slide through the cards in between
      if (say) say.textContent = li.querySelector(".card-body").innerText.replace(/\s*\n+\s*/g, ". ");
      // the page stays still, unless the name of the place would be off screen: then the plan goes to the top once
      var name = li.querySelector("h3").getBoundingClientRect(), bar = d.querySelector(".bar"), top = bar ? bar.getBoundingClientRect().bottom : 0;
      if (pic && (name.bottom > window.innerHeight || name.top < top)) {
        window.scrollTo({ top: window.scrollY + pic.getBoundingClientRect().top - top - 8, behavior: calm ? "auto" : "smooth" });
      }
    }
    function first(attr, value) {
      for (var i = 0; i < cards.length; i++) if (cards[i].getAttribute(attr) === value) return i;
      return -1;
    }
    function pick(list, attr, key) {
      Array.prototype.forEach.call(list, function (a) {
        a.addEventListener("click", function (e) {
          var i = first(attr, a.getAttribute(key));
          if (i < 0) return;
          e.preventDefault();
          show(i, true);
        });
      });
    }
    pick(spots, "data-n", "data-spot");
    pick(chips, "data-group", "data-group");
    rail.addEventListener("scroll", function () {
      if (waiting) return;
      waiting = true;
      requestAnimationFrame(function () {
        waiting = false;
        var x = rail.scrollLeft, best = 0, gap = Infinity;
        cards.forEach(function (li, i) { var g = Math.abs(left(li) - x); if (g < gap) { gap = g; best = i; } });
        show(best);
      });
    }, { passive: true });
    // a link straight to one place (#loc-9) opens on it; otherwise the first place is chosen
    var at = location.hash ? first("id", location.hash.slice(1)) : -1;
    show(at < 0 ? 0 : at);
    if (at >= 0) rail.scrollTo({ left: left(cards[at]), behavior: "auto" });
  });

  // Price chips: bring that package into view sideways without moving the page
  d.querySelectorAll("a[data-jump]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var card = d.getElementById(a.getAttribute("href").slice(1)), rail = card && card.parentNode;
      if (!rail || !rail.scrollTo) return;
      e.preventDefault();
      var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // only the rail moves; the page and the row of prices stay where they are
      rail.scrollTo({ left: card.offsetLeft - (parseFloat(getComputedStyle(rail).paddingLeft) || 0), behavior: calm ? "auto" : "smooth" });
      // keyboard and screen-reader users land on that package's button
      var go = card.querySelector("[data-pick]");
      if (go) go.focus({ preventScroll: true });
    });
  });

  // Clothes rack: each hanging piece is a damped pendulum pushed by how fast the rail moves,
  // so the hanger goes with the rail and the hem trails behind. Same behaviour as in the shop.
  d.querySelectorAll("[data-rack]").forEach(function (rack) {
    var track = rack.querySelector(".rack-track"), prev = rack.querySelector("[data-prev]"), next = rack.querySelector("[data-next]");
    if (!track) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var pieces = Array.prototype.map.call(track.children, function (li, i) {
      li.style.setProperty("--i", i);
      return { el: li, a: 0, w: 0, gain: 0.8 + Math.random() * 0.5 };
    });
    var dragging = false, moved = false, coast = 0, startX = 0, startScroll = 0, prevX = 0, vel = 0;
    var lastX = track.scrollLeft, running = false, visible = false, opened = false;

    function tick() {
      var x = track.scrollLeft, v = Math.max(-70, Math.min(70, x - lastX)), alive = Math.abs(v) > 0.05;
      lastX = x;
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
    function ends() {
      if (!prev || !next) return;
      prev.setAttribute("aria-disabled", track.scrollLeft < 8);
      next.setAttribute("aria-disabled", track.scrollLeft + track.clientWidth > track.scrollWidth - 8);
    }
    track.addEventListener("scroll", function () { wake(); ends(); }, { passive: true });
    window.addEventListener("resize", ends);

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
    function release() {
      if (!dragging) return;
      dragging = false; track.classList.remove("grabbing");
      if (moved && !reduce) { coast = vel; glide(); }
      if (moved) setTimeout(function () { moved = false; }, 0);
    }
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    function glide() {
      if (Math.abs(coast) < 0.4) { coast = 0; return; }
      track.scrollLeft += coast; coast *= 0.92; wake();
      requestAnimationFrame(glide);
    }
    // a drag must not open the shop link under the pointer
    track.addEventListener("click", function (e) { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true);
    track.addEventListener("dragstart", function (e) { e.preventDefault(); });

    function nudge(dir) { track.scrollBy({ left: dir * track.clientWidth * 0.7, behavior: reduce ? "auto" : "smooth" }); }
    if (prev) prev.addEventListener("click", function () { nudge(-1); });
    if (next) next.addEventListener("click", function () { nudge(1); });
    ends();

    // hovering nudges a piece; one draught runs along the rail after it comes on screen, then it rests
    pieces.forEach(function (s) {
      s.el.addEventListener("pointerenter", function (e) {
        if (e.pointerType === "mouse" && !dragging) { s.w += (Math.random() < 0.5 ? -1 : 1) * 1.0; wake(); }
      });
    });
    var gust = setInterval(function () {
      if (reduce || !visible || d.hidden || dragging) return;
      var dir = Math.random() < 0.5 ? -1 : 1;
      pieces.forEach(function (s, i) { setTimeout(function () { s.w += dir * (0.28 + Math.random() * 0.22); wake(); }, i * 110); });
      clearInterval(gust);
    }, 3400);

    // first time on screen: the pieces drop onto the rail (CSS), then swing and settle
    function open() {
      if (opened) return;
      opened = true; rack.classList.add("in");
      if (!reduce) { pieces.forEach(function (s, i) { s.a = 11 * (i % 2 ? 1 : -1) * (0.6 + Math.random() * 0.6); }); setTimeout(wake, 350); }
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { visible = e.isIntersecting; if (visible) open(); });
      }, { threshold: 0.25 }).observe(rack);
    } else { visible = true; open(); }
  });

  // Choosing a package fills it in on the form
  d.querySelectorAll("[data-pick]").forEach(function (a) {
    a.addEventListener("click", function () {
      var sel = d.getElementById("f-package");
      if (!sel) return;
      var want = a.getAttribute("data-pick");
      Array.prototype.forEach.call(sel.options, function (o, i) { if (o.value === want) sel.selectedIndex = i; });
    });
  });
})();
