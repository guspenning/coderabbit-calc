import { useState, useRef } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  /** The explanatory text to show in the tooltip */
  text: string;
}

/**
 * A reusable info icon tooltip component.
 * Shows a floating tooltip card on hover or focus, positioned above the trigger.
 */
export function Tooltip({ text }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={ref}
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      <Info
        size={13}
        className="cursor-help"
        style={{ color: "var(--cr-text-muted)", flexShrink: 0 }}
      />
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 50,
              width: "220px",
              background: "var(--cr-bg-elevated)",
              border: "1px solid var(--cr-border-bright)",
              borderRadius: "8px",
              padding: "10px 12px",
              fontSize: "12px",
              lineHeight: "1.5",
              color: "var(--cr-text-muted)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              pointerEvents: "none",
            }}
          >
            {text}
            {/* Arrow */}
            <span
              style={{
                position: "absolute",
                bottom: "-5px",
                left: "50%",
                transform: "translateX(-50%) rotate(45deg)",
                width: "8px",
                height: "8px",
                background: "var(--cr-bg-elevated)",
                border: "1px solid var(--cr-border-bright)",
                borderTop: "none",
                borderLeft: "none",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
