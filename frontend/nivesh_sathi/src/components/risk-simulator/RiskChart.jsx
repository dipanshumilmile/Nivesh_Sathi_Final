// components/risk-simulator/RiskChart.js
"use client";

export default function RiskChart({ amount, rate, years }) {
  const points = Array.from({ length: years + 1 }, (_, year) => {
    const value = amount * Math.pow(1 + rate / 100, year);
    return { year, value };
  });

  const maxValue = Math.max(...points.map((p) => p.value));
  const minValue = amount;
  const width = 800;
  const height = 260;
  const paddingX = 40;
  const paddingY = 20;

  const xScale = (year) =>
    paddingX + (year / years) * (width - paddingX * 2);

  const yScale = (val) =>
    height -
    paddingY -
    ((val - minValue) / (maxValue - minValue || 1)) *
      (height - paddingY * 2);

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.year)} ${yScale(p.value)}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${xScale(points[points.length - 1].year)} ${height - paddingY}` +
    ` L ${xScale(0)} ${height - paddingY} Z`;

  return (
    <div className="mt-4 rounded-3xl bg-emerald-50/60 p-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-64"
        aria-hidden="true"
      >
        {/* Area */}
        <path d={areaD} className="fill-emerald-200/60" />
        {/* Line */}
        <path d={pathD} className="stroke-emerald-600 stroke-[3]" fill="none" />

        {/* X-axis labels */}
        {points.map((p) => (
          <text
            key={p.year}
            x={xScale(p.year)}
            y={height - 4}
            className="fill-slate-400 text-[10px]"
            textAnchor="middle"
          >
            {p.year === 0 ? "Year 0" : `Year ${p.year}`}
          </text>
        ))}
      </svg>
    </div>
  );
}
