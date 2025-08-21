import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const SpeedInsightsMount: React.FC = () => {
  // For single-page apps it's fine to pass the current path.
  const route =
    typeof window !== "undefined" ? window.location.pathname : undefined;
  return <SpeedInsights route={route} />;
};

export default SpeedInsightsMount;
