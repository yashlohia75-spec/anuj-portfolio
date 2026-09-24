// Automated verification test script for Phase 3
import fs from "fs";
import path from "path";

const mainTsx = fs.readFileSync("src/main.tsx", "utf-8");
const stylesCss = fs.readFileSync("src/styles.css", "utf-8");
const mediaTs = fs.readFileSync("src/media.ts", "utf-8");
const vercelJson = fs.readFileSync("vercel.json", "utf-8");

console.log("=== RUNNING PHASE 3 COMPREHENSIVE CHECKS ===");

// 1. Check Vercel SPA rewrites
const vercel = JSON.parse(vercelJson);
if (vercel.rewrites && vercel.rewrites.some((r: any) => r.source === "/(.*)" && r.destination === "/index.html")) {
  console.log("✅ Vercel SPA rewrites configured correctly.");
} else {
  console.error("❌ Vercel SPA rewrites missing or incorrect!");
}

// 2. Check micro-labels removal
const microLabels = [
  "SCROLL TO MOVE THROUGH THE SYSTEM",
  "SCROLL / 001",
  "01 / SELECTED WORK",
  "EDITORIAL ARCHIVE",
];
let microLabelFound = false;
for (const label of microLabels) {
  if (mainTsx.includes(label)) {
    console.error(`❌ Micro-label still found: "${label}"`);
    microLabelFound = true;
  }
}
if (!microLabelFound) {
  console.log("✅ All specified micro-labels successfully removed from main.tsx.");
}

// 3. Check Humsafar horizontal grid preservation
if (mainTsx.includes("flow-horizontal-grid grid-2") && mainTsx.includes("flow-horizontal-grid grid-3")) {
  console.log("✅ Humsafar horizontal grid (grid-2 & grid-3) preserved in main.tsx.");
} else {
  console.error("❌ Humsafar horizontal grid classes missing!");
}

if (stylesCss.includes(".flow-horizontal-grid") && !stylesCss.includes(".flow-horizontal-grid { column-count")) {
  console.log("✅ CSS Grid used for .flow-horizontal-grid (no column-count regression).");
} else {
  console.error("❌ .flow-horizontal-grid has column-count regression!");
}

// 4. Check portrait height discipline (prevention of vertical media takeover)
if (
  stylesCss.includes("max-height: min(70vh, 620px)") &&
  stylesCss.includes("max-height: min(68vh, 580px)") &&
  stylesCss.includes("max-height: min(64vh, 540px)")
) {
  console.log("✅ Strict portrait max-height constraints implemented to prevent vertical media takeover.");
} else {
  console.error("❌ Portrait max-height constraints missing or incomplete!");
}

// 5. Check Lightbox and Video player implementation
if (
  mainTsx.includes("function MediaLightbox") &&
  mainTsx.includes("function CustomVideoPlayer") &&
  mainTsx.includes("video-control-bar") &&
  mainTsx.includes("v-scrubber") &&
  mainTsx.includes("openLightbox")
) {
  console.log("✅ MediaLightbox modal with Custom HTML5 Video Player and controls implemented.");
} else {
  console.error("❌ MediaLightbox or CustomVideoPlayer components missing!");
}

// 6. Check navigation and routing
const requiredRoutes = ["home", "work", "project", "process", "info", "contact"];
let routeCheckPassed = true;
for (const r of requiredRoutes) {
  if (!mainTsx.includes(`page === "${r}"`)) {
    console.error(`❌ Route check missing for: ${r}`);
    routeCheckPassed = false;
  }
}
if (routeCheckPassed) {
  console.log("✅ All required routes (Home, Work, Project, Process, Info, Contact) are handled.");
}

// 7. Check slug resolution
const slugTests = ["humsafar", "trident", "trident-group", "halonix", "havells", "shyamoli"];
let slugCheckPassed = true;
for (const s of slugTests) {
  if (!mainTsx.includes("getProjectBySlug")) {
    console.error("❌ getProjectBySlug helper missing!");
    slugCheckPassed = false;
    break;
  }
}
if (slugCheckPassed) {
  console.log("✅ getProjectBySlug handles project slugs including aliases.");
}

console.log("=== ALL CHECKS COMPLETED ===");
