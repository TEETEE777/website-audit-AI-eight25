from urllib.parse import urlparse


def count_ctas(soup):
    cta_keywords = {
        "buy",
        "shop",
        "contact",
        "learn more",
        "get started",
        "start",
        "sign up",
        "try",
        "download",
        "book",
        "subscribe",
        "join",
        "request",
        "demo",
        "pricing",
    }

    count = 0

    # Count button elements
    count += len(soup.find_all("button"))

    # Count input buttons
    count += len(
        soup.find_all(
            "input",
            attrs={"type": ["button", "submit"]},
        )
    )

    # Count CTA links
    for link in soup.find_all("a"):
        text = link.get_text(strip=True).lower()

        if text and any(keyword in text for keyword in cta_keywords):
            count += 1

    return count


def extract_metrics(soup, url: str):

    text = soup.get_text(separator=" ", strip=True)
    words = text.split()

    # Images
    images = soup.find_all("img")

    missing_alt = 0

    for img in images:
        alt = img.get("alt")

        if not alt or alt.strip() == "":
            missing_alt += 1

    # Links
    parsed = urlparse(url)
    domain = parsed.netloc

    internal_links = 0
    external_links = 0

    for link in soup.find_all("a", href=True):

        href = link["href"]

        if href.startswith("/"):
            internal_links += 1

        elif domain in href:
            internal_links += 1

        elif href.startswith("http"):
            external_links += 1

    # Meta
    meta = (
        soup.find("meta", attrs={"name": "description"})
        or soup.find("meta", attrs={"property": "og:description"})
    )

    meta_description = meta.get("content", "") if meta else ""

    meta_title = soup.title.text.strip() if soup.title else ""

    # Final Metrics
    return {

        "content": {
            "word_count": len(words),
        },

        "seo": {
            "meta_title": meta_title,
            "meta_description": meta_description,
            "h1_count": len(soup.find_all("h1")),
            "h2_count": len(soup.find_all("h2")),
            "h3_count": len(soup.find_all("h3")),
        },

        "images": {
            "image_count": len(images),
            "missing_alt_count": missing_alt,
            "missing_alt_percentage": (
                round((missing_alt / len(images)) * 100, 2)
                if images
                else 0
            ),
        },

        "links": {
            "internal_links": internal_links,
            "external_links": external_links,
            "cta_count": count_ctas(soup),
        },
    }