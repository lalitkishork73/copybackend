const express = require("express");
var logger = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");

const { connectDB } = require("./db");
// routers
const apiRouter = require("./routes/api");

const app = express();
// Allow Origins according to your need.
corsOptions = {
  origin: "*",
};

dotenv.config();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

connectDB()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  return res.json({ msg: "Welcome! Its freelance - Backend" });
});
app.use("/api/v1", apiRouter);

// catch 404 and forward to error handler
app.use("*", function (req, res) {
  return res.status(404).json({
    status: 404,
    message: "Bad Request",
  });
});

// error handler middleware
app.use((error, req, res, next) => {
  console.log(error);
  return res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

const server = app.listen(process.env.PORT || 4000, () => {
  console.log(`App running on PORT ${process.env.PORT || 4000}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.SOCKET_ORIGIN,
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData);
    console.log("userData", userData);
    socket.emit("connected");
  });

  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} has joined room ${chatId}`);
    console.log("User Joined Room: " + chatId);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("chat message", (newMessageReceived) => {
    const { chat } = newMessageReceived;
    // console.log(newMessageReceived)
    const { sender, receiver } = newMessageReceived;
    // console.log(chat._id);
    if (!sender || !receiver) {
      console.log("Sender or receiver not defined");
      return;
    }
    const room = chat._id;
    console.log(`Emitting message to room ${room}`);
    socket.to(room).emit("message received", newMessageReceived);
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
