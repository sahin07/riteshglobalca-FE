"""GST demand provisions (Sections 73, 74 & 74A) content update.

Source: Ritesh_Arora_Associates_GST_Section_73_74_74A_Website_Content_Update.docx

Page: GST & Indirect Tax Services -> GST Services -> Litigation Support Services
  - replaces the two "Handling Show Cause Notices - Section 73/74" cards with the doc's short versions
  - renames "Handling Summons & Notices" to "Handling Summons & Departmental Notices"
  - adds a "Handling Show Cause Notices & Demand Proceedings" section after the card grid
Also reports any remaining "GST Act" wording across all services (should read "CGST Act, 2017").

Usage:
  python scripts/update_gst_section_73_74.py            # dry run
  python scripts/update_gst_section_73_74.py --apply    # write to Strapi
  python scripts/update_gst_section_73_74.py --scan     # list "GST Act" wording site-wide
"""
from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from seed_strapi_tree import ROOT, Strapi, load_env_files  # noqa: E402

SERVICE_SLUG = "1-1-1-4-litigation-support-services"
BACKUP_PATH = ROOT / "data" / "backups" / f"{SERVICE_SLUG}-before-gst-74a.json"

CONTENT_BLOCKS_POPULATE = (
    "populate[contentBlocks][on][service.feature-grid][populate][cards]=true"
    "&populate[contentBlocks][on][service.rich-text-section]=true"
    "&populate[contentBlocks][on][service.process-section][populate][tabs][populate][steps]=true"
    "&populate[contentBlocks][on][service.process-section][populate][tabs][populate][tab_image]=true"
    "&populate[contentBlocks][on][service.tabbed-rich-text][populate][tabs]=true"
    "&populate[contentBlocks][on][service.contact-cta][populate][backgroundImage]=true"
    "&populate[contentBlocks][on][service.table-section][populate]=*"
    "&populate[contentBlocks][on][service.tabbed-table-section][populate][tabs][populate]=*"
)

CARD_UPDATES = {
    "Handling Show Cause Notices - Section 73": {
        "title": "Handling Show Cause Notices & Demand Proceedings – Sections 73 & 74 (FY 2023-24 and Earlier)",
        "description": (
            "For tax determinations pertaining to FY 2023-24 and earlier periods, Sections 73 and 74 of the CGST "
            "Act, 2017 apply depending on the nature of the allegation. Section 73 covers cases not involving "
            "fraud, wilful misstatement or suppression of facts, while Section 74 applies where such allegations "
            "form the basis of the demand. We assist with notice review, limitation analysis, reconciliation, "
            "drafting of replies, evidence preparation and representation."
        ),
    },
    "Handling Show Cause Notices - Section 74": {
        "title": "Handling Demand Proceedings – Section 74A (FY 2024-25 Onwards)",
        "description": (
            "For tax determinations pertaining to FY 2024-25 onwards, Section 74A provides the applicable demand "
            "and adjudication framework for tax not paid or short paid, erroneous refunds and wrongful availment "
            "or utilisation of input tax credit. The provision applies whether or not the case involves fraud, "
            "wilful misstatement or suppression of facts. We assist with analysis of the applicable provision, "
            "limitation, allegations, tax and penalty exposure, drafting of replies and representation through "
            "the adjudication and appellate stages."
        ),
    },
    "Handling Summons & Notices": {
        "title": "Handling Summons & Departmental Notices",
    },
}

DEMAND_SECTION_TITLE = "Handling Show Cause Notices & Demand Proceedings"
ASSISTANCE = [
    "Review of ASMT-10 notices and pre-demand communications.",
    "Analysis of the applicable demand provision based on the relevant Financial Year.",
    "Review of limitation and statutory timelines.",
    "Assessment of allegations relating to fraud, wilful misstatement or suppression of facts.",
    "Verification of tax, interest and penalty computations.",
    "Drafting and filing of replies to show cause notices and demand proceedings.",
    "Preparation of supporting documents, reconciliations and legal submissions.",
    "Representation before adjudicating and appellate authorities.",
    "Assistance in appeals, rectification and further appellate remedies, as applicable.",
    "Strategic advice on payment, dispute resolution and further litigation options.",
]


def p(text: str) -> str:
    return f"<p>{html.escape(text)}</p>"


DEMAND_SECTION_HTML = "".join([
    p(
        "GST demand proceedings are governed by different statutory provisions depending on the Financial Year "
        "to which the tax determination relates. Our team assists taxpayers in analysing the applicable "
        "provision, limitation, allegations, computation, procedural requirements and available remedies."
    ),
    "<h3>Demand Proceedings under Sections 73 &amp; 74 – FY 2023-24 and Earlier</h3>",
    p(
        "For tax determinations pertaining to Financial Year 2023-24 and earlier periods, Sections 73 and 74 of "
        "the CGST Act, 2017 remain relevant. Section 73 applies to cases involving tax not paid or short paid, "
        "erroneous refund, or wrongful availment or utilisation of input tax credit for reasons other than fraud, "
        "wilful misstatement or suppression of facts. Section 74 applies where the demand arises by reason of "
        "fraud, wilful misstatement or suppression of facts."
    ),
    "<h3>Demand Proceedings under Section 74A – FY 2024-25 Onwards</h3>",
    p(
        "For determinations pertaining to Financial Year 2024-25 onwards, Section 74A of the CGST Act, 2017 "
        "provides the applicable demand and adjudication framework. Section 74A covers tax not paid or short "
        "paid, erroneous refunds, and wrongful availment or utilisation of input tax credit, irrespective of "
        "whether the case involves fraud, wilful misstatement or suppression of facts."
    ),
    p(
        "While Section 74A provides a common framework for such determinations, the presence or absence of fraud, "
        "wilful misstatement or suppression remains relevant to the applicable penalty and the statutory "
        "consequences of payment within the prescribed periods."
    ),
    "<h3>Our Assistance</h3>",
    "<ul>" + "".join(f"<li>{html.escape(item)}</li>" for item in ASSISTANCE) + "</ul>",
])

GST_ACT_PATTERN = re.compile(r"(?<![A-Za-z])GST Act\b")


def normalise_title(value: str) -> str:
    return re.sub(r"\s*[-–—]\s*", " - ", (value or "").strip())


def clean_component(value):
    """Strip ids so Strapi recreates nested components; media becomes its numeric id."""
    if isinstance(value, list):
        return [clean_component(v) for v in value]
    if not isinstance(value, dict):
        return value
    if "mime" in value and "url" in value:
        return value.get("id")
    return {k: clean_component(v) for k, v in value.items() if k not in ("id", "documentId")}


def build_blocks(blocks: list[dict]) -> tuple[list[dict], list[str]]:
    notes: list[str] = []
    out: list[dict] = []
    for block in blocks:
        block = clean_component(block)
        # Strapi rejects a dynamic-zone entry whose __component key comes after a nested component list.
        block = {"__component": block["__component"], **{k: v for k, v in block.items() if k != "__component"}}
        if block.get("__component") == "service.rich-text-section" and block.get("title") == DEMAND_SECTION_TITLE:
            continue
        out.append(block)
        if block.get("__component") != "service.feature-grid":
            continue
        for card in block.get("cards") or []:
            update = CARD_UPDATES.get(normalise_title(card.get("title")))
            if not update:
                continue
            for field, new in update.items():
                if (card.get(field) or "").strip() != new:
                    notes.append(f"card {field}: {card.get(field)!r}\n      -> {new!r}")
                    card[field] = new
        out.append({"__component": "service.rich-text-section", "title": DEMAND_SECTION_TITLE, "content": DEMAND_SECTION_HTML})
        notes.append(f"section after card grid: {DEMAND_SECTION_TITLE!r}")
    return out, notes


def scan(api: Strapi) -> None:
    rows = api.fetch_all("services", "&" + CONTENT_BLOCKS_POPULATE)
    hits = 0
    for row in rows:
        text = json.dumps(
            {k: row.get(k) for k in ("title", "heroSubtitle", "introDescription", "contentBlocks")}, ensure_ascii=False
        )
        for match in GST_ACT_PATTERN.finditer(text):
            hits += 1
            start = max(0, match.start() - 60)
            print(f"  {row.get('slug')}: …{text[start:match.end() + 40]}…")
    print(f"'GST Act' occurrences: {hits} in {len(rows)} services")


def verify(api: Strapi) -> None:
    """Compare the published page with the pre-update backup."""
    old = json.loads(BACKUP_PATH.read_text(encoding="utf-8")).get("contentBlocks") or []
    new = api.request("GET", f"/api/services?filters[slug][$eq]={SERVICE_SLUG}&{CONTENT_BLOCKS_POPULATE}")["data"][0]
    new = new.get("contentBlocks") or []
    same = lambda a, b: json.dumps(clean_component(a), sort_keys=True) == json.dumps(clean_component(b), sort_keys=True)
    print("published sections:", [b["__component"].split(".")[1] for b in new])
    kept = [b for b in new if not (b["__component"] == "service.rich-text-section" and b.get("title") == DEMAND_SECTION_TITLE)]
    for o, n in zip(old, kept):
        name = o["__component"].split(".")[1]
        if name != "feature-grid":
            print(f"  {name}: {'identical' if same(o, n) else 'DIFFERENT'}")
            continue
        print(f"  feature-grid: cards {len(o['cards'])} -> {len(n['cards'])}")
        for a, b in zip(o["cards"], n["cards"]):
            print(f"    {'same   ' if same(a, b) else 'CHANGED'} {b['title']}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--scan", action="store_true")
    parser.add_argument("--verify", action="store_true")
    args = parser.parse_args()

    load_env_files()
    base = os.environ.get("NEXT_PUBLIC_STRAPI_URL") or os.environ.get("STRAPI_URL")
    token = os.environ.get("STRAPI_TOKEN") or os.environ.get("STRAPI_API_TOKEN")
    if not base:
        raise SystemExit("NEXT_PUBLIC_STRAPI_URL is required")
    if args.apply and not token:
        raise SystemExit("STRAPI_TOKEN is required to apply changes")
    api = Strapi(base, token)

    if args.scan:
        scan(api)
        return
    if args.verify:
        verify(api)
        return

    status = "&status=draft" if token else ""
    rows = api.request(
        "GET", f"/api/services?filters[slug][$eq]={SERVICE_SLUG}{status}&{CONTENT_BLOCKS_POPULATE}"
    ).get("data") or []
    if not rows:
        raise SystemExit(f"Service not found: {SERVICE_SLUG}")
    row = rows[0]

    blocks, notes = build_blocks(row.get("contentBlocks") or [])
    print(("APPLY" if args.apply else "DRY RUN"), SERVICE_SLUG, f"blocks: {len(row.get('contentBlocks') or [])} -> {len(blocks)}")
    for note in notes:
        print("  ~", note)

    if args.apply:
        BACKUP_PATH.parent.mkdir(parents=True, exist_ok=True)
        if not BACKUP_PATH.exists():
            BACKUP_PATH.write_text(json.dumps(row, ensure_ascii=False, indent=2), encoding="utf-8")
        api.request("PUT", f"/api/services/{row['documentId']}?status=published", {"data": {"contentBlocks": blocks}})
        print("  saved")


if __name__ == "__main__":
    main()
