/* log.js: the research log (List and Map views), cursor previews, Cmd-K search, keyboard moves.
 * Shared by AI-OWLS and QuanTAS; source ~/Claude-Code/Websites/design/instrument/log.js.
 * Data: <script type="application/json" id="log-data"> rendered by _includes/log.html from
 * _data/posts.yml (posts, newest first, each with an optional map: [x, y]) and _data/map.yml
 * (axis labels and edges). The list itself is plain HTML, so the page works without this file. */
(function () {
  var el = document.getElementById("log-data");
  if (!el) return;
  var D = JSON.parse(el.textContent), P = D.posts, CFG = D.mapcfg || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var log = $(".log"), rowsBox = $(".rows", log), rows = rowsBox ? rowsBox.children : [];
  var listView = $(".view-list", log), mapView = $(".view-map", log);
  var narrow = function () { return window.innerWidth <= 900; };
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- cursor preview on the list ---------- */
  var peek = $(".peek"), pimg = peek && $("img", peek), ptxt = peek && $("p", peek);
  if (rowsBox && peek) {
    rowsBox.addEventListener("mousemove", function (e) {
      var r = e.target.closest(".row"); if (!r) return;
      var p = P[+r.dataset.i];
      if (pimg.getAttribute("src") !== p.thumb) { pimg.src = p.thumb; pimg.alt = p.thumb_alt || ""; ptxt.textContent = p.summary; }
      peek.style.left = Math.min(window.innerWidth - 360, e.clientX + 24) + "px";
      peek.style.top = Math.min(window.innerHeight - 300, e.clientY + 18) + "px";
      if (!narrow()) peek.classList.add("on");
    });
    rowsBox.addEventListener("mouseleave", function () { peek.classList.remove("on"); });
  }

  /* ---------- keyboard selection ---------- */
  var sel = -1;
  function select(i) {
    if (!rows.length) return;
    if (sel >= 0 && rows[sel]) rows[sel].classList.remove("sel");
    sel = Math.max(0, Math.min(rows.length - 1, i));
    rows[sel].classList.add("sel");
    rows[sel].scrollIntoView({ block: "nearest", behavior: still ? "auto" : "smooth" });
  }

  /* ---------- Cmd-K palette ---------- */
  var pal = $(".pal"), q = pal && $("input", pal), res = pal && $("ul", pal), psel = 0, hits = [];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function render() {
    var t = q.value.toLowerCase().trim();
    hits = P.filter(function (p) { return !t || (p.title + " " + p.summary + " " + p.authors + " " + (p.series || "")).toLowerCase().indexOf(t) >= 0; });
    psel = 0;
    res.innerHTML = hits.map(function (p, i) { return '<li class="' + (i ? "" : "sel") + '" data-u="' + esc(p.url) + '">' + esc(p.title) + "<span>" + esc(p.date) + "</span></li>"; }).join("");
  }
  var lastFocus = null;
  function openPal() { if (!pal) return; lastFocus = document.activeElement; pal.classList.add("on"); q.value = ""; render(); setTimeout(function () { q.focus(); }, 0); }
  function closePal() { pal.classList.remove("on"); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  if (pal) {
    pal.addEventListener("click", function (e) { if (e.target === pal) closePal(); });
    res.addEventListener("click", function (e) { var li = e.target.closest("li"); if (li) location.href = li.dataset.u; });
    q.addEventListener("input", render);
    document.querySelectorAll("[data-open-palette]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); openPal(); }); });
  }

  /* ---------- views ---------- */
  var built = false, buttons = log.querySelectorAll(".views button");
  function setView(v, push) {
    if (narrow()) v = "list";   // the map needs room; phones get the list
    var isMap = v === "map";
    listView.hidden = isMap; mapView.hidden = !isMap;
    buttons.forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.view === v)); });
    if (isMap && !built) { buildMap(); built = true; }
    if (push) history.replaceState(null, "", isMap ? "#map" : "#log");
    try { localStorage.setItem("log-view", v); } catch (e) {}
  }
  buttons.forEach(function (b) { b.addEventListener("click", function () { setView(b.dataset.view, true); }); });

  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") || (e.key === "/" && tag !== "input" && !(pal && pal.classList.contains("on")))) { e.preventDefault(); openPal(); return; }
    if (pal && pal.classList.contains("on")) {
      var li = res.children;
      if (e.key === "Escape") closePal();
      if (e.key === "Tab") { e.preventDefault(); q.focus(); }   // keep focus inside the dialog
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && li.length) {
        e.preventDefault(); li[psel].classList.remove("sel");
        psel = (psel + (e.key === "ArrowDown" ? 1 : li.length - 1)) % li.length;
        li[psel].classList.add("sel"); li[psel].scrollIntoView({ block: "nearest" });
      }
      if (e.key === "Enter" && hits[psel]) location.href = hits[psel].url;
      return;
    }
    if (tag === "input" || tag === "textarea" || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "Enter" && e.target.closest && e.target.closest("a, button, select, [role=tab]")) return;
    if (e.key === "j") select(sel + 1);
    if (e.key === "k") select(sel - 1);
    if (e.key === "Enter" && sel >= 0 && !listView.hidden) location.href = P[sel].url;
    if (e.key === "v") setView(listView.hidden ? "list" : "map", true);
  });

  /* ---------- map ---------- */
  function buildMap() {
    var NS = "http://www.w3.org/2000/svg", svg = $("svg", mapView), world = $(".world", mapView), stage = $(".mapstage", mapView);
    var card = $(".mapcard", mapView), VW = 1600, VH = 1000, NW = 210, NH = 132;
    function mk(t, a) { var n = document.createElementNS(NS, t); for (var k in a) n.setAttribute(k, a[k]); return n; }
    // the axes cross in the empty lanes of the layout grid (columns at 170/420/670 | 950/1200/1450,
    // rows at 150/400 | 650/880), so no label lands on a note
    var ax = CFG.axes || {}, AX = 810, AY = 535;
    world.appendChild(mk("line", { x1: AX, y1: 40, x2: AX, y2: VH - 40, stroke: "#2A3039", "stroke-dasharray": "2 8" }));
    world.appendChild(mk("line", { x1: 40, y1: AY, x2: VW - 40, y2: AY, stroke: "#2A3039", "stroke-dasharray": "2 8" }));
    [[ax.left, 52, AY - 9, "start"], [ax.right, VW - 52, AY - 9, "end"], [ax.top, AX + 12, 52, "start"], [ax.bottom, AX + 12, VH - 26, "start"]]
      .forEach(function (a) { if (!a[0]) return; var t = mk("text", { x: a[1], y: a[2], "class": "axis", "text-anchor": a[3] }); t.textContent = a[0]; world.appendChild(t); });
    var byKey = {}, pos = {}, free = 0;
    P.forEach(function (p) {
      byKey[p.key] = p;
      pos[p.key] = (p.map && p.map.length === 2) ? p.map : [140 + (free++ % 6) * 240, VH - 90];   // unplaced posts wait in a row
    });
    var edges = (CFG.edges || []).filter(function (e) { return pos[e[0]] && pos[e[1]]; }).map(function (e) {
      // the arc rises above both nodes, higher for longer spans, so it never runs through a title;
      // its label shows only while one of its two notes is hovered
      var a = pos[e[0]], b = pos[e[1]], mx = (a[0] + b[0]) / 2;
      var my = Math.min(a[1], b[1]) - 70 - 0.2 * Math.abs(a[0] - b[0]), g = mk("g", { "class": "eg" });
      var path = mk("path", { d: "M" + a[0] + "," + a[1] + " Q" + mx + "," + my + " " + b[0] + "," + b[1], "class": "edge" });
      var t = mk("text", { x: mx, y: (a[1] + 2 * my + b[1]) / 4 - 8, "class": "elab", "text-anchor": "middle" }); t.textContent = e[2] || "";
      g.appendChild(path); g.appendChild(t); world.appendChild(g); return { a: e[0], b: e[1], path: path, g: g };
    });
    var nodes = {};
    P.forEach(function (p) {
      var c = pos[p.key], x = c[0] - NW / 2, y = c[1] - NH / 2, g = mk("a", { href: p.url, "class": "node" });
      g.appendChild(mk("rect", { x: x, y: y, width: NW, height: NH, rx: 10, "class": "f" }));
      g.appendChild(mk("rect", { x: x + 6, y: y + 6, width: NW - 12, height: NH - 12, rx: 6, "class": "im" }));
      g.appendChild(mk("image", { href: p.thumb, x: x + 10, y: y + 10, width: NW - 20, height: NH - 20, preserveAspectRatio: "xMidYMid meet" }));
      var no = mk("text", { x: x, y: y - 10, "class": "no" }); no.textContent = "№ " + ("00" + p.n).slice(-2) + " · " + p.date.slice(0, 7); g.appendChild(no);
      var words = p.title.split(" "), lines = [""], cut = false;
      words.forEach(function (w) {
        var L = lines[lines.length - 1];
        if (cut) return;
        if (L && (L + " " + w).length > 25) { if (lines.length === 2) { cut = true; return; } lines.push(w); }
        else lines[lines.length - 1] = L ? L + " " + w : w;
      });
      if (cut) lines[1] = lines[1].replace(/[,:;]?$/, "") + "\u2026";
      lines.forEach(function (l, i) { var t = mk("text", { x: x, y: y + NH + 21 + i * 18 }); t.textContent = l; g.appendChild(t); });
      g.addEventListener("mouseenter", function () { focus(p.key); });
      g.addEventListener("mouseleave", function () { focus(null); });
      g.addEventListener("focus", function () { focus(p.key); });
      g.addEventListener("blur", function () { focus(null); });
      world.appendChild(g); nodes[p.key] = g;
    });
    function focus(k) {
      world.classList.toggle("dim", !!k);
      Object.keys(nodes).forEach(function (n) {
        var near = k && (n === k || edges.some(function (e) { return (e.a === k && e.b === n) || (e.b === k && e.a === n); }));
        nodes[n].classList.toggle("hi", !!near);
      });
      edges.forEach(function (e) { var on = !!k && (e.a === k || e.b === k); e.path.classList.toggle("hi", on); e.g.classList.toggle("hi", on); });
      if (!k) { card.classList.remove("on"); return; }
      var p = byKey[k];
      $("img", card).src = p.thumb; $("img", card).alt = p.thumb_alt || "";
      $("h3", card).textContent = p.title; $("p", card).textContent = p.summary;
      $(".mt", card).textContent = p.date + " · " + p.minutes + " min read" + (p.series ? " · " + p.series : "");
      $(".by", card).textContent = p.authors;
      card.classList.toggle("left", pos[k][0] > (vb[0] + vb[2] / 2));
      card.classList.add("on");
    }
    var vb = [0, 0, VW, VH], drag = null;
    function setVB() { svg.setAttribute("viewBox", vb.join(" ")); }
    function zoom(k, cx, cy) {
      var nw = Math.max(480, Math.min(2600, vb[2] * k)), s = nw / vb[2];
      vb = [cx - (cx - vb[0]) * s, cy - (cy - vb[1]) * s, nw, vb[3] * s]; setVB();
    }
    svg.addEventListener("wheel", function (e) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault(); var r = svg.getBoundingClientRect();
      zoom(Math.exp(e.deltaY * 0.0012), vb[0] + (e.clientX - r.left) / r.width * vb[2], vb[1] + (e.clientY - r.top) / r.height * vb[3]);
    }, { passive: false });
    svg.addEventListener("pointerdown", function (e) {
      if (e.target.closest(".node")) return;
      drag = [e.clientX, e.clientY, vb[0], vb[1]]; stage.classList.add("drag"); svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener("pointermove", function (e) {
      if (!drag) return; var r = svg.getBoundingClientRect();
      vb[0] = drag[2] - (e.clientX - drag[0]) / r.width * vb[2]; vb[1] = drag[3] - (e.clientY - drag[1]) / r.height * vb[3]; setVB();
    });
    svg.addEventListener("pointerup", function () { drag = null; stage.classList.remove("drag"); });
    mapView.querySelectorAll(".mapzoom button").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.dataset.z === "0") { vb = [0, 0, VW, VH]; setVB(); return; }
        zoom(b.dataset.z === "+" ? 0.8 : 1.25, vb[0] + vb[2] / 2, vb[1] + vb[3] / 2);
      });
    });
  }

  var start = location.hash === "#map" ? "map" : (location.hash === "#log" ? "list" : null);
  if (!start) { try { start = localStorage.getItem("log-view"); } catch (e) {} }
  setView(start === "map" ? "map" : "list", false);
})();
