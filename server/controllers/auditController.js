const { prisma } = require('../config/db');
const { logAudit } = require('../utils/auditLogger');

// GET /api/audit — last 50 audit entries for the logged-in user
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
