import { DbConfig } from "../config/index.js";
import { Sequelize, DataTypes } from "sequelize";
import UserModel from "./user.js";


const env = process.env.NODE_ENV || "development";
const config = DbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

const User = UserModel(sequelize, DataTypes);

const db = {
  sequelize,
  Sequelize,
  User,
  post
};

export default db;