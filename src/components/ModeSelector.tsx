import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, SlidersHorizontal } from "lucide-react";

interface ModeSelectorProps {
  /** Called when the user chooses the guided wizard flow. */
  onSelectGuided: () => void;
  /** Called when the user chooses the full calculator. */
  onSelectFull: () => void;
}

/**
 * Entry screen shown on app load. Presents two cards letting users choose
 * between Quick Estimate (guided wizard) and Full Calculator modes.
 */
export function ModeSelector({ onSelectGuided, onSelectFull }: ModeSelectorProps) {
  const [hovered, setHovered] = useState<"guided" | "full" | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 640, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(22px, 4vw, 30px)",
          fontWeight: 700,
          color: "var(--cr-text)",
          margin: "0 0 12px",
          lineHeight: 1.25,
        }}
      >
        How would you like to calculate your ROI?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: "var(--cr-text-muted)",
          margin: "0 0 40px",
        }}
      >
        Both paths lead to the same results dashboard.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        className="mode-selector-grid"
      >
        <ModeCard
          icon={<Zap size={26} color="var(--cr-orange)" />}
          title="Quick Estimate"
          description="Answer 3–4 questions, we estimate the rest"
          badge="Recommended"
          isHovered={hovered === "guided"}
          onMouseEnter={() => setHovered("guided")}
          onMouseLeave={() => setHovered(null)}
          onClick={onSelectGuided}
          primary
        />
        <ModeCard
          icon={<SlidersHorizontal size={26} color="var(--cr-text-muted)" />}
          title="Full Calculator"
          description="Customize every input yourself"
          isHovered={hovered === "full"}
          onMouseEnter={() => setHovered("full")}
          onMouseLeave={() => setHovered(null)}
          onClick={onSelectFull}
        />
      </motion.div>

      <style>{`
        @media (max-width: 480px) {
          .mode-selector-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}

interface ModeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  isHovered: boolean;
  primary?: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

/** Individual selectable mode card on the entry screen. */
function ModeCard({
  icon,
  title,
  description,
  badge,
  isHovered,
  primary,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: ModeCardProps) {
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: isHovered && primary
          ? "rgba(255, 107, 44, 0.06)"
          : "var(--cr-bg-card)",
        border: `1px solid ${isHovered ? "var(--cr-orange)" : "var(--cr-border)"}`,
        borderRadius: 16,
        padding: "28px 22px",
        cursor: "pointer",
        textAlign: "left",
        transition: "border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
        boxShadow: isHovered
          ? "0 0 0 1px rgba(255,107,44,0.12), 0 12px 40px rgba(0,0,0,0.35)"
          : "0 4px 20px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column" as const,
        gap: 16,
        width: "100%",
        position: "relative" as const,
      }}
    >
      {badge && (
        <span style={{
          position: "absolute",
          top: 14,
          right: 14,
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          color: "var(--cr-orange)",
          background: "rgba(255,107,44,0.1)",
          border: "1px solid rgba(255,107,44,0.25)",
          borderRadius: 20,
          padding: "3px 10px",
        }}>
          {badge}
        </span>
      )}

      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: isHovered && primary
          ? "rgba(255,107,44,0.12)"
          : "var(--cr-bg-elevated)",
        border: `1px solid ${isHovered ? "rgba(255,107,44,0.3)" : "var(--cr-border)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        flexShrink: 0,
      }}>
        {icon}
      </div>

      <div>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 17,
          fontWeight: 700,
          color: isHovered ? "var(--cr-text)" : "var(--cr-text)",
          marginBottom: 8,
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          color: "var(--cr-text-muted)",
          lineHeight: 1.5,
        }}>
          {description}
        </div>
      </div>
    </motion.button>
  );
}
