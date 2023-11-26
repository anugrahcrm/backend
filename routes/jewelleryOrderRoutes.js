import express from "express";
import {
  cancelJewelleryOrder,
  createJewelleryOrder,
  deleteJewelleryOrder,
  getAllJewelleryOrders,
  getJewelleryOrderById,
  getJewelleryOrderEditedById,
  updateJewelleryOrder,
} from "../controller/jewelleryOrderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createJewelleryOrder).get(getAllJewelleryOrders);
router
  .route("/:id")
  .get(getJewelleryOrderById)
  .put(updateJewelleryOrder)
  .delete(deleteJewelleryOrder);
router.route("/:id/cancel").post(cancelJewelleryOrder);
router.route("/:id/edited").get(getJewelleryOrderEditedById);

export default router;
