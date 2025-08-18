import React from 'react';

interface PercentileLinesProps {
  confidenceIntervals: Array<{ level: number; daysFromStart: number }>;
  chartWidth: number;
  chartHeight: number;
  xScale: (value: number) => number;
  margin: { top: number; right: number; left: number; bottom: number };
}

export const PercentileLines: React.FC<PercentileLinesProps> = ({
  confidenceIntervals,
  chartWidth,
  chartHeight,
  xScale,
  margin
}) => {
  const getColor = (level: number) => {
    switch (level) {
      case 0.5: return '#3b82f6';
      case 0.8: return '#f59e0b';
      case 0.95: return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLabel = (level: number) => {
    switch (level) {
      case 0.5: return 'P50';
      case 0.8: return 'P80'; 
      case 0.95: return 'P95';
      default: return `P${Math.round(level * 100)}`;
    }
  };

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10
      }}
    >
      {confidenceIntervals.map((interval) => {
        const x = xScale(interval.daysFromStart);
        const color = getColor(interval.level);
        const label = getLabel(interval.level);
        
        return (
          <g key={`percentile-${interval.level}`}>
            {/* Vertical line */}
            <line
              x1={x}
              y1={margin.top}
              x2={x}
              y2={chartHeight - margin.bottom}
              stroke={color}
              strokeWidth={3}
              strokeDasharray="8 4"
            />
            {/* Label */}
            <text
              x={x}
              y={margin.top - 5}
              fill={color}
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};