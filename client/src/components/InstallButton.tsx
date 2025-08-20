// client/src/components/InstallButton.tsx
import React from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

type Props = { className?: string; label?: string };

const InstallButton: React.FC<Props> = ({ className, label }) => {
  const { canInstall, promptInstall, isStandalone, isIOS } = usePWAInstall();

  if (isStandalone) return null;
  if (isIOS) return null;
  if (!canInstall) return null;

  async function onClick() {
    await promptInstall();
  }

  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid #1f2937",
        background: "#111827",
        color: "white",
        cursor: "pointer",
        fontSize: 14,
      }}
      className={className}
      aria-label="Install app"
    >
      {label ?? "Install app"}
    </button>
  );
};

export default InstallButton;
