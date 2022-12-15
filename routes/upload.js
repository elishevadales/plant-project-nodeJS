const express = require("express");
const path = require("path");
const { auth, authAdmin } = require("../middlewares/auth");
const router = express.Router();
const { UserModel } = require("../models/userModel");
const {config} = require("../config/secret")

router.get("/", auth, (req, res) => {
  res.json({ msg: "Upload work!" })
})





router.post("/avatar", auth, async(req, res) => {
  let myFile = req.files["avatar"];

  if (!myFile) {
    return res.status(400).json({ msg: "You need to send file" });
  }
  if (myFile.size > 1024 * 1024 * 2) {
    return res.status(400).json({ msg: "File too big (max 2mb)" });
  }
  // סיומות שמותר למשתמש לעלות
  let exts_ar = [".png", ".jpg", "jpeg", ".gif"];
  // יכיל את הסיומת של הקובץ ששלחתי לשרת
  let extFileName = path.extname(myFile.name);
  if (!exts_ar.includes(extFileName)) {
    return res.json({ msg: "File ext not allowed , just img file for web !" })
  }
  //no need date for avatar
  let newName = req.tokenData._id + ".png";

  myFile.mv("public/images/avatars/" + newName, async (err) => {
    if (err) {
      console.log(err)
      return res.status(400).json({ msg: "There problem" });
    }

    // update user's img_url in DB
    let updateData = await UserModel.updateOne({ _id: req.tokenData._id }, { img_url: "http://localhost:"+config.defaultPort + "/images/avatars/" + newName })
    res.json({ msg: "File uploaded", status: 200 })
  })
})






router.post("/plant", auth, async (req, res) => {
  let myFile = req.files["plant"];

  if (!myFile) {
    return res.status(400).json({ msg: "You need to send file" });
  }
  if (myFile.size > 1024 * 1024 * 2) {
    return res.status(400).json({ msg: "File too big (max 2mb)" });
  }
  // סיומות שמותר למשתמש לעלות
  let exts_ar = [".png", ".jpg", "jpeg", ".gif"];
  // יכיל את הסיומת של הקובץ ששלחתי לשרת
  let extFileName = path.extname(myFile.name);
  if (!exts_ar.includes(extFileName)) {
    return res.json({ msg: "File ext not allowed , just img file for web !" })
  }

  myFile.mv("public/images/plants/" + req.tokenData._id + Date.now() + ".png", (err) => {
    if (err) {
      console.log(err)
      return res.status(400).json({ msg: "There problem" });
    }
    res.json({ msg: "File uploaded", status: 200 })
  })
})


router.delete("/avatar", auth, async(req, res) => {

})

module.exports = router;