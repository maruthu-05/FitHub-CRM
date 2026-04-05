const mongoose = require('mongoose');

const fitnessClassSchema = new mongoose.Schema(
  {
    salesforceId: {
      type: String,
      unique: true,
      sparse: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    classType: {
      type: String,
      enum: ['Yoga', 'Pilates', 'CrossFit', 'HIIT', 'Spinning', 'Zumba', 'Strength', 'Cardio', 'Flexibility', 'Other'],
      required: true
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      required: true
    },
    schedule: {
      dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
      },
      startTime: {
        type: String, // HH:mm format
        required: true
      },
      endTime: {
        type: String, // HH:mm format
        required: true
      }
    },
    maxCapacity: {
      type: Number,
      default: 30,
      required: true
    },
    currentEnrollment: {
      type: Number,
      default: 0
    },
    enrolledMembers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    }],
    location: {
      room: String,
      floor: String
    },
    difficultyLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    status: {
      type: String,
      enum: ['Active', 'Cancelled', 'OnHold'],
      default: 'Active'
    },
    notes: String,
    syncedToSalesforce: {
      type: Boolean,
      default: false
    },
    lastSyncDate: Date,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for frequent queries
fitnessClassSchema.index({ classType: 1 });
fitnessClassSchema.index({ trainer: 1 });
fitnessClassSchema.index({ status: 1 });

module.exports = mongoose.model('FitnessClass', fitnessClassSchema);
