import express from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from "../controllers/projectController.js";
import auth from "../middlewares/auth.js";
import projectAccess from "../middlewares/projectAccess.js";

const router = express.Router();

// all routes require authentication
router.use(auth);

router.post("/", createProject);
router.get("/", getProjects);

// these routes need project membership
router.get("/:id", projectAccess(), getProject);
router.put("/:id", projectAccess(true), updateProject);
router.delete("/:id", projectAccess(true), deleteProject);

// member management (admin only)
router.post("/:id/members", projectAccess(true), addMember);
router.delete("/:id/members/:userId", projectAccess(true), removeMember);

export default router;
