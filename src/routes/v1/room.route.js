import express from "express";
import { RoomController } from "../../controllers/index.js";

const router = express.Router();

router.post(
  '/:name',
  RoomController.createRoom
);


export default router;
