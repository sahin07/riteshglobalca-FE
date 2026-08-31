"""Audit which Strapi services have little or no page content."""
import json
import os
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
for line in (ROOT / ".env.local").read_text().splitlines():
    if "=" in line and not line.strip().startswith("#"):
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

BASE = os.environ.get("NEXT_PUBLIC_STRAPI_URL", "https://riteshglobalca.com/strapi").rstrip("/")
TOKEN = os.environ.get("STRAPI_TOKEN", "")
HEADERS = {"Authorization": f"Bearer {TOKEN}"} if TOKEN else {}


def fetch_all(path: str):
    page = 1
    rows = []
    while True:
        url = f"{BASE}{path}&pagination[page]={page}&pagination[pageSize]=100"
        data = json.loads(
            urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=60).read()
        )
        rows.extend(data.get("data") or [])
        if page >= data.get("meta", {}).get("pagination", {}).get("pageCount", 1):
            break
        page += 1
    return rows


def strip_html(s: str) -> str:
    import re

    return re.sub(r"<[^>]+>", " ", s or "").strip()


def has_content(svc: dict) -> bool:
    intro = strip_html(svc.get("introDescription") or "")
    hero = (svc.get("heroSubtitle") or "").strip()
    title = (svc.get("title") or "").strip()
    blocks = svc.get("contentBlocks") or []
    if len(intro) >= 80:
        return True
    if hero and hero != title and len(hero) >= 40:
        return True
    if blocks:
        return True
    return False


svcs = fetch_all(
    "/api/services?"
    "fields[0]=title&fields[1]=slug&fields[2]=introDescription&fields[3]=heroSubtitle"
    "&populate[contentBlocks][on][service.process-section][fields][0]=title"
    "&populate[contentBlocks][on][service.rich-text-section][fields][0]=content"
    "&populate[contentBlocks][on][service.feature-grid][fields][0]=title"
)
empty = [s for s in svcs if not has_content(s)]
thin = [
    s
    for s in svcs
    if has_content(s) and len(strip_html(s.get("introDescription") or "")) < 80 and not (s.get("contentBlocks") or [])
]

by_mod = {"india-practice": {"total": 0, "empty": 0}, "international-practice": {"total": 0, "empty": 0}}
# quick module map from subcategory
subs = {
    s["id"]: s
    for s in fetch_all(
        "/api/service-subcategories?"
        "fields[0]=slug&populate[category][fields][0]=slug&populate[category][populate][mainModule][fields][0]=slug"
    )
}

print(f"Total services: {len(svcs)}")
print(f"Empty (no intro/blocks): {len(empty)}")
print(f"Thin (short intro only): {len(thin)}")
print("\nSample empty slugs:")
for s in empty[:25]:
    print(f"  {s['slug']} | {s.get('title')}")
if len(empty) > 25:
    print(f"  ... +{len(empty) - 25} more")
