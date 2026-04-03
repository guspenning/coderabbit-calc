import { useEffect } from "react";
import { motion } from "framer-motion";
import { INDUSTRY_PROFILES, type IndustryKey } from "../../data/industryBenchmarks";

interface StepCompanyProfileProps {
  selectedIndustry: IndustryKey | null;
  /** Called when the user selects (or re-selects) an industry card. */
  onSelect: (key: IndustryKey) => void;
  onEnter: () => void;
}

/**
 * Wizard Step 2: Single-select industry profile cards.
 * The chosen profile drives the benchmark defaults applied in Step 3.
 */
export function StepCompanyProfile({
  selectedIndustry,
  onSelect,
  onEnter,
}: StepCompanyProfileProps) {
  // Allow pressing Enter to advance once a selection is made
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && selectedIndustry) onEnter();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIndustry, onEnter]);

  return (
    <div>
      <h3 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "clamp(20px, 3vw, 26px)",
        fontWeight: 700,
        color: "var(--cr-text)",
        margin: "0 0 8px",
        lineHeight: 1.25,
      }}>
        What kind of software do you build?
      </h3>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        color: "var(--cr-text-muted)",
        margin: "0 0 28px",
        lineHeight: 1.5,
      }}>
        We'll use industry benchmarks to pre-fill your metrics. You can adjust them in the next step.
      </p>

      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}
        className="profile-grid"
      >
        {INDUSTRY_PROFILES.map((profile) => {
          const selected = selectedIndustry === profile.key;
          return (
            <motion.button
              key={profile.key}
              onClick={() => onSelect(profile.key)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: selected ? "rgba(255,107,44,0.07)" : "var(--cr-bg-card)",
                border: `1px solid ${selected ? "var(--cr-orange)" : "var(--cr-border)"}`,
                borderRadius: 12,
                padding: "14px 16px",
                cursor: "pointer",
                textAlign: "left" as const,
                transition: "all 0.2s ease",
                boxShadow: selected
                  ? "0 0 0 1px rgba(255,107,44,0.18), 0 6px 24px rgba(0,0,0,0.25)"
                  : "0 2px 8px rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                position: "relative" as const,
              }}
            >
              <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0, paddingTop: 1 }}>
                {profile.icon}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: selected ? "var(--cr-orange)" : "var(--cr-text)",
                  marginBottom: 4,
                  transition: "color 0.2s ease",
                }}>
                  {profile.label}
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  color: "var(--cr-text-dim)",
                  lineHeight: 1.45,
                }}>
                  {profile.description}
                </div>
              </div>

              {/* Checkmark */}
              {selected && (
                <div style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "var(--cr-orange)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 480px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
