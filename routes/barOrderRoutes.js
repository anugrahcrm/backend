import express from "express";

import {
  cancelBarOrder,
  createBarOrder,
  deleteBarOrder,
  getAllBarOrders,
  getBarOrderById,
  getBarOrderEditedById,
  updateBarOrder,
} from "../controller/barOrderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createBarOrder).get(getAllBarOrders);
router
  .route("/:id")
  .get(getBarOrderById)
  .put(updateBarOrder)
  .delete(deleteBarOrder);
router.route("/:id/cancel").post(cancelBarOrder);
router.route("/:id/edited").get(getBarOrderEditedById);

export default router;
