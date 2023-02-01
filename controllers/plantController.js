
const { plantModel } = require("../models/plantModel");
const { validatePlant } = require("../validations/plantValidation")
const { config } = require("../config/secret");

exports.plantController = {
  plantsList: async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "date_created";
    let reverse = req.query.reverse == "yes" ? 1 : -1;

    try {
      let data = await plantModel.find({}).populate({ path: "user_id", model: "users" })
        .limit(perPage)
        .skip((page - 1) * perPage)
        // .sort({_id:-1}) like -> order by _id DESC
        .sort({ [sort]: reverse })
      let originalNavigate = config.serverAddress + config.originalPlant;
      let previewNavigate = config.serverAddress + config.previewPlant;
      let originalNavigateAvatar = config.serverAddress + config.originalAvatar;
      let previewNavigateAvatar = config.serverAddress + config.previewAvatar;
      res.json({ data, original: originalNavigate, preview: previewNavigate, originalAvatar: originalNavigateAvatar, previewAvatar: previewNavigateAvatar })
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
    }
  },

  userPlants: async (req, res) => {
    let perPage = req.query.perPage || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "date_created";
    let reverse = req.query.reverse == "yes" ? 1 : -1;

    try {
      let userId = req.params.userId;
      let userPlants = await plantModel.find({ user_id: userId })
        .limit(perPage)
        .skip((page - 1) * perPage)
        // .sort({_id:-1}) like -> order by _id DESC
        .sort({ [sort]: reverse })
      res.json(userPlants);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },

  plantDetails: async (req, res) => {
    try {
      let plantId = req.params.plantId;
      let plantInfo = await plantModel.findOne({ _id: plantId }).populate({ path: "user_id", model: "users" });
      // let userInfo = plantModel.find({});
      // plantInfo. = userInfo;
      res.json(plantInfo);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },

  searchByName: async (req, res) => {
    let perPage = req.query.perPage || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "date_created";
    let reverse = req.query.reverse == "yes" ? 1 : -1;
    try {
      let queryS = req.query.search;
      let searchReg = new RegExp(queryS, "i")

      let plantSearch = await plantModel.find({ name: searchReg })
        .limit(perPage)
        .skip((page - 1) * perPage)
        // .sort({_id:-1}) like -> order by _id DESC
        .sort({ [sort]: reverse })

      res.json(plantSearch);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },

  searchByLocation: async (req, res) => {
    let perPage = req.query.perPage || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "date_created";
    let reverse = req.query.reverse == "yes" ? 1 : -1;
    try {
      let queryS = req.query.search;
      let searchReg = new RegExp(queryS, "i")

      let plantSearch = await plantModel.find({ location: searchReg })
        .limit(perPage)
        .skip((page - 1) * perPage)
        // .sort({_id:-1}) like -> order by _id DESC
        .sort({ [sort]: reverse })

      res.json(plantSearch);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },

  countPlants: async (req, res) => {
    try {
      // .countDocument -> מחזיר את המספר רשומות שקיימים במסד
      let count = await plantModel.countDocuments({})
      res.json({ count });
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
    }
  },

  myPlants: async (req, res) => {
    let perPage = req.query.perPage || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "date_created";
    let reverse = req.query.reverse == "yes" ? 1 : -1;
    try {
      let myPlants = await plantModel.find({ user_id: req.tokenData._id })
        .limit(perPage)
        .skip((page - 1) * perPage)
        // .sort({_id:-1}) like -> order by _id DESC
        .sort({ [sort]: reverse })
      res.json(myPlants);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },

  addPlant: async (req, res) => {
    let validBody = validatePlant(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details)
    }
    try {
      let plant = new plantModel(req.body);
      plant.user_id = req.tokenData._id;
      await plant.save();
      res.json(plant);
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
      let plantId = req.params.plantId
      let data = await plantModel.updateOne({ _id: plantId }, { active: req.body.active })
      res.json(data);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },


  addLike: async (req, res) => {

    try {
      let plantId = req.params.plantId
      let userId = req.tokenData._id;
      let data = await plantModel.updateOne({ _id: plantId }, { $push: { likesList: userId }, $inc: { likes: 1 } });
      doc = await plantModel.findOne({ _id: plantId });

      res.json(doc);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },


  deleteLike: async (req, res) => {
    try {
      let plantId = req.params.plantId
      let userId = req.tokenData._id;
      let data = await plantModel.updateOne({ _id: plantId }, { $pull: { likesList: userId }, $inc: { likes: -1 } });
      doc = await plantModel.findOne({ _id: plantId });
      res.json(doc);
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "err", err })
    }
  },


  editPlant: async (req, res) => {
    let validBody = validatePlant(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let plantId = req.params.plantId;
      let data;
      if (req.tokenData.role == "admin") {
        data = await plantModel.updateOne({ _id: plantId }, req.body)
      }
      else {
        data = await plantModel.updateOne({ _id: plantId, user_id: req.tokenData._id }, req.body)

      }
      res.json(data);

    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
    }
  },

  deletePlant: async (req, res) => {
    try {
      let plantId = req.params.plantId;
      let data;
      if (req.tokenData.role == "admin") {
        data = await plantModel.deleteOne({ _id: plantId })
      }
      else {
        data = await plantModel.deleteOne({ _id: plantId, user_id: req.tokenData._id })

      }
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ msg: "there error try again later", err })
    }
  }




}