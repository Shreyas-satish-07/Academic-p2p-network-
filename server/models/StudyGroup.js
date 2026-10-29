import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'moderator', 'member'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const scheduleSchema = new mongoose.Schema(
  {
    days: {
      type: [String],
      default: [],
    },
    time: {
      type: String,
      default: '',
      trim: true,
    },
    timezone: {
      type: String,
      default: 'IST',
      trim: true,
    },
  },
  { _id: false }
);

const studyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Study group name is required'],
      trim: true,
      minlength: [3, 'Study group name must be at least 3 characters long'],
      maxlength: [100, 'Study group name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    topics: {
      type: [String],
      default: [],
    },
    level: {
      type: String,
      enum: {
        values: ['beginner', 'intermediate', 'advanced', 'all'],
        message: '{VALUE} is not a valid level',
      },
      default: 'all',
      lowercase: true,
      trim: true,
    },
    meetingMode: {
      type: String,
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: '{VALUE} is not a valid meeting mode',
      },
      default: 'online',
      lowercase: true,
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    schedule: {
      type: scheduleSchema,
      default: () => ({ days: [], time: '', timezone: 'IST' }),
    },
    maxMembers: {
      type: Number,
      required: [true, 'Maximum members capacity is required'],
      min: [2, 'A study group must have at least 2 members capacity'],
      max: [50, 'A study group capacity cannot exceed 50 members'],
    },
    members: {
      type: [memberSchema],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
      lowercase: true,
      trim: true,
    },
    avatarColor: {
      type: String,
      default: '#2F5D50',
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual for member count
studyGroupSchema.virtual('memberCount').get(function () {
  return Array.isArray(this.members) ? this.members.length : 0;
});

// Virtual for difficulty (capitalized display)
studyGroupSchema.virtual('difficulty').get(function () {
  if (!this.level) return 'All';
  return this.level.charAt(0).toUpperCase() + this.level.slice(1);
});

// Virtual for tags (alias to topics)
studyGroupSchema.virtual('tags').get(function () {
  return this.topics || [];
});

// Virtual for human-readable meeting schedule
studyGroupSchema.virtual('meetingSchedule').get(function () {
  if (this.schedule && Array.isArray(this.schedule.days) && this.schedule.days.length > 0) {
    const daysStr = this.schedule.days.join(', ');
    return this.schedule.time ? `${daysStr} • ${this.schedule.time}` : daysStr;
  }
  return this.schedule?.time || 'Flexible Schedule';
});

// Indexes for fast search and filtering
studyGroupSchema.index({ name: 'text', description: 'text', subject: 'text', topics: 'text' });
studyGroupSchema.index({ subject: 1, level: 1, status: 1 });
studyGroupSchema.index({ createdBy: 1 });
studyGroupSchema.index({ 'members.user': 1 });

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

export default StudyGroup;

