"""Download one freely licensed photo per stadium from Wikimedia Commons.

For each stadium this script:
  1. asks Wikipedia which photo leads the stadium's article,
  2. asks Wikimedia Commons for a 1280px copy plus its author and license,
  3. saves it to images/<slug>.jpg,
  4. records the credit in js/credits.js for the About page.

Run it from the project folder:   python tools/fetch_images.py
It only uses the Python standard library.
"""

import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from html import unescape
from pathlib import Path

PROJECT = Path(__file__).resolve().parent.parent
IMAGES = PROJECT / "images"
CREDITS_FILE = PROJECT / "js" / "credits.js"

# Wikimedia asks scripts to identify themselves.
USER_AGENT = "pl-stadium-guide/1.0 (student web project; github.com/jdcon31)"

# slug used by the website -> Wikipedia article title
STADIUMS = {
    "old-trafford": "Old Trafford",
    "tottenham-hotspur-stadium": "Tottenham Hotspur Stadium",
    "anfield": "Anfield",
    "etihad-stadium": "City of Manchester Stadium",
    "emirates-stadium": "Emirates Stadium",
    "hill-dickinson-stadium": "Hill Dickinson Stadium",
    "st-james-park": "St James' Park",
    "stadium-of-light": "Stadium of Light",
    "stamford-bridge": "Stamford Bridge (stadium)",
    "elland-road": "Elland Road",
    "villa-park": "Villa Park",
    "coventry-building-society-arena": "Coventry Building Society Arena",
    "amex-stadium": "Falmer Stadium",
    "city-ground": "City Ground",
    "portman-road": "Portman Road",
    "craven-cottage": "Craven Cottage",
    "selhurst-park": "Selhurst Park",
    "mkm-stadium": "MKM Stadium",
    "gtech-community-stadium": "Brentford Community Stadium",
    "vitality-stadium": "Dean Court",
}


def get(url):
    """Fetch a URL. If Wikimedia says we are going too fast (HTTP 429),
    wait and try again, a little longer each time."""
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    for wait in (30, 60, 120, None):
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                return response.read()
        except urllib.error.HTTPError as error:
            if error.code != 429 or wait is None:
                raise
            retry_after = error.headers.get("Retry-After", "")
            wait = int(retry_after) if retry_after.isdigit() else wait
            print("        rate limited, waiting " + str(wait) + "s...", flush=True)
            time.sleep(wait)


def load_existing_credits():
    """Read credits saved by an earlier run so finished photos are kept."""
    try:
        text = CREDITS_FILE.read_text(encoding="utf-8")
        return json.loads(text[text.index("= ") + 2:].rstrip().rstrip(";"))
    except (OSError, ValueError):
        return {}


def api(host, **params):
    params.update(format="json", formatversion="2")
    url = "https://" + host + "/w/api.php?" + urllib.parse.urlencode(params)
    return json.loads(get(url))


def plain_text(value):
    """Commons stores author names as HTML; strip the tags."""
    text = unescape(re.sub(r"<[^>]+>", "", value or ""))
    return re.sub(r"\s+", " ", text).strip() or "Unknown author"


def fetch_one(slug, article):
    # 1. Lead photo of the Wikipedia article
    data = api("en.wikipedia.org", action="query", prop="pageimages",
               piprop="name", redirects="1", titles=article)
    file_name = data["query"]["pages"][0].get("pageimage")
    if not file_name:
        return None, "article has no lead photo"
    if not file_name.lower().endswith((".jpg", ".jpeg")):
        return None, "lead image is not a JPEG (" + file_name + ")"

    # 2. Photo details from Commons (only freely licensed files live there)
    data = api("commons.wikimedia.org", action="query", prop="imageinfo",
               iiprop="url|extmetadata", iiurlwidth="1280",
               titles="File:" + file_name)
    page = data["query"]["pages"][0]
    if "imageinfo" not in page:
        return None, "photo is not on Wikimedia Commons"
    info = page["imageinfo"][0]
    meta = info.get("extmetadata", {})
    license_name = meta.get("LicenseShortName", {}).get("value")
    if not license_name:
        return None, "no license information found"

    # 3. Download the 1280px version
    (IMAGES / (slug + ".jpg")).write_bytes(get(info.get("thumburl") or info["url"]))

    return {
        "title": file_name.replace("_", " "),
        "author": plain_text(meta.get("Artist", {}).get("value")),
        "license": license_name,
        "source": info["descriptionurl"],
    }, None


def main():
    IMAGES.mkdir(exist_ok=True)
    credits = load_existing_credits()
    skipped = []

    for slug, article in STADIUMS.items():
        # Already downloaded on an earlier run: keep it and move on.
        if slug in credits and (IMAGES / (slug + ".jpg")).exists():
            print("have    " + slug + ".jpg")
            continue

        try:
            credit, problem = fetch_one(slug, article)
        except Exception as error:  # network trouble, unexpected response
            credit, problem = None, str(error)

        if credit:
            credits[slug] = credit
            print("saved   " + slug + ".jpg  (" + credit["license"] + ")")
        else:
            skipped.append(slug)
            print("SKIPPED " + slug + ": " + problem)
        time.sleep(5)  # be polite to the Wikimedia servers

    # 4. Write the credits file the About page reads
    CREDITS_FILE.write_text(
        "/* Photo credits for the About page.\n"
        "   This file is rewritten by tools/fetch_images.py. */\n"
        "const IMAGE_CREDITS = " + json.dumps(credits, indent=2, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )

    print("\n" + str(len(credits)) + " of " + str(len(STADIUMS)) + " photos saved.")
    if skipped:
        print("Still missing: " + ", ".join(skipped))
        print("Run the script again in a few minutes to retry just those.")


if __name__ == "__main__":
    main()
