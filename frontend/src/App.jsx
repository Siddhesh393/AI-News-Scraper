import { useEffect, useRef, useState } from "react";
import { getHeadlines, getSummary } from "./api/newsApi";

const CATEGORIES = [
  { label: "India", query: "India" },
  { label: "World", query: "World news" },
  { label: "Business", query: "Business economy" },
  { label: "Tech", query: "Technology" },
  { label: "Sports", query: "Sports" },
];

export default function App() {
  const inputRef = useRef(null);
  const listRef = useRef([]);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [lastSearch, setLastSearch] = useState(null); // ✅ NEW
  const [summary, setSummary] = useState(null);
  const [mode, setMode] = useState("brief"); // brief | why
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  /* ---------- DARK MODE ---------- */
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* ---------- KEYBOARD UX ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
      }
      if (e.key === "j") {
        setSelectedIndex((i) => Math.min(i + 1, headlines.length - 1));
      }
      if (e.key === "k") {
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && headlines[selectedIndex]) {
        window.open(headlines[selectedIndex].link, "_blank");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [headlines, selectedIndex]);

  /* ---------- FETCH ---------- */
  const fetchNews = async (search, why = false) => {
    if (!search.trim()) return;

    setLoading(true);
    setSummary(null);
    setHeadlines([]);
    setSelectedIndex(0);
    setLastSearch(search); // ✅ remember last search

    const data = await getHeadlines(search);
    setHeadlines(data);

    const titles = data.map((h) => h.title);
    const summaryData = await getSummary(
      titles.map((t) => (why ? `Why it matters: ${t}` : t))
    );

    setSummary(summaryData);
    setLoading(false);
  };

  /* ---------- RE-RUN WHEN MODE CHANGES ---------- */
  useEffect(() => {
    if (lastSearch) {
      fetchNews(lastSearch, mode === "why");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const dailyDigest = async () => {
    setLoading(true);
    setSummary(null);
    setHeadlines([]);
    setActiveCategory("Daily Digest");
    setLastSearch("Daily Digest");

    const queries = ["India", "World news", "Business economy"];
    let allTitles = [];

    for (const q of queries) {
      const data = await getHeadlines(q);
      allTitles.push(...data.map((d) => d.title));
    }

    const summaryData = await getSummary(
      allTitles.map((t) =>
        mode === "why" ? `Why it matters: ${t}` : t
      )
    );

    setSummary(summaryData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* HEADER */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl">AI News Digest</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Editorial briefings from today’s headlines
            </p>
          </div>

          <button
            onClick={() => setDarkMode((v) => !v)}
            className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </header>

        {/* CATEGORY TABS */}
        <nav className="flex gap-2 mb-4 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => {
                setActiveCategory(cat.label);
                fetchNews(cat.query, mode === "why");
              }}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                activeCategory === cat.label
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              }`}
            >
              {cat.label}
            </button>
          ))}

          <button
            onClick={dailyDigest}
            className="px-4 py-2 rounded-full text-sm border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          >
            Today’s Digest
          </button>
        </nav>

        {/* SEARCH */}
        <div className="flex gap-2 mb-8">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && fetchNews(query, mode === "why")
            }
            placeholder="Find coverage (press / to focus)"
            className="flex-1 px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring"
          />
          <button
            onClick={() => fetchNews(query, mode === "why")}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* MODE TOGGLE */}
        {summary && (
          <div className="flex gap-4 mb-4 text-sm">
            <button
              onClick={() => setMode("brief")}
              className={mode === "brief" ? "font-semibold" : "text-gray-500"}
            >
              Brief
            </button>
            <button
              onClick={() => setMode("why")}
              className={mode === "why" ? "font-semibold" : "text-gray-500"}
            >
              Why this matters
            </button>
          </div>
        )}

        {/* SKELETON */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
          </div>
        )}

        {/* SUMMARY */}
        {summary && (
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-10">
            <div className="flex justify-between mb-2">
              <h2 className="font-serif text-xl">Today’s Briefing</h2>
              <span className="text-xs text-gray-500">
                Based on {summary.meta.sources} headlines •{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {mode === "why"
                ? "Here’s why today’s developments matter."
                : "Here’s what matters today, based on the latest reporting."}
            </p>

            {summary.points.map((p, i) => (
              <div key={i} className="mb-4 pb-4 border-b last:border-0">
                <strong className="block mb-1">{p.title}</strong>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {p.summary}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* HEADLINES */}
        {headlines.length > 0 && (
          <section>
            <h2 className="font-serif text-xl mb-3">
              Reporting from the field
            </h2>
            <ul className="space-y-3">
              {headlines.map((h, i) => (
                <li
                  key={i}
                  ref={(el) => (listRef.current[i] = el)}
                  className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow ${
                    i === selectedIndex ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <a
                    href={h.link}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {h.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
