# 📰 AI News Digest

An editorial-style news application that fetches top headlines and generates **AI-powered summaries** to explain *what matters* and *why it matters* — inspired by modern news briefings like Axios and Morning Brew.

---

## ✨ Features

- 🧠 **AI-powered summaries**
  - “Today’s Briefing” (what happened)
  - “Why this matters” (context & implications)
- 🗂️ **Category-based browsing**
  - India, World, Business, Tech, Sports
- 📰 **Daily Digest mode**
  - Combined multi-category briefing
- 🔍 **Search any topic**
- 🌙 **Dark mode** (persistent, system-aware)
- ⌨️ **Keyboard-first UX**
  - `/` focus search
  - `j / k` navigate headlines
  - `Enter` open article
- ⚡ **Skeleton loaders** for smooth UX
- 🎨 **Editorial, professional UI** (React + Tailwind)

---

## 🏗️ Tech Stack

### Frontend
- **React** (Vite)
- **Tailwind CSS**
- JavaScript (ES6+)

### Backend
- **Python**
- **FastAPI**
- **Google News RSS**
- **Ollama** (local LLM for summarization)

---

## 📁 Project Structure

```text

News-Scraper/
│
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ │ └── newsApi.js
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── public/
│ ├── index.html
│ ├── package.json
│ ├── tailwind.config.js
│ └── vite.config.js
│
├── backend.py
├── scraping.py
├── summarization.py
├── requirements.txt
├── .gitignore
└── README.md

```

## Website UI Preview

![newsscaper](images/ui.png)
