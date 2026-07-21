import express from "express"
import userRouter from "./user.route.js"
import roomRouter from "./room.route.js"

const router = express.Router();

router.use('/user', userRouter);
router.use('/room', roomRouter)

export default router