import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomer,
  getBarBoughtCustomer,
  getCustomerById,
  getCustomerExcel,
  getJewelleryBoughtCustomer,
  getJewelleryOrderBoughtCustomer,
  getSilverBoughtCustomer,
  getWatchBoughtCustomer,
  updateCustomer,
} from "../controller/customerController.js";
import {
  customerLoyaltyDetails,
  customerLoyaltyPoint,
} from "../controller/loyaltyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createCustomer).get(getAllCustomer);
router
  .route("/:id")
  .get(getCustomerById)
  .put(updateCustomer)
  .delete(deleteCustomer);
router
  .route("/billing/getJewelleryBoughtCustomer")
  .get(getJewelleryBoughtCustomer);
router.route("/billing/getSilverBoughtCustomer").get(getSilverBoughtCustomer);
router.route("/billing/getWatchBoughtCustomer").get(getWatchBoughtCustomer);
router.route("/billing/getBarBoughtCustomer").get(getBarBoughtCustomer);
router
  .route("/billing/getJewelleryOrderBoughtCustomer")
  .get(getJewelleryOrderBoughtCustomer);
router.route("/excel/getCustomerExcel").get(getCustomerExcel);
router.route("/history/:id").get(customerLoyaltyDetails);
router.route("/points/:id").get(customerLoyaltyPoint);
export default router;
