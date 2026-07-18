import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/**
 * MERIDIAN & CO. — Luxury real estate site
 * Framer Motion port of the blueprint/architectural-survey concept.
 *
 * Setup:
 *   npm install framer-motion lucide-react
 *   Tailwind config needs the custom colors + fonts below (see tailwind.config.js
 *   and index.css in this delivery). Fonts: Fraunces, Inter, JetBrains Mono (Google Fonts).
 */

// ---------------------------------------------------------------------------
// Shared motion variants
// ---------------------------------------------------------------------------

const easeOut = [0.16, 0.8, 0.28, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 46 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: easeOut } },
};

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const lineReveal = {
  hidden: { opacity: 0, y: "110%" },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: easeOut } },
};

// ---------------------------------------------------------------------------
// Custom crosshair cursor — follows pointer with spring physics
// ---------------------------------------------------------------------------

function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 30, stiffness: 400, mass: 0.4 });
  const springY = useSpring(y, { damping: 30, stiffness: 400, mass: 0.4 });
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-cursor-grow]");
    const grow = () => setGrown(true);
    const shrink = () => setGrown(false);
    targets.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });
    return () => {
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full border border-brass-bright mix-blend-difference hidden md:block"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: grown ? 64 : 22, height: grown ? 64 : 22, backgroundColor: grown ? "rgba(166,129,60,0.12)" : "rgba(0,0,0,0)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    />
  );
}

// ---------------------------------------------------------------------------
// Magnetic button — nudges toward the cursor within its bounds
// ---------------------------------------------------------------------------

function MagneticButton({ children, className = "", onClick, href }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18 });
  const springY = useSpring(y, { stiffness: 200, damping: 18 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.35);
    y.set(relY * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = href ? motion.a : motion.button;

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      data-cursor-grow
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      whileHover="hover"
      initial="rest"
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/20 px-8 py-4 text-xs uppercase tracking-[0.14em] text-bone ${className}`}
    >
      <motion.span
        variants={{ rest: { y: "101%" }, hover: { y: "0%" } }}
        transition={{ duration: 0.45, ease: easeOut }}
        className="absolute inset-0 bg-brass-bright -z-10"
      />
      <span className="transition-colors duration-300 group-hover:text-ink">{children}</span>
      <motion.span
        variants={{ rest: { x: 0 }, hover: { x: 4 } }}
        transition={{ duration: 0.3 }}
        className="transition-colors duration-300 group-hover:text-ink"
      >
        <ArrowRight size={14} />
      </motion.span>
    </Tag>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <section className="relative flex h-screen min-h-[640px] flex-col items-center justify-center overflow-hidden px-6">
      {/* blueprint grid, fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, delay: 0.3 }}
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(237,230,216,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(237,230,216,0.14) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 45%, black 20%, transparent 78%)",
        }}
      />

      {/* elevation line-art, self-draws via pathLength */}
      <svg
        viewBox="0 0 1200 260"
        className="absolute bottom-0 left-1/2 z-[1] w-[min(1400px,150vw)] -translate-x-1/2 opacity-90"
      >
        {[
          "M60,240 L60,140 L300,60 L540,140 L540,240",
          "M800,240 L800,160 L900,110 L1000,160 L1000,240",
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="#C9C0AD"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3.2, ease: easeOut, delay: 0.5 }}
          />
        ))}
        <motion.path
          d="M600,240 L600,100 L760,100 L760,240"
          fill="none"
          stroke="#C89A4A"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.2, ease: easeOut, delay: 0.5 }}
        />
      </svg>

      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.9 }}
        className="z-[2] font-mono text-[11px] uppercase tracking-[0.28em] text-brass-bright"
      >
        Architecturally Significant Homes
      </motion.span>

      <h1 className="z-[2] mt-4 text-center font-serif text-[clamp(48px,9vw,128px)] font-normal leading-[0.98] tracking-tight">
        <span className="block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={lineReveal}
            initial="hidden"
            animate="show"
            transition={{ ...lineReveal.show.transition, delay: 1.75 }}
          >
            Property as
          </motion.span>
        </span>
        <span className="block overflow-hidden">
          <motion.span
            className="inline-block font-normal italic text-stone"
            variants={lineReveal}
            initial="hidden"
            animate="show"
            transition={{ ...lineReveal.show.transition, delay: 1.9 }}
          >
            permanent record
          </motion.span>
        </span>
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.15, duration: 0.9 }}
        className="z-[2] mt-6 max-w-[460px] text-center text-[15px] font-light leading-[1.7] text-bone-dim"
      >
        A private collection of homes chosen for their architectural merit — surveyed,
        documented, and offered to those who read a floor plan the way others read a signature.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.35, duration: 0.9 }}
        className="z-[2] mt-11"
      >
        <MagneticButton href="#collection">View the Collection</MagneticButton>
      </motion.div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Property card — SVG elevation draws on scroll into view
// ---------------------------------------------------------------------------

const PROPERTIES = [
  {
    name: "The Kestrel House",
    location: "Big Sur, California — 36.2704° N",
    price: "$18,400,000",
    specs: ["5 BED", "6 BATH", "7,200 SQFT", "EST. 1968"],
    paths: ["M60,260 L60,130 L200,60 L340,130 L340,260"],
    accentPath: "M160,260 L160,180 L240,180 L240,260",
  },
  {
    name: "Casa Meridiana",
    location: "Mallorca, Spain — 39.6953° N",
    price: "€22,100,000",
    specs: ["6 BED", "7 BATH", "9,800 SQFT", "EST. 1932"],
    paths: ["M40,260 L40,150 L360,150 L360,260", "M40,150 L200,70 L360,150"],
    accentPath: "M180,260 L180,190 L240,190 L240,260",
  },
  {
    name: "The Obsidian Pavilion",
    location: "Aspen, Colorado — 39.1911° N",
    price: "$31,750,000",
    specs: ["7 BED", "9 BATH", "12,400 SQFT", "EST. 2011"],
    paths: ["M70,260 L70,90 L190,90 L190,260"],
    accentPath: "M210,260 L210,140 L340,140 L340,260",
  },
  {
    name: "Harbourline Residence",
    location: "Sydney, Australia — 33.8688° S",
    price: "A$27,300,000",
    specs: ["5 BED", "6 BATH", "8,900 SQFT", "EST. 1979"],
    paths: ["M50,260 L50,130 L350,130 L350,260", "M50,130 L200,60 L350,130"],
    accentPath: "M140,260 L140,180 L260,180 L260,260",
  },
];

function PropertyCard({ property }) {
  return (
    <motion.article
      className="flex w-[min(420px,84vw)] flex-none snap-start flex-col border border-white/10 bg-ink-2"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeUp}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10">
        <svg viewBox="0 0 400 300" className="h-full w-full">
          <motion.rect
            x="60" y="120" width="280" height="140"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 1 }}
            fill="rgba(166,129,60,0.08)"
          />
          <line x1="0" y1="260" x2="400" y2="260" stroke="#C9C0AD" strokeWidth="1" />
          {property.paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke="#C9C0AD"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: easeOut }}
            />
          ))}
          <motion.path
            d={property.accentPath}
            fill="none"
            stroke="#C89A4A"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: easeOut, delay: 0.2 }}
          />
        </svg>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <div className="font-serif text-2xl italic">{property.name}</div>
          <div className="text-xs tracking-wide text-stone">{property.location}</div>
        </div>
        <div className="font-mono text-[13px] tracking-wide text-brass-bright">{property.price}</div>
        <div className="mt-auto flex gap-4 border-t border-white/10 pt-4 font-mono text-[11px] text-bone-dim">
          {property.specs.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function Collection() {
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(8);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? Math.max(8, (el.scrollLeft / max) * 100) : 8);
  };

  return (
    <section id="collection" className="mx-auto max-w-[1400px] px-6 py-[140px] md:py-[180px]">
      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mb-20 flex flex-wrap items-end justify-between gap-10"
      >
        <div>
          <motion.span variants={fadeUp} className="mb-5 block font-mono text-[11px] uppercase tracking-[0.26em] text-brass-bright">
            Collection — Fourteen Addresses
          </motion.span>
          <motion.h2 variants={fadeUp} className="max-w-[640px] font-serif text-[clamp(34px,4.4vw,60px)] leading-[1.05]">
            Each listing drawn <em className="font-light italic text-stone">before</em> it is described.
          </motion.h2>
        </div>
        <motion.p variants={fadeUp} className="max-w-[280px] text-sm leading-[1.75] text-bone-dim">
          We survey a property in elevation before we photograph it. What follows is the line, then the light.
        </motion.p>
      </motion.div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex gap-0.5 overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
      >
        {PROPERTIES.map((p) => (
          <PropertyCard key={p.name} property={p} />
        ))}
      </div>

      <div className="relative mt-2 h-px bg-white/10">
        <motion.div
          className="absolute left-0 top-0 h-px bg-brass-bright"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Stats strip
// ---------------------------------------------------------------------------

function StatsStrip() {
  const stats = [
    { num: "14", label: "Homes Held" },
    { num: "6", label: "Countries Surveyed" },
    { num: "31", label: "Yrs. Avg. Provenance" },
    { num: "100%", label: "Private Transaction" },
  ];
  return (
    <motion.section
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className="mx-auto grid max-w-[1400px] grid-cols-2 border-y border-white/10 md:grid-cols-4"
    >
      {stats.map((s, i) => (
        <motion.div key={s.label} variants={fadeUp} className={`p-10 ${i !== 0 ? "border-l border-white/10" : ""}`}>
          <div className="font-serif text-4xl text-brass-bright">{s.num}</div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-stone">{s.label}</div>
        </motion.div>
      ))}
    </motion.section>
  );
}

// ---------------------------------------------------------------------------
// Philosophy / pull quote — parallax on scroll
// ---------------------------------------------------------------------------

function Philosophy() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="mx-auto max-w-[1400px] px-6 py-[140px] text-center md:py-[180px]">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-8 block font-mono text-[11px] uppercase tracking-[0.26em] text-brass-bright"
      >
        Philosophy
      </motion.span>
      <motion.blockquote
        style={{ y }}
        initial={{ opacity: 0, y: 46 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: easeOut }}
        className="mx-auto max-w-[1000px] font-serif text-[clamp(28px,4.6vw,54px)] italic leading-[1.28]"
      >
        We do not list houses. <span className="text-stone">We hold the record of a place —</span> its
        light at four in the afternoon, the grain of its stone,{" "}
        <span className="text-stone">the hand that drew its first line.</span>
      </motion.blockquote>
      <cite className="mt-9 block font-mono text-[11px] not-italic uppercase tracking-[0.2em] text-stone">
        — Founding Note, Meridian &amp; Co., 1994
      </cite>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Process
// ---------------------------------------------------------------------------

const STEPS = [
  { mark: "01", title: "Survey", text: "An architect, not an agent, walks the property first. We draw before we describe." },
  { mark: "02", title: "Provenance", text: "We trace ownership, materials, and any notable design lineage back to the original build." },
  { mark: "03", title: "Private Offer", text: "The home is presented to a small circle before any public listing is considered." },
  { mark: "04", title: "Close", text: "One point of contact from first walkthrough to final signature." },
];

function Process() {
  return (
    <section id="process" className="mx-auto max-w-[1400px] px-6 py-[140px] md:py-[180px]">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={staggerParent}
        className="mb-20"
      >
        <motion.span variants={fadeUp} className="mb-5 block font-mono text-[11px] uppercase tracking-[0.26em] text-brass-bright">
          Process
        </motion.span>
        <motion.h2 variants={fadeUp} className="max-w-[640px] font-serif text-[clamp(34px,4.4vw,60px)] leading-[1.05]">
          How a home <em className="font-light italic text-stone">enters</em> the collection.
        </motion.h2>
      </motion.div>

      <div className="flex flex-col">
        {STEPS.map((s) => (
          <motion.div
            key={s.mark}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: easeOut }}
            className="grid grid-cols-1 gap-3 border-t border-white/10 py-11 last:border-b md:grid-cols-[120px_1fr_1fr] md:gap-8"
          >
            <div className="font-mono text-xs text-brass-bright">{s.mark}</div>
            <div className="font-serif text-2xl">{s.title}</div>
            <div className="max-w-[420px] text-sm leading-[1.75] text-bone-dim">{s.text}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

function FloatingField({ id, label, textarea }) {
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);
  const floated = focused || filled;
  const Tag = textarea ? "textarea" : "input";

  return (
    <div className="relative border-b border-white/10 py-5">
      <Tag
        id={id}
        rows={textarea ? 2 : undefined}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          setFilled(e.target.value.trim() !== "");
        }}
        className="w-full resize-none bg-transparent font-sans text-base font-light text-bone outline-none"
      />
      <motion.label
        htmlFor={id}
        animate={{ y: floated ? -16 : 0, scale: floated ? 0.7 : 1, color: floated ? "#C89A4A" : "#8B8371" }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute left-0 top-5 origin-left text-base font-light"
      >
        {label}
      </motion.label>
    </div>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    setSent(true);
    setTimeout(() => setSent(false), 2400);
  };

  return (
    <section id="contact" className="mx-auto max-w-[1400px] px-6 py-[140px] md:py-[180px]">
      <div className="grid grid-cols-1 items-end gap-16 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
        <motion.div initial={{ opacity: 0, y: 46 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          <span className="mb-5 block font-mono text-[11px] uppercase tracking-[0.26em] text-brass-bright">Enquire</span>
          <h2 className="mb-12 max-w-[640px] font-serif text-[clamp(34px,4.4vw,60px)] leading-[1.05]">
            Begin with a conversation, <em className="font-light italic text-stone">not a listing.</em>
          </h2>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
            <FloatingField id="f-name" label="Full name" />
            <FloatingField id="f-email" label="Email address" />
            <FloatingField id="f-msg" label="What are you searching for?" textarea />
            <div className="mt-9 self-start">
              <MagneticButton onClick={handleSubmit}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={sent ? "sent" : "send"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {sent ? "Enquiry Received ✓" : "Send Enquiry"}
                  </motion.span>
                </AnimatePresence>
              </MagneticButton>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 46 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15 }}
          className="text-sm leading-[2] text-bone-dim"
        >
          <p>
            MERIDIAN &amp; CO.
            <br />
            Private Sales Office
          </p>
          <p className="mt-5">
            By appointment only
            <br />
            <a href="mailto:survey@meridian.co" className="border-b border-white/20 text-bone hover:border-brass-bright hover:text-brass-bright">
              survey@meridian.co
            </a>
            <br />
            <a href="tel:+12125550142" className="border-b border-white/20 text-bone hover:border-brass-bright hover:text-brass-bright">
              +1 212 555 0142
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Nav + Footer
// ---------------------------------------------------------------------------

function Nav() {
  const links = [
    ["Collection", "#collection"],
    ["Philosophy", "#philosophy"],
    ["Process", "#process"],
    ["Enquire", "#contact"],
  ];
  return (
    <header className="fixed left-0 right-0 top-0 z-[600] mix-blend-difference">
      <div className="flex items-center justify-between px-8 py-9 md:px-12">
        <div className="font-serif text-xl">
          MERIDIAN <em className="italic text-brass-bright">&amp;</em> CO.
        </div>
        <nav className="hidden gap-10 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              data-cursor-grow
              className="group relative text-xs uppercase tracking-[0.14em] text-bone"
            >
              {label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brass-bright transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-white/10 px-8 py-10 font-mono text-[10px] uppercase tracking-wide text-stone md:px-12">
      <span>© Meridian &amp; Co. — All Surveys Private</span>
      <span className="hidden md:inline">New York — London — Lisbon</span>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function MeridianEstates() {
  return (
    <div className="min-h-screen bg-ink font-sans font-light text-bone selection:bg-brass-bright selection:text-ink">
      <CustomCursor />
      <Nav />
      <Hero />
      <Collection />
      <StatsStrip />
      <Philosophy />
      <Process />
      <Contact />
      <Footer />
    </div>
  );
}
