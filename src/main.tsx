import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { brandSlug, media, MediaItem, projectOrder } from "./media";
import "./styles.css";

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
function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ═══════════════════════════════════════════
   PHASE 1 (LOCKED): Loader Choreography
   BLACK → tiny orbital point → sun appears
   → progress line → "INITIALISING IMAGINATION"
   → subtle eye/blink moment → hero reveal
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
            <span>01 / 09</span>
            <span>100%</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════
   PHASE 1 (LOCKED): Eye System
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
   PHASE 1 (LOCKED): Celestial System
   Scroll-linked: becomes quieter during work (0.08–0.10 opacity)
   ═══════════════════════════════════════════ */
function SolarSystem() {
  const { scrollYProgress } = useScroll();

  const r1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const r2 = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const r3 = useTransform(scrollYProgress, [0, 1], [0, 480]);
  const r4 = useTransform(scrollYProgress, [0, 1], [0, -170]);
  const r5 = useTransform(scrollYProgress, [0, 1], [0, 290]);

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1.05, 0.9]);
  // Quieter presence during work sections so artwork always takes center stage
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
   Custom Cursor
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
   PHASE 1 (LOCKED): Hero Opening Sequence
   ═══════════════════════════════════════════ */
function Hero({ ready }: { ready: boolean }) {
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
        <span>INDIA / 2026</span>
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
          data-cursor="EXPLORE"
          onClick={() => scrollToId("work")}
          variants={fade}
          initial="hidden"
          animate={animState}
          custom={0.8}
        >
          EXPLORE THE WORK <span>↓</span>
        </motion.button>
      </div>

      <motion.div
        className="hero-foot"
        variants={fade}
        initial="hidden"
        animate={animState}
        custom={0.88}
      >
        <span>SCROLL TO MOVE THROUGH THE SYSTEM</span>
        <span>SCROLL / 001</span>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PHASE 2: WORK INDEX (EDITORIAL & DYNAMIC HOVER PREVIEW)
   - Project number, name, category, pieces metadata
   - Floating preview moves with cursor
   - Row shifts 3px on hover, accent responds
   ═══════════════════════════════════════════ */
function WorkIndex({
  projects,
  active,
  onPick,
}: {
  projects: string[];
  active: string;
  onPick: (p: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const smoothX = useSpring(mouseX, { stiffness: 450, damping: 32 });
  const smoothY = useSpring(mouseY, { stiffness: 450, damping: 32 });

  const onMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX + 24);
    mouseY.set(e.clientY - 90);
  };

  const hoveredItem = useMemo(() => {
    if (!hovered) return null;
    return media.find((m) => m.project === hovered) || null;
  }, [hovered]);

  return (
    <section className="work-index" id="work" onMouseMove={onMouseMove}>
      <div className="section-eyebrow">
        <span>01 / SELECTED WORK</span>
        <span>EDITORIAL ARCHIVE</span>
      </div>

      <div className="work-index-header">
        <div className="work-title-group">
          <span className="work-subtitle">SELECTED PROJECTS · 2024 — 2026</span>
          <h2>
            SELECTED
            <br />
            <em>WORK.</em>
          </h2>
        </div>
        <p className="work-description">
          An art-directed exhibition of selected brand campaigns, motion direction, industrial identity,
          and destination storytelling.
        </p>
      </div>

      <div className="work-project-list" onMouseLeave={() => setHovered(null)}>
        {projects.map((p, i) => {
          const pItems = media.filter((m) => m.project === p);
          const pMeta = meta[p];
          const hasVideos = pItems.some((m) => m.type === "video");

          return (
            <button
              key={p}
              className={`work-row ${hovered === p || active === p ? "is-active" : ""}`}
              style={{ "--accent": pMeta?.accent } as React.CSSProperties}
              onMouseEnter={() => {
                setHovered(p);
                onPick(p);
              }}
              onFocus={() => {
                setHovered(p);
                onPick(p);
              }}
              onClick={() => scrollToId(`project-${slug(p)}`)}
              data-cursor="ENTER"
            >
              <span className="work-row-no">{String(i + 1).padStart(2, "0")}</span>
              <div className="work-row-main">
                <b className="work-row-name">{p}</b>
                <span className="work-row-tag">{pMeta?.tag}</span>
              </div>
              <div className="work-row-meta">
                <span>{pItems.length} PIECES</span>
                <span>{hasVideos ? "MOTION + STILLS" : "STILLS"}</span>
              </div>
              <span className="work-row-arrow">↗</span>
            </button>
          );
        })}
      </div>

      {/* Floating Hover Preview Card */}
      <AnimatePresence>
        {hovered && hoveredItem && (
          <motion.div
            className="work-floating-preview"
            style={{ x: smoothX, y: smoothY }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.2 }}
          >
            {hoveredItem.type === "video" ? (
              <video
                src={hoveredItem.videoSrc}
                poster={hoveredItem.src || undefined}
                muted
                autoPlay
                loop
                playsInline
              />
            ) : (
              <img src={hoveredItem.src} alt={`${hovered} preview`} />
            )}
            <div className="floating-preview-bar">
              <span>{hovered.toUpperCase()}</span>
              <span>PREVIEW</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PHASE 2: High-Performance Media Card
   - Viewport IntersectionObserver pauses offscreen video
   - Cinematic clip-path reveal & scale settle
   - Muted autoplay / playsInline
   ═══════════════════════════════════════════ */
function MediaCard({
  item,
  variant = "feature",
  aspect = "landscape",
  priority = false,
  caption,
}: {
  key?: React.Key;
  item: MediaItem;
  variant?: "hero" | "feature" | "split" | "portrait" | "grid";
  aspect?: "landscape" | "portrait" | "square" | "video";
  priority?: boolean;
  caption?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);

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

  return (
    <div
      ref={containerRef}
      className={`media-card media-${variant} media-aspect-${aspect} ${
        inView ? "media-in-view" : ""
      }`}
      data-cursor={item.type === "video" ? (playing ? "PLAYING" : "PLAY") : "VIEW"}
    >
      <div className="media-frame">
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
          <span className="media-id">{String(item.id).toUpperCase()}</span>
          {caption && <span className="media-caption">{caption}</span>}
        </div>
        <span className="media-type-badge">
          {item.type === "video"
            ? playing
              ? "▶ MOTION / LIVE"
              : "▶ MOTION"
            : "STATIC / CREATIVE"}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PHASE 2.1: Single Project Entry Moment
   - Compact transition marker (02 / 09 · Category · Index jump)
   - Large project title & compact editorial statement side-by-side
   - Reduced vertical spacing: artwork arrives quickly
   ═══════════════════════════════════════════ */
function ProjectIntro({
  project,
  index,
  totalCount,
  projectMeta,
  itemsCount,
}: {
  project: string;
  index: number;
  totalCount: number;
  projectMeta: (typeof meta)[string];
  itemsCount: number;
}) {
  return (
    <header className="project-intro">
      <div className="project-marker">
        <div className="marker-meta">
          <span className="marker-num">0{index + 1} / 0{totalCount}</span>
          <span className="marker-sep">/</span>
          <span className="marker-tag">{projectMeta.tag}</span>
        </div>
        <button
          className="marker-index-btn"
          onClick={() => scrollToId("work")}
          data-cursor="INDEX"
        >
          INDEX ↑
        </button>
      </div>

      <div className="project-title-grid">
        <h2 className="project-hero-title">{project}</h2>
        <div className="project-meta-col">
          <p className="project-statement">{projectMeta.intro}</p>
          <div className="project-meta-bottom">
            <span className="project-focus-text">{projectMeta.focus}</span>
            <span className="project-count-pill">
              {itemsCount} PIECES · {projectMeta.year}
            </span>
          </div>
        </div>
      </div>
      <div className="project-header-rule" />
    </header>
  );
}

/* ═══════════════════════════════════════════
   PHASE 2: Project-Specific Art-Directed Content Flow
   Custom composition and pacing for each project:
   - Shyamoli: Route movement & travel horizontal flow
   - Trident: Tactile editorial structure & paper films
   - Standard Electricals: Technical precision & motion stages
   - Indo Farm: Grounded heavy horizontal scale & machinery
   - Halonix: Illumination light/dark contrast & glow stages
   - Bahra University: Campus culture & festive motion
   - Havells: Polished consumer campaign showcase
   - Humsafar: Destination narratives & cultural routes
   - Hospitality: Resort atmosphere & poolside photography
   ═══════════════════════════════════════════ */
function renderProjectContent(project: string, items: MediaItem[]) {
  const byId = (id: string) => items.find((m) => m.id === id);

  switch (project) {
    case "Shyamoli": {
      const hero = byId("sh-01") || items[0];
      const vidHero = byId("sh-v1");
      const splitA1 = byId("sh-12");
      const splitA2 = byId("sh-02");
      const portrait = byId("sh-03");
      const vidMid = byId("sh-v2");
      const splitB1 = byId("sh-04");
      const splitB2 = byId("sh-v3");
      const usedIds = new Set([
        hero?.id,
        vidHero?.id,
        splitA1?.id,
        splitA2?.id,
        portrait?.id,
        vidMid?.id,
        splitB1?.id,
        splitB2?.id,
      ]);
      const rest = items.filter((m) => !usedIds.has(m.id));

      return (
        <>
          {/* Hero Landscape */}
          {hero && (
            <div className="flow-stage-hero">
              <MediaCard item={hero} variant="hero" priority aspect="landscape" caption="TRAVEL CAMPAIGN / KEY VISUAL" />
            </div>
          )}

          {/* Cinematic Motion Stage */}
          {vidHero && (
            <div className="flow-video-stage">
              <div className="stage-ambient-glow" />
              <MediaCard item={vidHero} variant="feature" aspect="video" caption="COMMERCIAL FILM / TRANSIT" />
            </div>
          )}

          {/* Asymmetric Split Spread */}
          {splitA1 && splitA2 && (
            <div className="flow-split-row">
              <div className="split-col-wide">
                <MediaCard item={splitA1} variant="split" aspect="landscape" caption="REGIONAL AD / DELHI CAMPAIGN" />
              </div>
              <div className="split-col-narrow">
                <MediaCard item={splitA2} variant="split" aspect="square" caption="FLEET STILL" />
              </div>
            </div>
          )}

          {/* Offset Portrait with Travel Route Editorial Note */}
          {portrait && (
            <div className="flow-portrait-offset">
              <div className="portrait-offset-card">
                <MediaCard item={portrait} variant="portrait" aspect="portrait" caption="TRAVEL CAMPAIGN STILL" />
              </div>
              <div className="portrait-editorial-notes">
                <span className="notes-label">ROUTE IDENTITY</span>
                <h4>JOURNEYS CRAFTED AROUND THE RIDER.</h4>
                <p>
                  Visual pacing designed to reflect highway movement, long-distance comfort, and the
                  anticipation of arrival.
                </p>
              </div>
            </div>
          )}

          {/* Second Motion Feature */}
          {vidMid && (
            <div className="flow-video-stage">
              <MediaCard item={vidMid} variant="feature" aspect="video" caption="MOTION IDENT / TRANSIT" />
            </div>
          )}

          {/* Asymmetric Split 2 */}
          {splitB1 && splitB2 && (
            <div className="flow-split-row">
              <div className="split-col-narrow">
                <MediaCard item={splitB1} variant="split" aspect="square" caption="PASSENGER MOMENT" />
              </div>
              <div className="split-col-wide">
                <MediaCard item={splitB2} variant="split" aspect="video" caption="ROUTE REEL / MOTION" />
              </div>
            </div>
          )}

          {/* Supporting Work Staggered Grid */}
          {rest.length > 0 && (
            <div className="flow-editorial-grid grid-3">
              {rest.map((m) => (
                <MediaCard key={m.id} item={m} variant="grid" aspect={m.type === "video" ? "video" : "landscape"} />
              ))}
            </div>
          )}
        </>
      );
    }

    case "Trident Group": {
      const vidHero = byId("tr-v1") || items.find((m) => m.type === "video");
      const split1 = byId("tr-01");
      const split2 = byId("tr-v2");
      const feature = byId("tr-02");
      const usedIds = new Set([vidHero?.id, split1?.id, split2?.id, feature?.id]);
      const rest = items.filter((m) => !usedIds.has(m.id));

      return (
        <>
          {/* Motion Stage Hero */}
          {vidHero && (
            <div className="flow-video-stage">
              <div className="stage-ambient-glow" />
              <MediaCard item={vidHero} variant="hero" priority aspect="video" caption="PAPER DIVISION / INDEPENDENCE DAY" />
            </div>
          )}

          {/* Tactile Split: Sleep Expo + Air Technology beside Nature Expo Tall Reel */}
          {split1 && split2 && (
            <div className="flow-split-row">
              <div className="split-col-wide">
                <MediaCard item={split1} variant="split" aspect="landscape" caption="EXHIBITION / SLEEP EXPO" />
                {feature && (
                  <MediaCard item={feature} variant="split" aspect="landscape" caption="AIR TECHNOLOGY / PRODUCT COMMUNICATION" />
                )}
              </div>
              <div className="split-col-narrow">
                <MediaCard item={split2} variant="split" aspect="video" caption="PAPER EXPO / NATURE REEL" />
              </div>
            </div>
          )}

          {/* Supporting Motion Grid */}
          {rest.length > 0 && (
            <div className="flow-editorial-grid grid-2">
              {rest.map((m) => (
                <MediaCard key={m.id} item={m} variant="grid" aspect="video" />
              ))}
            </div>
          )}
        </>
      );
    }

    case "Standard Electricals": {
      const heroVid = byId("se-v1") || items[0];
      const still = byId("se-01");
      const fanVid = byId("se-v3");
      const wifiVid = byId("se-v10");
      const usedIds = new Set([heroVid?.id, still?.id, fanVid?.id, wifiVid?.id]);
      const rest = items.filter((m) => !usedIds.has(m.id));

      return (
        <>
          {/* Hero Technical Product Motion */}
          {heroVid && (
            <div className="flow-video-stage">
              <div className="stage-ambient-glow" />
              <MediaCard item={heroVid} variant="hero" priority aspect="video" caption="DROID M WATER HEATER / PRODUCT ANIMATION" />
            </div>
          )}

          {/* Split: Still + Primair Fan */}
          {still && fanVid && (
            <div className="flow-split-row">
              <div className="split-col-narrow">
                <MediaCard item={still} variant="split" aspect="square" caption="PRODUCT CATALOGUE STILL" />
              </div>
              <div className="split-col-wide">
                <MediaCard item={fanVid} variant="split" aspect="video" caption="PRIMAIR FAN / PRODUCT FILM" />
              </div>
            </div>
          )}

          {/* Smart Wifi Plug Motion Feature */}
          {wifiVid && (
            <div className="flow-stage-hero">
              <MediaCard item={wifiVid} variant="feature" aspect="video" caption="SMART WIFI PLUG / PRODUCT FEATURE" />
            </div>
          )}

          {/* Technical Motion Grid */}
          {rest.length > 0 && (
            <div className="flow-editorial-grid grid-3">
              {rest.map((m) => (
                <MediaCard key={m.id} item={m} variant="grid" aspect="video" />
              ))}
            </div>
          )}
        </>
      );
    }

    case "Indo Farm": {
      const hero = byId("if-01") || items[0];
      const vidHero = byId("if-v1");
      const split1 = byId("if-02");
      const split2 = byId("if-v4");
      const portrait = byId("if-03");
      const vidMid = byId("if-v5");
      const usedIds = new Set([hero?.id, vidHero?.id, split1?.id, split2?.id, portrait?.id, vidMid?.id]);
      const rest = items.filter((m) => !usedIds.has(m.id));

      return (
        <>
          {/* Grounded Machinery Hero Feature */}
          {hero && (
            <div className="flow-stage-hero">
              <MediaCard item={hero} variant="hero" priority aspect="landscape" caption="HEAVY MACHINERY / FIELD CAROUSEL" />
            </div>
          )}

          {/* Motion Stage */}
          {vidHero && (
            <div className="flow-video-stage">
              <div className="stage-ambient-glow" />
              <MediaCard item={vidHero} variant="feature" aspect="video" caption="POWER IN ACTION / MOTION FILM" />
            </div>
          )}

          {/* Asymmetric Split: Field Still + Holi Film */}
          {split1 && split2 && (
            <div className="flow-split-row">
              <div className="split-col-wide">
                <MediaCard item={split1} variant="split" aspect="landscape" caption="TRACTOR SERIES / EDITORIAL AD" />
              </div>
              <div className="split-col-narrow">
                <MediaCard item={split2} variant="split" aspect="video" caption="FESTIVAL AD / HOLI" />
              </div>
            </div>
          )}

          {/* Offset Portrait: Army Day */}
          {portrait && (
            <div className="flow-portrait-offset">
              <div className="portrait-offset-card">
                <MediaCard item={portrait} variant="portrait" aspect="portrait" caption="ARMY DAY CAMPAIGN" />
              </div>
              <div className="portrait-editorial-notes">
                <span className="notes-label">POWER & INTEGRITY</span>
                <h4>BUILT FOR WORK THAT DOES NOT STOP.</h4>
                <p>
                  Industrial communication created with weight, authentic landscape scale, and no
                  decorative fluff.
                </p>
              </div>
            </div>
          )}

          {/* Republic Day Motion Feature */}
          {vidMid && (
            <div className="flow-video-stage">
              <MediaCard item={vidMid} variant="feature" aspect="video" caption="REPUBLIC DAY CELEBRATION FILM" />
            </div>
          )}

          {/* Supporting Machinery Grid */}
          {rest.length > 0 && (
            <div className="flow-editorial-grid grid-2">
              {rest.map((m) => (
                <MediaCard key={m.id} item={m} variant="grid" aspect={m.type === "video" ? "video" : "landscape"} />
              ))}
            </div>
          )}
        </>
      );
    }

    case "Halonix": {
      const vidHero = byId("ha-v6") || items.find((m) => m.type === "video");
      const split1 = byId("ha-01");
      const split2 = byId("ha-v10");
      const feature = byId("ha-04");
      const vidMid = byId("ha-v9");
      const usedIds = new Set([vidHero?.id, split1?.id, split2?.id, feature?.id, vidMid?.id]);
      const rest = items.filter((m) => !usedIds.has(m.id));

      return (
        <>
          {/* Pendant Lighting Cinema Stage with Warm Glow */}
          {vidHero && (
            <div className="flow-video-stage glow-warm">
              <div className="stage-ambient-glow" />
              <MediaCard item={vidHero} variant="hero" priority aspect="video" caption="DECORATIVE PENDANT LIGHTING / BRAND FILM" />
            </div>
          )}

          {/* Split: Still + Ropelight Motion */}
          {split1 && split2 && (
            <div className="flow-split-row">
              <div className="split-col-narrow">
                <MediaCard item={split1} variant="split" aspect="square" caption="ILLUMINATION CAMPAIGN" />
              </div>
              <div className="split-col-wide">
                <MediaCard item={split2} variant="split" aspect="video" caption="ROPELIGHT / COMMERCIAL" />
              </div>
            </div>
          )}

          {/* Spiderman Campaign Feature */}
          {feature && (
            <div className="flow-stage-hero">
              <MediaCard item={feature} variant="feature" aspect="landscape" caption="POP CULTURE / SPIDERMAN CAMPAIGN STILL" />
            </div>
          )}

          {/* Onam Motion Ad */}
          {vidMid && (
            <div className="flow-video-stage">
              <MediaCard item={vidMid} variant="feature" aspect="video" caption="ONAM FESTIVAL AD / MOTION" />
            </div>
          )}

          {/* Lighting Grid */}
          {rest.length > 0 && (
            <div className="flow-editorial-grid grid-3">
              {rest.map((m) => (
                <MediaCard key={m.id} item={m} variant="grid" aspect={m.type === "video" ? "video" : "square"} />
              ))}
            </div>
          )}
        </>
      );
    }

    case "Bahra University": {
      const hero = byId("bu-01") || items[0];
      const vidHero = byId("bu-v1");
      const split1 = byId("bu-02");
      const split2 = byId("bu-v2");
      const vid3 = byId("bu-v3");

      return (
        <>
          {/* Legal Studies Hero Feature */}
          {hero && (
            <div className="flow-stage-hero">
              <MediaCard item={hero} variant="hero" priority aspect="landscape" caption="SCHOOL OF LAW & LEGAL STUDIES" />
            </div>
          )}

          {/* Christmas Motion Film */}
          {vidHero && (
            <div className="flow-video-stage">
              <div className="stage-ambient-glow" />
              <MediaCard item={vidHero} variant="feature" aspect="video" caption="CAMPUS CHRISTMAS CELEBRATION FILM" />
            </div>
          )}

          {/* Split: Environmental Health + Holi Ad */}
          {split1 && split2 && (
            <div className="flow-split-row">
              <div className="split-col-wide">
                <MediaCard item={split1} variant="split" aspect="landscape" caption="WORLD ENVIRONMENTAL HEALTH DAY" />
              </div>
              <div className="split-col-narrow">
                <MediaCard item={split2} variant="split" aspect="video" caption="CAMPUS HOLI AD" />
              </div>
            </div>
          )}

          {/* HGPI Christmas Motion Feature */}
          {vid3 && (
            <div className="flow-video-stage">
              <MediaCard item={vid3} variant="feature" aspect="video" caption="HGPI FESTIVAL REEL / MOTION" />
            </div>
          )}
        </>
      );
    }

    case "Havells": {
      const hero = byId("hv-01") || items[0];
      return (
        <div className="flow-havells-centerpiece">
          {hero && (
            <div className="flow-stage-hero">
              <MediaCard item={hero} variant="hero" priority aspect="landscape" caption="CONSUMER CAMPAIGN / HAPPINESS 5 LAKH CAROUSEL" />
            </div>
          )}
        </div>
      );
    }

    case "Humsafar": {
      const hero = byId("hu-06") || items[0];
      const portrait = byId("hu-08");
      const midHero = byId("hu-07");
      const fleetPair = [byId("hu-03"), byId("hu-01")].filter(Boolean) as MediaItem[];
      const campaignTrio = [byId("hu-02"), byId("hu-04"), byId("hu-05")].filter(Boolean) as MediaItem[];
      const stagedIds = new Set([
        hero?.id,
        portrait?.id,
        midHero?.id,
        ...fleetPair.map((m) => m.id),
        ...campaignTrio.map((m) => m.id),
      ]);
      const rest = items.filter((m) => !stagedIds.has(m.id));

      return (
        <>
          {/* Panoramic Route Network Hero */}
          {hero && (
            <div className="flow-stage-hero">
              <MediaCard
                item={hero}
                variant="hero"
                priority
                aspect="landscape"
                caption="ROUTE NETWORK CAMPAIGN / AURANGABAD TO PUNE"
              />
            </div>
          )}

          {/* Offset Portrait with Regional Identity Editorial Framing */}
          {portrait && (
            <div className="flow-portrait-offset">
              <div className="portrait-offset-card">
                <MediaCard
                  item={portrait}
                  variant="portrait"
                  aspect="portrait"
                  caption="पधारो म्हारे देश / JODHPUR WELCOME"
                />
              </div>
              <div className="portrait-editorial-notes">
                <span className="notes-label">REGIONAL IDENTITY</span>
                <h4>CONNECTING ROUTES WITH REGIONAL SOUL.</h4>
                <p>
                  Rooted in Indian cities, drop points, and cultural landmarks, combining regional
                  typography with modern transit design.
                </p>
              </div>
            </div>
          )}

          {/* Inter-State Highway Corridor Panorama */}
          {midHero && (
            <div className="flow-stage-hero">
              <MediaCard
                item={midHero}
                variant="feature"
                aspect="landscape"
                caption="NEW ROUTE CAMPAIGN / CHH. SAMBHAJINAGAR TO JODHPUR"
              />
            </div>
          )}

          {/* Travel Fleet & Destination Pair (Equal 3:4 Proportions) */}
          {fleetPair.length > 0 && (
            <div className="flow-horizontal-grid grid-2">
              {fleetPair.map((m) => (
                <MediaCard
                  key={m.id}
                  item={m}
                  variant="grid"
                  aspect="portrait"
                  caption={
                    m.id === "hu-03"
                      ? "TRAVEL FLEET CAMPAIGN / RAJKOT ROUTE"
                      : "DESTINATION ROUTE / HELLO HUBLI"
                  }
                />
              ))}
            </div>
          )}

          {/* Destination & Pop Culture Campaign Trio (Equal 3:4 Proportions) */}
          {campaignTrio.length > 0 && (
            <div className="flow-horizontal-grid grid-3">
              {campaignTrio.map((m) => (
                <MediaCard
                  key={m.id}
                  item={m}
                  variant="grid"
                  aspect="portrait"
                  caption={
                    m.id === "hu-02"
                      ? "REGIONAL AD / UDAIPUR ROUTE"
                      : m.id === "hu-04"
                      ? "INTERACTIVE AD / FIFA THEMED CAMPAIGN"
                      : "POP CULTURE POST / BANGALORE'S HERO"
                  }
                />
              ))}
            </div>
          )}

          {/* Any remaining items */}
          {rest.length > 0 && (
            <div className="flow-horizontal-grid grid-3">
              {rest.map((m) => (
                <MediaCard key={m.id} item={m} variant="grid" aspect="portrait" />
              ))}
            </div>
          )}
        </>
      );
    }

    case "Hospitality": {
      const poolHero = byId("ho-01") || items[0];
      const vidHero = byId("ho-v4");
      const split1 = byId("ho-03");
      const split2 = byId("ho-v1");
      const portrait = byId("ho-02");
      const vidMid = byId("ho-v3");
      const usedIds = new Set([poolHero?.id, vidHero?.id, split1?.id, split2?.id, portrait?.id, vidMid?.id]);
      const rest = items.filter((m) => !usedIds.has(m.id));

      return (
        <>
          {/* Signature Poolside Hero */}
          {poolHero && (
            <div className="flow-stage-hero">
              <MediaCard item={poolHero} variant="hero" priority aspect="landscape" caption="POOLSIDE LEISURE / PROPERTY EDITORIAL" />
            </div>
          )}

          {/* Concours Reel Motion Stage */}
          {vidHero && (
            <div className="flow-video-stage">
              <div className="stage-ambient-glow" />
              <MediaCard item={vidHero} variant="feature" aspect="video" caption="CONCOURS PROPERTY REEL / LIFESTYLE" />
            </div>
          )}

          {/* Split: Staycation Still + Video 1 */}
          {split1 && split2 && (
            <div className="flow-split-row">
              <div className="split-col-wide">
                <MediaCard item={split1} variant="split" aspect="landscape" caption="WEEKEND STAYCATION CAMPAIGN" />
              </div>
              <div className="split-col-narrow">
                <MediaCard item={split2} variant="split" aspect="video" caption="LIFESTYLE REEL / AMBIENCE" />
              </div>
            </div>
          )}

          {/* Offset Portrait: 9th July Still */}
          {portrait && (
            <div className="flow-portrait-offset">
              <div className="portrait-offset-card">
                <MediaCard item={portrait} variant="portrait" aspect="portrait" caption="PROPERTY DETAIL PHOTOGRAPHY" />
              </div>
              <div className="portrait-editorial-notes">
                <span className="notes-label">RESORT ATMOSPHERE</span>
                <h4>SPACES DESIGNED TO BE INHABITED SLOWLY.</h4>
                <p>
                  Visual direction prioritizing warmth, natural daylight, texture, and relaxed luxury.
                </p>
              </div>
            </div>
          )}

          {/* Motion Feature */}
          {vidMid && (
            <div className="flow-video-stage">
              <MediaCard item={vidMid} variant="feature" aspect="video" caption="SUMMER CAMPAIGN REEL / MOTION" />
            </div>
          )}

          {/* Remaining Hospitality Stills & Films Grid */}
          {rest.length > 0 && (
            <div className="flow-editorial-grid grid-3">
              {rest.map((m) => (
                <MediaCard key={m.id} item={m} variant="grid" aspect={m.type === "video" ? "video" : "landscape"} />
              ))}
            </div>
          )}
        </>
      );
    }

    default:
      return (
        <div className="flow-editorial-grid grid-2">
          {items.map((m) => (
            <MediaCard key={m.id} item={m} variant="grid" />
          ))}
        </div>
      );
  }
}

/* ═══════════════════════════════════════════
   PHASE 2.1: Project Exhibition Chapter Component
   - Seamless flow directly into creative work
   - No redundant NEXT CHAPTER cards
   - Art-directed chapter transition styling
   ═══════════════════════════════════════════ */
function ProjectSection({
  project,
  index,
  totalCount,
  isLast,
}: {
  key?: React.Key;
  project: string;
  index: number;
  totalCount: number;
  isLast: boolean;
}) {
  const items = useMemo(() => media.filter((x) => x.project === project), [project]);
  const pMeta = meta[project];
  if (!items.length || !pMeta) return null;

  return (
    <section
      id={`project-${slug(project)}`}
      className={`project-chapter project-${slug(project)} trans-${slug(project)}`}
      style={{ "--accent": pMeta.accent } as React.CSSProperties}
    >
      <ProjectIntro
        project={project}
        index={index}
        totalCount={totalCount}
        projectMeta={pMeta}
        itemsCount={items.length}
      />

      <div className="project-exhibition-flow">{renderProjectContent(project, items)}</div>

      {isLast ? (
        <div className="exhibition-end-bridge">
          <div className="bridge-rule" />
          <div className="bridge-content">
            <span className="bridge-meta">END OF SELECTED WORK // 0{totalCount} PROJECTS</span>
            <button
              className="bridge-link"
              onClick={() => scrollToId("process")}
              data-cursor="EXPLORE"
            >
              CONTINUE TO IDEA LAB ↓
            </button>
          </div>
        </div>
      ) : (
        <div className="chapter-end-line" />
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════
   Process: Idea Lab (Clearly labeled reconstructed studies)
   ═══════════════════════════════════════════ */
function Process() {
  const studies = [
    {
      brand: "Trident Group",
      title: "TACTILE PACKAGING & TEXTILE IDENTITY",
      step: "01",
      steps: ["THE IDEA: Tactile sustainability", "VISUAL EXPLORATION: Earth tones & raw pulp", "DESIGN SYSTEM: Heavy grid & minimal typography", "MOTION: Fluid unravelling lines"],
    },
    {
      brand: "Halonix",
      title: "HIGH-CONTRAST ILLUMINATION CAMPAIGNS",
      step: "02",
      steps: ["THE IDEA: Light as drama", "VISUAL EXPLORATION: Deep black vs bright amber", "DESIGN SYSTEM: Radiant highlights", "MOTION: Pulsing light transitions"],
    },
    {
      brand: "Standard Electricals",
      title: "PRECISION MOTION FOR CONSUMER APPLIANCES",
      step: "03",
      steps: ["THE IDEA: Geometry meets function", "VISUAL EXPLORATION: Technical wireframes", "DESIGN SYSTEM: Clean Swiss rules", "MOTION: Linear mechanical camera tracking"],
    },
  ];

  return (
    <section className="process" id="process">
      <div className="section-eyebrow">
        <span>02 / IDEA LAB</span>
        <span>RECONSTRUCTED VISUAL STUDIES</span>
      </div>

      <div className="process-intro">
        <h2>
          FROM THOUGHT
          <br />
          <em>TO FRAME.</em>
        </h2>
        <p>
          These studies reconstruct the creative thinking and design process around selected briefs.
          They are labelled explicitly as concept reconstructions.
        </p>
      </div>

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
    </section>
  );
}

/* ═══════════════════════════════════════════
   Info: About Anuj
   ═══════════════════════════════════════════ */
function Info() {
  return (
    <section className="info" id="info">
      <div className="section-eyebrow">
        <span>03 / INFO</span>
        <span>ABOUT THE PERSON BEHIND THE WORK</span>
      </div>

      <div className="info-hero">
        <h2>
          I'M JUST A KID
          <br />
          WITH AN
          <br />
          <em>IMAGINATION.</em>
        </h2>
        <p>
          I'm happy taking on things I've never done before. Give me a problem, a blank canvas, or
          something slightly ridiculous. I'll figure out where to take it.
        </p>
      </div>

      <div className="info-grid">
        <div>
          <span>WHAT I DO</span>
          <b>
            Brand campaigns
            <br />
            Social design
            <br />
            Motion design
            <br />
            Visual storytelling
            <br />
            AI-assisted exploration
          </b>
        </div>
        <div>
          <span>TOOLS</span>
          <b>
            Photoshop
            <br />
            Illustrator
            <br />
            After Effects
            <br />
            Figma
            <br />
            AI visual tools
          </b>
        </div>
        <div>
          <span>EXPERIENCE</span>
          <b>
            May 2024 — Feb 2025
            <br />
            Horizon Visuals
            <br />
            <br />
            Feb 2025 — Present
            <br />
            Xanadu Brands
          </b>
        </div>
        <div>
          <span>THE ATTITUDE</span>
          <b>
            Bring it on.
            <br />
            Whatever you have.
          </b>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   Contact
   ═══════════════════════════════════════════ */
function Contact() {
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="contact" id="contact">
      <div className="section-eyebrow">
        <span>04 / CONTACT</span>
        <span>LET'S MAKE SOMETHING WORTH LOOKING AT</span>
      </div>

      <div className="contact-layout">
        <div>
          <h2>
            HAVE SOMETHING
            <br />
            <em>interesting?</em>
          </h2>
          <p>Bring the brief, the half-formed idea, or the completely strange one.</p>
        </div>

        {sent ? (
          <div className="sent">
            <span>MESSAGE RECEIVED.</span>
            <b>I'll get back to you soon.</b>
            <button onClick={() => setSent(false)}>SEND ANOTHER ↗</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label>
              <span>NAME</span>
              <input required name="name" />
            </label>
            <label>
              <span>EMAIL</span>
              <input required type="email" name="email" />
            </label>
            <label className="wide">
              <span>WHAT ARE WE MAKING?</span>
              <input name="subject" />
            </label>
            <label className="wide">
              <span>MESSAGE</span>
              <textarea required name="message" rows={5} />
            </label>
            <button className="send" data-cursor="SEND">
              SEND IT MY WAY ↗
            </button>
          </form>
        )}
      </div>

      <div className="contact-bottom">
        <span>OR REACH OUT DIRECTLY</span>
        <a href="mailto:yashlohia75@gmail.com">yashlohia75@gmail.com</a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   Main Application Architecture
   ═══════════════════════════════════════════ */
function App() {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(projectOrder[0]);

  // Exclude empty projects (Su-Kam with 0 media items) from visible exhibition
  const visibleProjects = useMemo(
    () => projectOrder.filter((p) => media.some((m) => m.project === p)),
    []
  );

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Loader done={!loading} />
      <Cursor />

      <nav className="nav">
        <button data-cursor="TOP" onClick={() => scrollToId("top")}>
          ANUJ®
        </button>
        <div>
          <button data-cursor="WORK" onClick={() => scrollToId("work")}>
            WORK
          </button>
          <button data-cursor="PROCESS" onClick={() => scrollToId("process")}>
            PROCESS
          </button>
          <button data-cursor="INFO" onClick={() => scrollToId("info")}>
            INFO
          </button>
          <button data-cursor="CONTACT" onClick={() => scrollToId("contact")}>
            CONTACT
          </button>
        </div>
      </nav>

      <main>
        <Hero ready={!loading} />

        <WorkIndex
          projects={visibleProjects}
          active={active}
          onPick={setActive}
        />

        {visibleProjects.map((p, i) => (
          <ProjectSection
            key={p}
            project={p}
            index={i}
            totalCount={visibleProjects.length}
            isLast={i === visibleProjects.length - 1}
          />
        ))}

        <Process />
        <Info />
        <Contact />
      </main>

      <footer>
        <span>ANUJ® / CREATIVE SUPERVISOR</span>
        <span>DESIGN / MOTION / VISUAL EXPLORATION</span>
        <span>© 2026</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
