import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import auth from "../middlewares/auth.js";
import projectAccess from "../middlewares/projectAccess.js";

// mergeParams lets us access :projectId from the parent router
const router = express.Router({ mergeParams: true });

// all routes require auth + project membership
router.use(auth);
router.use(projectAccess());

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", projectAccess(true), deleteTask);

export default router;
