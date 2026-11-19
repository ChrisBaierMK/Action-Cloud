// Action Cloud: small enhancements. The page reads fine without this file;
// it adds the clickable plan, rail arrows, the price chips and package pre-selection.
(function () {
  "use strict";
  var d = document, root = d.documentElement;
  root.classList.add("js");
  // arriving with an anchor jumps straight to it (set in the page head); links clicked afterwards glide as usual
  window.addEventListener("load", function () { setTimeout(function () { root.classList.remove("jump"); }, 400); });

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

  // The plan you click: a tap anywhere in a room brings up its card (with a mouse, resting on the room is enough),
  // and the number follows the card you swipe to.
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
      if (chosen === "rest") return;                              // a resting mouse changes the card and nothing else
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
    // With a mouse, resting on a room is enough: its card comes up beside the plan, or under it on a narrow window.
    // Only the card changes; the page stays where it is. A fast pass across the plan on the way elsewhere changes nothing.
    var rest = 0, restFor = -1, px = 0, py = 0, pt = 0;
    Array.prototype.forEach.call(spots, function (a) {
      var i = first("data-n", a.getAttribute("data-spot"));
      if (i < 0) return;
      function arm() { clearTimeout(rest); restFor = i; rest = setTimeout(function () { show(i, "rest"); }, 110); }
      a.addEventListener("pointerenter", function (e) {
        if (e.pointerType !== "mouse") return;
        px = e.clientX; py = e.clientY; pt = e.timeStamp; arm();
      });
      a.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var dt = e.timeStamp - pt, far = Math.abs(e.clientX - px) + Math.abs(e.clientY - py);
        px = e.clientX; py = e.clientY; pt = e.timeStamp;
        if (dt > 0 && far / dt > 0.4) arm();                      // still travelling: wait until the pointer slows down
      });
      a.addEventListener("pointerleave", function () { if (restFor === i) clearTimeout(rest); });
    });
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
