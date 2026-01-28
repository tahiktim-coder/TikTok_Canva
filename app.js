// ========================================
// APP.JS - Core Application Logic (Batch Support)
// ========================================

// State
let projects = []; // Array of { id, file, image, text, font }
let currentProjectId = null;

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const textInput = document.getElementById('textInput');
const fontSelect = document.getElementById('fontSelect');
const themeSelect = document.getElementById('themeSelect');
const downloadBtn = document.getElementById('downloadBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const previewCanvas = document.getElementById('previewCanvas');
const ctx = previewCanvas.getContext('2d');
const imageQueue = document.getElementById('imageQueue');
const queueList = document.getElementById('queueList');
const queueCount = document.getElementById('queueCount');

// ========================================
// INITIALIZATION
// ========================================

function init() {
    populateSelectors();
    setupEventListeners();
    renderPreview();
}

function populateSelectors() {
    // Fonts
    CONFIG.fonts.available.forEach(font => {
        const option = document.createElement('option');
        option.value = font.name;
        option.textContent = font.label;
        option.style.fontFamily = font.family;
        if (font.name === CONFIG.fonts.default) {
            option.selected = true;
        }
        fontSelect.appendChild(option);
    });

    // Themes
    Object.keys(CONFIG.themes).forEach(key => {
        const theme = CONFIG.themes[key];
        const option = document.createElement('option');
        option.value = key;
        option.textContent = theme.label;
        if (key === "Classic") option.selected = true;
        themeSelect.appendChild(option);
    });
}

function setupEventListeners() {
    // Drop zone click
    dropZone.addEventListener('click', () => fileInput.click());

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    // Text input
    textInput.addEventListener('input', (e) => {
        updateCurrentProject({ text: e.target.value });
        renderPreview();
    });

    // Font selection
    fontSelect.addEventListener('change', (e) => {
        updateCurrentProject({ font: e.target.value });
        renderPreview();
    });

    // Theme selection
    themeSelect.addEventListener('change', (e) => {
        applyTheme(e.target.value);
    });

    // Download button
    downloadBtn.addEventListener('click', downloadCurrent);

    // Batch Download button
    downloadAllBtn.addEventListener('click', downloadBatch);
}

// ========================================
// STATE MANAGEMENT
// ========================================

function createProject(file, img) {
    return {
        id: Date.now() + Math.random().toString(),
        file: file,
        image: img,
        text: '',
        theme: 'Classic',
        font: CONFIG.themes['Classic'].font
    };
}

function applyTheme(themeName) {
    const theme = CONFIG.themes[themeName];
    if (!theme) return;

    // Update Global Config for Banner rendering
    CONFIG.banner.backgroundColor = theme.banner;
    CONFIG.text.color = theme.text;
    CONFIG.decorations.border = theme.border;

    // Update UI
    fontSelect.value = theme.font;

    // Update state
    updateCurrentProject({
        theme: themeName,
        font: theme.font
    });

    renderPreview();
}

function updateCurrentProject(updates) {
    if (!currentProjectId) return;
    const project = projects.find(p => p.id === currentProjectId);
    if (project) {
        Object.assign(project, updates);
    }
}

function switchProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    currentProjectId = id;

    // Load state into UI
    textInput.value = project.text;
    fontSelect.value = project.font;
    themeSelect.value = project.theme || 'Classic';

    // Apply theme settings visually without overwriting project state
    if (project.theme) {
        const theme = CONFIG.themes[project.theme];
        CONFIG.banner.backgroundColor = theme.banner;
        CONFIG.text.color = theme.text;
        CONFIG.decorations.border = theme.border;
    }

    // Update UI active state
    updateQueueUI();
    renderPreview();
}

// ========================================
// FILE HANDLING
// ========================================

function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
        handleFiles(files);
    }
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        handleFiles(files);
    }
}

function handleFiles(files) {
    let loadedCount = 0;

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const project = createProject(file, img);
                projects.push(project);

                // If first image, select it
                if (!currentProjectId) {
                    switchProject(project.id);
                }

                loadedCount++;
                if (loadedCount === files.length) {
                    updateQueueUI();
                    updateButtons();
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// ========================================
// UI UPDATES
// ========================================

function updateQueueUI() {
    if (projects.length === 0) {
        imageQueue.style.display = 'none';
        return;
    }

    imageQueue.style.display = 'block';
    queueCount.textContent = projects.length;
    queueList.innerHTML = '';

    projects.forEach(project => {
        const div = document.createElement('div');
        div.className = `queue-item ${project.id === currentProjectId ? 'active' : ''}`;
        div.onclick = () => switchProject(project.id);

        const thumb = document.createElement('img');
        thumb.src = project.image.src;

        div.appendChild(thumb);
        queueList.appendChild(div);
    });
}

function updateButtons() {
    const hasProjects = projects.length > 0;
    downloadBtn.disabled = !hasProjects;
    downloadAllBtn.style.display = projects.length > 1 ? 'inline-flex' : 'none';

    if (hasProjects) {
        dropZone.classList.add('has-image');
        dropZone.innerHTML = `
      <div style="font-size: 2rem;">🖼️</div>
      <p class="drop-zone-text" style="margin: 0;">Add more images</p>
    `;
    }
}

// ========================================
// CANVAS RENDERING
// ========================================

function renderPreview() {
    const { width, height } = CONFIG.output;
    const bannerHeight = Math.floor(height * (CONFIG.banner.heightPercent / 100));
    const imageHeight = height - bannerHeight;

    // Set canvas size (preview is half size)
    previewCanvas.width = width / 2;
    previewCanvas.height = height / 2;

    // Scale context for preview
    ctx.scale(0.5, 0.5);

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Find current project
    const project = projects.find(p => p.id === currentProjectId);

    // Draw banner (top section)
    drawBanner(bannerHeight);

    // Draw image (bottom section)
    if (project) {
        drawImage(project.image, bannerHeight, imageHeight);
        drawText(project, bannerHeight);
    } else {
        drawPlaceholder(bannerHeight, imageHeight);
    }

    // Reset scale
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawBanner(bannerHeight) {
    const { width } = CONFIG.output;
    const { backgroundColor, gradientOverlay } = CONFIG.banner;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, bannerHeight);

    if (gradientOverlay) {
        const gradient = ctx.createLinearGradient(0, 0, 0, bannerHeight);
        gradient.addColorStop(0, 'rgba(20, 20, 40, 0.5)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, bannerHeight);
    }

    if (CONFIG.decorations.border) {
        drawBorder(ctx, bannerHeight);
    }
}

function drawBorder(context, bannerHeight) {
    const { width } = CONFIG.output;
    const { borderColor, borderWidth, cornerSize } = CONFIG.decorations;
    const padding = 15;

    context.strokeStyle = borderColor;
    context.lineWidth = borderWidth;

    context.beginPath();
    context.rect(padding, padding, width - padding * 2, bannerHeight - padding * 2);
    context.stroke();

    const cs = cornerSize;
    context.lineWidth = borderWidth + 1;

    // Corners
    const corners = [
        [[padding, padding + cs], [padding, padding], [padding + cs, padding]], // TL
        [[width - padding - cs, padding], [width - padding, padding], [width - padding, padding + cs]], // TR
        [[padding, bannerHeight - padding - cs], [padding, bannerHeight - padding], [padding + cs, bannerHeight - padding]], // BL
        [[width - padding - cs, bannerHeight - padding], [width - padding, bannerHeight - padding], [width - padding, bannerHeight - padding - cs]] // BR
    ];

    corners.forEach(p => {
        context.beginPath();
        context.moveTo(p[0][0], p[0][212]);
        context.lineTo(p[1][0], p[1][1]);
        context.lineTo(p[2][0], p[2][1]);
        context.stroke();
    });
}

function drawImage(img, bannerHeight, imageHeight) {
    const { width } = CONFIG.output;

    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, bannerHeight, width, imageHeight);

    const scale = Math.min(
        width / img.width,
        imageHeight / img.height
    );

    const destWidth = img.width * scale;
    const destHeight = img.height * scale;
    const destX = (width - destWidth) / 2;
    const destY = bannerHeight + (imageHeight - destHeight) / 2;

    ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        destX, destY, destWidth, destHeight
    );
}

function drawPlaceholder(bannerHeight, imageHeight) {
    const { width } = CONFIG.output;
    ctx.fillStyle = '#151520';
    ctx.fillRect(0, bannerHeight, width, imageHeight);

    ctx.fillStyle = '#333';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Drop images here', width / 2, bannerHeight + imageHeight / 2);
}

function drawText(project, bannerHeight) {
    if (!project.text) return;
    const text = project.text.trim();
    if (!text) return;

    const { width } = CONFIG.output;
    const { padding } = CONFIG.banner;
    const { color, maxFontSize, minFontSize, lineHeight, align } = CONFIG.text;

    const fontConfig = CONFIG.fonts.available.find(f => f.name === project.font);
    const fontFamily = fontConfig ? fontConfig.family : "'Cinzel', serif";

    const availableWidth = width - padding.left - padding.right;
    const availableHeight = bannerHeight - padding.top - padding.bottom;

    let fontSize = maxFontSize;
    let lines = [];

    // Text fitting loop
    while (fontSize >= minFontSize) {
        ctx.font = `${fontSize}px ${fontFamily}`;
        lines = wrapText(ctx, text, availableWidth);
        const totalTextHeight = lines.length * fontSize * lineHeight;
        if (totalTextHeight <= availableHeight) break;
        fontSize -= 2;
    }

    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const totalTextHeight = lines.length * fontSize * lineHeight;
    let y = padding.top + (availableHeight - totalTextHeight) / 2;

    lines.forEach(line => {
        ctx.fillText(line, width / 2, y);
        y += fontSize * lineHeight;
    });

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function wrapText(context, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    // Check if the single word line is still too wide (e.g. "SSSSSSSS")
    // If so, we need to force break it
    if (context.measureText(currentLine).width > maxWidth) {
        // If we have prior lines, push what we have so far
        // Actually, let's just push the current line and handle long-word splitting in a separate pass or logic?
        // No, let's split the long word here.
        const chars = currentLine.split('');
        let part = '';
        // Clear currentLine as we rebuild it
        currentLine = '';

        // If lines were empty and this was first word, standard logic applies.
        // If this was a new line started from a long word

        chars.forEach(char => {
            const testPart = part + char;
            if (context.measureText(testPart).width > maxWidth && part) {
                lines.push(part);
                part = char;
            } else {
                part = testPart;
            }
        });
        currentLine = part;
    }

    lines.push(currentLine);
    return lines;
}

// ========================================
// DOWNLOAD
// ========================================

function generateCanvasForProject(project) {
    const { width, height } = CONFIG.output;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const c = canvas.getContext('2d');

    const bannerHeight = Math.floor(height * (CONFIG.banner.heightPercent / 100));
    const imageHeight = height - bannerHeight;

    // Determine Colors based on project theme (or fallback to current config)
    let bannerColor = CONFIG.banner.backgroundColor;
    let textColor = CONFIG.text.color;
    let border = CONFIG.decorations.border;

    if (project.theme && CONFIG.themes[project.theme]) {
        const theme = CONFIG.themes[project.theme];
        bannerColor = theme.banner;
        textColor = theme.text;
        border = theme.border;
    }

    // Banner
    c.fillStyle = bannerColor;
    c.fillRect(0, 0, width, bannerHeight);

    if (CONFIG.banner.gradientOverlay) {
        const gradient = c.createLinearGradient(0, 0, 0, bannerHeight);
        gradient.addColorStop(0, 'rgba(20, 20, 40, 0.5)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        c.fillStyle = gradient;
        c.fillRect(0, 0, width, bannerHeight);
    }

    if (border) {
        drawBorderOnContext(c, bannerHeight, width);
    }

    // Image (Fill/Contain logic)
    c.fillStyle = '#0a0a15';
    c.fillRect(0, bannerHeight, width, imageHeight);

    const scale = Math.min(
        width / project.image.width,
        imageHeight / project.image.height
    );

    const destWidth = project.image.width * scale;
    const destHeight = project.image.height * scale;
    const destX = (width - destWidth) / 2;
    const destY = bannerHeight + (imageHeight - destHeight) / 2;

    c.drawImage(project.image, 0, 0, project.image.width, project.image.height, destX, destY, destWidth, destHeight);

    // Text
    drawTextOnContext(c, project, bannerHeight, width, textColor);

    return canvas;
}

function drawBorderOnContext(ctx, bannerHeight, width) {
    const { borderColor, borderWidth, cornerSize } = CONFIG.decorations;
    const padding = 15;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(padding, padding, width - padding * 2, bannerHeight - padding * 2);
    // Simple corner logic for export to keep it safe
    // (Full logic identical to drawBorder can be added if needed)
}

function drawTextOnContext(ctx, project, bannerHeight, width, textColor) {
    if (!project.text) return;
    const text = project.text.trim();
    const { padding } = CONFIG.banner;
    const { maxFontSize, minFontSize, lineHeight } = CONFIG.text;

    const fontConfig = CONFIG.fonts.available.find(f => f.name === project.font);
    const fontFamily = fontConfig ? fontConfig.family : "'Cinzel', serif";

    const availableWidth = width - padding.left - padding.right;
    const availableHeight = bannerHeight - padding.top - padding.bottom;

    let fontSize = maxFontSize;
    let lines = [];

    // Font Scaling Loop
    while (fontSize >= minFontSize) {
        ctx.font = `${fontSize}px ${fontFamily}`;

        // Use standard wrapping first
        lines = wrapText(ctx, text, availableWidth);

        // Check 1: Does it fit vertically?
        const totalHeight = lines.length * fontSize * lineHeight;
        const fitsHeight = totalHeight <= availableHeight;

        // Check 2: Do all lines fit horizontally?
        // (wrapText tries to wrap, but if a single word is massive, it might overflow if we didn't force break it)
        // With the new wrapText which force-breaks, this check is less critical for overflow, 
        //   BUT force-breaking looks ugly. We prefer to shrink font first if possible.
        //   However, if a word is 100 chars, it will never fit horizontally without breaking.
        //   So we rely on wrapText to break it if it must.

        if (fitsHeight) {
            // It fits!
            break;
        }

        fontSize -= 2;
    }

    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const totalTextHeight = lines.length * fontSize * lineHeight;
    let y = padding.top + (availableHeight - totalTextHeight) / 2;

    lines.forEach(line => {
        ctx.fillText(line, width / 2, y);
        y += fontSize * lineHeight;
    });
}

function downloadCurrent() {
    const project = projects.find(p => p.id === currentProjectId);
    if (!project) return;

    const canvas = generateCanvasForProject(project);
    const link = document.createElement('a');
    link.download = `fantasy-${Date.now()}.png`;
    link.href = canvas.toDataURL(CONFIG.output.format, CONFIG.output.quality);
    link.click();
}

function downloadBatch() {
    const zip = new JSZip();
    const folder = zip.folder("fantasy-overlays");

    downloadAllBtn.textContent = '⏳ Processing...';
    downloadAllBtn.disabled = true;

    projects.forEach((project, index) => {
        const canvas = generateCanvasForProject(project);
        const dataUrl = canvas.toDataURL('image/png');
        const base64 = dataUrl.split(',')[1];

        // Suggest filename based on text or index
        let filename = `fantasy-${index + 1}.png`;
        folder.file(filename, base64, { base64: true });
    });

    zip.generateAsync({ type: "blob" })
        .then(function (content) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = "fantasy-batch.zip";
            link.click();

            downloadAllBtn.innerHTML = '<span>📦</span> Download Batch ZIP';
            downloadAllBtn.disabled = false;
        });
}

// ========================================
// START
// ========================================

document.addEventListener('DOMContentLoaded', init);
