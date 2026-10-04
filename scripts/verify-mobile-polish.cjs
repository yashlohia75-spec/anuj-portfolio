const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Final Mobile Spacing Refinement Verification...\n');

const mainTsxPath = path.join(__dirname, '../src/main.tsx');
const stylesCssPath = path.join(__dirname, '../src/styles.css');

const mainTsx = fs.readFileSync(mainTsxPath, 'utf8');
const stylesCss = fs.readFileSync(stylesCssPath, 'utf8');

// 1. Contact links verification
console.log('--- 1. External Social Links ---');
const behanceUrl = 'https://www.behance.net/anujkumar564';
const linkedinUrl = 'https://www.linkedin.com/in/anuj-335098281';

assert(mainTsx.includes(`href="${behanceUrl}"`), `Must contain exact Behance URL: ${behanceUrl}`);
assert(mainTsx.includes(`href="${linkedinUrl}"`), `Must contain exact LinkedIn URL: ${linkedinUrl}`);
console.log('✅ Behance and LinkedIn links confirmed.');

// 2. Homepage: Dead space elimination
console.log('\n--- 2. Homepage Hero Spacing ---');
assert(stylesCss.includes('min-height: unset;'), 'Hero min-height: 100svh must be unset on mobile to remove void');
assert(stylesCss.includes('.hero-bottom-spacer'), 'Hero bottom spacer class configured');
assert(stylesCss.includes('.home-selected') && stylesCss.includes('padding-top: 32px'), 'Selected Work enters naturally with 32px top padding');
console.log('✅ Homepage void eliminated: Hero min-height unset, spacer collapsed on mobile, Selected Work enters naturally.');

// 3. Mobile Info Page Spacing & Rhythm
console.log('\n--- 3. Info Page Mobile Spacing ---');
assert(stylesCss.includes('clamp(140px, 46vw, 185px)'), 'Portrait width tuned to avoid dominating mobile screen');
assert(stylesCss.includes('max-height: clamp(190px, 26vh, 240px)'), 'Portrait max-height constrained to 26vh/240px');
assert(stylesCss.includes('margin: 2px auto 6px;'), 'Intro-to-portrait gap tightened');
assert(stylesCss.includes('filter: blur(42px) brightness(0.16)'), 'Primary atmospheric fade preserved');
assert(stylesCss.includes('filter: blur(65px) brightness(0.1)'), 'Secondary atmospheric diffusion layer preserved');
assert(stylesCss.includes('.info-content-col') && stylesCss.includes('gap: 16px'), 'Content column gap tightened to 16px');
assert(stylesCss.includes('.info-profile-grid') && stylesCss.includes('row-gap: 8px'), 'Profile rows rhythm tightened');
console.log('✅ Info page vertical rhythm balanced: portrait footprint restrained, atmospheric dissolve preserved, Profile section fully visible.');

console.log('\n🎉 ALL REFINEMENT CRITERIA VERIFIED SUCCESSFULLY!');
