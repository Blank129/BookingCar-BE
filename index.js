require("dotenv").config();
const app = require("./src/app");
const ngrok = require("ngrok");

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  const url = await ngrok.connect(PORT);
  console.log(`Ngrok tunnel opened at: ${url}`);
});
