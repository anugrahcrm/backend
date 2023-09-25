import express from "express";
import {
  createProcess,
  getAllProcess,
  getProcessById,
  updateprocess,
} from "../controller/processController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createProcess).get(getAllProcess);
router.route("/:id").get(getProcessById).put(updateprocess);

export default router;
