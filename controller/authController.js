import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../helpers/generateToken.js";

export const authUser = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  const user = await User.findOne({ userName, active: true });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      fullName: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});
