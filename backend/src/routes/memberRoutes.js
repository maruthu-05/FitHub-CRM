const express = require('express');
const { body } = require('express-validator');
const memberController = require('../controllers/memberController');

const router = express.Router();

// Validation middleware
const validateMember = [
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').optional().isMobilePhone()
];

// Routes
router.get('/', memberController.getAllMembers);
router.get('/expiring', memberController.getExpiringSubscriptions);
router.get('/:id', memberController.getMemberById);
router.post('/', validateMember, memberController.createMember);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);
router.post('/:id/assign-trainer', memberController.assignTrainer);
router.post('/:id/enroll-class', memberController.enrollClass);

module.exports = router;
