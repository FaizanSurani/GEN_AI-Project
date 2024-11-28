const express = require("express");
const cors = require("cors");
require("dotenv").config;
const questionRoutes = require("./routes/questionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/", questionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is listeing at ${PORT}`));
