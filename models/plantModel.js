const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {config} = require("../config/secret");
const { boolean, number } = require("joi");

let plantSchema = new mongoose.Schema({
    name:String,
    img_url:String,
    img_url_preview:String,
    likes:{
        type: Number, default: 0
    },
    comments:String,
    mapLocation:{
        lat: mongoose.Types.Decimal128,
        long: mongoose.Types.Decimal128
    },

    
    // user_id: String,
    user_id: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"users"
    },
  
    date_created:{
      type:Date , default:Date.now()
    },
    // role of the user if regular user or admin
    active:{
      type:Boolean, default:true
    }

  })


  exports.plantModel = mongoose.model("plants", plantSchema);


