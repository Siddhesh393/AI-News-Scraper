import requests
from bs4 import BeautifulSoup
import pandas as pd
import base64
import re
from urllib.parse import quote


def fetch_headlines(keyword, limit=10):
    encoded = quote(keyword)
    url = f"https://news.google.com/rss/search?q={encoded}&hl=en-IN&gl=IN&ceid=IN:en"

    response = requests.get(url, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, "xml")

    headlines = []
    for item in soup.find_all("item")[:limit]:
        headlines.append({
            "title": item.title.text,
            "link": item.link.text
        })

    return headlines



if __name__ == "__main__":
    keyword = input("Enter keyword to search news: ")
    df = scrape_news(keyword, max_articles=15)

    print("\nLatest News:\n")
    print(df)

    # Save to CSV
    df.to_csv(f"{keyword}_news.csv", index=False)
    print(f"\nSaved to {keyword}_news.csv")