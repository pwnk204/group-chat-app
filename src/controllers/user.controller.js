import { StatusCodes } from "http-status-codes";
import db from "../models/index.cjs";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { response } from "express";
import { error } from "console";

console.log("db: ", db);
const {User, sequelize} = db;

const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  console.log("User registration initiated", { email });

  if (!name || !email || !password || !phone) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ sucess: false, message: "Please provide all required fields." });
  }

  try {
    const userExist = await User.findOne({ where: { email: email } });

    if (userExist) {
      console.warn("Registration blocked: Email already exists", {
        email,
      });
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ sucess: false, message: "User already exists." });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const newUser = await sequelize.transaction(async (t) => {
      const user = await User.create(
        {
          name,
          email,
          password: hash,
          phone,
          verificationToken: token,
          verificationTokenExpiry: tokenExpiry,
        },
        { transaction: t },
      );
      return user;
    });

    console.log("User inserted into database successfully", {
      userId: newUser.id,
      email: newUser.email,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message:
        "Account created successfully. Please check your email to verify your account.",
      data: response,
      error: {},
    });
  } catch (error) {
    console.error("Error during user registration", {
      error: error.message,
      stack: error.stack,
    });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: "false",
      message: "Something went wrong while registering user",
      data: {},
      error: error,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt", { email: userEmail });

  if (!password || !email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ sucess: false, message: "Please provide all fields." });
  }

  try {
    const userExist = await User.findOne({ where: { email: email } });

    if (!userExist) {
      console.log("Login failed: Email not found", { email });

      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ sucess: false, message: "Invalid email or password." });
    }

    const passwordIsMatch = await bcrypt.compare(password, userExist.password);

    if (!passwordIsMatch) {
      console.log("Login failed: Incorrect password", { email });

      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ sucess: false, message: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: userExist.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const oneDay = 24 * 60 * 60 * 1000;

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: oneDay,
    };

    res.cookie("token", token, cookieOptions);

    console.log("User logged in successfully", { userId: userExist.id });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful.",
      token,
      data: response,
      error: {}
    });
  } catch (error) {
    console.log("Critical error during login process", {
      error: error.message,
      stack: error.stack,
    });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "error during login.",
      data: {},
      error: error
    });
  }
};

export {
    registerUser,
    login
}
