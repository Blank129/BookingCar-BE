require("dotenv").config();
const app = require("./src/app");
const ngrok = require("ngrok");
const axios = require("axios");
const PORT = process.env.PORT || 5000;
const crypto = require('crypto');
const base64url = require('base64url');

function generateCodeVerifier(length = 43) {
    return base64url(crypto.randomBytes(length));
}

function generateCodeChallenge(codeVerifier) {
    const hash = crypto.createHash('sha256').update(codeVerifier).digest();
    return base64url(hash);
}

const APP_ID = process.env.APP_ID;
const SECRET_KEY = process.env.SECRET_KEY;
const CALLBACK_URL = "https://booking-car-one.vercel.app/login";

let sessions = {};
// Step 1 - Generate login URL
app.get('/zalo/login', (req, res) => {
    const state = Math.random().toString(36).substring(2);
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    // Lưu để dùng khi callback
    sessions[state] = { codeVerifier };

    const zaloAuthUrl = `https://oauth.zaloapp.com/v4/permission?app_id=${APP_ID}&redirect_uri=${CALLBACK_URL}&code_challenge=${codeChallenge}&state=${state}`;
    res.json({ url: zaloAuthUrl });
});

// Step 2 - Callback from Zalo
app.post('/zalo/exchange-token', async (req, res) => {
  const { code, state } = req.body;
  const session = sessions[state];

  if (!session) return res.status(400).json({ error: 'Invalid state' });

  try {
    const response = await axios.post(
      'https://oauth.zaloapp.com/v4/access_token',
      new URLSearchParams({
        app_id: APP_ID,
        code: code,
        grant_type: 'authorization_code',
        code_verifier: session.codeVerifier
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'secret_key': SECRET_KEY
        }
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    res.json({
      access_token,
      refresh_token,
      expires_in
    });
  } catch (error) {
    console.error('Lỗi xác thực access_token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Lỗi xác thực access_token' });
  }
});

app.get('/zalo/me', async (req, res) => {
  const accessToken = req.query.access_token;
  console.log(accessToken);

  if (!accessToken) {
    return res.status(400).json({ error: 'Thiếu access_token' });
  }

  try {
    const zaloRes = await axios.get('https://graph.zalo.me/v2.0/me?fields=id,name,picture', {
      headers: {
        access_token: accessToken
      }
    });

    res.json(zaloRes.data);
  } catch (error) {
    console.error('Lỗi khi gọi Zalo /me:', error.response?.data || error.message);
    res.status(500).json({ error: 'Lỗi khi lấy thông tin người dùng từ Zalo' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  const url = await ngrok.connect(PORT);
  console.log(`Ngrok tunnel opened at: ${url}`);
});
