import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register a new student user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, college, department, semester } = req.body;

    // Validate presence of required fields
    if (
      !name ||
      !email ||
      !password ||
      !college ||
      !department ||
      semester === undefined ||
      semester === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide all required fields: name, email, password, college, department, and semester.',
      });
    }

    // Parse semester if passed as string (e.g. "6th Semester" or "6")
    let parsedSemester = semester;
    if (typeof semester === 'string') {
      const match = semester.match(/\d+/);
      parsedSemester = match ? parseInt(match[0], 10) : parseInt(semester, 10);
    }

    if (isNaN(parsedSemester) || parsedSemester < 1 || parsedSemester > 12) {
      return res.status(400).json({
        success: false,
        message: 'Semester must be a valid number between 1 and 12.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check for existing user with identical email
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Create user in database (pre-save hook hashes password with 12 salt rounds)
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      college: college.trim(),
      department: department.trim(),
      semester: parsedSemester,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: typeof user.toSafeUser === 'function' ? user.toSafeUser() : user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate student and return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Explicitly select password field to compare credentials
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: typeof user.toSafeUser === 'function' ? user.toSafeUser() : user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently authenticated user details
 * @route   GET /api/auth/me
 * @access  Private (Requires Bearer JWT)
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user is set by protect middleware and has password excluded
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : undefined;

    return res.status(200).json({
      success: true,
      message: 'Current user retrieved successfully',
      data: {
        user: req.user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout student user
 * @route   POST /api/auth/logout
 * @access  Public
 * Note: The client-side application removes the Bearer token from localStorage/sessionStorage.
 * Token blacklisting or refresh token rotation can be implemented in a subsequent phase.
 */
export const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
