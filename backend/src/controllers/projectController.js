import Project from "../../models/Project.js";
import Task from "../../models/Task.js";
import User from "../../models/User.js";

// create a new project
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description?.trim() || "",
      owner: req.user._id,
      members: [{ user: req.user._id, role: "admin" }],
    });

    await project.populate("members.user", "name email");

    res.status(201).json({ project });
  } catch (error) {
    console.error("Create project error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// get all projects the user belongs to
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      "members.user": req.user._id,
    })
      .populate("members.user", "name email")
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    // get task counts for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const taskCounts = await Task.aggregate([
          { $match: { project: project._id } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const counts = { todo: 0, in_progress: 0, done: 0 };
        taskCounts.forEach((t) => {
          counts[t._id] = t.count;
        });

        return {
          ...project.toObject(),
          taskCounts: counts,
          totalTasks: counts.todo + counts.in_progress + counts.done,
        };
      })
    );

    res.json({ projects: projectsWithCounts });
  } catch (error) {
    console.error("Get projects error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// get a single project by id
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members.user", "name email")
      .populate("owner", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ project });
  } catch (error) {
    console.error("Get project error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// update project details (admin only)
export const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (name) project.name = name.trim();
    if (description !== undefined) project.description = description.trim();

    await project.save();
    await project.populate("members.user", "name email");

    res.json({ project });
  } catch (error) {
    console.error("Update project error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// delete project and all its tasks (admin only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(project._id);

    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Delete project error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// add a member to the project (admin only)
export const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with that email" });
    }

    const project = await Project.findById(req.params.id);
    const alreadyMember = project.members.some(
      (m) => m.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of this project" });
    }

    project.members.push({
      user: user._id,
      role: role || "member",
    });

    await project.save();
    await project.populate("members.user", "name email");

    res.json({ project });
  } catch (error) {
    console.error("Add member error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// remove a member from the project (admin only)
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const project = await Project.findById(req.params.id);

    // can't remove the owner
    if (project.owner.toString() === userId) {
      return res
        .status(400)
        .json({ message: "Cannot remove the project owner" });
    }

    const memberIndex = project.members.findIndex(
      (m) => m.user.toString() === userId
    );

    if (memberIndex === -1) {
      return res.status(404).json({ message: "User is not a member" });
    }

    project.members.splice(memberIndex, 1);
    await project.save();
    await project.populate("members.user", "name email");

    // also unassign any tasks assigned to this user in this project
    await Task.updateMany(
      { project: project._id, assignedTo: userId },
      { assignedTo: null }
    );

    res.json({ project });
  } catch (error) {
    console.error("Remove member error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
