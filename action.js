// Action Cloud, the take-action page: choose how you help and only the questions for that answer are shown.
// The page works without this file: every group is then visible and the form still sends.
(function () {
  "use strict";
  var d = document, form = d.querySelector('form[name="action"]');
  if (!form) return;
  d.documentElement.classList.add("js");
  var radios = form.querySelectorAll('input[name="ajutor"]'), groups = form.querySelectorAll("[data-group]"), rest = form.querySelector("[data-rest]"), pick = form.querySelector("[data-pick]");
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function show(key, move) {
    groups.forEach(function (g) {
      var on = g.getAttribute("data-group") === key;
      g.hidden = !on;
      // a hidden group sends nothing and cannot block the Send button
      g.querySelectorAll("input, select, textarea").forEach(function (f) {
        f.disabled = !on;
        if (f.hasAttribute("data-req")) f.required = on;
      });
    });
    rest.hidden = !key;
    if (pick) pick.hidden = !!key;
    radios.forEach(function (r) { r.parentNode.classList.toggle("on", r.checked); });
    var chosen = key && form.querySelector('[data-group="' + key + '"]');
    if (!chosen || !move) return;
    // bring the questions up only if they are not already in easy reach (on wide screens they open beside the answers)
    var top = chosen.getBoundingClientRect().top, bar = d.querySelector(".bar"), under = bar ? bar.getBoundingClientRect().bottom : 0;
    if (top < under || top > window.innerHeight * 0.5) chosen.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  }

  // a link can arrive with the answer already chosen: /action/?tip=spatiu
  var want = null;
  try { want = new URLSearchParams(location.search).get("tip"); } catch (e) { /* old browser: start with nothing chosen */ }
  radios.forEach(function (r) {
    if (want && r.getAttribute("data-key") === want) r.checked = true;
    r.addEventListener("change", function () { show(r.getAttribute("data-key"), true); });
  });
  var picked = form.querySelector('input[name="ajutor"]:checked');
  show(picked ? picked.getAttribute("data-key") : "", false);
  // coming back with the browser's Back button can restore a choice after this script has run
  window.addEventListener("pageshow", function () {
    var p = form.querySelector('input[name="ajutor"]:checked');
    show(p ? p.getAttribute("data-key") : "", false);
  });
})();
