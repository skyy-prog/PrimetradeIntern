import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import TaskModal from '../components/TaskModal';
import {
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  SlidersHorizontal,
  Search,
  User,
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data.tasks || []);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
      showSuccessMessage('Task deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleSaveTask = (savedTask) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t._id === savedTask._id ? savedTask : t)));
      showSuccessMessage('Task updated successfully');
    } else {
      setTasks([savedTask, ...tasks]);
      showSuccessMessage('Task created successfully');
    }
  };

  const showSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 4000);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'high':
        return 'bg-[#ff6b6b] text-black border-2 border-black shadow-[1px_1px_0px_0px_#000000]';
      case 'medium':
        return 'bg-[#feca57] text-black border-2 border-black shadow-[1px_1px_0px_0px_#000000]';
      default:
        return 'bg-[#1dd1a1] text-black border-2 border-black shadow-[1px_1px_0px_0px_#000000]';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-[#a29bfe] text-black border-2 border-black shadow-[1px_1px_0px_0px_#000000]';
      case 'in-progress':
        return 'bg-[#54a0ff] text-black border-2 border-black shadow-[1px_1px_0px_0px_#000000]';
      default:
        return 'bg-[#ff9ff3] text-black border-2 border-black shadow-[1px_1px_0px_0px_#000000]';
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-black font-sans grid-dots">
      <nav className="sticky top-0 z-40 w-full bg-white border-b-4 border-black px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#000000] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#1dd1a1]">
            <CheckCircle className="text-white" size={20} />
          </div>
          <span className="text-2xl font-black tracking-tight uppercase">
            Task.AI
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 px-4 py-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
            <div className="w-7 h-7 bg-[#feca57] border-2 border-black flex items-center justify-center font-bold text-xs">
              U
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black uppercase tracking-tight">{user?.username}</span>
              <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">
                {user?.role}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-bold uppercase tracking-wider brutal-btn"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {success && (
          <div className="p-4 bg-[#1dd1a1] border-2 border-black shadow-[3px_3px_0px_0px_#000000] text-black text-sm font-bold animate-bounce">
            🎉 {success}
          </div>
        )}

        {error && (
          <div className="p-4 bg-[#ff6b6b] border-2 border-black shadow-[3px_3px_0px_0px_#000000] text-black text-sm font-bold">
            🚨 {error}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 brutal-card flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Tasks</p>
              <h4 className="text-3xl font-black mt-1">{totalTasks}</h4>
            </div>
            <div className="w-12 h-12 bg-[#54a0ff] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
              <SlidersHorizontal className="text-black" size={20} />
            </div>
          </div>

          <div className="p-6 brutal-card flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending</p>
              <h4 className="text-3xl font-black mt-1 text-purple-700">{pendingTasks}</h4>
            </div>
            <div className="w-12 h-12 bg-[#ff9ff3] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
              <AlertCircle className="text-black" size={20} />
            </div>
          </div>

          <div className="p-6 brutal-card flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">In Progress</p>
              <h4 className="text-3xl font-black mt-1 text-blue-700">{inProgressTasks}</h4>
            </div>
            <div className="w-12 h-12 bg-[#54a0ff] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
              <Clock className="text-black" size={20} />
            </div>
          </div>

          <div className="p-6 brutal-card flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Completed</p>
              <h4 className="text-3xl font-black mt-1 text-green-700">{completedTasks}</h4>
            </div>
            <div className="w-12 h-12 bg-[#1dd1a1] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
              <CheckCircle className="text-black" size={20} />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks by title or content..."
                className="w-full pl-12 pr-4 py-2.5 brutal-input text-sm text-black placeholder-slate-400 font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 brutal-input text-sm text-black font-bold"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2.5 brutal-input text-sm text-black font-bold"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <button
                onClick={handleCreateClick}
                className="flex items-center space-x-2 px-5 py-2.5 brutal-btn text-sm font-bold uppercase tracking-wider"
              >
                <Plus size={18} />
                <span>New Task</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-black border-t-emerald-400 rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-slate-600">Retrieving intelligence files...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-16 bg-[#fafafa] border-2 border-black border-dashed">
              <SlidersHorizontal className="mx-auto text-black mb-3" size={40} />
              <h5 className="font-black text-lg uppercase tracking-tight">System Empty</h5>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                No active records match the queries. Push database updates to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="brutal-card p-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ${getStatusBadge(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-black leading-tight truncate">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 h-[50px] leading-relaxed">
                        {task.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-black grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="font-bold text-slate-400 uppercase tracking-widest block">Owner</span>
                        <span className="text-black font-black truncate block">
                          {task.createdBy?.username || 'System'}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-400 uppercase tracking-widest block">Assignee</span>
                        <span className="text-black font-black truncate block">
                          {task.assignedTo?.username || 'Unassigned'}
                        </span>
                      </div>
                    </div>

                    {task.dueDate && (
                      <div className="text-[10px] text-slate-400 flex items-center space-x-1.5 font-bold uppercase tracking-wider">
                        <span>Due Date:</span>
                        <span className="text-black">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end space-x-2 mt-5 pt-3 border-t border-black">
                    <button
                      onClick={() => handleEditClick(task)}
                      className="p-2 bg-white hover:bg-slate-100 text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[0.5px_0.5px_0px_0px_#000000] transition-all"
                      title="Edit Task"
                    >
                      <Edit2 size={14} />
                    </button>
                    {(user?.role === 'admin' || task.createdBy?._id === user?.id || task.createdBy === user?.id) && (
                      <button
                        onClick={() => handleDeleteClick(task._id)}
                        className="p-2 bg-[#ff6b6b] hover:bg-rose-400 text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[0.5px_0.5px_0px_0px_#000000] transition-all"
                        title="Delete Task"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        onSave={handleSaveTask}
        isAdmin={user?.role === 'admin'}
      />
    </div>
  );
};

export default Dashboard;
