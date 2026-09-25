import mediaOrientationsData from "./media-orientations.json";

export type MediaOrientation = "landscape" | "portrait" | "square";

export type MediaItem = {
  id: string;
  type: "image" | "video";
  project: string;
  source: string;
  src: string;
  videoSrc?: string;
  width: number;
  height: number;
  orientation: MediaOrientation;
  isPdf?: boolean;
};

const orientationMap = mediaOrientationsData as Record<
  string,
  { width: number; height: number; orientation: MediaOrientation }
>;

/* ── folder-name maps (actual folder names on disk) ── */

const imgFolder: Record<string, string> = {
  "Shyamoli":              "shyamoli",
  "Trident Group":         "trident",
  "Standard Electricals":  "standard electricals",
  "Halonix":               "halonix",
  "Indo Farm":             "indofarm",
  "Havells":               "havells",
  "Humsafar":              "humsafar",
  "Su-Kam":                "sukam",
  "Education":             "bahra",
  "Bahra University":      "bahra",
  "Hospitality":           "hospitality",
};

const vidFolder: Record<string, string> = {
  "Shyamoli":              "shyamoli",
  "Trident Group":         "trident",
  "Standard Electricals":  "standard electricals",
  "Halonix":               "halonix",
  "Indo Farm":             "indofarm",
  "Havells":               "havells",
  "Humsafar":              "humsafar",
  "Su-Kam":                "sukam",
  "Education":             "bahra",
  "Bahra University":      "bahra",
  "Hospitality":           "hospitality",
};

/* ── helpers ── */

// NOTE: The on-disk folder is named "IMAGES" (uppercase).
// Cannot rename while processes hold handles. Using actual name.
const IMG = "/media/IMAGES";
const VID = "/media/videos";

const img = (id: string, project: string, filename: string): MediaItem => {
  const meta = orientationMap[id] || { width: 1080, height: 1350, orientation: "portrait" };
  const isPdf = filename.toLowerCase().endsWith(".pdf");
  return {
    id,
    project,
    type: "image",
    source: filename,
    src: `${IMG}/${imgFolder[project]}/${filename}`,
    width: meta.width,
    height: meta.height,
    orientation: meta.orientation,
    isPdf,
  };
};

// posterPath is relative to the IMAGES root (e.g. "shyamoli/poster.jpg").
// If omitted, the video has no poster thumbnail.
const vid = (id: string, project: string, filename: string, posterPath?: string): MediaItem => {
  const meta = orientationMap[id] || { width: 1080, height: 1920, orientation: "portrait" };
  return {
    id,
    project,
    type: "video",
    source: filename,
    src: posterPath ? `${IMG}/${posterPath}` : "",
    videoSrc: `${VID}/${vidFolder[project]}/${filename}`,
    width: meta.width,
    height: meta.height,
    orientation: meta.orientation,
  };
};

/* ── project order ── */

export const projectOrder = [
  "Trident Group",
  "Standard Electricals",
  "Indo Farm",
  "Shyamoli",
  "Halonix",
  "Education",
  "Havells",
  "Humsafar",
  "Hospitality",
  "Su-Kam",
];

export const visibleProjectsSequence = [
  "Trident Group",
  "Standard Electricals",
  "Indo Farm",
  "Shyamoli",
  "Halonix",
  "Education",
  "Havells",
  "Humsafar",
  "Hospitality",
];

/* ── media entries (source of truth: current filesystem) ── */

export const media: MediaItem[] = [

  // ════════════════════════════════════════
  // Shyamoli  (14 images · 5 videos)
  // ════════════════════════════════════════
  img("sh-01","Shyamoli","whatsapp-image-2026-09-19-at-11-54-01-am-1.jpeg"),
  img("sh-02","Shyamoli","whatsapp-image-2026-09-19-at-11-54-01-am.jpeg"),
  img("sh-03","Shyamoli","whatsapp-image-2026-09-19-at-11-54-02-am-1.jpeg"),
  img("sh-04","Shyamoli","whatsapp-image-2026-09-19-at-11-54-02-am-2.jpeg"),
  img("sh-05","Shyamoli","whatsapp-image-2026-09-19-at-11-54-02-am-3.jpeg"),
  img("sh-06","Shyamoli","whatsapp-image-2026-09-19-at-11-54-02-am-4.jpeg"),
  img("sh-07","Shyamoli","whatsapp-image-2026-09-19-at-11-54-02-am-5.jpeg"),
  img("sh-08","Shyamoli","whatsapp-image-2026-09-19-at-11-54-02-am.jpeg"),
  img("sh-09","Shyamoli","whatsapp-image-2026-09-19-at-11-54-03-am-1.jpeg"),
  img("sh-10","Shyamoli","whatsapp-image-2026-09-19-at-11-54-03-am.jpeg"),
  img("sh-11","Shyamoli","whatsapp-image-2026-09-19-at-11-54-29-am.jpeg"),
  img("sh-12","Shyamoli","june-delhi-ad-1-copy.jpg"),
  img("sh-13","Shyamoli","june-delhi-ad-2-copy.jpg"),
  img("sh-14","Shyamoli","june-delhi-ad-4-copy.jpg"),

  vid("sh-v1","Shyamoli","WhatsApp Video 2026-09-19 at 11.54.03 AM (1).mp4","shyamoli/e861bc8e3f97f0d3.jpg"),
  vid("sh-v2","Shyamoli","WhatsApp Video 2026-09-19 at 11.54.03 AM.mp4","shyamoli/069fa03e328df197.jpg"),
  vid("sh-v3","Shyamoli","WhatsApp Video 2026-09-19 at 11.54.04 AM.mp4","shyamoli/34a2ee9adb023806.jpg"),
  vid("sh-v4","Shyamoli","WhatsApp Video 2026-09-19 at 11.54.29 AM (1).mp4","shyamoli/1de26a4352719d5c.jpg"),
  vid("sh-v5","Shyamoli","WhatsApp Video 2026-09-19 at 11.54.29 AM.mp4"),


  // ════════════════════════════════════════
  // Trident Group  (2 images · 7 videos)
  // ════════════════════════════════════════
  img("tr-01","Trident Group","trident sleep expo copy.jpg"),
  img("tr-02","Trident Group","what-is-air-technology-carousel-copy.jpg"),

  vid("tr-v1","Trident Group","independece day 2025 trident paper.mp4","trident-group/19461b30bbfab2ef.jpg"),
  vid("tr-v2","Trident Group","paper expo closer to nature_8.mp4","trident-group/8c60faf4005f7e93.jpg"),
  vid("tr-v3","Trident Group","trident group dusshera ad_3.mp4","trident-group/758d64fa20b72b9b.jpg"),
  vid("tr-v4","Trident Group","trident rakhi 2_2.mp4","trident-group/690ddf67cf37502f.jpg"),
  vid("tr-v5","Trident Group","world cotton day trident_2.mp4","trident-group/848fed9a37e04f62.jpg"),
  vid("tr-v6","Trident Group","april 11_7.mp4"),
  vid("tr-v7","Trident Group","trident national farmers' day_1.mp4"),

  // ════════════════════════════════════════
  // Standard Electricals  (1 image · 11 videos)
  // ════════════════════════════════════════
  img("se-01","Standard Electricals","20th sept copy.jpg"),

  vid("se-v1","Standard Electricals","16th Dec- Droid M Water Heater (GIF)  Anuj_1.mp4"),
  vid("se-v2","Standard Electricals","20th july_2.mp4"),
  vid("se-v3","Standard Electricals","3rd Feb- Primair Fan (Video)_2.mp4"),
  vid("se-v4","Standard Electricals","5th august.mp4"),
  vid("se-v5","Standard Electricals","jan 1_3.mp4"),
  vid("se-v6","Standard Electricals","july 6th.mp4"),
  vid("se-v7","Standard Electricals","june 1_4.mp4"),
  vid("se-v8","Standard Electricals","standard electricals independence day.mp4"),
  vid("se-v9","Standard Electricals","standard holi ad_3.mp4"),
  vid("se-v10","Standard Electricals","standard smart wifi plug_1.mp4"),
  vid("se-v11","Standard Electricals","17th sept (1).mp4"),

  // ════════════════════════════════════════
  // Halonix  (4 images · 10 videos)
  // ════════════════════════════════════════
  img("ha-01","Halonix","11th august copy.jpg"),
  img("ha-02","Halonix","28th feb opt 2 copy.jpg"),
  img("ha-03","Halonix","29th oct copy 1.jpg"),
  img("ha-04","Halonix","spiderman copy.jpg"),

  vid("ha-v1","Halonix","12th may_4 1.mp4"),
  vid("ha-v2","Halonix","24th april_7.mp4"),
  vid("ha-v3","Halonix","24th march_4.mp4"),
  vid("ha-v4","Halonix","25th may_3.mp4"),
  vid("ha-v5","Halonix","8th august_3.mp4"),
  vid("ha-v6","Halonix","decorative pendant lighting_5.mp4"),
  vid("ha-v7","Halonix","halonix wd_4.mp4"),
  vid("ha-v8","Halonix","june 19_3.mp4"),
  vid("ha-v9","Halonix","onam halonix ad.mp4"),
  vid("ha-v10","Halonix","ropelight_4.mp4"),

  // ════════════════════════════════════════
  // Indo Farm  (4 images · 6 videos)
  // ════════════════════════════════════════
  img("if-01","Indo Farm","10th nov carousel copy.jpg"),
  img("if-02","Indo Farm","25th feb copy 2.jpg"),
  img("if-03","Indo Farm","army day copy.jpg"),
  img("if-04","Indo Farm","navratri day copy.jpg"),

  vid("if-v1","Indo Farm","18th july.mp4"),
  vid("if-v2","Indo Farm","19th july_1.mp4"),
  vid("if-v3","Indo Farm","27th april_3.mp4"),
  vid("if-v4","Indo Farm","ifel holi ad_2.mp4"),
  vid("if-v5","Indo Farm","ifel republic day.mp4"),
  vid("if-v6","Indo Farm","penguin video_3.mp4"),

  // ════════════════════════════════════════
  // Havells  (1 image)
  // ════════════════════════════════════════
  img("hv-01","Havells","happiness-5-lakh-carousel-copy.jpg"),

  // ════════════════════════════════════════
  // Humsafar  (8 images)
  // ════════════════════════════════════════
  img("hu-01","Humsafar","whatsapp-image-2026-09-19-at-11-55-06-am-2.jpeg"),
  img("hu-02","Humsafar","whatsapp-image-2026-09-19-at-11-55-06-am.jpeg"),
  img("hu-03","Humsafar","whatsapp-image-2026-09-19-at-11-55-06-am-1.jpeg"),
  img("hu-04","Humsafar","fifa-ad-copy.jpg"),
  img("hu-05","Humsafar","spiderman-post-copy.jpg"),
  img("hu-06","Humsafar","aurangabad-to-pune-copy.jpg"),
  img("hu-07","Humsafar","jodhpur-carousel-copy.jpg"),
  img("hu-08","Humsafar","jodhpur-welcome-static-copy.jpg"),

  // ════════════════════════════════════════
  // Education  (3 images [incl. 1 PDF] · 3 videos)
  // ════════════════════════════════════════
  img("bu-01","Education","legal studies copy.jpg"),
  img("bu-02","Education","world environmental health day copy 1.jpg"),
  img("bu-03","Education","june 5 copy.pdf"),

  vid("bu-v1","Education","bu christmas_5.mp4"),
  vid("bu-v2","Education","bu holi ad_3.mp4"),
  vid("bu-v3","Education","hgpi christmas 2_6 subs.mp4"),

  // ════════════════════════════════════════
  // Hospitality  (8 images · 6 videos)
  // ════════════════════════════════════════
  img("ho-01","Hospitality","4th-august-2-copy.jpg"),
  img("ho-02","Hospitality","9th-july-copy.jpg"),
  img("ho-03","Hospitality","9th-nov-staycation2-copy.jpg"),
  img("ho-04","Hospitality","25th-august-copy.jpg"),
  img("ho-05","Hospitality","11th july copy.jpg"),
  img("ho-06","Hospitality","14th april copy 1.jpg"),

  vid("ho-v1","Hospitality","20th april_2.mp4"),
  vid("ho-v2","Hospitality","21st april_2.mp4"),
  vid("ho-v3","Hospitality","22 august.mp4"),
  vid("ho-v4","Hospitality","concours reel_final.mp4"),
  vid("ho-v5","Hospitality","june 3_1.mp4"),

  // Curated 3-Column Editorial Row:
  // LEFT: "A Collection Seasonal Delights"
  // CENTER: New Video (Park Plaza Reel)
  // RIGHT: Park Plaza Rakhi creative
  img("ho-08","Hospitality","28th july copy.jpg"),
  vid("ho-v6","Hospitality","ppz reel 15 th part 2.mp4"),
  img("ho-09","Hospitality","rakhi ad ppz copy.jpg"),
];

const slug = (name: string) =>
  name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const brandSlug = slug;
