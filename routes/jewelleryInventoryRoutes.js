import express from "express";
import {
  createJewelleryInventory,
  deleteJewelleryInventory,
  getAllJewelleryInventory,
  getAllJewelleryInventoryById,
  updateJewelleryInventory,
} from "../controller/jewelleryInventoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createJewelleryInventory).get(getAllJewelleryInventory);
router
  .route("/:id")
  .get(getAllJewelleryInventoryById)
  .put(updateJewelleryInventory)
  .delete(deleteJewelleryInventory);

export default router;
