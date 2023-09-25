import asyncHandler from "express-async-handler";
import xlsx from "xlsx";
import membershipIdCreator from "../helpers/membershipIdCreator.js";
import Customer from "../models/customerModel.js";

export const createCustomer = asyncHandler(async (req, res) => {
  const {
    fullName,
    address,
    email,
    dob,
    phone,
    dateOfMembership,
    profilePicture,
  } = req.body;

  if (!fullName || !address || !phone) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const phoneExists = await Customer.findOne({ phone }).lean().exec();

  if (phoneExists) {
    res.status(400);
    throw new Error("Customer phone number already exists");
  }

  const lastCustomer = await Customer.findOne(
    {},
    {},
    { sort: { createdAt: -1 } }
  );

  let membershipNo = "";

  if (lastCustomer && lastCustomer.membershipNo) {
    const lastMembershipNo = lastCustomer.membershipNo;
    const lastNumber = parseInt(lastMembershipNo.slice(-4), 10);
    const newNumber = lastNumber + 1;
    membershipNo = newNumber.toString().padStart(4, "0");
  } else {
    membershipNo = "0001";
  }

  const created = await Customer.create({
    fullName,
    email,
    address,
    dob,
    phone,
    membershipNo,
    dateOfMembership,
    profilePicture,
  });

  if (created) {
    res.status(201);
    res.json({
      _id: created._id,
      fullName,
      email,
      address,
      dob,
      phone,
      membershipNo,
      dateOfMembership,
      profilePicture,
    });
  } else {
    res.status(401);
    throw new Error("Cannot create Customer");
  }
});

export const getAllCustomer = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ active: true })
    .sort({ createdAt: -1 })
    .lean();

  if (customers) {
    const customersWithPhone = customers.map((customer) => ({
      ...customer,
      nameToShow: `${customer.fullName} - ${customer.phone}`,
    }));

    res.json(customersWithPhone);
  } else {
    return res.status(400).json({ message: "No customer found" });
  }
});

export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (customer) {
    res.json(customer);
  } else {
    res.status(404);
    throw new Error("Customer not found");
  }
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (customer) {
    customer.fullName = req.body.fullName || customer.fullName;
    customer.email = req.body.email || customer.email;
    // customer.phone =  req.body.phone || customer.phone;
    customer.address = req.body.address || customer.address;
    customer.dob = req.body.dob || customer.dob;
    customer.membershipNo = req.body.membershipNo || customer.membershipNo;
    customer.dateOfMembership =
      req.body.dateOfMembership || customer.dateOfMembership;
    customer.profilePicture =
      req.body.profilePicture || customer.profilePicture;

    const updatedCustomer = await customer.save();

    res.json({
      _id: updatedCustomer._id,
      fullName: updatedCustomer.fullName,
      email: updatedCustomer.email,
      // phone: updatedCustomer.phone,
      address: updatedCustomer.address,
      dob: updatedCustomer.dob,
      membershipNo: updatedCustomer.membershipNo,
      dateOfMembership: updatedCustomer.dateOfMembership,
      profilePicture: updatedCustomer.profilePicture,
    });
  } else {
    res.status(401);
    throw new Error("Customer not found");
  }
});

export const getCustomerList = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ active: true })
    .select("fullName phone")
    .sort({ createdAt: -1 })
    .lean();
  if (customers) {
    const customersWithPhone = customers.map((customer) => ({
      ...customer,
      nameToShow: `${customer.fullName} - ${customer.phone}`,
    }));

    res.json(customersWithPhone);
  } else {
    return res.status(400).json({ message: "No customer found" });
  }
});

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  const user = await Customer.findById(id).exec();

  if (!user) {
    res.status(400);
    throw new Error("customer not found");
  }

  await user.deleteOne();

  const reply = `deleted`;

  res.json(reply);
};

//just to update these five fields
export const updateCustomersForBuy = async () => {
  try {
    await Customer.updateMany(
      {},
      {
        $set: {
          boughtWatch: false,
          boughtJewellery: false,
          boughtSilver: false,
          orderedJewellery: false,
          orderedBar: false,
        },
      }
    );
    console.log("Customers updated successfully");
  } catch (error) {
    console.error("Error updating customers:", error);
  }
};

//adding membership number to existing customers
export const createMembership = async () => {
  try {
    const customers = await Customer.find({});

    for (const customer of customers) {
      const membershipNo = membershipIdCreator(10);
      customer.membershipNo = membershipNo;

      const existingCustomer = await Customer.findOne({ membershipNo });
      if (existingCustomer) {
        let isUnique = false;
        while (!isUnique) {
          const newMembershipNo = membershipIdCreator(10);
          const foundCustomer = await Customer.findOne({
            membershipNo: newMembershipNo,
          });
          if (!foundCustomer) {
            customer.membershipNo = newMembershipNo;
            isUnique = true;
          }
        }
      }
    }

    // Save the updated customers
    await Promise.all(customers.map((customer) => customer.save()));

    console.log("Customers updated successfully");
  } catch (error) {
    console.error("Error updating customers:", error);
  }
};

export const getJewelleryBoughtCustomer = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ boughtJewellery: true })
    .sort({ createdAt: -1 })
    .lean();

  if (customers) {
    const customersWithPhone = customers.map((customer) => ({
      ...customer,
      nameToShow: `${customer.fullName} - ${customer.phone}`,
    }));

    res.json(customersWithPhone);
  } else {
    return res.status(400).json({ message: "No customer found" });
  }
});

export const getSilverBoughtCustomer = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ boughtSilver: true })
    .sort({ createdAt: -1 })
    .lean();

  if (customers) {
    const customersWithPhone = customers.map((customer) => ({
      ...customer,
      nameToShow: `${customer.fullName} - ${customer.phone}`,
    }));

    res.json(customersWithPhone);
  } else {
    return res.status(400).json({ message: "No customer found" });
  }
});

export const getWatchBoughtCustomer = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ boughtWatch: true })
    .sort({ createdAt: -1 })
    .lean();

  if (customers) {
    const customersWithPhone = customers.map((customer) => ({
      ...customer,
      nameToShow: `${customer.fullName} - ${customer.phone}`,
    }));

    res.json(customersWithPhone);
  } else {
    return res.status(400).json({ message: "No customer found" });
  }
});

export const getBarBoughtCustomer = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ orderedBar: true })
    .sort({ createdAt: -1 })
    .lean();

  if (customers) {
    const customersWithPhone = customers.map((customer) => ({
      ...customer,
      nameToShow: `${customer.fullName} - ${customer.phone}`,
    }));

    res.json(customersWithPhone);
  } else {
    return res.status(400).json({ message: "No customer found" });
  }
});

export const getJewelleryOrderBoughtCustomer = asyncHandler(
  async (req, res) => {
    const customers = await Customer.find({ orderedJewellery: true })
      .sort({ createdAt: -1 })
      .lean();

    if (customers) {
      const customersWithPhone = customers.map((customer) => ({
        ...customer,
        nameToShow: `${customer.fullName} - ${customer.phone}`,
      }));

      res.json(customersWithPhone);
    } else {
      return res.status(400).json({ message: "No customer found" });
    }
  }
);

export const getCustomerExcel = asyncHandler(async (req, res) => {
  const report = await Customer.find({});

  // console.log(report);

  if (report.length > 0) {
    const transformedData = report.map((item) => ({
      fullName: item?.fullName,
      address: item?.address,
      email: item?.email,
      dob: item?.dob,
      phone: item?.phone,
      membershipNo: item?.membershipNo,
      dateOfMembership: item?.dateOfMembership,
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
    throw new Error(`No Customer in database`);
  }
});
