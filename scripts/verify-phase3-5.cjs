const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const mainTsx = fs.readFileSync(path.join(root, "src/main.tsx"), "utf8");
const mediaTs = fs.readFileSync(path.join(root, "src/media.ts"), "utf8");
const stylesCss = fs.readFileSync(path.join(root, "src/styles.css"), "utf8");
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ ${message}`);
    passed++;
  } else {
    console.error(`✗ FAILED: ${message}`);
    failed++;
  }
}

console.log("=== PHASE 3.5 PORTFOLIO REFINEMENT VERIFICATION ===\n");

// 1. Check Canonical Visible Projects Sequence
const expectedProjects = [
  "Trident Group",
  "Standard Electricals",
  "Indo Farm",
  "Shyamoli",
  "Halonix",
  "Bahra University",
  "Havells",
  "Humsafar",
  "Hospitality",
];

expectedProjects.forEach((proj, idx) => {
  assert(
    mediaTs.includes(`"${proj}"`),
    `Project "${proj}" is defined in media.ts`
  );
});

assert(
  mediaTs.includes("visibleProjectsSequence = [") &&
  expectedProjects.every(p => mediaTs.indexOf(`"${p}"`) !== -1),
  "visibleProjectsSequence is exported with all 9 canonical projects"
);

assert(
  !VISIBLE_PROJECTS_COUNT_CHECK().includes("Su-Kam") &&
  !mainTsx.includes('"Su-Kam": "') && // Not in REPRESENTATIVE_MEDIA
  VISIBLE_PROJECTS_COUNT_CHECK().length === 9,
  "Su-Kam is strictly hidden from visible work sequence"
);

function VISIBLE_PROJECTS_COUNT_CHECK() {
  const match = mediaTs.match(/visibleProjectsSequence\s*=\s*\[([\s\S]*?)\];/);
  if (!match) return [];
  return match[1].split(",").map(s => s.trim().replace(/['"]/g, "")).filter(Boolean);
}

// 2. Representative Media mapping for all 9 projects
expectedProjects.forEach(proj => {
  assert(
    mainTsx.includes(`"${proj}": "`),
    `Representative media mapped for "${proj}"`
  );
});

// 3. Routing & 404 Route
assert(
  mainTsx.includes('{ page: "not-found" }'),
  "Route type includes 'not-found'"
);
assert(
  mainTsx.includes('function NotFoundPage'),
  "NotFoundPage component exists"
);
assert(
  mainTsx.includes('THIS PAGE') && mainTsx.includes('WANDERED OFF.') && mainTsx.includes('Back to work'),
  "NotFoundPage has refined editorial copy"
);
assert(
  mainTsx.includes('return { page: "not-found" };'),
  "parsePath returns not-found for unknown routes and invalid project slugs"
);

// 4. Subtle Next Project Transition & Looping
assert(
  mainTsx.includes('className="next-project-transition"') &&
  mainTsx.includes('className="next-project-divider"') &&
  mainTsx.includes('UP NEXT') &&
  mainTsx.includes('VIEW PROJECT →'),
  "ProjectDetailPage renders minimal exhibition Next Project transition"
);
assert(
  mainTsx.includes('(currentIdx + 1) % VISIBLE_PROJECT_SEQUENCE.length'),
  "Next Project loops correctly through VISIBLE_PROJECT_SEQUENCE"
);
assert(
  !mainTsx.includes('className="project-pagination-footer"'),
  "Old pagination footer removed from ProjectDetailPage"
);

// 5. Work Archive Page (/work)
assert(
  mainTsx.includes('className="work-gallery-grid"'),
  "WorkArchivePage renders visual-led work-gallery-grid"
);
assert(
  !mainTsx.includes('ARCHIVE DIRECTORY') &&
  !mainTsx.includes('Selected brand campaigns, motion direction, industrial identity') &&
  !mainTsx.includes('work-project-list'),
  "Redundant micro-headings and old text-list removed from WorkArchivePage"
);

// 6. Media Orientation & Container Discipline
assert(
  !stylesCss.includes('object-fit: cover;') ||
  CHECK_NO_COVER_ON_PORTFOLIO_ART(),
  "No portfolio artwork uses object-fit: cover"
);

function CHECK_NO_COVER_ON_PORTFOLIO_ART() {
  const matches = [...stylesCss.matchAll(/([^{}]+)\{[^}]*object-fit:\s*cover[^}]*\}/g)];
  for (const m of matches) {
    const sel = m[1];
    if (sel.includes('.media-card') || sel.includes('.work-gallery') || sel.includes('.home-card-media')) {
      return false;
    }
  }
  return true;
}

assert(
  CHECK_NO_COVER_ON_PORTFOLIO_ART(),
  "Verified: zero object-fit: cover on .media-card, .work-gallery, and .home-card-media"
);

// 7. Humsafar CSS Grid Protection
assert(
  stylesCss.includes('.flow-horizontal-grid.grid-2') &&
  stylesCss.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'),
  "Humsafar .flow-horizontal-grid.grid-2 uses CSS Grid (2 columns)"
);
assert(
  stylesCss.includes('.flow-horizontal-grid.grid-3') &&
  stylesCss.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'),
  "Humsafar .flow-horizontal-grid.grid-3 uses CSS Grid (3 columns)"
);

// 8. Info Page Personality & Design
assert(
  mainTsx.includes("I’M JUST A KID") &&
  mainTsx.includes("WITH AN IMAGINATION") &&
  mainTsx.includes("THAT WON’T SIT STILL."),
  "InfoPage has approved personality anchor title"
);
assert(
  mainTsx.includes("HV Production / Horizon Visuals") &&
  mainTsx.includes("Xanadu Brands"),
  "InfoPage contains confirmed career background"
);
assert(
  mainTsx.includes("PHOTOSHOP") &&
  mainTsx.includes("ILLUSTRATOR") &&
  mainTsx.includes("AFTER EFFECTS") &&
  mainTsx.includes("FIGMA") &&
  mainTsx.includes("AI TOOLS"),
  "InfoPage displays typographic skills"
);
assert(
  mainTsx.includes("Bring it on."),
  "InfoPage includes 'Bring it on.' stance"
);
assert(
  !mainTsx.includes("info-grid"),
  "Old generic info-grid replaced"
);

// 9. SEO & Metadata
assert(
  mainTsx.includes("useDocumentSEO"),
  "useDocumentSEO hook is implemented and called in App"
);
assert(
  mainTsx.includes("Anuj — Creative Supervisor / Visual Designer") &&
  mainTsx.includes("Work — Anuj") &&
  mainTsx.includes("Info — Anuj") &&
  mainTsx.includes("Contact — Anuj") &&
  mainTsx.includes("404 — Anuj"),
  "Dynamic route titles match specification"
);
assert(
  indexHtml.includes('<meta property="og:title"') &&
  indexHtml.includes('<meta property="og:description"') &&
  indexHtml.includes('<meta name="twitter:card"'),
  "index.html has Open Graph and Twitter card meta tags"
);

// 10. Contact Page Unchanged Functionally
assert(
  mainTsx.includes("function ContactPage()") &&
  mainTsx.includes("SEND IT MY WAY"),
  "ContactPage remains intact"
);

console.log(`\nVerification complete: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
}
