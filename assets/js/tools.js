/* Positive.Energy — interactive tools (all data stays in the visitor's browser) */
(function () {
  "use strict";
  var D = window.PE_DATA || {}, st = window.PE_store || { get: function () { return null; }, set: function () {} };
  var toast = window.PE_toast || function () {}, copy = window.PE_copy || function () {};
  function $(id) { return document.getElementById(id); }
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function load(k, d) { try { return JSON.parse(st.get(k)) || d; } catch (e) { return d; } }
  function save(k, v) { st.set(k, JSON.stringify(v)); }
  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  var pre = (document.querySelector('link[rel="manifest"]') || { getAttribute: function () { return "site.webmanifest"; } }).getAttribute("href").replace("site.webmanifest", "");

  /* 1. Quick energy check (home hero) */
  var qc = $("quick-check");
  if (qc) {
    var ins = qc.querySelectorAll("input[type=range]"), orb = $("qc-orb"), tip = $("qc-tip"), lbl = $("qc-label");
    var tips = [
      [0, "Running low. Start tiny: a glass of water, 2 minutes of daylight and one slow breath. Then try the 1-minute physiological sigh.", "Low battery"],
      [45, "Mid-charge. A brisk 5-minute walk plus one focused 25-minute sprint will lift you fast.", "Recharging"],
      [65, "Good energy. Protect it: batch your shallow tasks and spend the peak on what matters.", "Charged"],
      [82, "High energy! Share it — send one gratitude text and tackle your hardest task now.", "Radiant"]
    ];
    function upd() {
      var sum = 0; ins.forEach(function (i) { sum += +i.value; var o = $(i.id + "-out"); if (o) o.textContent = i.value + "/10"; });
      var score = Math.round(sum / (ins.length * 10) * 100), t = tips[0];
      tips.forEach(function (x) { if (score >= x[0]) t = x; });
      orb.textContent = score; orb.style.transform = "scale(" + (0.82 + score / 550) + ")"; orb.style.filter = "saturate(" + (0.5 + score / 100) + ")";
      tip.textContent = t[1]; lbl.textContent = t[2];
    }
    ins.forEach(function (i) { i.addEventListener("input", upd); }); upd();
  }

  /* 2. Energy Score quiz */
  var qz = $("energy-quiz");
  if (qz) {
    var Q = [
      ["body", "I usually get 7+ hours of sleep that leaves me rested."], ["body", "I move my body for at least 20 minutes most days."],
      ["body", "I eat regular meals and drink enough water."], ["body", "I rarely hit an afternoon energy crash."],
      ["emotion", "I can name what I'm feeling and why."], ["emotion", "I bounce back from setbacks within a day or two."],
      ["emotion", "I feel appreciated by people around me."], ["emotion", "I regularly feel moments of joy or gratitude."],
      ["mind", "I can focus on one task for 25+ minutes without drifting."], ["mind", "My inner voice is mostly encouraging, not critical."],
      ["mind", "I take real breaks from screens during the day."], ["mind", "I feel in control of my to-do list, not buried by it."],
      ["purpose", "My daily work connects to something I care about."], ["purpose", "I spend time on activities that make me lose track of time."],
      ["purpose", "I have a clear goal for the next 12 months."], ["purpose", "I regularly help or contribute to others."]
    ];
    var names = { body: "Physical energy", emotion: "Emotional energy", mind: "Mental energy", purpose: "Purpose energy" };
    var recs = {
      body: ["Your body battery is the bottleneck. Start with sleep timing and a daily daylight walk.", "guides/boost-energy-naturally.html", "Boost energy naturally", "energy"],
      emotion: ["Emotional energy is your growth area. Gratitude and connection practices pay back fastest.", "tools/gratitude-journal.html", "Start a gratitude journal", "confidence"],
      mind: ["Mental energy is leaking. Reduce context-switching and soften your inner critic.", "tools/thought-reframer.html", "Try the thought reframer", "stress"],
      purpose: ["Purpose energy is low. Clarify what matters and add one meaningful action a week.", "guides/find-your-purpose.html", "Find your purpose", "purpose"]
    };
    var list = $("quiz-qs"), html = "";
    Q.forEach(function (q, i) {
      html += '<fieldset class="panel" style="padding:18px 20px;border-radius:16px;margin:0"><legend class="sr">Question ' + (i + 1) + '</legend><p style="font-weight:700;margin-bottom:10px">' + (i + 1) + ". " + q[1] + '</p><div class="choice-grid" style="grid-template-columns:repeat(5,1fr)">';
      ["Never", "Rarely", "Sometimes", "Often", "Always"].forEach(function (l, v) {
        html += '<label class="choice"><input type="radio" name="q' + i + '" value="' + (v + 1) + '" required><span style="text-align:center;padding:10px 4px;font-size:.85rem">' + l + "</span></label>";
      });
      html += "</div></fieldset>";
    });
    list.innerHTML = html;
    var prog = $("quiz-prog");
    qz.addEventListener("change", function () { prog.style.width = (qz.querySelectorAll("input:checked").length / Q.length * 100) + "%"; });
    qz.addEventListener("submit", function (e) {
      e.preventDefault();
      var miss = null; Q.forEach(function (q, i) { if (!miss && !qz.querySelector('[name="q' + i + '"]:checked')) miss = qz.querySelector('[name="q' + i + '"]'); });
      if (miss) { miss.closest("fieldset").scrollIntoView({ behavior: "smooth", block: "center" }); toast("Answer every question to see your score"); return; }
      var sc = { body: 0, emotion: 0, mind: 0, purpose: 0 }, total = 0;
      Q.forEach(function (q, i) { var v = +qz.querySelector('[name="q' + i + '"]:checked').value; sc[q[0]] += v; total += v; });
      var pct = Math.round((total - 16) / 64 * 100), low = "body", bars = "";
      Object.keys(sc).forEach(function (k) {
        var p = Math.round((sc[k] - 4) / 16 * 100); sc[k] = p; if (p < sc[low]) low = k;
        bars += '<div class="bar-row"><span>' + names[k] + '</span><div class="meter"><i style="width:' + Math.max(p, 4) + '%"></i></div><b>' + p + "</b></div>";
      });
      var type = pct >= 80 ? "Radiant" : pct >= 60 ? "Steady Glow" : pct >= 40 ? "Flickering" : "Running on Empty";
      $("res-score").textContent = pct; $("res-type").textContent = type; $("res-bars").innerHTML = bars;
      var r = recs[low];
      $("res-rec").innerHTML = "<b>Biggest opportunity: " + names[low] + ".</b> " + r[0] + ' <a href="' + pre + r[1] + '">' + r[2] + " →</a>";
      $("res-cta").href = pre + "match.html?goal=" + r[3];
      var hid = $("res-hidden"); if (hid) hid.value = "Score " + pct + " (" + type + ") — Body " + sc.body + ", Emotion " + sc.emotion + ", Mind " + sc.mind + ", Purpose " + sc.purpose;
      save("pe-score", { d: today(), s: pct, b: sc });
      var res = $("quiz-result"); res.classList.add("show"); res.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* 3. Breathing pacer */
  var br = $("breath");
  if (br) {
    var circ = $("breath-circle"), txt = $("breath-text"), sel = $("breath-pattern"), go = $("breath-go"), cyc = $("breath-cycles");
    var P = { box: [["Inhale", 4], ["Hold", 4], ["Exhale", 4], ["Hold", 4]], relax: [["Inhale", 4], ["Hold", 7], ["Exhale", 8]], coherent: [["Inhale", 5.5], ["Exhale", 5.5]], energize: [["Inhale", 2], ["Exhale", 2]], sigh: [["Inhale", 2], ["Sniff in", 1], ["Long exhale", 6]] };
    var running = false, timer = null, n = 0;
    function phase(seq, i) {
      if (!running) return;
      var p = seq[i]; txt.textContent = p[0] + " · " + p[1] + "s";
      circ.style.transitionDuration = p[1] + "s";
      if (/Inhale|Sniff/.test(p[0])) circ.style.transform = p[0] === "Sniff in" ? "scale(1.08)" : "scale(1)";
      else if (/Exhale/.test(p[0])) circ.style.transform = "scale(.6)";
      timer = setTimeout(function () {
        var nx = (i + 1) % seq.length; if (nx === 0) { n++; cyc.textContent = n; }
        phase(seq, nx);
      }, p[1] * 1000);
    }
    go.addEventListener("click", function () {
      running = !running; go.textContent = running ? "Stop" : "Start";
      clearTimeout(timer);
      if (running) { n = 0; cyc.textContent = 0; phase(P[sel.value], 0); }
      else { txt.textContent = "Paused"; circ.style.transitionDuration = "1s"; circ.style.transform = "scale(.6)"; }
    });
  }

  /* 4. Gratitude journal */
  var gj = $("journal");
  if (gj) {
    var KEY = "pe-journal", entries = load(KEY, []), listEl = $("journal-list");
    function streak() {
      var days = {}, s = 0, d = new Date();
      entries.forEach(function (e) { days[e.d] = 1; });
      while (true) { var k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); if (days[k]) { s++; d.setDate(d.getDate() - 1); } else break; }
      return s;
    }
    function render() {
      $("j-count").textContent = entries.length; $("j-streak").textContent = streak();
      listEl.innerHTML = entries.length ? "" : '<p class="fine">Your entries will appear here. They are saved only in this browser.</p>';
      entries.slice().reverse().forEach(function (e) {
        var el = document.createElement("div"); el.className = "journal-entry";
        el.innerHTML = "<time>" + esc(e.d) + "</time><ul>" + e.g.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
        listEl.appendChild(el);
      });
    }
    if (D.prompts) $("j-prompt").textContent = D.prompts[(window.PE_day || 0) % D.prompts.length];
    gj.addEventListener("submit", function (e) {
      e.preventDefault();
      var g = [].map.call(gj.querySelectorAll("input[name^=g]"), function (i) { return i.value.trim(); }).filter(Boolean);
      if (!g.length) { toast("Write at least one good thing"); return; }
      entries.push({ d: today(), g: g }); save(KEY, entries); gj.reset(); render(); toast("Saved. Nice work!");
    });
    $("j-export").addEventListener("click", function () {
      var t = entries.map(function (e) { return e.d + "\n- " + e.g.join("\n- "); }).join("\n\n");
      var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([t], { type: "text/plain" })); a.download = "gratitude-journal.txt"; a.click();
    });
    $("j-clear").addEventListener("click", function () { if (window.confirm && !window.confirm("Delete all entries from this browser?")) return; entries = []; save(KEY, entries); render(); });
    render();
  }

  /* 5. Affirmation generator */
  var ag = $("aff-gen");
  if (ag && D.affirmations) {
    var cat = "energy", idx = 0, favs = load("pe-favs", []), out = $("aff-out"), favEl = $("aff-favs");
    function show() { var arr = D.affirmations[cat]; out.textContent = arr[idx % arr.length]; }
    function renderFav() {
      favEl.innerHTML = favs.length ? "" : '<li class="fine">Tap ♥ Save to keep affirmations here.</li>';
      favs.forEach(function (f, i) { var li = document.createElement("li"); li.innerHTML = esc(f) + ' <button type="button" class="mini-acts" style="border:0;background:none;color:var(--muted);cursor:pointer" aria-label="Remove">✕</button>'; li.querySelector("button").onclick = function () { favs.splice(i, 1); save("pe-favs", favs); renderFav(); }; favEl.appendChild(li); });
    }
    $("aff-cats").addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      $("aff-cats").querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b === t); });
      cat = t.getAttribute("data-cat"); idx = Math.floor(Math.random() * 7); show();
    });
    $("aff-next").onclick = function () { idx++; show(); };
    $("aff-copy").onclick = function () { copy(out.textContent); };
    $("aff-save").onclick = function () { if (favs.indexOf(out.textContent) < 0) { favs.push(out.textContent); save("pe-favs", favs); renderFav(); toast("Saved to favourites"); } };
    $("aff-speak").onclick = function () { if ("speechSynthesis" in window) { var u = new SpeechSynthesisUtterance(out.textContent); u.rate = .9; speechSynthesis.speak(u); } };
    idx = (window.PE_day || 0); show(); renderFav();
  }

  /* 6. Mood & energy tracker */
  var mt = $("mood");
  if (mt) {
    var MK = "pe-mood", logs = load(MK, []), cv = $("mood-chart");
    function draw() {
      var ctx = cv.getContext("2d"), W = cv.width = cv.clientWidth * 2, H = cv.height = 260 * 2;
      ctx.clearRect(0, 0, W, H);
      var data = logs.slice(-30), pad = 60;
      var dark = getComputedStyle(document.body).color;
      ctx.strokeStyle = "rgba(128,120,160,.25)"; ctx.lineWidth = 2; ctx.font = "22px Figtree, sans-serif"; ctx.fillStyle = dark;
      for (var g = 1; g <= 5; g++) { var y = H - pad - (g - 1) / 4 * (H - 2 * pad); ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - 20, y); ctx.stroke(); ctx.fillText(g, 20, y + 8); }
      if (!data.length) { ctx.fillText("Log your first check-in to see your chart", pad + 20, H / 2); return; }
      function line(key, col) {
        ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath();
        data.forEach(function (d, i) { var x = pad + (data.length === 1 ? 0.5 : i / (data.length - 1)) * (W - pad - 40), y = H - pad - (d[key] - 1) / 4 * (H - 2 * pad); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
        ctx.stroke();
        data.forEach(function (d, i) { var x = pad + (data.length === 1 ? 0.5 : i / (data.length - 1)) * (W - pad - 40), y = H - pad - (d[key] - 1) / 4 * (H - 2 * pad); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fill(); });
      }
      line("m", "#FF6B4A"); line("e", "#7B5CFF");
    }
    function stats() {
      var n = logs.length, am = 0, ae = 0; logs.forEach(function (l) { am += l.m; ae += l.e; });
      $("mood-n").textContent = n; $("mood-am").textContent = n ? (am / n).toFixed(1) : "—"; $("mood-ae").textContent = n ? (ae / n).toFixed(1) : "—";
      var tags = {}; logs.forEach(function (l) { (l.t || []).forEach(function (t) { tags[t] = tags[t] || [0, 0]; tags[t][0] += l.e; tags[t][1]++; }); });
      var best = null; Object.keys(tags).forEach(function (t) { var a = tags[t][0] / tags[t][1]; if (tags[t][1] >= 2 && (!best || a > best[1])) best = [t, a]; });
      $("mood-insight").textContent = best ? "Your energy averages highest (" + best[1].toFixed(1) + "/5) on days tagged “" + best[0] + "”. Do more of that." : "Tag your check-ins to discover what lifts your energy most.";
    }
    mt.addEventListener("submit", function (e) {
      e.preventDefault();
      var t = [].map.call(mt.querySelectorAll("input[name=tag]:checked"), function (i) { return i.value; });
      logs.push({ d: today(), m: +mt.mood.value, e: +mt.energy.value, t: t, n: mt.note.value.trim() }); save(MK, logs);
      mt.reset(); draw(); stats(); toast("Check-in saved");
    });
    $("mood-clear").onclick = function () { if (window.confirm && !window.confirm("Delete all check-ins from this browser?")) return; logs = []; save(MK, logs); draw(); stats(); };
    window.addEventListener("resize", draw); draw(); stats();
  }

  /* 7. 30-day positivity challenge */
  var ch = $("challenge");
  if (ch && D.challenge) {
    var CK = "pe-challenge", done = load(CK, {}), bar = $("chal-bar"), cnt = $("chal-count");
    function renderC() {
      ch.innerHTML = ""; var n = 0;
      D.challenge.forEach(function (t, i) {
        var b = document.createElement("button"); b.type = "button"; b.className = "chal-day" + (done[i] ? " done" : "");
        b.setAttribute("aria-pressed", !!done[i]); b.innerHTML = "<b>Day " + (i + 1) + (done[i] ? " ✓" : "") + "</b><small>" + esc(t) + "</small>";
        b.onclick = function () { done[i] = !done[i]; save(CK, done); renderC(); if (done[i]) toast("Day " + (i + 1) + " complete!"); };
        if (done[i]) n++; ch.appendChild(b);
      });
      cnt.textContent = n; bar.style.width = (n / 30 * 100) + "%";
    }
    $("chal-reset").onclick = function () { done = {}; save(CK, done); renderC(); };
    renderC();
  }

  /* 8. Thought reframer */
  var rf = $("reframe");
  if (rf) {
    var traps = {
      all: ["All-or-nothing thinking", "Is there a middle ground between total success and total failure here?"],
      catastrophe: ["Catastrophising", "What's the most likely outcome — not the worst? How would I cope if the worst did happen?"],
      mind: ["Mind reading", "What evidence do I actually have about what they think? What else could explain it?"],
      should: ["“Should” statements", "Whose rule is this? What would a kinder, more flexible version sound like?"],
      label: ["Labelling", "I made a mistake, but does one action define who I am?"],
      filter: ["Mental filter", "What positive or neutral details am I leaving out?"],
      fortune: ["Fortune telling", "Have I been wrong about predictions like this before?"],
      personal: ["Personalising", "What other factors, outside me, contributed to this?"]
    };
    var tsel = $("rf-trap"), tq = $("rf-question");
    function upq() { tq.textContent = traps[tsel.value][1]; }
    tsel.addEventListener("change", upq); upq();
    rf.addEventListener("submit", function (e) {
      e.preventDefault();
      var th = rf.thought.value.trim(), ev = rf.evidence.value.trim(), fr = rf.friend.value.trim();
      var out = "Original thought: " + th + "\nThinking trap: " + traps[tsel.value][0] +
        (ev ? "\nEvidence against it: " + ev : "") + (fr ? "\nWhat I'd tell a friend: " + fr : "") +
        "\nBalanced thought: " + (rf.balanced.value.trim() || "Even if " + th.replace(/\.$/, "").toLowerCase() + " feels true right now, I have handled hard things before and I can take one helpful step today.");
      $("rf-out").textContent = out; $("rf-result").classList.add("show");
      var saved = load("pe-reframes", []); saved.push({ d: today(), t: out }); save("pe-reframes", saved.slice(-50));
    });
    $("rf-copy").onclick = function () { copy($("rf-out").textContent); };
  }

  /* Live match preview on the coach-matching funnel */
  var mf = $("match-form");
  if (mf) {
    var pv = $("match-preview");
    var labels = { confidence: "Confidence & mindset coach", stress: "Stress & resilience coach", career: "Career & purpose coach", energy: "Energy, habits & wellness coach", relationships: "Relationship & communication coach", purpose: "Life purpose coach", leadership: "Leadership & executive coach", business: "Business & entrepreneur coach" };
    function upm() {
      var g = mf.querySelector("[name=goal]:checked"), fmt = mf.querySelector("[name=format]:checked"), bud = mf.querySelector("[name=budget]");
      var t = g ? labels[g.value] || "Certified coach" : "Pick a goal to see your match";
      pv.querySelector("[data-m-type]").textContent = t;
      pv.querySelector("[data-m-fmt]").textContent = fmt ? fmt.value : "Video, phone or in-person";
      pv.querySelector("[data-m-bud]").textContent = bud && bud.value ? bud.value : "Any budget";
      var n = mf.querySelectorAll("input:checked").length;
      pv.querySelector("[data-m-fit]").style.width = Math.min(30 + n * 12, 96) + "%";
    }
    mf.addEventListener("change", upm); upm();
  }
})();
