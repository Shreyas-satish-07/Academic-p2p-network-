import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Answer content is required'],
      trim: true,
      minlength: [5, 'Answer must be at least 5 characters long'],
      maxlength: [5000, 'Answer cannot exceed 5000 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Answer author is required'],
    },
    votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual alias 'body' for answer content
answerSchema.virtual('body').get(function () {
  return this.content;
});

// Virtual for answer vote count
answerSchema.virtual('voteCount').get(function () {
  return Array.isArray(this.votes) ? this.votes.length : 0;
});

const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Discussion title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters long'],
      maxlength: [180, 'Title cannot exceed 180 characters'],
    },
    content: {
      type: String,
      required: [true, 'Discussion content is required'],
      trim: true,
      minlength: [20, 'Content must be at least 20 characters long'],
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
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
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author user is required'],
    },
    votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'resolved', 'archived'],
        message: '{VALUE} is not a valid discussion status',
      },
      default: 'open',
      lowercase: true,
      trim: true,
    },
    linkedProjectId: {
      type: String,
      default: null,
      trim: true,
    },
    linkedResourceId: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual alias 'body' for discussion content
discussionSchema.virtual('body').get(function () {
  return this.content;
});

// Virtual alias 'viewCount'
discussionSchema.virtual('viewCount').get(function () {
  return this.views || 0;
});

// Virtual for discussion vote count
discussionSchema.virtual('voteCount').get(function () {
  return Array.isArray(this.votes) ? this.votes.length : 0;
});

// Virtual for answer count
discussionSchema.virtual('answerCount').get(function () {
  return Array.isArray(this.answers) ? this.answers.length : 0;
});

// Virtual to determine if solved
discussionSchema.virtual('isSolved').get(function () {
  if (this.status === 'resolved') return true;
  if (Array.isArray(this.answers) && this.answers.some((a) => a.isAccepted)) {
    return true;
  }
  return false;
});

// Virtual for accepted answer ID
discussionSchema.virtual('acceptedAnswerId').get(function () {
  if (!Array.isArray(this.answers)) return null;
  const accepted = this.answers.find((a) => a.isAccepted);
  return accepted ? accepted._id.toString() : null;
});

// Indexes for high performance searches and sorts
discussionSchema.index({ title: 'text', content: 'text', tags: 'text' });
discussionSchema.index({ status: 1, createdAt: -1 });
discussionSchema.index({ subject: 1, status: 1 });
discussionSchema.index({ author: 1, status: 1 });
discussionSchema.index({ views: -1 });

const Discussion = mongoose.model('Discussion', discussionSchema);

export default Discussion;

