const { verifyAccessToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const prisma = require('../config/prisma');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Access token expired'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid access token'));
    }
    next(error);
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);
      req.userId = decoded.userId;
    }
  } catch (error) {
    // Token invalid, continue without auth
  }
  next();
};

const requireAdmin = async (req, res, next) => {
  try {
    // Re-use authenticate logic or just assume req.userId is set if authenticate runs before
    if (!req.userId) {
      return next(ApiError.unauthorized('User not authenticated'));
    }
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || user.role !== 'ADMIN') {
      return next(ApiError.forbidden('Admin access required'));
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate, optionalAuth, requireAdmin };
