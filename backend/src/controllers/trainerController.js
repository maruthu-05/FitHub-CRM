const Trainer = require('../models/Trainer');
const { validationResult } = require('express-validator');

// Get all trainers
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate('assignedMembers', 'firstName lastName email')
      .populate('classesAssigned', 'name classType');

    res.status(200).json({
      success: true,
      count: trainers.length,
      data: trainers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get trainer by ID
exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
      .populate('assignedMembers', 'firstName lastName email status')
      .populate('classesAssigned', 'name classType schedule');

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: trainer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new trainer
exports.createTrainer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const newTrainer = new Trainer(req.body);
    await newTrainer.save();

    res.status(201).json({
      success: true,
      message: 'Trainer created successfully',
      data: newTrainer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update trainer
exports.updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedMembers').populate('classesAssigned');

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trainer updated successfully',
      data: trainer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete trainer
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trainer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get trainers by specialization
exports.getTrainersBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;

    const trainers = await Trainer.find({
      specializations: specialization,
      status: 'Active'
    }).select('firstName lastName specializations availability rating');

    res.status(200).json({
      success: true,
      count: trainers.length,
      data: trainers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get available trainers for a time slot
exports.getAvailableTrainers = async (req, res) => {
  try {
    const { day, startTime } = req.query;

    if (!day || !startTime) {
      return res.status(400).json({
        success: false,
        error: 'Day and startTime are required'
      });
    }

    const trainers = await Trainer.find({
      status: 'Active',
      [`availability.${day}`]: { $exists: true }
    }).select('firstName lastName specializations availability');

    // Filter trainers with availability at specified time
    const availableTrainers = trainers.filter(trainer => {
      const slots = trainer.availability[day];
      if (!slots) return false;
      return slots.some(slot => slot.startTime === startTime);
    });

    res.status(200).json({
      success: true,
      count: availableTrainers.length,
      data: availableTrainers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Assign trainer to class
exports.assignClass = async (req, res) => {
  try {
    const { classId } = req.body;
    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { classesAssigned: classId } },
      { new: true }
    ).populate('classesAssigned');

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class assigned to trainer successfully',
      data: trainer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get trainer schedule
exports.getTrainerSchedule = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
      .populate('classesAssigned', 'name classType schedule');

    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found'
      });
    }

    const schedule = {
      trainer: {
        id: trainer._id,
        name: `${trainer.firstName} ${trainer.lastName}`
      },
      availability: trainer.availability,
      assignedClasses: trainer.classesAssigned
    };

    res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
