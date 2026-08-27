"""Update About Leadership team to CA Ritesh Arora + CA Diksha Arora only."""
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


RITESH_BIO = (
    "CA Ritesh Arora is a Partner at Ritesh Arora & Associates and specialises in "
    "indirect taxation, GST advisory, litigation and business consulting. With over "
    "a decade of professional experience, he advises businesses across diverse "
    "industries on complex tax matters, regulatory compliance and strategic business "
    "issues. He regularly represents clients before tax authorities and appellate "
    "forums, assisting them in resolving intricate tax disputes through practical "
    "and commercially viable solutions.\n\n"
    "He is also the author of GST Gavel – A Litigation Guide and actively contributes "
    "to the profession through technical sessions, professional publications and "
    "knowledge-sharing initiatives."
)

DIKSHA_BIO = (
    "CA Diksha Arora is a Partner at Ritesh Arora & Associates with extensive "
    "experience in audit & assurance, financial reporting, accounting and regulatory "
    "compliance. She works closely with businesses to strengthen governance, improve "
    "financial processes and ensure timely statutory compliance. Her practical and "
    "client-focused approach enables organisations to build efficient financial "
    "systems while maintaining the highest standards of professional integrity. She "
    "is currently serving as the Chairperson of the ICAI Amritsar Branch (2026–27)."
)

RITESH_EXPERTISE = [
    "GST Advisory & Compliance",
    "GST Litigation & Representation",
    "Direct & Indirect Taxation",
    "Business Advisory & Strategic Consulting",
    "Regulatory Compliance",
    "Tax Risk Management",
]

DIKSHA_EXPERTISE = [
    "Audit & Assurance",
    "Accounting & Financial Reporting",
    "Corporate & Regulatory Compliance",
    "Financial Advisory",
]


def main() -> None:
    env = load_env()
    base = env["NEXT_PUBLIC_STRAPI_URL"]
    token = env["STRAPI_TOKEN"]

    about = request(
        base,
        token,
        "GET",
        "/api/about?populate[teamMembers][populate]=*",
    )["data"]
    doc_id = about["documentId"]
    current = about.get("teamMembers") or []
    print("Current members:", [m.get("name") for m in current])

    ritesh_img = None
    fallback_img = None
    for m in current:
        img = m.get("image") or {}
        img_id = img.get("id")
        name = (m.get("name") or "").lower()
        if "ritesh" in name and img_id:
            ritesh_img = img_id
        if img_id and fallback_img is None:
            fallback_img = img_id
        if "diksha" in name and img_id:
            fallback_img = img_id  # prefer existing diksha if any

    # Prefer known ritesh media id from library if missing on component
    if not ritesh_img:
        ritesh_img = 20
    diksha_img = fallback_img if fallback_img and fallback_img != ritesh_img else 19

    payload = {
        "data": {
            "leadershipTitle": about.get("leadershipTitle") or "Leadership",
            "teamMembers": [
                {
                    "name": "CA Ritesh Arora",
                    "role": "Partner",
                    "biography": RITESH_BIO,
                    "keyExpertise": {"keyExpertise": RITESH_EXPERTISE},
                    "image": ritesh_img,
                    "linkedInUrl": next(
                        (m.get("linkedInUrl") for m in current if "ritesh" in (m.get("name") or "").lower()),
                        None,
                    )
                    or "",
                    "twitterUrl": next(
                        (m.get("twitterUrl") for m in current if "ritesh" in (m.get("name") or "").lower()),
                        None,
                    )
                    or "",
                },
                {
                    "name": "CA Diksha Arora",
                    "role": "Partner",
                    "biography": DIKSHA_BIO,
                    "keyExpertise": {"keyExpertise": DIKSHA_EXPERTISE},
                    "image": diksha_img,
                    "linkedInUrl": "",
                    "twitterUrl": "",
                },
            ],
        }
    }

    updated = request(base, token, "PUT", "/api/about?status=published", payload)
    members = (updated.get("data") or {}).get("teamMembers") or []
    # Re-fetch to confirm published populate
    confirm = request(
        base,
        token,
        "GET",
        "/api/about?populate[teamMembers][populate]=*",
    )["data"]
    print("Updated members:")
    for m in confirm.get("teamMembers") or []:
        print(" -", m.get("name"), "|", m.get("role"), "| image", (m.get("image") or {}).get("id"))
        print("   expertise", (m.get("keyExpertise") or {}).get("keyExpertise"))
    if diksha_img == 19:
        print(
            "NOTE: CA Diksha Arora is using a temporary photo (previous placeholder). "
            "Upload her photo in Strapi About > Leadership when ready."
        )


if __name__ == "__main__":
    main()
