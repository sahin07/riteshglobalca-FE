"""Income Tax Act, 2025 content update for India Practice -> Direct Tax Services pages.

Source: Ritesh_Arora_Associates_Income_Tax_Act_2025_Website_Content_Update.docx

Per page:
  - subcategory title / intro / description (description holds doc blocks that have no service page)
  - service title + heroTitle + heroSubtitle (card text on the subcategory page and the service hero)
Slugs are never changed, so URLs stay the same.

Usage:
  python scripts/update_income_tax_act_2025.py --page income-tax-compliance          # dry run
  python scripts/update_income_tax_act_2025.py --page income-tax-compliance --apply  # write to Strapi
"""
from __future__ import annotations

import argparse
import html
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from seed_strapi_tree import ROOT, TREE_PATH, Strapi, load_env_files  # noqa: E402


def html_blocks(blocks: list[tuple[str, str]]) -> str:
    return "".join(f"<h3>{html.escape(h)}</h3><p>{html.escape(p)}</p>" for h, p in blocks)


def html_paragraphs(paragraphs: list[str]) -> str:
    return "".join(f"<p>{html.escape(p)}</p>" for p in paragraphs)


def html_closing(paragraphs: list[str]) -> str:
    # Wrapped so the website doesn't fold these into the preceding heading's card.
    return f"<div>{html_paragraphs(paragraphs)}</div>"


HOME_ITR_PARAGRAPHS = [
    "Filing an income tax return is a fundamental tax compliance requirement for eligible taxpayers. "
    "For Tax Years beginning on or after 1 April 2026, return filing is governed by the Income Tax Act, 2025. "
    "The new Act consolidates the provisions relating to original, belated, revised and updated returns under Section 263.",
    "For FY 2025–26 (AY 2026–27) and earlier tax years, return filing continues under the Income Tax Act, 1961 "
    "in accordance with the applicable transitional provisions. Our team assists individuals, professionals, "
    "businesses and other taxpayers with return preparation, tax computation, review of income and deductions, "
    "reconciliation of tax credits and accurate filing under the applicable statutory framework.",
]

PAGES: dict[str, dict] = {
    "income-tax-compliance": {
        "title": "Income Tax Compliance",
        "intro": (
            "We assist taxpayers with end-to-end income tax compliance under the statutory framework applicable "
            "to the relevant Tax Year. For Tax Years beginning on or after 1 April 2026, compliance is governed "
            "by the Income Tax Act, 2025 and the Income-tax Rules, 2026. For earlier tax years, including FY "
            "2025–26 / AY 2026–27 and earlier years, the Income Tax Act, 1961 and the rules applicable to those "
            "years continue to govern the relevant compliance and proceedings."
        ),
        "description": html_blocks([
            (
                "Tax Credit & Reconciliation",
                "We assist with reconciliation of TDS/TCS credits, tax payments, income disclosures and information "
                "available through the income-tax reporting ecosystem, helping taxpayers identify discrepancies "
                "before filing or responding to tax communications.",
            ),
            (
                "Notices and Compliance Support",
                "We assist taxpayers in reviewing and responding to income-tax notices, communications and other "
                "compliance requirements under the Act applicable to the relevant Tax Year or proceeding.",
            ),
        ]),
        "services": {
            "1-2-1-3-advance-tax-computation": {
                "title": "Advance Tax Computation and Compliance",
                "heroSubtitle": (
                    "We assist taxpayers in estimating, reviewing and discharging advance tax liabilities for the "
                    "relevant Tax Year. For Tax Year 2026–27 onwards, the advance tax framework is governed by the "
                    "Income Tax Act, 2025, including the computation mechanism under Section 405. For FY 2025–26 and "
                    "earlier years, the corresponding provisions of the Income Tax Act, 1961 continue to apply, "
                    "including Sections 234B and 234C where relevant."
                ),
            },
            "1-2-1-2-tds-tcs-compliance": {
                "title": "TDS & TCS Compliance",
                "heroSubtitle": (
                    "We assist businesses and other deductors/collectors with determination of withholding or "
                    "collection obligations, rate and threshold review, timely deposit, statements, certificates, "
                    "reconciliations and related compliance. For sums paid or credited on or after 1 April 2026, the "
                    "applicable TDS provisions are governed by the Income Tax Act, 2025. For earlier applicable "
                    "payments or credits, the Income Tax Act, 1961 continues to apply."
                ),
            },
            "1-2-1-4-income-computation-disclosure-standards-icds": {
                "title": "Income Computation & Disclosure Standards (ICDS)",
                "heroSubtitle": (
                    "We assist taxpayers in evaluating the applicability of ICDS and in aligning tax computation and "
                    "disclosures with the provisions applicable to the relevant Tax Year. Where a computation relates "
                    "to an earlier tax year governed by the Income Tax Act, 1961, the provisions applicable to that "
                    "year continue to be considered."
                ),
            },
            "1-2-1-1-income-tax-return-filing": {
                "title": "Income Tax Return Filing",
                "heroSubtitle": "\n\n".join(HOME_ITR_PARAGRAPHS),
                "introDescription": html_paragraphs([
                    "We assist with preparation, review and filing of income tax returns for individuals, "
                    "professionals, businesses, companies and other taxpayers. For Tax Year 2026–27 onwards, returns "
                    "are governed by the Income Tax Act, 2025. Returns relating to FY 2025–26 / AY 2026–27 and "
                    "earlier years continue under the Income Tax Act, 1961."
                ]),
            },
        },
        "home_service_link": "/services/1-2-1-1-income-tax-return-filing",
    },
    "tax-advisory-services": {
        "title": "Tax Advisory Services",
        "intro": (
            "We provide practical tax advisory solutions covering tax planning, structuring, compliance and "
            "transaction support under the statutory framework applicable to the relevant Tax Year."
        ),
        "services": {
            "1-2-2-1-personal-tax-planning": {
                "title": "Personal Tax Planning",
                "heroSubtitle": (
                    "We assist individuals, professionals and families with tax-efficient planning of income, "
                    "investments, deductions, capital transactions and other financial decisions. For Tax Years "
                    "beginning on or after 1 April 2026, advice is provided with reference to the Income Tax Act, "
                    "2025. Where the matter relates to an earlier tax year or a continuing proceeding, the Income Tax "
                    "Act, 1961 is considered in accordance with the applicable transitional provisions."
                ),
            },
            "1-2-2-2-corporate-tax-advisory": {
                "title": "Corporate Tax Advisory",
                "heroSubtitle": (
                    "We advise businesses on tax-efficient and commercially practical structures, transactions, "
                    "deductions, tax positions, compliance requirements and risk management under the applicable "
                    "income-tax framework. For current Tax Years, this includes the Income Tax Act, 2025 and "
                    "Income-tax Rules, 2026, while legacy and transitional matters continue to be evaluated under the "
                    "Income Tax Act, 1961 where applicable."
                ),
            },
            "1-2-2-5-transaction-restructuring-advisory": {
                "title": "Tax Planning for Transactions",
                "heroSubtitle": (
                    "We assist clients in evaluating tax implications of business reorganisations, investments, "
                    "divestments, financing arrangements, capital transactions and other significant commercial "
                    "decisions, with due consideration to the law applicable to the relevant Tax Year and "
                    "transaction date."
                ),
            },
        },
    },
    "specialized-services": {
        "title": "Specialized Direct Tax Services",
        "services": {
            "1-2-4-4-tds-on-non-resident-payments": {
                "title": "TDS on Non-resident Payments",
                "heroSubtitle": (
                    "Payments or credits to non-residents may attract withholding-tax obligations depending on the "
                    "nature of the payment, applicable statutory provisions and, where relevant, the applicable tax "
                    "treaty. For payments or credits on or after 1 April 2026, the withholding framework is governed "
                    "by the Income Tax Act, 2025, including the applicable provisions under the new TDS framework. "
                    "For payments or credits relating to periods governed by the Income Tax Act, 1961, the "
                    "corresponding provisions of the 1961 Act continue to apply. We assist with withholding-tax "
                    "analysis, treaty considerations, documentation, compliance and related reporting."
                ),
            },
            "1-2-4-2-international-taxation": {
                "title": "International Taxation",
                "heroSubtitle": (
                    "We advise businesses and individuals on cross-border tax matters, including residential status, "
                    "income taxable in India, treaty relief, withholding taxes, permanent establishment "
                    "considerations, foreign income and other international tax issues. The applicable law is "
                    "determined with reference to the relevant Tax Year and transaction. Matters relating to tax "
                    "years beginning before 1 April 2026 continue to be considered under the Income Tax Act, 1961 "
                    "where required by the transitional framework."
                ),
            },
            "1-2-4-1-tax-due-diligence": {
                "title": "Tax Due Diligence",
                "heroSubtitle": (
                    "We undertake tax due diligence for business transactions, investments and restructuring "
                    "exercises, covering historical tax positions, outstanding exposures, compliance gaps, litigation "
                    "and other identified tax risks."
                ),
            },
        },
    },
    "tax-audit-reporting": {
        "title": "Tax Audit & Reporting",
        "intro": (
            "We provide tax audit and reporting services to taxpayers required to obtain an audit of accounts "
            "under the applicable income-tax framework."
        ),
        "description": html_blocks([
            (
                "Tax Audit for Tax Year 2026–27 Onwards",
                "For Tax Year 2026–27, the tax audit reporting framework under the Income Tax Act, 2025 and "
                "Income-tax Rules, 2026 applies. The new framework provides for Form No. 26, which consolidates the "
                "earlier tax-audit reporting structure.",
            ),
        ]) + html_closing([
            "Our services cover applicability assessment, audit of tax-related records, reporting, reconciliation, "
            "review of disclosures and assistance with statutory e-filing requirements.",
        ]),
        "services": {
            "1-2-7-1-tax-audit-under-section-44ab": {
                "title": "Tax Audit under the Income Tax Act, 2025",
                "heroSubtitle": (
                    "For Tax Year 2026–27 onwards, the tax-audit requirement is governed by Section 63 of the Income "
                    "Tax Act, 2025, which corresponds broadly to the tax-audit requirement previously contained in "
                    "Section 44AB of the Income Tax Act, 1961. We assist with evaluation of applicability, audit "
                    "procedures, reporting requirements and related compliance under the new Act and Income-tax "
                    "Rules, 2026."
                ),
            },
            "1-2-7-2-reporting-under-form-3ca-3cb-3cd": {
                "title": "Tax Audit for FY 2025–26 / AY 2026–27 and Earlier",
                "heroSubtitle": (
                    "For FY 2025–26 and earlier tax years governed by the Income Tax Act, 1961, tax audit continues "
                    "under Section 44AB and the applicable rules and forms. For AY 2026–27, the existing Forms "
                    "3CA/3CB and Form 3CD continue to apply as prescribed."
                ),
            },
        },
    },
    "startup-business-setup-direct-tax": {
        "title": "Startup & Business Setup – Direct Tax",
        "intro": (
            "We advise startups, entrepreneurs and growing businesses on direct-tax considerations arising from "
            "formation, business operations, funding, restructuring and expansion."
        ),
        "description": html_blocks([
            (
                "Startup Tax Advisory",
                "We assist startups with tax-efficient structuring, compliance planning, funding-related tax issues, "
                "employee and promoter taxation, and evaluation of applicable incentives and exemptions under the "
                "law applicable to the relevant Tax Year.",
            ),
        ]),
        "services": {
            "1-2-5-2-presumptive-taxation-sec-44ad-44ada-44ae": {
                "title": "Presumptive Taxation",
                "heroSubtitle": (
                    "For Tax Year 2026–27 onwards, the presumptive taxation provisions for eligible businesses, "
                    "professions and specified activities are consolidated under Section 58 of the Income Tax Act, "
                    "2025. The provision substantially carries forward the policy framework of Sections 44AD, 44ADA "
                    "and 44AE of the Income Tax Act, 1961 in a consolidated form. For earlier tax years, the "
                    "corresponding provisions of the 1961 Act continue to apply."
                ),
            },
            "1-2-5-3-startup-india-recognition-tax-exemptions": {
                "title": "Startup India Recognition & Tax Exemptions",
                "heroSubtitle": (
                    "We assist eligible startups with tax and compliance considerations connected with Startup India "
                    "recognition and applicable tax incentives. Eligibility and availability of any tax benefit are "
                    "assessed with reference to the relevant statutory provisions and the applicable Tax Year."
                ),
            },
            "1-2-5-4-angel-tax-compliance": {
                "title": "Angel Tax and Share Premium Matters",
                "heroSubtitle": (
                    "We advise startups and investors on the tax implications of share issuance, valuation, share "
                    "premium and related funding transactions. The current applicability of provisions relating to "
                    "share premium and angel-tax-type taxation must be evaluated based on the relevant transaction "
                    "date, taxpayer status and statutory framework applicable to that period."
                ),
            },
        },
    },
    "litigation-representation": {
        "title": "Income Tax Litigation & Representation",
        "intro": (
            "We assist taxpayers in assessment, reassessment, rectification, revision, appeals and other income-tax "
            "proceedings, with the applicable law determined by the Tax Year and the nature of the proceeding."
        ),
        "description": html_blocks([
            (
                "Proceedings under the Income Tax Act, 2025",
                "For Tax Years beginning on or after 1 April 2026, assessments, reassessments, appeals and related "
                "proceedings are governed by the Income Tax Act, 2025 and the Income-tax Rules, 2026, subject to the "
                "specific provisions applicable to the matter.",
            ),
            (
                "Proceedings under the Income Tax Act, 1961",
                "Proceedings relating to tax years beginning before 1 April 2026 continue to be governed by the "
                "Income Tax Act, 1961 under the repeal and savings provisions of Section 536 of the Income Tax Act, "
                "2025. This includes relevant assessments, reassessments, rectification, revision, appeals and other "
                "proceedings relating to earlier years, even where certain procedural steps take place after "
                "1 April 2026.",
            ),
            (
                "Appeals and Representation",
                "We assist clients with preparation and filing of appeals, grounds of appeal, statements of facts, "
                "written submissions, paper books and related documentation, as well as professional representation "
                "and support before the appropriate income-tax authorities and appellate forums, subject to "
                "applicable professional and legal requirements.",
            ),
            (
                "Reassessment and Legacy Proceedings",
                "Where proceedings relate to an earlier tax year, we specifically examine the transitional framework "
                "before determining the applicable statutory provisions.",
            ),
        ]),
        "services": {
            "1-2-3-5-faceless-assessment-appeal-assistance": {
                "title": "Faceless Assessment and Appeal Support",
                "heroSubtitle": (
                    "We assist taxpayers in responding to notices, preparing submissions, compiling evidence and "
                    "managing procedural requirements in faceless assessment and appellate proceedings under the Act "
                    "applicable to the relevant matter."
                ),
            },
        },
    },
    "family-wealth-tax-planning": {
        "title": "Family & Wealth Tax Planning",
        "intro": (
            "We advise individuals, families and business owners on tax-efficient and legally compliant management "
            "of personal and family wealth."
        ),
        "description": html_paragraphs([
            "For matters relating to tax years beginning before 1 April 2026, the applicable provisions of the "
            "Income Tax Act, 1961 continue to be considered under the transitional framework.",
        ]),
        "services": {
            "1-2-6-1-huf-creation-management": {
                "title": "HUF Creation & Management",
                "heroSubtitle": (
                    "We assist with structuring and ongoing tax-compliance considerations relating to Hindu Undivided "
                    "Families (HUFs), including formation, income-tax compliance, return filing and related "
                    "documentation under the law applicable to the relevant Tax Year."
                ),
            },
            "1-2-6-2-gift-tax-clubbing-provisions": {
                "title": "Gift and Clubbing Provisions",
                "heroSubtitle": (
                    "We advise on the income-tax implications of gifts, transfers, clubbing of income and related "
                    "family transactions. The applicable provisions are determined with reference to the relevant "
                    "Tax Year and transaction date."
                ),
            },
            "1-2-6-3-succession-estate-planning": {
                "title": "Succession & Estate Planning",
                "heroSubtitle": (
                    "We assist families with tax considerations arising from succession, transfer of assets, family "
                    "arrangements and inter-generational wealth planning, while coordinating with appropriate legal "
                    "professionals where documentation involves legal or succession-law matters."
                ),
            },
        },
    },
}


def short(value: str | None, limit: int = 110) -> str:
    text = (value or "").replace("\n", " ").strip()
    return text if len(text) <= limit else text[: limit - 1] + "…"


def show_change(label: str, before: str | None, after: str) -> bool:
    if (before or "").strip() == after.strip():
        print(f"    = {label}: unchanged")
        return False
    print(f"    ~ {label}:\n        before: {short(before)}\n        after:  {short(after)}")
    return True


def update_tree_titles(page_slug: str, page: dict) -> int:
    tree = json.loads(TREE_PATH.read_text(encoding="utf-8"))
    changed = 0
    for mod in tree["modules"]:
        for cat in mod["categories"]:
            for sub in cat["subcategories"]:
                if sub["slug"] != page_slug:
                    continue
                if sub["title"] != page["title"]:
                    sub["title"] = page["title"]
                    changed += 1
                for svc in sub["services"]:
                    new = page["services"].get(svc["slug"], {}).get("title")
                    if new and svc["title"] != new:
                        svc["title"] = new
                        changed += 1
    if changed:
        TREE_PATH.write_text(json.dumps(tree, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return changed


def update_home_entry(api: Strapi, link: str, apply: bool) -> None:
    home = (api.request("GET", "/api/home-page?status=draft&populate[services]=true").get("data")) or {}
    items = home.get("services") or []
    target = next((i for i in items if (i.get("linkUrl") or "") == link), None)
    print("  home-page services entry", link)
    if not target:
        print("    ! not found, skipped")
        return
    new_desc = HOME_ITR_PARAGRAPHS[0]
    if not show_change("description", target.get("description"), new_desc) or not apply:
        return
    # Component ids differ between draft and published rows, so the list is resent without ids.
    payload = [
        {
            **{k: v for k, v in item.items() if k in ("title", "description", "linkText", "linkUrl")},
            **({"description": new_desc} if item is target else {}),
        }
        for item in items
    ]
    api.request("PUT", "/api/home-page?status=published", {"data": {"services": payload}})
    print("    saved")


BACKUP_DIR = ROOT / "data" / "backups"
SERVICE_FIELDS = ("title", "heroTitle", "heroSubtitle", "introDescription")


def run_page(api: Strapi, page_slug: str, page: dict, apply: bool) -> None:
    print(f"\n== {page_slug}")
    subs = api.request(
        "GET", f"/api/service-subcategories?filters[slug][$eq]={page_slug}&populate[services][fields][0]=slug"
    ).get("data") or []
    if not subs:
        print("  ! subcategory not found, skipped")
        return
    sub = subs[0]
    linked = {s["slug"] for s in sub.get("services") or []}

    service_rows: dict[str, dict] = {}
    for slug in page["services"]:
        rows = api.request("GET", f"/api/services?filters[slug][$eq]={slug}").get("data") or []
        if rows:
            service_rows[slug] = rows[0]

    if apply:
        BACKUP_DIR.mkdir(parents=True, exist_ok=True)
        backup = {
            "subcategory": {k: sub.get(k) for k in ("documentId", "slug", "title", "intro", "description")},
            "services": [
                {"documentId": r.get("documentId"), "slug": s, **{k: r.get(k) for k in SERVICE_FIELDS}}
                for s, r in service_rows.items()
            ],
        }
        path = BACKUP_DIR / f"{page_slug}-before-2025-act.json"
        if not path.exists():
            path.write_text(json.dumps(backup, ensure_ascii=False, indent=2), encoding="utf-8")

    print("  subcategory")
    sub_data = {}
    for field in ("title", "intro", "description"):
        if field in page and show_change(field, sub.get(field), page[field]):
            sub_data[field] = page[field]
    if apply and sub_data:
        api.request("PUT", f"/api/service-subcategories/{sub['documentId']}?status=published", {"data": sub_data})
        print("    saved")

    for slug, fields in page["services"].items():
        print(f"  service {slug}")
        if slug not in linked:
            print("    ! not linked to this subcategory, skipped")
            continue
        row = service_rows.get(slug)
        if not row:
            print("    ! not found, skipped")
            continue
        wanted = {"title": fields["title"], "heroTitle": fields["title"], "heroSubtitle": fields["heroSubtitle"]}
        if "introDescription" in fields:
            wanted["introDescription"] = fields["introDescription"]
        data = {k: v for k, v in wanted.items() if show_change(k, row.get(k), v)}
        if apply and data:
            api.request("PUT", f"/api/services/{row['documentId']}?status=published", {"data": data})
            print("    saved")

    if page.get("home_service_link"):
        update_home_entry(api, page["home_service_link"], apply)

    if apply:
        print("  service-tree.json titles updated:", update_tree_titles(page_slug, page))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--page", required=True, choices=["all", *sorted(PAGES)])
    parser.add_argument("--apply", action="store_true", help="write changes (default is a dry run)")
    args = parser.parse_args()

    load_env_files()
    base = os.environ.get("NEXT_PUBLIC_STRAPI_URL") or os.environ.get("STRAPI_URL")
    token = os.environ.get("STRAPI_TOKEN") or os.environ.get("STRAPI_API_TOKEN")
    if not base:
        raise SystemExit("NEXT_PUBLIC_STRAPI_URL is required")
    if args.apply and not token:
        raise SystemExit("STRAPI_TOKEN is required to apply changes")

    api = Strapi(base, token)
    print(("APPLY" if args.apply else "DRY RUN"), base)
    slugs = list(PAGES) if args.page == "all" else [args.page]
    for slug in slugs:
        run_page(api, slug, PAGES[slug], args.apply)


if __name__ == "__main__":
    main()
