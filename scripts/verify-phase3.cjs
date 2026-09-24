const fs = require('fs');
const mainTsx = fs.readFileSync('src/main.tsx', 'utf-8');
const stylesCss = fs.readFileSync('src/styles.css', 'utf-8');
const vercelJson = fs.readFileSync('vercel.json', 'utf-8');

console.log('=== PHASE 3 VALIDATION CHECKS ===');

// 1. Vercel SPA rewrites
const vercel = JSON.parse(vercelJson);
const hasVercelRewrites = vercel.rewrites && vercel.rewrites.some(r => r.source === '/(.*)' && r.destination === '/index.html');
console.log('1. Vercel SPA rewrites:', hasVercelRewrites ? 'PASSED' : 'FAILED');

// 2. Micro-labels removed
const microLabels = [
  'SCROLL TO MOVE THROUGH THE SYSTEM',
  'SCROLL / 001',
  '01 / SELECTED WORK',
  'EDITORIAL ARCHIVE'
];
const removedAllMicro = microLabels.every(label => !mainTsx.includes(label));
console.log('2. Micro-labels removed:', removedAllMicro ? 'PASSED' : 'FAILED');

// 3. Humsafar horizontal grid preserved
const hasHumsafarGrid = mainTsx.includes('flow-horizontal-grid grid-2') && mainTsx.includes('flow-horizontal-grid grid-3');
console.log('3. Humsafar horizontal grid classes in TSX:', hasHumsafarGrid ? 'PASSED' : 'FAILED');

const hasCssGrid = stylesCss.includes('.flow-horizontal-grid') && stylesCss.includes('display: grid;') && !stylesCss.includes('.flow-horizontal-grid { column-count');
console.log('4. CSS Grid for .flow-horizontal-grid (no column-count regression):', hasCssGrid ? 'PASSED' : 'FAILED');

// 4. Portrait height discipline
const hasHeightLimits = stylesCss.includes('max-height: min(70vh, 620px)') &&
  stylesCss.includes('max-height: min(68vh, 580px)') &&
  stylesCss.includes('max-height: min(64vh, 540px)');
console.log('5. Portrait height discipline (prevention of takeover):', hasHeightLimits ? 'PASSED' : 'FAILED');

// 5. Lightbox and video player
const hasLightbox = mainTsx.includes('function MediaLightbox') &&
  mainTsx.includes('function CustomVideoPlayer') &&
  mainTsx.includes('video-control-bar') &&
  mainTsx.includes('openLightbox');
console.log('6. MediaLightbox & Custom HTML5 Video Player:', hasLightbox ? 'PASSED' : 'FAILED');

// 6. Navigation and routes
const routes = ['home', 'work', 'project', 'process', 'info', 'contact'];
const allRoutesPresent = routes.every(r => mainTsx.includes(`page === "${r}"`) || mainTsx.includes(`page: "${r}"`));
console.log('7. All 6 routes implemented (/ , /work, /work/:slug, /process, /info, /contact):', allRoutesPresent ? 'PASSED' : 'FAILED');

// 8. Slugs resolution
const hasSlugHelper = mainTsx.includes('getProjectBySlug') && mainTsx.includes('trident') && mainTsx.includes('humsafar');
console.log('8. Dynamic project slug resolution:', hasSlugHelper ? 'PASSED' : 'FAILED');

console.log('=== VALIDATION SUMMARY: ALL CHECKS READY ===');
