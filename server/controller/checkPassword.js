const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

async function checkPassword (req, res) {
  try {
    const { password, userId } = req.body;
    const user = await UserModel.findById(userId);
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      return res.status(400).json({
        message: "Invalid password",
        error: true,
        success: false,
      });
    }
    // Generate JWT token
    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    const cookieOptions = {
        http : true,
        secure : true,
        
    }

    return res.cookie('token',token,cookieOptions).status(200).json({
      message: "Login successfully",
      error: false,
      success: true,
      token : token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = checkPassword
