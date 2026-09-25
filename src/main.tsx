import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { brandSlug, media, MediaItem, projectOrder, visibleProjectsSequence } from "./media";
import "./styles.css";

/* ═══════════════════════════════════════════
   APPROVED CANONICAL PROJECT SEQUENCE & REPRESENTATIVE ART
   1. Trident Group
   2. Standard Electricals
   3. Indo Farm
   4. Shyamoli
   5. Halonix
   6. Education
   7. Havells
   8. Humsafar
   9. Hospitality
   (Su-Kam remains strictly hidden from visible index)
   ═══════════════════════════════════════════ */
export const VISIBLE_PROJECT_SEQUENCE = visibleProjectsSequence;

export const REPRESENTATIVE_MEDIA: Record<string, string> = {
  "Trident Group": "tr-01",
  "Standard Electricals": "se-01",
  "Indo Farm": "if-01",
  "Shyamoli": "sh-08",
  "Halonix": "ha-v6",
  "Education": "bu-01",
  "Bahra University": "bu-01",
  "Havells": "hv-01",
  "Humsafar": "hu-01",
  "Hospitality": "ho-01",
};

/* ═══════════════════════════════════════════
   PROJECT METADATA & CONFIGURATION
   ═══════════════════════════════════════════ */
const meta: Record<
  string,
  { tag: string; intro: string; accent: string; year: string; focus: string; note?: string }
> = {
  Shyamoli: {
    tag: "TRAVEL / CAMPAIGNS / SOCIAL",
    intro: "Making the journey feel like part of the destination.",
    accent: "#f06a22",
    year: "2024 — 2026",
    focus: "Route Narratives · Social Campaigns · Motion Direction",
    note: "Directional typography · Horizontal movement · Route-led visual pacing",
  },
  "Trident Group": {
    tag: "TEXTILE / PAPER / YARN",
    intro: "Making a large, diverse brand feel clear, tactile and contemporary.",
    accent: "#9ebf9b",
    year: "2024 — 2025",
    focus: "Corporate Communication · Exhibition Films · Sustainable Material",
    note: "Tactile layouts · Structured editorial rules · Material texture focus",
  },
  "Standard Electricals": {
    tag: "ELECTRICAL / PRODUCT / MOTION",
    intro: "Product communication built to feel useful, sharp and alive.",
    accent: "#a9b1b7",
    year: "2024 — 2025",
    focus: "Product Renders · Technical Motion · Controlled Geometry",
    note: "Precision alignment · Product scale · Motion features",
  },
  "Indo Farm": {
    tag: "TRACTORS / MACHINERY / CAMPAIGNS",
    intro: "A stronger visual voice for machines made for the field.",
    accent: "#9aaf63",
    year: "2024 — 2025",
    focus: "Heavy Machinery · Festival Campaigns · Grounded Power",
    note: "Horizontal scale · Grounded composition · Industrial landscape",
  },
  Halonix: {
    tag: "LIGHTING / CAMPAIGNS / MOTION",
    intro: "Bright ideas for a brand that literally lives in light.",
    accent: "#ffad38",
    year: "2024 — 2025",
    focus: "Illumination Films · Motion Graphics · High-Contrast Stills",
    note: "Light-to-dark contrast · Ambient glow stages · Radiant reveals",
  },
  Education: {
    tag: "EDUCATION / FESTIVALS / MOTION",
    intro: "Turning institutional communication into moments people notice.",
    accent: "#9c86b8",
    year: "2024 — 2025",
    focus: "University Identity · Campus Culture · Festive Media",
    note: "Youth energy · Academic dignity · Vibrant contemporary rhythm",
  },
  "Bahra University": {
    tag: "EDUCATION / FESTIVALS / MOTION",
    intro: "Turning institutional communication into moments people notice.",
    accent: "#9c86b8",
    year: "2024 — 2025",
    focus: "University Identity · Campus Culture · Festive Media",
    note: "Youth energy · Academic dignity · Vibrant contemporary rhythm",
  },
  Havells: {
    tag: "CONSUMER ELECTRICALS / CAMPAIGN",
    intro: "A selected story from a consumer portfolio.",
    accent: "#d4b34f",
    year: "2024",
    focus: "Consumer Campaign · Visual Storytelling · Scale",
    note: "Polished consumer advertising · Centered hero staging",
  },
  "Su-Kam": {
    tag: "POWER / PRODUCT / MOTION",
    intro: "Product-led communication with a visual pulse.",
    accent: "#80a3b7",
    year: "2024",
    focus: "Power Solutions · Motion Communication",
  },
  Humsafar: {
    tag: "TRAVEL / SOCIAL / CULTURE",
    intro: "Building travel stories around people, places and movement.",
    accent: "#d5a85d",
    year: "2024 — 2025",
    focus: "Fleet Campaigns · Indian Destinations · Cultural Storytelling",
    note: "Destination storytelling · Route drop points · Regional aesthetics",
  },
  Hospitality: {
    tag: "HOSPITALITY / PROPERTY / CAMPAIGNS",
    intro: "Visual stories for spaces built around comfort and experience.",
    accent: "#c4956a",
    year: "2024 — 2025",
    focus: "Property Atmosphere · Staycation Photography · Reel Direction",
    note: "Leisure atmosphere · Poolside editorial stills · Warm resort lighting",
  },
};

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getProjectBySlug(s: string): string | null {
  const clean = s.toLowerCase().trim();
  if (clean === "humsafar") return "Humsafar";
  if (clean === "trident" || clean === "trident-group") return "Trident Group";
  if (clean === "halonix") return "Halonix";
  if (clean === "havells") return "Havells";
  if (clean === "shyamoli") return "Shyamoli";
  if (clean === "standard" || clean === "standard-electricals") return "Standard Electricals";
  if (clean === "indofarm" || clean === "indo-farm") return "Indo Farm";
  if (clean === "education" || clean === "bahra" || clean === "bahra-university") return "Education";
  if (clean === "hospitality") return "Hospitality";
  if (clean === "su-kam" || clean === "sukam") return "Su-Kam";
  for (const p of projectOrder) {
    if (slug(p) === clean || brandSlug(p) === clean) return p;
  }
  return null;
}

/* ═══════════════════════════════════════════
   LIGHTBOX CONTEXT
   ═══════════════════════════════════════════ */
interface LightboxContextType {
  openLightbox: (item: MediaItem, projectItems?: MediaItem[]) => void;
}
const LightboxContext = React.createContext<LightboxContextType>({
  openLightbox: () => {},
});

/* ═══════════════════════════════════════════
   ROUTING LOGIC & SEO
   ═══════════════════════════════════════════ */
type Route =
  | { page: "home" }
  | { page: "work" }
  | { page: "project"; project: string }
  | { page: "process" }
  | { page: "info" }
  | { page: "contact" }
  | { page: "not-found" };

function parsePath(path: string): Route {
  const clean = path.replace(/\/+$/, "") || "/";
  if (clean === "" || clean === "/") return { page: "home" };
  if (clean === "/work") return { page: "work" };
  if (clean.startsWith("/work/")) {
    const projectSlug = clean.replace("/work/", "");
    const project = getProjectBySlug(projectSlug);
    if (project && VISIBLE_PROJECT_SEQUENCE.includes(project)) {
      return { page: "project", project };
    }
    return { page: "not-found" };
  }
  if (clean === "/process") return { page: "process" };
  if (clean === "/info") return { page: "info" };
  if (clean === "/contact") return { page: "contact" };
  return { page: "not-found" };
}

function useDocumentSEO(route: Route) {
  useEffect(() => {
    let title = "Anuj — Creative Supervisor / Visual Designer";
    let desc =
      "Portfolio of Anuj — Creative Supervisor and Visual Designer specializing in brand campaigns, motion direction, and visual storytelling.";

    if (route.page === "work") {
      title = "Work — Anuj";
      desc = "Selected brand campaigns, motion direction, and visual design by Anuj.";
    } else if (route.page === "project") {
      const pMeta = meta[route.project];
      title = `${route.project} — Anuj`;
      desc = pMeta?.intro
        ? `${route.project} — ${pMeta.intro} Visual design by Anuj.`
        : `${route.project} — Selected visual design by Anuj.`;
    } else if (route.page === "info") {
      title = "Info — Anuj";
      desc = "Background, tools, and visual philosophy of Anuj — Creative Supervisor and Visual Designer.";
    } else if (route.page === "contact") {
      title = "Contact — Anuj";
      desc = "Get in touch with Anuj for visual design, motion direction, and creative collaborations.";
    } else if (route.page === "process") {
      title = "Process — Anuj";
      desc = "Creative methodology and visual exploration process.";
    } else if (route.page === "not-found") {
      title = "404 — Anuj";
      desc = "This page wandered off.";
    }

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", desc);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", desc);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute("content", window.location.href);

    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", title);

    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", desc);
  }, [route]);
}

/* ═══════════════════════════════════════════
   LOADER CHOREOGRAPHY
   ═══════════════════════════════════════════ */
function Loader({ done }: { done: boolean }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="loader-name"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.35 }}
          >
            ANUJ <span>®</span>
          </motion.div>

          <div className="loader-core">
            <motion.div
              className="loader-sun"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.45, ease: "easeOut" }}
            />
            <motion.div
              className="loader-orbit"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            />
            <motion.div
              className="loader-dot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              transition={{
                opacity: { delay: 0.15, duration: 0.3 },
                rotate: { duration: 1.6, repeat: Infinity, ease: "linear" },
              }}
            />

            <motion.div
              className="loader-eyes-preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.05, duration: 0.25 }}
            >
              <div className="loader-mini-eye">
                <div className="loader-mini-white">
                  <div className="loader-mini-pupil" />
                  <motion.div
                    className="loader-mini-lid"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: [0, 1, 0] }}
                    transition={{ delay: 1.22, duration: 0.2, times: [0, 0.5, 1], ease: "easeInOut" }}
                  />
                </div>
              </div>
              <div className="loader-mini-eye">
                <div className="loader-mini-white">
                  <div className="loader-mini-pupil" />
                  <motion.div
                    className="loader-mini-lid"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: [0, 1, 0] }}
                    transition={{ delay: 1.22, duration: 0.2, times: [0, 0.5, 1], ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              INITIALISING IMAGINATION
            </motion.p>
            <div className="loader-line">
              <motion.i
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, ease: "easeInOut", delay: 0.45 }}
              />
            </div>
          </div>

          <motion.div
            className="loader-foot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <span>CREATIVE SUPERVISOR / VISUAL DESIGNER</span>
            <span>100%</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════
   EYE SYSTEM
   ═══════════════════════════════════════════ */
function SingleEye({
  side,
  blink,
  isNear,
  mousePos,
  onTriggerBlink,
}: {
  side: "left" | "right";
  blink: boolean;
  isNear: boolean;
  mousePos: { x: number; y: number } | null;
  onTriggerBlink: () => void;
}) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 18, mass: 0.8 });
  const sy = useSpring(y, { stiffness: 140, damping: 18, mass: 0.8 });
  const nearTriggerRef = useRef(false);

  useEffect(() => {
    if (!mousePos) {
      x.set(0);
      y.set(0);
      return;
    }

    if (!eyeRef.current) return;
    const rect = eyeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = mousePos.x - centerX;
    const dy = mousePos.y - centerY;
    const distance = Math.hypot(dx, dy);

    const maxRx = Math.max(14, rect.width * 0.2);
    const maxRy = Math.max(8, rect.height * 0.17);

    if (distance > 0) {
      const angle = Math.atan2(dy, dx);
      const pull = Math.min(1, Math.pow(distance / 420, 0.82));
      x.set(Math.cos(angle) * maxRx * pull);
      y.set(Math.sin(angle) * maxRy * pull);
    }

    if (distance < 75 && !nearTriggerRef.current) {
      nearTriggerRef.current = true;
      onTriggerBlink();
    } else if (distance >= 110) {
      nearTriggerRef.current = false;
    }
  }, [mousePos, x, y, onTriggerBlink]);

  return (
    <div ref={eyeRef} className={`eye eye-${side} ${isNear ? "eye-near" : ""}`}>
      <div className="eye-white">
        <motion.div className="eye-iris" style={{ x: sx, y: sy }}>
          <div className="eye-pupil" />
        </motion.div>
        <motion.div
          className="eyelid eye-lid"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: blink ? 1 : 0 }}
          transition={{ duration: blink ? 0.07 : 0.14, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

function Eyes() {
  const [blink, setBlink] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isNear, setIsNear] = useState(false);
  const eyesContainerRef = useRef<HTMLDivElement>(null);

  const triggerBlink = useCallback(() => {
    setBlink(true);
    setTimeout(() => {
      setBlink(false);
      if (Math.random() < 0.25) {
        setTimeout(() => {
          setBlink(true);
          setTimeout(() => setBlink(false), 90);
        }, 120);
      }
    }, 110);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 2800 + Math.random() * 3800;
      timer = setTimeout(() => {
        triggerBlink();
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [triggerBlink]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (eyesContainerRef.current) {
        const rect = eyesContainerRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        setIsNear(dist < 150);
      }
    };
    const onMouseLeave = () => {
      setMousePos(null);
      setIsNear(false);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div ref={eyesContainerRef} className="eyes">
      <SingleEye
        side="left"
        blink={blink}
        isNear={isNear}
        mousePos={mousePos}
        onTriggerBlink={triggerBlink}
      />
      <SingleEye
        side="right"
        blink={blink}
        isNear={isNear}
        mousePos={mousePos}
        onTriggerBlink={triggerBlink}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   CELESTIAL SYSTEM
   ═══════════════════════════════════════════ */
function SolarSystem() {
  const { scrollYProgress } = useScroll();

  const r1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const r2 = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const r3 = useTransform(scrollYProgress, [0, 1], [0, 480]);
  const r4 = useTransform(scrollYProgress, [0, 1], [0, -170]);
  const r5 = useTransform(scrollYProgress, [0, 1], [0, 290]);

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1.05, 0.9]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.2, 0.85, 1],
    [0.45, 0.28, 0.09, 0.08, 0.2]
  );

  return (
    <motion.div className="solar" style={{ scale, opacity }} aria-hidden>
      <div className="solar-core">
        <div className="solar-sun" />
        <div className="solar-flare" />
      </div>
      <motion.div className="solar-orbit orbit-a" style={{ rotate: r1 }}>
        <div className="orbit-track track-a"><i /></div>
      </motion.div>
      <motion.div className="solar-orbit orbit-b" style={{ rotate: r2 }}>
        <div className="orbit-track track-b"><i /></div>
      </motion.div>
      <motion.div className="solar-orbit orbit-c" style={{ rotate: r3 }}>
        <div className="orbit-track track-c"><i /></div>
      </motion.div>
      <motion.div className="solar-orbit orbit-d" style={{ rotate: r4 }}>
        <div className="orbit-track track-d"><i /></div>
      </motion.div>
      <motion.div className="solar-orbit orbit-e" style={{ rotate: r5 }}>
        <div className="orbit-track track-e"><i /></div>
      </motion.div>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <span key={n} className={`star s${n}`} />
      ))}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   CUSTOM CURSOR
   ═══════════════════════════════════════════ */
function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 35 });
  const sy = useSpring(y, { stiffness: 600, damping: 35 });
  const [label, setLabel] = useState("");

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      setLabel(target?.dataset.cursor || "");
    };
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, [x, y]);

  return (
    <motion.div className={`cursor ${label ? "cursor-active" : ""}`} style={{ x: sx, y: sy }}>
      <span>{label}</span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   SITE NAVIGATION
   ═══════════════════════════════════════════ */
function SiteNavigation({
  currentRoute,
  onNavigate,
}: {
  currentRoute: Route;
  onNavigate: (path: string) => void;
}) {
  const isWorkActive = currentRoute.page === "work" || currentRoute.page === "project";

  return (
    <nav className="nav">
      <button
        data-cursor="HOME"
        onClick={() => onNavigate("/")}
        className={currentRoute.page === "home" ? "is-active" : ""}
      >
        ANUJ®
      </button>
      <div>
        <button
          data-cursor="WORK"
          onClick={() => onNavigate("/work")}
          className={isWorkActive ? "is-active" : ""}
        >
          WORK
        </button>
        <button
          data-cursor="PROCESS"
          onClick={() => onNavigate("/process")}
          className={currentRoute.page === "process" ? "is-active" : ""}
        >
          PROCESS
        </button>
        <button
          data-cursor="INFO"
          onClick={() => onNavigate("/info")}
          className={currentRoute.page === "info" ? "is-active" : ""}
        >
          INFO
        </button>
        <button
          data-cursor="CONTACT"
          onClick={() => onNavigate("/contact")}
          className={currentRoute.page === "contact" ? "is-active" : ""}
        >
          CONTACT
        </button>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   CUSTOM HTML5 VIDEO PLAYER (FOR LIGHTBOX)
   ═══════════════════════════════════════════ */
function CustomVideoPlayer({ item }: { item: MediaItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Fallback with mute if browser autoplay policy blocks unmuted audio
        v.muted = true;
        setMuted(true);
        v.play().then(() => setPlaying(true)).catch(() => {});
      });
  }, [item.videoSrc]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (!duration && v.duration) setDuration(v.duration);
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = pos * duration;
    setCurrentTime(v.currentTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  };

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div ref={wrapperRef} className="lightbox-video-wrapper">
      <video
        ref={videoRef}
        src={item.videoSrc}
        poster={item.src || undefined}
        className="lightbox-video"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onClick={togglePlay}
      />
      <div className="video-control-bar">
        <button
          className="v-btn"
          onClick={togglePlay}
          title={playing ? "Pause" : "Play"}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "⏸" : "▶"}
        </button>

        <div className="v-scrubber" onClick={handleSeek}>
          <div className="v-track">
            <div className="v-progress" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <span className="v-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div className="v-vol-group">
          <button className="v-btn" onClick={toggleMute} title={muted ? "Unmute" : "Mute"}>
            {muted || volume === 0 ? "🔇" : "🔊"}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={handleVolumeChange}
            className="v-vol-slider"
            title="Volume"
          />
        </div>

        <button className="v-btn" onClick={toggleFullscreen} title="Fullscreen">
          ⛶
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PREMIUM MEDIA LIGHTBOX MODAL
   ═══════════════════════════════════════════ */
function MediaLightbox({
  item,
  items,
  onClose,
  onPrev,
  onNext,
}: {
  item: MediaItem;
  items: MediaItem[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const currentIndex = items.findIndex((x) => x.id === item.id);
  const total = items.length;
  const pMeta = meta[item.project];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = origOverflow;
    };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="lightbox-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="lightbox-topbar">
        <div className="lightbox-topbar-left">
          <span className="lightbox-project-name">{item.project.toUpperCase()}</span>
          {pMeta && <span>· {pMeta.tag}</span>}
          {total > 1 && currentIndex >= 0 && (
            <span className="lightbox-counter">
              {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          )}
        </div>
        <button className="lightbox-close-btn" onClick={onClose} data-cursor="CLOSE">
          CLOSE ✕
        </button>
      </div>

      <div
        className="lightbox-main"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {total > 1 && (
          <button className="lightbox-nav-btn" onClick={onPrev} title="Previous (←)" data-cursor="PREV">
            ←
          </button>
        )}

        <div
          className="lightbox-stage"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              style={{ display: "contents" }}
            >
              {item.isPdf || item.src.toLowerCase().endsWith(".pdf") ? (
                <div className="lightbox-pdf-wrapper">
                  <object
                    data={`${item.src}#toolbar=1`}
                    type="application/pdf"
                    className="lightbox-pdf-object"
                  >
                    <div className="lightbox-pdf-fallback">
                      <p style={{ font: "12px Broche", letterSpacing: "0.14em", color: "#ccc", marginBottom: "16px" }}>
                        {item.source}
                      </p>
                      <a
                        href={item.src}
                        target="_blank"
                        rel="noreferrer"
                        className="lightbox-pdf-link"
                      >
                        OPEN ORIGINAL PDF IN NEW TAB ↗
                      </a>
                    </div>
                  </object>
                </div>
              ) : item.type === "video" ? (
                <CustomVideoPlayer item={item} />
              ) : (
                <img src={item.src} alt={`${item.project} creative`} className="lightbox-img" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {total > 1 && (
          <button className="lightbox-nav-btn" onClick={onNext} title="Next (→)" data-cursor="NEXT">
            →
          </button>
        )}
      </div>

      <div className="lightbox-footer">
        <span className="lightbox-caption-text">
          {item.source ? item.source.replace(/[-_]/g, " ").replace(/\.[^/.]+$/, "") : item.project}
        </span>
        <span className="lightbox-key-hint">ESC TO CLOSE · ← → TO NAVIGATE</span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   HIGH-PERFORMANCE MEDIA CARD
   - Clickable: Opens Media Lightbox (or native viewer for PDFs)
   - Aspect ratio preserved, no stretch or vertical takeover
   ═══════════════════════════════════════════ */
function MediaCard({
  item,
  variant = "feature",
  aspect,
  priority = false,
  caption,
  projectItems,
}: {
  key?: React.Key;
  item: MediaItem;
  variant?: "hero" | "feature" | "split" | "portrait" | "grid";
  aspect?: "landscape" | "portrait" | "square" | "video";
  priority?: boolean;
  caption?: string;
  projectItems?: MediaItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const { openLightbox } = React.useContext(LightboxContext);

  const isPdf = Boolean(
    item.isPdf ||
    item.src.toLowerCase().endsWith(".pdf") ||
    item.source.toLowerCase().endsWith(".pdf")
  );

  const effectiveAspect =
    aspect ||
    (item.orientation === "landscape"
      ? item.type === "video"
        ? "video"
        : "landscape"
      : item.orientation);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (item.type === "video" && videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
            setPlaying(true);
          } else {
            videoRef.current.pause();
            setPlaying(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: "60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [item.type]);

  const handleCardClick = () => {
    if (isPdf) {
      window.open(item.src, "_blank", "noopener,noreferrer");
      return;
    }
    openLightbox(item, projectItems);
  };

  return (
    <div
      ref={containerRef}
      className={`media-card media-${variant} media-aspect-${effectiveAspect} ${
        inView ? "media-in-view" : ""
      }`}
      data-cursor={item.type === "video" ? "PLAY" : isPdf ? "OPEN" : "VIEW"}
      onClick={handleCardClick}
    >
      <div className="media-frame">
        <span className="media-interactive-cue">
          {item.type === "video" ? "▶ PREVIEW" : isPdf ? "📄 VIEW PDF ↗" : "VIEW"}
        </span>
        {item.type === "video" ? (
          <video
            ref={videoRef}
            src={item.videoSrc}
            poster={item.src || undefined}
            muted
            loop
            playsInline
            preload={priority ? "auto" : "metadata"}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        ) : isPdf ? (
          <div className="media-pdf-wrapper">
            <object
              data={`${item.src}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
              type="application/pdf"
              className="media-pdf-object"
            >
              <div className="media-pdf-card">
                <span className="media-pdf-badge">PDF DOCUMENT</span>
                <h4 className="media-pdf-title">{caption || "CAMPUS PUBLICATION"}</h4>
                <span className="media-pdf-action">OPEN ORIGINAL PDF ↗</span>
              </div>
            </object>
          </div>
        ) : (
          <img
            src={item.src}
            alt={`${item.project} creative`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        )}
        <div className="media-light-sweep" />
      </div>

      <div className="media-meta">
        <div className="media-meta-left">
          {caption && <span className="media-caption">{caption}</span>}
        </div>
        <span className="media-type-badge">
          {item.type === "video" ? "▶ MOTION" : isPdf ? "📄 PDF" : "STILL"}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROJECT SINGLE ENTRY HEADER
   ═══════════════════════════════════════════ */
function ProjectIntro({
  project,
  index,
  totalCount,
  projectMeta,
  itemsCount,
  onBackToWork,
}: {
  project: string;
  index?: number;
  totalCount?: number;
  projectMeta: (typeof meta)[string];
  itemsCount?: number;
  onBackToWork?: () => void;
}) {
  return (
    <header className="project-intro">
      <div className="project-marker">
        {onBackToWork && (
          <button
            className="marker-index-btn"
            onClick={onBackToWork}
            data-cursor="BACK"
          >
            ← WORK
          </button>
        )}
      </div>

      <div className="project-title-grid">
        <h1 className="project-hero-title">{project}</h1>
        <div className="project-meta-col">
          <p className="project-statement">{projectMeta.intro}</p>
          <div className="project-meta-bottom">
            <span className="project-focus-text">{projectMeta.focus}</span>
          </div>
        </div>
      </div>
      <div className="project-header-rule" />
    </header>
  );
}

/* ═══════════════════════════════════════════
   CURATED CAPTION MAPPINGS & FALLBACK
   Discreet, minimal captioning for pieces
   ═══════════════════════════════════════════ */
const CURATED_CAPTIONS: Record<string, string> = {
  "sh-08": "TRAVEL CAMPAIGN / KEY VISUAL",
  "sh-09": "HIGHWAY CORRIDOR / CAMPAIGN PANORAMA",
  "sh-01": "FLEET IDENTITY / ON-ROAD",
  "sh-02": "PASSENGER EXPERIENCE / SEAT DETAIL",
  "sh-03": "TRAVEL CAMPAIGN STILL",
  "sh-04": "PASSENGER MOMENT",
  "sh-12": "REGIONAL AD / DELHI CAMPAIGN",
  "sh-v1": "COMMERCIAL FILM / TRANSIT",
  "sh-v2": "MOTION IDENT / TRANSIT",
  "sh-v3": "ROUTE REEL / MOTION",
  "sh-v4": "DEPARTURE MOMENTS / CINEMATIC",
  "sh-v5": "NIGHT HIGHWAY / ROUTE VISUAL",
  "tr-01": "EXHIBITION / SLEEP EXPO",
  "tr-02": "AIR TECHNOLOGY / PRODUCT COMMUNICATION",
  "tr-v1": "PAPER DIVISION / INDEPENDENCE DAY",
  "tr-v2": "PAPER EXPO / CLOSER TO NATURE",
  "tr-v3": "DUSSEHRA CAMPAIGN / FESTIVE MOTION",
  "tr-v4": "RAKHI CAMPAIGN / BRAND FILM",
  "tr-v5": "WORLD COTTON DAY / SUSTAINABILITY",
  "tr-v6": "SPRING CAMPAIGN / BRAND MOTION",
  "tr-v7": "NATIONAL FARMERS' DAY / BRAND FILM",
  "se-01": "PRODUCT CATALOGUE STILL",
  "se-v1": "DROID M WATER HEATER / PRODUCT ANIMATION",
  "se-v3": "PRIMAIR FAN / PRODUCT FILM",
  "se-v10": "SMART WIFI PLUG / PRODUCT FEATURE",
  "se-v11": "STANDARD ELECTRICALS / MOTION CAMPAIGN",
  "if-01": "HEAVY MACHINERY / FIELD CAROUSEL",
  "if-02": "TRACTOR SERIES / EDITORIAL AD",
  "if-03": "ARMY DAY SPECIAL / HEAVY COMMUNICATOR",
  "if-04": "NAVRATRI DAY / FESTIVAL CREATIVE",
  "if-v1": "POWER IN ACTION / MOTION FILM",
  "if-v2": "HARVEST OPERATIONS / MOTION",
  "if-v3": "EQUIPMENT PRECISION / ON-SITE",
  "if-v4": "FESTIVAL AD / HOLI",
  "if-v5": "REPUBLIC DAY CELEBRATION FILM",
  "if-v6": "PENGUIN SERIES / PRODUCT REEL",
  "ha-01": "ILLUMINATION CAMPAIGN",
  "ha-03": "DIWALI FESTIVAL CAMPAIGN / PANORAMA",
  "ha-04": "POP CULTURE / SPIDERMAN CAMPAIGN STILL",
  "ha-v6": "DECORATIVE PENDANT LIGHTING / BRAND FILM",
  "ha-v7": "HALONIX COMMERCIAL / BRAND FILM",
  "ha-v9": "ONAM FESTIVAL AD / MOTION",
  "ha-v10": "ROPELIGHT / COMMERCIAL",
  "bu-01": "SCHOOL OF LAW & LEGAL STUDIES",
  "bu-02": "WORLD ENVIRONMENTAL HEALTH DAY",
  "bu-03": "WORLD ENVIRONMENT DAY / CAMPAIGN PUBLICATION",
  "bu-v1": "CAMPUS CHRISTMAS CELEBRATION FILM",
  "bu-v2": "CAMPUS HOLI AD",
  "bu-v3": "HGPI FESTIVAL REEL / MOTION",
  "hv-01": "CONSUMER CAMPAIGN / HAPPINESS 5 LAKH CAROUSEL",
  "hu-01": "DESTINATION ROUTE / HELLO HUBLI",
  "hu-02": "REGIONAL AD / UDAIPUR ROUTE",
  "hu-03": "TRAVEL FLEET CAMPAIGN / RAJKOT ROUTE",
  "hu-04": "INTERACTIVE AD / FIFA THEMED CAMPAIGN",
  "hu-05": "POP CULTURE POST / BANGALORE'S HERO",
  "hu-06": "ROUTE NETWORK CAMPAIGN / AURANGABAD TO PUNE",
  "hu-07": "NEW ROUTE CAMPAIGN / CHH. SAMBHAJINAGAR TO JODHPUR",
  "hu-08": "पधारो म्हारे देश / JODHPUR WELCOME",
  "ho-01": "POOLSIDE LEISURE / PROPERTY EDITORIAL",
  "ho-02": "PROPERTY DETAIL PHOTOGRAPHY",
  "ho-03": "WEEKEND STAYCATION CAMPAIGN",
  "ho-v1": "LIFESTYLE REEL / AMBIENCE",
  "ho-v3": "SUMMER CAMPAIGN REEL / MOTION",
  "ho-v4": "CONCOURS PROPERTY REEL / LIFESTYLE",
  "ho-08": "SEASONAL DELIGHTS / EDITORIAL",
  "ho-v6": "PARK PLAZA / RESORT REEL",
  "ho-09": "RAKHI CAMPAIGN / PARK PLAZA",
};

function getItemCaption(item: MediaItem): string {
  if (CURATED_CAPTIONS[item.id]) return CURATED_CAPTIONS[item.id];
  if (!item.source) return item.project.toUpperCase();
  return item.source
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .toUpperCase();
}

/* ═══════════════════════════════════════════
   ORIENTATION-DRIVEN PROJECT ARCHIVE LAYOUT
   - Media orientation drives the layout dynamically
   - ONLY genuine landscape media can be horizontal hero
   - Portrait media NEVER used as horizontal hero
   - If no landscape media, begins directly with media grid
   - Clean horizontal grids (grid-2 & grid-3), pure CSS grid
   - NO editorial side-copy blocks beside artwork
   ═══════════════════════════════════════════ */
function renderProjectContent(project: string, items: MediaItem[]) {
  // 1. Classify media strictly by detected orientation
  const landscapes = items.filter((m) => m.orientation === "landscape");
  const portraits = items.filter((m) => m.orientation === "portrait");
  const squares = items.filter((m) => m.orientation === "square");

  // 2. Strict Hero Media Rule:
  // ONLY genuine landscape media can be hero.
  // Prefer genuine landscape video if available (e.g. Halonix 1920x1080), else landscape image.
  const landscapeVideos = landscapes.filter((m) => m.type === "video");
  const landscapeImages = landscapes.filter((m) => m.type === "image");

  let heroItem: MediaItem | null = null;
  let midLandscapes: MediaItem[] = [];

  if (landscapeVideos.length > 0) {
    heroItem = landscapeVideos[0];
    midLandscapes = [...landscapeVideos.slice(1), ...landscapeImages];
  } else if (landscapeImages.length > 0) {
    heroItem = landscapeImages[0];
    midLandscapes = landscapeImages.slice(1);
  }

  // 3. Balanced chunking helper for portrait / square grids
  const chunkBalanced = (arr: MediaItem[]): MediaItem[][] => {
    if (arr.length === 0) return [];
    if (arr.length <= 3) return [arr];
    if (arr.length === 4) return [arr.slice(0, 2), arr.slice(2, 4)];
    if (arr.length === 5) return [arr.slice(0, 3), arr.slice(3, 5)];

    const chunks: MediaItem[][] = [];
    let i = 0;
    while (i < arr.length) {
      const remaining = arr.length - i;
      if (remaining === 4) {
        chunks.push(arr.slice(i, i + 2));
        chunks.push(arr.slice(i + 2, i + 4));
        break;
      }
      const take = remaining >= 3 ? 3 : remaining;
      chunks.push(arr.slice(i, i + take));
      i += take;
    }
    return chunks;
  };

  // Helper to render portrait grid chunks
  const renderGridChunk = (
    chunk: MediaItem[],
    keyPrefix: string,
    aspect: "portrait" | "square" = "portrait"
  ) => {
    if (chunk.length === 0) return null;
    const gridCols =
      chunk.length % 3 === 0 ? "grid-3" : chunk.length === 2 ? "grid-2" : "grid-3";
    return (
      <div key={keyPrefix} className={`flow-horizontal-grid ${gridCols}`}>
        {chunk.map((m) => (
          <MediaCard
            key={m.id}
            item={m}
            variant="grid"
            aspect={aspect}
            caption={getItemCaption(m)}
            projectItems={items}
          />
        ))}
      </div>
    );
  };

  // Dedicated Hospitality editorial flow:
  // Preserves existing video chunks and still chunks, ending with the curated 3-piece composition:
  // LEFT: "A Collection Seasonal Delights" (ho-08)
  // CENTER: New Video (ho-v6)
  // RIGHT: Park Plaza Rakhi creative (ho-09)
  if (project === "Hospitality") {
    const trioIds = ["ho-08", "ho-v6", "ho-09"];
    const trio = trioIds
      .map((id) => items.find((m) => m.id === id))
      .filter(Boolean) as MediaItem[];
    const otherVideos = items.filter((m) => m.type === "video" && !trioIds.includes(m.id));
    const otherStills = items.filter((m) => m.type === "image" && !trioIds.includes(m.id));

    const videoChunks = chunkBalanced(otherVideos);
    const stillChunks = chunkBalanced(otherStills);

    return (
      <>
        {videoChunks.map((chunk, i) => renderGridChunk(chunk, `ho-vid-${i}`))}
        {stillChunks.map((chunk, i) => renderGridChunk(chunk, `ho-still-${i}`))}
        {trio.length === 3 && renderGridChunk(trio, "ho-editorial-trio")}
      </>
    );
  }

  // Separate portrait videos (reels) and portrait stills
  const portraitVideos = portraits.filter((m) => m.type === "video");
  const portraitStills = portraits.filter((m) => m.type === "image");

  const videoChunks = chunkBalanced(portraitVideos);
  const stillChunks = chunkBalanced(portraitStills);
  const squareChunks = chunkBalanced(squares);

  // Helper to render a landscape item in proper container
  const renderLandscapeStage = (item: MediaItem, isHero: boolean, idx: number) => {
    const isVideo = item.type === "video";
    const caption = getItemCaption(item);
    if (isVideo) {
      return (
        <div key={`stage-vid-${item.id}-${idx}`} className="flow-video-stage glow-warm">
          <div className="stage-ambient-glow" />
          <MediaCard
            item={item}
            variant={isHero ? "hero" : "feature"}
            priority={isHero}
            aspect="video"
            caption={caption}
            projectItems={items}
          />
        </div>
      );
    }
    return (
      <div key={`stage-img-${item.id}-${idx}`} className="flow-stage-hero">
        <MediaCard
          item={item}
          variant={isHero ? "hero" : "feature"}
          priority={isHero}
          aspect="landscape"
          caption={caption}
          projectItems={items}
        />
      </div>
    );
  };

  // Build the interleaved layout
  const sections: React.ReactNode[] = [];

  // Hero section ONLY if genuine landscape media exists
  if (heroItem) {
    sections.push(renderLandscapeStage(heroItem, true, 0));
  }

  // Interleave mid-landscapes with portrait chunks
  let vidIdx = 0;
  let stillIdx = 0;
  let midIdx = 0;

  const getNextPortraitChunk = (): { chunk: MediaItem[]; aspect: "portrait" } | null => {
    if (vidIdx < videoChunks.length) {
      const chunk = videoChunks[vidIdx];
      vidIdx++;
      return { chunk, aspect: "portrait" };
    }
    if (stillIdx < stillChunks.length) {
      const chunk = stillChunks[stillIdx];
      stillIdx++;
      return { chunk, aspect: "portrait" };
    }
    return null;
  };

  while (
    vidIdx < videoChunks.length ||
    stillIdx < stillChunks.length ||
    midIdx < midLandscapes.length
  ) {
    // 1. Place a portrait chunk
    const p1 = getNextPortraitChunk();
    if (p1) {
      sections.push(renderGridChunk(p1.chunk, `portrait-${sections.length}`, p1.aspect));
    }

    // 2. Place a mid-landscape feature if available
    if (midIdx < midLandscapes.length) {
      sections.push(
        renderLandscapeStage(midLandscapes[midIdx], false, midIdx + 1)
      );
      midIdx++;
    }

    // 3. Place another portrait chunk after the mid-landscape
    const p2 = getNextPortraitChunk();
    if (p2) {
      sections.push(renderGridChunk(p2.chunk, `portrait-${sections.length}`, p2.aspect));
    }
  }

  // Any square items placed cleanly
  squareChunks.forEach((chunk, idx) => {
    sections.push(renderGridChunk(chunk, `square-${idx}`, "square"));
  });

  return <>{sections}</>;
}

/* ═══════════════════════════════════════════
   HERO INTRO SEQUENCE (HOME PAGE)
   - Restrained, mature editorial hierarchy
   ═══════════════════════════════════════════ */
function Hero({
  ready,
  onExploreWork,
}: {
  ready: boolean;
  onExploreWork: () => void;
}) {
  const v = {
    hidden: { opacity: 0, y: 18 },
    show: (d: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: d, duration: 0.75, ease: [0.76, 0, 0.24, 1] },
    }),
  };
  const fade = {
    hidden: { opacity: 0 },
    show: (d: number) => ({
      opacity: 1,
      transition: { delay: d, duration: 0.6, ease: "easeOut" },
    }),
  };
  const animState = ready ? "show" : "hidden";

  return (
    <section className="hero" id="top">
      <SolarSystem />
      <motion.div
        className="hero-top"
        variants={fade}
        initial="hidden"
        animate={animState}
        custom={0.05}
      >
        <span>ANUJ®</span>
        <span>CREATIVE SUPERVISOR / VISUAL DESIGNER</span>
        <span>INDIA</span>
      </motion.div>

      <div className="hero-center">
        <motion.div
          variants={fade}
          initial="hidden"
          animate={animState}
          custom={0.15}
        >
          <Eyes />
        </motion.div>

        <div className="hero-type">
          <motion.div
            className="hero-kicker"
            variants={fade}
            initial="hidden"
            animate={animState}
            custom={0.3}
          >
            DESIGN / CAMPAIGNS / MOTION / VISUAL EXPLORATION
          </motion.div>
          <motion.h1 variants={v} initial="hidden" animate={animState} custom={0.42}>
            <span>IMAGINATION</span>
            <em>running wild.</em>
          </motion.h1>
          <motion.p variants={fade} initial="hidden" animate={animState} custom={0.65}>
            Curious by default. Comfortable with the strange briefs, the experiments, and the blank canvas.
          </motion.p>
        </div>

        <motion.button
          className="hero-cta"
          data-cursor="WORK"
          onClick={onExploreWork}
          variants={fade}
          initial="hidden"
          animate={animState}
          custom={0.8}
        >
          EXPLORE THE WORK <span>↓</span>
        </motion.button>
      </div>

      <div style={{ height: "24px" }} />
    </section>
  );
}

/* ═══════════════════════════════════════════
   HOME CURATED WORK SHOWCASE
   A confident introductory exhibition (not an endless dump)
   ═══════════════════════════════════════════ */
function HomeFeaturedWork({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const featured = ["Shyamoli", "Trident Group", "Halonix", "Humsafar"];

  return (
    <section className="home-featured-work" id="featured">
      <div className="home-featured-header">
        <div>
          <span className="notes-label" style={{ display: "block", marginBottom: "8px" }}>
            EXHIBITION HIGHLIGHTS
          </span>
          <h2 className="home-featured-title">
            FEATURED
            <br />
            <em>PROJECTS.</em>
          </h2>
        </div>
        <button
          className="home-view-all-link"
          onClick={() => onNavigate("/work")}
          data-cursor="ARCHIVE"
        >
          VIEW ALL WORK <span>→</span>
        </button>
      </div>

      <div className="home-featured-grid">
        {featured.map((p) => {
          const pMeta = meta[p];
          const firstImage = media.find((m) => m.project === p && m.src);
          const firstVideo = media.find((m) => m.project === p && m.type === "video");
          const displayMedia = firstImage || firstVideo;

          return (
            <button
              key={p}
              className="home-featured-card"
              style={{ "--accent": pMeta?.accent } as React.CSSProperties}
              onClick={() => onNavigate(`/work/${slug(p)}`)}
              data-cursor="VIEW"
            >
              <div className="home-card-media">
                {displayMedia?.type === "video" ? (
                  <video
                    src={displayMedia.videoSrc}
                    poster={displayMedia.src || undefined}
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                ) : displayMedia ? (
                  <img src={displayMedia.src} alt={p} loading="lazy" />
                ) : null}
              </div>
              <div className="home-card-meta">
                <h3 className="home-card-name">{p}</h3>
                <span className="home-card-tag">{pMeta?.tag}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   WORK ARCHIVE PAGE (/work)
   - Visual-led digital exhibition
   - 9 approved projects in exact sequence
   - Native artwork proportions, zero fake metadata
   ═══════════════════════════════════════════ */
function WorkArchivePage({
  onNavigate,
}: {
  projects?: string[];
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="page-container work-page">
      <header className="page-header work-page-header">
        <h1 className="page-title work-title">WORK</h1>
      </header>

      <div className="work-gallery-grid">
        {VISIBLE_PROJECT_SEQUENCE.map((projectName) => {
          const repId = REPRESENTATIVE_MEDIA[projectName];
          const repItem = media.find((m) => m.id === repId);
          const pMeta = meta[projectName];
          const isLandscape = repItem?.orientation === "landscape";

          return (
            <article
              key={projectName}
              className={`work-gallery-card ${isLandscape ? "is-landscape-span" : "is-portrait-card"}`}
              style={{ "--accent": pMeta?.accent } as React.CSSProperties}
              onClick={() => onNavigate(`/work/${slug(projectName)}`)}
              data-cursor="ENTER"
            >
              <div className="work-gallery-media">
                {repItem?.type === "video" ? (
                  <video
                    src={repItem.videoSrc}
                    poster={repItem.src || undefined}
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                ) : repItem ? (
                  <img
                    src={repItem.src}
                    alt={projectName}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <div className="work-gallery-sweep" />
              </div>

              <div className="work-gallery-meta">
                <h2 className="work-gallery-title">{projectName}</h2>
                <span className="work-gallery-cta">VIEW PROJECT ↗</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROJECT DETAIL PAGE (/work/[project])
   - Short, work-first structure
   - Work begins immediately after concise intro
   - Subtle Next Project transition looping through sequence
   ═══════════════════════════════════════════ */
function ProjectDetailPage({
  project,
  onNavigate,
}: {
  project: string;
  projects?: string[];
  onNavigate: (path: string) => void;
}) {
  const items = useMemo(() => media.filter((x) => x.project === project), [project]);
  const pMeta = meta[project];

  const currentIdx = VISIBLE_PROJECT_SEQUENCE.indexOf(project);
  const nextProject =
    currentIdx >= 0
      ? VISIBLE_PROJECT_SEQUENCE[(currentIdx + 1) % VISIBLE_PROJECT_SEQUENCE.length]
      : VISIBLE_PROJECT_SEQUENCE[0];

  if (!items.length || !pMeta) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: "140px" }}>
        <h2>PROJECT NOT FOUND</h2>
        <button
          onClick={() => onNavigate("/work")}
          style={{ marginTop: "20px", color: "#aaa" }}
        >
          ← RETURN TO WORK
        </button>
      </div>
    );
  }

  return (
    <article
      className={`project-detail-page project-${slug(project)} trans-${slug(project)}`}
      style={{ "--accent": pMeta.accent } as React.CSSProperties}
    >
      <ProjectIntro
        project={project}
        projectMeta={pMeta}
        onBackToWork={() => onNavigate("/work")}
      />

      <div className="project-exhibition-flow">{renderProjectContent(project, items)}</div>

      <div className="next-project-divider" />
      <section className="next-project-transition">
        <button
          className="next-project-link"
          onClick={() => onNavigate(`/work/${slug(nextProject)}`)}
          data-cursor="NEXT"
        >
          <span className="next-project-eyebrow">UP NEXT</span>
          <h2 className="next-project-name">{nextProject}</h2>
          <span className="next-project-action">VIEW PROJECT →</span>
        </button>
      </section>
    </article>
  );
}

/* ═══════════════════════════════════════════
   CUSTOM 404 PAGE
   - Minimal, dark, editorial
   ═══════════════════════════════════════════ */
function NotFoundPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="page-container not-found-page">
      <header className="page-header not-found-header">
        <span className="not-found-eyebrow">404</span>
        <h1 className="page-title not-found-title">
          THIS PAGE
          <br />
          <em>WANDERED OFF.</em>
        </h1>
        <div className="not-found-cta">
          <button
            className="not-found-btn"
            onClick={() => onNavigate("/work")}
            data-cursor="WORK"
          >
            Back to work <span>→</span>
          </button>
        </div>
      </header>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROCESS PAGE (/process)
   ═══════════════════════════════════════════ */
function ProcessPage() {
  const studies = [
    {
      brand: "Trident Group",
      title: "TACTILE PACKAGING & TEXTILE IDENTITY",
      step: "01",
      steps: [
        "THE IDEA: Tactile sustainability",
        "VISUAL EXPLORATION: Earth tones & raw pulp",
        "DESIGN SYSTEM: Heavy grid & minimal typography",
        "MOTION: Fluid unravelling lines",
      ],
    },
    {
      brand: "Halonix",
      title: "HIGH-CONTRAST ILLUMINATION CAMPAIGNS",
      step: "02",
      steps: [
        "THE IDEA: Light as drama",
        "VISUAL EXPLORATION: Deep black vs bright amber",
        "DESIGN SYSTEM: Radiant highlights",
        "MOTION: Pulsing light transitions",
      ],
    },
    {
      brand: "Standard Electricals",
      title: "PRECISION MOTION FOR CONSUMER APPLIANCES",
      step: "03",
      steps: [
        "THE IDEA: Geometry meets function",
        "VISUAL EXPLORATION: Technical wireframes",
        "DESIGN SYSTEM: Clean Swiss rules",
        "MOTION: Linear mechanical camera tracking",
      ],
    },
  ];

  return (
    <div className="page-container">
      <header className="page-header">
        <span className="notes-label" style={{ display: "block", marginBottom: "12px" }}>
          IDEA LAB
        </span>
        <h1 className="page-title">
          FROM THOUGHT
          <br />
          <em>TO FRAME.</em>
        </h1>
        <p className="page-lead">
          These studies reconstruct the creative thinking and design process around selected briefs.
          They are labelled explicitly as concept reconstructions.
        </p>
      </header>

      <div className="process-list">
        {studies.map((s, i) => {
          const item = media.find((x) => x.project === s.brand);
          return (
            <article key={s.brand} className="process-study-card">
              <div className="study-copy">
                <div className="study-badge">CONCEPT RECONSTRUCTION // 0{i + 1}</div>
                <h3>{s.brand}</h3>
                <p className="study-title">{s.title}</p>
                <div className="study-step-flow">
                  {s.steps.map((st, idx) => (
                    <div key={idx} className="study-step-row">
                      <span className="step-num">0{idx + 1}</span>
                      <span className="step-text">{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="study-board">
                {item && <MediaCard item={item} variant="feature" aspect="landscape" />}
                <div className="sketch-lines">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="sketch-note">
                  RECONSTRUCTED
                  <br />
                  VISUAL STUDY
                </div>
                <div className="sketch-arrow">
                  EXPLORATION
                  <br />
                  DIRECTION ↗
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   INFO PAGE (/info)
   ═══════════════════════════════════════════ */
function InfoPage() {
  return (
    <div className="page-container info-page">
      <header className="page-header info-page-header">
        <h1 className="page-title info-title">
          I’M JUST A KID
          <br />
          WITH AN IMAGINATION
          <br />
          <em>THAT WON’T SIT STILL.</em>
        </h1>
        <p className="page-lead info-lead">
          Curiosity, experimentation, and visual storytelling. Give me a problem, a blank canvas,
          or something slightly ridiculous — I'll figure out where to take it.
          If it’s interesting, I’m interested.
        </p>
      </header>

      <div className="info-editorial-layout">
        <div className="info-block">
          <span className="info-block-label">BACKGROUND</span>
          <div className="info-timeline">
            <div className="info-timeline-entry">
              <span className="info-timeline-date">MAY 2024 — FEB 2025</span>
              <h3 className="info-timeline-role">HV Production / Horizon Visuals</h3>
              <p className="info-timeline-desc">
                Concert posters, marketing, social media campaigns
              </p>
            </div>
            <div className="info-timeline-entry">
              <span className="info-timeline-date">FEB 2025 — PRESENT</span>
              <h3 className="info-timeline-role">Xanadu Brands</h3>
              <p className="info-timeline-desc">
                Expanded from Photoshop & Illustrator into After Effects, video editing and motion
              </p>
            </div>
          </div>
        </div>

        <div className="info-block">
          <span className="info-block-label">TOOLS</span>
          <div className="info-tools-editorial">
            <span>PHOTOSHOP</span>
            <span className="tool-sep">/</span>
            <span>ILLUSTRATOR</span>
            <span className="tool-sep">/</span>
            <span>AFTER EFFECTS</span>
            <span className="tool-sep">/</span>
            <span>FIGMA</span>
            <span className="tool-sep">/</span>
            <span>AI TOOLS</span>
          </div>
        </div>

        <div className="info-block info-block-stance">
          <span className="info-block-label">STANCE</span>
          <p className="info-stance-text">Bring it on.</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CONTACT PAGE (/contact)
   ═══════════════════════════════════════════ */
function ContactPage() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page-container">
      {/* Editorial Header Section */}
      <div className="contact-editorial-header">
        {/* Left Side: Headline & Narrative */}
        <div className="contact-intro-col">
          <span className="contact-tag">CONTACT</span>
          <h1 className="contact-hero-title">
            LET’S CREATE
            <br />
            SOMETHING MEANINGFUL.
          </h1>
          <p className="contact-lead-text">
            I’m always open to new ideas, collaborations and opportunities.
            <br />
            If you have a project in mind, just say hello.
          </p>
        </div>

        {/* Vertical Divider & Right Side: Other Ways to Reach Me */}
        <div className="contact-info-col">
          <div className="contact-info-block">
            <span className="contact-info-heading">OTHER WAYS TO REACH ME</span>

            <div className="contact-info-item">
              <span className="contact-field-label">EMAIL</span>
              <a
                href="mailto:yashlohia75@gmail.com"
                className="contact-info-link"
                data-cursor="EMAIL"
              >
                yashlohia75@gmail.com
              </a>
            </div>

            <div className="contact-info-item">
              <span className="contact-field-label">LOCATION</span>
              <span className="contact-info-value">India</span>
            </div>

            <div className="contact-info-item">
              <span className="contact-field-label">LINKEDIN</span>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-info-link"
                data-cursor="LINK"
              >
                LinkedIn ↗
              </a>
            </div>

            <div className="contact-info-item">
              <span className="contact-field-label">BEHANCE</span>
              <a
                href="https://www.behance.net"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-info-link"
                data-cursor="LINK"
              >
                Behance ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-editorial-divider" />

      {/* Form Section */}
      <div className="contact-form-section">
        {sent ? (
          <div className="contact-sent-card">
            <span className="contact-tag">MESSAGE RECEIVED</span>
            <h2 className="contact-sent-heading">THANK YOU FOR REACHING OUT.</h2>
            <p className="contact-sent-sub">
              Your message has been received. I’ll review your details and get back to you soon.
            </p>
            <button
              type="button"
              className="contact-resend-btn"
              onClick={() => {
                setSent(false);
                setFormData({ name: "", email: "", projectType: "", message: "" });
              }}
              data-cursor="CLICK"
            >
              ← SEND ANOTHER MESSAGE
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="contact-form-grid">
            {/* Row 1: Name & Email */}
            <div className="contact-form-group">
              <label htmlFor="contact-name" className="contact-field-label">
                NAME
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="contact-input"
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-email" className="contact-field-label">
                EMAIL
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="contact-input"
              />
            </div>

            {/* Row 2: Project Type & Message */}
            <div className="contact-form-group">
              <label htmlFor="contact-project-type" className="contact-field-label">
                WHAT ARE WE MAKING?
              </label>
              <select
                id="contact-project-type"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="contact-select"
              >
                <option value="" disabled>
                  Select a project type ↓
                </option>
                <option value="brand-campaign">Brand Campaign & Identity</option>
                <option value="social-digital">Social & Digital Design</option>
                <option value="motion-3d">Motion Direction & 3D</option>
                <option value="creative-storytelling">Visual Storytelling & Direction</option>
                <option value="other">Other Inquiry / Just Saying Hello</option>
              </select>
            </div>

            <div className="contact-form-group contact-message-group">
              <label htmlFor="contact-message" className="contact-field-label">
                MESSAGE
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={6}
                placeholder="Tell me about your idea..."
                value={formData.message}
                onChange={handleChange}
                className="contact-textarea"
              />
            </div>

            {/* Row 3: Submit CTA */}
            <div className="contact-action-row">
              <button
                type="submit"
                className="contact-submit-btn"
                data-cursor="SEND"
              >
                <span className="contact-submit-arrow">→</span>
                <span className="contact-submit-text">SEND IT MY WAY</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP ARCHITECTURE
   ═══════════════════════════════════════════ */
function App() {
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<Route>(() => parsePath(window.location.pathname));

  // Dynamic SEO management
  useDocumentSEO(route);

  // Lightbox state
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [lightboxItems, setLightboxItems] = useState<MediaItem[]>([]);

  // Visible projects strictly following the approved canonical sequence
  const visibleProjects = VISIBLE_PROJECT_SEQUENCE;

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, "", path);
    setRoute(parsePath(path));
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setRoute(parsePath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  // Lightbox open / navigation handlers
  const openLightbox = useCallback((item: MediaItem, projectItems?: MediaItem[]) => {
    setLightboxItem(item);
    if (projectItems && projectItems.length > 0) {
      setLightboxItems(projectItems);
    } else {
      const pItems = media.filter((m) => m.project === item.project);
      setLightboxItems(pItems.length > 0 ? pItems : [item]);
    }
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxItem(null);
  }, []);

  const nextLightbox = useCallback(() => {
    if (!lightboxItem || lightboxItems.length <= 1) return;
    const idx = lightboxItems.findIndex((m) => m.id === lightboxItem.id);
    const nextIdx = idx < lightboxItems.length - 1 ? idx + 1 : 0;
    setLightboxItem(lightboxItems[nextIdx]);
  }, [lightboxItem, lightboxItems]);

  const prevLightbox = useCallback(() => {
    if (!lightboxItem || lightboxItems.length <= 1) return;
    const idx = lightboxItems.findIndex((m) => m.id === lightboxItem.id);
    const prevIdx = idx > 0 ? idx - 1 : lightboxItems.length - 1;
    setLightboxItem(lightboxItems[prevIdx]);
  }, [lightboxItem, lightboxItems]);

  const lightboxValue = useMemo(() => ({ openLightbox }), [openLightbox]);

  return (
    <LightboxContext.Provider value={lightboxValue}>
      <Loader done={!loading} />
      <Cursor />

      <SiteNavigation currentRoute={route} onNavigate={navigate} />

      <main>
        {route.page === "home" && (
          <>
            <Hero ready={!loading} onExploreWork={() => navigate("/work")} />
            <HomeFeaturedWork onNavigate={navigate} />
          </>
        )}

        {route.page === "work" && (
          <WorkArchivePage onNavigate={navigate} />
        )}

        {route.page === "project" && (
          <ProjectDetailPage
            project={route.project}
            onNavigate={navigate}
          />
        )}

        {route.page === "process" && <ProcessPage />}

        {route.page === "info" && <InfoPage />}

        {route.page === "contact" && <ContactPage />}

        {route.page === "not-found" && <NotFoundPage onNavigate={navigate} />}
      </main>

      {/* Premium Media Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <MediaLightbox
            item={lightboxItem}
            items={lightboxItems}
            onClose={closeLightbox}
            onPrev={prevLightbox}
            onNext={nextLightbox}
          />
        )}
      </AnimatePresence>

      <footer>
        <span>ANUJ® / CREATIVE SUPERVISOR</span>
        <span>DESIGN / MOTION / VISUAL EXPLORATION</span>
        <span>© 2026</span>
      </footer>
    </LightboxContext.Provider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
