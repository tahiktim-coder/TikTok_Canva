# Fantasy Text Styling Guide 🎲

> Reference for D&D-style text overlays that keep the epic fantasy vibe

---

## 📐 Standardized Banner Specs

| Setting | Value | Notes |
|---------|-------|-------|
| **Banner Height** | Fixed 20% of final image | Same for ALL images |
| **Text scales to fit** | Auto-shrink if long | Never overflows |
| **Final Ratio** | 2:3 (1080 × 1620) | Consistent output |

---

## 🔤 Fantasy Fonts (Google Fonts - Free)

### Tier 1: Pure D&D Energy

| Font | Vibe | Best For |
|------|------|----------|
| **Cinzel Decorative** | Regal, epic, dragon-slayer | Titles, location names |
| **Uncial Antiqua** | Celtic manuscripts, Book of Kells | Mystical quotes |
| **MedievalSharp** | Classic RPG, tavern signs | General fantasy text |
| **Almendra Display** | Elvish, flowing, magical | Elegant lore |

### Tier 2: Adventure & Mystery

| Font | Vibe | Best For |
|------|------|----------|
| **Pirata One** | Bold adventurer, treasure maps | Action quotes |
| **IM Fell English SC** | Ancient tomes, aged paper | Narrator voice |
| **Grenze Gotisch** | Dark fantasy, gothic | Ominous warnings |
| **Metamorphous** | Shapeshifter, mystical | Magic-themed |

### Tier 3: Subtle Fantasy

| Font | Vibe | Best For |
|------|------|----------|
| **Cormorant Garamond** | Refined, scholarly wizard | Long passages |
| **Spectral** | Ghostly elegant | Atmospheric quotes |
| **Lora** | Classic book, timeless | Readable lore |

---

## ✨ Text Effects That SLAP

### Drop Shadows (Essential)
```css
/* Soft glow - mystical feel */
text-shadow: 0 0 20px rgba(255, 215, 0, 0.3),
             2px 2px 4px rgba(0, 0, 0, 0.8);

/* Hard shadow - carved in stone */
text-shadow: 3px 3px 0px #1a1a2e,
             4px 4px 0px #0a0a15;

/* Inner light - glowing runes */
text-shadow: 0 0 10px #ffd700,
             0 0 20px #ffd700,
             0 0 30px #b8860b;
```

### Letter Spacing
```css
/* Spread out - ancient inscriptions */
letter-spacing: 0.15em;

/* Tight - urgent messages */
letter-spacing: -0.02em;
```

---

## 🎨 Color Palettes

### Parchment & Gold (Classic)
| Element | Color | Hex |
|---------|-------|-----|
| Text | Aged parchment | `#e8dcc4` |
| Accent | Warm gold | `#d4a857` |
| Shadow | Deep brown | `#2a1810` |
| Background | Night sky | `#0d0d1a` |

### Frost & Silver (Northern)
| Element | Color | Hex |
|---------|-------|-----|
| Text | Ice white | `#e8f0f5` |
| Accent | Pale silver | `#a8b5c4` |
| Shadow | Frozen blue | `#1a2535` |
| Background | Deep night | `#0a1015` |

### Blood & Ember (Dark Fantasy)
| Element | Color | Hex |
|---------|-------|-----|
| Text | Bone white | `#f0e6d8` |
| Accent | Ember red | `#8b2500` |
| Shadow | Charcoal | `#1a0f0a` |
| Background | Void black | `#0a0505` |

### Forest & Moss (Druidic)
| Element | Color | Hex |
|---------|-------|-----|
| Text | Moonlight | `#e8ecd8` |
| Accent | Moss green | `#4a6741` |
| Shadow | Deep forest | `#1a2018` |
| Background | Twilight | `#0d120a` |

---

## 🏰 Decorative Elements

### Border Styles

**Ornate Corners**
```
╔════════════════════════════════╗
║                                ║
║   "In lands where dragons...   ║
║                                ║
╚════════════════════════════════╝
```

**Celtic Knot Borders**
- Interlocking patterns at corners
- Works great with Uncial Antiqua font

**Simple Elegant**
- Thin gold line, 1-2px
- Small diamond or dot at corners

**Runic Frame**
- Rune symbols along edges
- Best for mystical/magical content

### Dividers & Ornaments

```
───────── ⚔ ─────────    (Crossed swords)
─────────  ◆  ─────────   (Diamond)
───────── ❧ ─────────    (Floral)
════════ ☽ ✧ ☾ ════════  (Moon & stars)
```

---

## 📝 Text Layout Patterns

### Centered Classic
```
        In Vedrant Reach,
  some mountains reach far beyond
         the clouds...
```

### Title + Body
```
      ═══ VEDRANT REACH ═══
  
  Some mountains reach far beyond
   the clouds, to places where
      no one has ever been.
```

### Asymmetric (Modern Epic)
```
In Vedrant Reach,
        some mountains reach
                far beyond the clouds—
```

---

## 🔥 Pro Tips

1. **Less is more** - 2-4 lines max for impact
2. **Contrast matters** - Dark bg + light text always
3. **Let it breathe** - Generous padding around text
4. **Match the mood** - Cold colors for mountains, warm for taverns
5. **Consistent style** - Pick ONE font + palette per series

---

## 💾 Implementation Priority

1. ✅ Fixed 20% banner height
2. ✅ Auto-scaling text (fits any length)
3. ✅ Font selector dropdown (Tier 1 fonts first)
4. ✅ Preset color palettes (one-click switch)
5. ⬜ Border/ornament toggle
6. ⬜ Custom color picker (advanced)
