import React from 'react';
import { Trash2, Edit, Calendar, Check, AlertCircle, Play, Pause } from 'lucide-react';

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { _id, title, description, status, priority, dueDate } = task;

  const isCompleted = status === 'completed';

  const handleCheckboxClick = () => {
    const nextStatus = isCompleted ? 'todo' : 'completed';
    onStatusChange(_id, nextStatus);
  };

  const handleStartProgress = () => {
    onStatusChange(_id, 'in-progress');
  };

  const handlePauseProgress = () => {
    onStatusChange(_id, 'todo');
  };

  // Due date checking
  const getDueDateInfo = () => {
    if (!dueDate) return null;
    
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isOverdue = due < today && !isCompleted;
    
    const formattedDate = due.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return {
      text: formattedDate,
      isOverdue,
    };
  };

  const dueDateInfo = getDueDateInfo();

  return (
    <div className="glass-card task-card">
      <div className="task-header">
        <div className="task-title-area">
          <div 
            className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
            onClick={handleCheckboxClick}
          >
            {isCompleted && <Check size={14} strokeWidth={3} />}
          </div>
          <span className={`task-title ${isCompleted ? 'completed' : ''}`}>
            {title}
          </span>
        </div>

        <div className="task-actions">
          {!isCompleted && status === 'todo' && (
            <button 
              className="action-btn" 
              onClick={handleStartProgress} 
              title="Start Progress"
            >
              <Play size={15} />
            </button>
          )}
          {!isCompleted && status === 'in-progress' && (
            <button 
              className="action-btn" 
              onClick={handlePauseProgress} 
              title="Pause Progress"
            >
              <Pause size={15} />
            </button>
          )}
          <button 
            className="action-btn edit-btn" 
            onClick={() => onEdit(task)} 
            title="Edit Task"
          >
            <Edit size={15} />
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={() => onDelete(_id)} 
            title="Delete Task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {description && (
        <div className="task-body">
          {description}
        </div>
      )}

      <div className="task-footer">
        <div className="task-meta">
          {dueDateInfo && (
            <span className={`meta-item ${dueDateInfo.isOverdue ? 'overdue' : ''}`}>
              {dueDateInfo.isOverdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
              {dueDateInfo.text} {dueDateInfo.isOverdue ? '(Overdue)' : ''}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className={`badge badge-${status}`}>
            {status.replace('-', ' ')}
          </span>
          <span className={`badge badge-${priority}`}>
            {priority}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
