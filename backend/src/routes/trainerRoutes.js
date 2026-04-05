const express = require('express');
const { body } = require('express-validator');
const trainerController = require('../controllers/trainerController');

const router = express.Router();

// Validation middleware
const validateTrainer = [
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone()
];

// Routes
router.get('/', trainerController.getAllTrainers);
router.get('/:id', trainerController.getTrainerById);
router.get('/:id/schedule', trainerController.getTrainerSchedule);
router.get('/specialization/:specialization', trainerController.getTrainersBySpecialization);
router.get('/available', trainerController.getAvailableTrainers);
router.post('/', validateTrainer, trainerController.createTrainer);
router.put('/:id', trainerController.updateTrainer);
router.delete('/:id', trainerController.deleteTrainer);
router.post('/:id/assign-class', trainerController.assignClass);

module.exports = router;
