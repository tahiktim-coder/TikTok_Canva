# How to Host Permanently (Will NOT Expire)

The issue is that **Netlify Drop** without an account only lasts 1 hour. To make it last forever for free:

## Option A: Netlify (Easiest - Drag & Drop)

1. **Sign up for free** at [app.netlify.com/signup](https://app.netlify.com/signup) (use Email or GitHub)
2. Log in to your new dashboard
3. You will see a "Sites" tab
4. Drag your **extracted folder** (or the files inside the ZIP) onto that page
5. **Done!** The link they give you will never expire.

## Option B: GitHub Pages (Best for Developers)

1. Create a new public repository on GitHub called `tiktok-canva-app`
2. Upload all your files (`index.html`, `app.js`, etc.) to it
3. Go to **Settings** > **Pages**
4. Under "Branch", select `main` (or `master`) and hit Save
5. Wait 2 mins, and GitHub will give you a permanent link (e.g., `yourname.github.io/tiktok-canva-app`)

---

## IMPORTANT: Image Cropping Fixed 🖼️
I also fixed the app so it **checks if the image fits** instead of cutting it.
- **Old version**: Cut the top/bottom of your 4:5 images
- **New version**: Fits the whole image (might add small dark bars on sides if needed)

Use the new `FantasyTextOverlay-PWA-Fixed.zip` for this update!
