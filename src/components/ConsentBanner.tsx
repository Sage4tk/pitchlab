import { Link } from "react-router-dom";
import { useAnalyticsConsent } from "@/hooks/useAnalyticsConsent";

export function ConsentBanner() {
  const { consent, accept, decline } = useAnalyticsConsent();

  if (consent !== "pending") return null;

  return (
    <div
      role="dialog"
      aria-label="Analytics consent"
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9998,
        width: "min(560px, calc(100vw - 32px))",
        background: "var(--bg-surface-2)",
        border: "1px solid rgba(212,146,58,0.35)",
        borderRadius: "12px",
        padding: "18px 22px",
        boxShadow: "0 4px 32px rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <div
          style={{
            fontSize: "22px",
            lineHeight: 1,
            flexShrink: 0,
            marginTop: "2px",
            color: "var(--accent)",
            fontFamily: "Georgia, serif",
          }}
        >
          𝄞
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "6px",
            }}
          >
            Help us improve Pitchlabs
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--text-muted)",
              lineHeight: 1.6,
            }}
          >
            We'd like to collect anonymous usage data (which exercises you use,
            session counts) to understand what's most useful. No personal data
            is sold or shared.{" "}
            <Link
              to="/privacy"
              style={{ color: "var(--accent)", textDecoration: "underline" }}
            >
              Privacy policy
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button
          onClick={decline}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            padding: "8px 18px",
            borderRadius: "6px",
            border: "1px solid rgba(237,228,208,0.2)",
            background: "transparent",
            color: "var(--text-muted)",
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          No thanks
        </button>
        <button
          onClick={accept}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            padding: "8px 18px",
            borderRadius: "6px",
            border: "1px solid var(--accent)",
            background: "var(--accent)",
            color: "#1a1410",
            cursor: "pointer",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          Allow analytics
        </button>
      </div>
    </div>
  );
}
