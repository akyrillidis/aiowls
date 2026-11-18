/* field.js (AI-OWLS): the live hero. Particles run noisy gradient descent on a rugged 2-D
 * landscape drawn as contour lines; the cursor raises a bump that the particles flow around.
 * Source ~/Claude-Code/Websites/design/instrument/field-descent.js. Pauses when off screen;
 * draws one still frame under prefers-reduced-motion. */
(function () {
  var A = document.getElementById("field-a"), B = document.getElementById("field-b"), out = document.getElementById("readout");
  if (!A || !B) return;
  var fa = A.getContext("2d"), fb = B.getContext("2d");
  var wells = [[-1.9, .55, 1.0, .55], [-.6, -.7, .8, .45], [.7, .45, 1.15, .5], [1.9, -.55, .7, .4], [.1, .95, .5, .35],
               [-1.2, -1.25, .45, .35], [1.35, 1.2, .4, .3], [2.6, .6, .55, .4], [-2.7, -.4, .5, .4]];
  var mouse = null, W = 0, H = 0, S = 1, X0 = 3.4, Y0 = 2;
  function f(x, y, withMouse) {
    var v = .055 * (x * x + 1.8 * y * y);
    for (var i = 0; i < wells.length; i++) { var w = wells[i]; v -= w[2] * Math.exp(-((x - w[0]) * (x - w[0]) + (y - w[1]) * (y - w[1])) / (2 * w[3] * w[3])); }
    if (withMouse && mouse) v += .9 * Math.exp(-((x - mouse[0]) * (x - mouse[0]) + (y - mouse[1]) * (y - mouse[1])) / .24);
    return v;
  }
  function grad(x, y) {
    var gx = .11 * x, gy = .198 * y;
    for (var i = 0; i < wells.length; i++) {
      var w = wells[i], e = w[2] * Math.exp(-((x - w[0]) * (x - w[0]) + (y - w[1]) * (y - w[1])) / (2 * w[3] * w[3])) / (w[3] * w[3]);
      gx += e * (x - w[0]); gy += e * (y - w[1]);
    }
    if (mouse) { var m = .9 * Math.exp(-((x - mouse[0]) * (x - mouse[0]) + (y - mouse[1]) * (y - mouse[1])) / .24) / .12; gx -= m * (x - mouse[0]); gy -= m * (y - mouse[1]); }
    return [gx, gy];
  }
  function px(x, y) { return [W / 2 + x * S, H / 2 + y * S]; }
  function wd(x, y) { return [(x - W / 2) / S, (y - H / 2) / S]; }
  function layout() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = A.clientWidth; H = A.clientHeight;
    [A, B].forEach(function (c) { c.width = W * dpr; c.height = H * dpr; c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0); });
    S = W / (2 * X0); Y0 = H / (2 * S);
    fa.fillStyle = "#0A0B0D"; fa.fillRect(0, 0, W, H);
    var st = 7, nx = Math.ceil(W / st) + 1, ny = Math.ceil(H / st) + 1, G = [], lo = 1e9, hi = -1e9, i, j;
    for (j = 0; j < ny; j++) { G.push([]); for (i = 0; i < nx; i++) { var p = wd(i * st, j * st), v = f(p[0], p[1], false); G[j].push(v); if (v < lo) lo = v; if (v > hi) hi = v; } }
    var L = 22;
    for (var k = 1; k < L; k++) {
      var lev = lo + (hi - lo) * Math.pow(k / L, 1.6);
      fa.strokeStyle = k % 5 === 0 ? "rgba(236,234,228,.22)" : "rgba(236,234,228,.09)"; fa.lineWidth = 1; fa.beginPath();
      for (j = 0; j < ny - 1; j++) for (i = 0; i < nx - 1; i++) {
        var a = G[j][i], b = G[j][i + 1], c = G[j + 1][i + 1], d = G[j + 1][i];
        var idx = (a > lev) * 8 + (b > lev) * 4 + (c > lev) * 2 + (d > lev);
        if (idx === 0 || idx === 15) continue;
        var x = i * st, y = j * st, t = function (p, q) { return (lev - p) / (q - p); };
        var T = [x + st * t(a, b), y], R = [x + st, y + st * t(b, c)], Bo = [x + st * t(d, c), y + st], Le = [x, y + st * t(a, d)];
        var seg = { 1: [Le, Bo], 2: [Bo, R], 3: [Le, R], 4: [T, R], 5: [Le, T, Bo, R], 6: [T, Bo], 7: [Le, T], 8: [Le, T], 9: [T, Bo],
                    10: [T, R, Le, Bo], 11: [T, R], 12: [Le, R], 13: [Bo, R], 14: [Le, Bo] }[idx];
        for (var s = 0; s < seg.length; s += 2) { fa.moveTo(seg[s][0], seg[s][1]); fa.lineTo(seg[s + 1][0], seg[s + 1][1]); }
      }
      fa.stroke();
    }
  }
  var N = 260, P = [], it = 0, eta = .045, sigma = .32, running = true, raf = 0;
  function gauss() { var u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function spawn(p) { p.x = (Math.random() * 2 - 1) * X0; p.y = (Math.random() * 2 - 1) * Y0; p.age = 0; p.hot = Math.random() < .22; return p; }
  function step(draw) {
    if (draw) { fb.globalCompositeOperation = "destination-out"; fb.fillStyle = "rgba(0,0,0,.055)"; fb.fillRect(0, 0, W, H); fb.globalCompositeOperation = "lighter"; }
    var loss = 0;
    for (var i = 0; i < P.length; i++) {
      var p = P[i], g = grad(p.x, p.y), k = sigma * Math.sqrt(eta) * .35;
      var nx = p.x - eta * g[0] + k * gauss(), ny = p.y - eta * g[1] + k * gauss();
      if (draw) {
        var a = px(p.x, p.y), b = px(nx, ny);
        fb.strokeStyle = p.hot ? "rgba(255,106,26,.85)" : "rgba(236,234,228,.42)"; fb.lineWidth = p.hot ? 1.6 : 1;
        fb.beginPath(); fb.moveTo(a[0], a[1]); fb.lineTo(b[0], b[1]); fb.stroke();
      }
      p.x = nx; p.y = ny; p.age++; loss += f(p.x, p.y, false);
      if (p.age > 900 + 600 * Math.random() || Math.abs(p.x) > X0 * 1.05 || Math.abs(p.y) > Y0 * 1.05) spawn(p);
    }
    it++;
    if (out && it % 6 === 0) out.innerHTML = "step <b>" + it.toLocaleString() + "</b><br>particles <b>" + N + "</b> · η <b>" + eta + "</b> · σ <b>" + sigma +
      "</b><br>mean f(θ) <b>" + (loss / N).toFixed(3) + "</b><br><span class=\"hint\">move the cursor to reshape the landscape</span>";
  }
  function loop() { step(true); raf = running ? requestAnimationFrame(loop) : 0; }
  layout();
  for (var i = 0; i < N; i++) P.push(spawn({}));
  var hero = A.parentNode;
  hero.addEventListener("mousemove", function (e) { var r = A.getBoundingClientRect(); mouse = wd(e.clientX - r.left, e.clientY - r.top); });
  hero.addEventListener("mouseleave", function () { mouse = null; });
  var t; window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(layout, 150); });
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (var s = 0; s < 120; s++) step(true); running = false; return;
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { running = en[0].isIntersecting; if (running && !raf) raf = requestAnimationFrame(loop); }).observe(hero);
  }
  raf = requestAnimationFrame(loop);
})();
