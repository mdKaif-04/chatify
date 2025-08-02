const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");

async function updateUserDetails(req, res) {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetailsFromToken(token);
    const { name, email, password, profile_pic } = req.body;
    const updateUser = await UserModel.updateOne(
      { _id: user._id },
      { name, email, password, profile_pic }
    );
    const userInformation = await UserModel.findById(user._id);
    return res.status(200).json({
        message: "Details updated successfully",
        data: userInformation,
        error: false,
        success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = updateUserDetails;
