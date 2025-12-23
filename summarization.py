import ollama


def summarize_headlines(headlines, model="llama3.1"):
    if not headlines:
        return "No headlines found."

    joined = "\n".join(f"- {h}" for h in headlines)

    prompt = f"""
You are a news analyst.

Given the following headlines, produce a concise summary in 4–6 bullet points.
Focus on key themes and major developments.

Headlines:
{joined}
"""

    response = ollama.chat(
        model=model,
        messages=[{"role": "user", "content": prompt}]
    )

    return response["message"]["content"]
