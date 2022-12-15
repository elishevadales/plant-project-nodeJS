const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth");
const { userController } = require("../controllers/userController");

// const admin_token = "636d613dadbe2e8f08e5d206";

//shows that the router works
router.get("/", userController.routGet)
router.get("/checkToken",auth, userController.checkToken)
// returns user's information by token
router.get("/myInfo", auth, userController.myInfo)
// return any user's details
router.get("/userInfo/:userId", auth, userController.userInfo)
// admin can get users list
router.get("/usersList", authAdmin, userController.usersList)
// returns the number of users
router.get("/count", authAdmin, userController.countUsers)
//add user
router.post("/", userController.signUp);
router.post("/login", userController.login)
//change role to user/admin
router.patch("/changeRole/:userID", authAdmin, userController.changeRole);
router.patch("/changeActive/:userID", authAdmin, userController.changeActive)
// update user's profile (only name or img_url)
router.put("/changeMyInfo", auth, userController.changeMyInfo)
router.patch("/changePassword", auth, userController.changePassword)
router.delete("/:userId", authAdmin, userController.deleteUser)




module.exports = router;