const express = require("express");
const cors = require("cors");
const http = require('http')
require("dotenv").config();

// Connect to MongoDB
const connectDB = require("./config/connectDB");
const router = require("./routes/index.js");
const cookieParser = require("cookie-parser");
const socketSetup = require("./socket/socket.js");
 const app = express()
 const server = http.createServer(app)
 socketSetup(server);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
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

app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin',process.env.FRONTEND_URL);
  res.header('Access-Control-Allow-Credentials','true');
  res.status(404).json({error:'Not Foundd'})
  
})
app.use((err,req,res,next)=>{
  res.header('Access-Control-Allow-Origin',process.env.FRONTEND_URL);
  res.header('Access-Control-Allow-Credentials','true');
  res.status(err.status || 500).json({error: err.message})
  
})
