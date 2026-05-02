import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import MembersList from "../components/MembersList";
import {
  FiPlus,
  FiArrowLeft,
  FiTrash2,
  FiEdit2,
  FiFilter,
} from "react-icons/fi";

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  const isAdmin =
    project?.members?.find((m) => m.user._id === user?._id)?.role === "admin";

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.project);
      setNewName(res.data.project.name);
    } catch (err) {
      toast.error("Failed to load project");
      navigate("/");
    }
  };

  const fetchTasks = async () => {
    try {
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;

      const res = await api.get(`/projects/${id}/tasks`, { params });
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchProject();
      await fetchTasks();
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!loading) fetchTasks();
  }, [statusFilter]);

  const handleCreateTask = async (data) => {
    try {
      const res = await api.post(`/projects/${id}/tasks`, data);
      setTasks((prev) => [res.data.task, ...prev]);
      toast.success("Task added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
      throw err;
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await api.put(`/projects/${id}/tasks/${taskId}`, {
        status: newStatus,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.task : t))
      );
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/projects/${id}/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleAddMember = async (email) => {
    try {
      const res = await api.post(`/projects/${id}/members`, { email });
      setProject(res.data.project);
      toast.success("Member added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add member");
      throw err;
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member?")) return;

    try {
      const res = await api.delete(`/projects/${id}/members/${userId}`);
      setProject(res.data.project);
      toast.success("Member removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove member");
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm("Delete this entire project and all its tasks?"))
      return;

    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      navigate("/");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === project.name) {
      setEditingName(false);
      return;
    }

    try {
      const res = await api.put(`/projects/${id}`, { name: newName });
      setProject(res.data.project);
      setEditingName(false);
      toast.success("Project updated");
    } catch (err) {
      toast.error("Failed to update project");
    }
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!project) return null;

  // group tasks by status for the board view
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <div className="project-detail">
      <div className="project-detail-header">
        <button className="btn-icon" onClick={() => navigate("/")}>
          <FiArrowLeft size={20} />
        </button>

        <div className="project-title-area">
          {editingName && isAdmin ? (
            <input
              className="edit-title-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleUpdateName}
              onKeyDown={(e) => e.key === "Enter" && handleUpdateName()}
              autoFocus
            />
          ) : (
            <h1
              className={isAdmin ? "editable" : ""}
              onClick={() => isAdmin && setEditingName(true)}
            >
              {project.name}
              {isAdmin && <FiEdit2 size={16} className="edit-icon" />}
            </h1>
          )}
          {project.description && (
            <p className="project-description">{project.description}</p>
          )}
        </div>

        <div className="project-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowTaskModal(true)}
          >
            <FiPlus size={16} />
            Add Task
          </button>
          {isAdmin && (
            <button className="btn btn-danger" onClick={handleDeleteProject}>
              <FiTrash2 size={16} />
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="project-content">
        {/* Left side: tasks */}
        <div className="tasks-area">
          <div className="tasks-header">
            <h2>Tasks ({tasks.length})</h2>
            <div className="filter-bar">
              <FiFilter size={14} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state small">
              <p>No tasks yet. Add one to get started.</p>
            </div>
          ) : (
            <div className="task-board">
              <div className="task-column">
                <div className="column-header todo">
                  <span className="column-dot"></span>
                  To Do ({todoTasks.length})
                </div>
                {todoTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteTask}
                    isAdmin={isAdmin}
                    members={project.members}
                  />
                ))}
              </div>

              <div className="task-column">
                <div className="column-header in-progress">
                  <span className="column-dot"></span>
                  In Progress ({inProgressTasks.length})
                </div>
                {inProgressTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteTask}
                    isAdmin={isAdmin}
                    members={project.members}
                  />
                ))}
              </div>

              <div className="task-column">
                <div className="column-header done">
                  <span className="column-dot"></span>
                  Done ({doneTasks.length})
                </div>
                {doneTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteTask}
                    isAdmin={isAdmin}
                    members={project.members}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side: members */}
        <div className="sidebar">
          <MembersList
            members={project.members}
            isAdmin={isAdmin}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            ownerId={project.owner._id}
          />
        </div>
      </div>

      {showTaskModal && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleCreateTask}
          members={project.members}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
