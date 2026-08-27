"""Upload Service images folder to Strapi and randomly assign across all services.

- Uploads each JPG (resized/compressed for large files)
- Shuffles services, then round-robin assigns the image pool so reuse is even but order looks random
- Sets service.image media relation
"""
from __future__ import annotations

import io
import json
import mimetypes
import os
import random
import time
import urllib.error
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = Path(r"D:\riteshglobalca\Service images")
MANIFEST_PATH = ROOT / "data" / "service-image-assignments.json"
SEED = 27  # fixed seed => reproducible shuffle; change to reshuffle

# Web-friendly max edge / jpeg quality for oversized source files
MAX_EDGE = 1600
JPEG_QUALITY = 82
MAX_UPLOAD_BYTES = 4_500_000


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
            env.setdefault(k.strip(), v.strip().strip('"').strip("'"))
    return env


def request_json(base: str, token: str, method: str, path: str, body: dict | None = None):
    url = base.rstrip("/") + path
    data = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {"Accept": "application/json", "Authorization": f"Bearer {token}"}
    if body is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    with urllib.request.urlopen(req, timeout=120) as res:
        raw = res.read().decode("utf-8")
        return json.loads(raw) if raw else {}


def fetch_all(base: str, token: str, plural: str, extra: str = "") -> list[dict]:
    page = 1
    out: list[dict] = []
    while True:
        payload = request_json(
            base,
            token,
            "GET",
            f"/api/{plural}?pagination[page]={page}&pagination[pageSize]=100{extra}",
        )
        out.extend(payload.get("data") or [])
        meta = (payload.get("meta") or {}).get("pagination") or {}
        if page >= int(meta.get("pageCount") or 1):
            break
        page += 1
    return out


def prepare_image_bytes(path: Path) -> tuple[bytes, str, str]:
    """Return (bytes, filename, mime) — compress large images for upload limits."""
    raw = path.read_bytes()
    name = path.name
    mime = mimetypes.guess_type(name)[0] or "image/jpeg"

    if len(raw) <= MAX_UPLOAD_BYTES and path.suffix.lower() in {".jpg", ".jpeg"}:
        # Still normalize very large dimensions
        try:
            with Image.open(io.BytesIO(raw)) as im:
                w, h = im.size
                if max(w, h) <= MAX_EDGE:
                    return raw, name, mime
        except Exception:
            return raw, name, mime

    with Image.open(path) as im:
        im = im.convert("RGB")
        w, h = im.size
        scale = min(1.0, MAX_EDGE / float(max(w, h)))
        if scale < 1.0:
            im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
        buf = io.BytesIO()
        quality = JPEG_QUALITY
        while True:
            buf.seek(0)
            buf.truncate(0)
            im.save(buf, format="JPEG", quality=quality, optimize=True)
            data = buf.getvalue()
            if len(data) <= MAX_UPLOAD_BYTES or quality <= 55:
                break
            quality -= 7
        out_name = path.stem + ".jpg"
        return data, out_name, "image/jpeg"


def upload_file(base: str, token: str, path: Path) -> dict:
    file_bytes, filename, mime = prepare_image_bytes(path)
    boundary = f"----CursorBoundary{random.randint(10**8, 10**9 - 1)}"
    body = bytearray()
    body.extend(f"--{boundary}\r\n".encode())
    body.extend(
        f'Content-Disposition: form-data; name="files"; filename="{filename}"\r\n'.encode()
    )
    body.extend(f"Content-Type: {mime}\r\n\r\n".encode())
    body.extend(file_bytes)
    body.extend(f"\r\n--{boundary}--\r\n".encode())

    req = urllib.request.Request(
        base.rstrip("/") + "/api/upload",
        data=bytes(body),
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=180) as res:
        payload = json.loads(res.read().decode("utf-8"))
    if isinstance(payload, list) and payload:
        return payload[0]
    if isinstance(payload, dict) and payload.get("id"):
        return payload
    raise RuntimeError(f"Unexpected upload response for {path.name}: {str(payload)[:300]}")


def assign_even_random(services: list[dict], media: list[dict], seed: int) -> list[tuple[dict, dict]]:
    rng = random.Random(seed)
    svc_order = list(services)
    media_order = list(media)
    rng.shuffle(svc_order)
    rng.shuffle(media_order)
    pairs: list[tuple[dict, dict]] = []
    for i, svc in enumerate(svc_order):
        pairs.append((svc, media_order[i % len(media_order)]))
    return pairs


def main() -> None:
    env = load_env()
    base = env.get("NEXT_PUBLIC_STRAPI_URL") or os.environ.get("NEXT_PUBLIC_STRAPI_URL")
    token = env.get("STRAPI_TOKEN") or os.environ.get("STRAPI_TOKEN")
    if not base or not token:
        raise SystemExit("Missing NEXT_PUBLIC_STRAPI_URL or STRAPI_TOKEN")
    if not IMAGES_DIR.exists():
        raise SystemExit(f"Missing images folder: {IMAGES_DIR}")

    image_paths = sorted(
        [
            p
            for p in IMAGES_DIR.iterdir()
            if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
        ],
        key=lambda p: p.name.lower(),
    )
    if not image_paths:
        raise SystemExit("No images found")

    print(f"Images: {len(image_paths)} from {IMAGES_DIR}")
    services = fetch_all(
        base,
        token,
        "services",
        "&fields[0]=title&fields[1]=slug&populate[image][fields][0]=url",
    )
    print(f"Services: {len(services)}")

    uploaded: list[dict] = []
    for i, path in enumerate(image_paths, 1):
        try:
            media = upload_file(base, token, path)
            uploaded.append(
                {
                    "id": media.get("id"),
                    "documentId": media.get("documentId"),
                    "name": media.get("name") or path.name,
                    "url": media.get("url"),
                    "source": path.name,
                }
            )
            print(
                f"  [{i}/{len(image_paths)}] uploaded {path.name} -> id={media.get('id')} "
                f"doc={media.get('documentId')}"
            )
        except urllib.error.HTTPError as e:
            err = e.read().decode("utf-8", errors="replace")
            print(f"  FAIL upload {path.name}: {e.code} {err[:400]}")
        except Exception as exc:
            print(f"  FAIL upload {path.name}: {exc}")
        time.sleep(0.05)

    if not uploaded:
        raise SystemExit("No images uploaded")

    pairs = assign_even_random(services, uploaded, SEED)
    ok = 0
    fail = 0
    assignments = []

    for svc, media in pairs:
        doc_id = svc.get("documentId") or svc.get("id")
        media_ref = media.get("id")
        # Strapi 5 media: set numeric id on media field
        payload = {"data": {"image": media_ref}}
        try:
            request_json(base, token, "PUT", f"/api/services/{doc_id}?status=published", payload)
            ok += 1
            assignments.append(
                {
                    "serviceSlug": svc.get("slug"),
                    "serviceTitle": svc.get("title"),
                    "imageId": media.get("id"),
                    "imageName": media.get("name"),
                    "sourceFile": media.get("source"),
                }
            )
            if ok % 50 == 0:
                print(f"  assigned {ok}/{len(pairs)}")
        except urllib.error.HTTPError as e:
            fail += 1
            err = e.read().decode("utf-8", errors="replace")
            # Fallback: connect by documentId if numeric id rejected
            if fail <= 3:
                print(f"  fail {svc.get('slug')} with id={media_ref}: {e.code} {err[:250]}")
            alt = {"data": {"image": {"connect": [media.get("documentId") or media_ref]}}}
            try:
                request_json(base, token, "PUT", f"/api/services/{doc_id}?status=published", alt)
                ok += 1
                fail -= 1
                assignments.append(
                    {
                        "serviceSlug": svc.get("slug"),
                        "serviceTitle": svc.get("title"),
                        "imageId": media.get("id"),
                        "imageName": media.get("name"),
                        "sourceFile": media.get("source"),
                    }
                )
            except Exception as exc2:
                print(f"  FAIL assign {svc.get('slug')}: {exc2}")
        time.sleep(0.03)

    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(
        json.dumps(
            {
                "seed": SEED,
                "imageCount": len(uploaded),
                "serviceCount": len(services),
                "assigned": ok,
                "failed": fail,
                "images": uploaded,
                "assignments": assignments,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(json.dumps({"uploaded": len(uploaded), "assigned": ok, "failed": fail, "manifest": str(MANIFEST_PATH)}))


if __name__ == "__main__":
    main()
