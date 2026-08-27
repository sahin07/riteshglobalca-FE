"""Remove orphan International Practice > Tax category (no groups/services)."""
from __future__ import annotations

import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


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
    with urllib.request.urlopen(req, timeout=60) as res:
        raw = res.read().decode("utf-8")
        return json.loads(raw) if raw else {}


def main() -> None:
    env = load_env()
    base = env["NEXT_PUBLIC_STRAPI_URL"]
    token = env["STRAPI_TOKEN"]

    page = 1
    tax = None
    while True:
        payload = request(
            base,
            token,
            "GET",
            f"/api/service-categories?pagination[page]={page}&pagination[pageSize]=100&populate[mainModule]=true",
        )
        for row in payload.get("data") or []:
            if (row.get("slug") or "") == "tax":
                tax = row
                break
        if tax:
            break
        meta = (payload.get("meta") or {}).get("pagination") or {}
        if page >= int(meta.get("pageCount") or 1):
            break
        page += 1

    if not tax:
        print("No tax category found")
        return

    mm = tax.get("mainModule") or {}
    print(
        "Found",
        f"id={tax.get('id')}",
        f"documentId={tax.get('documentId')}",
        f"title={tax.get('title')}",
        f"module={mm.get('title')}",
    )

    # Confirm no subcategories
    subs = request(
        base,
        token,
        "GET",
        f"/api/service-subcategories?filters[category][id][$eq]={tax['id']}&pagination[pageSize]=5",
    )
    count = len(subs.get("data") or [])
    if count:
        raise SystemExit(f"Refusing to delete: {count} subcategories still linked")

    doc_id = tax.get("documentId") or tax.get("id")
    request(base, token, "DELETE", f"/api/service-categories/{doc_id}")
    print("Deleted orphan Tax category", doc_id)


if __name__ == "__main__":
    main()
