import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../../models/User.js";
import Project from "../../models/Project.js";
import Task from "../../models/Task.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log("Cleared existing data.");

    // Create Users
    const users = await User.create([
      { name: "Alice Smith", email: "alice@example.com", password: "password123" },
      { name: "Bob Johnson", email: "bob@example.com", password: "password123" },
      { name: "Charlie Brown", email: "charlie@example.com", password: "password123" },
      { name: "David Wilson", email: "david@example.com", password: "password123" },
      { name: "Eve Davis", email: "eve@example.com", password: "password123" },
      { name: "Frank Miller", email: "frank@example.com", password: "password123" },
    ]);
    console.log("Created 6 users.");

    // Create Projects
    const project1 = await Project.create({
      name: "Marketing Campaign Q3",
      description: "Planning and execution for the Q3 product push.",
      owner: users[0]._id,
      members: [
        { user: users[0]._id, role: "admin" },
        { user: users[1]._id, role: "member" },
        { user: users[2]._id, role: "member" },
      ],
    });

    const project2 = await Project.create({
      name: "Product Launch: TaskFlow v2",
      description: "Developing the next major version of our task manager.",
      owner: users[1]._id,
      members: [
        { user: users[1]._id, role: "admin" },
        { user: users[2]._id, role: "admin" },
        { user: users[3]._id, role: "member" },
        { user: users[4]._id, role: "member" },
      ],
    });

    const project3 = await Project.create({
      name: "Security Audit",
      description: "Quarterly security review and patching.",
      owner: users[4]._id,
      members: [
        { user: users[4]._id, role: "admin" },
        { user: users[5]._id, role: "member" },
      ],
    });
    console.log("Created 3 projects.");

    // Create Tasks
    await Task.create([
      // Project 1 tasks
      {
        title: "Finalize social media assets",
        description: "Need designs for Instagram and LinkedIn.",
        project: project1._id,
        assignedTo: users[2]._id,
        status: "in_progress",
        priority: "high",
        dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
        createdBy: users[0]._id,
      },
      {
        title: "Review ad budget",
        description: "Approve the spend for August.",
        project: project1._id,
        assignedTo: users[0]._id,
        status: "todo",
        priority: "medium",
        createdBy: users[0]._id,
      },
      {
        title: "Competitor analysis",
        description: "Check what rivals are doing for Q3.",
        project: project1._id,
        assignedTo: users[1]._id,
        status: "done",
        priority: "low",
        createdBy: users[0]._id,
      },
      // Project 2 tasks
      {
        title: "Database migration script",
        description: "Move from v1 schema to v2.",
        project: project2._id,
        assignedTo: users[1]._id,
        status: "in_progress",
        priority: "high",
        dueDate: new Date(Date.now() + 86400000 * 7),
        createdBy: users[1]._id,
      },
      {
        title: "UI polishing",
        description: "Fix padding issues on mobile.",
        project: project2._id,
        assignedTo: users[3]._id,
        status: "todo",
        priority: "medium",
        createdBy: users[2]._id,
      },
      {
        title: "Unit testing",
        description: "Aim for 80% coverage.",
        project: project2._id,
        assignedTo: users[4]._id,
        status: "todo",
        priority: "medium",
        createdBy: users[1]._id,
      },
      // Project 3 tasks
      {
        title: "Pentest phase 1",
        description: "Attempt to bypass auth tokens.",
        project: project3._id,
        assignedTo: users[5]._id,
        status: "todo",
        priority: "high",
        dueDate: new Date(Date.now() - 86400000 * 1), // Overdue!
        createdBy: users[4]._id,
      },
    ]);
    console.log("Created tasks.");

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
