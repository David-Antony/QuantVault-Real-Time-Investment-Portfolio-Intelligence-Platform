const { prisma } = require('../config/db');
const ApiError = require('../utils/ApiError');

// GET /api/alerts
const getAlerts = async (req, res, next) => {
  try {
    const alerts = await prisma.priceAlert.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({
      success: true,
      data: alerts.map((a) => ({
        id: a.id,
        assetName: a.assetName,
        condition: a.condition,
        targetPrice: Number(a.targetPrice),
        isActive: a.isActive,
        triggeredAt: a.triggeredAt,
        createdAt: a.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/alerts
const createAlert = async (req, res, next) => {
  try {
    const { assetName, condition, targetPrice } = req.body;

    if (!assetName || !condition || !targetPrice) {
      throw ApiError.badRequest('assetName, condition (above|below), and targetPrice are required');
    }
    if (!['above', 'below'].includes(condition)) {
      throw ApiError.badRequest('condition must be "above" or "below"');
    }
    if (isNaN(targetPrice) || Number(targetPrice) <= 0) {
      throw ApiError.badRequest('targetPrice must be a positive number');
    }

    const alert = await prisma.priceAlert.create({
      data: {
        userId: req.userId,
        assetName: assetName.trim(),
        condition,
        targetPrice: Number(targetPrice),
        isActive: true
      }
    });

    res.status(201).json({
      success: true,
      message: `Alert created: notify when ${assetName} goes ${condition} $${targetPrice}`,
      data: {
        id: alert.id,
        assetName: alert.assetName,
        condition: alert.condition,
        targetPrice: Number(alert.targetPrice),
        isActive: alert.isActive,
        createdAt: alert.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/alerts/:id/toggle
const toggleAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.priceAlert.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    });
    if (!existing) throw ApiError.notFound('Alert not found');

    const updated = await prisma.priceAlert.update({
      where: { id: parseInt(id) },
      data: { isActive: !existing.isActive }
    });

    res.json({
      success: true,
      message: `Alert ${updated.isActive ? 'activated' : 'paused'}`,
      data: { id: updated.id, isActive: updated.isActive }
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/alerts/:id
const deleteAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.priceAlert.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    });
    if (!existing) throw ApiError.notFound('Alert not found');

    await prisma.priceAlert.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAlerts, createAlert, toggleAlert, deleteAlert };
