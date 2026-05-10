require("dotenv").config();
require("./config/db");

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`StockFlow API Server running on port ${PORT}`);
});
