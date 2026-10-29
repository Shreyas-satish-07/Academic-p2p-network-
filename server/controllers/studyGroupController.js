import mongoose from 'mongoose';
import StudyGroup from '../models/StudyGroup.js';

/**
 * Helper to escape special characters for regular expressions
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Consistent formatter for StudyGroup documents returning safe, UI-ready member and group data
 */
export const formatGroupResponse = (groupDoc, currentUserId) => {
  if (!groupDoc) return null;
  const group = typeof groupDoc.toObject === 'function' ? groupDoc.toObject() : { ...groupDoc };
  const currentUserIdStr = currentUserId ? currentUserId.toString() : '';

  const members = (group.members || []).map((m) => {
    const userObj = m.user && typeof m.user === 'object' ? m.user : null;
    const userId = userObj ? (userObj._id || userObj.id)?.toString() : m.user?.toString();
    const userName = userObj?.name || 'Cohort Student';
    const userInitials =
      userObj?.initials ||
      userName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');

    return {
      id: userId,
      _id: userId,
      name: userName,
      initials: userInitials,
      department: userObj?.department || '',
      semester: userObj?.semester || '',
      avatar: userObj?.avatar || { url: '' },
      role: m.role || 'member',
      joinedAt: m.joinedAt,
      isOnline: true,
    };
  });

  const createdById = group.createdBy && typeof group.createdBy === 'object'
    ? (group.createdBy._id || group.createdBy.id)?.toString()
    : group.createdBy?.toString();

  const isOwner = Boolean(currentUserIdStr && createdById === currentUserIdStr);
  const isJoined = members.some((m) => m.id === currentUserIdStr);

  const ownerUser = group.createdBy && typeof group.createdBy === 'object' ? group.createdBy : null;
  const ownerName = ownerUser?.name || (members.find((m) => m.role === 'owner')?.name) || 'Lead Peer';
  const ownerInitials =
    ownerUser?.initials ||
    ownerName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');

  const days = Array.isArray(group.schedule?.days) ? group.schedule.days : [];
  const scheduleTime = group.schedule?.time || '';
  const formattedSchedule =
    days.length > 0
      ? `${days.join(', ')}${scheduleTime ? ` • ${scheduleTime}` : ''}`
      : scheduleTime || 'Flexible Schedule';

  const topicsList = Array.isArray(group.topics) && group.topics.length > 0
    ? group.topics
    : (Array.isArray(group.tags) ? group.tags : []);

  const rawLevel = group.level || 'all';
  const difficultyDisplay =
    rawLevel.charAt(0).toUpperCase() + rawLevel.slice(1);

  return {
    ...group,
    id: group._id?.toString() || group.id,
    _id: group._id?.toString() || group.id,
    members,
    memberCount: members.length,
    joined: isJoined,
    isOwner,
    tags: topicsList,
    topics: topicsList,
    difficulty: difficultyDisplay,
    level: rawLevel,
    avatarColor: group.avatarColor || '#2F5D50',
    owner: {
      id: createdById || '',
      name: ownerName,
      initials: ownerInitials,
      role: 'Host',
    },
    meetingSchedule: formattedSchedule,
    activeToday: group.activeToday !== undefined ? group.activeToday : true,
    isLive: Boolean(group.isLive),
    activityLevel: group.activityLevel || 'Medium',
  };
};

/**
 * @desc    Get all study groups with search, filtering, sorting, and pagination
 * @route   GET /api/study-groups
 * @access  Private (Requires Bearer JWT)
 */
export const getStudyGroups = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const {
      search,
      subject,
      level,
      meetingMode,
      availability,
      day,
      hasSpace,
      joinedOnly,
      page = 1,
      limit = 12,
      sort = 'most-active',
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

    // Build filter query
    const query = {};

    // Exclude archived by default unless specifically queried
    if (status && ['active', 'archived'].includes(status.toLowerCase())) {
      query.status = status.toLowerCase();
    } else {
      query.status = 'active';
    }

    // Search across name, subject, description, topics
    if (search && search.trim()) {
      const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [
        { name: searchRegex },
        { subject: searchRegex },
        { description: searchRegex },
        { topics: searchRegex },
      ];
    }

    // Subject filter
    if (
      subject &&
      subject.trim().toLowerCase() !== 'all' &&
      subject.trim().toLowerCase() !== 'all subjects'
    ) {
      query.subject = new RegExp(`^${escapeRegex(subject.trim())}$`, 'i');
    }

    // Level filter
    if (
      level &&
      level.trim().toLowerCase() !== 'all' &&
      level.trim().toLowerCase() !== 'all difficulties'
    ) {
      query.level = level.trim().toLowerCase();
    }

    // Meeting mode filter
    if (
      meetingMode &&
      ['online', 'offline', 'hybrid'].includes(meetingMode.trim().toLowerCase())
    ) {
      query.meetingMode = meetingMode.trim().toLowerCase();
    }

    // Availability / Day filter
    const dayFilter = availability || day;
    if (
      dayFilter &&
      dayFilter.trim().toLowerCase() !== 'all' &&
      dayFilter.trim().toLowerCase() !== 'all times'
    ) {
      query['schedule.days'] = {
        $regex: new RegExp(escapeRegex(dayFilter.trim()), 'i'),
      };
    }

    // Has space filter
    if (hasSpace === 'true' || hasSpace === true) {
      query.$expr = { $lt: [{ $size: '$members' }, '$maxMembers'] };
    }

    // Joined only filter (user is a member)
    if (joinedOnly === 'true' || joinedOnly === true) {
      query['members.user'] = currentUserId;
    }

    const total = await StudyGroup.countDocuments(query);
    const totalPages = Math.ceil(total / parsedLimit);
    const skip = (parsedPage - 1) * parsedLimit;

    // Aggregation pipeline to support dynamic sorting by member count & available spots
    const pipeline = [
      { $match: query },
      {
        $addFields: {
          memberCount: { $size: '$members' },
          availableSpots: { $subtract: ['$maxMembers', { $size: '$members' }] },
        },
      },
    ];

    if (sort === 'most-members') {
      pipeline.push({ $sort: { memberCount: -1, createdAt: -1 } });
    } else if (sort === 'available-spots') {
      pipeline.push({ $sort: { availableSpots: -1, createdAt: -1 } });
    } else if (sort === 'alphabetical' || sort === 'name') {
      pipeline.push({ $sort: { name: 1 } });
    } else if (sort === 'newest') {
      pipeline.push({ $sort: { createdAt: -1 } });
    } else {
      // Default: most-active
      pipeline.push({ $sort: { updatedAt: -1, memberCount: -1 } });
    }

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parsedLimit });

    const rawGroups = await StudyGroup.aggregate(pipeline);

    // Populate members.user and createdBy
    await StudyGroup.populate(rawGroups, [
      { path: 'members.user', select: 'name initials department semester avatar' },
      { path: 'createdBy', select: 'name initials department semester avatar' },
    ]);

    const formattedGroups = rawGroups.map((g) => formatGroupResponse(g, currentUserId));

    return res.status(200).json({
      success: true,
      message: 'Study groups fetched successfully',
      data: {
        groups: formattedGroups,
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
 * @desc    Create a new study group
 * @route   POST /api/study-groups
 * @access  Private (Requires Bearer JWT)
 */
export const createStudyGroup = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const {
      name,
      description,
      subject,
      topics,
      tags,
      level,
      difficulty,
      meetingMode,
      location,
      schedule,
      meetingSchedule,
      maxMembers,
      avatarColor,
    } = req.body;

    // Validation
    if (!name || name.trim().length < 3 || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Group name is required and must be between 3 and 100 characters.',
      });
    }

    if (!description || description.trim().length === 0 || description.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Description is required and cannot exceed 1000 characters.',
      });
    }

    if (!subject || subject.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Subject is required.',
      });
    }

    const parsedMaxMembers = Number(maxMembers);
    if (isNaN(parsedMaxMembers) || parsedMaxMembers < 2 || parsedMaxMembers > 50) {
      return res.status(400).json({
        success: false,
        message: 'Maximum members capacity is required and must be between 2 and 50.',
      });
    }

    // Process topics / tags
    let parsedTopics = [];
    if (Array.isArray(topics)) {
      parsedTopics = topics.map((t) => String(t).trim()).filter(Boolean);
    } else if (Array.isArray(tags)) {
      parsedTopics = tags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof topics === 'string' && topics.trim()) {
      parsedTopics = topics.split(',').map((t) => t.trim()).filter(Boolean);
    } else if (typeof tags === 'string' && tags.trim()) {
      parsedTopics = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    // Normalize level
    const rawLevel = (level || difficulty || 'all').toString().trim().toLowerCase();
    const validLevels = ['beginner', 'intermediate', 'advanced', 'all'];
    const finalLevel = validLevels.includes(rawLevel) ? rawLevel : 'all';

    // Normalize meetingMode
    const rawMode = (meetingMode || 'online').toString().trim().toLowerCase();
    const validModes = ['online', 'offline', 'hybrid'];
    const finalMode = validModes.includes(rawMode) ? rawMode : 'online';

    // Parse schedule
    let parsedSchedule = { days: [], time: '', timezone: 'IST' };
    if (schedule && typeof schedule === 'object') {
      parsedSchedule = {
        days: Array.isArray(schedule.days) ? schedule.days : [],
        time: schedule.time ? String(schedule.time).trim() : '',
        timezone: schedule.timezone ? String(schedule.timezone).trim() : 'IST',
      };
    } else if (typeof meetingSchedule === 'string' && meetingSchedule.trim()) {
      const parts = meetingSchedule.split('•').map((p) => p.trim());
      parsedSchedule = {
        days: parts[0] ? [parts[0]] : [],
        time: parts[1] || '',
        timezone: 'IST',
      };
    }

    // Palette of colors for avatar
    const fallbackColors = ['#2F5D50', '#445372', '#E1993A', '#3B7565', '#C1502E'];
    const chosenColor =
      avatarColor ||
      fallbackColors[Math.floor(Math.random() * fallbackColors.length)];

    // Creator becomes owner and first member automatically
    const newGroup = await StudyGroup.create({
      name: name.trim(),
      description: description.trim(),
      subject: subject.trim(),
      topics: parsedTopics,
      level: finalLevel,
      meetingMode: finalMode,
      location: location ? String(location).trim() : '',
      schedule: parsedSchedule,
      maxMembers: parsedMaxMembers,
      members: [
        {
          user: currentUserId,
          role: 'owner',
          joinedAt: new Date(),
        },
      ],
      createdBy: currentUserId,
      status: 'active',
      avatarColor: chosenColor,
    });

    await newGroup.populate([
      { path: 'members.user', select: 'name initials department semester avatar' },
      { path: 'createdBy', select: 'name initials department semester avatar' },
    ]);

    return res.status(201).json({
      success: true,
      message: 'Study group created successfully',
      data: {
        group: formatGroupResponse(newGroup, currentUserId),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get study group details by ID
 * @route   GET /api/study-groups/:id
 * @access  Private (Requires Bearer JWT)
 */
export const getStudyGroupById = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid study group ID format.',
      });
    }

    const group = await StudyGroup.findById(id)
      .populate('members.user', 'name initials department semester avatar')
      .populate('createdBy', 'name initials department semester avatar');

    if (!group || group.status === 'archived') {
      return res.status(404).json({
        success: false,
        message: 'Study group not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Study group fetched successfully',
      data: {
        group: formatGroupResponse(group, currentUserId),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update study group (Owner only)
 * @route   PATCH /api/study-groups/:id
 * @access  Private (Requires Bearer JWT)
 */
export const updateStudyGroup = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid study group ID format.',
      });
    }

    const group = await StudyGroup.findById(id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Study group not found.',
      });
    }

    // Authorization rule: Only owner can edit
    const isOwner = group.createdBy.toString() === currentUserId.toString();
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the group owner can update this study group.',
      });
    }

    const {
      name,
      description,
      subject,
      topics,
      tags,
      level,
      difficulty,
      meetingMode,
      location,
      schedule,
      meetingSchedule,
      maxMembers,
      avatarColor,
      status,
    } = req.body;

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Group name must be between 3 and 100 characters.',
        });
      }
      group.name = name.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim().length === 0 || description.trim().length > 1000) {
        return res.status(400).json({
          success: false,
          message: 'Description cannot exceed 1000 characters.',
        });
      }
      group.description = description.trim();
    }

    if (subject !== undefined) {
      if (typeof subject !== 'string' || subject.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Subject cannot be empty.',
        });
      }
      group.subject = subject.trim();
    }

    if (maxMembers !== undefined) {
      const parsedMax = Number(maxMembers);
      if (isNaN(parsedMax) || parsedMax < 2 || parsedMax > 50) {
        return res.status(400).json({
          success: false,
          message: 'Maximum members capacity must be between 2 and 50.',
        });
      }
      if (parsedMax < group.members.length) {
        return res.status(400).json({
          success: false,
          message: `Cannot reduce capacity to ${parsedMax}; group already has ${group.members.length} members.`,
        });
      }
      group.maxMembers = parsedMax;
    }

    if (topics !== undefined || tags !== undefined) {
      const rawTopics = topics !== undefined ? topics : tags;
      if (Array.isArray(rawTopics)) {
        group.topics = rawTopics.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof rawTopics === 'string') {
        group.topics = rawTopics.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    if (level !== undefined || difficulty !== undefined) {
      const rawLevel = (level || difficulty).toString().trim().toLowerCase();
      const validLevels = ['beginner', 'intermediate', 'advanced', 'all'];
      if (validLevels.includes(rawLevel)) {
        group.level = rawLevel;
      }
    }

    if (meetingMode !== undefined) {
      const rawMode = meetingMode.toString().trim().toLowerCase();
      const validModes = ['online', 'offline', 'hybrid'];
      if (validModes.includes(rawMode)) {
        group.meetingMode = rawMode;
      }
    }

    if (location !== undefined) {
      group.location = String(location).trim();
    }

    if (schedule && typeof schedule === 'object') {
      group.schedule = {
        days: Array.isArray(schedule.days) ? schedule.days : group.schedule.days,
        time: schedule.time !== undefined ? String(schedule.time).trim() : group.schedule.time,
        timezone: schedule.timezone !== undefined ? String(schedule.timezone).trim() : group.schedule.timezone,
      };
    } else if (typeof meetingSchedule === 'string' && meetingSchedule.trim()) {
      const parts = meetingSchedule.split('•').map((p) => p.trim());
      group.schedule = {
        days: parts[0] ? [parts[0]] : group.schedule.days,
        time: parts[1] || group.schedule.time,
        timezone: group.schedule.timezone || 'IST',
      };
    }

    if (avatarColor !== undefined) {
      group.avatarColor = String(avatarColor).trim();
    }

    if (status !== undefined && ['active', 'archived'].includes(status.toLowerCase())) {
      group.status = status.toLowerCase();
    }

    await group.save();

    await group.populate([
      { path: 'members.user', select: 'name initials department semester avatar' },
      { path: 'createdBy', select: 'name initials department semester avatar' },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Study group updated successfully',
      data: {
        group: formatGroupResponse(group, currentUserId),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft-delete/archive study group (Owner only)
 * @route   DELETE /api/study-groups/:id
 * @access  Private (Requires Bearer JWT)
 */
export const deleteStudyGroup = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid study group ID format.',
      });
    }

    const group = await StudyGroup.findById(id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Study group not found.',
      });
    }

    // Authorization rule: Only owner can delete
    const isOwner = group.createdBy.toString() === currentUserId.toString();
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Only the group owner can delete this study group.',
      });
    }

    // Soft-delete by setting status to archived rather than deleting MongoDB data
    group.status = 'archived';
    await group.save();

    return res.status(200).json({
      success: true,
      message: 'Study group archived successfully',
      data: {
        id: group._id.toString(),
        status: 'archived',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Join study group
 * @route   POST /api/study-groups/:id/join
 * @access  Private (Requires Bearer JWT)
 */
export const joinStudyGroup = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid study group ID format.',
      });
    }

    const group = await StudyGroup.findById(id);

    if (!group || group.status === 'archived') {
      return res.status(404).json({
        success: false,
        message: 'Study group not found.',
      });
    }

    // Check duplicate membership
    const alreadyMember = group.members.some(
      (m) => (m.user?._id || m.user).toString() === currentUserId.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this study group.',
      });
    }

    // Check group capacity
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'This study group has reached its maximum member capacity.',
      });
    }

    group.members.push({
      user: currentUserId,
      role: 'member',
      joinedAt: new Date(),
    });

    await group.save();

    await group.populate([
      { path: 'members.user', select: 'name initials department semester avatar' },
      { path: 'createdBy', select: 'name initials department semester avatar' },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Successfully joined the study group',
      data: {
        group: formatGroupResponse(group, currentUserId),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Leave study group
 * @route   POST /api/study-groups/:id/leave
 * @access  Private (Requires Bearer JWT)
 */
export const leaveStudyGroup = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid study group ID format.',
      });
    }

    const group = await StudyGroup.findById(id);

    if (!group || group.status === 'archived') {
      return res.status(404).json({
        success: false,
        message: 'Study group not found.',
      });
    }

    const memberIndex = group.members.findIndex(
      (m) => (m.user?._id || m.user).toString() === currentUserId.toString()
    );

    if (memberIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this study group.',
      });
    }

    // Rule: Owner cannot leave unless ownership is transferred
    const member = group.members[memberIndex];
    const isGroupOwner =
      group.createdBy.toString() === currentUserId.toString() ||
      member.role === 'owner';

    if (isGroupOwner) {
      return res.status(400).json({
        success: false,
        message: 'Group owner cannot leave the study group without transferring ownership.',
      });
    }

    group.members.splice(memberIndex, 1);
    await group.save();

    await group.populate([
      { path: 'members.user', select: 'name initials department semester avatar' },
      { path: 'createdBy', select: 'name initials department semester avatar' },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Successfully left the study group',
      data: {
        group: formatGroupResponse(group, currentUserId),
      },
    });
  } catch (error) {
    next(error);
  }
};

