"""Generate JPG previews (first page) for PDFs in public/pdfs/."""
from __future__ import annotations

import re
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "public" / "pdfs"
PREVIEW_DIR = PDF_DIR / "previews"


def slugify(name: str) -> str:
    stem = re.sub(r"\.pdf$", "", name, flags=re.I)
    slug = stem.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-") or "pdf"


def main() -> None:
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    pdfs = sorted(PDF_DIR.glob("*.pdf"), key=lambda p: p.name.lower())
    if not pdfs:
        print("No PDFs found in", PDF_DIR)
        return

    created = 0
    for pdf_path in pdfs:
        slug = slugify(pdf_path.name)
        out_path = PREVIEW_DIR / f"{slug}.jpg"
        if out_path.exists():
            print("skip", pdf_path.name)
            continue

        doc = fitz.open(pdf_path)
        page = doc[0]
        # ~144 DPI thumbnail suited for card preview
        pix = page.get_pixmap(matrix=fitz.Matrix(1.75, 1.75), alpha=False)
        pix.save(str(out_path), jpg_quality=85)
        doc.close()
        created += 1
        print("created", out_path.name)

    print(f"Done. {created} new preview(s), {len(list(PREVIEW_DIR.glob('*.jpg')))} total.")


if __name__ == "__main__":
    main()
