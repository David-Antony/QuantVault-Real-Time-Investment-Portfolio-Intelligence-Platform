class AuthManager {
  static isLoggedIn() {
    return AuthApi.isLoggedIn();
  }

  static getCurrentUser() {
    return AuthApi.getCurrentUser();
  }

  static async register(username, email, password) {
    try {
      const response = await AuthApi.register(username, email, password);
      return { success: true, user: response.data.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  }

  static async login(email, password) {
    try {
      const response = await AuthApi.login(email, password);
      return { success: true, user: response.data.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  }

  static async logout() {
    await AuthApi.logout();
  }

  static async updateProfile(userId, updates) {
    try {
      const response = await apiClient.put('/profile', updates);
      const currentUser = AuthApi.getCurrentUser();
      if (currentUser) {
        const updated = { ...currentUser, ...response.data.data };
        localStorage.setItem('user', JSON.stringify(updated));
      }
      return { success: true, user: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      return { success: false, message };
    }
  }

  static shouldRedirectToSignup() {
    return !AuthApi.isLoggedIn();
  }
}

class PageGuard {
  static init() {
    document.addEventListener('DOMContentLoaded', function () {
      const path = window.location.pathname;
      const currentPage = path.split('/').pop();

      if (currentPage === 'login.html' || currentPage === 'signup.html') {
        if (AuthApi.isLoggedIn()) {
          window.location.href = 'index.html';
        }
        return;
      }

      if (!AuthApi.isLoggedIn() && currentPage !== 'index.html' && currentPage !== '') {
        window.location.href = 'login.html';
      }

      if (AuthApi.isLoggedIn()) {
        PageGuard.updateUIForLoggedInUser();
      }
    });
  }

  static updateUIForLoggedInUser() {
    const user = AuthManager.getCurrentUser();
    if (!user) return;

    const profileNameValue = document.getElementById('profileNameValue');
    const profileEmailValue = document.getElementById('profileEmailValue');
    if (profileNameValue) profileNameValue.textContent = user.username;
    if (profileEmailValue) profileEmailValue.textContent = user.email;

    const welcomeMsg = document.querySelector('.hero h1');
    if (welcomeMsg) welcomeMsg.textContent = `Welcome back, ${user.username}!`;
  }
}

PageGuard.init();

window.AuthManager = AuthManager;
window.PageGuard = PageGuard;
