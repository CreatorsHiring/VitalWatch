import React, { useState } from 'react';

export function TimeSeriesChart({
  data = [],
  dataKey = 'hr',
  title = 'Heart Rate',
  unit = 'bpm',
  color = '#0f766e',
  thresholdMin,
  thresholdMax,
  height = 200,
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="w-full flex items-center justify-center bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-400 font-medium"
      >
        No time-series observation data recorded.
      </div>
    );
  }

  // Extract valid numerical values for min/max auto-scaling
  const validValues = data
    .map((d) => d[dataKey])
    .filter((v) => v !== null && v !== undefined && typeof v === 'number');

  if (validValues.length === 0) {
    return (
      <div
        style={{ height }}
        className="w-full flex items-center justify-center bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-500 font-medium"
      >
        All observations in interval marked as missing.
      </div>
    );
  }

  // Calculate dynamic axis bounds with margin
  let minY = Math.min(...validValues);
  let maxY = Math.max(...validValues);

  if (thresholdMin !== undefined) minY = Math.min(minY, thresholdMin);
  if (thresholdMax !== undefined) maxY = Math.max(maxY, thresholdMax);

  const paddingY = Math.max(2, (maxY - minY) * 0.15);
  minY = Math.floor(minY - paddingY);
  maxY = Math.ceil(maxY + paddingY);
  if (minY === maxY) {
    minY -= 5;
    maxY += 5;
  }

  const svgWidth = 600;
  const svgHeight = height;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Convert array index to X coordinate
  const getX = (index) => {
    if (data.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  // Convert value to Y coordinate
  const getY = (val) => {
    if (val === null || val === undefined) return null;
    const norm = (val - minY) / (maxY - minY);
    return paddingTop + chartHeight - norm * chartHeight;
  };

  // Build segmented SVG path chunks to handle missing data gaps
  const pathSegments = [];
  let currentSegment = [];

  data.forEach((pt, idx) => {
    const val = pt[dataKey];
    if (val !== null && val !== undefined && pt.quality !== 'MISSING') {
      currentSegment.push({ x: getX(idx), y: getY(val), pt, idx });
    } else {
      if (currentSegment.length > 0) {
        pathSegments.push(currentSegment);
        currentSegment = [];
      }
    }
  });
  if (currentSegment.length > 0) {
    pathSegments.push(currentSegment);
  }

  // Horizontal grid lines
  const gridTicks = [minY, Math.round((minY + maxY) / 2), maxY];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">{title}</h4>
        </div>
        <span className="text-xs font-mono text-slate-500">
          Latest: <strong className="text-slate-900 font-bold">{data[data.length - 1]?.[dataKey] ?? '--'} {unit}</strong>
        </span>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Background Grid Lines */}
          {gridTicks.map((tickVal) => {
            const y = getY(tickVal);
            return (
              <g key={tickVal}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-mono"
                >
                  {tickVal}
                </text>
              </g>
            );
          })}

          {/* Threshold Lines */}
          {thresholdMax !== undefined && (
            <line
              x1={paddingLeft}
              y1={getY(thresholdMax)}
              x2={svgWidth - paddingRight}
              y2={getY(thresholdMax)}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
          )}
          {thresholdMin !== undefined && (
            <line
              x1={paddingLeft}
              y1={getY(thresholdMin)}
              x2={svgWidth - paddingRight}
              y2={getY(thresholdMin)}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
          )}

          {/* Data Path Segments */}
          {pathSegments.map((segment, sIdx) => {
            const dStr = segment
              .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
              .join(' ');
            return (
              <path
                key={sIdx}
                d={dStr}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {/* Data Points */}
          {data.map((pt, idx) => {
            const val = pt[dataKey];
            if (val === null || val === undefined || pt.quality === 'MISSING') {
              // Draw missing indicator mark
              return (
                <text
                  key={idx}
                  x={getX(idx)}
                  y={svgHeight - paddingBottom + 12}
                  textAnchor="middle"
                  className="fill-red-400 text-[9px] font-bold"
                >
                  GAP
                </text>
              );
            }

            const x = getX(idx);
            const y = getY(val);
            const isHovered = hoveredPoint?.idx === idx;

            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r={isHovered ? 5 : 2.5}
                fill={isHovered ? '#ffffff' : color}
                stroke={color}
                strokeWidth={isHovered ? 3 : 1}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredPoint({ idx, pt, x, y, val })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            style={{
              left: `${(hoveredPoint.x / svgWidth) * 100}%`,
              top: `${(hoveredPoint.y / svgHeight) * 100}%`,
            }}
            className="absolute z-30 transform -translate-x-1/2 -translate-y-full mb-2 bg-slate-900 text-white text-[11px] p-2 rounded shadow-lg pointer-events-none whitespace-nowrap border border-slate-700"
          >
            <div className="font-semibold">{title}: {hoveredPoint.val} {unit}</div>
            <div className="text-slate-400 font-mono text-[10px]">
              {new Date(hoveredPoint.pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-teal-300 text-[10px]">Quality: {hoveredPoint.pt.quality}</div>
          </div>
        )}
      </div>

      {/* X Axis Time Labels */}
      <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100">
        <span>{data[0]?.timestamp ? new Date(data[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
        <span>{data[Math.floor(data.length / 2)]?.timestamp ? new Date(data[Math.floor(data.length / 2)].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
        <span>{data[data.length - 1]?.timestamp ? new Date(data[data.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
      </div>
    </div>
  );
}
