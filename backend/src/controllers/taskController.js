import Task from "../../models/Task.js";

// create a task in a project
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      project: req.params.projectId,
      assignedTo: assignedTo || null,
      priority: priority || "medium",
      dueDate: dueDate || null,
      createdBy: req.user._id,
    });

    await task.populate("assignedTo", "name email");
    await task.populate("createdBy", "name email");

    res.status(201).json({ task });
  } catch (error) {
    console.error("Create task error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// get all tasks for a project (with optional filters)
export const getTasks = async (req, res) => {
  try {
    const { status, assignedTo, priority } = req.query;
    const filter = { project: req.params.projectId };

    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// get a single task
export const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      project: req.params.projectId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ task });
  } catch (error) {
    console.error("Get task error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// update a task
export const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate } =
      req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      project: req.params.projectId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    await task.save();
    await task.populate("assignedTo", "name email");
    await task.populate("createdBy", "name email");

    res.json({ task });
  } catch (error) {
    console.error("Update task error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// delete a task (admin only)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      project: req.params.projectId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
