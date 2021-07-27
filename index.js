const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const cors = require("cors");
const compression = require("compression");

const users = require("./routes/users");
const hostels = require("./routes/hostel");
const cities = require("./routes/cities");
const auth = require("./routes/auth");
const upload = require("./routes/upload");
const messages = require("./routes/messages");
const logs = require("./routes/logs");

const app = express();

const socket = require("socket.io");
const admin = require("./routes/adminAuth");

// check environment variables
if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: 'jwtPrivateKey' is not defined...");
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/hostly";

// connect to the database
mongoose
  .connect(MONGODB_URI, {
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
app.use(compression());
app.get("env") === "development" && app.use(morgan("tiny"));

// requests area
app.use("/api/users/", users);
app.use("/api/hostels/", hostels);
app.use("/api/cities", cities);
app.use("/api/auth", auth);
app.use("/api/upload", upload);
app.use("/api/messages", messages);
app.use("/api/admin", admin);
app.use("/api/logs", logs);

// listen to port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening to port ${port}`));
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client has been connected...", socket.id);
});

global.io = io;
