const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
require("dotenv").config();
// console.log(process.env.HARPERDB_URL);
const leaveRoom = require("./utils/leave-room");
const { sendMessage } = require("./services/sendMessage");
const mongoose = require("mongoose");
const { getAllMessages } = require("./services/receiveMessage");
const indexRouter = require("./routes/index");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

indexRouter.initialize(app);
mongoose.connect(
  "mongodb+srv://sneh:8OJTHF21JzjABS1J@cluster0.vo5l0x6.mongodb.net/chat-app",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected!");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const CHAT_BOT = "ChatBot";
let chatRoom = ""; // E.g. javascript, node,...
let allUsers = [];

io.on("connection", (socket) => {
  // console.log(`User connected ${socket.id}`);

  // socket.on("pageRefresh", (data) => {
  //   const { username, room } = data;
  //   allUsers = leaveRoom(socket.id, allUsers);
  //   socket.join(room); // Join the user to a socket room

  //   getAllMessages(room)
  //     .then((last100Messages) => {
  //       socket.emit("last_100_messages", JSON.stringify(last100Messages));
  //     })
  //     .catch((err) => console.log(err));
  //   chatRoom = room;
  //   allUsers.push({ id: socket.id, username, room });
  //   chatRoomUsers = allUsers.filter((user) => user.room === room);
  //   socket.to(room).emit("chatroom_users", chatRoomUsers);
  //   socket.emit("chatroom_users", chatRoomUsers);
  // });

  socket.on("join_room", async (data) => {
    const { fullname, room } = data; // Data sent from client when join_room event emitted
    socket.join(room.group_name); // Join the user to a socket room
    // getAllMessages(room);
    let __createdtime__ = Date.now();
    // socket.to(room.group_name).emit("receive_message", {
    //   message: `${fullname} has joined the chat room`,
    //   username: CHAT_BOT,
    //   __createdtime__,
    // });
    getAllMessages(room)
      .then((last100Messages) => {
        socket.emit("last_100_messages", last100Messages);
      })
      .catch((err) => console.log(err));
    // socket.emit("receive_message", {
    //   message: `Welcome ${fullname}`,
    //   username: CHAT_BOT,
    //   __createdtime__,
    // });
    chatRoom = room.group_name;
    allUsers.push({ id: socket.id, fullname, room: room.group_name });
    chatRoomUsers = allUsers.filter((user) => {
      return user.room === room.group_name;
    });
    socket.to(room.group_name).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected from the chat");
    const user = allUsers.find((user) => user.id == socket.id);
    if (user?.username) {
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(chatRoom).emit("chatroom_users", allUsers);
      // socket.to(chatRoom).emit("receive_message", {
      //   message: `${user.username} has disconnected from the chat.`,
      // });
    }
  });

  socket.on("typing", (data) => {
    const { username, room } = data || {};
    io.in(room).emit("user_is_typing", { username });
  });

  socket.on("send_message", (data) => {
    const { message, fullname, room } = data;
    const { created_by } = room || {};
    io.in(room.group_name).emit("receive_message", data);
    sendMessage({ message, sent_by: fullname || created_by, room });
  });

  socket.on("leave_room", (data) => {
    const { username, room } = data;
    socket.leave(room);
    const __createdtime__ = Date.now();
    // Remove user from memory
    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit("chatroom_users", allUsers);
    socket.to(room).emit("receive_message", {
      username: CHAT_BOT,
      message: `${username} has left the chat`,
      __createdtime__,
    });
    // console.log(`${username} has left the chat`);
  });
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

server.listen(4000, () => console.log("Server is running on port 4000"));
