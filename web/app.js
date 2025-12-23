function formatSummary(text) {
    const lines = text
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.startsWith("•"));

    return lines.map(line => {
        // Remove bullet
        const cleaned = line.replace("•", "").trim();

        // Split on **Title**:
        const match = cleaned.match(/\*\*(.*?)\*\*:(.*)/);

        if (match) {
            const title = match[1].trim();
            const body = match[2].trim();

            return `
                <div class="summary-item">
                    <strong>${title}</strong>
                    <p>${body}</p>
                </div>
            `;
        }

        // Fallback (just in case model changes format)
        return `<p>${cleaned}</p>`;
    }).join("");
}

async function fetchNews() {
    const query = document.getElementById("query").value;
    const newsDiv = document.getElementById("news");
    const loader = document.getElementById("loader");

    if (!query.trim()) {
        alert("Please enter a search keyword");
        return;
    }

    newsDiv.innerHTML = "";
    loader.classList.remove("hidden");

    // 1️⃣ Fetch headlines
    const res = await fetch(`http://127.0.0.1:8000/headlines?q=${query}`);
    const headlines = await res.json();

    // 2️⃣ Summarize headlines (titles only)
    const summaryRes = await fetch("http://127.0.0.1:8000/headlines/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            headlines: headlines.map(h => h.title)
        })
    });

    const summaryData = await summaryRes.json();

    // 3️⃣ Render AI summary FIRST
    newsDiv.innerHTML = `
        <h2>📰 AI Summary</h2>
        <div class="summary">
            ${formatSummary(summaryData.summary)}
        </div>

        <h2>Top Headlines</h2>
        <ul>
            ${headlines.map(h => `
                <li>
                    <a href="${h.link}" target="_blank" rel="noopener noreferrer">
                        ${h.title}
                    </a>
                </li>
            `).join("")}
        </ul>
    `;

    loader.classList.add("hidden");
}
