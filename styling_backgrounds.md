# Backgrounds & Themes Guide 🎨

## 🎭 Pre-Built Themes (Dropdown)

These apply a set combination of **Banner Color**, **Text Color**, and **Font**.

| Theme Name | Visual Style | Hex Colors |
|------------|--------------|------------|
| **Classic** | 🔵 **Dark Blue** / 🟡 **Gold** | BG: `#0a0a15`<br>Text: `#d4a857` |
| **Noir** | ⚫ **Black** / ⚪ **White** | BG: `#1a1a1a`<br>Text: `#f0f0f0` |
| **Parchment** | 📜 **Cream** / 🟤 **Brown** | BG: `#f0e6d2`<br>Text: `#3e2723` |
| **Royal** | 🟣 **Purple** / 🟡 **Gold** | BG: `#2d0a31`<br>Text: `#ffd700` |
| **Forest** | 🟢 **Dark Green** / ⚪ **Pale** | BG: `#1a2f1a`<br>Text: `#e0f2f1` |
| **Crimson** | 🔴 **Dark Red** / 🌸 **Pink** | BG: `#3a0a0a`<br>Text: `#ffb3b3` |

---

## 📐 Background Layout

### Fixed Banner Logic
*   The banner is **ALWAYS the top 20%** of the image.
*   This creates a consistent "Card" look for a series of images on TikTok.
*   The gradient overlay (`gradientOverlay: true` in config) adds a subtle shadow to make text pop.

### Border Styling
Themes like "Classic" and "Royal" use a **Double Border**:
*   **Color**: Matches the text accent color.
*   **Width**: 2px.
*   **Corner Size**: 20px (creates an indented corner effect).

---

## 🛠 Manual Override (Config.js)

If you want to make your own custom theme, edit `config.js`:

```javascript
"MyCustomTheme": {
    label: "Cyberpunk",
    banner: "#000033", // Dark Neon Blue
    text: "#00ff00",   // Matrix Green
    font: "Special Elite",
    border: false // Clean look
}
```
