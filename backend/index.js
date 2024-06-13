require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const PORT = process.env.PORT || 3001;
const AuthRoutes = require("./routees/auth");
const UserRoutes = require("./routees/user");
const morgan = require("morgan");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const { injectToken } = require("./middleware/index");
const SOCKET_EVENT = require("./constants/socket");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: '*'
});
const Chats = require('./models/chat');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(express.static('avatar'))
httpServer.listen(PORT, () => {
  console.log("server is up on port:", PORT);
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
app.use(injectToken);

app.use("/api/", AuthRoutes, UserRoutes);
io.on("connection", (socket) => {
  // ...
  socket.on(SOCKET_EVENT.JOIN_ROOM, ({ roomId }) => {
    socket.join(roomId)
  })
  socket.on(SOCKET_EVENT.NEW_MESSAGAE_SEND, async ({
    roomId, user_id, message
  }) => {
    await Chats.findByIdAndUpdate(roomId, {
      $push: {
        messages: {
          user_id,
          message
        }
      }
    })
    io.to(roomId).emit(SOCKET_EVENT.NEW_MESSAGE_RECEIVE, {
      user_id: user_id,
      roomId: roomId
    })
  })
});
