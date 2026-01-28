// ========================================
// CONFIG.JS - All adjustable settings
// ========================================

const CONFIG = {
  // Output Image Settings (TikTok Ratio)
  output: {
    width: 1080,
    height: 1620, // 2:3 Aspect Ratio
    format: 'image/png',
    quality: 1.0
  },

  // Banner Settings
  banner: {
    heightPercent: 20, // Top 20% of image
    backgroundColor: '#0a0a15', // Default Dark Blue
    gradientOverlay: true,
    padding: {
      top: 60,
      bottom: 40,
      left: 80,  // INCREASED for TikTok Side Buttons
      right: 80  // INCREASED for TikTok Side Buttons
    }
  },

  // Text Settings
  text: {
    color: '#d4a857', // Default Gold
    maxFontSize: 80,
    minFontSize: 30,
    lineHeight: 1.2,
    align: 'center', // left, center, right
    fontFamily: 'Cinzel'
  },

  // Theme Presets
  themes: {
    "Classic": {
      label: "Classic Fantasy",
      banner: "#0a0a15",
      text: "#d4a857",
      font: "Cinzel",
      border: true
    },
    "Noir": {
      label: "Noir Detective",
      banner: "#1a1a1a",
      text: "#f0f0f0",
      font: "Special Elite",
      border: false
    },
    "Parchment": {
      label: "Old Parchment",
      banner: "#f0e6d2",
      text: "#3e2723",
      font: "Cinzel Decorative",
      border: true
    },
    "Royal": {
      label: "Royal Court",
      banner: "#2d0a31", // Deep Purple
      text: "#ffd700", // Gold
      font: "MedievalSharp",
      border: true
    },
    "Forest": {
      label: "Elven Forest",
      banner: "#1a2f1a", // Dark Green
      text: "#e0f2f1", // Pale Green/White
      font: "Uncial Antiqua",
      border: true
    },
    "Crimson": {
      label: "Blood Pact",
      banner: "#3a0a0a", // Dark Red
      text: "#ffb3b3", // Pale Red
      font: "Rye",
      border: true
    }
  },

  // Font Options
  fonts: {
    default: 'Cinzel',
    available: [
      { name: 'Cinzel', label: 'Cinzel (Classic)', family: "'Cinzel', serif" },
      { name: 'Cinzel Decorative', label: 'Cinzel Decorative', family: "'Cinzel Decorative', serif" },
      { name: 'MedievalSharp', label: 'Medieval Sharp', family: "'MedievalSharp', cursive" },
      { name: 'Uncial Antiqua', label: 'Uncial Antiqua', family: "'Uncial Antiqua', cursive" },
      { name: 'Almendra Display', label: 'Almendra', family: "'Almendra Display', cursive" },
      { name: 'Special Elite', label: 'Noir Typewriter', family: "'Special Elite', cursive" },
      { name: 'Rye', label: 'Western/Grim', family: "'Rye', cursive" },
      { name: 'Metamorphous', label: 'Metamorphous', family: "'Metamorphous', cursive" },
      { name: 'Pirata One', label: 'Pirate', family: "'Pirata One', cursive" }
    ]
  },

  // Decoration Settings
  decorations: {
    border: true,
    borderColor: '#d4a857',
    borderWidth: 2,
    cornerSize: 20
  }
};

// Make config globally available
window.CONFIG = CONFIG;
