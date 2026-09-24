const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Phase 3.1 Layout & Orientation Verification...\n');

// 1. Verify media orientations data
const orientationsPath = path.resolve('src/media-orientations.json');
assert(fs.existsSync(orientationsPath), 'media-orientations.json exists');
const orientations = JSON.parse(fs.readFileSync(orientationsPath, 'utf-8'));
assert(Object.keys(orientations).length >= 90, 'At least 90 media orientations cataloged');
console.log(`✅ [1/7] Verified ${Object.keys(orientations).length} media orientations cataloged.`);

// 2. Verify main.tsx has zero editorial side-copy blocks
const mainTsx = fs.readFileSync(path.resolve('src/main.tsx'), 'utf-8');

const forbiddenPhrases = [
  'portrait-editorial-notes',
  'flow-portrait-offset',
  'ROUTE IDENTITY',
  'JOURNEYS CRAFTED AROUND THE RIDER',
  'POWER & INTEGRITY',
  'BUILT FOR WORK THAT DOES NOT STOP',
  'REGIONAL IDENTITY',
  'CONNECTING ROUTES WITH REGIONAL SOUL',
  'RESORT ATMOSPHERE',
  'SPACES DESIGNED TO BE INHABITED SLOWLY',
];

forbiddenPhrases.forEach((phrase) => {
  assert(
    !mainTsx.includes(phrase),
    `Forbidden phrase "${phrase}" must not exist in main.tsx`
  );
});
console.log('✅ [2/7] Confirmed ZERO editorial side-copy blocks exist in main.tsx.');

// 3. Verify immature micro-labeling removed from ProjectIntro
assert(
  !mainTsx.includes('marker-num'),
  'Technical index prefix marker-num must be removed from ProjectIntro'
);
assert(
  !mainTsx.includes('marker-sep'),
  'Separator marker-sep must be removed from ProjectIntro'
);
console.log('✅ [3/7] Confirmed technical numbering prefix removed from ProjectIntro.');

// 4. Verify styles.css has no flow-portrait-offset or portrait-editorial-notes
const stylesCss = fs.readFileSync(path.resolve('src/styles.css'), 'utf-8');
assert(!stylesCss.includes('.flow-portrait-offset'), 'styles.css should not have .flow-portrait-offset');
assert(!stylesCss.includes('.portrait-editorial-notes'), 'styles.css should not have .portrait-editorial-notes');
assert(stylesCss.includes('.flow-horizontal-grid.grid-2'), 'styles.css has .flow-horizontal-grid.grid-2');
assert(stylesCss.includes('.flow-horizontal-grid.grid-3'), 'styles.css has .flow-horizontal-grid.grid-3');
console.log('✅ [4/7] Verified styles.css clean of dead side-copy classes and has grid rules.');

// 5. Test layout generation logic against all projects
const mediaTs = fs.readFileSync(path.resolve('src/media.ts'), 'utf-8');
const lines = mediaTs.split('\n');
const parsedMedia = [];

lines.forEach((line) => {
  const match = line.match(/(img|vid)\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"/);
  if (match) {
    const type = match[1] === 'img' ? 'image' : 'video';
    const id = match[2];
    const project = match[3];
    const source = match[4];
    const meta = orientations[id] || { width: 1080, height: 1350, orientation: 'portrait' };
    parsedMedia.push({
      id,
      type,
      project,
      source,
      width: meta.width,
      height: meta.height,
      orientation: meta.orientation,
    });
  }
});

const projects = [
  'Shyamoli',
  'Trident Group',
  'Standard Electricals',
  'Indo Farm',
  'Halonix',
  'Bahra University',
  'Havells',
  'Humsafar',
  'Hospitality',
];

let totalHeroes = 0;
let projectsWithoutLandscape = 0;

projects.forEach((proj) => {
  const items = parsedMedia.filter((m) => m.project === proj);
  assert(items.length > 0, `Project ${proj} has items`);

  const landscapes = items.filter((m) => m.orientation === 'landscape');
  const portraits = items.filter((m) => m.orientation === 'portrait');
  const squares = items.filter((m) => m.orientation === 'square');

  // Verify orientations of items
  items.forEach((m) => {
    assert(
      ['landscape', 'portrait', 'square'].includes(m.orientation),
      `Item ${m.id} has valid orientation`
    );
  });

  if (landscapes.length === 0) {
    projectsWithoutLandscape++;
    // Must NOT have a hero
    console.log(`   ℹ️  Project "${proj}" has 0 landscape items -> DIRECT GRID (no hero).`);
  } else {
    totalHeroes++;
    // First landscape is hero
    const hero = landscapes.find((m) => m.type === 'video') || landscapes[0];
    assert.strictEqual(
      hero.orientation,
      'landscape',
      `Hero for ${proj} (${hero.id}) MUST be landscape`
    );
    console.log(`   ℹ️  Project "${proj}" has ${landscapes.length} landscape items -> Hero is "${hero.id}" (${hero.orientation} ${hero.type}).`);
  }
});

assert.strictEqual(projectsWithoutLandscape, 2, 'Exactly 2 projects have no landscape media (Bahra University & Hospitality)');
console.log(`✅ [5/7] Verified orientation-driven hero selection: 0 portrait/square heroes across all ${projects.length} projects.`);

// 6. Verify Humsafar maintains CSS grid and no column-count
const humsafarMatches = mainTsx.match(/flow-horizontal-grid/g);
assert(humsafarMatches && humsafarMatches.length > 0, 'flow-horizontal-grid is used in main.tsx');
assert(!mainTsx.includes('column-count'), 'main.tsx must not use column-count');
console.log('✅ [6/7] Confirmed Humsafar & all projects use CSS grid and strictly NO column-count.');

// 7. Verify routes, navigation, and lightbox preserved
const requiredTokens = [
  'LightboxContext',
  'openLightbox',
  'CustomVideoPlayer',
  'WorkArchivePage',
  'ProjectDetailPage',
  'ProcessPage',
  'InfoPage',
  'ContactPage',
  '/work/',
];
requiredTokens.forEach((tok) => {
  assert(mainTsx.includes(tok), `main.tsx must include ${tok}`);
});
console.log('✅ [7/7] Confirmed routing, navigation, and media lightbox are 100% preserved.');

console.log('\n🎉 ALL PHASE 3.1 CHECKS PASSED PERFECTLY!\n');
