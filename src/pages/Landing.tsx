import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Highlight section — small icon chips
import hlIcon1 from "@/assets/highlights/icon-1.svg";
import hlIcon2 from "@/assets/highlights/icon-2.svg";
import hlIcon3 from "@/assets/highlights/icon-3.svg";
import hlIcon4 from "@/assets/highlights/icon-4.svg";
import hlIcon5 from "@/assets/highlights/icon-5.svg";
import hlIcon6 from "@/assets/highlights/icon-6.svg";
// Highlight section — decorative bottom-right copies
import hlDeco1 from "@/assets/highlights/deco-1.svg";
import hlDeco2 from "@/assets/highlights/deco-2.svg";
import hlDeco3 from "@/assets/highlights/deco-3.svg";
import hlDeco4 from "@/assets/highlights/deco-4.svg";
import hlDeco5 from "@/assets/highlights/deco-5.svg";
import hlDeco6 from "@/assets/highlights/deco-6.svg";

const features = [
  {
    symbol: "♩",
    name: "Intervals",
    description: "Identify the distance between two notes by ear.",
    path: "/exercises/interval",
  },
  {
    symbol: "♫",
    name: "Chords",
    description:
      "Distinguish major, minor, diminished, and extended harmonies.",
    path: "/exercises/chord",
  },
  {
    symbol: "𝄞",
    name: "Melody",
    description:
      "Transcribe short melodic phrases by clicking a piano keyboard.",
    path: "/exercises/melody",
  },
  {
    symbol: "♬",
    name: "Rhythm",
    description:
      "Tap along to rhythmic patterns and build your internal pulse.",
    path: "/exercises/rhythm",
  },
  {
    symbol: "♮",
    name: "Progressions",
    description:
      "Hear chord sequences and identify common harmonic progressions.",
    path: "/exercises/progression",
  },
  {
    symbol: "♪",
    name: "Pitch Match",
    description:
      "Sing into your mic and match the target pitch with real-time feedback.",
    path: "/exercises/pitch-match",
  },
];

// [icon w, icon h, deco w, deco h] — exact pixel sizes from Figma
type Highlight = {
  name: string;
  description: string;
  iconSrc: string;
  iconW: number;
  iconH: number;
  decoSrc: string;
  decoW: number;
  decoH: number;
};

const highlights: Highlight[] = [
  {
    name: "XP & Leveling",
    description:
      "Earn experience points with every session and watch your level grow.",
    iconSrc: hlIcon1,
    iconW: 16,
    iconH: 16,
    decoSrc: hlDeco1,
    decoW: 107,
    decoH: 107,
  },
  {
    name: "Smart Practice",
    description:
      "Spaced repetition surfaces your weak spots so you improve faster.",
    iconSrc: hlIcon2,
    iconW: 17,
    iconH: 18,
    decoSrc: hlDeco2,
    decoW: 112,
    decoH: 120,
  },
  {
    name: "Heat Map",
    description: "Visualize your training activity and keep your streak alive.",
    iconSrc: hlIcon3,
    iconW: 16,
    iconH: 18,
    decoSrc: hlDeco3,
    decoW: 107,
    decoH: 107,
  },
  {
    name: "Mistakes Rundown",
    description:
      "Review exactly what you got wrong after each session to learn from errors.",
    iconSrc: hlIcon4,
    iconW: 16,
    iconH: 18,
    decoSrc: hlDeco4,
    decoW: 107,
    decoH: 107,
  },
  {
    name: "Undo",
    description: "Made a misclick? Undo your last answer and try again.",
    iconSrc: hlIcon5,
    iconW: 14,
    iconH: 13,
    decoSrc: hlDeco5,
    decoW: 107,
    decoH: 71,
  },
  {
    name: "Multiple Instruments",
    description:
      "Train with piano, guitar, triangle, sine, and sawtooth tones.",
    iconSrc: hlIcon6,
    iconW: 16,
    iconH: 18,
    decoSrc: hlDeco6,
    decoW: 107,
    decoH: 107,
  },
];

const steps = [
  {
    n: "01",
    title: "Sign up",
    desc: "Create a free account in seconds. No credit card, no catch.",
  },
  {
    n: "02",
    title: "Choose an exercise",
    desc: "Pick from intervals, chords, melody, rhythm, or vocal pitch at any difficulty.",
  },
  {
    n: "03",
    title: "Track progress",
    desc: "Earn XP, see accuracy heat maps, review mistakes, and level up.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* ── Hero ─────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          background: "var(--bg)",
          overflow: "hidden",
          /* subtle music staff lines */
          backgroundImage: [
            "repeating-linear-gradient(transparent, transparent 47px, rgba(255,255,255,0.03) 47px, rgba(255,255,255,0.03) 48px)",
            "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(212,146,58,0.08) 0%, transparent 100%)",
          ].join(", "),
        }}
      >
        {/* Nav */}
        <nav
          className="landing-nav"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 40px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "24px",
              fontWeight: 600,
              color: "var(--accent)",
              letterSpacing: "0.02em",
            }}
          >
            Pitchlabs
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              to="/login"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                textDecoration: "none",
                padding: "8px 14px",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              Log In
            </Link>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  background: "var(--accent)",
                  color: "#0F0D0B",
                  border: "none",
                  borderRadius: "var(--radius)",
                  padding: "8px 18px",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px var(--accent-glow)",
                  transition: "background 0.15s",
                }}
              >
                Get Started
              </button>
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px 120px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
          >
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(52px, 8vw, 96px)",
                fontWeight: 600,
                color: "var(--text)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                margin: "0 0 4px",
              }}
            >
              Train your{" "}
              <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
                ear.
              </em>
            </h1>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "var(--text-muted)",
                lineHeight: 1.2,
                margin: "0 0 40px",
                letterSpacing: "-0.01em",
              }}
            >
              One note at a time.
            </h2>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              color: "var(--text-muted)",
              lineHeight: 1.8,
              maxWidth: "400px",
              margin: "0 auto 48px",
              letterSpacing: "0.02em",
            }}
          >
            Fast, focused ear training. Build the musical skills that matter
            most.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.28 }}
            className="hero-cta-row"
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  background: "var(--accent)",
                  color: "#0F0D0B",
                  border: "none",
                  borderRadius: "var(--radius)",
                  padding: "13px 32px",
                  cursor: "pointer",
                  boxShadow: "0 4px 24px var(--accent-glow)",
                  transition: "background 0.15s, transform 0.12s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent-bright)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Start for free
              </button>
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  background: "transparent",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "13px 32px",
                  cursor: "pointer",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--text-muted)";
                  e.currentTarget.style.color = "var(--text)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-muted)";
                }}
              >
                Log In
              </button>
            </Link>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-faint)",
              marginTop: "28px",
            }}
          >
            UNLOCK YOUR EAR
          </motion.p>
        </div>
      </div>

      {/* ── Features ─────────────────────────────────────── */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: "56px" }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 600,
                color: "var(--text)",
                letterSpacing: "-0.01em",
                margin: "0 0 12px",
              }}
            >
              Six disciplines. One app.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--text-muted)",
                letterSpacing: "0.03em",
              }}
            >
              Exercises built to develop real musical instinct.
            </p>
          </motion.div>

          <div
            className="disciplines-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1px",
              background: "var(--border)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div
                  style={{
                    background: "var(--bg-surface)",
                    padding: "32px 28px",
                    height: "100%",
                    transition: "background 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "var(--bg-surface-2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "var(--bg-surface)";
                  }}
                >
                  {/* Music symbol */}
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "40px",
                      color: "var(--accent)",
                      lineHeight: 1,
                      marginBottom: "20px",
                      opacity: 0.9,
                    }}
                  >
                    {f.symbol}
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "10px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      fontWeight: 500,
                      marginBottom: "8px",
                    }}
                  >
                    {f.name}
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      lineHeight: 1.75,
                      margin: 0,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Highlights ───────────────────────────────────── */}
      <div style={{ padding: "80px 24px 0", background: "var(--bg)" }}>
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "48px",
          }}
        >
          {/* Split header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="highlights-header"
            style={{
              display: "flex",
              alignItems: "flex-start",
              position: "relative",
              minHeight: "100px",
            }}
          >
            {/* Left: big heading */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 52px)",
                fontWeight: 400,
                color: "var(--text)",
                letterSpacing: "-0.025em",
                lineHeight: 1,
                margin: 0,
                flex: "0 0 auto",
                maxWidth: "60%",
              }}
            >
              More than just
              <br />
              exercises.
            </h2>

            {/* Right: descriptor + divider */}
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "43px",
                maxWidth: "384px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "#D1C5B4",
                  lineHeight: 1.7,
                  margin: 0,
                  letterSpacing: "0.01em",
                }}
              >
                Tools that make your practice smarter and more rewarding.
              </p>
              <div
                style={{
                  width: "96px",
                  height: "1px",
                  opacity: 0.5,
                  background:
                    "linear-gradient(135deg, #E9C176 0%, #C5A059 100%)",
                }}
              />
            </div>
          </motion.div>

          {/* 3×2 bento grid */}
          <div
            className="highlights-bento"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              paddingBottom: "80px",
            }}
          >
            {highlights.map((h, i) => (
              <motion.div
                key={h.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="highlight-card"
                style={{
                  background: "#1C1C1A",
                  border: "1px solid rgba(233,193,118,0.15)",
                  borderRadius: "8px",
                  padding: "32px",
                }}
              >
                {/* Decorative copy — bottom-right, partially clipped, exact Figma sizing */}
                <img
                  alt=""
                  src={h.decoSrc}
                  style={{
                    position: "absolute",
                    bottom: "-40px",
                    right: "-40px",
                    width: `${h.decoW}px`,
                    height: `${h.decoH}px`,
                    display: "block",
                    pointerEvents: "none",
                  }}
                />

                {/* Icon chip */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "#50483F",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <img
                    alt=""
                    src={h.iconSrc}
                    style={{
                      width: `${h.iconW}px`,
                      height: `${h.iconH}px`,
                      display: "block",
                    }}
                  />
                </div>

                {/* Title */}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#E9C176",
                    lineHeight: 1.3,
                    marginTop: "20px",
                    marginBottom: "8px",
                    letterSpacing: "-0.01em",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {h.name}
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "#D1C5B4",
                    lineHeight: 1.75,
                    margin: 0,
                    position: "relative",
                    zIndex: 1,
                    letterSpacing: "0.01em",
                  }}
                >
                  {h.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ─────────────────────────────────── */}
      <div style={{ padding: "80px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: "56px" }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 600,
                color: "var(--text)",
                letterSpacing: "-0.01em",
                margin: "0 0 12px",
              }}
            >
              How it works
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--text-muted)",
                letterSpacing: "0.03em",
              }}
            >
              From zero to training in under a minute.
            </p>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "24px",
                    padding: "28px 0",
                    borderBottom:
                      i < steps.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      color: "var(--text-faint)",
                      paddingTop: "2px",
                      minWidth: "28px",
                    }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "22px",
                        fontWeight: 600,
                        color: "var(--text)",
                        marginBottom: "6px",
                      }}
                    >
                      {s.title}
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        margin: 0,
                        lineHeight: 1.75,
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer CTA ───────────────────────────────────── */}
      <div
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border)",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 52px)",
              fontStyle: "italic",
              fontWeight: 600,
              color: "var(--text)",
              letterSpacing: "-0.01em",
              margin: "0 0 16px",
            }}
          >
            Ready to sharpen your ears?
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--text-muted)",
              marginBottom: "36px",
              letterSpacing: "0.02em",
            }}
          >
            Join musicians building better instincts every day.
          </p>
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 600,
                background: "var(--accent)",
                color: "#0F0D0B",
                border: "none",
                borderRadius: "var(--radius)",
                padding: "14px 40px",
                cursor: "pointer",
                boxShadow: "0 4px 24px var(--accent-glow)",
                transition: "background 0.15s, transform 0.12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-bright)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Start for free
            </button>
          </Link>
        </motion.div>

        {/* Footer note */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            letterSpacing: "0.06em",
            color: "var(--text-faint)",
            marginTop: "48px",
          }}
        >
          Pitchlabs — ear training.
        </p>
      </div>
    </div>
  );
}
