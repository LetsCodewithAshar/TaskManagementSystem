import { FiUser, FiCalendar, FiTrash2 } from "react-icons/fi";

const statusLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const TaskCard = ({ task, onStatusChange, onDelete, isAdmin, members }) => {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={`task-card priority-${task.priority}`}>
      <div className="task-card-top">
        <h4 className="task-card-title">{task.title}</h4>
        {isAdmin && (
          <button
            className="btn-icon-sm"
            onClick={() => onDelete(task._id)}
            title="Delete task"
          >
            <FiTrash2 size={14} />
          </button>
        )}
      </div>

      {task.description && (
        <p className="task-card-desc">{task.description}</p>
      )}

      <div className="task-card-meta">
        <select
          className="status-select"
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <span className={`priority-badge priority-${task.priority}`}>
          {priorityLabels[task.priority]}
        </span>
      </div>

      <div className="task-card-bottom">
        {task.assignedTo ? (
          <span className="task-assignee">
            <FiUser size={12} />
            {task.assignedTo.name}
          </span>
        ) : (
          <span className="task-assignee unassigned">Unassigned</span>
        )}

        {task.dueDate && (
          <span className={`task-due ${isOverdue ? "overdue" : ""}`}>
            <FiCalendar size={12} />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
