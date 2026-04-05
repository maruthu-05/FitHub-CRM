const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    salesforceId: {
      type: String,
      unique: true,
      sparse: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    specializations: [{
      type: String,
      enum: ['Yoga', 'Pilates', 'CrossFit', 'HIIT', 'Spinning', 'Zumba', 'Strength', 'Cardio', 'Flexibility', 'Nutrition']
    }],
    certifications: [{
      name: String,
      certifyingBody: String,
      expiryDate: Date
    }],
    experience: {
      years: Number,
      description: String
    },
    availability: {
      Monday: [{
        startTime: String,
        endTime: String
      }],
      Tuesday: [{
        startTime: String,
        endTime: String
      }],
      Wednesday: [{
        startTime: String,
        endTime: String
      }],
      Thursday: [{
        startTime: String,
        endTime: String
      }],
      Friday: [{
        startTime: String,
        endTime: String
      }],
      Saturday: [{
        startTime: String,
        endTime: String
      }],
      Sunday: [{
        startTime: String,
        endTime: String
      }]
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'OnLeave'],
      default: 'Active'
    },
    assignedMembers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    }],
    classesAssigned: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FitnessClass'
    }],
    rating: {
      average: {
        type: Number,
        default: 5,
        min: 1,
        max: 5
      },
      totalReviews: {
        type: Number,
        default: 0
      }
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    },
    notes: String,
    syncedToSalesforce: {
      type: Boolean,
      default: false
    },
    lastSyncDate: Date,
    joinDate: {
      type: Date,
      default: Date.now
    },
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
trainerSchema.index({ email: 1 });
trainerSchema.index({ specializations: 1 });
trainerSchema.index({ status: 1 });

module.exports = mongoose.model('Trainer', trainerSchema);
