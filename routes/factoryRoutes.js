import express from "express";
import {
  createFactory,
  deleteFactory,
  getAllFactory,
  getFactoryById,
  getFactoryExcel,
  updateFactory,
} from "../controller/factoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createFactory).get(getAllFactory);
router
  .route("/:id")
  .get(getFactoryById)
  .put(updateFactory)
  .delete(deleteFactory);
router.route("/excel/getFactoryExcel").get(getFactoryExcel);

export default router;
