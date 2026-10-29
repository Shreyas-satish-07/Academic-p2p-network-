import mongoose from 'mongoose';
import Discussion from '../models/Discussion.js';

/**
 * Helper to escape special characters for regex search
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Format date for friendly UI display, e.g. "2 hours ago" or "Oct 28, 2026"
 */
const formatRelativeTime = (dateObj) => {
  if (!dateObj) return 'Recently';
  try {
    const d = new Date(dateObj);
    const now = new Date();
    const diffMs = now - d;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recently';
  }
};

/**
 * Formats a discussion document for safe API and UI consumption
 */
export const formatDiscussionResponse = (discussionDoc, currentUserId) => {
  if (!discussionDoc) return null;
  const doc =
    typeof discussionDoc.toObject === 'function'
      ? discussionDoc.toObject({ virtuals: true })
      : { ...discussionDoc };

  const currentUserIdStr = currentUserId ? currentUserId.toString() : '';

  // Extract author info safely
  const authorObj = doc.author && typeof doc.author === 'object' ? doc.author : null;
  const authorId = authorObj
    ? (authorObj._id || authorObj.id)?.toString()
    : doc.author?.toString() || '';
  const authorName = authorObj?.name || 'Cohort Student';
  const authorInitials =
    authorObj?.initials ||
    authorName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  const authorDept = authorObj?.department || 'Computer Science';
  const authorSemester = authorObj?.semester || null;
  const authorAvatar = authorObj?.avatar || { url: '' };

  const isDiscussionAuthor = Boolean(currentUserIdStr && authorId === currentUserIdStr);

  const votesList = Array.isArray(doc.votes) ? doc.votes : [];
  const isVotedByCurrentUser = votesList.some(
    (id) => (id?._id || id)?.toString() === currentUserIdStr
  );

  const answersRaw = Array.isArray(doc.answers) ? doc.answers : [];
  const acceptedAnswer = answersRaw.find((ans) => ans.isAccepted);
  const acceptedAnswerExists = Boolean(acceptedAnswer);
  const isSolved = doc.status === 'resolved' || acceptedAnswerExists;

  // Format answers list
  const formattedAnswers = answersRaw.map((ans) => {
    const ansObj = typeof ans.toObject === 'function' ? ans.toObject({ virtuals: true }) : { ...ans };
    const ansAuthorObj = ansObj.author && typeof ansObj.author === 'object' ? ansObj.author : null;
    const ansAuthorId = ansAuthorObj
      ? (ansAuthorObj._id || ansAuthorObj.id)?.toString()
      : ansObj.author?.toString() || '';
    const ansAuthorName = ansAuthorObj?.name || 'Cohort Peer';
    const ansAuthorInitials =
      ansAuthorObj?.initials ||
      ansAuthorName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
    const ansVotesList = Array.isArray(ansObj.votes) ? ansObj.votes : [];
    const ansIsVoted = ansVotesList.some(
      (id) => (id?._id || id)?.toString() === currentUserIdStr
    );
    const ansId = (ansObj._id || ansObj.id)?.toString();

    return {
      id: ansId,
      _id: ansId,
      author: ansAuthorName, // string for direct UI compatibility
      authorInitials: ansAuthorInitials,
      authorDepartment: ansAuthorObj?.department || '',
      authorUser: {
        id: ansAuthorId,
        _id: ansAuthorId,
        name: ansAuthorName,
        initials: ansAuthorInitials,
        department: ansAuthorObj?.department || '',
        semester: ansAuthorObj?.semester || null,
        avatar: ansAuthorObj?.avatar || { url: '' },
      },
      authorId: ansAuthorId,
      isAnswerAuthor: Boolean(currentUserIdStr && ansAuthorId === currentUserIdStr),
      body: ansObj.content || ansObj.body || '',
      content: ansObj.content || ansObj.body || '',
      voteCount: ansVotesList.length,
      votes: ansVotesList,
      isVotedByCurrentUser: ansIsVoted,
      isAccepted: Boolean(ansObj.isAccepted),
      createdAt: formatRelativeTime(ansObj.createdAt),
      rawCreatedAt: ansObj.createdAt,
      updatedAt: ansObj.updatedAt,
    };
  });

  const discId = (doc._id || doc.id)?.toString();

  return {
    id: discId,
    _id: discId,
    title: doc.title,
    body: doc.content || doc.body || '',
    content: doc.content || doc.body || '',
    subject: doc.subject,
    topics: Array.isArray(doc.topics) ? doc.topics : [],
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    author: authorName, // string for direct UI rendering
    authorInitials,
    authorDepartment: authorDept,
    authorUser: {
      id: authorId,
      _id: authorId,
      name: authorName,
      initials: authorInitials,
      department: authorDept,
      semester: authorSemester,
      avatar: authorAvatar,
    },
    authorId,
    isDiscussionAuthor,
    isAuthor: isDiscussionAuthor,
    status: doc.status || 'open',
    isSolved,
    acceptedAnswerExists,
    acceptedAnswerId: acceptedAnswer ? (acceptedAnswer._id || acceptedAnswer.id)?.toString() : null,
    voteCount: votesList.length,
    votes: votesList,
    isVotedByCurrentUser,
    answerCount: answersRaw.length,
    viewCount: Number(doc.views || doc.viewCount) || 0,
    views: Number(doc.views || doc.viewCount) || 0,
    linkedProjectId: doc.linkedProjectId || null,
    linkedResourceId: doc.linkedResourceId || null,
    createdAt: formatRelativeTime(doc.createdAt),
    rawCreatedAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    answers: formattedAnswers,
  };
};

/**
 * @desc    Get all accessible discussions with search, filter, and pagination
 * @route   GET /api/discussions
 * @access  Private (Requires Bearer JWT)
 */
export const getDiscussions = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const {
      search,
      subject,
      tags,
      status,
      mine,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const parsedPage = parseInt(page, 10);
    if (isNaN(parsedPage) || parsedPage < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page must be an integer greater than or equal to 1.',
      });
    }

    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be an integer between 1 and 100.',
      });
    }

    // Build Match Criteria
    const matchCriteria = {};

    // Filter by status: exclude archived by default
    if (status && status !== 'all') {
      const normalizedStatus = status.toLowerCase();
      if (normalizedStatus === 'solved' || normalizedStatus === 'resolved') {
        matchCriteria.status = 'resolved';
      } else if (normalizedStatus === 'unsolved' || normalizedStatus === 'open') {
        matchCriteria.status = 'open';
      } else if (['open', 'resolved', 'archived'].includes(normalizedStatus)) {
        matchCriteria.status = normalizedStatus;
      }
    } else {
      matchCriteria.status = { $ne: 'archived' };
    }

    // Filter by subject
    if (subject && subject !== 'All Subjects' && subject.toLowerCase() !== 'all') {
      matchCriteria.subject = new RegExp(`^${escapeRegex(subject.trim())}$`, 'i');
    }

    // Filter by tags
    if (tags) {
      const tagList = Array.isArray(tags)
        ? tags
        : tags
            .split(',')
            .map((t) => t.trim().replace(/^#/, ''))
            .filter(Boolean);
      if (tagList.length > 0) {
        matchCriteria.tags = {
          $in: tagList.map((t) => new RegExp(`^${escapeRegex(t)}$`, 'i')),
        };
      }
    }

    // Filter by creator/author (mine=true)
    if (mine === 'true' || mine === true) {
      matchCriteria.author = new mongoose.Types.ObjectId(currentUserId);
    }

    // Search by title, content, tags, or subject
    if (search && search.trim()) {
      const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
      matchCriteria.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
        { subject: searchRegex },
      ];
    }

    // Determine sort stage
    let sortStage = { createdAt: -1 };
    switch (sort) {
      case 'trending':
        sortStage = { voteCount: -1, views: -1, createdAt: -1 };
        break;
      case 'mostVoted':
      case 'votes':
      case 'popular':
        sortStage = { voteCount: -1, createdAt: -1 };
        break;
      case 'mostAnswered':
      case 'answers':
        sortStage = { answerCount: -1, createdAt: -1 };
        break;
      case 'mostViewed':
      case 'views':
        sortStage = { views: -1, createdAt: -1 };
        break;
      case 'oldest':
        sortStage = { createdAt: 1 };
        break;
      case 'newest':
      case 'recent':
      default:
        sortStage = { createdAt: -1 };
        break;
    }

    // Aggregation pipeline to handle sorting by array length and pagination
    const pipeline = [
      { $match: matchCriteria },
      {
        $addFields: {
          voteCount: { $size: { $ifNull: ['$votes', []] } },
          answerCount: { $size: { $ifNull: ['$answers', []] } },
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $sort: sortStage },
            { $skip: (parsedPage - 1) * parsedLimit },
            { $limit: parsedLimit },
          ],
        },
      },
    ];

    const [result] = await Discussion.aggregate(pipeline);
    const total = result.metadata[0] ? result.metadata[0].total : 0;
    const totalPages = Math.ceil(total / parsedLimit);

    // Populate authors on retrieved discussion documents
    const populatedDiscussions = await Discussion.populate(result.data, [
      { path: 'author', select: 'name initials department semester avatar' },
      { path: 'answers.author', select: 'name initials department semester avatar' },
    ]);

    const formattedDiscussions = populatedDiscussions.map((d) =>
      formatDiscussionResponse(d, currentUserId)
    );

    return res.status(200).json({
      success: true,
      message: 'Discussions fetched successfully',
      data: {
        discussions: formattedDiscussions,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('getDiscussions error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching discussions.',
    });
  }
};

/**
 * @desc    Create a new discussion
 * @route   POST /api/discussions
 * @access  Private (Requires Bearer JWT)
 */
export const createDiscussion = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const {
      title,
      content,
      body,
      subject,
      topics = [],
      tags = [],
      linkedProjectId,
      linkedResourceId,
    } = req.body;

    const discussionContent = (content || body || '').trim();

    if (!title || title.trim().length < 5 || title.trim().length > 180) {
      return res.status(400).json({
        success: false,
        message: 'Discussion title is required and must be between 5 and 180 characters.',
      });
    }

    if (!discussionContent || discussionContent.length < 20 || discussionContent.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Discussion content is required and must be between 20 and 5000 characters.',
      });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Discussion subject is required.',
      });
    }

    // Process tags
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => String(t).trim().replace(/^#/, '')).filter(Boolean);
    } else if (typeof tags === 'string') {
      processedTags = tags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);
    }
    if (processedTags.length === 0) {
      processedTags = [subject.trim()];
    }

    const newDiscussion = await Discussion.create({
      title: title.trim(),
      content: discussionContent,
      subject: subject.trim(),
      topics: Array.isArray(topics) ? topics : [],
      tags: processedTags,
      author: currentUserId,
      status: 'open',
      linkedProjectId: linkedProjectId || null,
      linkedResourceId: linkedResourceId || null,
      votes: [],
      views: 0,
      answers: [],
    });

    await newDiscussion.populate('author', 'name initials department semester avatar');

    const formatted = formatDiscussionResponse(newDiscussion, currentUserId);

    return res.status(201).json({
      success: true,
      message: 'Discussion created successfully',
      data: formatted,
    });
  } catch (error) {
    console.error('createDiscussion error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating discussion.',
    });
  }
};

/**
 * @desc    Get discussion by ID
 * @route   GET /api/discussions/:id
 * @access  Private (Requires Bearer JWT)
 */
export const getDiscussionById = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion ID format.',
      });
    }

    const discussion = await Discussion.findById(id)
      .populate('author', 'name initials department semester avatar')
      .populate('answers.author', 'name initials department semester avatar');

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found.',
      });
    }

    const formatted = formatDiscussionResponse(discussion, currentUserId);

    return res.status(200).json({
      success: true,
      message: 'Discussion fetched successfully',
      data: formatted,
    });
  } catch (error) {
    console.error('getDiscussionById error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching discussion.',
    });
  }
};

/**
 * @desc    Update a discussion (Author only)
 * @route   PATCH /api/discussions/:id
 * @access  Private (Requires Bearer JWT)
 */
export const updateDiscussion = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion ID format.',
      });
    }

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found.',
      });
    }

    if (discussion.author.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the discussion author can edit this discussion.',
      });
    }

    const { title, content, body, subject, topics, tags, status } = req.body;

    if (title !== undefined) {
      if (title.trim().length < 5 || title.trim().length > 180) {
        return res.status(400).json({
          success: false,
          message: 'Title must be between 5 and 180 characters.',
        });
      }
      discussion.title = title.trim();
    }

    const updatedContent = content !== undefined ? content : body;
    if (updatedContent !== undefined) {
      if (updatedContent.trim().length < 20 || updatedContent.trim().length > 5000) {
        return res.status(400).json({
          success: false,
          message: 'Content must be between 20 and 5000 characters.',
        });
      }
      discussion.content = updatedContent.trim();
    }

    if (subject !== undefined) {
      if (!subject.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Subject cannot be empty.',
        });
      }
      discussion.subject = subject.trim();
    }

    if (topics !== undefined) {
      discussion.topics = Array.isArray(topics) ? topics : [];
    }

    if (tags !== undefined) {
      discussion.tags = Array.isArray(tags)
        ? tags.map((t) => String(t).trim().replace(/^#/, '')).filter(Boolean)
        : tags
            .split(',')
            .map((t) => t.trim().replace(/^#/, ''))
            .filter(Boolean);
    }

    if (status !== undefined) {
      if (!['open', 'resolved', 'archived'].includes(status.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Status must be open, resolved, or archived.',
        });
      }
      discussion.status = status.toLowerCase();
    }

    await discussion.save();
    await discussion.populate('author', 'name initials department semester avatar');
    await discussion.populate('answers.author', 'name initials department semester avatar');

    const formatted = formatDiscussionResponse(discussion, currentUserId);

    return res.status(200).json({
      success: true,
      message: 'Discussion updated successfully',
      data: formatted,
    });
  } catch (error) {
    console.error('updateDiscussion error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating discussion.',
    });
  }
};

/**
 * @desc    Soft-delete / archive discussion (Author only)
 * @route   DELETE /api/discussions/:id
 * @access  Private (Requires Bearer JWT)
 */
export const deleteDiscussion = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion ID format.',
      });
    }

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found.',
      });
    }

    if (discussion.author.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the discussion author can delete this discussion.',
      });
    }

    discussion.status = 'archived';
    await discussion.save();

    return res.status(200).json({
      success: true,
      message: 'Discussion archived successfully',
    });
  } catch (error) {
    console.error('deleteDiscussion error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting discussion.',
    });
  }
};

/**
 * @desc    Toggle upvote for discussion
 * @route   POST /api/discussions/:id/vote
 * @access  Private (Requires Bearer JWT)
 */
export const toggleVoteDiscussion = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion ID format.',
      });
    }

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found.',
      });
    }

    const userIdStr = currentUserId.toString();
    const existingIndex = discussion.votes.findIndex(
      (v) => (v?._id || v)?.toString() === userIdStr
    );

    let isVoted = false;
    if (existingIndex > -1) {
      // Remove vote
      discussion.votes.splice(existingIndex, 1);
      isVoted = false;
    } else {
      // Add vote
      discussion.votes.push(currentUserId);
      isVoted = true;
    }

    await discussion.save();

    return res.status(200).json({
      success: true,
      message: isVoted ? 'Discussion upvoted' : 'Vote removed',
      data: {
        discussionId: id,
        voteCount: discussion.votes.length,
        isVotedByCurrentUser: isVoted,
      },
    });
  } catch (error) {
    console.error('toggleVoteDiscussion error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while voting on discussion.',
    });
  }
};

/**
 * @desc    Increment view count on discussion
 * @route   POST /api/discussions/:id/view
 * @access  Private (Requires Bearer JWT)
 */
export const incrementViewCount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion ID format.',
      });
    }

    const discussion = await Discussion.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true, select: 'views' }
    );

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'View counted',
      data: {
        discussionId: id,
        views: discussion.views,
        viewCount: discussion.views,
      },
    });
  } catch (error) {
    console.error('incrementViewCount error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while incrementing views.',
    });
  }
};

/**
 * @desc    Add an answer to a discussion
 * @route   POST /api/discussions/:id/answers
 * @access  Private (Requires Bearer JWT)
 */
export const addAnswer = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;
    const { content, body } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion ID format.',
      });
    }

    const answerContent = (content || body || '').trim();
    if (!answerContent || answerContent.length < 5 || answerContent.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Answer content is required and must be between 5 and 5000 characters.',
      });
    }

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found.',
      });
    }

    if (discussion.status === 'archived') {
      return res.status(400).json({
        success: false,
        message: 'Cannot add answers to an archived discussion.',
      });
    }

    const newAnswer = {
      content: answerContent,
      author: currentUserId,
      votes: [],
      isAccepted: false,
    };

    discussion.answers.push(newAnswer);
    await discussion.save();

    await discussion.populate('author', 'name initials department semester avatar');
    await discussion.populate('answers.author', 'name initials department semester avatar');

    const formatted = formatDiscussionResponse(discussion, currentUserId);
    const createdAnswer = formatted.answers[formatted.answers.length - 1];

    return res.status(201).json({
      success: true,
      message: 'Answer posted successfully',
      data: {
        answer: createdAnswer,
        discussion: formatted,
      },
    });
  } catch (error) {
    console.error('addAnswer error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while posting answer.',
    });
  }
};

/**
 * @desc    Update an answer (Answer author only)
 * @route   PATCH /api/discussions/:id/answers/:answerId
 * @access  Private (Requires Bearer JWT)
 */
export const updateAnswer = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id, answerId } = req.params;
    const { content, body } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion or answer ID format.',
      });
    }

    const answerContent = (content || body || '').trim();
    if (!answerContent || answerContent.length < 5 || answerContent.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Answer content must be between 5 and 5000 characters.',
      });
    }

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found.',
      });
    }

    const answer = discussion.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found.',
      });
    }

    if (answer.author.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the answer author can edit this answer.',
      });
    }

    answer.content = answerContent;
    await discussion.save();

    await discussion.populate('author', 'name initials department semester avatar');
    await discussion.populate('answers.author', 'name initials department semester avatar');

    const formatted = formatDiscussionResponse(discussion, currentUserId);
    const updatedAnswer = formatted.answers.find((a) => a.id === answerId);

    return res.status(200).json({
      success: true,
      message: 'Answer updated successfully',
      data: {
        answer: updatedAnswer,
        discussion: formatted,
      },
    });
  } catch (error) {
    console.error('updateAnswer error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating answer.',
    });
  }
};

/**
 * @desc    Delete an answer (Answer author only)
 * @route   DELETE /api/discussions/:id/answers/:answerId
 * @access  Private (Requires Bearer JWT)
 */
export const deleteAnswer = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id, answerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion or answer ID format.',
      });
    }

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found.',
      });
    }

    const answer = discussion.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found.',
      });
    }

    if (answer.author.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the answer author can delete this answer.',
      });
    }

    const wasAccepted = answer.isAccepted;
    discussion.answers.pull({ _id: answerId });

    // If the deleted answer was accepted, check if other accepted answers remain
    if (wasAccepted) {
      const remainingAccepted = discussion.answers.some((a) => a.isAccepted);
      if (!remainingAccepted && discussion.status === 'resolved') {
        discussion.status = 'open';
      }
    }

    await discussion.save();

    return res.status(200).json({
      success: true,
      message: 'Answer deleted successfully',
    });
  } catch (error) {
    console.error('deleteAnswer error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting answer.',
    });
  }
};

/**
 * @desc    Toggle upvote for an answer
 * @route   POST /api/discussions/:id/answers/:answerId/vote
 * @access  Private (Requires Bearer JWT)
 */
export const toggleVoteAnswer = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id, answerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion or answer ID format.',
      });
    }

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found.',
      });
    }

    const answer = discussion.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found.',
      });
    }

    const userIdStr = currentUserId.toString();
    const existingIndex = answer.votes.findIndex(
      (v) => (v?._id || v)?.toString() === userIdStr
    );

    let isVoted = false;
    if (existingIndex > -1) {
      answer.votes.splice(existingIndex, 1);
      isVoted = false;
    } else {
      answer.votes.push(currentUserId);
      isVoted = true;
    }

    await discussion.save();

    return res.status(200).json({
      success: true,
      message: isVoted ? 'Answer upvoted' : 'Vote removed',
      data: {
        discussionId: id,
        answerId,
        voteCount: answer.votes.length,
        isVotedByCurrentUser: isVoted,
      },
    });
  } catch (error) {
    console.error('toggleVoteAnswer error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while voting on answer.',
    });
  }
};

/**
 * @desc    Mark or unmark an answer as accepted (Discussion author only)
 * @route   POST /api/discussions/:id/answers/:answerId/accept
 * @access  Private (Requires Bearer JWT)
 */
export const toggleAcceptAnswer = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id, answerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(answerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discussion or answer ID format.',
      });
    }

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found.',
      });
    }

    // Only discussion author can mark answer as accepted
    if (discussion.author.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the discussion author can accept an answer.',
      });
    }

    const targetAnswer = discussion.answers.id(answerId);
    if (!targetAnswer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found.',
      });
    }

    let isNowAccepted = false;
    if (targetAnswer.isAccepted) {
      // Toggle off
      targetAnswer.isAccepted = false;
      isNowAccepted = false;
      discussion.status = 'open';
    } else {
      // Unset any other accepted answer
      discussion.answers.forEach((ans) => {
        ans.isAccepted = false;
      });
      targetAnswer.isAccepted = true;
      isNowAccepted = true;
      discussion.status = 'resolved';
    }

    await discussion.save();
    await discussion.populate('author', 'name initials department semester avatar');
    await discussion.populate('answers.author', 'name initials department semester avatar');

    const formatted = formatDiscussionResponse(discussion, currentUserId);

    return res.status(200).json({
      success: true,
      message: isNowAccepted
        ? 'Answer marked as accepted solution'
        : 'Accepted solution marker removed',
      data: {
        discussionId: id,
        answerId,
        isAccepted: isNowAccepted,
        discussion: formatted,
      },
    });
  } catch (error) {
    console.error('toggleAcceptAnswer error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating accepted answer.',
    });
  }
};

