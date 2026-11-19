// Action Cloud, the one form of the site: choose how you are in and only the line for that answer is shown.
// The page works without this file: every line is then visible and the form still sends.
(function () {
  "use strict";
  var d = document, form = d.querySelector('form[name="action"]');
  if (!form) return;
  d.documentElement.classList.add("js");
  var radios = form.querySelectorAll('input[name="ajutor"]'), groups = form.querySelectorAll("[data-group]"), rest = form.querySelector("[data-rest]");
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // older links: "I know someone with a space" is now one answer with "I have a space"
  var alias = { cunosc: "spatiu", join: "stiri" };

  function show(key) {
    groups.forEach(function (g) {
      var on = g.getAttribute("data-group") === key;
      g.hidden = !on;
      // a hidden line sends nothing
      g.querySelectorAll("input, select, textarea").forEach(function (f) { f.disabled = !on; });
    });
    rest.hidden = !key;
    radios.forEach(function (r) { r.parentNode.classList.toggle("on", r.checked); });
  }
  function choose(key) {
    key = alias[key] || key;
    var hit = false;
    radios.forEach(function (r) { if (r.getAttribute("data-key") === key) { r.checked = true; hit = true; } });
    if (hit) show(key);
    return hit;
  }
  function current() {
    var p = form.querySelector('input[name="ajutor"]:checked');
    return p ? p.getAttribute("data-key") : "";
  }

  radios.forEach(function (r) {
    r.addEventListener("change", function () {
      show(r.getAttribute("data-key"));
      // on a small screen the Send button may sit below the fold: bring the new lines into view, no further than needed
      var box = rest.getBoundingClientRect();
      if (box.bottom > window.innerHeight) rest.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: box.height > window.innerHeight * 0.8 ? "start" : "end" });
    });
  });

  // a link can arrive with the answer already chosen: /action/?tip=spatiu
  var want = null;
  try { want = new URLSearchParams(location.search).get("tip"); } catch (e) { /* old browser: start with nothing chosen */ }
  if (!want || !choose(want)) show(current());

  // buttons elsewhere on the page that lead to the form choose their answer on the way
  d.querySelectorAll("a[data-tip]").forEach(function (a) {
    a.addEventListener("click", function () { choose(a.getAttribute("data-tip")); });
  });
  // "Choose this package" on a sponsor card: the sponsor answer, with that package filled in
  d.querySelectorAll("a[data-pick]").forEach(function (a) {
    a.addEventListener("click", function () {
      choose("sponsor");
      var sel = d.getElementById("f-package"), wanted = a.getAttribute("data-pick");
      if (sel) Array.prototype.forEach.call(sel.options, function (o, i) { if (o.value === wanted) sel.selectedIndex = i; });
    });
  });

  // coming back with the browser's Back button can restore a choice after this script has run
  window.addEventListener("pageshow", function () { show(current()); });
})();
