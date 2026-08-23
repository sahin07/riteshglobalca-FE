"""Build the Excel service tree + Word copy JSON for Strapi seeding.

5th-level Excel items are NOT extra dropdown pages. They become tabs on the
parent (4th-level) service via service.tabbed-rich-text.

Usage:
  python scripts/build_service_content.py           # all 4 docs -> service-tree.json
  python scripts/build_service_content.py --doc 1   # doc 1 only -> data/doc-1-copy.json
"""
from __future__ import annotations

import argparse
import html as html_module
import json
import re
import re
import zipfile
import xml.etree.ElementTree as ET
from collections import OrderedDict, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parent
EXCEL = WORKSPACE / "Copy of Ritesh Arora and Associates_Web Dev Task Breakdown.xlsx"
def doc_paths() -> list[Path]:
    paths: list[Path] = []
    for i in range(1, 11):
        path = WORKSPACE / f"Content RA Assosciates {i}.docx"
        if path.exists():
            paths.append(path)
    return paths


DOCS = doc_paths() or [WORKSPACE / f"Content RA Assosciates {i}.docx" for i in range(1, 6)]
OUT_DIR = ROOT / "data"
NSM = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
NSR = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
NUM = re.compile(r"^(\d+(?:\.\d+)*)\s+(.*)$")


def slugify(text: str) -> str:
    text = re.sub(r"^\d+(?:\.\d+)*\s+", "", text or "")
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:80] or "service"


def display_title(text: str) -> str:
    return re.sub(r"^\d+(?:\.\d+)*\s+", "", text or "").strip() or text


def col_idx(col: str) -> int:
    n = 0
    for ch in col:
        n = n * 26 + (ord(ch.upper()) - 64)
    return n


def read_excel_rows() -> list[list[str]]:
    with zipfile.ZipFile(EXCEL) as z:
        ss = []
        root = ET.fromstring(z.read("xl/sharedStrings.xml"))
        for si in root.findall(f"{NSM}si"):
            ss.append("".join(t.text or "" for t in si.iter(f"{NSM}t")))
        wb = ET.fromstring(z.read("xl/workbook.xml"))
        sheets = [
            (sh.get("name"), sh.get(f"{NSR}id"))
            for sh in wb.findall(f"{NSM}sheets/{NSM}sheet")
        ]
        rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
        rid_to_target = {rel.get("Id"): rel.get("Target") for rel in rels}
        _name, rid = sheets[1]
        target = rid_to_target[rid]
        if not target.startswith("xl/"):
            target = "xl/" + target.lstrip("/")
        sheet = ET.fromstring(z.read(target))
        rows = []
        for row in sheet.findall(f"{NSM}sheetData/{NSM}row"):
            cells = {}
            for c in row.findall(f"{NSM}c"):
                ref = c.get("r") or "A1"
                col = "".join(ch for ch in ref if ch.isalpha())
                t = c.get("t")
                v = c.find(f"{NSM}v")
                isel = c.find(f"{NSM}is")
                val = ""
                if t == "s" and v is not None and v.text:
                    val = ss[int(v.text)]
                elif t == "inlineStr" and isel is not None:
                    val = "".join(x.text or "" for x in isel.iter(f"{NSM}t"))
                elif v is not None and v.text:
                    val = v.text
                cells[col_idx(col)] = val.replace("\n", " ").strip()
            if cells:
                maxc = max(cells)
                rows.append([cells.get(i, "") for i in range(1, maxc + 1)])
        return rows


def module_for(code: str) -> tuple[str, str]:
    if code.split(".")[0] == "2":
        return "2", "International Practice"
    return "1", "India Practice"


def build_tree(rows: list[list[str]]) -> dict:
    items: OrderedDict[str, str] = OrderedDict()
    for row in rows[1:]:
        # Only first 5 columns to avoid IPO/RERA duplicate numbering in extra cols
        for cell in row[:5]:
            cell = (cell or "").strip()
            if not cell:
                continue
            m = NUM.match(cell)
            if not m:
                continue
            code, title = m.group(1), m.group(2).strip()
            if code not in items:
                items[code] = title

    modules: OrderedDict[str, dict] = OrderedDict()
    for mid, title in (("1", "India Practice"), ("2", "International Practice")):
        modules[mid] = {
            "code": mid,
            "title": title,
            "slug": slugify(title),
            "categories": OrderedDict(),
        }

    for code, title in items.items():
        parts = code.split(".")
        depth = len(parts)
        mid, _ = module_for(code)
        mod = modules[mid]
        if depth == 2:
            mod["categories"][code] = {
                "code": code,
                "title": title,
                "slug": slugify(title),
                "subcategories": OrderedDict(),
            }
        elif depth == 3:
            cat_code = ".".join(parts[:2])
            cat = mod["categories"].get(cat_code)
            if not cat:
                continue
            cat["subcategories"][code] = {
                "code": code,
                "title": title,
                "slug": slugify(title),
                "services": OrderedDict(),
            }
        elif depth == 4:
            cat_code = ".".join(parts[:2])
            sub_code = ".".join(parts[:3])
            cat = mod["categories"].get(cat_code)
            sub = cat["subcategories"].get(sub_code) if cat else None
            if not sub:
                continue
            sub["services"][code] = {
                "code": code,
                "title": title,
                "slug": f"{code.replace('.', '-')}-{slugify(title)}",
                "tabs": [],
            }
        elif depth == 5:
            cat_code = ".".join(parts[:2])
            sub_code = ".".join(parts[:3])
            svc_code = ".".join(parts[:4])
            cat = mod["categories"].get(cat_code)
            sub = cat["subcategories"].get(sub_code) if cat else None
            svc = sub["services"].get(svc_code) if sub else None
            if not svc:
                continue
            svc["tabs"].append({"code": code, "title": title, "slug": slugify(title)})

    def freeze(mod: dict) -> dict:
        cats = []
        for cat in mod["categories"].values():
            subs = []
            for sub in cat["subcategories"].values():
                svcs = list(sub["services"].values())
                subs.append({**sub, "services": svcs})
            cats.append({**cat, "subcategories": subs})
        return {**mod, "categories": cats}

    tree_modules = [freeze(m) for m in modules.values()]
    n_cat = sum(len(m["categories"]) for m in tree_modules)
    n_sub = sum(len(c["subcategories"]) for m in tree_modules for c in m["categories"])
    n_svc = sum(
        len(s["services"])
        for m in tree_modules
        for c in m["categories"]
        for s in c["subcategories"]
    )
    n_tabs = sum(
        len(svc["tabs"])
        for m in tree_modules
        for c in m["categories"]
        for s in c["subcategories"]
        for svc in s["services"]
    )
    return {
        "fifthLevelStrategy": "tabs-on-parent",
        "fifthLevelNote": "Excel 5th-level items are tabs on the parent service page, not a 5th dropdown column and not a new Strapi collection.",
        "counts": {
            "modules": len(tree_modules),
            "categories": n_cat,
            "subcategories": n_sub,
            "services": n_svc,
            "fifthLevelTabs": n_tabs,
        },
        "modules": tree_modules,
    }


def para_text(p) -> str:
    return "".join((t.text or "") + (t.tail or "") for t in p.iter(f"{W}t")).strip()


def para_html(p) -> str:
    """Build an HTML string for a single paragraph, preserving bold/italic runs."""
    parts = []
    for r in p.findall(f"{W}r"):
        txt = "".join((t.text or "") + (t.tail or "") for t in r.iter(f"{W}t"))
        if not txt:
            continue
        rpr = r.find(f"{W}rPr")
        is_bold = rpr is not None and rpr.find(f"{W}b") is not None
        is_italic = rpr is not None and rpr.find(f"{W}i") is not None
        esc = txt.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        if is_bold and is_italic:
            parts.append(f"<strong><em>{esc}</em></strong>")
        elif is_bold:
            parts.append(f"<strong>{esc}</strong>")
        elif is_italic:
            parts.append(f"<em>{esc}</em>")
        else:
            parts.append(esc)
    return "".join(parts)


def get_para_style(p) -> str:
    pPr = p.find(f"{W}pPr")
    if pPr is None:
        return ""
    s = pPr.find(f"{W}pStyle")
    if s is None:
        return ""
    return s.get(f"{W}val", "") or ""


def get_num_info(p) -> tuple[str, str]:
    """Return (numId, ilvl) for a numbered/bulleted paragraph, or ('','')."""
    pPr = p.find(f"{W}pPr")
    if pPr is None:
        return ("", "")
    numPr = pPr.find(f"{W}numPr")
    if numPr is None:
        return ("", "")
    numId_el = numPr.find(f"{W}numId")
    ilvl_el = numPr.find(f"{W}ilvl")
    numId = numId_el.get(f"{W}val", "") if numId_el is not None else ""
    ilvl = ilvl_el.get(f"{W}val", "0") if ilvl_el is not None else "0"
    return (numId, ilvl)


def docx_to_html_paragraphs(path: Path) -> list[dict]:
    """Return list of {style, numId, html} dicts for each non-empty paragraph."""
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
    result = []
    for p in root.iter(f"{W}p"):
        text = para_text(p)
        if not text:
            continue
        style = get_para_style(p)
        numId, ilvl = get_num_info(p)
        html = para_html(p)
        result.append({
            "text": text,
            "style": style,
            "numId": numId,
            "ilvl": ilvl,
            "html": html,
        })
    return result


def is_separator_paragraph(p: dict) -> bool:
    text = (p.get("text") or "").strip()
    if not text:
        return False
    compact = text.replace(" ", "")
    if compact.startswith("---") or (compact and set(compact) <= {"-"}):
        return True
    return False


def paragraphs_to_html(paras: list[dict]) -> str:
    """Convert structured paragraphs into an HTML string with proper tags."""
    paras = [p for p in paras if not is_separator_paragraph(p)]
    out = []
    in_ul = False
    in_ol = False

    def close_lists():
        nonlocal in_ul, in_ol
        if in_ul:
            out.append("</ul>")
            in_ul = False
        if in_ol:
            out.append("</ol>")
            in_ol = False

    for p in paras:
        style = p["style"].lower()
        numId = p["numId"]
        html = p["html"]

        if style.startswith("heading1") or style == "heading1":
            close_lists()
            out.append(f"<h1>{html}</h1>")
        elif style.startswith("heading2") or style == "heading2":
            close_lists()
            out.append(f"<h2>{html}</h2>")
        elif style.startswith("heading3") or style == "heading3":
            close_lists()
            out.append(f"<h3>{html}</h3>")
        elif style.startswith("heading4") or style == "heading4":
            close_lists()
            out.append(f"<h4>{html}</h4>")
        elif numId:
            text = p["text"]
            is_bullet = text.startswith("●") or text.startswith("•") or text.startswith("–") or text.startswith("-") or text.startswith("◦")
            clean_html = html
            for marker in ["●", "•", "–", "◦"]:
                if clean_html.startswith(marker):
                    clean_html = clean_html[len(marker):].strip()
                    break

            if is_bullet:
                if in_ol:
                    out.append("</ol>")
                    in_ol = False
                if not in_ul:
                    out.append("<ul>")
                    in_ul = True
                out.append(f"<li>{clean_html}</li>")
            else:
                if in_ul:
                    out.append("</ul>")
                    in_ul = False
                if not in_ol:
                    out.append("<ol>")
                    in_ol = True
                out.append(f"<li>{clean_html}</li>")
        else:
            text = p["text"]
            is_bullet = text.startswith("●") or text.startswith("•") or text.startswith("–") or text.startswith("◦")
            if is_bullet:
                clean_html = html
                for marker in ["●", "•", "–", "◦"]:
                    if clean_html.startswith(marker):
                        clean_html = clean_html[len(marker):].strip()
                        break
                if in_ol:
                    out.append("</ol>")
                    in_ol = False
                if not in_ul:
                    out.append("<ul>")
                    in_ul = True
                out.append(f"<li>{clean_html}</li>")
            else:
                close_lists()
                out.append(f"<p>{html}</p>")

    close_lists()
    html = "\n".join(out)
    return re.sub(r"<p>\s*-{10,}\s*</p>\s*", "", html, flags=re.IGNORECASE)


def docx_paragraphs(path: Path) -> list[str]:
    """Legacy: returns list of plain-text paragraphs."""
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
    paras = []
    for p in root.iter(f"{W}p"):
        t = para_text(p)
        if t:
            paras.append(t)
    return paras


UNNUMBERED_MAP = OrderedDict(
    [
        ("GST Registration Services", "1.1.1.1"),
        ("GST Return Filing Services", "1.1.1.2"),
        ("GST Advisory Services", "1.1.1.3"),
        ("GST Litigation Support Services", "1.1.1.4"),
        ("GST Refund Services", "1.1.1.5"),
        ("Customs Advisory & Compliance Services", "1.1.2.1"),
        ("Customs Duty Optimisation Services", "1.1.2.2"),
        ("Customs Filings & Documentation Services", "1.1.2.3"),
        ("Customs Audit & Investigation Support Services", "1.1.2.4"),
        ("Customs Litigation & Representation Services", "1.1.2.5"),
        ("Income Tax Return Filing", "1.2.1.1"),
    ]
)


PROCESS_HEADINGS = {
    "our process",
    "our audit process",
    "our gst registration process",
    "our gst return filing process",
}
PROCESS_SKIP = {"step", "our approach"}
STEP_NUM = re.compile(r"^step\s+\d+\s*[:\.]?\s*", re.I)
FEATURE_SECTION_HEADING = re.compile(r"^our .+ services(?: include)?\.?$", re.I)
PROCESS_CLOSING_PREFIXES = (
    "why choose",
    "supporting ",
    "reliable ",
    "documents commonly",
    "professional assistance",
    "expert guidance",
    "comprehensive support",
    "seamless ",
    "simplifying ",
    "keeping ",
    "ensuring ",
)


def is_process_heading(text: str) -> bool:
    lower = text.strip().lower()
    if lower in PROCESS_HEADINGS:
        return True
    return lower.startswith("our ") and lower.endswith(" process")


def is_process_closing_line(text: str) -> bool:
    stripped = (text or "").strip()
    if not stripped:
        return False
    lower = stripped.lower()
    if NUM.match(stripped):
        return True
    if stripped.startswith("---") or set(stripped) <= {"-"}:
        return True
    if any(lower.startswith(prefix) for prefix in PROCESS_CLOSING_PREFIXES):
        return True
    if lower.endswith("services ensure") or lower.endswith("services help"):
        return True
    if len(stripped) > 180:
        return True
    return False


def normalize_step_title(text: str) -> str:
    return STEP_NUM.sub("", text or "").strip() or text


def is_benefits_heading(text: str) -> bool:
    return (text or "").strip().lower() in ("benefits", "key benefits")


def is_card_section_heading(text: str) -> bool:
    """Headings for sections rendered as feature-grid cards."""
    stripped = (text or "").strip()
    lower = stripped.lower()
    if is_process_heading(stripped):
        return False
    if lower.startswith("why choose"):
        return False
    if lower.startswith("documents commonly"):
        return False
    if lower.startswith("business entities covered"):
        return True
    if is_benefits_heading(stripped):
        return False
    return bool(FEATURE_SECTION_HEADING.match(stripped)) or lower.startswith("our ") and "services include" in lower


def is_feature_section_heading(text: str) -> bool:
    return is_card_section_heading(text)


def extract_intro_paras(paras: list[dict]) -> list[dict]:
    """Opening prose paragraphs before the first section heading."""
    intro: list[dict] = []
    for p in paras:
        text = (p.get("text") or "").strip()
        if not text:
            continue
        html = (p.get("html") or "").strip().lower()
        if "<h3>" in html:
            break
        if len(text) <= 90 and not text.endswith("."):
            break
        intro.append(p)
    return intro


def trim_intro_paras(paras: list[dict]) -> list[dict]:
    """Drop opening intro paragraphs; content blocks start at the first section heading."""
    count = len(extract_intro_paras(paras))
    return paras[count:] if count else paras


def is_strong_paragraph(p: dict) -> bool:
    html = (p.get("html") or "").strip()
    text = (p.get("text") or "").strip()
    strong_only = html_module.unescape(re.sub(r"</?(strong|em)>", "", html).strip())
    return bool(text and strong_only == text and "<strong>" in html and not p.get("numId"))


def extract_feature_sections(paras: list[dict]) -> list[dict]:
    sections: list[dict] = []
    i = 0
    while i < len(paras):
        text = paras[i]["text"].strip()
        if not is_card_section_heading(text):
            i += 1
            continue

        title = text
        subtitle = ""
        cards: list[dict] = []
        i += 1

        if i < len(paras):
            lead = paras[i]["text"].strip()
            if lead and not is_strong_paragraph(paras[i]) and not is_card_section_heading(lead):
                subtitle = lead
                i += 1

        while i < len(paras):
            current = paras[i]["text"].strip()
            lower = current.lower()
            if (
                not current
                or is_process_heading(current)
                or is_card_section_heading(current)
                or lower.startswith("why choose")
                or lower.startswith("documents commonly")
                or is_benefits_heading(current)
                or current.startswith("---")
                or NUM.match(current)
            ):
                break

            if is_strong_paragraph(paras[i]):
                card_title = current
                card_description = ""
                if i + 1 < len(paras):
                    nxt = paras[i + 1]["text"].strip()
                    if (
                        nxt
                        and not is_strong_paragraph(paras[i + 1])
                        and not is_card_section_heading(nxt)
                        and not is_process_heading(nxt)
                        and not NUM.match(nxt)
                    ):
                        card_description = nxt
                        i += 1
                cards.append({"title": card_title, "description": card_description})
            i += 1

        if cards:
            sections.append(
                {
                    "sectionTitle": title,
                    "sectionSubtitle": subtitle,
                    "cards": cards,
                }
            )

    return sections


def extract_process_lines_from_paras(paras: list[dict]) -> list[str]:
    flat: list[str] = []
    in_process = False
    i = 0
    while i < len(paras):
        p = paras[i]
        text = p["text"].strip()
        if is_process_heading(text):
            in_process = True
            i += 1
            continue
        if not in_process:
            i += 1
            continue
        if text.lower() in PROCESS_SKIP:
            i += 1
            continue
        if not text:
            i += 1
            continue
        if is_process_closing_line(text):
            break

        if STEP_NUM.match(text):
            flat.append(text)
            if i + 1 < len(paras):
                nxt = paras[i + 1]["text"].strip()
                if (
                    nxt
                    and not STEP_NUM.match(nxt)
                    and not is_process_heading(nxt)
                    and not is_process_closing_line(nxt)
                ):
                    flat.append(nxt)
                    i += 2
                    continue
            i += 1
            continue

        if (
            not flat
            and is_likely_process_description(text)
            and i + 1 < len(paras)
            and STEP_NUM.match(paras[i + 1]["text"].strip())
        ):
            i += 1
            continue

        flat.append(text)
        i += 1
    return flat


def strip_process_from_paras(paras: list[dict]) -> list[dict]:
    """Remove the 'Our Process' table/section from paragraph list."""
    result = []
    in_process = False
    for p in paras:
        text = p["text"].strip()
        if is_process_heading(text):
            in_process = True
            continue
        if in_process:
            if text.lower() in PROCESS_SKIP:
                continue
            if not text:
                continue
            if is_process_closing_line(text):
                in_process = False
                result.append(p)
                continue
            continue
        result.append(p)
    return result


def _skip_card_section(paras: list[dict], i: int) -> int:
    """Return index after the card section whose heading is at paras[i]."""
    i += 1
    if i < len(paras):
        lead = paras[i]["text"].strip()
        if lead and not is_strong_paragraph(paras[i]) and not is_card_section_heading(lead):
            i += 1

    while i < len(paras):
        current = paras[i]["text"].strip()
        lower = current.lower()
        if (
            not current
            or is_process_heading(current)
            or is_card_section_heading(current)
            or lower.startswith("why choose")
            or lower.startswith("documents commonly")
            or is_benefits_heading(current)
            or current.startswith("---")
            or NUM.match(current)
        ):
            break
        i += 1
    return i


def split_paras_around_features(paras: list[dict]) -> tuple[list[dict], list[dict]]:
    """Split paragraphs into content before and after card sections (process excluded)."""
    before: list[dict] = []
    after: list[dict] = []
    seen_feature = False
    i = 0
    while i < len(paras):
        text = paras[i]["text"].strip()
        if is_process_heading(text):
            i += 1
            while i < len(paras):
                t = paras[i]["text"].strip()
                if t.lower() in PROCESS_SKIP:
                    i += 1
                    continue
                if not t:
                    i += 1
                    continue
                if is_process_closing_line(t):
                    break
                i += 1
        elif is_card_section_heading(text):
            seen_feature = True
            i = _skip_card_section(paras, i)
            continue

        if i >= len(paras):
            break

        if not seen_feature:
            before.append(paras[i])
        else:
            after.append(paras[i])
        i += 1
    return before, after


def strip_feature_sections_from_paras(paras: list[dict]) -> list[dict]:
    result: list[dict] = []
    i = 0
    while i < len(paras):
        text = paras[i]["text"].strip()
        if not is_card_section_heading(text):
            result.append(paras[i])
            i += 1
            continue
        i = _skip_card_section(paras, i)

    return result


def parse_word_copy(doc_paths: list[Path] | None = None) -> dict[str, dict]:
    all_paras: list[dict] = []
    sources = doc_paths if doc_paths is not None else DOCS
    for doc in sources:
        if doc.exists():
            all_paras.extend(docx_to_html_paragraphs(doc))

    sections: dict[str, list[dict]] = OrderedDict()
    current = None
    for p in all_paras:
        text = p["text"]
        mapped = None
        m = NUM.match(text)
        if m and len(m.group(1).split(".")) >= 3:
            mapped = m.group(1)
        else:
            for title, code in UNNUMBERED_MAP.items():
                if text.strip() == title:
                    mapped = code
                    break
        if mapped:
            current = mapped
            sections.setdefault(current, [])
            continue
        if current:
            sections[current].append(p)

    copy: dict[str, dict] = {}
    for code, paras in sections.items():
        plain_lines = [p["text"] for p in paras]
        plain_body = "\n\n".join(plain_lines).strip()

        intro_paras = extract_intro_paras(paras)
        intro_hero = (intro_paras[0]["text"] or "").strip() if intro_paras else ""
        intro_rest = paragraphs_to_html(intro_paras[1:]) if len(intro_paras) > 1 else ""
        content_paras = paras[len(intro_paras) :] if intro_paras else paras

        feature_sections = extract_feature_sections(paras)
        before_paras, after_paras = split_paras_around_features(content_paras)
        # Strip structured sections from HTML body; they become separate blocks.
        body_paras = strip_feature_sections_from_paras(strip_process_from_paras(content_paras))
        html_body = paragraphs_to_html(body_paras)
        body_before = paragraphs_to_html(before_paras)
        body_after = paragraphs_to_html(after_paras)

        process_lines = extract_process_lines_from_paras(paras)
        copy[code] = {
            "hasCopy": bool(html_body or plain_body),
            "intro": intro_hero,
            "introHero": intro_hero,
            "introRest": intro_rest,
            "body": html_body,
            "bodyBefore": body_before,
            "bodyAfter": body_after,
            "plainBody": plain_body,
            "featureSections": feature_sections,
            "processLines": process_lines,
            "processSteps": pair_process_lines(process_lines),
        }
    return copy


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


def pair_process_lines(flat: list[str]) -> list[dict]:
    if not flat:
        return []

    if any(STEP_NUM.match(x) for x in flat):
        paired: list[dict] = []
        i = 0
        while i < len(flat):
            raw_title = flat[i].strip()
            if not raw_title:
                i += 1
                continue
            title = normalize_step_title(raw_title)
            description = ""
            if i + 1 < len(flat) and is_likely_process_description(flat[i + 1]):
                description = flat[i + 1].strip()
                i += 2
            else:
                i += 1
            paired.append({"title": title, "description": description})
        return paired

    start = 1 if len(flat) > 1 and len(flat[0]) > 70 and is_likely_process_description(flat[0]) else 0
    step_lines = [line.strip() for line in flat[start:] if line.strip()]
    if step_lines and all(is_likely_process_description(line) for line in step_lines):
        return [
            {"title": line.rstrip("."), "description": ""}
            for line in step_lines
        ]

    paired = []
    i = 0
    while i < len(flat):
        raw_title = flat[i].strip()
        if not raw_title:
            i += 1
            continue
        title = normalize_step_title(raw_title)
        description = ""
        if i + 1 < len(flat) and is_likely_process_description(flat[i + 1]):
            description = flat[i + 1].strip()
            i += 2
        else:
            i += 1
        paired.append({"title": title, "description": description})
    return paired


def split_process_steps(body: str) -> list[dict]:
    flat: list[str] = []
    in_process = False
    for line in body.split("\n"):
        stripped = line.strip()
        if is_process_heading(stripped):
            in_process = True
            continue
        if in_process:
            if stripped.lower() in PROCESS_SKIP:
                continue
            if not stripped:
                continue
            if is_process_closing_line(stripped):
                break
            flat.append(stripped)
    return pair_process_lines(flat)


def attach_copy(tree: dict, copy: dict[str, dict]) -> tuple[dict, dict]:
    missing = []
    present = []

    def walk_services():
        for mod in tree["modules"]:
            for cat in mod["categories"]:
                for sub in cat["subcategories"]:
                    for svc in sub["services"]:
                        yield svc

    for svc in walk_services():
        c = copy.get(svc["code"]) or {}
        svc["hasCopy"] = bool(c.get("hasCopy"))
        svc["intro"] = c.get("intro") or ""
        svc["introHero"] = c.get("introHero") or c.get("intro") or ""
        svc["introRest"] = c.get("introRest") or ""
        svc["body"] = c.get("body") or ""
        svc["bodyBefore"] = c.get("bodyBefore") or ""
        svc["bodyAfter"] = c.get("bodyAfter") or ""
        svc["plainBody"] = c.get("plainBody") or ""
        svc["featureSections"] = c.get("featureSections") or []
        svc["processSteps"] = c.get("processSteps") or (
            split_process_steps(svc.get("plainBody") or "") if svc.get("plainBody") else []
        )
        for tab in svc["tabs"]:
            tc = copy.get(tab["code"]) or {}
            tab["hasCopy"] = bool(tc.get("hasCopy"))
            tab["body"] = tc.get("body") or ""
        if svc["hasCopy"]:
            present.append(svc["code"])
        else:
            missing.append({"code": svc["code"], "title": svc["title"]})

    gaps = {
        "strategy": "tabs-on-parent",
        "copyCoveredThrough": "Word docs 1-5 cover all India practice (through 1.12). Missing: all International Practice 2.x (89 services). Add Content RA Assosciates 6.docx when ready.",
        "servicesWithCopy": len(present),
        "servicesMissingCopy": len(missing),
        "missing": missing,
    }
    return tree, gaps


def doc_path(doc_num: int) -> Path:
    return WORKSPACE / f"Content RA Assosciates {doc_num}.docx"


def build_doc_copy(doc_num: int) -> dict[str, dict]:
    path = doc_path(doc_num)
    if not path.exists():
        raise SystemExit(f"Missing doc file: {path}")
    return parse_word_copy([path])


def main() -> None:
    parser = argparse.ArgumentParser(description="Build service tree and Word copy JSON")
    available = [i for i in range(1, 11) if doc_path(i).exists()]
    parser.add_argument(
        "--doc",
        type=int,
        choices=available or [1, 2, 3, 4, 5],
        help="Build copy JSON for one doc only",
    )
    args = parser.parse_args()

    OUT_DIR.mkdir(exist_ok=True)
    rows = read_excel_rows()
    tree = build_tree(rows)

    if args.doc:
        copy = build_doc_copy(args.doc)
        doc_out = OUT_DIR / f"doc-{args.doc}-copy.json"
        doc_out.write_text(json.dumps(copy, ensure_ascii=False, indent=2), encoding="utf-8")
        print("Wrote", doc_out)
        print("sections_in_doc", len(copy))
        print("codes", ", ".join(sorted(copy.keys())[:8]), "...")
        return

    copy = parse_word_copy()
    tree, gaps = attach_copy(tree, copy)
    (OUT_DIR / "service-tree.json").write_text(json.dumps(tree, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT_DIR / "service-copy-gaps.json").write_text(json.dumps(gaps, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Wrote", OUT_DIR / "service-tree.json")
    print("Wrote", OUT_DIR / "service-copy-gaps.json")
    print("counts", json.dumps(tree["counts"]))
    print("copy", gaps["servicesWithCopy"], "missing", gaps["servicesMissingCopy"])


if __name__ == "__main__":
    main()
