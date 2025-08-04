const express = require("express");
const resgisterUser = require("../controller/registerUser.js");
const checkEmail = require("../controller/checkEmail.js");
const checkPassword = require("../controller/checkPassword.js");
const userDetails = require("../controller/userDetails.js");
const logoutUser = require("../controller/logoutUser.js");
const updateUserDetails = require("../controller/updateUserDetails.js");
const searchUser = require("../controller/searchUser.js");
const router = express.Router();


//  register user details
router.post("/register", resgisterUser);
//  check email
router.post("/email", checkEmail);
//  check password
router.post("/password", checkPassword);
//login user dtails
router.get("/user-details", userDetails);
// logout user
router.get("/logout", logoutUser);
//update user details
router.post("/update-details", updateUserDetails);
//search user
router.post("/search-user", searchUser);


module.exports = router;



module.exports = router;




