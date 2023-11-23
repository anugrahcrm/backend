import express from "express";
import {
  createSilver,
  deleteMultipleSilver,
  deleteSilver,
  getAllSilver,
  getSilverById,
  updateSilver,
} from "../controller/silverController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createSilver).get(getAllSilver);
router.route("/deleteMany").post(deleteMultipleSilver);
router.route("/:id").get(getSilverById).put(updateSilver).delete(deleteSilver);

export default router;
