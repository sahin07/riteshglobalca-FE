"""Restore the 5 deleted empty UAE 2.5.1 services in Strapi."""
from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TREE = json.loads((ROOT / "data" / "service-tree.json").read_text(encoding="utf-8"))


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
            env[k.strip()] = v.strip()
    return env


def request(base: str, token: str, method: str, path: str, body: dict | None = None):
    url = base.rstrip("/") + path
    data = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {"Accept": "application/json", "Authorization": f"Bearer {token}"}
    if body is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as res:
        raw = res.read().decode("utf-8")
        return json.loads(raw) if raw else {}


def fetch_all(base: str, token: str, plural: str) -> list[dict]:
    page = 1
    out: list[dict] = []
    while True:
        payload = request(
            base,
            token,
            "GET",
            f"/api/{plural}?pagination[page]={page}&pagination[pageSize]=100",
        )
        out.extend(payload.get("data") or [])
        meta = (payload.get("meta") or {}).get("pagination") or {}
        if page >= int(meta.get("pageCount") or 1):
            break
        page += 1
    return out


def main() -> None:
    env = load_env()
    base = env.get("NEXT_PUBLIC_STRAPI_URL") or os.environ.get("NEXT_PUBLIC_STRAPI_URL")
    token = env.get("STRAPI_TOKEN") or os.environ.get("STRAPI_TOKEN")
    if not base or not token:
        raise SystemExit("Missing NEXT_PUBLIC_STRAPI_URL or STRAPI_TOKEN")

    targets = []
    for mod in TREE["modules"]:
        for cat in mod["categories"]:
            for sub in cat["subcategories"]:
                for svc in sub["services"]:
                    if str(svc.get("code", "")).startswith("2.5.1."):
                        targets.append((svc, sub["slug"]))

    subs = {
        (row.get("slug") or "").strip(): row
        for row in fetch_all(base, token, "service-subcategories")
    }
    existing = {
        (row.get("slug") or "").strip(): row
        for row in fetch_all(base, token, "services")
    }

    for svc, sub_slug in targets:
        slug = svc["slug"]
        if slug in existing:
            print("already exists", slug)
            continue
        sub = subs.get(sub_slug)
        if not sub:
            print("missing subcategory", sub_slug, "for", slug)
            continue
        sub_doc = sub.get("documentId") or sub.get("id")
        payload = {
            "data": {
                "title": svc["title"],
                "slug": slug,
                "heroTitle": svc["title"],
                "heroSubtitle": svc["title"],
                "introDescription": svc["title"],
                "contentBlocks": [
                    {
                        "__component": "service.contact-cta",
                        "title": "Talk to our experts",
                        "subtitle": "Get guidance on timelines, documents, and next steps.",
                        "email": "admin@riteshglobalca.com",
                        "phone": "",
                    }
                ],
                "subcategory": {"connect": [sub_doc]},
            }
        }
        try:
            created = request(base, token, "POST", "/api/services?status=published", payload)
            print("restored", slug, "id=", (created.get("data") or {}).get("documentId"))
        except urllib.error.HTTPError as e:
            err = e.read().decode("utf-8", errors="replace")
            print("fail", slug, e.code, err[:400])
        time.sleep(0.05)

    print("Done")


if __name__ == "__main__":
    main()
