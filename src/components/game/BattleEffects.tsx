import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- Debris Particles ---------- */
export const DebrisField = ({ active, side, intensity = 1 }: { active: boolean; side: "left" | "right"; intensity?: number }) => {
  const debris = useMemo(() => Array.from({ length: Math.floor(24 * intensity) }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 280 * intensity,
    y: -Math.random() * 220 - 20,
    size: Math.random() * 10 + 2,
    rotation: Math.random() * 720 - 360,
    delay: Math.random() * 0.3,
    type: Math.random() > 0.5 ? "metal" : Math.random() > 0.5 ? "spark" : "ember",
  })), [intensity]);

  return (
    <AnimatePresence>
      {active && (
        <div className={`absolute z-40 ${side === "left" ? "left-[20%]" : "right-[20%]"} top-1/2`}>
          {debris.map(d => (
            <motion.div
              key={d.id}
              className="absolute"
              style={{
                width: d.size,
                height: d.type === "metal" ? d.size * 0.4 : d.size,
                background: d.type === "metal"
                  ? "linear-gradient(135deg, hsl(220 20% 45%), hsl(220 15% 65%))"
                  : d.type === "ember"
                    ? "hsl(30 100% 55%)"
                    : side === "left" ? "hsl(25 95% 55%)" : "hsl(195 100% 50%)",
                borderRadius: d.type === "metal" ? "1px" : "50%",
                boxShadow: d.type !== "metal"
                  ? `0 0 ${d.size + 4}px ${d.type === "ember" ? "hsl(30 100% 55%)" : side === "left" ? "hsl(25 95% 55%)" : "hsl(195 100% 50%)"}`
                  : "none",
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              animate={{
                x: d.x,
                y: d.y + 350,
                opacity: [1, 1, 0],
                scale: [1, 0.8, 0.2],
                rotate: d.rotation,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, delay: d.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

/* ---------- Shockwave Ring ---------- */
export const ShockwaveRing = ({ active, side, color }: { active: boolean; side: "left" | "right"; color: "cyan" | "orange" }) => (
  <AnimatePresence>
    {active && (
      <>
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={`shock-${i}`}
            className={`absolute z-30 rounded-full ${side === "left" ? "left-[18%]" : "right-[18%]"} top-1/2 -translate-y-1/2 -translate-x-1/2`}
            style={{
              width: 40,
              height: 40,
              border: `${2 - i * 0.3}px solid ${color === "cyan" ? "hsl(195 100% 50%)" : "hsl(25 95% 55%)"}`,
              boxShadow: `0 0 ${20 + i * 8}px ${color === "cyan" ? "hsl(195 100% 50% / 0.4)" : "hsl(25 95% 55% / 0.4)"}`,
            }}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 5 + i * 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: "easeOut" }}
          />
        ))}
      </>
    )}
  </AnimatePresence>
);

/* ---------- Ground Crack Effect ---------- */
export const GroundCrack = ({ active, side }: { active: boolean; side: "left" | "right" }) => (
  <AnimatePresence>
    {active && (
      <motion.svg
        className={`absolute bottom-0 z-20 ${side === "left" ? "left-[8%]" : "right-[8%]"}`}
        width="160" height="50" viewBox="0 0 160 50"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: [0, 0.8, 0.5], scaleX: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformOrigin: side === "left" ? "left center" : "right center" }}
      >
        <path d="M80 0 L74 14 L60 18 L66 28 L52 38 L45 50" stroke="hsl(195 100% 50% / 0.5)" strokeWidth="2" fill="none" />
        <path d="M80 0 L86 12 L94 20 L108 26 L100 36 L115 50" stroke="hsl(195 100% 50% / 0.35)" strokeWidth="1.5" fill="none" />
        <path d="M80 0 L78 10 L68 22 L76 34 L70 50" stroke="hsl(195 100% 50% / 0.6)" strokeWidth="2.5" fill="none" />
        {/* Glowing fracture core */}
        <motion.circle cx="80" cy="0" r="3" fill="hsl(195 100% 60%)" opacity="0.6"
          animate={{ r: [2, 5, 2], opacity: [0.4, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 0.6 }} />
      </motion.svg>
    )}
  </AnimatePresence>
);

/* ---------- Smoke Cloud ---------- */
export const SmokeCloud = ({ active, side }: { active: boolean; side: "left" | "right" }) => {
  const clouds = useMemo(() => Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 100,
    y: -(Math.random() * 80 + 10),
    size: Math.random() * 50 + 25,
    delay: Math.random() * 0.2,
  })), []);

  return (
    <AnimatePresence>
      {active && (
        <div className={`absolute z-25 ${side === "left" ? "left-[18%]" : "right-[18%]"} top-1/2`}>
          {clouds.map(c => (
            <motion.div
              key={c.id}
              className="absolute rounded-full"
              style={{
                width: c.size,
                height: c.size,
                background: "radial-gradient(circle, hsl(220 20% 30% / 0.7), transparent)",
                filter: "blur(10px)",
              }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
              animate={{ x: c.x, y: c.y, opacity: [0, 0.6, 0], scale: [0.3, 1.8, 2.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, delay: c.delay }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

/* ---------- Energy Shield ---------- */
export const EnergyShield = ({ active, variant }: { active: boolean; variant: "player" | "ai" }) => {
  const color = variant === "player" ? "hsl(195 100% 50%)" : "hsl(25 95% 55%)";
  const side = variant === "player" ? "left-[15%]" : "right-[15%]";

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className={`absolute ${side} top-1/2 -translate-y-1/2 z-25 pointer-events-none`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ opacity: { repeat: Infinity, duration: 1.5 }, scale: { duration: 0.3 } }}
        >
          <svg width="100" height="160" viewBox="0 0 100 160">
            <defs>
              <radialGradient id={`shield-${variant}`} cx="50%" cy="50%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="70%" stopColor={`${color}`} stopOpacity="0.05" />
                <stop offset="90%" stopColor={`${color}`} stopOpacity="0.2" />
                <stop offset="100%" stopColor={`${color}`} stopOpacity="0.4" />
              </radialGradient>
            </defs>
            <ellipse cx="50" cy="80" rx="45" ry="75" fill={`url(#shield-${variant})`}
              stroke={color} strokeWidth="1.5" strokeDasharray="8 4" opacity="0.6" />
            {[0, 1, 2, 3, 4].map(i => (
              <motion.polygon
                key={i}
                points="50,20 60,30 60,42 50,52 40,42 40,30"
                fill="none" stroke={color} strokeWidth="0.5" opacity="0.2"
                style={{ transform: `translate(${(i - 2) * 18}px, ${Math.abs(i - 2) * 15 + 20}px)` }}
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
              />
            ))}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------- Weapon Charge Effect ---------- */
export const WeaponCharge = ({ active, side }: { active: boolean; side: "left" | "right" }) => {
  const color = side === "left" ? "hsl(195 100% 50%)" : "hsl(25 95% 55%)";
  const position = side === "left" ? "left-[20%]" : "right-[20%]";

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className={`absolute ${position} top-1/2 -translate-y-1/2 z-35 pointer-events-none`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            const radius = 60;
            return (
              <motion.div key={i} className="absolute rounded-full"
                style={{ width: 5, height: 5, background: color, boxShadow: `0 0 10px ${color}` }}
                initial={{ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: [0, 1, 0.8] }}
                transition={{ duration: 0.6, delay: i * 0.025, ease: "easeIn" }} />
            );
          })}
          {/* Central charge glow */}
          <motion.div className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: 24, height: 24, background: color, filter: "blur(10px)" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2, 1.2], opacity: [0, 0.9, 0.7] }}
            transition={{ duration: 0.5, delay: 0.25 }} />
          {/* Electric arcs */}
          <motion.svg width="80" height="80" viewBox="-40 -40 80 80" className="absolute -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0.3, 0.7, 0.4] }}
            transition={{ duration: 0.5, delay: 0.15 }}>
            {[0, 1, 2, 3].map(i => {
              const a = (i / 4) * Math.PI * 2;
              const r = 20;
              return (
                <motion.line key={i} x1={0} y1={0}
                  x2={Math.cos(a) * r} y2={Math.sin(a) * r}
                  stroke={color} strokeWidth="1" opacity="0.6"
                  animate={{ x2: [Math.cos(a) * r, Math.cos(a + 0.3) * r * 1.2, Math.cos(a) * r] }}
                  transition={{ repeat: Infinity, duration: 0.15 }} />
              );
            })}
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------- Explosion Flash ---------- */
export const ExplosionFlash = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div className="absolute inset-0 z-50 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 50%, hsl(25 95% 55% / 0.4), hsl(45 100% 60% / 0.1) 40%, transparent 70%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }} />
    )}
  </AnimatePresence>
);

/* ---------- Heat Distortion Overlay ---------- */
export const HeatDistortion = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div className="absolute inset-0 z-45 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, hsl(25 95% 55% / 0.03) 2px, transparent 4px)",
          filter: "blur(0.5px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0], y: [0, -25, -50] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }} />
    )}
  </AnimatePresence>
);

/* ---------- Dust Impact ---------- */
export const DustImpact = ({ active, side }: { active: boolean; side: "left" | "right" }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        className={`absolute bottom-0 z-20 ${side === "left" ? "left-[10%]" : "right-[10%]"}`}
        style={{ width: 160, height: 40 }}
      >
        {[0, 1, 2, 3].map(i => (
          <motion.div key={i} className="absolute bottom-0 rounded-full"
            style={{
              width: 60 + i * 20, height: 12 + i * 5,
              background: "radial-gradient(ellipse, hsl(30 20% 30% / 0.5), transparent)",
              filter: "blur(5px)", left: `${(i - 1.5) * 14}px`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.8, 2.5], opacity: [0, 0.7, 0], y: [0, -12, -30] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, delay: i * 0.04 }} />
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

/* ---------- Plasma Trail (energy beam trail) ---------- */
export const PlasmaTrail = ({ active, direction }: { active: boolean; direction: "left-to-right" | "right-to-left" }) => (
  <AnimatePresence>
    {active && (
      <div className={`absolute top-1/2 -translate-y-1/2 z-34 pointer-events-none`}
        style={{ [direction === "left-to-right" ? "left" : "right"]: "25%", width: "50%", height: "40px" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{
              width: 4 + Math.random() * 6,
              height: 4 + Math.random() * 6,
              background: direction === "left-to-right" ? "hsl(195 100% 60%)" : "hsl(25 95% 65%)",
              boxShadow: `0 0 8px ${direction === "left-to-right" ? "hsl(195 100% 50%)" : "hsl(25 95% 55%)"}`,
              top: `${40 + (Math.random() - 0.5) * 30}%`,
              left: direction === "left-to-right" ? `${i * 8}%` : undefined,
              right: direction === "right-to-left" ? `${i * 8}%` : undefined,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0, 1.5, 0], y: (Math.random() - 0.5) * 20 }}
            transition={{ duration: 0.6, delay: i * 0.03 + 0.15 }} />
        ))}
      </div>
    )}
  </AnimatePresence>
);

/* ---------- Cinematic Kill Cam Overlay ---------- */
export const KillCamOverlay = ({ active, winner }: { active: boolean; winner: "player" | "ai" }) => {
  const color = winner === "player" ? "hsl(195 100% 50%)" : "hsl(25 95% 55%)";
  return (
    <AnimatePresence>
      {active && (
        <motion.div className="absolute inset-0 z-[90] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}>
          {/* Dramatic vignette */}
          <motion.div className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 20%, hsl(220 50% 3% / 0.7) 70%, hsl(220 50% 2% / 0.9) 100%)` }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }} />
          {/* Cinematic bars */}
          <motion.div className="absolute top-0 left-0 right-0 bg-black/80"
            initial={{ height: 0 }} animate={{ height: "12%" }} transition={{ duration: 0.4 }} />
          <motion.div className="absolute bottom-0 left-0 right-0 bg-black/80"
            initial={{ height: 0 }} animate={{ height: "12%" }} transition={{ duration: 0.4 }} />
          {/* Radial energy burst */}
          <motion.div className="absolute inset-0"
            style={{ background: `radial-gradient(circle at 50% 50%, ${color.replace(")", " / 0.15)")}, transparent 50%)` }}
            animate={{ scale: [1, 1.8, 1.2], opacity: [0.3, 0.6, 0.2] }}
            transition={{ duration: 1.2 }} />
          {/* Scan line effect */}
          <motion.div className="absolute inset-0"
            style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, hsl(0 0% 100% / 0.02) 3px, hsl(0 0% 100% / 0.02) 4px)" }}
            animate={{ y: [0, 8] }}
            transition={{ repeat: Infinity, duration: 0.3 }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------- Battlefield Degradation ---------- */
export const BattlefieldDamage = ({ intensity }: { intensity: number }) => {
  // intensity 0-1 representing how much the battlefield has degraded
  if (intensity <= 0) return null;

  const crackCount = Math.min(6, Math.floor(intensity * 6));
  const burnCount = Math.min(4, Math.floor(intensity * 4));

  return (
    <div className="absolute inset-0 pointer-events-none z-[5]">
      {/* Persistent cracks */}
      {Array.from({ length: crackCount }).map((_, i) => (
        <motion.svg key={`bcrack-${i}`} className="absolute bottom-0"
          style={{ left: `${10 + i * 15}%` }}
          width="60" height="30" viewBox="0 0 60 30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 + intensity * 0.3 }}
        >
          <path d={`M30 0 L${28 + i * 2} ${8 + i} L${25 - i} ${18 + i * 2} L${22 + i} 30`}
            stroke="hsl(195 100% 50% / 0.2)" strokeWidth="1" fill="none" />
        </motion.svg>
      ))}
      {/* Burn marks / scorch decals */}
      {Array.from({ length: burnCount }).map((_, i) => (
        <motion.div key={`burn-${i}`} className="absolute rounded-full"
          style={{
            width: 30 + i * 10, height: 10 + i * 4,
            background: "radial-gradient(ellipse, hsl(0 0% 10% / 0.3), transparent)",
            bottom: `${3 + i * 2}%`,
            left: `${20 + i * 18}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 + intensity * 0.4 }}
        />
      ))}
      {/* Flickering battlefield lights */}
      {intensity > 0.4 && (
        <>
          <motion.div className="absolute top-0 left-[10%] w-px bg-primary/20"
            style={{ height: "100%" }}
            animate={{ opacity: [0.1, 0.4, 0, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 0.8 + Math.random() }} />
          <motion.div className="absolute top-0 right-[15%] w-px bg-primary/15"
            style={{ height: "100%" }}
            animate={{ opacity: [0.2, 0, 0.3, 0.1, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.2 }} />
        </>
      )}
      {/* Haze overlay at high damage */}
      {intensity > 0.6 && (
        <motion.div className="absolute inset-0"
          style={{ background: "hsl(220 20% 15% / 0.15)", filter: "blur(1px)" }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 }} />
      )}
    </div>
  );
};

/* ---------- ADVANCED 3D EFFECTS ---------- */

/* Chromatic Aberration - RGB channel separation */
export const ChromaticAberration = ({ active, intensity = 1 }: { active: boolean; intensity?: number }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div className="absolute inset-0 z-[60] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: intensity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}>
          {/* Red channel offset */}
          <motion.div className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, hsl(0 80% 50% / 0.15), transparent 30%, transparent 70%, hsl(0 80% 50% / 0.1))",
              boxShadow: "inset 0 0 60px hsl(0 80% 50% / 0.1)",
            }}
            animate={{ x: [6, 0, -8], opacity: [0.3, 0, 0.2] }}
            transition={{ duration: 0.4 }} />
          {/* Green channel offset */}
          <motion.div className="absolute inset-0"
            style={{
              background: "linear-gradient(-90deg, hsl(120 80% 50% / 0.12), transparent 40%, transparent 60%)",
              boxShadow: "inset -3px 0 40px hsl(120 80% 50% / 0.08)",
            }}
            animate={{ x: [-4, 0, 6], opacity: [0.2, 0, 0.15] }}
            transition={{ duration: 0.4, delay: 0.05 }} />
          {/* Blue channel offset */}
          <motion.div className="absolute inset-0"
            style={{
              background: "linear-gradient(0deg, hsl(240 100% 50% / 0.1), transparent 20%, transparent 80%, hsl(240 100% 50% / 0.08))",
              boxShadow: "inset 0 4px 40px hsl(240 100% 50% / 0.1)",
            }}
            animate={{ y: [4, 0, -6], opacity: [0.15, 0, 0.12] }}
            transition={{ duration: 0.4, delay: 0.1 }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* Lens Distortion - Barrel/fish-eye effect */
export const LensDistortion = ({ active }: { active: boolean }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div className="absolute inset-0 z-[55] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>
          {/* SVG for actual lens distortion */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1 1" preserveAspectRatio="none">
            <defs>
              <filter id="lensdistort">
                <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" seed={Math.random()} />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.02" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <motion.rect width="1" height="1" fill="hsl(220 20% 5% / 0.3)"
              filter="url(#lensdistort)"
              animate={{ opacity: [0.4, 0.2, 0] }}
              transition={{ duration: 0.5 }} />
          </svg>
          {/* Radial vignette with distortion */}
          <motion.div className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, transparent 30%, hsl(0 0% 0% / 0.25) 70%, hsl(0 0% 0% / 0.5) 100%)`,
              backdropFilter: "blur(0.25px)",
            }}
            animate={{ opacity: [0.2, 0.5, 0.1] }}
            transition={{ duration: 0.6 }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* 3D Perspective Impact Ripple */
export const ImpactRipple = ({ active, side, color }: { active: boolean; side: "left" | "right"; color: "cyan" | "orange" }) => {
  const baseColor = color === "cyan" ? "hsl(195 100% 50%)" : "hsl(25 95% 55%)";
  
  return (
    <AnimatePresence>
      {active && (
        <div className={`absolute z-28 ${side === "left" ? "left-[18%]" : "right-[18%]"} top-1/2 -translate-y-1/2 -translate-x-1/2`}>
          {/* Concentric ripples with 3D perspective */}
          {[0, 1, 2, 3, 4].map(i => (
            <motion.div key={`ripple-${i}`} className="absolute rounded-full"
              style={{
                width: 30,
                height: 30,
                border: `2px solid ${baseColor}`,
                boxShadow: `0 0 ${15 + i * 8}px ${baseColor}, inset 0 0 ${10 + i * 4}px ${baseColor}`,
              }}
              initial={{ scale: 0.2, opacity: 0.8, rotateX: 0 }}
              animate={{
                scale: [0.2, 3.5, 5.5],
                opacity: [0.8, 0.4, 0],
                rotateX: [0, 45, 90],
              }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: "easeOut" }} />
          ))}
          {/* Central impact point glow */}
          <motion.div className="absolute rounded-full"
            style={{
              width: 20,
              height: 20,
              background: baseColor,
              boxShadow: `0 0 30px ${baseColor}, 0 0 60px ${baseColor}`,
              filter: "blur(3px)",
            }}
            animate={{ scale: [1, 2, 0.5], opacity: [0.8, 0.3, 0] }}
            transition={{ duration: 0.7 }} />
        </div>
      )}
    </AnimatePresence>
  );
};

/* Motion Blur on Energy Beams */
export const MotionBlurBeam = ({ active, direction }: { active: boolean; direction: "left-to-right" | "right-to-left" }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className={`absolute top-1/2 -translate-y-1/2 z-36 pointer-events-none`}
          style={{
            [direction === "left-to-right" ? "left" : "right"]: "25%",
            width: "50%",
            height: "8px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          {/* Multiple blur trails */}
          {[0, 1, 2, 3].map(i => {
            const isLeft = direction === "left-to-right";
            const color = isLeft ? "hsl(195 100% 50%)" : "hsl(25 95% 55%)";
            return (
              <motion.div key={`blur-${i}`} className="absolute h-full"
                style={{
                  width: "40%",
                  background: `linear-gradient(${isLeft ? "90deg" : "-90deg"}, ${color}, transparent)`,
                  opacity: 0.6 - i * 0.15,
                  filter: "blur(4px)",
                }}
                animate={{
                  x: isLeft ? ["-100%", "150%"] : ["100%", "-150%"],
                }}
                transition={{ duration: 0.35, delay: i * 0.05 }} />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* Dynamic Light Flare - reactive to impacts */
export const LightFlare = ({ active, side }: { active: boolean; side: "left" | "right" }) => {
  const color = side === "left" ? "hsl(195 100% 50%)" : "hsl(25 95% 55%)";
  
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className={`absolute z-[65] pointer-events-none ${side === "left" ? "left-0" : "right-0"} top-1/2 -translate-y-1/2`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}>
          {/* Main lens flare */}
          <motion.div className="absolute inset-0"
            style={{
              width: "100%",
              height: "200%",
              background: `radial-gradient(ellipse at ${side === "left" ? "30%" : "70%"} 50%, ${color} 0%, transparent 60%)`,
              filter: "blur(40px)",
            }}
            animate={{ opacity: [0.4, 1, 0.2] }}
            transition={{ duration: 0.5 }} />
          {/* Lens flare circles */}
          {[1, 2, 3].map(i => (
            <motion.div key={`flare-${i}`} className="absolute rounded-full"
              style={{
                width: 40 * i,
                height: 40 * i,
                border: `1px solid ${color}`,
                opacity: 0.3 - i * 0.05,
                [side === "left" ? "left" : "right"]: "-100%",
                top: "50%",
                transform: "translateY(-50%)",
              }}
              animate={{ scale: [0.5, 1.5], opacity: [0.3 - i * 0.05, 0] }}
              transition={{ duration: 0.6, delay: i * 0.1 }} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* Shatter Glass Effect - on critical hits */
export const GlassShatter = ({ active, side }: { active: boolean; side: "left" | "right" }) => {
  const shards = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 200,
    y: (Math.random() - 0.5) * 200,
    size: Math.random() * 12 + 4,
    rotation: Math.random() * 360,
    spin: Math.random() * 720 - 360,
    delay: Math.random() * 0.15,
  })), []);

  return (
    <AnimatePresence>
      {active && (
        <div className={`absolute z-50 ${side === "left" ? "left-[15%]" : "right-[15%]"} top-1/2 -translate-y-1/2`}>
          {shards.map(s => (
            <motion.div key={s.id} className="absolute"
              style={{
                width: s.size,
                height: s.size,
                background: side === "left" ? "hsl(25 95% 55% / 0.8)" : "hsl(195 100% 50% / 0.8)",
                border: `1px solid ${side === "left" ? "hsl(25 95% 65%)" : "hsl(195 100% 60%)"}`,
                boxShadow: `0 0 ${s.size + 2}px ${side === "left" ? "hsl(25 95% 55%)" : "hsl(195 100% 50%)"}`,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              animate={{
                x: s.x,
                y: s.y,
                opacity: [1, 0.6, 0],
                scale: [1, 0.8, 0],
                rotate: s.spin,
              }}
              transition={{ duration: 1.2, delay: s.delay, ease: "easeOut" }} />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};
