const express = require('express');
const { body } = require('express-validator');
const classController = require('../controllers/classController');

const router = express.Router();

// Validation middleware
const validateClass = [
  body('name').notEmpty().trim(),
  body('classType').notEmpty().isIn(['Yoga', 'Pilates', 'CrossFit', 'HIIT', 'Spinning', 'Zumba', 'Strength', 'Cardio', 'Flexibility', 'Other']),
  body('trainer').notEmpty(),
  body('maxCapacity').isInt({ min: 1 })
];

// Routes
router.get('/', classController.getAllClasses);
router.get('/available', classController.getAvailableClasses);
router.get('/type/:classType', classController.getClassesByType);
router.get('/:id', classController.getClassById);
router.post('/', validateClass, classController.createClass);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);
router.post('/:id/remove-enrollment', classController.removeEnrollment);

module.exports = router;
