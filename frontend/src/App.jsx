import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import api from './services/api';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Toast from './components/Toast';
import Auth from './components/Auth';

function App() {
  const [tasks, setTasks] = useState([]); // Filtered tasks shown in list
  const [allTasks, setAllTasks] = useState([]); // All tasks for dashboard statistics
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [editingTask, setEditingTask] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Auth state
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    q: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setTasks([]);
    setAllTasks([]);
    addToast('Logged out successfully', 'success');
  };

  // Auth Success Handler
  const handleAuthSuccess = (authData) => {
    setToken(authData.token);
    setUser({ _id: authData._id, username: authData.username });
  };

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          handleLogout();
        }
      }
    };
    validateToken();
  }, [token]);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Toast Helpers
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load all tasks (for dashboard stats)
  const fetchAllTasks = async () => {
    try {
      const data = await api.getTasks({});
      setAllTasks(data);
    } catch (err) {
      console.error('Error fetching all tasks:', err);
    }
  };

  // Load tasks with filters
  const fetchFilteredTasks = async () => {
    setLoading(true);
    try {
      const data = await api.getTasks(filters);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tasks');
      addToast('Error loading tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load data on start & when filters change
  useEffect(() => {
    if (token) {
      fetchFilteredTasks();
      fetchAllTasks();
    }
  }, [filters, token]);

  // Handle task submission (create or update)
  const handleFormSubmit = async (taskData) => {
    try {
      if (editingTask) {
        // Update task
        const updated = await api.updateTask(editingTask._id, taskData);
        
        // Update local task state instantly
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        setAllTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        
        addToast('Task updated successfully', 'success');
        setEditingTask(null);
      } else {
        // Create task
        const created = await api.createTask(taskData);
        
        // Update local tasks
        // Only prepend if it matches the current filters status/priority
        let matchesFilter = true;
        if (filters.status && created.status !== filters.status) matchesFilter = false;
        if (filters.priority && created.priority !== filters.priority) matchesFilter = false;
        
        if (matchesFilter) {
          setTasks((prev) => [created, ...prev]);
        }
        setAllTasks((prev) => [created, ...prev]);
        
        addToast('Task created successfully', 'success');
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to save task';
      addToast(errMsg, 'error');
      throw err; // rethrow for Form error boundaries
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.deleteTask(id);
      
      // Update local task states instantly
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setAllTasks((prev) => prev.filter((t) => t._id !== id));
      
      addToast('Task deleted successfully', 'success');
      
      // If we are currently editing the deleted task, cancel editing
      if (editingTask && editingTask._id === id) {
        setEditingTask(null);
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to delete task', 'error');
    }
  };

  // Handle quick status changes (checkbox toggle, play, pause)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await api.updateTask(id, { status: newStatus });
      
      // Update states
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      setAllTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
      
      const statusMsgs = {
        todo: 'Task reset to Todo',
        'in-progress': 'Task started',
        completed: 'Task completed! 🎉',
      };
      
      addToast(statusMsgs[newStatus] || 'Task status updated', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update status', 'error');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    // Scroll smoothly to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">⚡</div>
          <h1 className="logo-text">TaskFlow</h1>
        </div>
        
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {token && user && (
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="welcome-text" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Hi, <strong style={{ color: 'var(--text-primary)' }}>{user.username}</strong>
              </span>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary" 
                style={{ 
                  padding: '0.4rem 0.8rem', 
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          )}
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {!token ? (
        <Auth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <>
          {/* Overview Dashboard stats */}
          <Dashboard tasks={allTasks} />

          {/* Main Form & List Grid */}
          <main className="main-content">
            <section>
              <TaskForm
                onSubmit={handleFormSubmit}
                editingTask={editingTask}
                onCancelEdit={handleCancelEdit}
              />
            </section>
            
            <section>
              <TaskList
                tasks={tasks}
                loading={loading}
                error={error}
                filters={filters}
                onFilterChange={handleFilterChange}
                onEdit={handleEditClick}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            </section>
          </main>
        </>
      )}

      {/* Notification Toast Manager */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
