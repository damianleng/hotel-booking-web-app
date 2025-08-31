// Initialize expressJS
const express = require("express");
const { cache, store } = require("../middleware/cache");

// Initialize router object
const router = express.Router();

// Initialize booking controller
const roomController = require("../controllers/roomController");

router.get("/attention", roomController.checkAllRoomsStatus);
// router.get("/current-rooms", roomController.getCurrentlyAvailableRooms);

// GET /current-rooms → cache based on query params
router.get(
  "/current-rooms",
  cache(
    300,
    (req) =>
      `current:${req.query.checkin || "today"}:${req.query.guests || "all"}`
  ),
  async (req, res, next) => {
    await roomController.getCurrentlyAvailableRooms(req, res, next);
    if (res.locals._payload) {
      await store(req, res, res.locals._payload);
    }
  }
);

// GET /rooms → cache the full room list
router.get(
  "/",
  cache(300, () => "rooms:all"),
  async (req, res, next) => {
    await roomController.getAllRooms(req, res, next);
    if (res.locals._payload) {
      await store(req, res, res.locals._payload);
    }
  }
);

router
  .route("/:id")
  .get(roomController.getRoom)
  .patch(roomController.updateRoom)
  .delete(roomController.deleteRoom);

router.post("/", roomController.createRoom);

module.exports = router;
