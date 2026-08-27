"""Upload partner photos and attach to About Leadership team members."""
from __future__ import annotations

import json
import mimetypes
import random
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RITESH_IMG = Path(r"D:\riteshglobalca\ritesh.jpeg")
DIKSHA_IMG = Path(r"D:\riteshglobalca\Diksha Arora.jpeg")


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
    with urllib.request.urlopen(req, timeout=120) as res:
        raw = res.read().decode("utf-8")
        return json.loads(raw) if raw else {}


def upload_file(base: str, token: str, path: Path) -> dict:
    file_bytes = path.read_bytes()
    filename = path.name
    mime = mimetypes.guess_type(filename)[0] or "image/jpeg"
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
    raise RuntimeError(f"Unexpected upload response: {str(payload)[:300]}")


def main() -> None:
    env = load_env()
    base = env["NEXT_PUBLIC_STRAPI_URL"]
    token = env["STRAPI_TOKEN"]

    if not RITESH_IMG.exists() or not DIKSHA_IMG.exists():
        raise SystemExit(f"Missing images: {RITESH_IMG.exists()=} {DIKSHA_IMG.exists()=}")

    print("Uploading", RITESH_IMG.name)
    ritesh_media = upload_file(base, token, RITESH_IMG)
    print("  -> id", ritesh_media.get("id"), ritesh_media.get("url"))

    print("Uploading", DIKSHA_IMG.name)
    diksha_media = upload_file(base, token, DIKSHA_IMG)
    print("  -> id", diksha_media.get("id"), diksha_media.get("url"))

    about = request(base, token, "GET", "/api/about?populate[teamMembers][populate]=*")["data"]
    members = about.get("teamMembers") or []
    print("Current:", [(m.get("name"), (m.get("image") or {}).get("id")) for m in members])

    updated_members = []
    for m in members:
        name = (m.get("name") or "").lower()
        row = {
            "name": m.get("name"),
            "role": m.get("role"),
            "biography": m.get("biography") or "",
            "keyExpertise": m.get("keyExpertise"),
            "linkedInUrl": m.get("linkedInUrl") or "",
            "twitterUrl": m.get("twitterUrl") or "",
            "image": (m.get("image") or {}).get("id"),
        }
        if "ritesh" in name:
            row["image"] = ritesh_media["id"]
        elif "diksha" in name:
            row["image"] = diksha_media["id"]
        updated_members.append(row)

    if len(updated_members) < 2:
        raise SystemExit("Expected 2 team members on About page")

    request(
        base,
        token,
        "PUT",
        "/api/about?status=published",
        {"data": {"teamMembers": updated_members}},
    )

    confirm = request(base, token, "GET", "/api/about?populate[teamMembers][populate]=*")["data"]
    for m in confirm.get("teamMembers") or []:
        print("OK", m.get("name"), "->", (m.get("image") or {}).get("url"))


if __name__ == "__main__":
    main()
