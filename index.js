const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const cors = require("cors");

const users = require("./routes/users");
const hostels = require("./routes/hostel");
const cities = require("./routes/cities");
const auth = require("./routes/auth");
const upload = require("./routes/upload");
const messages = require("./routes/messages");

const app = express();

const socket = require("socket.io");

// check environment variables
if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: 'jwtPrivateKey' is not defined...");
  process.exit(1);
}

// connect to the database
mongoose
  .connect("mongodb://localhost/hostly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((value) => console.log("Connected to DB..."))
  .catch((err) => console.log("Error Connecting to DB..."));

// use static for images
app.use("/images", express.static("public/images"));

// middleware functions
app.use(express.json());
app.use(cors());
app.use(helmet());
app.get("env") === "development" && app.use(morgan("tiny"));

// requests area
app.use("/api/users/", users);
app.use("/api/hostels/", hostels);
app.use("/api/cities", cities);
app.use("/api/auth", auth);
app.use("/api/upload", upload);
app.use("/api/messages", messages);

// listen to port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening to port ${port}`));
const io = socket(server);

io.on("connection", (socket) => {
  console.log("Client has been connected...", socket.id);
});

global.io = io;
