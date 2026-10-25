import React from 'react';
import { Calendar, Flag } from 'lucide-react';

/**
 * TaskBoard component
 * Accessible Kanban-style task management board with Todo, In Progress, and Completed columns.
 * Allows quick status updates and invokes onTaskStatusChange to recalculate project progress.
 */
export const TaskBoard = ({ tasks = [], onTaskStatusChange }) => {
  const columns = [
    { key: 'todo', label: 'Todo', indicatorClass: 'todo' },
    { key: 'in-progress', label: 'In Progress', indicatorClass: 'in-progress' },
    { key: 'completed', label: 'Completed', indicatorClass: 'completed' },
  ];

  return (
    <div className="task-board-container" role="region" aria-label="Project Kanban Task Board">
      <div className="task-board-columns">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);

          return (
            <div key={col.key} className="task-column">
              <div className="task-column-header">
                <div className="task-column-title-wrap">
                  <span className={`task-column-indicator ${col.indicatorClass}`} aria-hidden="true" />
                  <h4 className="task-column-title">{col.label}</h4>
                </div>
                <span className="task-column-count">{colTasks.length}</span>
              </div>

              <div className="task-column-cards">
                {colTasks.length === 0 ? (
                  <div className="task-empty-column">No tasks in {col.label}</div>
                ) : (
                  colTasks.map((task) => (
                    <div key={task.id} className="task-item-card">
                      <div className="task-item-title">{task.title}</div>

                      <div className="task-item-meta">
                        <span className={`task-priority-badge ${task.priority}`}>
                          <Flag size={10} style={{ display: 'inline', marginRight: '3px' }} aria-hidden="true" />
                          {task.priority}
                        </span>

                        <div
                          className="task-assignee-avatar"
                          title={`Assigned to ${task.assigneeInitials}`}
                        >
                          {task.assigneeInitials}
                        </div>
                      </div>

                      <div className="task-item-controls">
                        <span className="task-due-date">
                          <Calendar size={11} aria-hidden="true" />
                          {task.dueDate}
                        </span>

                        <label htmlFor={`task-status-${task.id}`} className="sr-only">
                          Change status for task {task.title}
                        </label>
                        <select
                          id={`task-status-${task.id}`}
                          className="task-status-select"
                          value={task.status}
                          onChange={(e) => onTaskStatusChange(task.id, e.target.value)}
                          aria-label={`Status for ${task.title}`}
                        >
                          <option value="todo">Todo</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskBoard;
