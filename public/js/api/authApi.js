/**
 * Client-side API wrapper for Authentication and User Profile endpoints.
 */
class AuthApi {
  static async register(username, email, password) {
    const response = await apiClient.post('/auth/register', { username, email, password });
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  }

  static async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.data && response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  }

  static async verify2FA(userId, token) {
    const response = await apiClient.post('/auth/verify-2fa', { userId, token });
    if (response.data.data && response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  }


  static async refreshToken() {
    const response = await apiClient.post('/auth/refresh');
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    return response.data;
  }

  static async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Proceed with client-side cleanup even if server call fails
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  }

  /**
   * Check if the user is currently logged in based on token presence.
   * @returns {boolean} True if logged in
   */
  static isLoggedIn() {
    return !!localStorage.getItem('accessToken');
  }

  /**
   * Get the current user data from local storage.
   * @returns {Object|null} User object or null
   */
  static getCurrentUser() {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }
}
