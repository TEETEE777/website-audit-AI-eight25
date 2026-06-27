import requests
from bs4 import BeautifulSoup


def scrape_website(url: str):
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/138.0.0.0 Safari/537.36"
        )
    }

    try:
        response = requests.get(
            url,
            timeout=10,
            headers={
                "User-Agent": "Mozilla/5.0"
            }
        )
    except requests.exceptions.RequestException:
        raise Exception("Website could not be reached")

    response.raise_for_status()

    soup = BeautifulSoup(response.text, "lxml")

    page_title = soup.title.text.lower().strip() if soup.title else ""

    blocked_keywords = [
        "blocked",
        "access denied",
        "captcha",
        "attention required",
        "verify you are human",
    ]

    is_blocked = any(
        keyword in page_title
        for keyword in blocked_keywords
    )

    return {
        "soup": soup,
        "is_blocked": is_blocked,
    }