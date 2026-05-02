import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";
import { FiPlus, FiFolder, FiAlertCircle, FiCheckCircle, FiClock } from "react-icons/fi";

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.projects);
    } catch (err) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (data) => {
    try {
      const res = await api.post("/projects", data);
      setProjects((prev) => [res.data.project, ...prev]);
      toast.success("Project created!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
      throw err;
    }
  };

  // compute summary stats
  const totalTasks = projects.reduce((sum, p) => sum + (p.totalTasks || 0), 0);
  const doneTasks = projects.reduce(
    (sum, p) => sum + (p.taskCounts?.done || 0),
    0
  );
  const activeTasks = projects.reduce(
    (sum, p) => sum + (p.taskCounts?.in_progress || 0),
    0
  );
  const todoTasks = projects.reduce(
    (sum, p) => sum + (p.taskCounts?.todo || 0),
    0
  );

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Hey, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="dashboard-subtitle">
            Here's what's happening across your projects
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          <FiPlus size={16} />
          New Project
        </button>
      </div>

      {/* Summary cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon">
            <FiFolder size={20} />
          </div>
          <div className="summary-data">
            <span className="summary-number">{projects.length}</span>
            <span className="summary-label">Projects</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon todo">
            <FiClock size={20} />
          </div>
          <div className="summary-data">
            <span className="summary-number">{todoTasks}</span>
            <span className="summary-label">To Do</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon active">
            <FiAlertCircle size={20} />
          </div>
          <div className="summary-data">
            <span className="summary-number">{activeTasks}</span>
            <span className="summary-label">In Progress</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon done">
            <FiCheckCircle size={20} />
          </div>
          <div className="summary-data">
            <span className="summary-number">{doneTasks}</span>
            <span className="summary-label">Completed</span>
          </div>
        </div>
      </div>

      {/* Projects grid */}
      <div className="projects-section">
        <h2>Your Projects</h2>
        {projects.length === 0 ? (
          <div className="empty-state">
            <FiFolder size={48} />
            <h3>No projects yet</h3>
            <p>Create your first project to get started</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <FiPlus size={16} />
              Create Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateProject}
        />
      )}
    </div>
  );
};

export default Dashboard;
