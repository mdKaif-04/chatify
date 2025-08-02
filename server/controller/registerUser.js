const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");

async function resgisterUser(req, res) {
  try {
    const { name, email, password, profile_pic } = req.body;
    const checkEmail = await UserModel.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({
        message: "Email already exists",
        error: true,
        success: false,
      });
    }
    //  password into hash for security
    const salt = await bcrypt.genSalt(10); // salt generation for security purposes
    const hashedPassword = await bcrypt.hash(password, salt);
    const payload = {
      name,
      email,
      password: hashedPassword,
      profile_pic,
    };

    const user = new UserModel(payload)
    const userSave = await user.save()
    // sending user data to client side
    return res.status(201).json({
      message: "User registered successfully",
      data : userSave,
      error: false,
      success: true,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
 module.exports = resgisterUser