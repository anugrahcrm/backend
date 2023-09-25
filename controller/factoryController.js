import asyncHandler from "express-async-handler";
import xlsx from "xlsx";
import Factory from "../models/factoryModel.js";

export const createFactory = asyncHandler(async (req, res) => {
  const { name, address, email, contactPerson, phone, landline } = req.body;

  if (!name || !address) {
    res.status(400);
    throw new Error("All fields are required");
  }

  //   const nameExists = await Factory.findOne({ name }).lean().exec();

  //   if (nameExists) {
  //     res.status(400);
  //     throw new Error("Factory  already exists");
  //   }

  const created = await Factory.create({
    name,
    email,
    address,
    contactPerson,
    phone,
    landline: landline || "",
  });

  if (created) {
    res.status(201);
    res.json({
      _id: created._id,
      name,
      email,
      address,
      contactPerson,
      phone,
      landline,
    });
  } else {
    res.status(401);
    throw new Error("Cannot create Factory");
  }
});

export const getAllFactory = asyncHandler(async (req, res) => {
  const factory = await Factory.find({ active: true })
    .sort({ createdAt: -1 })
    .lean();

  // If no factory
  if (factory) {
    res.status(200).json(factory);
  } else {
    return res.status(400).json({ message: "No factory found" });
  }
});

export const getFactoryById = asyncHandler(async (req, res) => {
  const factory = await Factory.findById(req.params.id);
  if (factory) {
    res.json(factory);
  } else {
    res.status(404);
    throw new Error("Factory not found");
  }
});

export const updateFactory = asyncHandler(async (req, res) => {
  const factory = await Factory.findById(req.params.id);

  if (factory) {
    factory.name = req.body.name || factory.name;
    factory.email = req.body.email || factory.email;
    factory.phone = req.body.phone || factory.phone;
    factory.address = req.body.address || factory.address;
    factory.landline = req.body.landline || factory.landline;
    factory.contactPerson = req.body.contactPerson || factory.contactPerson;

    const updatedFactory = await factory.save();

    res.json({
      _id: updatedFactory._id,
      name: updatedFactory.name,
      email: updatedFactory.email,
      phone: updatedFactory.phone,
      address: updatedFactory.address,
      landline: updatedFactory.landline,
      contactPerson: updatedFactory.contactPerson,
    });
  } else {
    res.status(401);
    throw new Error("factory not found");
  }
});

export const getFactoryList = asyncHandler(async (req, res) => {
  const factory = await Factory.find({ active: true }).select("name").lean();
  res.json(factory);
});

export const deleteFactory = async (req, res) => {
  const { id } = req.params;

  // Does the user exist to delete?
  const factory = await Factory.findById(id).exec();

  if (!factory) {
    res.status(400);
    throw new Error("factory not found");
  }

  const result = await factory.deleteOne();

  const reply = `deleted`;

  res.json(reply);
};

export const getFactoryExcel = asyncHandler(async (req, res) => {
  const report = await Factory.find({});

  // console.log(report);

  if (report.length > 0) {
    const transformedData = report.map((item) => ({
      name: item?.name,
      address: item?.address,
      email: item?.email,
      contactPerson: item?.contactPerson,
      phone: item?.phone,
      landline: item?.landline,
    }));

    const worksheet = xlsx.utils.json_to_sheet(transformedData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.status(200).send(excelBuffer);
  } else {
    throw new Error(`No Factory in database`);
  }
});
