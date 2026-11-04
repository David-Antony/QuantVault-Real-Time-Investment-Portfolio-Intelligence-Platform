/**
 * QuantVault Standardized API Response Utilities
 * Provides consistent response formats across all backend endpoints.
 */

/**
 * Sends a successful JSON response.
 * @param {Object} res - Express response object
 * @param {Object|Array|null} data - Payload data
 * @param {string|null} message - Optional user-facing message
 * @param {number} statusCode - HTTP status code (default 200)
 */
function sendSuccess(res, data = null, message = null, statusCode = 200) {
  const payload = { success: true };
  if (message !== null) payload.message = message;
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
}

/**
 * Sends an error JSON response.
 * @param {Object} res - Express response object
 * @param {string} message - Error description message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {Array} errors - Optional validation or detail errors
 */
function sendError(res, message = 'Internal Server Error', statusCode = 500, errors = []) {
  const payload = { success: false, message };
  if (errors && errors.length > 0) payload.errors = errors;
  return res.status(statusCode).json(payload);
}

module.exports = {
  sendSuccess,
  sendError
};
