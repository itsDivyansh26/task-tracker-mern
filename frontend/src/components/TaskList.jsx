import React from 'react';
import { Search, Inbox, AlertTriangle } from 'lucide-react';
import TaskCard from './TaskCard';

export const TaskList = ({
  tasks,
  loading,
  error,
  filters,
  onFilterChange,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const handleSearchChange = (e) => {
    onFilterChange({ q: e.target.value });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  const handlePriorityChange = (e) => {
    onFilterChange({ priority: e.target.value });
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    let sortBy = 'createdAt';
    let sortOrder = 'desc';

    if (val === 'dueDate-asc') {
      sortBy = 'dueDate';
      sortOrder = 'asc';
    } else if (val === 'title-asc') {
      sortBy = 'title';
      sortOrder = 'asc';
    } else if (val === 'createdAt-asc') {
      sortBy = 'createdAt';
      sortOrder = 'asc';
    }

    onFilterChange({ sortBy, sortOrder });
  };

  const currentSortVal = () => {
    if (filters.sortBy === 'dueDate') return 'dueDate-asc';
    if (filters.sortBy === 'title') return 'title-asc';
    if (filters.sortBy === 'createdAt' && filters.sortOrder === 'asc') return 'createdAt-asc';
    return 'createdAt-desc';
  };

  return (
    <div className="tasks-column">
      {/* Filter and Search Bar */}
      <div className="glass filter-bar">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search tasks..."
            value={filters.q || ''}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filter-selects">
          <select
            className="filter-select"
            value={filters.status || ''}
            onChange={handleStatusChange}
          >
            <option value="">All Statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="filter-select"
            value={filters.priority || ''}
            onChange={handlePriorityChange}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            className="filter-select"
            value={currentSortVal()}
            onChange={handleSortChange}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Date</option>
            <option value="title-asc">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Task List Render */}
      {loading ? (
        <div className="empty-placeholder">
          <div className="empty-title">Loading Tasks...</div>
        </div>
      ) : error ? (
        <div className="empty-placeholder">
          <AlertTriangle className="empty-icon" size={48} style={{ color: 'var(--color-high)' }} />
          <div className="empty-title">Failed to load tasks</div>
          <div className="empty-desc">{error}</div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass empty-placeholder">
          <Inbox className="empty-icon" size={48} />
          <div className="empty-title">No tasks found</div>
          <div className="empty-desc">
            {filters.q || filters.status || filters.priority
              ? 'Try clearing filters or adjusting your search query'
              : 'Add your first task using the form on the left!'}
          </div>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
