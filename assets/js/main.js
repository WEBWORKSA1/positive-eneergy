/* Positive.Energy — core interactions */
(function () {
  "use strict";
  var S = window.SITE || {}, D = window.PE_DATA || {};
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  window.PE_store = store;
  var root = document.documentElement;

  /* Theme */
  var saved = store.get("pe-theme");
  if (saved) root.setAttribute("data-theme", saved);
  document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      var dark = root.getAttribute("data-theme") === "dark" ||
        (!root.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
      var next = dark ? "light" : "dark";
      root.setAttribute("data-theme", next); store.set("pe-theme", next);
    });
  });

  /* Mobile menu */
  var mb = document.querySelector(".menu-btn"), nav = document.getElementById("nav");
  if (mb && nav) mb.addEventListener("click", function () {
    var open = nav.classList.toggle("open"); mb.setAttribute("aria-expanded", open);
  });

  document.querySelectorAll("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });

  /* Toast */
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }
  window.PE_toast = toast;
  function copy(text) {
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { toast("Copied to clipboard"); });
  }
  function share(text) {
    if (navigator.share) navigator.share({ text: text, url: location.origin + "/" }).catch(function () {});
    else copy(text + " — " + location.origin + "/");
  }
  window.PE_copy = copy; window.PE_share = share;

  /* Consent */
  var c = document.getElementById("consent");
  if (c && !store.get("pe-consent")) {
    c.hidden = false;
    c.querySelectorAll("[data-consent]").forEach(function (b) {
      b.addEventListener("click", function () {
        store.set("pe-consent", b.getAttribute("data-consent"));
        if (b.getAttribute("data-consent") === "essential") (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1;
        c.hidden = true;
      });
    });
  }
  if (store.get("pe-consent") === "essential") (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1;

  /* Reserved ad slots — filled only when a slot ID is configured in config.js */
  var slots = S.adSlots || {};
  document.querySelectorAll(".ad-slot[data-slot]").forEach(function (box) {
    var type = box.getAttribute("data-slot"), id = slots[type];
    if (!id) return;
    var ins = document.createElement("ins");
    ins.className = "adsbygoogle"; ins.style.display = "block";
    ins.setAttribute("data-ad-client", S.adsenseClient); ins.setAttribute("data-ad-slot", id);
    if (type === "inArticle") { ins.style.textAlign = "center"; ins.setAttribute("data-ad-layout", "in-article"); ins.setAttribute("data-ad-format", "fluid"); }
    else if (type === "multiplex") ins.setAttribute("data-ad-format", "autorelaxed");
    else { ins.setAttribute("data-ad-format", "auto"); ins.setAttribute("data-full-width-responsive", "true"); }
    box.appendChild(ins); box.hidden = false;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  });

  /* Daily rotation — the site updates itself every day */
  var now = new Date();
  var dayNum = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 864e5);
  window.PE_day = dayNum;
  function pick(arr, offset) { return arr && arr.length ? arr[(dayNum + (offset || 0)) % arr.length] : null; }
  function set(sel, txt) { document.querySelectorAll(sel).forEach(function (n) { n.textContent = txt; }); }
  if (D.quotes) {
    var q = pick(D.quotes, 0);
    set("[data-daily-quote]", q[0]); set("[data-daily-author]", "— " + q[1]);
    var allAff = []; Object.keys(D.affirmations).forEach(function (k) { allAff = allAff.concat(D.affirmations[k]); });
    var a = pick(allAff, 3); set("[data-daily-aff]", a);
    var p = pick(D.practices, 1);
    set("[data-daily-practice]", p.t); set("[data-daily-practice-min]", p.m + " min"); set("[data-daily-practice-steps]", p.s);
    set("[data-daily-prompt]", pick(D.prompts, 2)); set("[data-daily-kind]", pick(D.kindness, 5));
    set("[data-daily-date]", now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }));
    document.querySelectorAll("[data-copy-quote]").forEach(function (b) { b.addEventListener("click", function () { copy("“" + q[0] + "” — " + q[1]); }); });
    document.querySelectorAll("[data-share-quote]").forEach(function (b) { b.addEventListener("click", function () { share("“" + q[0] + "” — " + q[1]); }); });
    document.querySelectorAll("[data-copy-aff]").forEach(function (b) { b.addEventListener("click", function () { copy(a); }); });
  }

  /* Quotes library */
  var ql = document.getElementById("quote-list");
  if (ql && D.quotes) {
    var qs = document.getElementById("quote-search"), qf = document.querySelector("[data-qfilter]"), cat = "all";
    function renderQ() {
      var term = qs ? qs.value.trim().toLowerCase() : "", n = 0;
      ql.innerHTML = "";
      D.quotes.forEach(function (x) {
        if (cat !== "all" && x[2] !== cat) return;
        if (term && (x[0] + " " + x[1]).toLowerCase().indexOf(term) < 0) return;
        n++;
        var el = document.createElement("div"); el.className = "quote-card";
        el.innerHTML = '<q></q><span class="by"></span><div class="mini-acts"><button type="button" data-a="c">Copy</button><button type="button" data-a="s">Share</button><span class="tag" style="margin:0"></span></div>';
        el.querySelector("q").textContent = x[0]; el.querySelector(".by").textContent = "— " + x[1]; el.querySelector(".tag").textContent = x[2];
        el.querySelector('[data-a="c"]').onclick = function () { copy("“" + x[0] + "” — " + x[1]); };
        el.querySelector('[data-a="s"]').onclick = function () { share("“" + x[0] + "” — " + x[1]); };
        ql.appendChild(el);
      });
      var cnt = document.getElementById("quote-count"); if (cnt) cnt.textContent = n + " quotes";
    }
    if (qs) qs.addEventListener("input", renderQ);
    if (qf) qf.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      qf.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b === t); });
      cat = t.getAttribute("data-cat"); renderQ();
    });
    renderQ();
  }

  /* Positive news — live headlines from solutions-journalism RSS feeds (via rss2json, cached 3h),
     merged with the bundled assets/data/news.json fallback. Self-updating, no server needed. */
  var nl = document.querySelectorAll("[data-news]");
  if (nl.length) {
    var base = document.querySelector('link[rel="manifest"]').getAttribute("href").replace("site.webmanifest", "");
    var FEEDS = [["Positive News", "https://www.positive.news/feed/"], ["Good News Network", "https://www.goodnewsnetwork.org/feed/"], ["Greater Good Magazine", "https://greatergood.berkeley.edu/site/rss/articles"], ["Reasons to be Cheerful", "https://reasonstobecheerful.world/feed/"]];
    var SKIP = /subscribe|sponsored|advertis|giveaway|horoscope|deal of|good news in history/i;
    var strip = function (h) { var d = document.createElement("div"); d.innerHTML = h || ""; var t = (d.textContent || "").replace(/\s+/g, " ").trim().replace(/The post .*? appeared first on .*$/, ""); return t.length > 170 ? t.slice(0, 170).replace(/\s\S*$/, "") + "…" : t; };
    function live() {
      var c = null; try { c = JSON.parse(store.get("pe-news")); } catch (e) {}
      if (c && Date.now() - c.t < 3 * 36e5) return Promise.resolve(c.items);
      return Promise.all(FEEDS.map(function (f) {
        return fetch("https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(f[1])).then(function (r) { return r.json(); }).then(function (j) {
          return j.status === "ok" ? j.items.slice(0, 10).map(function (it) { return { title: it.title, link: it.link, source: f[0], date: it.pubDate ? it.pubDate.replace(" ", "T") + "Z" : null, summary: strip(it.description) }; }) : [];
        }).catch(function () { return []; });
      })).then(function (a) { var items = [].concat.apply([], a); if (items.length) store.set("pe-news", JSON.stringify({ t: Date.now(), items: items })); return items; });
    }
    Promise.all([fetch(base + "assets/data/news.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).catch(function () { return { items: [] }; }), live().catch(function () { return []; })]).then(function (res) {
      var seen = {}, all = (res[1] || []).concat(res[0].items || []).filter(function (it) { if (!it.link || seen[it.link] || SKIP.test(it.title)) return false; seen[it.link] = 1; return true; });
      all.sort(function (x, y) { return (y.date || "").localeCompare(x.date || ""); });
      var j = { updated: res[1] && res[1].length ? new Date().toISOString() : res[0].updated, items: all };
      var up = document.querySelectorAll("[data-news-updated]");
      up.forEach(function (u) { u.textContent = j.updated ? new Date(j.updated).toLocaleString() : ""; });
      nl.forEach(function (box) {
        var lim = +box.getAttribute("data-news") || 999, srcf = box.getAttribute("data-news-src");
        box.innerHTML = "";
        (j.items || []).filter(function (it) { return !srcf || it.source === srcf; }).slice(0, lim).forEach(function (it) {
          var a = document.createElement("a"); a.className = "card news-item"; a.href = it.link; a.target = "_blank"; a.rel = "noopener nofollow";
          a.innerHTML = '<span class="src"></span><h3 style="font-size:1.05rem;margin:0"></h3><p style="margin:0;font-size:.92rem"></p><span class="more">Read at source →</span>';
          a.querySelector(".src").textContent = it.source + (it.date ? " · " + new Date(it.date).toLocaleDateString() : "");
          a.querySelector("h3").textContent = it.title;
          a.querySelector("p").textContent = it.summary || "";
          box.appendChild(a);
        });
        if (!box.children.length) box.innerHTML = '<p class="fine">Fresh headlines are loading — check back shortly.</p>';
      });
    }).catch(function () { nl.forEach(function (b) { b.innerHTML = '<p class="fine">Headlines are refreshing. Please check back soon.</p>'; }); });
  }

  /* Relay endpoint (address assembled at runtime, never present in markup) */
  function relay() {
    var k = S._k || [];
    var rev = function (b) { return atob(b).split("").reverse().join(""); };
    return "https://formsubmit.co/ajax/" + rev(k[0]) + String.fromCharCode(64) + rev(k[1]);
  }

  /* Prefill from URL (?goal=confidence) */
  var qsp = new URLSearchParams(location.search);
  document.querySelectorAll("form[data-prefill]").forEach(function (f) {
    qsp.forEach(function (v, k) {
      f.querySelectorAll('[name="' + k + '"]').forEach(function (el) {
        if (el.type === "checkbox" || el.type === "radio") v.split(",").forEach(function (x) { if (el.value === x) el.checked = true; });
        else el.value = v;
      });
    });
  });

  /* Quick lead starters → full funnel with picks carried over */
  document.querySelectorAll("form[data-quick]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var p = new URLSearchParams();
      new FormData(f).forEach(function (v, k) { if (v) p.append(k, v); });
      location.href = f.getAttribute("action") + (p.toString() ? "?" + p.toString() : "");
    });
  });

  /* Multi-step forms */
  document.querySelectorAll("form[data-steps]").forEach(function (f) {
    var steps = f.querySelectorAll(".step"), bars = f.querySelectorAll(".steps-bar i"), i = 0, cur = f.querySelector("[data-step-now]");
    function show(n) {
      steps.forEach(function (s, j) { s.hidden = j !== n; });
      bars.forEach(function (b, j) { b.classList.toggle("on", j <= n); });
      if (cur) cur.textContent = n + 1; i = n;
      var first = steps[n].querySelector("input:not([type=radio]):not([type=checkbox]),select,textarea");
      if (first && n > 0) first.focus({ preventScroll: true });
      if (n > 0) { var top = f.getBoundingClientRect().top + window.scrollY - 110; if (window.scrollY > top) window.scrollTo({ top: top }); }
      f.dispatchEvent(new CustomEvent("stepchange", { detail: n }));
    }
    f.querySelectorAll("[data-next]").forEach(function (b) {
      b.addEventListener("click", function () {
        var ok = true, st = f.querySelector(".form-status");
        steps[i].querySelectorAll("[required]").forEach(function (el) { if (ok && !el.checkValidity()) { el.reportValidity(); ok = false; } });
        var group = steps[i].querySelector("[data-need-one]");
        if (ok && group && !group.querySelector("input:checked")) { ok = false; if (st) { st.className = "form-status err"; st.textContent = "Pick at least one option to continue."; } }
        if (ok) { if (st) st.textContent = ""; show(i + 1); }
      });
    });
    f.querySelectorAll("[data-prev]").forEach(function (b) { b.addEventListener("click", function () { show(i - 1); }); });
    show(0);
  });

  /* All forms → relay */
  document.querySelectorAll("form[data-form]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = f.querySelector(".form-status"), btn = f.querySelector("[type=submit]"), trap = f.querySelector(".hp input");
      if (trap && trap.value) return;
      var data = {};
      new FormData(f).forEach(function (v, k) { if (k === "_hp") return; data[k] = data[k] ? data[k] + ", " + v : v; });
      data._subject = "Positive.Energy — " + f.getAttribute("data-form") + (data.name ? " from " + data.name : "");
      data._template = "table"; data._captcha = "false";
      data.page = location.href; data.submitted = new Date().toISOString();
      if (typeof f._extra === "function") Object.assign(data, f._extra());
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }
      if (status) { status.className = "form-status"; status.textContent = ""; }
      fetch(relay(), { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function () {
          var go = f.getAttribute("data-redirect");
          if (go) { location.href = go; return; }
          if (status) { status.className = "form-status ok"; status.textContent = f.getAttribute("data-ok") || "Sent. We'll reply within two business days."; }
          f.reset();
        })
        .catch(function () { if (status) { status.className = "form-status err"; status.textContent = "That didn't go through. Check your connection and try again in a moment."; } })
        .finally(function () { if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; } });
    });
  });

  /* Lite YouTube — nothing loads from YouTube until the visitor clicks */
  document.querySelectorAll("[data-yt]").forEach(function (b) {
    var id = b.getAttribute("data-yt");
    b.style.backgroundImage = "url(https://i.ytimg.com/vi/" + id + "/hqdefault.jpg)";
    b.addEventListener("click", function () {
      var fr = document.createElement("iframe");
      fr.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      fr.title = b.getAttribute("aria-label") || "Video";
      fr.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      fr.allowFullscreen = true;
      var wrap = document.createElement("div"); wrap.className = "yt"; wrap.appendChild(fr); b.replaceWith(wrap);
    });
  });

  /* Generic pill filter: [data-filter] buttons with data-cat → items with data-fcat */
  document.querySelectorAll("[data-filter]").forEach(function (bar) {
    var scope = document.querySelector(bar.getAttribute("data-filter")) || document;
    var search = document.querySelector(bar.getAttribute("data-search") || "#__none");
    function apply() {
      var on = bar.querySelector(".on"), cat = on ? on.getAttribute("data-cat") : "all", q = search ? search.value.trim().toLowerCase() : "";
      scope.querySelectorAll("[data-fcat]").forEach(function (el) {
        var okc = cat === "all" || el.getAttribute("data-fcat") === cat, okq = !q || el.textContent.toLowerCase().indexOf(q) > -1;
        el.hidden = !(okc && okq);
      });
    }
    bar.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      bar.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === t); }); apply();
    });
    if (search) search.addEventListener("input", apply);
  });

  /* Support tiers + payment links */
  var tiers = document.querySelectorAll(".tier");
  if (tiers.length) {
    var amt = document.getElementById("amount");
    tiers.forEach(function (t) {
      t.addEventListener("click", function () {
        tiers.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        t.setAttribute("aria-pressed", "true"); if (amt) amt.value = t.getAttribute("data-amount");
      });
    });
    var pay = S.payments || {}, box = document.getElementById("pay-links");
    if (box) {
      var any = false;
      [["paypal", "Give with PayPal"], ["stripe", "Give by card (Stripe)"], ["buymeacoffee", "Buy us a coffee"]].forEach(function (l) {
        if (pay[l[0]]) { any = true; var a = document.createElement("a"); a.href = pay[l[0]]; a.className = "btn sun"; a.target = "_blank"; a.rel = "noopener"; a.textContent = l[1]; box.appendChild(a); }
      });
      var n1 = document.getElementById("pay-note"), n2 = document.getElementById("pledge-note");
      if (any && n1) n1.hidden = false; if (any && n2) n2.hidden = true;
    }
  }

  /* Reveal on scroll */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
})();
