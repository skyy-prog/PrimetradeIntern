const express = require('express');
const { body, param } = require('express-validator');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateFields } = require('../middleware/validation.middleware');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 100 })
      .withMessage('Title cannot exceed 100 characters'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Status must be pending, in-progress, or completed'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid date'),
    body('assignedTo')
      .optional()
      .isMongoId()
      .withMessage('Invalid assignee ID format'),
    validateFields,
  ],
  createTask
);

router.get('/', getTasks);

router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID format'),
    validateFields,
  ],
  getTaskById
);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID format'),
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Title cannot exceed 100 characters'),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Status must be pending, in-progress, or completed'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid date'),
    body('assignedTo')
      .optional()
      .isMongoId()
      .withMessage('Invalid assignee ID format'),
    validateFields,
  ],
  updateTask
);

router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task ID format'),
    validateFields,
  ],
  deleteTask
);

module.exports = router;
