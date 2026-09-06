const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
    },

    category: {
      type: String,
      enum: ['learning', 'fitness', 'career', 'health', 'personal'],
      default: 'personal',
    },

    targetValue: {
      type: Number,
      required: true,
    },

    currentValue: {
      type: Number,
      default: 0,
    },

    unit: {
      type: String,
      default: 'tasks',
    },

    dailyTarget: {
      type: Number,
      default: 1,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'failed'],
      default: 'active',
    },

    streak: {
      current: {
        type: Number,
        default: 0,
      },

      longest: {
        type: Number,
        default: 0,
      },

      lastActivityDate: {
        type: Date,
        default: null,
      },
    },

    completionPercentage: {
      type: Number,
      default: 0,
    },

    milestones: [
      {
        value: Number,
        label: String,
        achieved: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Goal', goalSchema);