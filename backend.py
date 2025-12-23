from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scraping import fetch_headlines
from summarization import summarize_headlines

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/headlines")
def get_headlines(q: str):
    return fetch_headlines(q, limit=10)


@app.post("/headlines/summary")
def headline_summary(payload: dict):
    headlines = payload.get("headlines", [])
    summary = summarize_headlines(headlines)
    return {"summary": summary}
