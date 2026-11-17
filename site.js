// Action Cloud: small enhancements. The page reads fine without this file;
// it adds the progress line, rail arrows, zone filters and package pre-selection.
(function () {
  "use strict";
  var d = document, root = d.documentElement;
  root.classList.add("js");

  // Progress line under the top bar
  function progress() {
    var h = root.scrollHeight - window.innerHeight;
    root.style.setProperty("--p", h > 0 ? Math.min(1, window.scrollY / h).toFixed(4) : "0");
  }
  window.addEventListener("scroll", progress, { passive: true });
  window.addEventListener("resize", progress);
  progress();

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
    d.querySelectorAll("[data-chapter]").forEach(function (s) { io.observe(s); });
  }

  // Rails: arrow buttons scroll one card at a time
  d.querySelectorAll("[data-rail]").forEach(function (box) {
    var rail = box.querySelector(".rail"), prev = box.querySelector("[data-prev]"), next = box.querySelector("[data-next]");
    if (!rail || !prev || !next) return;
    function step() {
      var card = rail.querySelector("li:not([hidden])");
      return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || 16) : 320;
    }
    function state() {
      prev.disabled = rail.scrollLeft < 8;
      next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
    }
    prev.addEventListener("click", function () { rail.scrollBy({ left: -step(), behavior: "smooth" }); });
    next.addEventListener("click", function () { rail.scrollBy({ left: step(), behavior: "smooth" }); });
    rail.addEventListener("scroll", state, { passive: true });
    window.addEventListener("resize", state);
    box._state = state;
    state();
  });

  // Zone filters: one chip at a time; "all" resets
  d.querySelectorAll("[data-filters]").forEach(function (bar) {
    var box = d.getElementById(bar.getAttribute("data-filters"));
    if (!box) return;
    var rail = box.querySelector(".rail"), count = box.querySelector(".rail-count");
    var buttons = bar.querySelectorAll("button");
    function label(n) {
      if (!count) return;
      var t = n === 1 ? count.getAttribute("data-one") : (n >= 20 ? count.getAttribute("data-many") : count.getAttribute("data-few"));
      count.textContent = (t || "{n}").replace("{n}", n);
    }
    function apply(tag) {
      var n = 0;
      rail.querySelectorAll(":scope > li").forEach(function (li) {
        var show = tag === "all" || (" " + (li.getAttribute("data-tags") || "") + " ").indexOf(" " + tag + " ") > -1;
        li.hidden = !show;
        if (show) n++;
      });
      label(n);
      rail.scrollTo({ left: 0 });
      if (box._state) box._state();
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        buttons.forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
        apply(b.getAttribute("data-tag"));
      });
    });
    apply("all");
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
