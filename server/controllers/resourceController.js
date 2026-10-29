import mongoose from 'mongoose';
import Resource from '../models/Resource.js';

/**
 * Helper to escape special characters for regex search
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Format date for friendly UI display, e.g. "Oct 28, 2026"
 */
const formatDate = (dateObj) => {
  if (!dateObj) return 'Recently';
  try {
    const d = new Date(dateObj);
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
 * Formats a resource document for clean, secure, and UI-friendly consumption
 */
export const formatResourceResponse = (resourceDoc, currentUserId) => {
  if (!resourceDoc) return null;
  const res = typeof resourceDoc.toObject === 'function' ? resourceDoc.toObject() : { ...resourceDoc };
  const currentUserIdStr = currentUserId ? currentUserId.toString() : '';

  const creatorObj = res.createdBy && typeof res.createdBy === 'object' ? res.createdBy : null;
  const creatorId = creatorObj ? (creatorObj._id || creatorObj.id)?.toString() : res.createdBy?.toString();
  const creatorName = creatorObj?.name || 'Cohort Student';
  const creatorInitials =
    creatorObj?.initials ||
    creatorName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');

  const isOwner = Boolean(currentUserIdStr && creatorId === currentUserIdStr);

  const likesList = Array.isArray(res.likes) ? res.likes : [];
  const savesList = Array.isArray(res.saves) ? res.saves : [];

  const isLiked = likesList.some((id) => (id?._id || id)?.toString() === currentUserIdStr);
  const isSaved = savesList.some((id) => (id?._id || id)?.toString() === currentUserIdStr);

  // Map display type
  let displayType = 'Link';
  switch (res.resourceType) {
    case 'document':
      displayType = 'Document';
      break;
    case 'video':
      displayType = 'Video';
      break;
    case 'course':
      displayType = 'Course';
      break;
    case 'tool':
      displayType = 'Tool';
      break;
    case 'link':
      displayType = 'Link';
      break;
    default:
      displayType = res.resourceType
        ? res.resourceType.charAt(0).toUpperCase() + res.resourceType.slice(1)
        : 'Link';
  }

  const tagsList = Array.isArray(res.tags) && res.tags.length > 0 ? res.tags : (res.topics || []);

  return {
    ...res,
    id: res._id?.toString() || res.id,
    _id: res._id?.toString() || res.id,
    likeCount: likesList.length,
    saveCount: savesList.length,
    downloadCount: likesList.length, // Fallback for card UI download metric
    viewCount: Number(res.viewCount) || 0,
    isLikedByCurrentUser: isLiked,
    isSavedByCurrentUser: isSaved,
    isSaved: isSaved,
    isOwner,
    fileUrl: res.url,
    url: res.url,
    type: displayType,
    tags: tagsList,
    topics: Array.isArray(res.topics) ? res.topics : tagsList,
    uploadDate: formatDate(res.createdAt),
    uploader: creatorName,
    uploaderInitials: creatorInitials,
    creator: {
      id: creatorId || '',
      _id: creatorId || '',
      name: creatorName,
      initials: creatorInitials,
      department: creatorObj?.department || '',
      semester: creatorObj?.semester || '',
      avatar: creatorObj?.avatar || { url: '' },
    },
  };
};

/**
 * @desc    Get all accessible resources with search, filtering, and sorting
 * @route   GET /api/resources
 * @access  Private (Requires Bearer JWT)
 */
export const getResources = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const {
      search,
      subject,
      resourceType,
      type,
      level,
      tags,
      mine,
      saved,
      page = 1,
      limit = 12,
      sort = 'newest',
      status,
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

    // Base query: exclude archived by default
    const query = {};
    if (status && ['active', 'archived'].includes(status.toLowerCase())) {
      query.status = status.toLowerCase();
    } else {
      query.status = 'active';
    }

    // Visibility rules:
    // If mine=true: show all resources created by current user (public & private)
    // Otherwise: public resources OR private resources created by current user
    if (mine === 'true' || mine === true) {
      query.createdBy = currentUserId;
    } else {
      query.$or = [{ visibility: 'public' }, { createdBy: currentUserId }];
    }

    // Saved filter
    if (saved === 'true' || saved === true) {
      query.saves = currentUserId;
    }

    // Search query across title, description, subject, topics, tags
    if (search && search.trim()) {
      const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
      const searchCondition = [
        { title: searchRegex },
        { description: searchRegex },
        { subject: searchRegex },
        { topics: searchRegex },
        { tags: searchRegex },
      ];

      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchCondition }];
        delete query.$or;
      } else {
        query.$or = searchCondition;
      }
    }

    // Subject filter
    if (
      subject &&
      subject.trim().toLowerCase() !== 'all' &&
      subject.trim().toLowerCase() !== 'all subjects'
    ) {
      query.subject = new RegExp(`^${escapeRegex(subject.trim())}$`, 'i');
    }

    // Resource Type filter (support both resourceType and frontend type)
    const rawType = resourceType || type;
    if (
      rawType &&
      rawType.trim().toLowerCase() !== 'all' &&
      rawType.trim().toLowerCase() !== 'all types'
    ) {
      const cleanedType = rawType.trim().toLowerCase();
      // Map frontend types like PDF, Notes, PPT to document
      if (['pdf', 'notes', 'ppt', 'cheat sheet', 'research paper', 'document'].includes(cleanedType)) {
        query.resourceType = 'document';
      } else if (['link', 'video', 'course', 'tool', 'other'].includes(cleanedType)) {
        query.resourceType = cleanedType;
      } else {
        query.resourceType = cleanedType;
      }
    }

    // Level filter
    if (
      level &&
      level.trim().toLowerCase() !== 'all' &&
      level.trim().toLowerCase() !== 'all levels'
    ) {
      query.level = level.trim().toLowerCase();
    }

    // Tags filter
    if (tags && tags.trim()) {
      const tagList = tags.split(',').map((t) => new RegExp(`^${escapeRegex(t.trim())}$`, 'i'));
      query.$or = query.$or
        ? [{ $or: query.$or }, { tags: { $in: tagList } }, { topics: { $in: tagList } }]
        : [{ tags: { $in: tagList } }, { topics: { $in: tagList } }];
    }

    const total = await Resource.countDocuments(query);
    const totalPages = Math.ceil(total / parsedLimit);
    const skip = (parsedPage - 1) * parsedLimit;

    // Aggregation pipeline to support sorting by likes, saves, views, title, or newest
    const pipeline = [
      { $match: query },
      {
        $addFields: {
          likeCount: { $size: '$likes' },
          saveCount: { $size: '$saves' },
        },
      },
    ];

    if (sort === 'popular') {
      pipeline.push({ $sort: { viewCount: -1, likeCount: -1, createdAt: -1 } });
    } else if (sort === 'mostLiked') {
      pipeline.push({ $sort: { likeCount: -1, createdAt: -1 } });
    } else if (sort === 'mostViewed' || sort === 'views') {
      pipeline.push({ $sort: { viewCount: -1, createdAt: -1 } });
    } else if (sort === 'title' || sort === 'alphabetical') {
      pipeline.push({ $sort: { title: 1 } });
    } else {
      // Default: newest
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parsedLimit });

    const rawResources = await Resource.aggregate(pipeline);

    // Populate creator safe fields
    await Resource.populate(rawResources, [
      { path: 'createdBy', select: 'name initials department semester avatar' },
    ]);

    const formattedResources = rawResources.map((r) => formatResourceResponse(r, currentUserId));

    return res.status(200).json({
      success: true,
      message: 'Resources fetched successfully',
      data: {
        resources: formattedResources,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new academic resource
 * @route   POST /api/resources
 * @access  Private (Requires Bearer JWT)
 */
export const createResource = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const {
      title,
      description,
      resourceType,
      type,
      url,
      fileUrl,
      externalUrl,
      subject,
      topics,
      tags,
      level,
      visibility,
      thumbnailColor,
      fileSize,
    } = req.body;

    // Validation
    if (!title || title.trim().length < 3 || title.trim().length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Resource title is required and must be between 3 and 150 characters.',
      });
    }

    if (!description || description.trim().length === 0 || description.trim().length > 1500) {
      return res.status(400).json({
        success: false,
        message: 'Description is required and cannot exceed 1500 characters.',
      });
    }

    if (!subject || subject.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Subject is required.',
      });
    }

    const targetUrl = (url || fileUrl || externalUrl || '').trim();
    if (!targetUrl) {
      return res.status(400).json({
        success: false,
        message: 'Resource URL is required.',
      });
    }

    const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/i;
    if (!urlPattern.test(targetUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid HTTP or HTTPS resource URL.',
      });
    }

    // Normalize resourceType
    let finalType = 'link';
    const rawType = (resourceType || type || 'link').toLowerCase().trim();
    if (['pdf', 'notes', 'ppt', 'cheat sheet', 'research paper', 'document'].includes(rawType)) {
      finalType = 'document';
    } else if (['link', 'video', 'course', 'tool', 'other'].includes(rawType)) {
      finalType = rawType;
    }

    // Normalize level
    let finalLevel = 'all';
    const rawLevel = (level || 'all').toLowerCase().trim();
    if (['beginner', 'intermediate', 'advanced', 'all'].includes(rawLevel)) {
      finalLevel = rawLevel;
    }

    // Normalize visibility
    let finalVisibility = 'public';
    const rawVisibility = (visibility || 'public').toLowerCase().trim();
    if (['public', 'private'].includes(rawVisibility)) {
      finalVisibility = rawVisibility;
    }

    // Parse topics and tags
    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof tags === 'string' && tags.trim()) {
      parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    let parsedTopics = [];
    if (Array.isArray(topics)) {
      parsedTopics = topics.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof topics === 'string' && topics.trim()) {
      parsedTopics = topics.split(',').map((t) => t.trim()).filter(Boolean);
    } else {
      parsedTopics = parsedTags;
    }

    const newResource = await Resource.create({
      title: title.trim(),
      description: description.trim(),
      resourceType: finalType,
      url: targetUrl,
      subject: subject.trim(),
      topics: parsedTopics.length > 0 ? parsedTopics : [subject.trim()],
      tags: parsedTags.length > 0 ? parsedTags : [subject.trim()],
      level: finalLevel,
      visibility: finalVisibility,
      createdBy: currentUserId,
      status: 'active',
      thumbnailColor: thumbnailColor || '#2F5D50',
      fileSize: fileSize || 'Web Resource',
    });

    await newResource.populate([
      { path: 'createdBy', select: 'name initials department semester avatar' },
    ]);

    return res.status(201).json({
      success: true,
      message: 'Resource shared successfully',
      data: {
        resource: formatResourceResponse(newResource, currentUserId),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get resource by ID
 * @route   GET /api/resources/:id
 * @access  Private (Requires Bearer JWT)
 */
export const getResourceById = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID format.',
      });
    }

    const resource = await Resource.findById(id).populate([
      { path: 'createdBy', select: 'name initials department semester avatar' },
    ]);

    if (!resource || resource.status === 'archived') {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    // Visibility rule: Private resources visible only to creator
    const isCreator = resource.createdBy?._id?.toString() === currentUserId.toString();
    if (resource.visibility === 'private' && !isCreator) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Resource fetched successfully',
      data: {
        resource: formatResourceResponse(resource, currentUserId),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update resource (Creator only)
 * @route   PATCH /api/resources/:id
 * @access  Private (Requires Bearer JWT)
 */
export const updateResource = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID format.',
      });
    }

    const resource = await Resource.findById(id);

    if (!resource || resource.status === 'archived') {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    // Permission rule: Only creator can edit
    const isCreator = resource.createdBy.toString() === currentUserId.toString();
    if (!isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the resource creator can update this resource.',
      });
    }

    const {
      title,
      description,
      resourceType,
      type,
      url,
      fileUrl,
      subject,
      topics,
      tags,
      level,
      visibility,
      thumbnailColor,
    } = req.body;

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 150) {
        return res.status(400).json({
          success: false,
          message: 'Title must be between 3 and 150 characters.',
        });
      }
      resource.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim().length === 0 || description.trim().length > 1500) {
        return res.status(400).json({
          success: false,
          message: 'Description cannot exceed 1500 characters.',
        });
      }
      resource.description = description.trim();
    }

    if (url !== undefined || fileUrl !== undefined) {
      const newUrl = (url || fileUrl || '').trim();
      const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/i;
      if (!urlPattern.test(newUrl)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid HTTP or HTTPS resource URL.',
        });
      }
      resource.url = newUrl;
    }

    if (subject !== undefined) {
      if (typeof subject !== 'string' || subject.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Subject cannot be empty.',
        });
      }
      resource.subject = subject.trim();
    }

    if (resourceType !== undefined || type !== undefined) {
      const rawType = (resourceType || type).toLowerCase().trim();
      if (['pdf', 'notes', 'ppt', 'cheat sheet', 'research paper', 'document'].includes(rawType)) {
        resource.resourceType = 'document';
      } else if (['link', 'video', 'course', 'tool', 'other'].includes(rawType)) {
        resource.resourceType = rawType;
      }
    }

    if (level !== undefined) {
      const rawLevel = level.toLowerCase().trim();
      if (['beginner', 'intermediate', 'advanced', 'all'].includes(rawLevel)) {
        resource.level = rawLevel;
      }
    }

    if (visibility !== undefined) {
      const rawVis = visibility.toLowerCase().trim();
      if (['public', 'private'].includes(rawVis)) {
        resource.visibility = rawVis;
      }
    }

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        resource.tags = tags.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof tags === 'string') {
        resource.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    if (topics !== undefined) {
      if (Array.isArray(topics)) {
        resource.topics = topics.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof topics === 'string') {
        resource.topics = topics.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    if (thumbnailColor !== undefined) {
      resource.thumbnailColor = String(thumbnailColor).trim();
    }

    await resource.save();

    await resource.populate([
      { path: 'createdBy', select: 'name initials department semester avatar' },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: {
        resource: formatResourceResponse(resource, currentUserId),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft-delete/archive resource (Creator only)
 * @route   DELETE /api/resources/:id
 * @access  Private (Requires Bearer JWT)
 */
export const deleteResource = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID format.',
      });
    }

    const resource = await Resource.findById(id);

    if (!resource || resource.status === 'archived') {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    // Permission rule: Only creator can delete
    const isCreator = resource.createdBy.toString() === currentUserId.toString();
    if (!isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the resource creator can delete this resource.',
      });
    }

    // Soft deletion: mark status as archived
    resource.status = 'archived';
    await resource.save();

    return res.status(200).json({
      success: true,
      message: 'Resource archived successfully',
      data: {
        id: resource._id.toString(),
        status: 'archived',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle like on resource
 * @route   POST /api/resources/:id/like
 * @access  Private (Requires Bearer JWT)
 */
export const toggleLikeResource = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID format.',
      });
    }

    const resource = await Resource.findById(id);

    if (!resource || resource.status === 'archived') {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    // Visibility rule
    const isCreator = resource.createdBy.toString() === currentUserId.toString();
    if (resource.visibility === 'private' && !isCreator) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    const isLiked = resource.likes.some((userId) => userId.toString() === currentUserId.toString());

    if (isLiked) {
      resource.likes = resource.likes.filter((userId) => userId.toString() !== currentUserId.toString());
    } else {
      resource.likes.push(currentUserId);
    }

    await resource.save();

    await resource.populate([
      { path: 'createdBy', select: 'name initials department semester avatar' },
    ]);

    return res.status(200).json({
      success: true,
      message: isLiked ? 'Resource unliked successfully' : 'Resource liked successfully',
      data: {
        resource: formatResourceResponse(resource, currentUserId),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle save/bookmark on resource
 * @route   POST /api/resources/:id/save
 * @access  Private (Requires Bearer JWT)
 */
export const toggleSaveResource = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID format.',
      });
    }

    const resource = await Resource.findById(id);

    if (!resource || resource.status === 'archived') {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    // Visibility rule
    const isCreator = resource.createdBy.toString() === currentUserId.toString();
    if (resource.visibility === 'private' && !isCreator) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    const isSaved = resource.saves.some((userId) => userId.toString() === currentUserId.toString());

    if (isSaved) {
      resource.saves = resource.saves.filter((userId) => userId.toString() !== currentUserId.toString());
    } else {
      resource.saves.push(currentUserId);
    }

    await resource.save();

    await resource.populate([
      { path: 'createdBy', select: 'name initials department semester avatar' },
    ]);

    return res.status(200).json({
      success: true,
      message: isSaved ? 'Resource removed from saved collection' : 'Resource saved to collection',
      data: {
        resource: formatResourceResponse(resource, currentUserId),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Increment view count on resource
 * @route   POST /api/resources/:id/view
 * @access  Private (Requires Bearer JWT)
 */
export const incrementViewCount = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID format.',
      });
    }

    const resource = await Resource.findById(id);

    if (!resource || resource.status === 'archived') {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    // Visibility rule
    const isCreator = resource.createdBy.toString() === currentUserId.toString();
    if (resource.visibility === 'private' && !isCreator) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    resource.viewCount = (resource.viewCount || 0) + 1;
    await resource.save();

    await resource.populate([
      { path: 'createdBy', select: 'name initials department semester avatar' },
    ]);

    return res.status(200).json({
      success: true,
      message: 'View count incremented successfully',
      data: {
        resource: formatResourceResponse(resource, currentUserId),
      },
    });
  } catch (error) {
    next(error);
  }
};

