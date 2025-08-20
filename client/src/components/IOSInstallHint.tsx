// client/src/components/IOSInstallHint.tsx
import React, { useEffect, useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const LS_KEY = "iosInstallHintDismissed";

const IOSInstallHint: React.FC = () => {
  const { isIOS, isSafari, isStandalone } = usePWAInstall();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LS_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isStandalone && !dismissed) {
      setDismissed(true);
      try { localStorage.setItem(LS_KEY, "1"); } catch {}
    }
  }, [isStandalone, dismissed]);

  if (!isIOS || !isSafari || isStandalone || dismissed) return null;

  function onClose() {
    setDismissed(true);
    try { localStorage.setItem(LS_KEY, "1"); } catch {}
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 12,
        background: "rgba(17,24,39,0.95)",
        color: "white",
        border: "1px solid #1f2937",
        borderRadius: 12,
        padding: "10px 12px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
        zIndex: 9999,
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 14, lineHeight: 1.4 }}>
          <strong>Install on iPhone</strong><br />
          Tap <span aria-label="Share">Share</span> → <em>Add to Home Screen</em> to install the app.
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background: "transparent",
            border: "1px solid #374151",
            color: "#e5e7eb",
            padding: "6px 10px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default IOSInstallHint;
