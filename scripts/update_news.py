"""Daily good-news refresher for Positive.Energy.
Pulls headlines (title, link, short teaser) from solutions-journalism RSS feeds and writes
assets/data/news.json. Runs in GitHub Actions every morning; stdlib only, no API keys."""
import json, re, html, urllib.request, email.utils, datetime, os, sys
import xml.etree.ElementTree as ET

FEEDS = [
    ("Positive News", "https://www.positive.news/feed/"),
    ("Good News Network", "https://www.goodnewsnetwork.org/feed/"),
    ("Greater Good Magazine", "https://greatergood.berkeley.edu/site/rss/articles"),
    ("Reasons to be Cheerful", "https://reasonstobecheerful.world/feed/"),
    ("The Optimist Daily", "https://www.optimistdaily.com/feed/"),
]
SKIP = re.compile(r"subscribe|sponsored|advertis|giveaway|horoscope|deal of|shop|sale\b|good news in history", re.I)
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "data", "news.json")

def clean(t, n=170):
    t = html.unescape(re.sub(r"<[^>]+>", " ", t or ""))
    t = re.sub(r"\s+", " ", t).strip()
    t = re.sub(r"The post .*? appeared first on .*$", "", t).strip()
    return (t[:n].rsplit(" ", 1)[0] + "…") if len(t) > n else t

def parse_date(s):
    if not s: return None
    try: return email.utils.parsedate_to_datetime(s).astimezone(datetime.timezone.utc).isoformat()
    except Exception:
        try: return datetime.datetime.fromisoformat(s.replace("Z", "+00:00")).isoformat()
        except Exception: return None

def fetch(src, url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (PositiveEnergyBot; +https://positive.energy)"})
    data = urllib.request.urlopen(req, timeout=25).read()
    root = ET.fromstring(data)
    out = []
    for it in root.iter("item"):
        title = clean(it.findtext("title"), 200); link = (it.findtext("link") or "").strip()
        if not title or not link.startswith("http") or SKIP.search(title): continue
        out.append({"title": title, "link": link, "source": src,
                    "date": parse_date(it.findtext("pubDate")), "summary": clean(it.findtext("description"))})
        if len(out) >= 10: break
    return out

def main():
    old = {}
    try: old = json.load(open(OUT))
    except Exception: pass
    items = []
    for src, url in FEEDS:
        try: items += fetch(src, url); print("ok", src)
        except Exception as e: print("skip", src, e, file=sys.stderr)
    if not items:
        print("No feeds reachable; keeping previous file."); return
    seen, uniq = set(), []
    for it in sorted(items, key=lambda x: x["date"] or "", reverse=True):
        if it["link"] in seen: continue
        seen.add(it["link"]); uniq.append(it)
    # round-robin by source so no single outlet dominates
    by = {}
    for it in uniq: by.setdefault(it["source"], []).append(it)
    mixed = []
    while any(by.values()) and len(mixed) < 36:
        for s in list(by):
            if by[s]: mixed.append(by[s].pop(0))
    if [i["link"] for i in mixed] == [i["link"] for i in old.get("items", [])]:
        print("No change."); return
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump({"updated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"), "items": mixed[:36]},
              open(OUT, "w"), ensure_ascii=False, indent=1)
    print("wrote", len(mixed), "items")

if __name__ == "__main__":
    main()
