# -*- coding: utf-8 -*-
import html
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent

def wrap_section(section_id: str, title: str, body: str) -> str:
    esc = html.escape(body)
    return f'''<section class="content-section" id="{section_id}" style="scroll-margin-top:88px;">
        <div class="content-header">
          <h2><i class="fa-solid fa-file-lines"></i> {title}</h2>
        </div>
        <div class="bylaws-fulltext" style="background:var(--bg);border:1px solid var(--border-light);border-radius:var(--radius-md);padding:24px 28px;font-size:14px;line-height:1.75;color:var(--text-mid);white-space:pre-wrap;font-family:inherit;">{esc}</div>
      </section>'''

def main() -> None:
    guide = (ROOT / "guide.html").read_text(encoding="utf-8")
    terms = (HERE / "terms.txt").read_text(encoding="utf-8")
    privacy = (HERE / "privacy.txt").read_text(encoding="utf-8")
    email = (HERE / "email.txt").read_text(encoding="utf-8")

    guide = guide.replace(
        "TERMS_BODY_PLACEHOLDER",
        wrap_section("terms", "이용약관", terms),
    )
    guide = guide.replace(
        "PRIVACY_BODY_PLACEHOLDER",
        wrap_section("privacy", "개인정보처리방침", privacy),
    )
    guide = guide.replace(
        "EMAIL_BODY_PLACEHOLDER",
        wrap_section("email-refusal", "이메일무단수집거부", email),
    )
    (ROOT / "guide.html").write_text(guide, encoding="utf-8")

if __name__ == "__main__":
    main()
