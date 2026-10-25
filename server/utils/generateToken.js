import jwt from 'jsonwebtoken';

/**
 * Generate a JSON Web Token signed with user ID
 * Reads JWT_SECRET and JWT_EXPIRES_IN from environment variables.
 * 
 * @param {string|mongoose.Types.ObjectId} userId - ID of the authenticated user
 * @returns {string} - Signed JWT token string
 */
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET is missing from environment variables. Please check your .env configuration.'
    );
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id: userId }, secret, {
    expiresIn,
  });
};

export default generateToken;
