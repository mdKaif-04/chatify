const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Connect to MongoDB
const connectDB = require("./config/connectDB");
const router = require("./routes/index.js")
const cookieParser = require("cookie-parser");
const {app,server} = require('./socket/socket.js')

// const app = express();
app.use(
  cors({
    origin: import.meta.process.env.FRONTEND_URL || 'https://chatify-kf.vercel.app',
    
    credentials: true,
  })
)
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "server is runninnnnnnnng on :" + PORT,
  });
});

// Routes
app.use("/api", router);
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("server is running on :" + PORT);
  });
});
