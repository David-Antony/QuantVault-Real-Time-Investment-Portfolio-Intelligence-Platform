/**
 * QuantVault Modular Procedural Avatar Generator
 * Generates dynamic SVG vector avatars based on preset parameters.
 */

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

/**
 * Adjust color brightness programmatically
 * @param {string} hex - Hex color string
 * @param {number} percent - Percentage change
 * @returns {string} - Modified hex color string
 */
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

/**
 * Generates an SVG data URL for a given avatar preset
 * @param {Object} preset - Preset configuration object
 * @param {number} size - Output width and height in px
 * @returns {string} - Data URL string
 */
function generateFaceSVG(preset, size = 160) {
    const bgId = `bg-${preset.id}`;
    const shadowId = `drop-shadow-${preset.id}`;
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
            <circle cx="67" cy="78" r="11" fill="rgba(255,255,255,0.1)" stroke="#1e293b" stroke-width="2.5" />
            <circle cx="93" cy="78" r="11" fill="rgba(255,255,255,0.1)" stroke="#1e293b" stroke-width="2.5" />
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
            <clipPath id="avatarClip_${preset.id}">
                <circle cx="80" cy="80" r="72" />
            </clipPath>
            <filter id="${shadowId}" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.3"/>
            </filter>
        </defs>
        
        <!-- Background Circle -->
        <circle cx="80" cy="80" r="72" fill="url(#${bgId})" />

        <!-- Clipped Avatar Content -->
        <g clip-path="url(#avatarClip_${preset.id})">
            <!-- Neck -->
            <rect x="74" y="102" width="12" height="22" rx="4" fill="${neckColor}" />

            <!-- Shoulders / Shirt -->
            <path d="M 38 140 C 48 118, 112 118, 122 140 L 125 160 L 35 160 Z" fill="${preset.shirtColor}" />
            <path d="M 68 122 C 72 130, 88 130, 92 122" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2.5" stroke-linecap="round" />

            <!-- Head Base -->
            <rect x="52" y="50" width="56" height="64" rx="28" fill="${preset.skinColor}" filter="url(#${shadowId})" />
            
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

        <!-- Inner Circle Accent Border -->
        <circle cx="80" cy="80" r="71" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
    </svg>`;

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Global and CommonJS export for browser & testing compatibility
const AvatarModule = {
    AVATAR_PRESETS,
    generateFaceSVG,
    adjustColorBrightness
};

if (typeof window !== 'undefined') {
    window.AvatarModule = AvatarModule;
    window.AVATAR_PRESETS = AVATAR_PRESETS;
    window.generateFaceSVG = generateFaceSVG;
    window.adjustColorBrightness = adjustColorBrightness;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AvatarModule;
}
