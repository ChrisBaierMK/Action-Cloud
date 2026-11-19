// Action Cloud, the one form of the site: choose how you join in and only the line for that answer is shown.
// The page works without this file: every line is then visible and the form still sends.
(function () {
  "use strict";
  var d = document, form = d.querySelector('form[name="action"]');
  if (!form) return;
  var radios = form.querySelectorAll('input[name="ajutor"]'), groups = form.querySelectorAll("[data-group]");
  var rest = form.querySelector("[data-rest]"), list = form.querySelector(".choices"), change = form.querySelector("[data-change]");
  if (!rest || !list || !radios.length) return;
  d.documentElement.classList.add("js");
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var subject = form.querySelector("[data-subject-field]"), subject0 = subject ? subject.value : "";
  var contact = form.querySelector("[data-contact]"), label = contact && form.querySelector('label[for="' + contact.id + '"] [data-label]');
  var asked = contact ? { text: label ? label.textContent : "", pattern: contact.getAttribute("pattern"), title: contact.getAttribute("title") } : null;
  // older links and anchors: "I know someone with a space" is one answer with "I have a space"; the old sign-up and contact stops
  var alias = { cunosc: "spatiu", join: "stiri", ajut: "crew" }, anchors = { crew: "stiri", join: "stiri", contact: "sponsor" };
  var byHand = false;   // a tap or click, as opposed to arrow keys

  function current() {
    var p = form.querySelector('input[name="ajutor"]:checked');
    return p ? p.getAttribute("data-key") : "";
  }
  function fields(g) { return g.querySelectorAll("input, select, textarea"); }

  // show the line of one answer; "one": fold the list down to the chosen row
  function show(key, one) {
    groups.forEach(function (g) { g.hidden = g.getAttribute("data-group") !== key; });
    rest.hidden = !key;
    radios.forEach(function (r) {
      r.parentNode.classList.toggle("on", r.checked);
      if (r.checked && subject) subject.value = subject0.replace("formular nou", r.getAttribute("data-subject") || "formular nou");
    });
    list.classList.toggle("one", !!key && !!one);
    if (change) change.hidden = !(key && one);
    // news goes out by email, so that answer asks for an email address; the others take a phone number or an address
    if (contact && asked) {
      var news = key === "stiri";
      contact.type = news ? "email" : "text";
      contact.setAttribute("autocomplete", news ? "email" : "tel");
      if (news) { contact.removeAttribute("pattern"); contact.removeAttribute("title"); }
      else { contact.setAttribute("pattern", asked.pattern); contact.setAttribute("title", asked.title); }
      if (label) label.textContent = news ? contact.getAttribute("data-email-label") : asked.text;
    }
  }
  function choose(key) {
    key = alias[key] || key;
    var hit = false;
    radios.forEach(function (r) { if (r.getAttribute("data-key") === key) { r.checked = true; hit = true; } });
    if (hit) show(key, true);
    return hit;
  }
  // bring the question to the top of the screen, just under the bar: the chosen row, its line and Send then fit below it
  function toForm(smooth) { list.scrollIntoView({ behavior: smooth && !calm ? "smooth" : "auto", block: "start" }); }

  form.addEventListener("pointerdown", function () { byHand = true; });
  form.addEventListener("keydown", function () { byHand = false; });
  radios.forEach(function (r) {
    // click, not change: tapping the answer that is already chosen folds the list again
    r.addEventListener("click", function () {
      show(r.getAttribute("data-key"), byHand);
      // the page moves only if Send would be out of sight, and never past the question
      var send = form.querySelector('button[type="submit"]');
      if (byHand && send && send.getBoundingClientRect().bottom > window.innerHeight) toForm(true);
    });
  });
  if (change) change.addEventListener("click", function () {
    show(current(), false);
    var p = form.querySelector('input[name="ajutor"]:checked');
    if (p) p.focus();
  });

  // a line that is not shown sends nothing: switched off only at the moment of sending, so that Back still finds what was typed
  form.addEventListener("submit", function () {
    groups.forEach(function (g) { if (g.hidden) Array.prototype.forEach.call(fields(g), function (f) { f.disabled = true; }); });
  });
  window.addEventListener("pageshow", function () {
    groups.forEach(function (g) { Array.prototype.forEach.call(fields(g), function (f) { f.disabled = false; }); });
    show(current(), list.classList.contains("one"));
  });

  // a link can arrive with the answer already chosen: /action/?tip=spatiu, or an older anchor such as #crew
  var want = "";
  try { want = (new URLSearchParams(location.search).get("tip") || "").trim().toLowerCase(); } catch (e) { /* old browser: start with nothing chosen */ }
  if (!want) want = anchors[location.hash.slice(1)] || "";
  if (want && choose(want)) {
    if (location.hash) window.addEventListener("load", function () { toForm(false); });
  } else show(current(), !!current());

  // buttons elsewhere on the page lead to the form and choose their answer on the way
  function lead(a, pick) {
    a.addEventListener("click", function (e) {
      // the link in the top bar does not replace an answer the visitor has already chosen
      if (!(a.closest(".bar") && current())) pick();
      e.preventDefault();
      toForm(true);
    });
  }
  Array.prototype.forEach.call(d.querySelectorAll("a[data-tip]"), function (a) { lead(a, function () { choose(a.getAttribute("data-tip")); }); });
  // "Choose this package" on a sponsor card: the sponsor answer, with that package filled in
  Array.prototype.forEach.call(d.querySelectorAll("a[data-pick]"), function (a) {
    lead(a, function () {
      choose("sponsor");
      var sel = d.getElementById("f-package"), wanted = a.getAttribute("data-pick");
      if (sel) Array.prototype.forEach.call(sel.options, function (o, i) { if (o.value === wanted) sel.selectedIndex = i; });
    });
  });

  // changing language keeps the place and the answer
  var lang = d.querySelector(".bar a.lang");
  if (lang) lang.addEventListener("click", function () {
    var key = current();
    if (key) lang.href = lang.getAttribute("href").split(/[?#]/)[0] + "?tip=" + key + "#action";
  });
})();
