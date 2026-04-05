const Member = require('../models/Member');
const { validationResult } = require('express-validator');

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate('assignedTrainer', 'firstName lastName specializations')
      .populate('enrolledClasses', 'name classType schedule');

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get member by ID
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .populate('assignedTrainer', 'firstName lastName specializations')
      .populate('enrolledClasses', 'name classType schedule');

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new member
exports.createMember = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const newMember = new Member(req.body);
    await newMember.save();

    const populatedMember = await Member.findById(newMember._id)
      .populate('assignedTrainer')
      .populate('enrolledClasses');

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: populatedMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update member
exports.updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTrainer').populate('enrolledClasses');

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete member
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get members with expiring subscriptions
exports.getExpiringSubscriptions = async (req, res) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const members = await Member.find({
      expiryDate: {
        $gte: new Date(),
        $lte: thirtyDaysFromNow
      }
    }).select('firstName lastName email expiryDate membershipType');

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Assign trainer to member
exports.assignTrainer = async (req, res) => {
  try {
    const { trainerId } = req.body;
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { assignedTrainer: trainerId },
      { new: true }
    ).populate('assignedTrainer');

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Trainer assigned successfully',
      data: member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Enroll member in class
exports.enrollClass = async (req, res) => {
  try {
    const { classId } = req.body;
    const Member_model = Member;
    const FitnessClass = require('../models/FitnessClass');

    const member = await Member_model.findById(req.params.id);
    const fitnessClass = await FitnessClass.findById(classId);

    if (!member || !fitnessClass) {
      return res.status(404).json({
        success: false,
        error: 'Member or Class not found'
      });
    }

    if (fitnessClass.currentEnrollment >= fitnessClass.maxCapacity) {
      return res.status(400).json({
        success: false,
        error: 'Class is full'
      });
    }

    if (!member.enrolledClasses.includes(classId)) {
      member.enrolledClasses.push(classId);
      fitnessClass.enrolledMembers.push(req.params.id);
      fitnessClass.currentEnrollment += 1;

      await member.save();
      await fitnessClass.save();
    }

    const updatedMember = await Member_model.findById(req.params.id)
      .populate('enrolledClasses');

    res.status(200).json({
      success: true,
      message: 'Member enrolled in class successfully',
      data: updatedMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
