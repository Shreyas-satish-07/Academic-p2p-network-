/**
 * Authentication mock data, constants, and backend architecture specification for Cohort.
 * 
 * Future MongoDB User Model:
 * 
 * const userSchema = new mongoose.Schema({
 *   name: { type: String, required: true, trim: true },
 *   email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
 *   password: { type: String, required: true, minlength: 8 }, // Hashed with bcrypt (12 salt rounds)
 *   college: { type: String, required: true, trim: true },
 *   department: { type: String, required: true, trim: true },
 *   semester: { type: String, required: true },
 *   role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
 *   avatarUrl: { type: String, default: null },
 *   initials: { type: String },
 *   isEmailVerified: { type: Boolean, default: false },
 *   emailVerificationToken: { type: String, select: false },
 *   resetPasswordToken: { type: String, select: false },
 *   resetPasswordExpires: { type: Date, select: false },
 *   lastLoginAt: { type: Date },
 * }, { timestamps: true });
 * 
 * Future Express Endpoints:
 * - POST /api/auth/register        - Validates input with Zod/Joi, hashes password with bcrypt, creates User, issues JWT
 * - POST /api/auth/login           - Validates credentials, verifies bcrypt hash, returns JWT and user payload
 * - POST /api/auth/logout          - Invalidates refresh token / clears HTTP-only cookie if used
 * - GET  /api/auth/me              - Returns currently authenticated user payload from verified JWT
 * - POST /api/auth/forgot-password - Generates secure crypto reset token, saves hash with 1h expiry, sends email
 * - POST /api/auth/reset-password  - Verifies unexpired token, updates password hash, invalidates reset token
 * 
 * JWT Authentication Flow:
 * 1. Express validates login credentials via bcrypt.compare().
 * 2. Server signs a JWT with user id, role, and email using JWT_SECRET (e.g. 7d expiry).
 * 3. Frontend stores token in localStorage ('cohort_token') and user in ('cohort_user').
 * 4. Axios request interceptor attaches: Authorization: Bearer <token>.
 * 5. Protected Express routes use authMiddleware to verify JWT before controller execution.
 */

// Mock user and demo credentials removed in favor of Express + MongoDB JWT authentication.

export const DEPARTMENT_OPTIONS = [
  'Computer Science',
  'Information Science',
  'AI & Data Science',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biotechnology',
];

export const SEMESTER_OPTIONS = [
  '1st Semester',
  '2nd Semester',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester',
];

export const COLLEGE_OPTIONS = [
  'Bangalore Institute of Technology',
  'RV College of Engineering',
  'PES University',
  'BMS College of Engineering',
  'MS Ramaiah Institute of Technology',
  'Delhi Technological University',
  'IIT Bombay',
  'Other University / College',
];

export const BRAND_HIGHLIGHTS = [
  {
    title: 'Peer Matching',
    desc: 'Find verified classmates by matching department, semester, and shared tech stacks.',
    icon: '🤝',
  },
  {
    title: 'Project Teams',
    desc: 'Build real-world portfolio applications in structured workspaces with Git integration.',
    icon: '🚀',
  },
  {
    title: 'Academic Discussions',
    desc: 'Get peer-reviewed solutions and formula breakdowns for university coursework.',
    icon: '💬',
  },
];
