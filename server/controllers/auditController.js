const { prisma } = require('../config/db');

/**
 * Retrieves the last 50 audit log entries for the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getAuditLog = async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json({
      success: true,
      data: logs.map((l) => ({
        id: l.id,
        action: l.action,
        metadata: l.metadata,
        ip: l.ip,
        createdAt: l.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAuditLog };
