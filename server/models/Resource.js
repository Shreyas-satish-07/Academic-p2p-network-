import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1500, 'Description cannot exceed 1500 characters'],
    },
    resourceType: {
      type: String,
      enum: {
        values: ['link', 'document', 'video', 'course', 'tool', 'other'],
        message: '{VALUE} is not a valid resource type',
      },
      default: 'link',
      lowercase: true,
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Resource URL is required'],
      trim: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(v);
        },
        message: 'Please provide a valid HTTP or HTTPS resource URL',
      },
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
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
      lowercase: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator user is required'],
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
    saves: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
      lowercase: true,
      trim: true,
    },
    thumbnailColor: {
      type: String,
      default: '#2F5D50',
      trim: true,
    },
    fileSize: {
      type: String,
      default: 'Link Resource',
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

// Virtual for like count
resourceSchema.virtual('likeCount').get(function () {
  return Array.isArray(this.likes) ? this.likes.length : 0;
});

// Virtual for save count
resourceSchema.virtual('saveCount').get(function () {
  return Array.isArray(this.saves) ? this.saves.length : 0;
});

// Virtual for frontend compatibility (fileUrl pointing to url)
resourceSchema.virtual('fileUrl').get(function () {
  return this.url;
});

// Virtual for display type
resourceSchema.virtual('type').get(function () {
  if (!this.resourceType) return 'Link';
  switch (this.resourceType) {
    case 'document':
      return 'Document';
    case 'video':
      return 'Video';
    case 'course':
      return 'Course';
    case 'tool':
      return 'Tool';
    case 'link':
      return 'Link';
    default:
      return this.resourceType.charAt(0).toUpperCase() + this.resourceType.slice(1);
  }
});

// Indexes for text search, filtering, and creator lookups
resourceSchema.index({
  title: 'text',
  description: 'text',
  subject: 'text',
  topics: 'text',
  tags: 'text',
});
resourceSchema.index({ subject: 1, resourceType: 1, level: 1, visibility: 1, status: 1 });
resourceSchema.index({ createdBy: 1, visibility: 1, status: 1 });
resourceSchema.index({ saves: 1 });
resourceSchema.index({ likes: 1 });

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;

