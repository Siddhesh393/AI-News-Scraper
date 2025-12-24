import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const getHeadlines = async (query) => {
  const res = await axios.get(`${API_BASE}/headlines?q=${query}`);
  return res.data;
};

export const getSummary = async (titles) => {
  const res = await axios.post(`${API_BASE}/headlines/summary`, {
    headlines: titles,
  });
  return res.data; // ✅ return full JSON
};
