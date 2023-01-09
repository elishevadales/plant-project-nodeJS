const fs = require('fs');
const sharp = require('sharp');
const path = require("path");
const { UserModel } = require("../models/userModel");
const { config } = require("../config/secret")

exports.uploadController = {

    getUpload: (req, res) => {
        res.json({ msg: "Upload work!" })
    },


    addAvatar: async (req, res) => {
        let myFile = req.files["avatar"];

        if (!myFile) {
            return res.status(400).json({ msg: "You need to send file" });
        }
        if (myFile.size > 1024 * 1024 * 2) {
            return res.status(400).json({ msg: "File too big (max 2mb)" });
        }
        // סיומות שמותר למשתמש לעלות
        let exts_ar = [".png", ".jpeg", ".gif"];
        // יכיל את הסיומת של הקובץ ששלחתי לשרת
        let extFileName = path.extname(myFile.name);
        if (!exts_ar.includes(extFileName)) {
            return res.json({ msg: "File ext not allowed ,  just img file for web : png,jpeg,gif" })
        }
        //no need a date for avatar
        let newName = req.tokenData._id + ".png";
        //where to save the image, which name
        myFile.mv("public/images/avatars/" + newName, async (err) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ msg: "There problem" });
            }


            // update user's img_url in DB
            let updateData = await UserModel.updateOne({ _id: req.tokenData._id }, { img_url: newName })
            // res.json({ msg: "File uploaded", status: 200 })
        })
        
        //save preview image
        try {
            sharp(myFile.data)
                .resize(100)
                .toFile('public/images/previewAvatars/preview' + newName);
            let updateData = await UserModel.updateOne({ _id: req.tokenData._id }, { img_url_preview: "preview" + newName })
            res.json({ msg: "File uploaded", status: 200 })
        }
        catch (err) {
            console.log("resize" + err);
        }

    },


    addPlantImage: async (req, res) => {
        let myFile = req.files["plant"];

        if (!myFile) {
            return res.status(400).json({ msg: "You need to send file" });
        }
        if (myFile.size > 1024 * 1024 * 2) {
            return res.status(400).json({ msg: "File too big (max 2mb)" });
        }
        // סיומות שמותר למשתמש לעלות
        let exts_ar = [".png", ".jpeg", ".gif"];
        // יכיל את הסיומת של הקובץ ששלחתי לשרת
        let extFileName = path.extname(myFile.name);
        if (!exts_ar.includes(extFileName)) {
            return res.json({ msg: "File ext not allowed , just img file for web : png,jpeg,gif" })
        }
        //where to save the image, which name
        myFile.mv("public/images/plants/" + req.tokenData._id + Date.now() + ".png", (err) => {
            if (err) {
                console.log(err)
                return res.status(400).json({ msg: "There problem" });
            }
            res.json({ msg: "File uploaded", status: 200 })
        })
    },


    deleteAvatar: async (req, res) => {

        let user = await UserModel.findOne({ _id: req.tokenData._id });

        if (user.img_url == "defaultAvatar.png") {
            return res.status(400).json({ msg: "you don't have a profile image" });
        }

        fs.unlink("public/images/avatars/" + req.tokenData._id + ".png", async (err) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ msg: "cannot delete original image" });
            }

        })
        fs.unlink("public/images/previewAvatars/" + "preview" + req.tokenData._id + ".png", async (err) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ msg: "cannot delete preview image" });
            }
            let updateData = await UserModel.updateOne({ _id: req.tokenData._id }, { img_url: "defaultAvatar.png", img_url_preview: "defaultAvatar.png" })
            res.json({ msg: "File deleted", status: 200 })
        })
            ;
    }
}