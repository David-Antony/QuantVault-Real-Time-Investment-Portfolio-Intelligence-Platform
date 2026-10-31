/* global AuthApi, apiClient */
// eslint-disable-next-line no-unused-vars
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
      let message = 'Registration failed';
      if (error.response) {
        if (error.response.status === 404) {
          message = 'Registration failed: Backend API endpoint not found (Server is likely offline).';
        } else {
          message = error.response.data?.message || `Registration failed (Status: ${error.response.status})`;
        }
      } else if (error.request) {
        message = 'Registration failed: Could not connect to the server (Network error).';
      } else {
        message = `Registration failed: ${error.message}`;
      }
      return { success: false, message };
    }
  }

  static async login(email, password) {
    try {
      const response = await AuthApi.login(email, password);
      if (response.data && response.data.require2FA) {
        return { success: true, require2FA: true, userId: response.data.userId };
      }
      return { success: true, user: response.data.user };
    } catch (error) {
      let message = 'Login failed';
      if (error.response) {
        if (error.response.status === 404) {
          message = 'Login failed: Backend API endpoint not found (Server is likely offline).';
        } else {
          message = error.response.data?.message || `Login failed (Status: ${error.response.status})`;
        }
      } else if (error.request) {
        message = 'Login failed: Could not connect to the server (Network error).';
      } else {
        message = `Login failed: ${error.message}`;
      }
      return { success: false, message };
    }
  }

  static async verify2FA(userId, token) {
    try {
      const response = await AuthApi.verify2FA(userId, token);
      return { success: true, user: response.data.user };
    } catch (error) {
      let message = '2FA Verification failed';
      if (error.response) {
        message = error.response.data?.message || `Verification failed (Status: ${error.response.status})`;
      } else if (error.request) {
        message = 'Verification failed: Could not connect to the server.';
      } else {
        message = `Verification failed: ${error.message}`;
      }
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
      let message = 'Update failed';
      if (error.response) {
        message = error.response.data?.message || `Update failed (Status: ${error.response.status})`;
      } else if (error.request) {
        message = 'Update failed: Could not connect to the server.';
      } else {
        message = `Update failed: ${error.message}`;
      }
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
      const currentPage = path.split('/').pop(); // e.g. 'portfolio.html' or ''

      // Pages accessible without authentication, where logged-in users are redirected away
      const authPages = ['login.html', 'signup.html'];
      
      // Landing pages that are completely public, but show different UI if logged in
      const landingPages = ['index.html', ''];

      // If on an auth page and already logged in → go to portfolio dashboard
      if (authPages.includes(currentPage)) {
        if (AuthApi.isLoggedIn()) {
          window.location.href = 'portfolio.html';
        }
        return; 
      }

      // If on a landing page, just update UI if logged in (do not redirect)
      if (landingPages.includes(currentPage)) {
        if (AuthApi.isLoggedIn()) {
          PageGuard.updateUIForLoggedInUser();
        }
        return;
      }

      // Every other page requires authentication.
      if (!AuthApi.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
      }

      // Logged in — populate shared UI elements
      PageGuard.updateUIForLoggedInUser();

      // Background fetch latest profile from DB to ensure complete persistence
      if (typeof apiClient !== 'undefined') {
        apiClient.get('/profile')
          .then((res) => {
            if (res.data && res.data.data) {
              const current = AuthApi.getCurrentUser() || {};
              const fresh = { ...current, ...res.data.data };
              localStorage.setItem('user', JSON.stringify(fresh));
              PageGuard.renderUserElements(fresh);
            }
          })
          .catch(() => {});
      }
    });
  }

  static renderUserElements(user) {
    if (!user) return;

    // Sidebar usernames
    const sidebarUsernames = document.querySelectorAll('#sidebarUsername, .sidebar-username');
    sidebarUsernames.forEach((el) => {
      el.textContent = user.username || 'User';
    });

    // Profile page fields
    const profileNameInput = document.getElementById('profileNameInput');
    const profileNameValue = document.getElementById('profileNameValue');
    const profileEmailValue = document.getElementById('profileEmailValue');
    const profileCreatedValue = document.getElementById('profileCreatedValue');
    const profileLastLoginValue = document.getElementById('profileLastLoginValue');

    if (profileNameInput && !profileNameInput.value) profileNameInput.value = user.username || '';
    if (profileNameValue) profileNameValue.textContent = user.username || '';
    if (profileEmailValue) profileEmailValue.textContent = user.email || '';
    if (profileCreatedValue && user.createdAt) profileCreatedValue.textContent = new Date(user.createdAt).toLocaleDateString();
    if (profileLastLoginValue && user.lastLogin) profileLastLoginValue.textContent = new Date(user.lastLogin).toLocaleString();

    // Avatars
    const avatarUrl = user.avatarPreset && user.avatarPreset.startsWith('face-')
      ? `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(user.avatarPreset + '-' + user.username)}`
      : `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(user.username || 'Investor')}`;

    const sidebarAvatars = document.querySelectorAll('#sidebarAvatar, .sidebar-avatar');
    sidebarAvatars.forEach((img) => {
      img.src = avatarUrl;
    });

    const previewAvatar = document.getElementById('profileAvatarPreview');
    if (previewAvatar && !previewAvatar.dataset.customPicked) {
      previewAvatar.src = avatarUrl;
    }

    // Hero title
    const welcomeMsg = document.querySelector('.hero h1');
    if (welcomeMsg) welcomeMsg.textContent = `Welcome back, ${user.username}!`;

    // Landing page nav CTA
    const navCtaGroup = document.querySelector('.nav-cta-group');
    if (navCtaGroup) {
      navCtaGroup.innerHTML = `
        <a href="portfolio.html" class="btn-secondary" style="border-radius: 10px; padding: 8px 18px; font-size: 0.875rem;">Dashboard</a>
        <button onclick="logout()" class="btn" style="border-radius: 10px; padding: 8px 18px; font-size: 0.875rem; border: none; cursor: pointer; color: white;">Logout</button>
      `;
    }
  }

  static updateUIForLoggedInUser() {
    const user = AuthManager.getCurrentUser();
    if (user) {
      PageGuard.renderUserElements(user);
    }
  }
}

PageGuard.init();

window.AuthManager = AuthManager;
window.PageGuard = PageGuard;

// ── Global logout shorthand (used in sidebar onclick="logout()") ──────────
window.logout = function () {
  AuthApi.logout(); // clears localStorage + redirects to /login.html
};
