"""Idempotent Strapi seed for the 4-level service tree + Word-doc copy.

Requires STRAPI_TOKEN with create/update on main-module, service-category,
service-subcategory, and service. Reads NEXT_PUBLIC_STRAPI_URL from env.
"""
from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TREE_PATH = ROOT / "data" / "service-tree.json"


def load_env_files() -> None:
    for name in (".env.local", ".env", ".env.production"):
        path = ROOT / name
        if not path.exists():
            continue
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, val = line.split("=", 1)
            os.environ.setdefault(key.strip(), val.strip().strip('"').strip("'"))


def slugify_match(text: str) -> str:
    import re
    text = re.sub(r"^\d+(?:\.\d+)*\s+", "", text or "")
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


class Strapi:
    def __init__(self, base: str, token: str | None):
        self.base = base.rstrip("/")
        self.token = token

    def _headers(self, json_body: bool = False) -> dict:
        headers = {"Accept": "application/json"}
        if json_body:
            headers["Content-Type"] = "application/json"
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

    def request(self, method: str, path: str, body: dict | None = None):
        url = self.base + path
        data = json.dumps(body).encode("utf-8") if body is not None else None
        req = urllib.request.Request(url, data=data, method=method, headers=self._headers(body is not None))
        try:
            with urllib.request.urlopen(req, timeout=60) as res:
                raw = res.read().decode("utf-8")
                return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as e:
            err = e.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"{method} {path} -> {e.code}: {err[:800]}") from e

    def fetch_all(self, plural: str, extra: str = "") -> list[dict]:
        page = 1
        out = []
        while True:
            q = f"/api/{plural}?pagination[page]={page}&pagination[pageSize]=100{extra}"
            payload = self.request("GET", q)
            out.extend(payload.get("data") or [])
            meta = (payload.get("meta") or {}).get("pagination") or {}
            if page >= int(meta.get("pageCount") or 1):
                break
            page += 1
        return out

    def upsert(self, plural: str, existing: dict[str, dict], slug: str, data: dict) -> dict:
        title_key = slugify_match(data.get("title") or "")
        row = existing.get(slug) or existing.get(title_key)
        if row:
            doc_id = row.get("documentId") or row.get("id")
            updated = self.request("PUT", f"/api/{plural}/{doc_id}?status=published", {"data": data})
            rec = updated.get("data") or row
        else:
            created = self.request("POST", f"/api/{plural}?status=published", {"data": data})
            rec = created.get("data")
        if rec:
            if rec.get("slug"):
                existing[rec["slug"]] = rec
            if rec.get("title"):
                existing[slugify_match(rec["title"])] = rec
            existing[slug] = rec
        time.sleep(0.05)
        return rec or {}


def index_by_slug(rows: list[dict]) -> dict[str, dict]:
    by_slug = {}
    by_title = {}
    for row in rows:
        slug = slugify_match(row.get("slug") or "")
        title = slugify_match(row.get("title") or "")
        if slug:
            by_slug[slug] = row
        if title:
            by_title[title] = row
    return {**by_title, **by_slug}


def connect(document_id: str | None) -> dict | None:
    if not document_id:
        return None
    return {"connect": [document_id]}


def service_payload(svc: dict, sub_doc: str | None) -> dict:
    body = svc.get("body") or ""
    intro = svc.get("intro") or body[:400]
    blocks = []
    if svc.get("tabs"):
        tabs = []
        for tab in svc["tabs"]:
            tabs.append(
                {
                    "tabName": tab["title"],
                    "content": (tab.get("body") or f"Coverage for {tab['title']}.").strip(),
                }
            )
        blocks.append(
            {
                "__component": "service.tabbed-rich-text",
                "title": "Coverage",
                "subtitle": "Entity / activity types included in this service.",
                "tabs": tabs,
            }
        )
    steps = svc.get("processSteps") or []
    if steps:
        blocks.append(
            {
                "__component": "service.process-section",
                "title": "Our Process",
                "subtitle": "How we deliver this engagement.",
                "tabs": [
                    {
                        "tabName": "Process",
                        "steps": [{"title": step} for step in steps[:8]],
                    }
                ],
            }
        )
    if body:
        rest = body
        if intro and rest.startswith(intro):
            rest = rest[len(intro) :].strip()
        if rest:
            blocks.append(
                {
                    "__component": "service.rich-text-section",
                    "title": "Details",
                    "content": rest[:20000],
                }
            )
    blocks.append(
        {
            "__component": "service.contact-cta",
            "title": "Talk to our experts",
            "subtitle": "Get guidance on timelines, documents, and next steps.",
            "email": "info@ritesh-arora.com",
            "phone": "",
        }
    )
    payload = {
        "title": svc["title"],
        "slug": svc["slug"],
        "heroTitle": svc["title"],
        "heroSubtitle": intro[:280] if intro else svc["title"],
        "introDescription": intro or svc["title"],
        "contentBlocks": blocks,
    }
    rel = connect(sub_doc)
    if rel:
        payload["subcategory"] = rel
    return payload


def main() -> None:
    load_env_files()
    tree = json.loads(TREE_PATH.read_text(encoding="utf-8"))
    base = os.environ.get("NEXT_PUBLIC_STRAPI_URL") or os.environ.get("STRAPI_URL")
    token = os.environ.get("STRAPI_TOKEN") or os.environ.get("STRAPI_API_TOKEN")
    if not base:
        raise SystemExit("NEXT_PUBLIC_STRAPI_URL is required")
    if not token:
        print("WARN: STRAPI_TOKEN is not set. Strapi will reject writes (403).")
        print("Add STRAPI_TOKEN to .env.local then re-run: python scripts/seed_strapi_tree.py")

    api = Strapi(base, token)
    print("Seeding", base)

    modules_idx = index_by_slug(api.fetch_all("main-modules"))
    cats_idx = index_by_slug(api.fetch_all("service-categories", "&populate=mainModule"))
    subs_idx = index_by_slug(api.fetch_all("service-subcategories", "&populate=category"))
    svcs_idx = index_by_slug(api.fetch_all("services", "&fields[0]=title&fields[1]=slug"))

    created = {"modules": 0, "categories": 0, "subcategories": 0, "services": 0}

    for mod in tree["modules"]:
        before = len(modules_idx)
        rec = api.upsert(
            "main-modules",
            modules_idx,
            mod["slug"],
            {"title": mod["title"], "slug": mod["slug"]},
        )
        modules_idx[mod["slug"]] = rec
        if len(modules_idx) > before or rec.get("slug") == mod["slug"]:
            created["modules"] += 1
        mod_doc = rec.get("documentId")

        for cat in mod["categories"]:
            cat_data = {"title": cat["title"], "slug": cat["slug"]}
            rel = connect(mod_doc)
            if rel:
                cat_data["mainModule"] = rel
            rec_c = api.upsert("service-categories", cats_idx, cat["slug"], cat_data)
            cats_idx[cat["slug"]] = rec_c
            created["categories"] += 1
            cat_doc = rec_c.get("documentId")

            for sub in cat["subcategories"]:
                sub_data = {"title": sub["title"], "slug": sub["slug"]}
                rel = connect(cat_doc)
                if rel:
                    sub_data["category"] = rel
                rec_s = api.upsert("service-subcategories", subs_idx, sub["slug"], sub_data)
                subs_idx[sub["slug"]] = rec_s
                created["subcategories"] += 1
                sub_doc = rec_s.get("documentId")

                for svc in sub["services"]:
                    payload = service_payload(svc, sub_doc)
                    rec_v = api.upsert("services", svcs_idx, svc["slug"], payload)
                    svcs_idx[svc["slug"]] = rec_v
                    created["services"] += 1
                    print("  service", svc["code"], svc["slug"], "ok" if rec_v else "fail")

    print("Done", json.dumps(created))


if __name__ == "__main__":
    main()
