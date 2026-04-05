const FitnessClass = require('../models/FitnessClass');
const Trainer = require('../models/Trainer');
const { validationResult } = require('express-validator');

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await FitnessClass.find()
      .populate('trainer', 'firstName lastName specializations rating')
      .populate('enrolledMembers', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get class by ID
exports.getClassById = async (req, res) => {
  try {
    const fitnessClass = await FitnessClass.findById(req.params.id)
      .populate('trainer', 'firstName lastName specializations rating email phone')
      .populate('enrolledMembers', 'firstName lastName email phone');

    if (!fitnessClass) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: fitnessClass
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new class
exports.createClass = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    // Verify trainer exists
    const trainer = await Trainer.findById(req.body.trainer);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        error: 'Trainer not found'
      });
    }

    const newClass = new FitnessClass(req.body);
    await newClass.save();

    const populatedClass = await FitnessClass.findById(newClass._id)
      .populate('trainer')
      .populate('enrolledMembers');

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: populatedClass
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update class
exports.updateClass = async (req, res) => {
  try {
    const fitnessClass = await FitnessClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('trainer').populate('enrolledMembers');

    if (!fitnessClass) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      data: fitnessClass
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete class
exports.deleteClass = async (req, res) => {
  try {
    const fitnessClass = await FitnessClass.findByIdAndDelete(req.params.id);

    if (!fitnessClass) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get classes by type
exports.getClassesByType = async (req, res) => {
  try {
    const { classType } = req.params;

    const classes = await FitnessClass.find({ classType })
      .populate('trainer', 'firstName lastName specializations')
      .populate('enrolledMembers', 'firstName lastName');

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get available classes (not full)
exports.getAvailableClasses = async (req, res) => {
  try {
    const classes = await FitnessClass.find({
      $expr: { $lt: ['$currentEnrollment', '$maxCapacity'] },
      status: 'Active'
    }).populate('trainer', 'firstName lastName specializations');

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Remove member from class
exports.removeEnrollment = async (req, res) => {
  try {
    const { memberId } = req.body;
    const Member = require('../models/Member');

    const fitnessClass = await FitnessClass.findById(req.params.id);
    const member = await Member.findById(memberId);

    if (!fitnessClass || !member) {
      return res.status(404).json({
        success: false,
        error: 'Class or Member not found'
      });
    }

    fitnessClass.enrolledMembers = fitnessClass.enrolledMembers.filter(
      id => id.toString() !== memberId
    );
    fitnessClass.currentEnrollment = Math.max(0, fitnessClass.currentEnrollment - 1);

    member.enrolledClasses = member.enrolledClasses.filter(
      id => id.toString() !== req.params.id
    );

    await fitnessClass.save();
    await member.save();

    res.status(200).json({
      success: true,
      message: 'Member removed from class successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
