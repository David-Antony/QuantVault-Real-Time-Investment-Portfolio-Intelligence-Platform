/**
 * QuantVault Global Command Palette
 * Instantiated on Cmd+K or Ctrl+K
 */

document.addEventListener('DOMContentLoaded', () => {
    const palette = document.getElementById('commandPalette');
    const input = document.getElementById('cmdInput');
    const resultsContainer = document.getElementById('cmdResults');
    const backdrop = document.getElementById('cmdBackdrop');
    
    if (!palette || !input || !resultsContainer || !backdrop) return;

    // Available commands/routes
    const commands = [
        { id: 'home', icon: '🏠', title: 'Go to Home', subtitle: 'Navigate to the dashboard landing', action: () => window.location.href = 'index.html' },
        { id: 'portfolio', icon: '💼', title: 'Go to Portfolio', subtitle: 'View real-time portfolio metrics', action: () => window.location.href = 'portfolio.html' },
        { id: 'transactions', icon: '💰', title: 'Go to Transactions', subtitle: 'View ledger & add trades', action: () => window.location.href = 'transactions.html' },
        { id: 'reports', icon: '📈', title: 'Go to Reports', subtitle: 'View analytics & AI insights', action: () => window.location.href = 'reports.html' },
        { id: 'watchlist', icon: '👁️', title: 'Go to Watchlist', subtitle: 'Track market assets', action: () => window.location.href = 'watchlist.html' },
        { id: 'alerts', icon: '🔔', title: 'Go to Alerts', subtitle: 'Manage price thresholds', action: () => window.location.href = 'alerts.html' },
        { id: 'profile', icon: '👤', title: 'Go to Profile', subtitle: 'Manage settings & 2FA', action: () => window.location.href = 'profile.html' },
        { id: 'add-transaction', icon: '➕', title: 'Add Transaction', subtitle: 'Record a new trade', action: () => window.location.href = 'transactions.html?action=add' },
        { id: 'theme-toggle', icon: '🌓', title: 'Toggle Theme', subtitle: 'Switch between light and dark mode', action: () => {
            const btn = document.querySelector('.theme-toggle-btn');
            if (btn) btn.click();
            closePalette();
        }},
        { id: 'logout', icon: '🚪', title: 'Log Out', subtitle: 'End your session', action: () => {
            if (typeof logout === 'function') logout();
        }}
    ];

    let selectedIndex = 0;
    let filteredCommands = [...commands];

    function openPalette() {
        palette.classList.add('active');
        backdrop.classList.add('active');
        input.value = '';
        filterCommands('');
        input.focus();
        document.body.style.overflow = 'hidden';
    }

    function closePalette() {
        palette.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
        input.blur();
    }

    function renderResults() {
        resultsContainer.innerHTML = '';
        
        if (filteredCommands.length === 0) {
            resultsContainer.innerHTML = `
                <div class="cmd-no-results">
                    No commands found matching "${input.value}"
                </div>
            `;
            return;
        }

        filteredCommands.forEach((cmd, index) => {
            const item = document.createElement('div');
            item.className = `cmd-item ${index === selectedIndex ? 'selected' : ''}`;
            item.innerHTML = `
                <div class="cmd-icon">${cmd.icon}</div>
                <div class="cmd-details">
                    <div class="cmd-title">${cmd.title}</div>
                    <div class="cmd-subtitle">${cmd.subtitle}</div>
                </div>
                <div class="cmd-hint">↵</div>
            `;
            
            // Hover effect
            item.addEventListener('mouseenter', () => {
                selectedIndex = index;
                renderResults(); // Re-render to update selected class
            });
            
            // Click effect
            item.addEventListener('click', () => {
                cmd.action();
            });

            resultsContainer.appendChild(item);
        });
        
        // Ensure selected item is scrolled into view
        const selectedEl = resultsContainer.querySelector('.cmd-item.selected');
        if (selectedEl) {
            selectedEl.scrollIntoView({ block: 'nearest' });
        }
    }

    function filterCommands(query) {
        query = query.toLowerCase().trim();
        if (!query) {
            filteredCommands = [...commands];
        } else {
            filteredCommands = commands.filter(cmd => 
                cmd.title.toLowerCase().includes(query) || 
                cmd.subtitle.toLowerCase().includes(query)
            );
        }
        selectedIndex = 0;
        renderResults();
    }

    // Input listening
    input.addEventListener('input', (e) => {
        filterCommands(e.target.value);
    });

    // Keyboard navigation
    palette.addEventListener('keydown', (e) => {
        if (!palette.classList.contains('active')) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % filteredCommands.length;
                renderResults();
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
                renderResults();
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                }
                break;
            case 'Escape':
                e.preventDefault();
                closePalette();
                break;
        }
    });

    // Global listener for Cmd+K / Ctrl+K
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (palette.classList.contains('active')) {
                closePalette();
            } else {
                openPalette();
            }
        }
        // Also close on Escape if globally focused elsewhere
        if (e.key === 'Escape' && palette.classList.contains('active')) {
            closePalette();
        }
    });

    backdrop.addEventListener('click', closePalette);
});
