const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");
const { boolean, number } = require("joi");

let plantSchema = new mongoose.Schema({
  name: String,
  img_url: String,
  img_url_preview: String,
  description: String,
  likesList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  ],
  likes: {
    type: Number, default: 0
  },
  comments: String,
  mapLocation: {
    lat: mongoose.Types.Decimal128,
    long: mongoose.Types.Decimal128
  },
  location:String,


  // user_id: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },

  date_created: {
    // type: Date, default: Date.now
 type: Date, default: new Date(Date.now() + (3 * 60 * 60 * 1000))
  },
  // role of the user if regular user or admin
  active: {
    type: Boolean, default: true
  }

})


exports.plantModel = mongoose.model("plants", plantSchema);


