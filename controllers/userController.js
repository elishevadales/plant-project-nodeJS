const { UserModel, createToken } = require("../models/userModel");
const { validUser, validLogin, validInfo, validNewPassword } = require("../validations/userValidation")
const bcrypt = require("bcrypt");
const { config } = require("../config/secret");
const fs = require('fs');

exports.userController = {
  routGet: (req, res) => {
    res.json({ msg: "users work - plants project" })
  },

  checkToken: async (req, res) => {
    res.json(req.tokenData);
  },

  signUp: async (req, res) => {
    let validBody = validUser(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let user = new UserModel(req.body);

      user.password = await bcrypt.hash(user.password, 10);

      await user.save();
      user.password = "***";
      res.status(201).json(user);
    }
    catch (err) {
      if (err.code == 11000) {
        return res.status(500).json({ msg: "Email already in system, try log in", code: 11000 })

      }
      console.log(err);
      res.status(500).json({ msg: "err", err })
    }
  },

  myInfo: async (req, res) => {
    try {
      let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
      userInfo.img_url = config.serverAddress + config.originalAvatar + userInfo.img_url
      userInfo.img_url_preview = config.serverAddress + config.previewAvatar + userInfo.img_url_preview
      res.json(userInfo);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },

  userInfo: async (req, res) => {
    try {
      let userId = req.params.userId;
      let userInfo = await UserModel.findOne({ _id: userId }, { password: 0 });
      userInfo.img_url = config.serverAddress + config.originalAvatar + userInfo.img_url
      userInfo.img_url_preview = config.serverAddress + config.previewAvatar + userInfo.img_url_preview
      res.json(userInfo);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },

  usersList: async (req, res) => {
    try {
      let data = await UserModel.find({}, { password: 0 });
      data.map((item,i) => {
        item.img_url = config.serverAddress + config.originalAvatar + item.img_url;
        item.img_url_preview = config.serverAddress + config.previewAvatar +item.img_url_preview;
      })
      res.json({data})
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },

  countUsers: async (req, res) => {
    try {
      // return the number of users
      let count = await UserModel.countDocuments({})
      res.json({ count })
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },

  login: async (req, res) => {
    let validBody = validLogin(req.body);
    if (validBody.error) {

      return res.status(400).json(validBody.error.details);
    }
    try {

      // check if the mail address exist
      let user = await UserModel.findOne({ email: req.body.email })
      if (!user) {
        return res.status(401).json({ msg: "Password or email is worng ,code:1" })
      }
      // check if the password in the body compatible with the password in database
      let authPassword = await bcrypt.compare(req.body.password, user.password);
      if (!authPassword) {
        return res.status(401).json({ msg: "Password or email is worng ,code:2" });
      }
      // if(user.active == false){
      //   return res.status(401).json({ msg: "your account is blocked. Please contact the site administrator" });
      // }

      // create token that includes userID
      let token = createToken(user._id, user.role);
      res.json({ token, role: user.role, active: user.active });
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },


  changeRole: async (req, res) => {
    if (!req.body.role) {
      return res.status(400).json({ msg: "Need to send role in body" });
    }

    try {
      let userID = req.params.userID
      // cannot change admin to user
      if (userID == config.admin_token) {
        return res.status(401).json({ msg: "You cant change superadmin to user" });

      }
      if (req.body.role != "admin" && req.body.role != "user") {
        return res.status(401).json({ msg: "role can be only user/admin" });

      }
      let data = await UserModel.updateOne({ _id: userID }, { role: req.body.role })
      res.json(data);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },

  
  changeActive: async (req, res) => {
    if (!req.body.active && req.body.active != false) {
      return res.status(400).json({ msg: "Need to send active in body" });
    }

    try {
      let userID = req.params.userID
      // admin cannot return to false
      if (userID == config.admin_token) {
        return res.status(401).json({ msg: "You cant block superadmin" });

      }
      let data = await UserModel.updateOne({ _id: userID }, { active: req.body.active })
      res.json(data);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },


  changeMyInfo: async (req, res) => {
    let validBody = validInfo(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }

    try {
      let data = await UserModel.updateOne({ _id: req.tokenData._id },
        //  { $set: { "name": req.body.name, "img_url": req.body.img_url} }
        req.body
      );
      res.json(data);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },

  changePassword: async (req, res) => {
    let validBody = validNewPassword(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {

      let user = await UserModel.findOne({ email: req.body.email });

      //email problem
      if (!user) {
        return res.status(401).json({ msg: "email or password is wrong code:1" })
      }

      //_id problem
      if (user._id != req.tokenData._id) {
        return res.status(401).json({ msg: "email or password is wrong code:2" })
      }
      let authPassword = await bcrypt.compare(req.body.password, user.password);

      //password problem
      if (!authPassword) {
        return res.status(401).json({ msg: "email or password is wrong code:3" })
      }


      user.password = await bcrypt.hash(req.body.newPassword, 10);
      await user.save();
      user.password = "***";
      res.status(201).json("password changed successfully");
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "err", err })
    }
  },

  deleteUser: async (req, res) => {
    try {

      const userId = req.params.userId;

      if (userId === config.admin_token) {
        return res.status(401).json({ msg: "You cant delete superadmin" });

      }
//delete user's avatar from system
      const user = await UserModel.findOne({ _id: userId });

      if (user.img_url != "defaultAvatar.png") {
        fs.unlink("public/images/avatars/" + userId + ".png", async (err) => {
          if (err) {
              console.log(err);
              return res.status(400).json({ msg: "cannot delete original image" });
          }

      })
      fs.unlink("public/images/previewAvatars/" + "preview" + userId + ".png", async (err) => {
          if (err) {
              console.log(err);
              return res.status(400).json({ msg: "cannot delete preview image" });
          }
      })
      }

//delete user from system
      const data = await UserModel.deleteOne({ _id: userId })
      res.json(data);
  
      
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there is an error. try again later", err })
    }
  },

}