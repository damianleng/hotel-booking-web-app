// Initialize expressJS
const express = require("express");

// Initialize router object
const router = express.Router();

// Initialize booking controller
const roomController = require("../controllers/roomController");

router.get("/attention", roomController.checkAllRoomsStatus);
router.get("/current-rooms", roomController.getCurrentlyAvailableRooms);

// Room Routes
router
  .route("/")
  .get(roomController.getAllRooms)
  .post(roomController.createRoom);



router
  .route("/:id")
  .get(roomController.getRoom)
  .patch(roomController.updateRoom)
  .delete(roomController.deleteRoom);

module.exports = router;
