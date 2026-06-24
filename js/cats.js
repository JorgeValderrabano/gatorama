// =====================================================================
// CAT DATA — 8 distinct feline personalities
// =====================================================================
const CATS = [
  { name: 'Marmalade', body: '#e8985a', dark: '#9c5828', inner: '#d4823c',
    pattern: 'stripes', patternColor: '#7a4218', eyes: '#5b8c5a', nose: '#d96b6b' },
  { name: 'Shadow', body: '#2a2520', dark: '#0d0a08', inner: '#3a3530',
    pattern: 'solid', patternColor: '#2a2520', eyes: '#f4d03f', nose: '#1a1612' },
  { name: 'Cloud', body: '#f5ede0', dark: '#c9b89a', inner: '#fff8ec',
    pattern: 'solid', patternColor: '#f5ede0', eyes: '#7fb3d5', nose: '#e8a5a5' },
  { name: 'Siam', body: '#f0deb8', dark: '#5c3e26', inner: '#5c3e26',
    pattern: 'points', patternColor: '#5c3e26', eyes: '#5dade2', nose: '#5c3e26' },
  { name: 'Patches', body: '#f5ede0', dark: '#2a2520', inner: '#e8985a',
    pattern: 'patches', patternColor: '#e8985a', eyes: '#5b8c5a', nose: '#d96b6b' },
  { name: 'Tux', body: '#2a2520', dark: '#0d0a08', inner: '#3a3530',
    pattern: 'tuxedo', patternColor: '#f5ede0', eyes: '#f4d03f', nose: '#1a1612' },
  { name: 'Misty', body: '#9aa5b1', dark: '#5a6570', inner: '#8a95a0',
    pattern: 'stripes', patternColor: '#4a5560', eyes: '#d35400', nose: '#d96b6b' },
  { name: 'Cocoa', body: '#a07550', dark: '#5a3820', inner: '#8a6040',
    pattern: 'solid', patternColor: '#a07550', eyes: '#5b8c5a', nose: '#d96b6b' }
];

function buildCatSVG(cat) {
  let patternSvg = '';

  if (cat.pattern === 'stripes') {
    patternSvg = `
      <path d="M22 50 Q28 55 22 60" stroke="${cat.patternColor}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>
      <path d="M78 50 Q72 55 78 60" stroke="${cat.patternColor}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>
      <path d="M28 38 Q33 42 30 47" stroke="${cat.patternColor}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6"/>
      <path d="M72 38 Q67 42 70 47" stroke="${cat.patternColor}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6"/>
      <path d="M44 30 L50 36 L56 30" stroke="${cat.patternColor}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.55"/>
      <path d="M40 70 L46 75" stroke="${cat.patternColor}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
      <path d="M60 70 L54 75" stroke="${cat.patternColor}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
    `;
  } else if (cat.pattern === 'patches') {
    patternSvg = `
      <ellipse cx="28" cy="52" rx="14" ry="17" fill="${cat.patternColor}" opacity="0.95"/>
      <ellipse cx="74" cy="38" rx="11" ry="9" fill="${cat.dark}" opacity="0.95"/>
      <path d="M55 75 Q65 80 62 88 Q52 85 55 75 Z" fill="${cat.patternColor}" opacity="0.85"/>
      <ellipse cx="68" cy="68" rx="5" ry="4" fill="${cat.dark}" opacity="0.7"/>
    `;
  } else if (cat.pattern === 'tuxedo') {
    patternSvg = `
      <path d="M50 65 Q38 80 50 92 Q62 80 50 65 Z" fill="${cat.patternColor}"/>
      <ellipse cx="42" cy="82" rx="7" ry="4.5" fill="${cat.patternColor}"/>
      <ellipse cx="58" cy="82" rx="7" ry="4.5" fill="${cat.patternColor}"/>
      <path d="M50 65 L47 72 L50 78 L53 72 Z" fill="${cat.dark}" opacity="0.6"/>
    `;
  } else if (cat.pattern === 'points') {
    patternSvg = `
      <path d="M20 38 L25 12 L45 30 Z" fill="${cat.patternColor}" opacity="0.95"/>
      <path d="M80 38 L75 12 L55 30 Z" fill="${cat.patternColor}" opacity="0.95"/>
      <ellipse cx="50" cy="80" rx="20" ry="13" fill="${cat.patternColor}" opacity="0.6"/>
      <path d="M30 60 Q35 70 40 65" stroke="${cat.patternColor}" stroke-width="2.5" fill="none" opacity="0.5"/>
      <path d="M70 60 Q65 70 60 65" stroke="${cat.patternColor}" stroke-width="2.5" fill="none" opacity="0.5"/>
    `;
  }

  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="card-front-svg">
      <defs>
        <radialGradient id="bg-${cat.name}" cx="50%" cy="35%">
          <stop offset="0%" stop-color="${cat.inner}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${cat.body}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bg-${cat.name})"/>

      <!-- Ears outer -->
      <path d="M20 40 L25 12 L46 30 Z" fill="${cat.body}"/>
      <path d="M80 40 L75 12 L54 30 Z" fill="${cat.body}"/>
      <!-- Ears inner -->
      <path d="M26 33 L29 19 L40 28 Z" fill="${cat.inner}" opacity="0.85"/>
      <path d="M74 33 L71 19 L60 28 Z" fill="${cat.inner}" opacity="0.85"/>

      <!-- Head -->
      <ellipse cx="50" cy="55" rx="33" ry="29" fill="${cat.body}"/>

      <!-- Pattern overlay -->
      ${patternSvg}

      <!-- Cheek fluff -->
      <path d="M19 60 Q14 66 22 71 Q24 65 26 62 Z" fill="${cat.body}"/>
      <path d="M81 60 Q86 66 78 71 Q76 65 74 62 Z" fill="${cat.body}"/>

      <!-- Eyes -->
      <ellipse cx="38" cy="54" rx="6.5" ry="7.5" fill="white"/>
      <ellipse cx="62" cy="54" rx="6.5" ry="7.5" fill="white"/>
      <ellipse cx="38" cy="54" rx="5.5" ry="7" fill="${cat.eyes}"/>
      <ellipse cx="62" cy="54" rx="5.5" ry="7" fill="${cat.eyes}"/>
      <ellipse cx="38" cy="54" rx="1.6" ry="6.5" fill="#1a1612"/>
      <ellipse cx="62" cy="54" rx="1.6" ry="6.5" fill="#1a1612"/>
      <circle cx="39.5" cy="51" r="1.4" fill="white"/>
      <circle cx="63.5" cy="51" r="1.4" fill="white"/>
      <circle cx="36.5" cy="56" r="0.8" fill="white" opacity="0.6"/>
      <circle cx="60.5" cy="56" r="0.8" fill="white" opacity="0.6"/>

      <!-- Nose -->
      <path d="M46 66 L54 66 L50 71 Z" fill="${cat.nose}"/>

      <!-- Mouth -->
      <path d="M50 71 Q46 75.5 43 73.5" stroke="${cat.dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M50 71 Q54 75.5 57 73.5" stroke="${cat.dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>

      <!-- Whiskers -->
      <line x1="14" y1="61" x2="32" y2="63" stroke="${cat.dark}" stroke-width="0.9" opacity="0.55" stroke-linecap="round"/>
      <line x1="14" y1="67" x2="32" y2="68" stroke="${cat.dark}" stroke-width="0.9" opacity="0.55" stroke-linecap="round"/>
      <line x1="86" y1="61" x2="68" y2="63" stroke="${cat.dark}" stroke-width="0.9" opacity="0.55" stroke-linecap="round"/>
      <line x1="86" y1="67" x2="68" y2="68" stroke="${cat.dark}" stroke-width="0.9" opacity="0.55" stroke-linecap="round"/>
    </svg>
  `;
}

function catSilhouetteSVG() {
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
      <!-- Curled tail -->
      <path d="M75 80 Q93 75 90 55 Q87 42 76 44"
            stroke="currentColor" stroke-width="5.5" fill="none" stroke-linecap="round" opacity="0.55"/>
      <!-- Body -->
      <ellipse cx="50" cy="76" rx="24" ry="16" fill="currentColor"/>
      <!-- Head -->
      <ellipse cx="50" cy="45" rx="21" ry="18" fill="currentColor"/>
      <!-- Ears -->
      <path d="M31 35 L29 13 L46 30 Z" fill="currentColor"/>
      <path d="M69 35 L71 13 L54 30 Z" fill="currentColor"/>
      <!-- Inner ears -->
      <path d="M33 30 L32 18 L42 28 Z" fill="rgba(0,0,0,0.25)"/>
      <path d="M67 30 L68 18 L58 28 Z" fill="rgba(0,0,0,0.25)"/>
      <!-- Subtle eyes -->
      <ellipse cx="42" cy="46" rx="2" ry="2.5" fill="rgba(0,0,0,0.4)"/>
      <ellipse cx="58" cy="46" rx="2" ry="2.5" fill="rgba(0,0,0,0.4)"/>
      <!-- Paws -->
      <ellipse cx="38" cy="90" rx="5" ry="3" fill="currentColor"/>
      <ellipse cx="62" cy="90" rx="5" ry="3" fill="currentColor"/>
    </svg>
  `;
}
