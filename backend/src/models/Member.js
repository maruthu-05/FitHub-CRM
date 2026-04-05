const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
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
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active'
    },
    membershipType: {
      type: String,
      enum: ['Basic', 'Premium', 'VIP'],
      default: 'Basic'
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    renewalDate: {
      type: Date
    },
    expiryDate: {
      type: Date
    },
    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer'
    },
    enrolledClasses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FitnessClass'
    }],
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    },
    medicalConditions: [{
      type: String
    }],
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
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
memberSchema.index({ email: 1 });
memberSchema.index({ status: 1 });
memberSchema.index({ expiryDate: 1 });
memberSchema.index({ assignedTrainer: 1 });

module.exports = mongoose.model('Member', memberSchema);
