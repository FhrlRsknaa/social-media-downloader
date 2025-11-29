const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ==== MASUKKAN API KEY RAPIDAPI DI SINI ====
const RAPID_API_KEY = process.env.RAPID_API_KEY;
// ===========================================

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/download", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL wajib diisi." });
  }

  try {
    const response = await axios({
      method: "POST",
      url: "https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": RAPID_API_KEY,
        "x-rapidapi-host": "social-download-all-in-one.p.rapidapi.com",
      },
      data: {
        url, // link dari input kamu
      },
    });

    // kirim data API langsung ke frontend
    return res.json(response.data);
  } catch (err) {
    console.error("API ERROR STATUS:", err.response?.status);
    console.error("API ERROR DATA:", err.response?.data || err.message);

    const statusCode = err.response?.status || 500;
    const apiMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Gagal menghubungi API.";

    return res.status(statusCode).json({
      error: apiMsg,
      raw: err.response?.data || null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
