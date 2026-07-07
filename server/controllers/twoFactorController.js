const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { prisma } = require('../config/db');
const ApiError = require('../utils/ApiError');

// ── POST /api/auth/2fa/setup ──────────────────────────────────
// Generate a TOTP secret + QR code for the user
const setup2FA = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) throw ApiError.notFound('User not found');

    // Generate a new TOTP secret
    const secret = speakeasy.generateSecret({
      name: `QuantVault (${user.email})`,
      issuer: 'QuantVault'
    });

    // Temporarily store the secret (not yet enabled until verified)
    await prisma.user.update({
      where: { id: req.userId },
      data: { twoFactorSecret: secret.base32 }
    });

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrCodeDataUrl,
        otpauthUrl: secret.otpauth_url
      }
    });
  } catch (err) { next(err); }
};

// ── POST /api/auth/2fa/verify ─────────────────────────────────
// Verify the TOTP token and enable 2FA
const verify2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) throw ApiError.badRequest('TOTP token is required');

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || !user.twoFactorSecret) throw ApiError.badRequest('2FA setup not initiated');

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token.replace(/\s/g, ''),
      window: 2
    });

    if (!isValid) throw ApiError.badRequest('Invalid TOTP token. Please check your authenticator app.');

    await prisma.user.update({
      where: { id: req.userId },
      data: { twoFactorEnabled: true }
    });

    res.json({ success: true, message: 'Two-factor authentication enabled successfully.' });
  } catch (err) { next(err); }
};

// ── POST /api/auth/2fa/disable ────────────────────────────────
const disable2FA = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) throw ApiError.badRequest('TOTP token required to disable 2FA');

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || !user.twoFactorEnabled) throw ApiError.badRequest('2FA is not currently enabled');

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token.replace(/\s/g, ''),
      window: 2
    });

    if (!isValid) throw ApiError.badRequest('Invalid TOTP token');

    await prisma.user.update({
      where: { id: req.userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null }
    });

    res.json({ success: true, message: '2FA has been disabled.' });
  } catch (err) { next(err); }
};

// ── GET /api/auth/2fa/status ──────────────────────────────────
const get2FAStatus = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    res.json({ success: true, data: { enabled: user?.twoFactorEnabled || false } });
  } catch (err) { next(err); }
};

module.exports = { setup2FA, verify2FA, disable2FA, get2FAStatus };
