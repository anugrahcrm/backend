import express from "express";
import {
  createJewelleryInventory,
  deleteJewelleryInventory,
  deleteMultipleInventory,
  getAllJewelleryInventory,
  getAllJewelleryInventoryById,
  updateJewelleryInventory,
} from "../controller/jewelleryInventoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createJewelleryInventory).get(getAllJewelleryInventory);
router.route("/deleteMany").post(deleteMultipleInventory);
router
  .route("/:id")
  .get(getAllJewelleryInventoryById)
  .put(updateJewelleryInventory)
  .delete(deleteJewelleryInventory);

export default router;
