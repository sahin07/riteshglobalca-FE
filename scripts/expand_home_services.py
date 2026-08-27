"""Set homepage Core Services featured list (9 items) from Strapi services."""
from __future__ import annotations

import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Exact titles to feature (order preserved)
FEATURED = [
    "Company Incorporation",
    "GST Registration & Filing",
    "Income Tax Advisory",
    "LLP Incorporation",
    "Accounting & Bookkeeping Setup",
    "GST Registration Services",
    "Income Tax Return Filing",
    "TDS/TCS Compliance",
    "Forensic Audit",
]


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    for name in (".env.local", ".env"):
        path = ROOT / name
        if not path.exists():
            continue
        for line in path.read_text(encoding="utf-8").splitlines():
            if not line.strip() or line.strip().startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env.setdefault(k.strip(), v.strip())
    return env


def request(base: str, token: str, method: str, path: str, body: dict | None = None):
    url = base.rstrip("/") + path
    data = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {"Accept": "application/json", "Authorization": f"Bearer {token}"}
    if body is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    with urllib.request.urlopen(req, timeout=120) as res:
        raw = res.read().decode("utf-8")
        return json.loads(raw) if raw else {}


def fetch_all(base: str, token: str) -> list[dict]:
    page = 1
    out: list[dict] = []
    while True:
        payload = request(
            base,
            token,
            "GET",
            f"/api/services?pagination[page]={page}&pagination[pageSize]=100&populate[image]=true",
        )
        out.extend(payload.get("data") or [])
        meta = (payload.get("meta") or {}).get("pagination") or {}
        if page >= int(meta.get("pageCount") or 1):
            break
        page += 1
    return out


def short_desc(svc: dict) -> str:
    for key in ("heroSubtitle", "introDescription"):
        val = (svc.get(key) or "").strip()
        if not val:
            continue
        text = val.replace("<p>", " ").replace("</p>", " ").replace("&amp;", "&")
        text = " ".join(text.split())
        if len(text) > 160:
            text = text[:157].rstrip() + "..."
        return text
    return f"Expert support for {svc.get('title')}."


def main() -> None:
    env = load_env()
    base = env["NEXT_PUBLIC_STRAPI_URL"]
    token = env["STRAPI_TOKEN"]

    # Keep existing featured descriptions/images where title matches
    home = request(
        base,
        token,
        "GET",
        "/api/home-page?populate[services][populate][image]=true",
    )["data"]
    existing_by_title = {
        (s.get("title") or "").strip().lower(): s for s in (home.get("services") or [])
    }

    all_svcs = fetch_all(base, token)
    by_title = {(s.get("title") or "").strip().lower(): s for s in all_svcs}

    picked = []
    for title in FEATURED:
        key = title.lower()
        svc = by_title.get(key)
        old = existing_by_title.get(key)
        if not svc and not old:
            print("MISSING", title)
            continue

        if old and (old.get("image") or {}).get("id"):
            img_id = old["image"]["id"]
            desc = (old.get("description") or "").strip() or (short_desc(svc) if svc else title)
            # prefer real service slug when available
            link = f"/services/{svc['slug']}" if svc and svc.get("slug") else (old.get("linkUrl") or "/services")
            picked.append(
                {
                    "title": old.get("title") or title,
                    "description": desc,
                    "linkText": old.get("linkText") or "Learn More",
                    "linkUrl": link if link not in ("#", "/services") or not svc else f"/services/{svc['slug']}",
                    "image": img_id,
                }
            )
        elif svc and (svc.get("image") or {}).get("id"):
            picked.append(
                {
                    "title": svc["title"],
                    "description": short_desc(svc),
                    "linkText": "Learn More",
                    "linkUrl": f"/services/{svc['slug']}",
                    "image": svc["image"]["id"],
                }
            )
        else:
            print("SKIP no image", title)

    # normalize linkUrl
    for p in picked:
        if p["linkUrl"] in ("#", "/services"):
            svc = by_title.get(p["title"].lower())
            if svc and svc.get("slug"):
                p["linkUrl"] = f"/services/{svc['slug']}"

    print(f"Setting {len(picked)} featured services")
    for p in picked:
        print(" -", p["title"], "->", p["linkUrl"])

    request(base, token, "PUT", "/api/home-page?status=published", {"data": {"services": picked}})
    confirm = request(
        base,
        token,
        "GET",
        "/api/home-page?populate[services][fields][0]=title&populate[services][fields][1]=linkUrl",
    )["data"]
    print("Confirmed:", len(confirm.get("services") or []))
    for s in confirm.get("services") or []:
        print("  ", s.get("title"), s.get("linkUrl"))


if __name__ == "__main__":
    main()
