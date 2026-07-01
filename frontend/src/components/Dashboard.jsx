import React from 'react';

export const Dashboard = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Circumference of circle with r = 30 is 2 * PI * 30 = 188.5
  const circumference = 188.5;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="dashboard-grid">
      <div className="glass stat-item">
        <div className="circular-progress">
          <svg>
            <circle className="bg-circle" cx="40" cy="40" r="30" />
            <circle 
              className="fg-circle" 
              cx="40" 
              cy="40" 
              r="30" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="percentage-text">{percentage}%</div>
        </div>
        <span className="stat-label">Progress</span>
      </div>

      <div className="glass stat-item">
        <span className="stat-label">Total</span>
        <span className="stat-val">{total}</span>
      </div>

      <div className="glass stat-item" style={{ borderBottom: '3px solid var(--color-todo)' }}>
        <span className="stat-label">Todo</span>
        <span className="stat-val">{todo}</span>
      </div>

      <div className="glass stat-item" style={{ borderBottom: '3px solid var(--color-in-progress)' }}>
        <span className="stat-label">In Progress</span>
        <span className="stat-val">{inProgress}</span>
      </div>

      <div className="glass stat-item" style={{ borderBottom: '3px solid var(--color-completed)' }}>
        <span className="stat-label">Completed</span>
        <span className="stat-val">{completed}</span>
      </div>
    </div>
  );
};

export default Dashboard;
