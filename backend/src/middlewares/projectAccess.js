import Project from "../../models/Project.js";

// checks if user is a member of the project
// if requireAdmin is true, also checks for admin role
const projectAccess = (requireAdmin = false) => {
  return async (req, res, next) => {
    try {
      const projectId = req.params.projectId || req.params.id;

      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const membership = project.members.find(
        (m) => m.user.toString() === req.user._id.toString()
      );

      if (!membership) {
        return res
          .status(403)
          .json({ message: "You are not a member of this project" });
      }

      if (requireAdmin && membership.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Only project admins can do this" });
      }

      req.project = project;
      req.memberRole = membership.role;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  };
};

export default projectAccess;
