/**
 * Audit Logger — middleware helper
 * Call logAudit(prisma, userId, action, metadata, req) anywhere.
 */
const { prisma } = require('../config/db');

const logAudit = async (userId, action, metadata = {}, req = null) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        metadata,
        ip: req ? (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null) : null,
        userAgent: req ? (req.headers['user-agent'] || null) : null
      }
    });
  } catch {
    // Non-fatal — never let audit failure break the main request
  }
};

module.exports = { logAudit };
