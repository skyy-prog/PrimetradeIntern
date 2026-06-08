import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { X } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, task, onSave, isAdmin }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setStatus(task.status || 'pending');
        setPriority(task.priority || 'medium');
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
        setAssignedTo(task.assignedTo?._id || task.assignedTo || '');
      } else {
        setTitle('');
        setDescription('');
        setStatus('pending');
        setPriority('medium');
        setDueDate('');
        setAssignedTo('');
      }
      setError('');
    }
  }, [isOpen, task]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (isOpen && isAdmin) {
        try {
          const response = await api.get('/auth/users');
          setUsers(response.data.users || []);
        } catch (err) {
          console.error('Failed to fetch users', err);
        }
      }
    };
    fetchUsers();
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate || undefined,
    };

    if (isAdmin) {
      payload.assignedTo = assignedTo || undefined;
    }

    try {
      if (task) {
        const response = await api.put(`/tasks/${task._id}`, payload);
        onSave(response.data.task);
      } else {
        const response = await api.post('/tasks', payload);
        onSave(response.data.task);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between p-5 border-b-2 border-black bg-slate-50">
          <h3 className="text-lg font-black uppercase tracking-tight text-black">
            {task ? 'Edit Node Record' : 'Create Intelligence File'}
          </h3>
          <button
            onClick={onClose}
            className="text-black hover:bg-slate-200 border-2 border-transparent hover:border-black p-1 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          {error && (
            <div className="p-4 text-xs font-bold text-black bg-[#ff6b6b] border-2 border-black">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-black uppercase tracking-widest mb-1.5 ml-0.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 brutal-input text-black font-bold placeholder-slate-400 text-sm"
              placeholder="Enter record title..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black text-black uppercase tracking-widest mb-1.5 ml-0.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 brutal-input text-black font-bold placeholder-slate-400 h-24 resize-none text-sm"
              placeholder="Enter payload contents..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-widest mb-1.5 ml-0.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 brutal-input text-black font-bold text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-black uppercase tracking-widest mb-1.5 ml-0.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 brutal-input text-black font-bold text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-black uppercase tracking-widest mb-1.5 ml-0.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 brutal-input text-black font-bold text-sm"
              />
            </div>

            {isAdmin && (
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-widest mb-1.5 ml-0.5">
                  Assign To
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2.5 brutal-input text-black font-bold text-sm"
                >
                  <option value="">Assign to Self</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.username} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black bg-slate-50 -mx-6 -mb-6 p-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-black uppercase tracking-wider text-black bg-white hover:bg-slate-100 border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-black uppercase tracking-wider text-white bg-black hover:bg-slate-900 border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] transition-all disabled:opacity-50"
            >
              {submitting ? 'Writing...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
