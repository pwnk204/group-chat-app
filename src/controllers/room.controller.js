import db from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const createRoom = async (req, res) => {
  try {
    const name = req.params.name;
  
    if (!name) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ sucess: false, message: "Please provide room name." });
    }
    
    
    const secretKey = process.env.JWT_SECRET || "super_secret_key";
    const decodedUser = jwt.verify(req.cookies.token, secretKey);
    console.log("decoded inside creatRoom: ", decodedUser);
  
    const userId = decodedUser.userId;
  
    const room = await db.Room.create({
      name,
      isGroup: true,
    });
  
    await room.addUser(userId);

    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "group created successfully",
        data: {groupName: name},
        error: {}
    })
  } catch (error) {

    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
    
  }
};
