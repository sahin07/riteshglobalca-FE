"""Build the Excel service tree + Word copy JSON for Strapi seeding.

5th-level Excel items are NOT extra dropdown pages. They become tabs on the
parent (4th-level) service via service.tabbed-rich-text.
"""
from __future__ import annotations

import json
import re
import zipfile
import xml.etree.ElementTree as ET
from collections import OrderedDict, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parent
EXCEL = WORKSPACE / "Copy of Ritesh Arora and Associates_Web Dev Task Breakdown.xlsx"
DOCS = [WORKSPACE / f"Content RA Assosciates {i}.docx" for i in range(1, 5)]
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


def paragraphs_to_html(paras: list[dict]) -> str:
    """Convert structured paragraphs into an HTML string with proper tags."""
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
    return "\n".join(out)


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
    "our process", "our audit process", "our gst registration process",
    "our gst return filing process",
}
PROCESS_SKIP = {"step", "our approach"}


def strip_process_from_paras(paras: list[dict]) -> list[dict]:
    """Remove the 'Our Process' table/section from paragraph list."""
    result = []
    in_process = False
    for p in paras:
        text = p["text"].strip().lower()
        if text in PROCESS_HEADINGS:
            in_process = True
            continue
        if in_process:
            if text in PROCESS_SKIP:
                continue
            # End of process section: next heading or a long paragraph or numbered section
            style = p["style"].lower()
            is_heading = style.startswith("heading")
            is_long = len(p["text"]) > 80
            is_numbered = NUM.match(p["text"].strip())
            if is_heading or is_long or is_numbered:
                in_process = False
                result.append(p)
            # Otherwise skip (these are the step lines)
            continue
        result.append(p)
    return result


def parse_word_copy() -> dict[str, dict]:
    all_paras: list[dict] = []
    for doc in DOCS:
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
        intro = ""
        for line in plain_lines:
            if len(line) > 80:
                intro = line
                break
        if not intro and plain_lines:
            intro = plain_lines[0]

        # Strip "Our Process" section from HTML body (it becomes a separate process-section block)
        body_paras = strip_process_from_paras(paras)
        html_body = paragraphs_to_html(body_paras)

        copy[code] = {
            "hasCopy": bool(html_body),
            "intro": intro[:500],
            "body": html_body,
            "plainBody": plain_body,
        }
    return copy


def split_process_steps(body: str) -> list[str]:
    steps = []
    in_process = False
    for line in body.split("\n"):
        stripped = line.strip()
        if stripped.lower() in {"our process", "our audit process", "our gst registration process", "our gst return filing process"}:
            in_process = True
            continue
        if in_process:
            if stripped.lower() in {"step", "our approach"}:
                continue
            if not stripped:
                continue
            if stripped.endswith("Services") and len(stripped) < 80:
                break
            if NUM.match(stripped):
                break
            steps.append(stripped)
            if len(steps) >= 8:
                break
    return steps


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
        svc["body"] = c.get("body") or ""
        svc["plainBody"] = c.get("plainBody") or ""
        svc["processSteps"] = split_process_steps(svc.get("plainBody") or "") if svc.get("plainBody") else []
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
        "copyCoveredThrough": "Word docs cover India practice through RERA 1.9.2.3. Missing: rest of RERA 1.9.3-1.9.6, Loan Syndication 1.10, Valuation 1.11, EPFO/Labour 1.12, and all Global Practice 2.x.",
        "servicesWithCopy": len(present),
        "servicesMissingCopy": len(missing),
        "missing": missing,
    }
    return tree, gaps


def main() -> None:
    OUT_DIR.mkdir(exist_ok=True)
    rows = read_excel_rows()
    tree = build_tree(rows)
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
