require("./config/db");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mealRoutes = require("./routes/mealRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/meals", mealRoutes);
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
