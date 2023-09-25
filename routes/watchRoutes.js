import express from "express";
import {
  createWatch,
  deleteWatch,
  getAllWatch,
  getWatchById,
  updateWatch,
} from "../controller/watchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createWatch).get(getAllWatch);
router.route("/:id").get(getWatchById).put(updateWatch).delete(deleteWatch);

export default router;
