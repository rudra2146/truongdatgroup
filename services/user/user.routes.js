const express = require("express");
const { registerUser, updateUser, deleteUser, loginUser,listOfUsers, getUserById,forgotPassword,changePasswordWithOTP } = require('./user.controller');
const router = express.Router();

// /*
// *  Register User
// */

router.post('/register', registerUser);

// /*
//  *  Login User
//  */
router.post('/login', loginUser);

// /*
//  *  Update User
//  */
router.put("/update/:id", updateUser);

router.get('/lists', listOfUsers);



// /*
//  *  Get User By ID
//  */
router.get("/get-User/:id", getUserById);

// /*
//  *  Delete User
//  */
router.delete("/delete/:id", deleteUser);


router.post("/forgot-password", forgotPassword);

router.post('/change-password',changePasswordWithOTP)

module.exports = router;