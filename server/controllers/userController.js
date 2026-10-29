import mongoose from 'mongoose';
import User from '../models/User.js';
import { calculateCompatibility } from '../utils/matchingEngine.js';

/**
 * Helper to escape regex special characters
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * @desc    Get discoverable students with compatibility matching & filtering
 * @route   GET /api/users
 * @access  Private (Requires Bearer JWT)
 */
export const getUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Authenticated student session not found.',
      });
    }

    const {
      search,
      skills,
      interests,
      department,
      semester,
      availability,
      page = 1,
      limit = 12,
      sort = 'compatibility',
    } = req.query;

    // Validate page & limit
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

    // Validate sort parameter
    const allowedSorts = ['compatibility', 'best-match', 'newest', 'recently-active', 'name'];
    if (!allowedSorts.includes(sort)) {
      return res.status(400).json({
        success: false,
        message: `Sort must be one of: compatibility, newest, name. Received: "${sort}".`,
      });
    }

    // Build MongoDB query filters
    const andConditions = [];

    // Rule: Exclude the authenticated user from discoverable peers
    andConditions.push({ _id: { $ne: currentUser._id } });

    // 1. Text Search: name, college, department, skills, interests, bio
    if (search && typeof search === 'string' && search.trim()) {
      const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
      andConditions.push({
        $or: [
          { name: searchRegex },
          { college: searchRegex },
          { department: searchRegex },
          { skills: searchRegex },
          { interests: searchRegex },
          { bio: searchRegex },
        ],
      });
    }

    // 2. Department filter
    if (department && department !== 'All Departments' && typeof department === 'string' && department.trim()) {
      andConditions.push({
        department: new RegExp(`^${escapeRegex(department.trim())}$`, 'i'),
      });
    }

    // 3. Semester filter
    if (semester && semester !== 'All Semesters') {
      let semNum = typeof semester === 'string' ? parseInt(semester.replace(/\D/g, ''), 10) : parseInt(semester, 10);
      if (isNaN(semNum) || semNum < 1 || semNum > 12) {
        return res.status(400).json({
          success: false,
          message: 'Semester filter must specify a valid academic term between 1 and 12.',
        });
      }
      andConditions.push({ semester: semNum });
    }

    // 4. Skills filter (comma-separated, peers must possess specified skills)
    if (skills && typeof skills === 'string' && skills.trim()) {
      const skillList = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (skillList.length > 0) {
        const skillRegexes = skillList.map((s) => new RegExp(`^${escapeRegex(s)}$`, 'i'));
        andConditions.push({ skills: { $all: skillRegexes } });
      }
    }

    // 5. Interests filter (comma-separated)
    if (interests && interests !== 'All Interests' && typeof interests === 'string' && interests.trim()) {
      const interestList = interests
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      if (interestList.length > 0) {
        const interestRegexes = interestList.map((i) => new RegExp(`^${escapeRegex(i)}$`, 'i'));
        andConditions.push({ interests: { $in: interestRegexes } });
      }
    }

    // 6. Availability filter
    if (availability && availability !== 'All Times' && typeof availability === 'string' && availability.trim()) {
      const availRegex = new RegExp(escapeRegex(availability.trim()), 'i');
      andConditions.push({
        $or: [
          { 'availability.weekdays': availRegex },
          { 'availability.weekends': availRegex },
          { 'availability.openTo': availRegex },
        ],
      });
    }

    const query = andConditions.length > 1 ? { $and: andConditions } : andConditions[0] || {};

    // Fetch candidate students matching filters
    const candidateDocs = await User.find(query).lean({ virtuals: true });

    // Calculate dynamic compatibility scores for all filtered candidates
    const scoredStudents = candidateDocs.map((doc) => {
      // Exclude password and internal fields
      delete doc.password;
      delete doc.__v;

      const safeStudent = {
        ...doc,
        id: doc._id.toString(),
      };

      const comp = calculateCompatibility(doc, currentUser);

      safeStudent.compatibilityScore = comp.compatibilityScore;
      safeStudent.matchScore = comp.compatibilityScore; // Alias for seamless UI integration
      safeStudent.matchedSkills = comp.matchedSkills;
      safeStudent.matchedInterests = comp.matchedInterests;
      safeStudent.matchReasons = comp.matchReasons;
      safeStudent.breakdown = comp.breakdown;

      return safeStudent;
    });

    // Sort peers based on chosen criteria
    if (sort === 'compatibility' || sort === 'best-match') {
      scoredStudents.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    } else if (sort === 'newest' || sort === 'recently-active') {
      scoredStudents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'name') {
      scoredStudents.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Pagination calculations
    const total = scoredStudents.length;
    const totalPages = Math.ceil(total / parsedLimit);
    const startIndex = (parsedPage - 1) * parsedLimit;
    const paginatedStudents = scoredStudents.slice(startIndex, startIndex + parsedLimit);

    return res.status(200).json({
      success: true,
      message: 'Students fetched successfully',
      data: {
        students: paginatedStudents,
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
 * @desc    Get current authenticated user profile
 * @route   GET /api/users/me
 * @access  Private (Requires Bearer JWT)
 */
export const getMe = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: {
        user: typeof user.toSafeUser === 'function' ? user.toSafeUser() : user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current authenticated user profile
 * @route   PATCH /api/users/me
 * @access  Private (Requires Bearer JWT)
 */
export const updateMe = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    const {
      name,
      college,
      department,
      semester,
      bio,
      skills,
      interests,
      availability,
      avatar,
    } = req.body;

    // 1. Validate & sanitize Name
    if (name !== undefined) {
      if (typeof name !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Name must be a valid text string.',
        });
      }
      const trimmedName = name.trim();
      if (trimmedName.length < 2 || trimmedName.length > 80) {
        return res.status(400).json({
          success: false,
          message: 'Name must be between 2 and 80 characters.',
        });
      }
      user.name = trimmedName;
    }

    // 2. Validate & sanitize College
    if (college !== undefined) {
      if (typeof college !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'College must be a valid text string.',
        });
      }
      const trimmedCollege = college.trim();
      if (!trimmedCollege) {
        return res.status(400).json({
          success: false,
          message: 'College cannot be empty.',
        });
      }
      user.college = trimmedCollege;
    }

    // 3. Validate & sanitize Department
    if (department !== undefined) {
      if (typeof department !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Department must be a valid text string.',
        });
      }
      const trimmedDepartment = department.trim();
      if (!trimmedDepartment) {
        return res.status(400).json({
          success: false,
          message: 'Department cannot be empty.',
        });
      }
      user.department = trimmedDepartment;
    }

    // 4. Validate & sanitize Semester
    if (semester !== undefined && semester !== null) {
      let parsedSemester = semester;
      if (typeof semester === 'string') {
        const match = semester.match(/\d+/);
        parsedSemester = match ? parseInt(match[0], 10) : parseInt(semester, 10);
      }

      if (
        typeof parsedSemester !== 'number' ||
        isNaN(parsedSemester) ||
        !Number.isInteger(parsedSemester) ||
        parsedSemester < 1 ||
        parsedSemester > 12
      ) {
        return res.status(400).json({
          success: false,
          message: 'Semester must be a valid number between 1 and 12.',
        });
      }
      user.semester = parsedSemester;
    }

    // 5. Validate & sanitize Bio
    if (bio !== undefined) {
      if (typeof bio !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Bio must be a valid text string.',
        });
      }
      const trimmedBio = bio.trim();
      if (trimmedBio.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Bio cannot exceed 500 characters.',
        });
      }
      user.bio = trimmedBio;
    }

    // 6. Validate & sanitize Skills
    if (skills !== undefined) {
      if (!Array.isArray(skills) || skills.some((item) => typeof item !== 'string')) {
        return res.status(400).json({
          success: false,
          message: 'Skills must be an array of strings.',
        });
      }
      user.skills = skills.map((item) => item.trim()).filter(Boolean);
    }

    // 7. Validate & sanitize Interests
    if (interests !== undefined) {
      if (!Array.isArray(interests) || interests.some((item) => typeof item !== 'string')) {
        return res.status(400).json({
          success: false,
          message: 'Interests must be an array of strings.',
        });
      }
      user.interests = interests.map((item) => item.trim()).filter(Boolean);
    }

    // 8. Validate & sanitize Availability
    if (availability !== undefined) {
      if (
        typeof availability !== 'object' ||
        availability === null ||
        Array.isArray(availability)
      ) {
        return res.status(400).json({
          success: false,
          message: 'Availability must be a valid configuration object.',
        });
      }

      user.availability = user.availability || {};

      if (availability.weekdays !== undefined) {
        if (typeof availability.weekdays !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Availability weekdays must be a string.',
          });
        }
        user.availability.weekdays = availability.weekdays.trim();
      }

      if (availability.weekends !== undefined) {
        if (typeof availability.weekends !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Availability weekends must be a string.',
          });
        }
        user.availability.weekends = availability.weekends.trim();
      }

      if (availability.preferredTeamSize !== undefined) {
        if (typeof availability.preferredTeamSize !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Availability preferredTeamSize must be a string.',
          });
        }
        user.availability.preferredTeamSize = availability.preferredTeamSize.trim();
      }

      if (availability.openTo !== undefined) {
        if (
          !Array.isArray(availability.openTo) ||
          availability.openTo.some((item) => typeof item !== 'string')
        ) {
          return res.status(400).json({
            success: false,
            message: 'Availability openTo must be an array of strings.',
          });
        }
        user.availability.openTo = availability.openTo
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    // 9. Validate & sanitize Avatar
    if (avatar !== undefined) {
      if (typeof avatar !== 'object' || avatar === null || Array.isArray(avatar)) {
        return res.status(400).json({
          success: false,
          message: 'Avatar must be an object with an image URL.',
        });
      }
      if (avatar.url !== undefined) {
        if (typeof avatar.url !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Avatar URL must be a string.',
          });
        }
        user.avatar = user.avatar || {};
        user.avatar.url = avatar.url.trim();
      }
    }

    // Strictly immutable fields (email, password, role, _id, createdAt, updatedAt)
    // are completely excluded from assignment and will remain unchanged.

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: typeof user.toSafeUser === 'function' ? user.toSafeUser() : user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public student profile by ID with dynamic compatibility details
 * @route   GET /api/users/:id
 * @access  Private (Requires Bearer JWT)
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const peer = await User.findById(id);

    if (!peer) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    // Fetch current authenticated user to calculate dynamic compatibility relative to requester
    const currentUserId = req.user?._id || req.user?.id;
    const currentUser = currentUserId ? await User.findById(currentUserId) : null;

    const safePeer = typeof peer.toSafeUser === 'function' ? peer.toSafeUser() : peer.toObject();
    delete safePeer.password;
    delete safePeer.__v;
    safePeer.id = safePeer._id.toString();

    if (currentUser) {
      const comp = calculateCompatibility(peer, currentUser);
      safePeer.compatibilityScore = comp.compatibilityScore;
      safePeer.matchScore = comp.compatibilityScore;
      safePeer.matchedSkills = comp.matchedSkills;
      safePeer.matchedInterests = comp.matchedInterests;
      safePeer.matchReasons = comp.matchReasons;
      safePeer.breakdown = comp.breakdown;
    }

    return res.status(200).json({
      success: true,
      message: 'Student profile retrieved successfully',
      data: {
        user: safePeer,
      },
    });
  } catch (error) {
    next(error);
  }
};
