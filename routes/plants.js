const express= require("express");
const router = express.Router();
const {auth,authAdmin} = require("../middlewares/auth");
const {plantController} = require("../controllers/plantController")


// get all plants - with user to
router.get("/" ,auth, plantController.plantsList)
// return all user's plants
router.get("/userplants/:userId" ,auth, plantController.userPlants)
//return specific plant details
router.get("/single/:plantId" ,auth, plantController.plantDetails)
router.get("/searchByName" ,auth, plantController.searchByName)
router.get("/searchByLocation" ,auth, plantController.searchByLocation)
//get number of all plants
router.get("/count",auth, plantController.countPlants)
router.get("/myPlants" , auth, plantController.myPlants)
//add plant
router.post("/", auth, plantController.addPlant)
router.patch("/changeActive/:plantId", authAdmin, plantController.changeActive)
//edit plant
router.put("/:plantId",auth, plantController.editPlant)
router.delete("/:plantId",auth, plantController.deletePlant)

module.exports = router;