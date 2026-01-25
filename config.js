// ========================================
// CONFIG.JS - All adjustable settings
// ========================================

const CONFIG = {
  // Output dimensions
  output: {
    width: 1080,
    height: 1620,  // 2:3 ratio
    format: 'image/png',
    quality: 1.0
  },

  // Banner settings (text area at top)
  banner: {
    heightPercent: 20,  // Fixed 20% of total height
    backgroundColor: '#0d0d1a',
    gradientOverlay: true,
    padding: {
      top: 30,
      bottom: 30,
      left: 40,
      right: 40
    }
  },

  // Typography
  fonts: {
    default: 'Cinzel',
    available: [
      { name: 'Cinzel', label: 'Cinzel - Regal & Epic', family: "'Cinzel', serif" },
      { name: 'Cinzel Decorative', label: 'Cinzel Decorative - Ornate', family: "'Cinzel Decorative', serif" },
      { name: 'Uncial Antiqua', label: 'Uncial Antiqua - Celtic', family: "'Uncial Antiqua', serif" },
      { name: 'MedievalSharp', label: 'MedievalSharp - Classic RPG', family: "'MedievalSharp', cursive" },
      { name: 'Almendra Display', label: 'Almendra - Elvish', family: "'Almendra Display', serif" },
      { name: 'Grenze Gotisch', label: 'Grenze Gotisch - Dark Gothic', family: "'Grenze Gotisch', cursive" },
      { name: 'IM Fell English SC', label: 'IM Fell - Ancient Tome', family: "'IM Fell English SC', serif" },
      { name: 'Pirata One', label: 'Pirata One - Adventure', family: "'Pirata One', cursive" }
    ]
  },

  // Text styling
  text: {
    color: '#e8dcc4',
    maxFontSize: 52,
    minFontSize: 24,
    lineHeight: 1.4,
    shadow: '2px 2px 8px rgba(0, 0, 0, 0.9)',
    align: 'center'
  },

  // Decorative elements
  decorations: {
    border: true,
    borderColor: 'rgba(212, 168, 87, 0.4)',
    borderWidth: 2,
    cornerSize: 20
  }
};

// Make config globally available
window.CONFIG = CONFIG;
