"""Compare Excel PAGE rows (1.x.y.z) to Strapi service titles - find true gaps."""
import json
import re
import urllib.request
from pathlib import Path
import openpyxl

EXCEL = Path(r"d:\riteshglobalca\Copy of Ritesh Arora and Associates_Web Dev Task Breakdown.xlsx")
BASE = "https://riteshglobalca.com/strapi/api"

CAT_MAP = {
    "1.1": "gst-indirect-tax-services",
    "1.2": "direct-tax-services",
    "1.3": "audit-assurance-services",
    "1.4": "accounting-compliance-services",
    "1.5": "corporate-advisory-services",
}


def fetch_all(endpoint):
    page, rows = 1, []
    while True:
        sep = "&" if "?" in endpoint else "?"
        url = f"{BASE}{endpoint}{sep}pagination[page]={page}&pagination[pageSize]=100"
        with urllib.request.urlopen(url, timeout=60) as r:
            data = json.loads(r.read())
        batch = data.get("data") or []
        rows.extend(batch)
        if page >= data.get("meta", {}).get("pagination", {}).get("pageCount", 1):
            break
        page += 1
    return rows


def norm(s):
    return re.sub(r"[^a-z0-9]+", " ", (s or "").lower()).strip()


wb = openpyxl.load_workbook(EXCEL, read_only=True, data_only=True)
ws = wb["Content"]
page_pat = re.compile(r"^(1\.[1-5]\.\d+\.\d+)\s+(.+)$")
excel_pages = {sec: [] for sec in CAT_MAP}
for row in ws.iter_rows(min_row=2, values_only=True):
    for cell in row:
        if not cell:
            continue
        text = str(cell).strip()
        m = page_pat.match(text)
        if m:
            sec = ".".join(m.group(1).split(".")[:2])
            if sec in excel_pages:
                excel_pages[sec].append({"code": m.group(1), "title": m.group(2).strip()})
wb.close()

subs = fetch_all(
    "/service-subcategories?populate[category][fields][0]=slug&populate[category][fields][1]=title"
)
services = fetch_all("/services?fields[0]=title&fields[1]=slug&populate[subcategory][fields][0]=slug")

for sec, cat_slug in CAT_MAP.items():
    cat_sub_slugs = {s["slug"] for s in subs if (s.get("category") or {}).get("slug") == cat_slug}
    strapi_svcs = [
        s for s in services if (s.get("subcategory") or {}).get("slug") in cat_sub_slugs
    ]
    excel_titles = {norm(p["title"]) for p in excel_pages[sec]}
    strapi_titles = {norm(s["title"]) for s in strapi_svcs}

    print(f"\n=== {sec} Excel pages: {len(excel_pages[sec])} | Strapi services: {len(strapi_svcs)} ===")

    # fuzzy: excel title contained in strapi title or vice versa
    unmatched_excel = []
    for p in excel_pages[sec]:
        et = norm(p["title"])
        found = any(et in st or st in et for st in strapi_titles)
        if not found:
            unmatched_excel.append(p)

    unmatched_strapi = []
    for s in strapi_svcs:
        st = norm(s["title"])
        found = any(st in et or et in st for et in excel_titles)
        if not found:
            unmatched_strapi.append(s)

    if unmatched_excel:
        print(f"  Excel pages NOT matched in Strapi ({len(unmatched_excel)}):")
        for p in unmatched_excel[:15]:
            print(f"    {p['code']} {p['title']}")
        if len(unmatched_excel) > 15:
            print(f"    ... +{len(unmatched_excel)-15}")
    else:
        print("  All Excel PAGE rows have a Strapi service match (by title).")

    if unmatched_strapi:
        print(f"  Strapi services NOT in Excel PAGE list ({len(unmatched_strapi)}):")
        for s in unmatched_strapi[:10]:
            print(f"    {s['slug']} | {s['title']}")
        if len(unmatched_strapi) > 10:
            print(f"    ... +{len(unmatched_strapi)-10}")

# Content sample: intro length for 3 services per section
print("\n=== STRAPI CONTENT DEPTH (introDescription length) sample per section ===")
for sec, cat_slug in CAT_MAP.items():
    cat_sub_slugs = {s["slug"] for s in subs if (s.get("category") or {}).get("slug") == cat_slug}
    strapi_svcs = [
        s for s in services if (s.get("subcategory") or {}).get("slug") in cat_sub_slugs
    ][:3]
    print(f"\n{sec}:")
    for slug in [s["slug"] for s in strapi_svcs]:
        u = f"{BASE}/services?filters[slug][$eq]={slug}"
        d = json.loads(urllib.request.urlopen(u, timeout=30).read())["data"]
        if d:
            intro = len(d[0].get("introDescription") or "")
            pub = "published" if d[0].get("publishedAt") else "draft"
            print(f"  {d[0]['title']}: intro {intro} chars, {pub}")
