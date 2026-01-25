// ========================================
// APP.JS - Core Application Logic
// ========================================

// State
let uploadedImage = null;
let currentFont = CONFIG.fonts.default;

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const textInput = document.getElementById('textInput');
const fontSelect = document.getElementById('fontSelect');
const downloadBtn = document.getElementById('downloadBtn');
const previewCanvas = document.getElementById('previewCanvas');
const ctx = previewCanvas.getContext('2d');

// ========================================
// INITIALIZATION
// ========================================

function init() {
    populateFontSelector();
    setupEventListeners();
    renderPreview();
}

function populateFontSelector() {
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
    textInput.addEventListener('input', renderPreview);

    // Font selection
    fontSelect.addEventListener('change', (e) => {
        currentFont = e.target.value;
        renderPreview();
    });

    // Download button
    downloadBtn.addEventListener('click', downloadImage);
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

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        loadImage(file);
    }
}

function loadImage(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            uploadedImage = img;
            updateDropZonePreview(e.target.result);
            downloadBtn.disabled = false;
            renderPreview();
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

function updateDropZonePreview(src) {
    dropZone.innerHTML = `<img src="${src}" alt="Uploaded image">`;
    dropZone.classList.add('has-image');
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

    // Draw banner (top section)
    drawBanner(bannerHeight);

    // Draw image (bottom section)
    if (uploadedImage) {
        drawImage(bannerHeight, imageHeight);
    } else {
        drawPlaceholder(bannerHeight, imageHeight);
    }

    // Draw text
    drawText(bannerHeight);

    // Reset scale
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawBanner(bannerHeight) {
    const { width } = CONFIG.output;
    const { backgroundColor, gradientOverlay } = CONFIG.banner;

    // Base color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, bannerHeight);

    // Gradient overlay for depth
    if (gradientOverlay) {
        const gradient = ctx.createLinearGradient(0, 0, 0, bannerHeight);
        gradient.addColorStop(0, 'rgba(20, 20, 40, 0.5)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, bannerHeight);
    }

    // Decorative border
    if (CONFIG.decorations.border) {
        drawBorder(bannerHeight);
    }
}

function drawBorder(bannerHeight) {
    const { width } = CONFIG.output;
    const { borderColor, borderWidth, cornerSize } = CONFIG.decorations;
    const padding = 15;

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;

    // Draw frame
    ctx.beginPath();
    ctx.rect(padding, padding, width - padding * 2, bannerHeight - padding * 2);
    ctx.stroke();

    // Corner accents
    const cs = cornerSize;
    ctx.lineWidth = borderWidth + 1;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(padding, padding + cs);
    ctx.lineTo(padding, padding);
    ctx.lineTo(padding + cs, padding);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(width - padding - cs, padding);
    ctx.lineTo(width - padding, padding);
    ctx.lineTo(width - padding, padding + cs);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(padding, bannerHeight - padding - cs);
    ctx.lineTo(padding, bannerHeight - padding);
    ctx.lineTo(padding + cs, bannerHeight - padding);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(width - padding - cs, bannerHeight - padding);
    ctx.lineTo(width - padding, bannerHeight - padding);
    ctx.lineTo(width - padding, bannerHeight - padding - cs);
    ctx.stroke();
}

function drawImage(bannerHeight, imageHeight) {
    const { width } = CONFIG.output;

    // Fill background for letterboxing
    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, bannerHeight, width, imageHeight);

    // Calculate scale to FIT the image (contain)
    const scale = Math.min(
        width / uploadedImage.width,
        imageHeight / uploadedImage.height
    );

    const destWidth = uploadedImage.width * scale;
    const destHeight = uploadedImage.height * scale;

    // Center the image
    const destX = (width - destWidth) / 2;
    const destY = bannerHeight + (imageHeight - destHeight) / 2;

    // Draw full image to calculated destination
    ctx.drawImage(
        uploadedImage,
        0, 0, uploadedImage.width, uploadedImage.height, // Source
        destX, destY, destWidth, destHeight              // Destination
    );
}

function drawPlaceholder(bannerHeight, imageHeight) {
    const { width } = CONFIG.output;

    // Dark placeholder
    ctx.fillStyle = '#151520';
    ctx.fillRect(0, bannerHeight, width, imageHeight);

    // Placeholder text
    ctx.fillStyle = '#333';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Drop image here', width / 2, bannerHeight + imageHeight / 2);
}

function drawText(bannerHeight) {
    const text = textInput.value.trim();
    if (!text) return;

    const { width } = CONFIG.output;
    const { padding } = CONFIG.banner;
    const { color, maxFontSize, minFontSize, lineHeight, shadow, align } = CONFIG.text;

    // Get font family
    const fontConfig = CONFIG.fonts.available.find(f => f.name === currentFont);
    const fontFamily = fontConfig ? fontConfig.family : "'Cinzel', serif";

    // Calculate available space
    const availableWidth = width - padding.left - padding.right;
    const availableHeight = bannerHeight - padding.top - padding.bottom;

    // Find optimal font size
    let fontSize = maxFontSize;
    let lines = [];

    while (fontSize >= minFontSize) {
        ctx.font = `${fontSize}px ${fontFamily}`;
        lines = wrapText(text, availableWidth);

        const totalTextHeight = lines.length * fontSize * lineHeight;
        if (totalTextHeight <= availableHeight) {
            break;
        }
        fontSize -= 2;
    }

    // Draw text
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
        const x = width / 2;
        ctx.fillText(line, x, y);
        y += fontSize * lineHeight;
    });

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

function wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}

// ========================================
// DOWNLOAD
// ========================================

function downloadImage() {
    if (!uploadedImage) return;

    // Create full-size canvas for export
    const { width, height, format, quality } = CONFIG.output;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width;
    exportCanvas.height = height;
    const exportCtx = exportCanvas.getContext('2d');

    const bannerHeight = Math.floor(height * (CONFIG.banner.heightPercent / 100));
    const imageHeight = height - bannerHeight;

    // Draw banner
    exportCtx.fillStyle = CONFIG.banner.backgroundColor;
    exportCtx.fillRect(0, 0, width, bannerHeight);

    // Gradient
    if (CONFIG.banner.gradientOverlay) {
        const gradient = exportCtx.createLinearGradient(0, 0, 0, bannerHeight);
        gradient.addColorStop(0, 'rgba(20, 20, 40, 0.5)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        exportCtx.fillStyle = gradient;
        exportCtx.fillRect(0, 0, width, bannerHeight);
    }

    // Border
    if (CONFIG.decorations.border) {
        drawBorderOnContext(exportCtx, bannerHeight, width);
    }

    // Fill background
    exportCtx.fillStyle = '#0a0a15';
    exportCtx.fillRect(0, bannerHeight, width, imageHeight);

    // Calculate scale to FIT
    const scale = Math.min(
        width / uploadedImage.width,
        imageHeight / uploadedImage.height
    );

    const destWidth = uploadedImage.width * scale;
    const destHeight = uploadedImage.height * scale;
    const destX = (width - destWidth) / 2;
    const destY = bannerHeight + (imageHeight - destHeight) / 2;

    exportCtx.drawImage(
        uploadedImage,
        0, 0, uploadedImage.width, uploadedImage.height,
        destX, destY, destWidth, destHeight
    );

    // Text
    drawTextOnContext(exportCtx, bannerHeight, width);

    // Download
    const link = document.createElement('a');
    link.download = `fantasy-overlay-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL(format, quality);
    link.click();
}

function drawBorderOnContext(ctx, bannerHeight, width) {
    const { borderColor, borderWidth, cornerSize } = CONFIG.decorations;
    const padding = 15;

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;

    ctx.beginPath();
    ctx.rect(padding, padding, width - padding * 2, bannerHeight - padding * 2);
    ctx.stroke();

    const cs = cornerSize;
    ctx.lineWidth = borderWidth + 1;

    ctx.beginPath();
    ctx.moveTo(padding, padding + cs);
    ctx.lineTo(padding, padding);
    ctx.lineTo(padding + cs, padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width - padding - cs, padding);
    ctx.lineTo(width - padding, padding);
    ctx.lineTo(width - padding, padding + cs);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, bannerHeight - padding - cs);
    ctx.lineTo(padding, bannerHeight - padding);
    ctx.lineTo(padding + cs, bannerHeight - padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width - padding - cs, bannerHeight - padding);
    ctx.lineTo(width - padding, bannerHeight - padding);
    ctx.lineTo(width - padding, bannerHeight - padding - cs);
    ctx.stroke();
}

function drawTextOnContext(ctx, bannerHeight, width) {
    const text = textInput.value.trim();
    if (!text) return;

    const { padding } = CONFIG.banner;
    const { color, maxFontSize, minFontSize, lineHeight } = CONFIG.text;

    const fontConfig = CONFIG.fonts.available.find(f => f.name === currentFont);
    const fontFamily = fontConfig ? fontConfig.family : "'Cinzel', serif";

    const availableWidth = width - padding.left - padding.right;
    const availableHeight = bannerHeight - padding.top - padding.bottom;

    let fontSize = maxFontSize;
    let lines = [];

    while (fontSize >= minFontSize) {
        ctx.font = `${fontSize}px ${fontFamily}`;
        lines = wrapTextOnContext(ctx, text, availableWidth);

        const totalTextHeight = lines.length * fontSize * lineHeight;
        if (totalTextHeight <= availableHeight) {
            break;
        }
        fontSize -= 2;
    }

    ctx.fillStyle = color;
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

function wrapTextOnContext(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines;
}

// ========================================
// START
// ========================================

document.addEventListener('DOMContentLoaded', init);
