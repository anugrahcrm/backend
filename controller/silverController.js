import asyncHandler from "express-async-handler";
import Silver from "../models/silverModel.js";

export const createSilver = asyncHandler(async (req, res) => {
  const {
    itemCode,
    name,
    currency,
    weight,
    makingPrice,
    purchasePrice,
    quantity,
    manufacturer,
    remarks,
    profilePicture,
  } = req.body;

  if (!itemCode || !name) {
    res.status(400);
    throw new Error("Fill required fields");
  }

  const silverExists = await Silver.findOne({ itemCode }).lean().exec();

  if (silverExists) {
    res.status(400);
    throw new Error("Silver itemcode already exists");
  }

  const created = Silver.create({
    itemCode,
    name,
    currency,
    weight,
    makingPrice,
    purchasePrice,
    quantity,
    manufacturer,
    remarks,
    profilePicture,
  });

  if (created) {
    res.status(201);
    res.json({
      _id: created._id,
      itemCode,
      name,
      currency,
      weight,
      makingPrice,
      purchasePrice,
      quantity,
      manufacturer,
      remarks,
      profilePicture,
    });
  } else {
    res.status(401);
    throw new Error("Cannot create Silver");
  }
});

export const getAllSilver = asyncHandler(async (req, res) => {
  const silver = await Silver.find({}).sort({ createdAt: -1 }).lean();

  if (silver) {
    res.status(200).json(silver);
  } else {
    return res.status(400).json({ message: "No silver found" });
  }
});

export const getSilverById = asyncHandler(async (req, res) => {
  const silver = await Silver.findById(req.params.id);
  if (silver) {
    res.json(silver);
  } else {
    res.status(404);
    throw new Error("silver not found");
  }
});

export const updateSilver = asyncHandler(async (req, res) => {
  const silver = await Silver.findById(req.params.id);

  if (silver) {
    silver.itemCode = req.body.itemCode;
    silver.name = req.body.name;
    silver.currency = req.body.currency;
    silver.makingPrice = req.body.makingPrice;
    silver.purchasePrice = req.body.purchasePrice;
    silver.weight = req.body.weight;
    silver.quantity = req.body.quantity;
    silver.manufacturer = req.body.manufacturer;
    silver.remarks = req.body.remarks;
    silver.profilePicture = req.body.profilePicture;

    const updateSilver = await silver.save();

    res.json({
      _id: updateSilver._id,
      itemCode: updateSilver.itemCode,
      name: updateSilver.name,
      currency: updateSilver.currency,
      makingPrice: updateSilver.makingPrice,
      purchasePrice: updateSilver.purchasePrice,
      weight: updateSilver.weight,
      quantity: updateSilver.quantity,
      manufacturer: updateSilver.manufacturer,
      remarks: updateSilver.remarks,
      profilePicture: updateSilver.profilePicture,
    });
  } else {
    res.status(401);
    throw new Error("silver not found");
  }
});

export const deleteSilver = async (req, res) => {
  const { id } = req.params;

  const user = await Silver.findById(id).exec();

  if (!user) {
    res.status(400);
    throw new Error("Silver not found");
  }

  const result = await user.deleteOne();

  const reply = `deleted`;

  res.json(reply);
};
