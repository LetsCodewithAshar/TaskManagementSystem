import { Link } from "react-router-dom";
import { FiUsers, FiCheckSquare, FiClock, FiLoader } from "react-icons/fi";

const ProjectCard = ({ project }) => {
  const { taskCounts = {}, totalTasks = 0 } = project;

  return (
    <Link to={`/projects/${project._id}`} className="project-card">
      <div className="project-card-header">
        <h3 className="project-card-title">{project.name}</h3>
        <span className="project-card-badge">
          <FiUsers size={13} />
          {project.members?.length || 0}
        </span>
      </div>

      {project.description && (
        <p className="project-card-desc">{project.description}</p>
      )}

      <div className="project-card-stats">
        <div className="stat">
          <FiCheckSquare size={14} />
          <span>{taskCounts.done || 0} done</span>
        </div>
        <div className="stat">
          <FiLoader size={14} />
          <span>{taskCounts.in_progress || 0} active</span>
        </div>
        <div className="stat">
          <FiClock size={14} />
          <span>{taskCounts.todo || 0} todo</span>
        </div>
      </div>

      <div className="project-card-footer">
        <span className="task-total">{totalTasks} tasks total</span>
      </div>
    </Link>
  );
};

export default ProjectCard;
