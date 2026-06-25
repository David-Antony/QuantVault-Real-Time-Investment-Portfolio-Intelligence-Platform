const AVATAR_PRESETS = [
    { id: 'face-01', faceRatio: 1.38, faceWidth: 0.66, eyeSpacing: 0.205, eyeSize: 0.052, browOffset: -0.07, mouthCurve: 0.04, hair: 'side', hairColor: '#2a251f', glasses: false, beard: false, cheekWidth: 0.28, jawWidth: 0.20, noseLength: 0.15, noseWidth: 0.06, earScale: 1.0, hairHeight: 0.30, shoulderWidth: 0.56, shirtColor: '#d9959d' },
    { id: 'face-02', faceRatio: 1.15, eyeSpacing: 0.20, eyeSize: 0.055, browOffset: -0.05, mouthCurve: 0.06, hair: 'side', hairColor: '#3a2f1b', glasses: true, beard: false },
    { id: 'face-03', faceRatio: 1.3, eyeSpacing: 0.24, eyeSize: 0.065, browOffset: -0.07, mouthCurve: -0.05, hair: 'curly', hairColor: '#1f1f1f', glasses: false, beard: true },
    { id: 'face-04', faceRatio: 1.18, eyeSpacing: 0.21, eyeSize: 0.055, browOffset: -0.04, mouthCurve: 0.12, hair: 'bald', hairColor: '#000000', glasses: false, beard: false },
    { id: 'face-05', faceRatio: 1.22, eyeSpacing: 0.23, eyeSize: 0.06, browOffset: -0.06, mouthCurve: 0.0, hair: 'messy', hairColor: '#4a2f2f', glasses: false, beard: false },
    { id: 'face-06', faceRatio: 1.28, eyeSpacing: 0.19, eyeSize: 0.06, browOffset: -0.06, mouthCurve: -0.08, hair: 'short', hairColor: '#222222', glasses: false, beard: true },
    { id: 'face-07', faceRatio: 1.12, eyeSpacing: 0.2, eyeSize: 0.05, browOffset: -0.03, mouthCurve: 0.18, hair: 'fringe', hairColor: '#2b2b2b', glasses: false, beard: false },
    { id: 'face-08', faceRatio: 1.35, eyeSpacing: 0.25, eyeSize: 0.07, browOffset: -0.08, mouthCurve: -0.12, hair: 'receed', hairColor: '#222222', glasses: false, beard: false },
    { id: 'face-09', faceRatio: 1.2, eyeSpacing: 0.21, eyeSize: 0.06, browOffset: -0.05, mouthCurve: 0.14, hair: 'short', hairColor: '#1b1b1b', glasses: true, beard: false },
    { id: 'face-10', faceRatio: 1.3, eyeSpacing: 0.22, eyeSize: 0.065, browOffset: -0.06, mouthCurve: 0.02, hair: 'bald', hairColor: '#000000', glasses: false, beard: true },
    { id: 'face-11', faceRatio: 1.16, eyeSpacing: 0.2, eyeSize: 0.055, browOffset: -0.04, mouthCurve: 0.08, hair: 'side', hairColor: '#3c2b2b', glasses: false, beard: false },
    { id: 'face-12', faceRatio: 1.24, eyeSpacing: 0.23, eyeSize: 0.06, browOffset: -0.05, mouthCurve: -0.02, hair: 'short', hairColor: '#2a2a2a', glasses: false, beard: false }
];

function generateFaceSVG(preset, size = 160) {
    const w = size, h = size, cx = w / 2, cy = h / 2 + 7;
    const faceW = w * (preset.faceWidth || 0.58);
    const faceH = faceW * preset.faceRatio;
    const faceTop = cy - faceH * 0.52, faceBottom = cy + faceH * 0.50;
    const faceLeft = cx - faceW * 0.50, faceRight = cx + faceW * 0.50;
    const skinBase = '#f1d2c5', skinHighlight = '#f8e3da', skinShadow = '#d9b0a0';
    const hairDark = preset.hairColor, hairShadow = '#111111';
    const eyeGap = faceW * preset.eyeSpacing;
    const eyeY = cy - faceH * 0.14;
    const eyeWhiteW = w * 0.085, eyeWhiteH = w * 0.055;
    const irisR = w * 0.022, pupilR = w * 0.010;
    const noseTop = eyeY + eyeWhiteH * 0.40;
    const noseBottom = cy + faceH * (preset.noseLength || 0.12);
    const mouthY = cy + faceH * 0.20;
    const mouthW = faceW * 0.16;
    const jawWidth = faceW * (preset.jawWidth || 0.23);
    const cheekWidth = faceW * (preset.cheekWidth || 0.30);

    const facePath = `M ${faceLeft + 10} ${faceTop + 14}
        C ${faceLeft - 8} ${cy - faceH * 0.10}, ${faceLeft - 8} ${faceBottom - 26}, ${cx - jawWidth} ${faceBottom - 4}
        C ${cx - faceW * 0.16} ${faceBottom + 10}, ${cx + faceW * 0.16} ${faceBottom + 10}, ${cx + jawWidth} ${faceBottom - 4}
        C ${faceRight + 8} ${faceBottom - 26}, ${faceRight + 8} ${cy - faceH * 0.10}, ${faceRight - 10} ${faceTop + 14}
        C ${cx + faceW * 0.18} ${faceTop - 10}, ${cx - faceW * 0.18} ${faceTop - 10}, ${faceLeft + 10} ${faceTop + 14} Z`;

    let hairPath = '', hairAccent = '';
    if (preset.hair !== 'bald') {
        const hairHeight = preset.hairHeight || 0.34;
        if (preset.hair === 'receed') {
            hairPath = `M ${faceLeft - 4} ${faceTop + 10}
                C ${faceLeft + 6} ${faceTop - 24}, ${cx - faceW * 0.12} ${faceTop - 34}, ${cx} ${faceTop - 20}
                C ${cx + faceW * 0.12} ${faceTop - 34}, ${faceRight - 6} ${faceTop - 24}, ${faceRight + 4} ${faceTop + 10}
                C ${faceRight - 16} ${faceTop + 8}, ${faceLeft + 16} ${faceTop + 8}, ${faceLeft - 4} ${faceTop + 10} Z`;
        } else if (preset.hair === 'side') {
            const hairPeakLeft = faceTop - Math.round(hairHeight * 140);
            const hairPeakCenter = faceTop - Math.round(hairHeight * 160);
            const hairPeakRight = faceTop - Math.round(hairHeight * 100);
            hairPath = `M ${faceLeft - 2} ${faceTop + 14}
                C ${faceLeft + 12} ${hairPeakLeft}, ${cx - faceW * 0.10} ${hairPeakCenter}, ${cx + faceW * 0.22} ${hairPeakRight}
                C ${cx + faceW * 0.30} ${faceTop - 6}, ${cx + faceW * 0.18} ${faceTop + 14}, ${faceRight + 2} ${faceTop + 18}
                C ${faceRight - 14} ${faceTop + 8}, ${faceLeft + 18} ${faceTop + 8}, ${faceLeft - 2} ${faceTop + 14} Z`;
            hairAccent = `<path d="M ${cx - faceW * 0.16} ${faceTop - 10} C ${cx - faceW * 0.06} ${faceTop - 22}, ${cx + faceW * 0.10} ${faceTop - 22}, ${cx + faceW * 0.14} ${faceTop - 8}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4" stroke-linecap="round"/>`;
        } else if (preset.hair === 'curly') {
            hairPath = `M ${faceLeft - 6} ${faceTop + 12}
                C ${faceLeft + 10} ${faceTop - 40}, ${cx - faceW * 0.10} ${faceTop - 54}, ${cx + faceW * 0.22} ${faceTop - 34}
                C ${faceRight + 8} ${faceTop - 6}, ${faceRight - 2} ${faceTop + 20}, ${faceRight - 4} ${faceTop + 18}
                C ${faceRight - 12} ${faceTop + 8}, ${faceLeft + 16} ${faceTop + 8}, ${faceLeft - 6} ${faceTop + 12} Z`;
        } else {
            hairPath = `M ${faceLeft - 4} ${faceTop + 12}
                C ${faceLeft + 4} ${faceTop - 36}, ${cx - faceW * 0.18} ${faceTop - 48}, ${cx} ${faceTop - 30}
                C ${cx + faceW * 0.16} ${faceTop - 48}, ${faceRight - 4} ${faceTop - 36}, ${faceRight + 4} ${faceTop + 12}
                C ${faceRight - 18} ${faceTop + 6}, ${faceLeft + 18} ${faceTop + 6}, ${faceLeft - 4} ${faceTop + 12} Z`;
        }
    }

    const earWidth = (preset.earScale || 1) * faceW * 0.06;
    const earHeight = faceH * 0.16;
    const earLeft = `<path d="M ${faceLeft - 4} ${cy - earHeight * 0.80}
        C ${faceLeft - 12} ${cy - faceH * 0.08}, ${faceLeft - 12} ${cy + faceH * 0.08}, ${faceLeft - 4} ${cy + faceH * 0.14}
        C ${faceLeft + earWidth} ${cy + faceH * 0.11}, ${faceLeft + earWidth} ${cy - faceH * 0.11}, ${faceLeft - 4} ${cy - earHeight * 0.80} Z" fill="url(#earGrad)" opacity="0.95"/>
        <path d="M ${faceLeft - 6} ${cy - faceH * 0.02} C ${faceLeft - 8} ${cy + faceH * 0.03}, ${faceLeft - 8} ${cy + faceH * 0.06}, ${faceLeft - 3} ${cy + faceH * 0.09}" fill="none" stroke="rgba(134,94,82,0.35)" stroke-width="1.5" stroke-linecap="round"/>`;
    const earRight = `<path d="M ${faceRight + 4} ${cy - earHeight * 0.80}
        C ${faceRight + 12} ${cy - faceH * 0.08}, ${faceRight + 12} ${cy + faceH * 0.08}, ${faceRight + 4} ${cy + faceH * 0.14}
        C ${faceRight - earWidth} ${cy + faceH * 0.11}, ${faceRight - earWidth} ${cy - faceH * 0.11}, ${faceRight + 4} ${cy - earHeight * 0.80} Z" fill="url(#earGrad)" opacity="0.95"/>
        <path d="M ${faceRight + 6} ${cy - faceH * 0.02} C ${faceRight + 8} ${cy + faceH * 0.03}, ${faceRight + 8} ${cy + faceH * 0.06}, ${faceRight + 3} ${cy + faceH * 0.09}" fill="none" stroke="rgba(134,94,82,0.35)" stroke-width="1.5" stroke-linecap="round"/>`;

    const beardPath = preset.beard ? `
        <path d="M ${cx - faceW * 0.20} ${cy + faceH * 0.10}
            C ${cx - faceW * 0.24} ${cy + faceH * 0.24}, ${cx - faceW * 0.14} ${faceBottom + 10}, ${cx} ${faceBottom + 14}
            C ${cx + faceW * 0.14} ${faceBottom + 10}, ${cx + faceW * 0.24} ${cy + faceH * 0.24}, ${cx + faceW * 0.20} ${cy + faceH * 0.10}
            C ${cx + faceW * 0.14} ${cy + faceH * 0.04}, ${cx - faceW * 0.14} ${cy + faceH * 0.04}, ${cx - faceW * 0.20} ${cy + faceH * 0.10} Z" fill="#35261f" opacity="0.92"/>
        <path d="M ${cx - faceW * 0.15} ${cy + faceH * 0.18} C ${cx - faceW * 0.05} ${cy + faceH * 0.25}, ${cx + faceW * 0.05} ${cy + faceH * 0.25}, ${cx + faceW * 0.15} ${cy + faceH * 0.18}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4" stroke-linecap="round"/>
    ` : '';

    const eyeMarkup = (side) => {
        const x = cx + side * eyeGap;
        const browTilt = side * (preset.hair === 'side' ? -3 : 0);
        return `
            <ellipse cx="${x}" cy="${eyeY}" rx="${eyeWhiteW}" ry="${eyeWhiteH}" fill="#f6efe9" />
            <ellipse cx="${x + side * 1.5}" cy="${eyeY + 1}" rx="${irisR}" ry="${irisR * 1.05}" fill="#3b4b59" />
            <circle cx="${x + side * 1.9}" cy="${eyeY - 0.2}" r="${pupilR}" fill="#111" />
            <circle cx="${x + side * 1.1}" cy="${eyeY - 1.6}" r="${pupilR * 0.35}" fill="rgba(255,255,255,0.85)" />
            <path d="M ${x - eyeWhiteW * 0.95} ${eyeY - eyeWhiteH * 0.92} C ${x - eyeWhiteW * 0.25} ${eyeY - eyeWhiteH * 1.18 + browTilt}, ${x + eyeWhiteW * 0.25} ${eyeY - eyeWhiteH * 1.12 + browTilt}, ${x + eyeWhiteW * 0.98} ${eyeY - eyeWhiteH * 0.88}" fill="none" stroke="#2c1f1a" stroke-width="${preset.browOffset < -0.055 ? 3.8 : 3.1}" stroke-linecap="round"/>
            <path d="M ${x - eyeWhiteW * 0.92} ${eyeY + eyeWhiteH * 0.76} C ${x - eyeWhiteW * 0.28} ${eyeY + eyeWhiteH * 0.95}, ${x + eyeWhiteW * 0.28} ${eyeY + eyeWhiteH * 0.92}, ${x + eyeWhiteW * 0.92} ${eyeY + eyeWhiteH * 0.68}" fill="none" stroke="rgba(62,38,32,0.28)" stroke-width="1.4" stroke-linecap="round"/>
        `;
    };

    const glasses = preset.glasses ? `
        <g opacity="0.82">
            <rect x="${cx - eyeGap - eyeWhiteW * 1.18}" y="${eyeY - eyeWhiteH * 1.15}" width="${eyeWhiteW * 2.25}" height="${eyeWhiteH * 2.25}" rx="12" fill="none" stroke="#2a2a2a" stroke-width="2.2"/>
            <rect x="${cx + eyeGap - eyeWhiteW * 1.10}" y="${eyeY - eyeWhiteH * 1.15}" width="${eyeWhiteW * 2.25}" height="${eyeWhiteH * 2.25}" rx="12" fill="none" stroke="#2a2a2a" stroke-width="2.2"/>
            <line x1="${cx - eyeWhiteW * 0.05}" y1="${eyeY}" x2="${cx + eyeWhiteW * 0.05}" y2="${eyeY}" stroke="#2a2a2a" stroke-width="2.1"/>
        </g>
    ` : '';

    const nose = `
        <path d="M ${cx - 1} ${noseTop}
            C ${cx - 5} ${cy + faceH * 0.02}, ${cx - 8} ${cy + faceH * 0.10}, ${cx - 4} ${noseBottom - 4}
            C ${cx - 1} ${noseBottom + 3}, ${cx + 5} ${noseBottom + 3}, ${cx + 8} ${noseBottom - 2}
            C ${cx + 10} ${cy + faceH * 0.12}, ${cx + 5} ${cy + faceH * 0.02}, ${cx + 1} ${noseTop}" fill="none" stroke="rgba(116,86,74,0.55)" stroke-width="2" stroke-linecap="round"/>
        <path d="M ${cx - 6} ${noseBottom - 2} C ${cx - 2} ${noseBottom + 1}, ${cx + 2} ${noseBottom + 1}, ${cx + 6} ${noseBottom - 2}" fill="none" stroke="rgba(116,86,74,0.35)" stroke-width="1.6" stroke-linecap="round"/>
    `;

    const mouthCurve = preset.mouthCurve;
    const mouth = `
        <path d="M ${cx - mouthW} ${mouthY}
            C ${cx - mouthW * 0.25} ${mouthY + mouthCurve * faceH * 0.18}, ${cx + mouthW * 0.25} ${mouthY + mouthCurve * faceH * 0.18}, ${cx + mouthW} ${mouthY}" fill="none" stroke="#7a4a3a" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M ${cx - mouthW * 0.56} ${mouthY + 2} C ${cx - mouthW * 0.10} ${mouthY + 6}, ${cx + mouthW * 0.10} ${mouthY + 6}, ${cx + mouthW * 0.56} ${mouthY + 2}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.4" stroke-linecap="round"/>
    `;

    const cheekGlowLeft = `<ellipse cx="${cx - cheekWidth * 0.36}" cy="${cy + faceH * 0.08}" rx="${faceW * 0.10}" ry="${faceH * 0.08}" fill="rgba(255,182,193,0.14)"/>`;
    const cheekGlowRight = `<ellipse cx="${cx + cheekWidth * 0.36}" cy="${cy + faceH * 0.08}" rx="${faceW * 0.10}" ry="${faceH * 0.08}" fill="rgba(255,182,193,0.14)"/>`;
    const chinShadow = `<ellipse cx="${cx}" cy="${faceBottom - 2}" rx="${faceW * 0.20}" ry="${faceH * 0.06}" fill="rgba(104,72,59,0.12)"/>`;
    const neck = `<path d="M ${cx - faceW * 0.10} ${faceBottom - 4} C ${cx - faceW * 0.10} ${faceBottom + 10}, ${cx - faceW * 0.12} ${faceBottom + 24}, ${cx - faceW * 0.08} ${faceBottom + 34} L ${cx + faceW * 0.08} ${faceBottom + 34} C ${cx + faceW * 0.12} ${faceBottom + 24}, ${cx + faceW * 0.10} ${faceBottom + 10}, ${cx + faceW * 0.10} ${faceBottom - 4} Z" fill="url(#neckGrad)"/>`;
    const shoulders = `<path d="M ${cx - faceW * (preset.shoulderWidth || 0.54)} ${faceBottom + 28} C ${cx - faceW * 0.36} ${faceBottom + 16}, ${cx - faceW * 0.18} ${faceBottom + 8}, ${cx} ${faceBottom + 8} C ${cx + faceW * 0.18} ${faceBottom + 8}, ${cx + faceW * 0.36} ${faceBottom + 16}, ${cx + faceW * (preset.shoulderWidth || 0.54)} ${faceBottom + 28} L ${cx + faceW * (preset.shoulderWidth || 0.54)} ${h + 8} L ${cx - faceW * (preset.shoulderWidth || 0.54)} ${h + 8} Z" fill="${preset.shirtColor || '#cfd8e3'}" opacity="0.92"/>
    <path d="M ${cx - faceW * 0.28} ${faceBottom + 12} C ${cx - faceW * 0.12} ${faceBottom + 6}, ${cx + faceW * 0.12} ${faceBottom + 6}, ${cx + faceW * 0.28} ${faceBottom + 12}" fill="none" stroke="rgba(255,255,255,0.24)" stroke-width="2.2" stroke-linecap="round"/>`;

    const skinTone = preset.hair === 'bald' ? '#efcfbf' : skinBase;

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
            <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f9fafb"/>
                <stop offset="100%" stop-color="#eef2f7"/>
            </linearGradient>
            <radialGradient id="skinGrad" cx="38%" cy="30%" r="72%">
                <stop offset="0%" stop-color="${skinHighlight}"/>
                <stop offset="55%" stop-color="${skinTone}"/>
                <stop offset="100%" stop-color="${skinShadow}"/>
            </radialGradient>
            <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${hairDark}"/>
                <stop offset="100%" stop-color="${hairShadow}"/>
            </linearGradient>
            <linearGradient id="neckGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${skinTone}"/>
                <stop offset="100%" stop-color="${skinShadow}"/>
            </linearGradient>
            <linearGradient id="earGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${skinHighlight}"/>
                <stop offset="100%" stop-color="${skinShadow}"/>
            </linearGradient>
            <filter id="portraitShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#1f2937" flood-opacity="0.22"/>
            </filter>
        </defs>
        <rect width="100%" height="100%" rx="18" fill="url(#bgGrad)"/>
        <ellipse cx="${cx}" cy="${cy + faceH * 0.08}" rx="${faceW * 0.40}" ry="${faceH * 0.44}" fill="rgba(31,41,55,0.05)"/>
        <g filter="url(#portraitShadow)">
            ${hairPath ? `<path d="${hairPath}" fill="url(#hairGrad)"/>` : ''}
            ${hairAccent}
            ${earLeft}
            ${earRight}
            ${shoulders}
            ${neck}
            <path d="${facePath}" fill="url(#skinGrad)"/>
            <path d="${facePath}" fill="none" stroke="rgba(255,255,255,0.30)" stroke-width="1.3"/>
            ${cheekGlowLeft}
            ${cheekGlowRight}
            ${chinShadow}
            ${beardPath}
            ${eyeMarkup(-1)}
            ${eyeMarkup(1)}
            ${glasses}
            ${nose}
            ${mouth}
            <path d="M ${faceLeft + 24} ${faceTop + 20} C ${cx - 14} ${faceTop + 2}, ${cx + 16} ${faceTop + 4}, ${faceRight - 18} ${faceTop + 22}" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="3.6" stroke-linecap="round"/>
        </g>
    </svg>`;

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

document.addEventListener('DOMContentLoaded', async function () {
    portfolioData = await PortfolioDataStore.loadPortfolio();
    setActiveNavLink();
    setBodyPageClass();

    if (document.getElementById('portfolio-summary')) {
        updatePortfolioSummary();
        updateTransactionHistory();
        updateAssetAllocation();
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
        container.innerHTML = '<div class="no-transactions"><p>No transactions yet</p><button onclick="window.location.href=\'transactions.html\'" class="add-transaction-btn">Add Transaction</button></div>';
        return;
    }

    const sorted = [...p.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    let html = '<table class="transactions-table"><thead><tr><th>Date</th><th>Asset</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead><tbody>';

    sorted.forEach((t, i) => {
        const tDate = t.date ? new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
        html += `<tr class="transaction-row"><td>${tDate}</td><td><strong>${t.assetName}</strong></td><td><span class="transaction-type ${t.type}">${t.type.charAt(0).toUpperCase() + t.type.slice(1)}</span></td><td class="amount-cell">$${t.amount.toFixed(2)}</td><td><span class="status-badge ${t.status}">${t.status}</span></td></tr>`;
    });

    html += '</tbody></table><div class="view-all-transactions"><a href="transactions.html">View All Transactions</a></div>';
    container.innerHTML = html;
}

function updateAssetAllocation() {
    const allocationContainer = document.getElementById('assetAllocation');
    if (!allocationContainer) return;
    const p = PortfolioDataStore.getPortfolio();
    if (!p || !p.assetAllocation) { allocationContainer.innerHTML = ''; return; }

    allocationContainer.innerHTML = '';
    Object.entries(p.assetAllocation).forEach(([name, data]) => {
        const div = document.createElement('div');
        div.className = 'asset-item';
        div.innerHTML = `
            <div class="asset-name">${name}</div>
            <div class="asset-value">$${data.value.toFixed(2)}</div>
            <div class="asset-percentage">${data.percentage.toFixed(1)}%</div>
        `;
        allocationContainer.appendChild(div);
    });
}

function updatePortfolioChart() {
    const canvas = document.getElementById('portfolioChart');
    if (!canvas) return;

    try {
        if (window.Chart && typeof Chart.getChart === 'function') {
            const existing = Chart.getChart(canvas);
            if (existing) existing.destroy();
        }
    } catch (err) {
        // ignore
    }

    const p = PortfolioDataStore.getPortfolio();
    const historicalData = generateHistoricalData(p);

    new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: historicalData.labels,
            datasets: [{
                label: 'Portfolio Value',
                data: historicalData.values,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Portfolio Growth Over Time' },
                tooltip: { callbacks: { label: (ctx) => `$${ctx.parsed.y.toFixed(2)}` } }
            },
            scales: {
                y: { beginAtZero: false, ticks: { callback: (val) => '$' + val.toLocaleString() } }
            }
        }
    });
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
