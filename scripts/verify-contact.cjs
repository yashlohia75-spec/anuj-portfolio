const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Contact Page Redesign Verification...\n');

const mainTsx = fs.readFileSync(path.resolve('src/main.tsx'), 'utf-8');
const stylesCss = fs.readFileSync(path.resolve('src/styles.css'), 'utf-8');

// 1. Headline and copy
assert(mainTsx.includes('LET’S CREATE'), 'Must include LET’S CREATE');
assert(mainTsx.includes('SOMETHING MEANINGFUL.'), 'Must include SOMETHING MEANINGFUL.');
assert(
  mainTsx.includes('I’m always open to new ideas, collaborations and opportunities.'),
  'Must include supporting copy line 1'
);
assert(
  mainTsx.includes('If you have a project in mind, just say hello.'),
  'Must include supporting copy line 2'
);
console.log('✅ [1/6] Verified headline and narrative copy.');

// 2. Right column contact information
assert(mainTsx.includes('OTHER WAYS TO REACH ME'), 'Must include OTHER WAYS TO REACH ME');
assert(mainTsx.includes('yashlohia75@gmail.com'), 'Must include email');
assert(mainTsx.includes('India'), 'Must include location');
assert(mainTsx.includes('LinkedIn ↗'), 'Must include LinkedIn');
assert(mainTsx.includes('Behance ↗'), 'Must include Behance');
console.log('✅ [2/6] Verified contact information and links.');

// 3. Form fields and layout
assert(mainTsx.includes('contact-form-grid'), 'Must use contact-form-grid');
assert(mainTsx.includes('NAME'), 'Must have NAME label');
assert(mainTsx.includes('EMAIL'), 'Must have EMAIL label');
assert(mainTsx.includes('WHAT ARE WE MAKING?'), 'Must have WHAT ARE WE MAKING? label');
assert(mainTsx.includes('MESSAGE'), 'Must have MESSAGE label');
assert(mainTsx.includes('Select a project type ↓'), 'Must have project type selector');
console.log('✅ [3/6] Verified form fields structure.');

// 4. CTA
assert(mainTsx.includes('SEND IT MY WAY'), 'Must include SEND IT MY WAY');
assert(mainTsx.includes('contact-submit-arrow'), 'Must include arrow in CTA');
console.log('✅ [4/6] Verified editorial CTA.');

// 5. Input styling in CSS
assert(stylesCss.includes('.contact-input'), 'Must style .contact-input');
assert(stylesCss.includes('.contact-select'), 'Must style .contact-select');
assert(stylesCss.includes('.contact-textarea'), 'Must style .contact-textarea');
assert(stylesCss.includes('min-height: 170px'), 'Textarea must have generous vertical height');
assert(stylesCss.includes('.contact-editorial-header'), 'Must have 2-column editorial header');
assert(stylesCss.includes('border-left: 1px solid'), 'Must have vertical divider');
console.log('✅ [5/6] Verified dark input design and editorial CSS grid.');

// 6. Responsive CSS
assert(stylesCss.includes('.contact-editorial-header') && stylesCss.includes('grid-template-columns: 1fr'), 'Responsive stacked header');
console.log('✅ [6/6] Verified responsive styling rules.');

console.log('\n🎉 ALL CONTACT PAGE VERIFICATIONS PASSED!\n');
