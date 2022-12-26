const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {config} = require("../config/secret");

let userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  img_url:{
    type:String, default: "defaultAvatar.png"
  },
  img_url_preview:{
    type:String, default: "defaultAvatar.png"
  },
  date_created:{
    type:Date , default:Date.now()
  },
  role:{
    type:String, default:"user"
  },
  active:{
    type:Boolean, default:true
  }
})

exports.UserModel = mongoose.model("users",userSchema);

exports.createToken = (_id,role) => {
  let token = jwt.sign({_id,role},config.tokenSecret,{expiresIn:"60mins"});
  return token;
}



