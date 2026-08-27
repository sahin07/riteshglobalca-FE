"""Upload Snapshots gallery images and attach to home-page trustedByLogos."""
from __future__ import annotations

import io
import json
import mimetypes
import random
import time
import urllib.error
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = Path(r"D:\riteshglobalca\WhatsApp Unknown 2026-08-27 at 14.52.13")
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
            env.setdefault(k.strip(), v.strip())
    return env


def request(base: str, token: str, method: str, path: str, body: dict | None = None):
    url = base.rstrip("/") + path
    data = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {"Accept": "application/json", "Authorization": f"Bearer {token}"}
    if body is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    with urllib.request.urlopen(req, timeout=180) as res:
        raw = res.read().decode("utf-8")
        return json.loads(raw) if raw else {}


def prepare_image_bytes(path: Path) -> tuple[bytes, str, str]:
    raw = path.read_bytes()
    name = path.stem + ".jpg"
    if len(raw) <= MAX_UPLOAD_BYTES:
        try:
            with Image.open(io.BytesIO(raw)) as im:
                if max(im.size) <= MAX_EDGE:
                    mime = mimetypes.guess_type(path.name)[0] or "image/jpeg"
                    return raw, path.name, mime
        except Exception:
            return raw, path.name, "image/jpeg"

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
        return data, name, "image/jpeg"


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
    raise RuntimeError(f"Unexpected upload response for {path.name}: {str(payload)[:300]}")


def main() -> None:
    env = load_env()
    base = env["NEXT_PUBLIC_STRAPI_URL"]
    token = env["STRAPI_TOKEN"]
    if not IMAGES_DIR.exists():
        raise SystemExit(f"Missing folder: {IMAGES_DIR}")

    paths = sorted(
        [
            p
            for p in IMAGES_DIR.iterdir()
            if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
        ],
        key=lambda p: p.name.lower(),
    )
    print(f"Found {len(paths)} images")

    media_ids: list[int] = []
    for i, path in enumerate(paths, 1):
        try:
            media = upload_file(base, token, path)
            mid = media.get("id")
            print(f"  [{i}/{len(paths)}] {path.name} -> id={mid}")
            if mid:
                media_ids.append(mid)
        except urllib.error.HTTPError as e:
            err = e.read().decode("utf-8", errors="replace")
            print(f"  FAIL {path.name}: {e.code} {err[:300]}")
        except Exception as exc:
            print(f"  FAIL {path.name}: {exc}")
        time.sleep(0.05)

    if not media_ids:
        raise SystemExit("No images uploaded")

    # Replace gallery with these images
    payload = {
        "data": {
            "trustedByTitle": "Snapshots of our Work",
            "trustedBySubtitle": (
                "Glance through the recent launch of our book GST Gavel by CA Ritesh Arora"
            ),
            "trustedByLogos": media_ids,
        }
    }
    try:
        request(base, token, "PUT", "/api/home-page?status=published", payload)
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        print("PUT with ids failed:", e.code, err[:400])
        # fallback connect style
        payload = {
            "data": {
                "trustedByLogos": {"set": media_ids},
            }
        }
        request(base, token, "PUT", "/api/home-page?status=published", payload)

    # confirm via qs populate
    from urllib.parse import urlencode

    q = urlencode(
        {
            "populate[trustedByLogos][fields][0]": "url",
            "populate[trustedByLogos][fields][1]": "name",
            "fields[0]": "trustedByTitle",
            "fields[1]": "trustedBySubtitle",
        }
    )
    confirm = request(base, token, "GET", f"/api/home-page?{q}")["data"]
    logos = confirm.get("trustedByLogos") or []
    print(
        "Done:",
        confirm.get("trustedByTitle"),
        "| logos:",
        len(logos) if isinstance(logos, list) else logos,
    )


if __name__ == "__main__":
    main()
