import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="50%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="115" fill="url(#bgGrad)" />
  <rect x="216" y="116" width="80" height="280" rx="24" fill="#ffffff" />
  <rect x="116" y="216" width="280" height="80" rx="24" fill="#ffffff" />
  <path d="M 140 256 L 200 256 L 226 196 L 256 316 L 286 226 L 312 256 L 372 256"
        fill="none" stroke="#059669" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="maskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="50%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#maskGrad)" />
  <g transform="translate(64, 64) scale(0.75)">
    <rect x="206" y="106" width="100" height="300" rx="28" fill="#ffffff" />
    <rect x="106" y="206" width="300" height="100" rx="28" fill="#ffffff" />
    <path d="M 130 256 L 195 256 L 225 186 L 256 326 L 287 216 L 317 256 L 382 256"
          fill="none" stroke="#059669" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>`;

async function generate() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);
  fs.writeFileSync(path.join(publicDir, 'pwa-maskable.svg'), maskableSvg);

  const svgBuffer = Buffer.from(standardSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  // 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 512x512 Maskable PNG
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // 180x180 Apple Touch Icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Favicon 48x48
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('All PNG and SVG PWA icons generated successfully!');
}

generate().catch(console.error);
