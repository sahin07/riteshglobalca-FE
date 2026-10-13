"""Check that every sentence and heading of a content-update .docx exists in the live Strapi content.

Usage:
  python scripts/verify_doc_content.py <docx> <subcategory-slug,...> <service-slug,...>
"""
from __future__ import annotations

import html
import json
import os
import re
import sys
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from seed_strapi_tree import Strapi, load_env_files  # noqa: E402

BLOCKS = (
    "populate[contentBlocks][on][service.feature-grid][populate][cards]=true"
    "&populate[contentBlocks][on][service.rich-text-section]=true"
    "&populate[contentBlocks][on][service.process-section][populate][tabs][populate][steps]=true"
    "&populate[contentBlocks][on][service.tabbed-rich-text][populate][tabs]=true"
    "&populate[contentBlocks][on][service.contact-cta]=true"
)


def norm(text: str) -> str:
    text = html.unescape(re.sub(r"<[^>]+>", " ", text or ""))
    text = text.replace("–", "-").replace("—", "-").replace("’", "'").replace("‘", "'")
    text = text.replace("“", '"').replace("”", '"').replace("→", "->")
    return re.sub(r"\s+", " ", text).strip().lower()


def is_heading(line: str, prev: str, nxt: str) -> bool:
    return (
        len(line) < 90
        and not re.search(r"[.,;:]$", line)
        and ". " not in line
        and (not prev or prev.endswith("."))
        and bool(re.match(r"[A-Z]", nxt or "A"))
    )


def doc_paragraphs(path: str) -> list[str]:
    """Word paragraphs, with manually wrapped lines re-joined and standalone heading lines kept separate."""
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml").decode("utf-8")
    paras = []
    for p in re.findall(r"<w:p[ >].*?</w:p>", xml, flags=re.S):
        p = re.sub(r"<w:(br|cr)\b[^>]*/>", "<w:t>\n</w:t>", p)
        text = html.unescape("".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", p, flags=re.S)))
        lines = [ln.strip() for ln in text.split("\n")]
        current: list[str] = []
        for i, line in enumerate(lines):
            prev = lines[i - 1] if i else ""
            nxt = lines[i + 1] if i + 1 < len(lines) else ""
            if not line or is_heading(line, prev, nxt):
                if current:
                    paras.append(" ".join(current))
                    current = []
                if line:
                    paras.append(line)
                continue
            current.append(line)
        if current:
            paras.append(" ".join(current))
    return paras


def main() -> None:
    docx = sys.argv[1]
    sub_slugs = sys.argv[2].split(",") if len(sys.argv) > 2 else []
    svc_slugs = sys.argv[3].split(",") if len(sys.argv) > 3 else []
    load_env_files()
    api = Strapi(os.environ["NEXT_PUBLIC_STRAPI_URL"], None)

    corpus = []
    for slug in filter(None, sub_slugs):
        for row in api.request("GET", f"/api/service-subcategories?filters[slug][$eq]={slug}").get("data") or []:
            corpus += [row.get("title"), row.get("intro"), row.get("description")]
    for slug in filter(None, svc_slugs):
        for row in api.request("GET", f"/api/services?filters[slug][$eq]={slug}&{BLOCKS}").get("data") or []:
            corpus += [row.get("title"), row.get("heroTitle"), row.get("heroSubtitle"), row.get("introDescription")]
            corpus.append(json.dumps(row.get("contentBlocks") or [], ensure_ascii=False))
    haystack = norm(" ".join(c for c in corpus if c))

    total = missing = 0
    for para in doc_paragraphs(docx):
        para = re.sub(r"^Recommended heading:\s*", "", para)
        if re.match(r"^(URL:|Page:|Website pages|Ready-to-paste|Current heading:|Recommended heading:|Important terminology|The website currently|The same approach|\d+\.\s|[A-H]\.\s)", para):
            if os.environ.get("SHOW_SKIPPED"):
                print("  skipped:", para)
            continue
        parts = [s for s in re.split(r"(?<=[.!?])\s+", para) if len(s) > 3]
        for sentence in parts:
            total += 1
            if norm(sentence).rstrip(".") not in haystack:
                missing += 1
                print("  MISSING:", sentence)
    print(f"checked {total} sentences/headings, missing {missing}")


if __name__ == "__main__":
    main()
