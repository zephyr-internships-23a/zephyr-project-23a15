require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const AuthRoutes = require("./routees/auth");
const UserRoutes = require("./routees/user");
const morgan = require("morgan");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const { injectToken  } = require("./middleware/index"); 
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(express.static('avatar'))
app.listen(PORT, () => {
  console.log("server is up on port:", PORT);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(injectToken);

app.use("/api/", AuthRoutes, UserRoutes);
