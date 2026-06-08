const Task = require('../models/task.model');
const User = require('../models/user.model');

const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    let targetAssignee = req.user.id;
    if (req.user.role === 'admin' && assignedTo) {
      const exists = await User.findById(assignedTo);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'Assigned user not found',
        });
      }
      targetAssignee = assignedTo;
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo: targetAssignee,
      createdBy: req.user.id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email');

    res.status(201).json({
      success: true,
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query = {
        $or: [
          { createdBy: req.user.id },
          { assignedTo: req.user.id },
        ],
      };
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (
      req.user.role !== 'admin' &&
      task.createdBy._id.toString() !== req.user.id &&
      task.assignedTo?._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this task',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (
      req.user.role !== 'admin' &&
      task.createdBy.toString() !== req.user.id &&
      task.assignedTo?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate;

    if (req.user.role === 'admin' && assignedTo !== undefined) {
      if (assignedTo) {
        const exists = await User.findById(assignedTo);
        if (!exists) {
          return res.status(404).json({
            success: false,
            message: 'Assigned user not found',
          });
        }
        updates.assignedTo = assignedTo;
      } else {
        updates.assignedTo = null;
      }
    }

    task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email');

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (
      req.user.role !== 'admin' &&
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
