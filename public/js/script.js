const AVATAR_PRESETS = [
    { id: 'face-01', bgGrad: ['#818cf8', '#c084fc'], skinColor: '#fde047', hairType: 'short', hairColor: '#1e293b', shirtColor: '#f43f5e', glasses: false, beard: false },
    { id: 'face-02', bgGrad: ['#38bdf8', '#818cf8'], skinColor: '#fed7aa', hairType: 'long', hairColor: '#78350f', shirtColor: '#0ea5e9', glasses: false, beard: false },
    { id: 'face-03', bgGrad: ['#fb923c', '#db2777'], skinColor: '#fef08a', hairType: 'curly', hairColor: '#1e293b', shirtColor: '#10b981', glasses: false, beard: true },
    { id: 'face-04', bgGrad: ['#34d399', '#059669'], skinColor: '#fcd34d', hairType: 'spiky', hairColor: '#475569', shirtColor: '#8b5cf6', glasses: true, beard: false },
    { id: 'face-05', bgGrad: ['#f472b6', '#db2777'], skinColor: '#ffedd5', hairType: 'bun', hairColor: '#b45309', shirtColor: '#f59e0b', glasses: false, beard: false },
    { id: 'face-06', bgGrad: ['#a78bfa', '#6d28d9'], skinColor: '#fde047', hairType: 'bald', hairColor: '#1e293b', shirtColor: '#ef4444', glasses: false, beard: true },
    { id: 'face-07', bgGrad: ['#60a5fa', '#2563eb'], skinColor: '#fed7aa', hairType: 'bob', hairColor: '#0f172a', shirtColor: '#ec4899', glasses: false, beard: false },
    { id: 'face-08', bgGrad: ['#f43f5e', '#be123c'], skinColor: '#fcd34d', hairType: 'short', hairColor: '#7c2d12', shirtColor: '#10b981', glasses: true, beard: false },
    { id: 'face-09', bgGrad: ['#2dd4bf', '#0d9488'], skinColor: '#fef08a', hairType: 'wavy', hairColor: '#030712', shirtColor: '#f43f5e', glasses: false, beard: false },
    { id: 'face-10', bgGrad: ['#1e293b', '#0f172a'], skinColor: '#ffedd5', hairType: 'spiky', hairColor: '#f43f5e', shirtColor: '#0ea5e9', glasses: true, beard: true },
    { id: 'face-11', bgGrad: ['#f59e0b', '#d97706'], skinColor: '#fde047', hairType: 'long', hairColor: '#7c2d12', shirtColor: '#6366f1', glasses: false, beard: false },
    { id: 'face-12', bgGrad: ['#10b981', '#047857'], skinColor: '#fed7aa', hairType: 'short', hairColor: '#475569', shirtColor: '#f43f5e', glasses: false, beard: false }
];

function generateFaceSVG(preset, size = 160) {
    const bgId = `bg-${preset.id}`;
    const skinShadow = adjustColorBrightness(preset.skinColor, -15);
    const neckColor = adjustColorBrightness(preset.skinColor, -20);
    const browColor = adjustColorBrightness(preset.hairColor, -10);

    // Dynamic Hair SVGs based on hairType
    let hairSVG = '';
    if (preset.hairType === 'short') {
        hairSVG = `<path d="M 48 56 C 48 38, 112 38, 112 56 C 112 56, 114 44, 98 44 C 80 44, 80 46, 76 46 C 60 46, 52 48, 48 56 Z" fill="${preset.hairColor}" />`;
    } else if (preset.hairType === 'long') {
        hairSVG = `
            <path d="M 46 64 C 44 40, 116 40, 114 64 L 114 125 C 114 135, 106 135, 106 125 L 106 72 C 106 72, 80 62, 54 72 L 54 125 C 54 135, 46 135, 46 125 Z" fill="${preset.hairColor}" />
            <path d="M 48 56 C 48 38, 112 38, 112 56 Z" fill="${preset.hairColor}" />
        `;
    } else if (preset.hairType === 'curly') {
        hairSVG = `
            <path d="M 46 54 C 42 46, 52 38, 58 42 C 62 34, 74 34, 78 40 C 84 34, 96 34, 100 40 C 106 38, 116 44, 112 52 C 118 58, 116 70, 110 74 C 114 82, 108 92, 102 90 L 58 90 C 50 92, 46 82, 50 74 C 44 70, 42 58, 46 54 Z" fill="${preset.hairColor}" />
        `;
    } else if (preset.hairType === 'spiky') {
        hairSVG = `
            <path d="M 48 56 C 48 38, 112 38, 112 56 Z" fill="${preset.hairColor}" />
            <path d="M 52 46 L 58 34 L 66 42 L 74 30 L 82 40 L 92 28 L 100 42 L 108 34 L 110 48 Z" fill="${preset.hairColor}" />
        `;
    } else if (preset.hairType === 'bun') {
        hairSVG = `
            <circle cx="80" cy="30" r="16" fill="${preset.hairColor}" />
            <path d="M 48 56 C 48 38, 112 38, 112 56 Z" fill="${preset.hairColor}" />
        `;
    } else if (preset.hairType === 'bob') {
        hairSVG = `
            <path d="M 44 56 C 44 34, 116 34, 116 56 L 118 90 C 118 98, 112 98, 110 90 L 108 65 C 108 65, 80 54, 52 65 L 50 90 C 48 98, 42 98, 42 90 Z" fill="${preset.hairColor}" />
        `;
    } else if (preset.hairType === 'wavy') {
        hairSVG = `
            <path d="M 44 56 C 44 32, 116 32, 116 56 L 118 115 C 118 120, 112 122, 110 115 C 108 100, 104 100, 102 115 C 100 120, 94 122, 92 115 L 92 70 L 68 70 L 68 115 C 66 122, 60 120, 58 115 C 56 100, 52 100, 50 115 C 48 122, 42 120, 42 115 Z" fill="${preset.hairColor}" />
            <path d="M 48 52 C 48 36, 112 36, 112 52 Z" fill="${preset.hairColor}" />
        `;
    }

    // Beard SVG
    const beardSVG = preset.beard ? `
        <path d="M 52 82 C 52 112, 108 112, 108 82 C 108 98, 52 98, 52 82 Z" fill="${preset.hairColor}" opacity="0.9" />
    ` : '';

    // Glasses SVG
    const glassesSVG = preset.glasses ? `
        <g opacity="0.9">
            <circle cx="67" cy="78" r="11" fill="none" stroke="#1e293b" stroke-width="2.5" />
            <circle cx="93" cy="78" r="11" fill="none" stroke="#1e293b" stroke-width="2.5" />
            <line x1="78" y1="78" x2="82" y2="78" stroke="#1e293b" stroke-width="2.5" />
            <path d="M 56 78 L 48 74" stroke="#1e293b" stroke-width="2" stroke-linecap="round" />
            <path d="M 104 78 L 112 74" stroke="#1e293b" stroke-width="2" stroke-linecap="round" />
        </g>
    ` : '';

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 160 160">
        <defs>
            <linearGradient id="${bgId}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${preset.bgGrad[0]}" />
                <stop offset="100%" stop-color="${preset.bgGrad[1]}" />
            </linearGradient>
            <clipPath id="avatarClip">
                <circle cx="80" cy="80" r="72" />
            </clipPath>
        </defs>
        
        <!-- Background Circle -->
        <circle cx="80" cy="80" r="72" fill="url(#${bgId})" />

        <!-- Clipped Avatar Content -->
        <g clip-path="url(#avatarClip)">
            <!-- Neck -->
            <rect x="74" y="102" width="12" height="22" rx="4" fill="${neckColor}" />

            <!-- Shoulders / Shirt -->
            <path d="M 38 140 C 48 118, 112 118, 122 140 L 125 160 L 35 160 Z" fill="${preset.shirtColor}" />
            <path d="M 68 122 C 72 130, 88 130, 92 122" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2.5" stroke-linecap="round" />

            <!-- Head Base -->
            <rect x="52" y="50" width="56" height="64" rx="28" fill="${preset.skinColor}" />
            
            <!-- Cheek Blush -->
            <circle cx="63" cy="89" r="5" fill="#f43f5e" opacity="0.16" />
            <circle cx="97" cy="89" r="5" fill="#f43f5e" opacity="0.16" />

            <!-- Hair (Back/Behind) -->
            ${preset.hairType === 'long' || preset.hairType === 'bob' || preset.hairType === 'wavy' ? hairSVG : ''}

            <!-- Beard -->
            ${beardSVG}

            <!-- Eyes -->
            <circle cx="67" cy="78" r="3.5" fill="#0f172a" />
            <circle cx="93" cy="78" r="3.5" fill="#0f172a" />
            <circle cx="68.2" cy="76.8" r="1" fill="#ffffff" />
            <circle cx="94.2" cy="76.8" r="1" fill="#ffffff" />

            <!-- Eyebrows -->
            <path d="M 61 71 Q 67 68 73 71" fill="none" stroke="${browColor}" stroke-width="2" stroke-linecap="round" />
            <path d="M 87 71 Q 93 68 99 71" fill="none" stroke="${browColor}" stroke-width="2" stroke-linecap="round" />

            <!-- Nose -->
            <path d="M 78 81 Q 80 83 79 86" fill="none" stroke="${skinShadow}" stroke-width="2.2" stroke-linecap="round" />

            <!-- Mouth -->
            <path d="M 73 93 Q 80 99 87 93" fill="none" stroke="#991b1b" stroke-width="2.5" stroke-linecap="round" />

            <!-- Hair (Front/Top) -->
            ${preset.hairType !== 'long' && preset.hairType !== 'bob' && preset.hairType !== 'wavy' ? hairSVG : ''}

            <!-- Glasses -->
            ${glassesSVG}
        </g>

        <!-- Premium Inner Circle Border -->
        <circle cx="80" cy="80" r="71" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
    </svg>`;

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Helper to adjust color brightness programmatically
function adjustColorBrightness(hex, percent) {
    let R = parseInt(hex.substring(1, 3), 16);
    let G = parseInt(hex.substring(3, 5), 16);
    let B = parseInt(hex.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    R = (R > 0) ? R : 0;
    G = (G > 0) ? G : 0;
    B = (B > 0) ? B : 0;

    const rHex = R.toString(16).padStart(2, '0');
    const gHex = G.toString(16).padStart(2, '0');
    const bHex = B.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
}

document.addEventListener('DOMContentLoaded', async function () {
    portfolioData = await PortfolioDataStore.loadPortfolio();
    setActiveNavLink();
    setBodyPageClass();

    if (document.getElementById('portfolio-summary')) {
        updatePortfolioSummary();
        updateTransactionHistory();
        updateAssetAllocation();
        loadMarketNews();
    }

    if (document.getElementById('transactionList') && document.getElementById('transactionList').closest('.transactions-container')) {
        updateTransactionList();
        updateTransactionStats();
        initTransactionsPage();
    }

    if (document.getElementById('portfolioChart')) {
        updatePortfolioChart();
    }

    if (document.getElementById('reportTotalValue')) {
        updateReportsPage();
    }

    if (document.getElementById('profileNameInput')) {
        initProfilePage();
    }

    initTickerParticles();
});

function initTickerParticles() {
    const container = document.querySelector('.ticker-crystal');
    if (!container) return;

    const MAX_PARTICLES = 28;
    const BURST_MIN_DELAY = 1200;
    const BURST_MAX_DELAY = 3000;
    const PARTICLES_PER_BURST = () => Math.floor(4 + Math.random() * 10);

    let active = true;
    let particles = [];
    let burstTimer = null;

    function createParticle(x, y) {
        if (!active || particles.length >= MAX_PARTICLES) return null;
        const el = document.createElement('div');
        el.className = 'crystal-particle';
        const size = 6 + Math.floor(Math.random() * 10);
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        const colors = ['rgba(255,255,255,0.95)', 'rgba(79,70,229,0.96)', 'rgba(16,185,129,0.96)', 'rgba(125,211,252,0.92)'];
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        el.style.left = (x - size / 2) + 'px';
        el.style.top = (y - size / 2) + 'px';
        container.appendChild(el);
        particles.push(el);
        setTimeout(() => {
            el.remove();
            particles = particles.filter((p) => p !== el);
        }, 1400);
        return el;
    }

    function spawnBurst() {
        if (!active) return;
        const rect = container.getBoundingClientRect();
        const localX = rect.width * (0.4 + Math.random() * 0.2);
        const localY = rect.height * (0.2 + Math.random() * 0.4);
        const n = PARTICLES_PER_BURST();
        for (let i = 0; i < n; i++) {
            const jx = localX + (Math.random() - 0.5) * rect.width * 0.18;
            const jy = localY + (Math.random() - 0.5) * rect.height * 0.12;
            createParticle(jx, jy);
        }
        scheduleNextBurst();
    }

    function scheduleNextBurst() {
        const delay = BURST_MIN_DELAY + Math.random() * (BURST_MAX_DELAY - BURST_MIN_DELAY);
        burstTimer = setTimeout(spawnBurst, delay);
    }

    spawnBurst();

    function handleVisibility() {
        if (document.hidden) {
            active = false;
            if (burstTimer) clearTimeout(burstTimer);
        } else {
            if (!active) {
                active = true;
                scheduleNextBurst();
            }
        }
    }

    document.addEventListener('visibilitychange', handleVisibility);

    const observer = new MutationObserver(() => {
        if (!document.body.contains(container)) {
            active = false;
            if (burstTimer) clearTimeout(burstTimer);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function setActiveNavLink() {
    try {
        const links = document.querySelectorAll('.nav-links a');
        if (!links || links.length === 0) return;
        const href = window.location.href;
        links.forEach((a) => {
            const target = a.getAttribute('href');
            if (!target) return;
            if (href.endsWith(target) || href.indexOf(target) !== -1) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });
    } catch (err) {
        // ignore
    }
}

function setBodyPageClass() {
    const href = window.location.href;
    const body = document.body;
    if (!body) return;
    body.classList.remove('home-page', 'profile-page', 'transactions-page', 'reports-page');
    if (href.endsWith('index.html') || href.endsWith('/') || href.indexOf('index.html') !== -1) {
        body.classList.add('home-page');
    } else if (href.indexOf('profile.html') !== -1) {
        body.classList.add('profile-page');
    } else if (href.indexOf('transactions.html') !== -1) {
        body.classList.add('transactions-page');
    } else if (href.indexOf('reports.html') !== -1) {
        body.classList.add('reports-page');
    }
}

async function handleTransactionSubmit(event) {
    event.preventDefault();

    const assetName = document.getElementById('assetName').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const typeSelect = document.getElementById('transactionType');
    const type = typeSelect ? typeSelect.value : 'buy';
    const priceEl = document.getElementById('price');
    const quantityEl = document.getElementById('quantity');
    const dateEl = document.getElementById('date');
    const price = priceEl && priceEl.value ? parseFloat(priceEl.value) : null;
    const quantity = quantityEl && quantityEl.value ? parseFloat(quantityEl.value) : null;
    const date = dateEl && dateEl.value ? dateEl.value : new Date().toISOString().split('T')[0];

    if (!assetName || isNaN(amount) || amount <= 0) {
        showNotification('Please enter valid asset name and amount', 'error');
        return;
    }

    const p = PortfolioDataStore.getPortfolio();
    if (type === 'buy' && amount > p.cashBalance) {
        showNotification(`Insufficient cash balance. Available: $${p.cashBalance.toFixed(2)}`, 'error');
        return;
    }

    const result = await PortfolioDataStore.addTransaction({
        assetName,
        type,
        amount,
        price,
        quantity,
        date
    });

    if (!result.success) {
        showNotification(result.message || 'Failed to add transaction', 'error');
        return;
    }

    updateTransactionList();
    updateTransactionStats();

    if (document.getElementById('portfolio-summary')) {
        updatePortfolioSummary();
        updateTransactionHistory();
        updateAssetAllocation();
    }

    if (document.getElementById('reportTotalValue')) {
        updateReportsPage();
    }

    showNotification(`Transaction added! ${type} ${assetName} for $${amount.toFixed(2)}`, 'success');
    document.getElementById('transactionForm').reset();
}

function updateTransactionList() {
    const transactionList = document.getElementById('transactionList');
    if (!transactionList) return;

    const p = PortfolioDataStore.getPortfolio();
    transactionList.innerHTML = '';

    if (!p || !p.transactions || p.transactions.length === 0) {
        transactionList.innerHTML = '<div class="no-transactions"><p>No transactions yet. Add your first transaction above!</p></div>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'transactions-table';
    table.innerHTML = `<thead><tr><th>Date</th><th>Asset</th><th>Type</th><th>Amount</th><th>Price</th><th>Quantity</th><th>Status</th></tr></thead><tbody></tbody>`;

    const tbody = table.querySelector('tbody');
    const recent = [...p.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    recent.forEach((t) => {
        const row = document.createElement('tr');
        const tDate = t.date ? new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
        row.innerHTML = `
            <td>${tDate}</td>
            <td>${t.assetName}</td>
            <td><span class="transaction-type ${t.type}">${t.type.toUpperCase()}</span></td>
            <td>$${t.amount.toFixed(2)}</td>
            <td>${t.price ? '$' + t.price.toFixed(2) : 'N/A'}</td>
            <td>${t.quantity ? t.quantity.toFixed(2) : 'N/A'}</td>
            <td class="status ${t.status}">${t.status.charAt(0).toUpperCase() + t.status.slice(1)}</td>
        `;
        tbody.appendChild(row);
    });

    transactionList.appendChild(table);

    if (!document.querySelector('#transaction-styles')) {
        const style = document.createElement('style');
        style.id = 'transaction-styles';
        style.textContent = `
            .transactions-table { width: 100%; border-collapse: collapse; margin-top: 20px; background: transparent; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 30px rgba(2,6,23,0.25); }
            .transactions-table th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; text-align: left; font-weight: 600; }
            .transactions-table td { padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,0.02); }
            .transactions-table tr:hover { background-color: rgba(255,255,255,0.02); }
            .transaction-type { padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 0.8em; display: inline-block; }
            .transaction-type.buy { background-color: #d4edda; color: #155724; }
            .transaction-type.sell { background-color: #f8d7da; color: #721c24; }
            .transaction-type.dividend { background-color: #fff3cd; color: #856404; }
            .transaction-type.interest { background-color: #cce5ff; color: #004085; }
            .status.completed { color: #2ecc71; }
            .status.pending { color: #f39c12; }
            .status.cancelled { color: #e74c3c; }
            .no-transactions { text-align: center; padding: 40px; color: rgba(255,255,255,0.8); font-size: 1.1em; }
        `;
        document.head.appendChild(style);
    }
}

function updatePortfolioSummary() {
    const p = PortfolioDataStore.getPortfolio();
    if (!p) return;

    const totalValueElem = document.getElementById('totalValue');
    const growthElem = document.getElementById('growth');
    const riskElem = document.getElementById('riskLevel');
    const cashBalanceElem = document.getElementById('cashBalance');

    if (totalValueElem) {
        totalValueElem.textContent = `$${p.totalValue.toFixed(2)}`;
    }
    if (growthElem) {
        const cls = p.totalGainLossPercentage >= 0 ? 'positive' : 'negative';
        growthElem.innerHTML = `<span class="${cls}">${p.totalGainLossPercentage >= 0 ? '+' : ''}${p.totalGainLossPercentage.toFixed(2)}%</span>`;
    }
    if (riskElem) {
        const vol = Math.abs(p.totalGainLossPercentage);
        let level, color;
        if (vol > 25) { level = 'High'; color = '#e74c3c'; }
        else if (vol > 12) { level = 'Moderate'; color = '#f39c12'; }
        else { level = 'Low'; color = '#2ecc71'; }
        riskElem.textContent = level;
        riskElem.style.color = color;
        riskElem.style.fontWeight = 'bold';
    }
    if (cashBalanceElem) {
        cashBalanceElem.textContent = `$${p.cashBalance.toFixed(2)}`;
    }

    updateAssetAllocation();
    updateTransactionHistory();
}

function updateReportsPage() {
    const p = PortfolioDataStore.getPortfolio();
    if (!p) return;

    const reportTotalValueElem = document.getElementById('reportTotalValue');
    const reportGrowthElem = document.getElementById('reportGrowth');
    const reportTopAssetElem = document.getElementById('reportTopAsset');

    if (reportTotalValueElem) reportTotalValueElem.textContent = `$${p.totalValue.toFixed(2)}`;
    if (reportGrowthElem) {
        const cls = p.totalGainLossPercentage >= 0 ? 'positive' : 'negative';
        reportGrowthElem.innerHTML = `<span class="${cls}">${p.totalGainLossPercentage >= 0 ? '+' : ''}${p.totalGainLossPercentage.toFixed(2)}%</span>`;
    }
    if (reportTopAssetElem) {
        let topAsset = null, topGain = -Infinity;
        p.assets.forEach((a) => {
            if (a.gainLossPercentage > topGain) { topGain = a.gainLossPercentage; topAsset = a; }
        });
        reportTopAssetElem.textContent = topAsset ? `${topAsset.name} (${topGain >= 0 ? '+' : ''}${topGain.toFixed(2)}%)` : 'No assets';
    }
    updateReportsTransactionTable();
}

function updateReportsTransactionTable() {
    const tableBody = document.getElementById('reportsTransactionTable');
    if (!tableBody) return;
    const p = PortfolioDataStore.getPortfolio();
    if (!p || p.transactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No transactions yet</td></tr>';
        return;
    }
    const sorted = [...p.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    let html = '';
    sorted.forEach((t) => {
        const tDate = t.date ? new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
        html += `<tr><td>${tDate}</td><td>${t.assetName}</td><td><span class="transaction-type ${t.type}">${t.type.toUpperCase()}</span></td><td>$${t.amount.toFixed(2)}</td><td class="status ${t.status}">${t.status.charAt(0).toUpperCase() + t.status.slice(1)}</td></tr>`;
    });
    tableBody.innerHTML = html;
}

function initProfilePage() {
    const nameInput = document.getElementById('profileNameInput');
    const emailValue = document.getElementById('profileEmailValue');
    const createdValue = document.getElementById('profileCreatedValue');
    const lastLoginValue = document.getElementById('profileLastLoginValue');
    const avatarPreview = document.getElementById('profileAvatarPreview');
    const avatarGrid = document.getElementById('avatarGrid');
    const saveButton = document.getElementById('saveProfileBtn');

    if (!nameInput || !avatarPreview || !avatarGrid || !saveButton) return;

    const user = AuthManager.getCurrentUser();
    if (!user) return;

    nameInput.value = user.username || '';
    if (emailValue) emailValue.textContent = user.email || '-';
    if (createdValue) createdValue.textContent = user.createdAt ? new Date(user.createdAt).toLocaleString() : '-';
    if (lastLoginValue) lastLoginValue.textContent = user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-';

    const generatedAvatars = AVATAR_PRESETS.map((preset) => generateFaceSVG(preset, 160));
    let selectedAvatar = generatedAvatars[0];
    if (user.avatarPreset) {
        const idx = AVATAR_PRESETS.findIndex((p) => p.id === user.avatarPreset);
        if (idx >= 0) selectedAvatar = generatedAvatars[idx];
    }

    const avatarButtons = generatedAvatars.map((dataUri, index) => {
        const selectedClass = AVATAR_PRESETS[index].id === user.avatarPreset || (!user.avatarPreset && index === 0) ? 'selected' : '';
        return `<button type="button" class="avatar-option ${selectedClass}" data-avatar-index="${index}" aria-label="Select avatar ${index + 1}"><img src="${dataUri}" alt="Avatar option ${index + 1}"></button>`;
    });

    avatarPreview.src = selectedAvatar;
    avatarGrid.innerHTML = avatarButtons.join('');

    avatarGrid.addEventListener('click', function (event) {
        const button = event.target.closest('.avatar-option');
        if (!button) return;
        const idx = parseInt(button.dataset.avatarIndex, 10);
        if (isNaN(idx) || !AVATAR_PRESETS[idx]) return;
        selectedAvatar = generatedAvatars[idx];
        avatarPreview.src = selectedAvatar;
        avatarGrid.querySelectorAll('.avatar-option').forEach((o) => o.classList.toggle('selected', o === button));
    });

    saveButton.addEventListener('click', async function () {
        const updatedName = nameInput.value.trim();
        if (!updatedName) {
            showNotification('Display name cannot be empty', 'error');
            return;
        }

        const selectedIdx = Array.from(avatarGrid.querySelectorAll('.avatar-option')).findIndex((o) => o.classList.contains('selected'));
        const presetId = AVATAR_PRESETS[selectedIdx >= 0 ? selectedIdx : 0].id;

        const result = await AuthManager.updateProfile(user.id, {
            username: updatedName,
            avatarPreset: presetId
        });

        if (!result.success) {
            showNotification(result.message || 'Failed to update profile', 'error');
            return;
        }

        showNotification('Profile updated successfully', 'success');

        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) heroTitle.textContent = `Welcome back, ${updatedName}!`;
    });
}

function updateTransactionHistory() {
    const container = document.getElementById('portfolioTransactionList');
    if (!container) return;
    const p = PortfolioDataStore.getPortfolio();
    if (!p || p.transactions.length === 0) {
        container.innerHTML = '<div class="no-transactions"><p>No transactions yet</p><button onclick="window.location.href=\'transactions.html\'" class="btn btn-primary" style="margin-top: 16px;">Add Transaction</button></div>';
        return;
    }

    const sorted = [...p.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    let html = '<table class="data-table transactions-table"><thead><tr><th>Date</th><th>Asset</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead><tbody>';

    sorted.forEach((t, i) => {
        const tDate = t.date ? new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
        html += `<tr class="transaction-row"><td>${tDate}</td><td><strong>${t.assetName}</strong></td><td><span class="transaction-type ${t.type}">${t.type.charAt(0).toUpperCase() + t.type.slice(1)}</span></td><td class="amount-cell">$${t.amount.toFixed(2)}</td><td><span class="status-badge ${t.status}">${t.status}</span></td></tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function updateAssetAllocation() {
    const allocationContainer = document.getElementById('assetAllocation');
    if (!allocationContainer) return;
    const p = PortfolioDataStore.getPortfolio();
    if (!p || !p.assetAllocation || Object.keys(p.assetAllocation).length === 0) { 
        allocationContainer.innerHTML = ''; 
        return; 
    }

    // Set fixed height for the chart to render properly
    allocationContainer.style.height = '350px';
    allocationContainer.style.width = '100%';

    let chart = window.echarts && echarts.getInstanceByDom(allocationContainer);
    if (!chart && window.echarts) {
        chart = echarts.init(allocationContainer);
    }
    if (!chart) return;

    // Group assets for Sunburst hierarchy
    const groups = {};
    Object.entries(p.assetAllocation).forEach(([name, data]) => {
        // Try to find the asset in portfolio to get its type, fallback to 'Equities'
        const asset = p.assets ? p.assets.find(a => a.name === name) : null;
        const type = asset ? (asset.type.charAt(0).toUpperCase() + asset.type.slice(1)) : 'Equities';
        
        if (!groups[type]) groups[type] = { name: type, children: [] };
        
        groups[type].children.push({
            name: name,
            value: data.value,
            itemStyle: { color: getAssetColor(name) }
        });
    });

    const sunburstData = Object.values(groups).map(g => {
        g.itemStyle = { color: getAssetColor(g.name + 'group') };
        return g;
    });

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                if (!params.value) return params.name;
                return `${params.name}<br/>Value: $${params.value.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
            },
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            borderColor: '#334155',
            textStyle: { color: '#f8fafc' }
        },
        series: {
            type: 'sunburst',
            data: sunburstData,
            radius: [0, '95%'],
            itemStyle: {
                borderRadius: 4,
                borderWidth: 2,
                borderColor: '#0f172a'
            },
            label: {
                show: true,
                color: '#fff',
                fontSize: 11,
                formatter: function (param) {
                    // Only show label if the wedge is large enough
                    return param.treePathInfo.length === 2 || param.value > (p.totalValue * 0.05) ? param.name : '';
                }
            }
        }
    };
    
    chart.setOption(option);
    
    window.addEventListener('resize', () => chart.resize());
}

function getAssetColor(name) {
    const colors = ['#38bdf8', '#818cf8', '#10b981', '#a880ff', '#2dd4bf', '#f472b6', '#fbbf24', '#f87171'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
}

async function updatePortfolioChart() {
    const chartContainer = document.getElementById('portfolioChart');
    if (!chartContainer) return;

    try {
        const p = PortfolioDataStore.getPortfolio();
        let chartData = { labels: [], values: [] };
        
        // Fetch real historical data from backend
        const historyResponse = await PortfolioApi.getPortfolioHistory(30);
        if (historyResponse && historyResponse.success && historyResponse.data && historyResponse.data.length > 0) {
            chartData.labels = historyResponse.data.map(s => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            chartData.values = historyResponse.data.map(s => s.totalValue);
        } else {
            // Fallback to geometric generation if no history exists (e.g. new user)
            chartData = generateHistoricalData(p);
        }

        if (window.echarts) {
            // Check if chart instance exists, dispose it to prevent memory leaks
            let myChart = echarts.getInstanceByDom(chartContainer);
            if (myChart) {
                myChart.dispose();
            }
            
            myChart = echarts.init(chartContainer);
            const option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return `${params[0].name}<br/>Value: $${params[0].value.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
                    },
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: '#334155',
                    textStyle: { color: '#f8fafc' }
                },
                grid: { left: '3%', right: '4%', bottom: '3%', top: '5%', containLabel: true },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: chartData.labels,
                    axisLine: { lineStyle: { color: '#334155' } },
                    axisLabel: { color: '#94a3b8' }
                },
                yAxis: {
                    type: 'value',
                    axisLine: { show: false },
                    splitLine: { lineStyle: { color: '#1e293b' } },
                    axisLabel: { color: '#94a3b8', formatter: '${value}' },
                    scale: true
                },
                series: [
                    {
                        name: 'Portfolio Value',
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(56, 189, 248, 0.4)' },
                                { offset: 1, color: 'rgba(56, 189, 248, 0.0)' }
                            ])
                        },
                        lineStyle: { width: 3, color: '#38bdf8' },
                        data: chartData.values
                    }
                ]
            };
            myChart.setOption(option);
            
            // Handle window resize
            window.addEventListener('resize', function() {
                myChart.resize();
            });
        }
    } catch (err) {
        console.error('Failed to load portfolio chart', err);
    }
}

function generateHistoricalData(p) {
    const labels = [];
    const values = [];
    const startingValue = 100000;
    let currentValue = startingValue;

    const sortedTransactions = [...(p ? p.transactions : [])].sort((a, b) => new Date(a.date) - new Date(b.date));
    const monthlyCashFlow = new Map();

    sortedTransactions.forEach((t) => {
        const d = new Date(t.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const signed = (t.type === 'sell' || t.type === 'dividend' || t.type === 'interest') ? t.amount : -t.amount;
        monthlyCashFlow.set(key, (monthlyCashFlow.get(key) || 0) + signed);
    });

    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        labels.push(d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear());
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        currentValue += monthlyCashFlow.get(key) || 0;
        values.push(currentValue);
    }

    return { labels, values };
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = 'position:fixed;top:20px;right:20px;padding:15px 20px;border-radius:5px;color:white;font-weight:bold;z-index:1000;animation:slideIn 0.3s ease;';

    if (type === 'success') notification.style.backgroundColor = '#28a745';
    else if (type === 'error') notification.style.backgroundColor = '#dc3545';
    else notification.style.backgroundColor = '#17a2b8';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);

    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } } .positive { color: #2ecc71; } .negative { color: #e74c3c; }';
        document.head.appendChild(style);
    }
}

async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        await AuthManager.logout();
    }
}

async function exportTransactions() {
    const p = PortfolioDataStore.getPortfolio();
    if (!p || p.transactions.length === 0) {
        showNotification('No transactions to export', 'error');
        return;
    }

    const btn = document.querySelector('.export-btn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="btn-icon">⏳</span> Exporting...'; }

    try {
        await PortfolioApi.exportCSV();
        showNotification('✅ CSV downloaded successfully! Open in Excel or Google Sheets.', 'success');
    } catch (err) {
        showNotification('Export failed. Please try again.', 'error');
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<span class="btn-icon">📥</span> Export CSV'; }
    }
}

async function clearAllTransactions() {
    const p = PortfolioDataStore.getPortfolio();
    if (!p || p.transactions.length === 0) {
        showNotification('No transactions to clear', 'info');
        return;
    }

    if (confirm('Are you sure you want to clear ALL transactions? This cannot be undone.')) {
        const result = await PortfolioDataStore.clearAllTransactions();
        if (!result.success) {
            showNotification(result.message || 'Failed to clear', 'error');
            return;
        }

        updateTransactionList();
        updateTransactionStats();

        if (document.getElementById('portfolio-summary')) {
            updatePortfolioSummary();
            updateTransactionHistory();
            updateAssetAllocation();
        }
        if (document.getElementById('reportTotalValue')) {
            updateReportsPage();
        }

        showNotification('All transactions cleared', 'success');
    }
}

function updateTransactionStats() {
    const p = PortfolioDataStore.getPortfolio();
    if (!p) return;

    const totalTransactionsElem = document.getElementById('totalTransactions');
    const totalTransactionValueElem = document.getElementById('totalTransactionValue');

    if (totalTransactionsElem) totalTransactionsElem.textContent = p.transactions.length;
    if (totalTransactionValueElem) {
        const total = p.transactions.reduce((sum, t) => sum + t.amount, 0);
        totalTransactionValueElem.textContent = `$${total.toFixed(2)}`;
    }
}

function initTransactionsPage() {
    if (!document.getElementById('transactionForm')) return;

    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

    updateTransactionStats();
    updateTransactionList();

    const form = document.getElementById('transactionForm');
    if (form) form.addEventListener('submit', handleTransactionSubmit);
}

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const user = window.AuthManager ? window.AuthManager.getCurrentUser() : null;
        if (user && user.username) {
            const nameEl = document.getElementById('sidebarUsername');
            if (nameEl) nameEl.textContent = user.username;
        } else {
            // fallback to payload if username is ever added to JWT
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const nameEl = document.getElementById('sidebarUsername');
                    if (nameEl && payload.username) nameEl.textContent = payload.username;
                } catch(e) {}
            }
        }
    });
    document.addEventListener('click', function (e) {
        const toggle = e.target.closest('.nav-toggle');
        if (toggle) {
            const nav = toggle.closest('.navbar');
            if (!nav) return;
            const links = nav.querySelector('.nav-links');
            if (!links) return;
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            links.classList.toggle('open', !expanded);
            return;
        }
        const openNav = document.querySelector('.nav-links.open');
        if (openNav && !e.target.closest('.navbar')) {
            openNav.classList.remove('open');
            const t = document.querySelector('.nav-toggle[aria-expanded="true"]');
            if (t) t.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('submit', function (e) {
        const form = e.target.closest('#newsletterForm');
        if (!form) return;
        e.preventDefault();
        subscribeNewsletter(form);
    });
})();

function subscribeNewsletter(form) {
    const input = form ? form.querySelector('input[type="email"]') : null;
    const email = input ? input.value.trim() : '';
    if (!email || !email.includes('@')) {
        if (typeof showNotification === 'function') showNotification('Please enter a valid email address', 'error');
        else alert('Please enter a valid email address');
        return;
    }
    if (typeof showNotification === 'function') showNotification('Subscribed!', 'success');
    else alert('Subscribed!');
    if (form) form.reset();
}

(function () {
    const observerOptions = { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 };
    const revealCallback = (entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) { entry.target.classList.add('in-view'); obs.unobserve(entry.target); }
        });
    };
    try {
        const observer = new IntersectionObserver(revealCallback, observerOptions);
        document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    } catch (err) {
        document.querySelectorAll('.animate-on-scroll').forEach((el) => el.classList.add('in-view'));
    }

    function animateCount(el, duration = 1400) {
        const target = parseFloat(el.getAttribute('data-count')) || 0;
        const startTime = performance.now();
        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = value.toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(tick);
    }

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) { animateCount(entry.target, 1200); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));
})();

window.showNotification = showNotification;
window.logout = logout;
window.exportTransactions = exportTransactions;
window.clearAllTransactions = clearAllTransactions;
window.initTransactionsPage = initTransactionsPage;

async function loadMarketNews() {
    const newsContainer = document.getElementById('marketNewsList');
    if (!newsContainer) return;

    try {
        const response = await apiClient.get('/portfolio/news');
        const news = response.data.data || [];

        if (news.length === 0) {
            newsContainer.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:var(--space-4)">No recent news available.</p>';
            return;
        }

        newsContainer.innerHTML = news.map(item => {
            const dateStr = item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
            return `
                <div class="news-item" style="border-bottom:1px solid var(--border-subtle); padding-bottom:var(--space-3); margin-bottom:var(--space-1);">
                    <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer" style="font-weight:600; color:var(--text-primary); text-decoration:none; font-size:var(--text-sm); line-height:1.4;" class="news-title-link">
                            ${item.title}
                        </a>
                        <span style="font-size:var(--text-xs); color:var(--text-muted); white-space:nowrap; margin-left:var(--space-3);">${dateStr}</span>
                    </div>
                    <p style="font-size:var(--text-xs); color:var(--text-muted); margin:0; line-height:1.5;">${item.description}</p>
                </div>
            `;
        }).join('');
    } catch (err) {
        newsContainer.innerHTML = '<p style="color:var(--rose);text-align:center;padding:var(--space-4)">Failed to load market news.</p>';
    }
}
window.loadMarketNews = loadMarketNews;

window.exportPortfolioData = async () => {
    if (typeof exportTransactions === 'function') {
        return exportTransactions();
    }
};

window.exportPortfolioPDF = async () => {
    try {
        const btn = document.querySelector('button[onclick="exportPortfolioPDF()"]');
        if (btn) { btn.disabled = true; btn.innerHTML = '<span class="btn-icon">⏳</span> Generating...'; }
        
    if (confirm('Are you sure you want to clear ALL transactions? This cannot be undone.')) {
        const result = await PortfolioDataStore.clearAllTransactions();
        if (!result.success) {
            showNotification(result.message || 'Failed to clear', 'error');
            return;
        }

        updateTransactionList();
        updateTransactionStats();

        if (document.getElementById('portfolio-summary')) {
            updatePortfolioSummary();
            updateTransactionHistory();
            updateAssetAllocation();
        }
        if (document.getElementById('reportTotalValue')) {
            updateReportsPage();
        }

        showNotification('All transactions cleared', 'success');
    }
}

function updateTransactionStats() {
    const p = PortfolioDataStore.getPortfolio();
    if (!p) return;

    const totalTransactionsElem = document.getElementById('totalTransactions');
    const totalTransactionValueElem = document.getElementById('totalTransactionValue');

    if (totalTransactionsElem) totalTransactionsElem.textContent = p.transactions.length;
    if (totalTransactionValueElem) {
        const total = p.transactions.reduce((sum, t) => sum + t.amount, 0);
        totalTransactionValueElem.textContent = `$${total.toFixed(2)}`;
    }
}

function initTransactionsPage() {
    if (!document.getElementById('transactionForm')) return;

    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

    updateTransactionStats();
    updateTransactionList();

    const form = document.getElementById('transactionForm');
    if (form) form.addEventListener('submit', handleTransactionSubmit);
}

(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const user = window.AuthManager ? window.AuthManager.getCurrentUser() : null;
        if (user && user.username) {
            const nameEl = document.getElementById('sidebarUsername');
            if (nameEl) nameEl.textContent = user.username;
        } else {
            // fallback to payload if username is ever added to JWT
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const nameEl = document.getElementById('sidebarUsername');
                    if (nameEl && payload.username) nameEl.textContent = payload.username;
                } catch(e) {}
            }
        }
    });
    document.addEventListener('click', function (e) {
        const toggle = e.target.closest('.nav-toggle');
        if (toggle) {
            const nav = toggle.closest('.navbar');
            if (!nav) return;
            const links = nav.querySelector('.nav-links');
            if (!links) return;
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            links.classList.toggle('open', !expanded);
            return;
        }
        const openNav = document.querySelector('.nav-links.open');
        if (openNav && !e.target.closest('.navbar')) {
            openNav.classList.remove('open');
            const t = document.querySelector('.nav-toggle[aria-expanded="true"]');
            if (t) t.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('submit', function (e) {
        const form = e.target.closest('#newsletterForm');
        if (!form) return;
        e.preventDefault();
        subscribeNewsletter(form);
    });
})();

function subscribeNewsletter(form) {
    const input = form ? form.querySelector('input[type="email"]') : null;
    const email = input ? input.value.trim() : '';
    if (!email || !email.includes('@')) {
        if (typeof showNotification === 'function') showNotification('Please enter a valid email address', 'error');
        else alert('Please enter a valid email address');
        return;
    }
    if (typeof showNotification === 'function') showNotification('Subscribed!', 'success');
    else alert('Subscribed!');
    if (form) form.reset();
}

(function () {
    const observerOptions = { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 };
    const revealCallback = (entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) { entry.target.classList.add('in-view'); obs.unobserve(entry.target); }
        });
    };
    try {
        const observer = new IntersectionObserver(revealCallback, observerOptions);
        document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    } catch (err) {
        document.querySelectorAll('.animate-on-scroll').forEach((el) => el.classList.add('in-view'));
    }

    function animateCount(el, duration = 1400) {
        const target = parseFloat(el.getAttribute('data-count')) || 0;
        const startTime = performance.now();
        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = value.toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(tick);
    }

    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) { animateCount(entry.target, 1200); obs.unobserve(entry.target); }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));
})();

window.showNotification = showNotification;
window.logout = logout;
window.exportTransactions = exportTransactions;
window.clearAllTransactions = clearAllTransactions;
window.initTransactionsPage = initTransactionsPage;

async function loadMarketNews() {
    const newsContainer = document.getElementById('marketNewsList');
    if (!newsContainer) return;

    try {
        const response = await apiClient.get('/portfolio/news');
        const news = response.data.data || [];

        if (news.length === 0) {
            newsContainer.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:var(--space-4)">No recent news available.</p>';
            return;
        }

        newsContainer.innerHTML = news.map(item => {
            const dateStr = item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
            return `
                <div class="news-item" style="border-bottom:1px solid var(--border-subtle); padding-bottom:var(--space-3); margin-bottom:var(--space-1);">
                    <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer" style="font-weight:600; color:var(--text-primary); text-decoration:none; font-size:var(--text-sm); line-height:1.4;" class="news-title-link">
                            ${item.title}
                        </a>
                        <span style="font-size:var(--text-xs); color:var(--text-muted); white-space:nowrap; margin-left:var(--space-3);">${dateStr}</span>
                    </div>
                    <p style="font-size:var(--text-xs); color:var(--text-muted); margin:0; line-height:1.5;">${item.description}</p>
                </div>
            `;
        }).join('');
    } catch (err) {
        newsContainer.innerHTML = '<p style="color:var(--rose);text-align:center;padding:var(--space-4)">Failed to load market news.</p>';
    }
}
window.loadMarketNews = loadMarketNews;

window.exportPortfolioData = async () => {
    if (typeof exportTransactions === 'function') {
        return exportTransactions();
    }
};

window.exportPortfolioPDF = async () => {
    try {
        const btn = document.querySelector('button[onclick="exportPortfolioPDF()"]');
        if (btn) { btn.disabled = true; btn.innerHTML = '<span class="btn-icon">⏳</span> Generating...'; }
        
        await PortfolioApi.exportPDF();
        showNotification('✅ PDF Report downloaded successfully!', 'success');
    } catch (err) {
        showNotification('PDF Export failed. Please try again.', 'error');
    } finally {
        const btn = document.querySelector('button[onclick="exportPortfolioPDF()"]');
        if (btn) { btn.disabled = false; btn.innerHTML = '📄 Download PDF Report'; }
    }
};

window.formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
