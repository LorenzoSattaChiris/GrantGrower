// chatgpt.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY;


module.exports = router;