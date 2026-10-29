import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: {
        values: ['direct', 'group'],
        message: '{VALUE} is not a valid conversation type',
      },
      default: 'direct',
      lowercase: true,
      trim: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Participant user ID is required'],
      },
    ],
    name: {
      type: String,
      trim: true,
      default: null,
    },
    lastMessage: {
      content: {
        type: String,
        trim: true,
        default: '',
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      sentAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Direct conversations must have exactly two unique participants
conversationSchema.pre('validate', function (next) {
  if (this.type === 'direct') {
    if (!Array.isArray(this.participants) || this.participants.length !== 2) {
      this.invalidate('participants', 'Direct conversations must have exactly two participants');
    } else {
      const p1 = (this.participants[0]?._id || this.participants[0])?.toString();
      const p2 = (this.participants[1]?._id || this.participants[1])?.toString();
      if (p1 === p2) {
        this.invalidate('participants', 'Direct conversation participants must be unique');
      }
    }
  }
  next();
});

// Indexes for fast lookup of user conversations and direct conversation checks
conversationSchema.index({ participants: 1, updatedAt: -1 });
conversationSchema.index({ type: 1, participants: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;

