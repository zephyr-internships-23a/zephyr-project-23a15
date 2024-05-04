require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const AuthRoutes = require("./routees/auth");
const morgan = require("morgan");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.listen(PORT, () => {
  console.log("server is up on port:", PORT);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/", AuthRoutes);
