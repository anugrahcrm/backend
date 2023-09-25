import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const createUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    userName,
    password,
    phone,
    profilePicture,
    role,
    gender,
  } = req.body;

  if (!userName || !password || !email || !name || !gender) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const userNameExists = await User.findOne({ userName }).lean().exec();
  if (userNameExists) {
    res.status(400);
    throw new Error("Username already exists");
  }

  const userEmailExists = await User.findOne({ email }).lean().exec();
  if (userEmailExists) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const user = await User.create({
    name,
    email,
    userName,
    password,
    phone: phone || "",
    profilePicture: profilePicture || "",
    role,
    gender,
  });
  if (user) {
    res.status(201);
    res.json({
      _id: user._id,
      name,
      email,
      userName,
      password,
      phone,
      profilePicture,
      role,
      gender,
    });
  } else {
    res.status(401);
    throw new Error("Cannot create user");
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  // const users = await User.find({}).sort({ createdAt: -1 });
  const users = await User.find({ active: true })
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  // If no users
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
});

export const getAllUsersList = asyncHandler(async (req, res) => {
  // const users = await User.find({}).sort({ createdAt: -1 });
  const users = await User.find({ active: true, role: "user" })
    .select("name")
    .sort({ createdAt: -1 })
    .lean();

  if (users) {
    res.json(users);
  } else {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    // user.userName = req.body.userName || user.userName;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;
    user.gender = req.body.gender || user.gender;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      // email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      profilePicture: updatedUser.profilePicture,
      gender: updatedUser.gender,
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  user.password = req.body.password;

  await user.save();

  const reply = `Password changed successfully`;

  res.json(reply);
});
