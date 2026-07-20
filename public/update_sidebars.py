import os
import re

standard_sidebar = '''<aside class="sidebar" id="appSidebar">
    <div class="sidebar-logo">
        <div class="sidebar-logo-mark">QV</div>
        <span class="sidebar-logo-text">QuantVault</span>
    </div>

    <nav class="sidebar-nav" aria-label="Main navigation">
        <span class="sidebar-section-label">Platform</span>
        <a href="index.html" class="nav-item" data-page="index">
            <span class="nav-icon">🏠</span> Home
        </a>
        <a href="portfolio.html" class="nav-item" data-page="portfolio">
            <span class="nav-icon">💼</span> Portfolio
        </a>
        <a href="transactions.html" class="nav-item" data-page="transactions">
            <span class="nav-icon">💰</span> Transactions
        </a>
        <a href="reports.html" class="nav-item" data-page="reports">
            <span class="nav-icon">📈</span> Reports
        </a>
        <a href="watchlist.html" class="nav-item" data-page="watchlist">
            <span class="nav-icon">👁️</span> Watchlist
        </a>
        <a href="alerts.html" class="nav-item" data-page="alerts">
            <span class="nav-icon">🔔</span> Alerts
        </a>

        <div class="sidebar-divider"></div>

        <span class="sidebar-section-label">Account</span>
        <a href="profile.html" class="nav-item" data-page="profile">
            <span class="nav-icon">👤</span> Profile
        </a>
        <a href="#" class="nav-item" onclick="logout(); return false;">
            <span class="nav-icon">🚪</span> Logout
        </a>
    </nav>

    <div class="sidebar-footer">
        <div class="sidebar-user">
            <img src="https://api.dicebear.com/9.x/adventurer/svg?seed=Nova" alt="Avatar" class="sidebar-avatar" id="sidebarAvatar">
            <div class="sidebar-user-info">
                <div class="sidebar-username" id="sidebarUsername">Loading...</div>
                <div class="sidebar-user-role">Investor</div>
            </div>
        </div>
    </div>
</aside>'''

public_dir = r'e:\QuantVault\public'
for f in os.listdir(public_dir):
    if f.endswith('.html') and f not in ['login.html', 'signup.html']:
        path = os.path.join(public_dir, f)
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
            
        if '<aside class="sidebar"' in content:
            # Replace old aside with new standard sidebar
            new_content = re.sub(r'<aside class="sidebar"[^>]*>.*?</aside>', standard_sidebar, content, flags=re.DOTALL)
            
            # Add active class to current page
            page_name = f.replace('.html', '')
            target = f'data-page="{page_name}"'
            if target in new_content:
                new_content = new_content.replace(f'class="nav-item" {target}', f'class="nav-item active" {target}')
                
            # We don't want data-page attributes in the final html, clean them up
            new_content = re.sub(r' data-page="[^"]+"', '', new_content)
            
            with open(path, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print('Updated sidebar in ' + f)
