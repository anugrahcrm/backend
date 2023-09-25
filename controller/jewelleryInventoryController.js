import asyncHandler from "express-async-handler";
import JewelleryInventory from "../models/jewelleryInventoryModel.js";

export const createJewelleryInventory = asyncHandler(async (req, res) => {
  const {
    code,
    name,
    weight,
    karat,
    jartiWaste,
    jartiWeight,
    currencyType,
    rate,
    stonePrice,
    purchasePrice,
    quantity,
    manufacturer,
    makingCharge,
    remarks,
    createdBy,
    editedBy,
    profilePicture,
  } = req.body;

  if (!name || !code || !rate) {
    res.status(400);
    throw new Error("Fill up required fields");
  }

  const codeExists = await JewelleryInventory.findOne({ code }).lean().exec();

  if (codeExists) {
    res.status(400);
    throw new Error("Jewellery code  already exists");
  }

  const created = await JewelleryInventory.create({
    code,
    name,
    weight,
    karat,
    jartiWaste,
    jartiWeight,
    currencyType,
    rate,
    purchasePrice,
    stonePrice,
    quantity,
    manufacturer,
    makingCharge,
    remarks,
    createdBy,
    editedBy,
    profilePicture,
  });

  if (created) {
    res.status(201).json({
      _id: created._id,
      code,
      name,
      weight,
      karat,
      jartiWaste,
      jartiWeight,
      currencyType,
      rate,
      purchasePrice,
      stonePrice,
      quantity,
      manufacturer,
      makingCharge,
      remarks,
      createdBy,
      editedBy,
      profilePicture,
    });
  } else {
    res.status(401);
    throw new Error("Cannot create Jewellery Inventory");
  }
});

export const getAllJewelleryInventory = asyncHandler(async (req, res) => {
  const jewelleryInventory = await JewelleryInventory.find({})
    .sort({ createdAt: -1 })
    .lean();

  if (jewelleryInventory) {
    res.json(jewelleryInventory);
  } else {
    return res.status(400).json({ message: "No jewellery Inventory found" });
  }
});

export const getAllJewelleryInventoryById = asyncHandler(async (req, res) => {
  const jewelleryInventory = await JewelleryInventory.findById(req.params.id);
  if (jewelleryInventory) {
    res.json(jewelleryInventory);
  } else {
    res.status(404);
    throw new Error("Jewellery Inventory not found");
  }
});

export const updateJewelleryInventory = asyncHandler(async (req, res) => {
  const jewelleryInventory = await JewelleryInventory.findById(req.params.id);

  if (jewelleryInventory) {
    jewelleryInventory.name = req.body.name || jewelleryInventory.name;
    jewelleryInventory.code = req.body.code || jewelleryInventory.code;
    jewelleryInventory.weight = req.body.weight || jewelleryInventory.weight;
    jewelleryInventory.karat = req.body.karat || jewelleryInventory.karat;
    jewelleryInventory.stonePrice =
      req.body.stonePrice || jewelleryInventory.stonePrice;
    jewelleryInventory.jartiWaste =
      req.body.jartiWaste || jewelleryInventory.jartiWaste;
    jewelleryInventory.jartiWeight =
      req.body.jartiWeight || jewelleryInventory.jartiWeight;
    jewelleryInventory.currencyType =
      req.body.currencyType || jewelleryInventory.currencyType;
    jewelleryInventory.rate = req.body.rate || jewelleryInventory.rate;
    jewelleryInventory.purchasePrice =
      req.body.purchasePrice || jewelleryInventory.purchasePrice;
    jewelleryInventory.quantity =
      req.body.quantity || jewelleryInventory.quantity;
    jewelleryInventory.makingCharge =
      req.body.makingCharge || jewelleryInventory.makingCharge;
    jewelleryInventory.remarks = req.body.remarks || jewelleryInventory.remarks;
    jewelleryInventory.editedBy =
      req.body.editedBy || jewelleryInventory.editedBy;
    jewelleryInventory.profilePicture =
      req.body.profilePicture || jewelleryInventory.profilePicture;

    const updatedJewelleryInventory = await jewelleryInventory.save();

    res.json({
      _id: updatedJewelleryInventory._id,
      name: updatedJewelleryInventory.name,
      weight: updatedJewelleryInventory.weight,
      karat: updatedJewelleryInventory.karat,
      stonePrice: updatedJewelleryInventory.stonePrice,
      jartiWaste: updatedJewelleryInventory.jartiWaste,
      jartiWeight: updatedJewelleryInventory.jartiWeight,
      currencyType: updatedJewelleryInventory.currencyType,
      rate: updatedJewelleryInventory.rate,
      purchasePrice: updatedJewelleryInventory.purchasePrice,
      quantity: updatedJewelleryInventory.quantity,
      manufacturer: updatedJewelleryInventory.manufacturer,
      makingCharge: updatedJewelleryInventory.makingCharge,
      remarks: updatedJewelleryInventory.remarks,
      editedBy: updatedJewelleryInventory.editedBy,
      profilePicture: updatedJewelleryInventory.profilePicture,
    });
  } else {
    res.status(401);
    throw new Error("Jewellery not found");
  }
});

export const deleteJewelleryInventory = async (req, res) => {
  const { id } = req.params;

  const user = await JewelleryInventory.findById(id).exec();

  if (!user) {
    res.status(400);
    throw new Error("jewellery not found");
  }

  const result = await user.deleteOne();

  const reply = `deleted`;

  res.json(reply);
};
