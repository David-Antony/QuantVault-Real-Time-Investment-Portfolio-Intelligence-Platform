const { prisma } = require('../config/db');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcrypt');

const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatarPreset: true,
        avatarConfig: true,
        createdAt: true,
        lastLogin: true
      }
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarPreset: user.avatarPreset,
        avatarConfig: user.avatarConfig,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { username, avatarPreset, avatarConfig } = req.body;

    const dataToUpdate = {};
    if (username !== undefined) dataToUpdate.username = username;
    if (avatarPreset !== undefined) dataToUpdate.avatarPreset = avatarPreset;
    if (avatarConfig !== undefined) dataToUpdate.avatarConfig = avatarConfig;

    if (Object.keys(dataToUpdate).length === 0) {
      throw ApiError.badRequest('No fields to update');
    }

    if (dataToUpdate.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: dataToUpdate.username,
          id: { not: req.userId }
        }
      });

      if (existingUser) {
        throw ApiError.conflict('Username already taken');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: dataToUpdate,
      select: {
        id: true,
        username: true,
        email: true,
        avatarPreset: true,
        avatarConfig: true,
        createdAt: true,
        lastLogin: true
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatarPreset: updatedUser.avatarPreset,
        avatarConfig: updatedUser.avatarConfig,
        createdAt: updatedUser.createdAt,
        lastLogin: updatedUser.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw ApiError.badRequest('Current password and new password are required');
    }

    if (newPassword.length < 6) {
      throw ApiError.badRequest('New password must be at least 6 characters');
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: req.userId },
      data: { passwordHash: newPasswordHash }
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, changePassword };
