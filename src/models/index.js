import { DbConfig } from "../config/index.js";
import { Sequelize, DataTypes } from "sequelize";
import UserModel from "./user.js";
import MessageModel from "./message.js";
import RoomModel from "./room.js";
import UserRoomModel from "./userroom.js"


const env = process.env.NODE_ENV || "development";
const config = DbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

const User = UserModel(sequelize, DataTypes);
const Message = MessageModel(sequelize, DataTypes);
const Room = RoomModel(sequelize, DataTypes);
const UserRoom = UserRoomModel(sequelize, DataTypes);



const db = {
  sequelize,
  Sequelize,
  User,
  Message,
  Room,
  UserRoom,
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;