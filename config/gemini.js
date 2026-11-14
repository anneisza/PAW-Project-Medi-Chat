// config/gemini.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gunakan gemini-3.6-flash (atau gemini-3.8-flash) yang terbaru
const GEMINI_MODEL = (process.env.GEMINI_MODEL || 'gemini-3.6-flash').trim();

const GEMINI_TIMEOUT_MS = 20000;

const apiKey = (process.env.GEMINI_API_KEY || '').trim();

let genAI = null;
if (!apiKey) {
  console.warn('[gemini] PERINGATAN: GEMINI_API_KEY kosong.');
} else {
  genAI = new GoogleGenerativeAI(apiKey);
}

module.exports = { genAI, GEMINI_MODEL, GEMINI_TIMEOUT_MS };