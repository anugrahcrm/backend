import asyncHandler from "express-async-handler";
import Watch from "../models/watchModel.js";

export const createWatch = asyncHandler(async (req, res) => {
  const {
    modelNo,
    name,
    currency,
    price,
    quantity,
    manufacturer,
    remarks,
    profilePicture,
    color,
  } = req.body;

  if (!modelNo || !name) {
    res.status(400);
    throw new Error("Fill required fields");
  }

  const watchExists = await Watch.findOne({ modelNo }).lean().exec();

  if (watchExists) {
    res.status(400);
    throw new Error("Watch model already exists");
  }

  const created = await Watch.create({
    modelNo,
    name,
    currency,
    price,
    quantity,
    manufacturer,
    remarks,
    profilePicture,
    color,
  });

  if (created) {
    res.status(201);
    res.json({
      _id: created._id,
      modelNo,
      name,
      currency,
      price,
      quantity,
      manufacturer,
      remarks,
      profilePicture,
      color,
    });
  } else {
    res.status(401);
    throw new Error("Cannot create Watch");
  }
});

export const getAllWatch = asyncHandler(async (req, res) => {
  const watch = await Watch.find({}).sort({ createdAt: -1 }).lean();

  if (watch) {
    res.status(200).json(watch);
  } else {
    return res.status(400).json({ message: "No watch found" });
  }
});

export const getWatchById = asyncHandler(async (req, res) => {
  const watch = await Watch.findById(req.params.id);
  if (watch) {
    res.json(watch);
  } else {
    res.status(404);
    throw new Error("watch not found");
  }
});

export const updateWatch = asyncHandler(async (req, res) => {
  const watch = await Watch.findById(req.params.id);

  if (watch) {
    watch.modelNo = req.body.modelNo;
    watch.name = req.body.name;
    watch.currency = req.body.currency;
    watch.price = req.body.price;
    watch.quantity = req.body.quantity;
    watch.manufacturer = req.body.manufacturer;
    watch.remarks = req.body.remarks;
    watch.profilePicture = req.body.profilePicture;
    watch.color = req.body.color;

    const updatedwatch = await watch.save();

    res.json({
      _id: updatedwatch._id,
      modelNo: updatedwatch.modelNo,
      name: updatedwatch.name,
      currency: updatedwatch.currency,
      price: updatedwatch.price,
      quantity: updatedwatch.quantity,
      manufacturer: updatedwatch.manufacturer,
      remarks: updatedwatch.remarks,
      profilePicture: updatedwatch.profilePicture,
      color: updatedwatch.color,
    });
  } else {
    res.status(401);
    throw new Error("watch not found");
  }
});

export const deleteWatch = async (req, res) => {
  const { id } = req.params;

  const user = await Watch.findById(id).exec();

  if (!user) {
    res.status(400);
    throw new Error("watch not found");
  }

  const result = await user.deleteOne();

  const reply = `deleted`;

  res.json(reply);
};

export const deleteMultipleWatches = asyncHandler(async (req, res) => {
  const  ids  = req.body;

  const result = await Watch.deleteMany({ _id: { $in: [...ids] } });

  if (result.deletedCount > 0) {
    res.json({ message: `${result.deletedCount} Watch deleted successfully` });
  } else {
    res.status(404).json({ message: 'No Watch found with the provided IDs' });
  }
});

export const getWatchReport = async (req, res) => {
  const { id } = req.params;

  const user = await Watch.findById(id).exec();

  if (!user) {
    res.status(400);
    throw new Error("watch not found");
  }

  const result = await user.deleteOne();

  const reply = `deleted`;

  res.json(reply);
};
