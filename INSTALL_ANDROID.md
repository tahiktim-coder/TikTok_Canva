# How to Install on Android (Nothing Phone)

## Option 1: Direct PWA Install (Recommended)

**No app store needed - works like a real app!**

### Steps:

1. **Host the app** (pick one):
   - Upload the ZIP contents to GitHub Pages (free)
   - Use Netlify Drop (drag & drop, free): https://app.netlify.com/drop
   - Or any web hosting

2. **Open on your phone**:
   - Open Chrome on your Nothing Phone
   - Go to your hosted URL

3. **Install**:
   - Tap the menu (3 dots) → "Add to Home Screen"
   - Or tap the "Install App" button if it appears
   - The app icon will appear on your home screen!

4. **Use offline**:
   - After first load, works without internet
   - Fonts are cached automatically

---

## Option 2: Convert to APK (If you want a .apk file)

Use **PWABuilder** (Microsoft's free tool):

1. Host your PWA (see Option 1 step 1)
2. Go to https://www.pwabuilder.com/
3. Enter your hosted URL
4. Click "Package for stores" → Android
5. Download the APK
6. Email it to yourself
7. Download & install on your phone (enable "Install unknown apps" in settings)

---

## Files in This Package

```
📁 FantasyTextOverlay-PWA/
├── index.html           # Main app
├── styles.css           # Styling
├── config.js            # Settings
├── app.js               # Logic
├── manifest.json        # PWA config
├── service-worker.js    # Offline caching
└── icons/
    ├── icon-192.png     # App icon
    └── icon-512.png     # App icon (large)
```

---

## Quick Test

Just double-click `index.html` to test locally!
(Note: Service worker only works when hosted, not from file://)
