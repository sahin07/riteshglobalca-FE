"""Idempotent Strapi seed for the 4-level service tree + Word-doc copy.

Requires STRAPI_TOKEN with create/update on main-module, service-category,
service-subcategory, and service. Reads NEXT_PUBLIC_STRAPI_URL from env.

Usage:
  python scripts/seed_strapi_tree.py           # all services from service-tree.json
  python scripts/seed_strapi_tree.py --doc 1 # only services from doc-1-copy.json
  python scripts/seed_strapi_tree.py --fix-heroes # rewrite heroSubtitle to a full first paragraph ending with .
"""
from __future__ import annotations

import argparse
import html as html_module
import json
import os
import re
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TREE_PATH = ROOT / "data" / "service-tree.json"
DATA_DIR = ROOT / "data"


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
        row = existing.get(slug)
        if row:
            doc_id = row.get("documentId") or row.get("id")
            updated = self.request("PUT", f"/api/{plural}/{doc_id}?status=published", {"data": data})
            rec = updated.get("data") or row
        else:
            created = self.request("POST", f"/api/{plural}?status=published", {"data": data})
            rec = created.get("data")
        if rec and rec.get("slug"):
            existing[rec["slug"]] = rec
        time.sleep(0.05)
        return rec or {}


def index_by_slug(rows: list[dict]) -> dict[str, dict]:
    by_slug: dict[str, dict] = {}
    for row in rows:
        slug = (row.get("slug") or "").strip()
        if slug:
            by_slug[slug] = row
    return by_slug


def connect(document_id: str | None) -> dict | None:
    if not document_id:
        return None
    return {"connect": [document_id]}


def is_likely_process_description(text: str) -> bool:
    text = (text or "").strip()
    if not text:
        return False
    if text.endswith("."):
        return True
    if len(text) > 45:
        return True
    if text[:1].islower():
        return True
    return False


def pair_process_steps(steps: list) -> list[dict]:
    if not steps:
        return []
    if isinstance(steps[0], dict):
        return [
            {
                "title": (step.get("title") or "").strip(),
                "description": (step.get("description") or "").strip(),
            }
            for step in steps
            if (step.get("title") or "").strip()
        ]

    flat = [str(step).strip() for step in steps if str(step).strip()]
    paired: list[dict] = []
    i = 0
    while i < len(flat):
        title = flat[i]
        description = ""
        if i + 1 < len(flat) and is_likely_process_description(flat[i + 1]):
            description = flat[i + 1]
            i += 2
        else:
            i += 1
        paired.append({"title": title, "description": description})
    return paired


def apply_doc_copy(svc: dict, doc_copy: dict[str, dict]) -> bool:
    c = doc_copy.get(svc["code"])
    if not c or not c.get("hasCopy"):
        return False
    svc["hasCopy"] = True
    svc["intro"] = c.get("intro") or ""
    svc["introHero"] = c.get("introHero") or c.get("intro") or ""
    svc["introRest"] = c.get("introRest") or ""
    svc["body"] = c.get("body") or ""
    svc["bodyBefore"] = c.get("bodyBefore") or ""
    svc["bodyAfter"] = c.get("bodyAfter") or ""
    svc["plainBody"] = c.get("plainBody") or ""
    svc["featureSections"] = c.get("featureSections") or []
    svc["processSteps"] = c.get("processSteps") or []
    for tab in svc.get("tabs") or []:
        tc = doc_copy.get(tab["code"]) or {}
        if tc.get("hasCopy"):
            tab["hasCopy"] = True
            tab["body"] = tc.get("body") or ""
    return True


def apply_tree_copy(svc: dict) -> None:
    """Use copy fields already attached on service-tree.json."""
    svc["introHero"] = svc.get("introHero") or svc.get("intro") or ""
    svc["introRest"] = svc.get("introRest") or ""
    svc["bodyBefore"] = svc.get("bodyBefore") or ""
    svc["bodyAfter"] = svc.get("bodyAfter") or ""
    svc["featureSections"] = svc.get("featureSections") or []
    svc["processSteps"] = svc.get("processSteps") or []


def find_missing_service_codes(tree: dict, svcs_idx: dict[str, dict]) -> set[str]:
    missing: set[str] = set()
    for mod in tree["modules"]:
        for cat in mod["categories"]:
            for sub in cat["subcategories"]:
                for svc in sub["services"]:
                    if svc["slug"] not in svcs_idx:
                        missing.add(svc["code"])
    return missing


def strip_separator_html(html: str) -> str:
    return re.sub(r"<p>\s*-{10,}\s*</p>\s*", "", html or "", flags=re.IGNORECASE).strip()


def first_complete_paragraph(text: str) -> str:
    """First intro paragraph, always ending at . ? or !"""
    raw = re.sub(r"<[^>]+>", " ", text or "")
    raw = html_module.unescape(raw)
    raw = " ".join(raw.split()).strip()
    if not raw:
        return ""
    para = re.split(r"\n\s*\n", raw)[0].strip()
    if para[-1:] not in ".!?":
        idx = max(para.rfind("."), para.rfind("?"), para.rfind("!"))
        if idx >= 20:
            para = para[: idx + 1].strip()
        else:
            para = para.rstrip(" ,;:") + "."
    return para


def append_rich_text_block(blocks: list, content: str, intro: str, title: str = "") -> None:
    rest = strip_separator_html((content or "").strip())
    if intro and rest.startswith(intro):
        rest = rest[len(intro) :].strip()
    rest = strip_separator_html(rest)
    if rest:
        blocks.append(
            {
                "__component": "service.rich-text-section",
                "title": title,
                "content": rest[:20000],
            }
        )


def append_process_block(blocks: list, svc: dict) -> None:
    steps = pair_process_steps(svc.get("processSteps") or [])
    if not steps:
        return
    blocks.append(
        {
            "__component": "service.process-section",
            "title": "Our Process",
            "subtitle": "How we deliver this engagement.",
            "tabs": [
                {
                    "tabName": "Process",
                    "steps": steps,
                }
            ],
        }
    )


def tabs_have_copy(tabs: list[dict]) -> bool:
    for tab in tabs:
        body = (tab.get("body") or "").strip()
        if body and body != f"Coverage for {tab['title']}.":
            return True
    return False


def service_payload(svc: dict, sub_doc: str | None) -> dict:
    body = svc.get("body") or ""
    body_before = svc.get("bodyBefore") or ""
    body_after = svc.get("bodyAfter") or ""
    intro_hero = first_complete_paragraph(svc.get("introHero") or svc.get("intro") or "")
    intro_rest = (svc.get("introRest") or "").strip()
    blocks = []

    # Page order after overview: Our Process, then remaining sections.
    append_process_block(blocks, svc)

    if body_before:
        append_rich_text_block(blocks, body_before, intro_hero)
    elif body and not body_after:
        append_rich_text_block(blocks, body, intro_hero)

    for section in svc.get("featureSections") or []:
        cards = []
        for card in section.get("cards") or []:
            title = (card.get("title") or "").strip()
            description = (card.get("description") or "").strip()
            if not title:
                continue
            cards.append({
                "title": title,
                "description": description,
            })
        if cards:
            blocks.append(
                {
                    "__component": "service.feature-grid",
                    "sectionTitle": (section.get("sectionTitle") or "").strip(),
                    "sectionSubtitle": (section.get("sectionSubtitle") or "").strip(),
                    "cards": cards,
                }
            )

    if svc.get("tabs") and tabs_have_copy(svc["tabs"]):
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

    if body_after:
        append_rich_text_block(blocks, body_after, intro_hero)

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
        "heroSubtitle": intro_hero or svc["title"],
        "introDescription": strip_separator_html(intro_rest),
        "contentBlocks": blocks,
    }
    rel = connect(sub_doc)
    if rel:
        payload["subcategory"] = rel
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed Strapi service tree and copy")
    parser.add_argument("--doc", type=int, choices=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], help="Seed only services from doc-N-copy.json")
    parser.add_argument(
        "--missing",
        action="store_true",
        help="Create only services present in service-tree.json but absent in Strapi",
    )
    parser.add_argument(
        "--fix-heroes",
        action="store_true",
        help="Update only heroSubtitle so the first paragraph ends with a full stop",
    )
    args = parser.parse_args()

    if sum(bool(x) for x in (args.doc, args.missing, args.fix_heroes)) > 1:
        raise SystemExit("Use only one of --doc, --missing, or --fix-heroes")

    load_env_files()
    tree = json.loads(TREE_PATH.read_text(encoding="utf-8"))
    doc_copy: dict[str, dict] | None = None
    allowed_codes: set[str] | None = None
    missing_codes: set[str] | None = None
    if args.doc:
        doc_copy_path = DATA_DIR / f"doc-{args.doc}-copy.json"
        if not doc_copy_path.exists():
            raise SystemExit(
                f"Missing {doc_copy_path}. Run: python scripts/build_service_content.py --doc {args.doc}"
            )
        doc_copy = json.loads(doc_copy_path.read_text(encoding="utf-8"))
        allowed_codes = set(doc_copy.keys())
        print(f"Doc {args.doc} seed: {len(allowed_codes)} sections")

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
    svcs_idx = index_by_slug(api.fetch_all("services", "&fields[0]=title&fields[1]=slug&fields[2]=heroSubtitle"))

    if args.fix_heroes:
        updated = 0
        skipped = 0
        for mod in tree["modules"]:
            for cat in mod["categories"]:
                for sub in cat["subcategories"]:
                    for svc in sub["services"]:
                        hero = first_complete_paragraph(svc.get("introHero") or svc.get("intro") or "")
                        if not hero:
                            skipped += 1
                            continue
                        row = svcs_idx.get(svc["slug"])
                        if not row:
                            skipped += 1
                            continue
                        current = (row.get("heroSubtitle") or "").strip()
                        if current == hero:
                            continue
                        rec = api.upsert("services", svcs_idx, svc["slug"], {"heroSubtitle": hero})
                        updated += 1
                        print("  hero", svc["code"], svc["slug"], "ok" if rec else "fail", f"len={len(hero)}")
        print("Done", json.dumps({"updated": updated, "skipped": skipped}))
        return

    if args.missing:
        missing_codes = find_missing_service_codes(tree, svcs_idx)
        print(f"Missing services: {len(missing_codes)}")
        for code in sorted(missing_codes):
            print("  ", code)

    created = {"modules": 0, "categories": 0, "subcategories": 0, "services": 0, "skipped": 0}

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
                    if missing_codes is not None:
                        if svc["code"] not in missing_codes:
                            continue
                        apply_tree_copy(svc)
                    elif allowed_codes is not None:
                        if svc["code"] not in allowed_codes:
                            continue
                        if not doc_copy or not apply_doc_copy(svc, doc_copy):
                            created["skipped"] += 1
                            print("  skip", svc["code"], svc["slug"], "no copy in doc")
                            continue
                    elif not svc.get("hasCopy"):
                        created["skipped"] += 1
                        continue

                    payload = service_payload(svc, sub_doc)
                    rec_v = api.upsert("services", svcs_idx, svc["slug"], payload)
                    svcs_idx[svc["slug"]] = rec_v
                    created["services"] += 1
                    steps = len((svc.get("processSteps") or []))
                    print("  service", svc["code"], svc["slug"], f"steps={steps}", "ok" if rec_v else "fail")

    print("Done", json.dumps(created))


if __name__ == "__main__":
    main()
