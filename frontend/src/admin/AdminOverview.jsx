import React from 'react';

const StatCard = ({ label, value }) => (
  <div className="stat-card">
    <div className="label">{label}</div>
    <div className="value">{value}</div>
  </div>
);

const BarChart = ({ data }) => {
  const nonNegative = data.filter(d => typeof d.count === 'number' && d.count >= 0);
  const max = Math.max(1, ...nonNegative.map(d => d.count));
  const total = nonNegative.reduce((a, b) => a + b.count, 0) || 1;
  const ticks = 5;
  const values = Array.from({ length: ticks + 1 }, (_, i) => Math.round((max / ticks) * (ticks - i)));
  const plotRef = React.useRef(null);
  const [tooltip, setTooltip] = React.useState({ visible: false, x: 0, y: 0, name: '', count: 0, percent: 0 });

  const formatCount = (n) => (n || 0).toLocaleString('en-IN');

  return (
    <div className="bar-chart-axis-wrap">
      <div className="y-axis">
        {values.map((v, i) => (
          <div key={i}>{v}</div>
        ))}
      </div>
      <div className="bar-plot-area" ref={plotRef} onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}>
        <div className="bar-grid">
          {values.map((_, i) => (
            <div className="bar-grid-line" key={i}></div>
          ))}
        </div>
        {nonNegative.map((d, idx) => (
          <div key={idx} className="bar-item">
            <div
              className="bar"
              style={{ height: `${(d.count / max) * 180 + 24}px` }}
              onMouseEnter={(e) => {
                const rect = plotRef.current?.getBoundingClientRect();
                const x = e.clientX - (rect?.left || 0);
                const y = e.clientY - (rect?.top || 0);
                setTooltip({ visible: true, x: x + 10, y: y + 10, name: d.name, count: d.count, percent: Number(((d.count / total) * 100).toFixed(1)) });
              }}
              onMouseMove={(e) => {
                const rect = plotRef.current?.getBoundingClientRect();
                const x = e.clientX - (rect?.left || 0);
                const y = e.clientY - (rect?.top || 0);
                setTooltip(t => ({ ...t, x: x + 10, y: y + 10 }));
              }}
              onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
            />
            <div className="bar-label">{d.name}</div>
            <div className="bar-value">{formatCount(d.count)}</div>
          </div>
        ))}
        {tooltip.visible && (
          <div className="chart-tooltip" style={{ left: tooltip.x, top: tooltip.y, position: 'absolute' }}>
            <div className="value">{tooltip.name}</div>
            <div className="muted">{formatCount(tooltip.count)} • {tooltip.percent}%</div>
          </div>
        )}
      </div>
    </div>
  );
};

const PieChart = ({ data }) => {
  const containerRef = React.useRef(null);
  const [hoverIdx, setHoverIdx] = React.useState(-1);
  const [tooltip, setTooltip] = React.useState({ visible: false, x: 0, y: 0, name: '', count: 0, percent: 0, color: '#000' });
  const total = data.reduce((a, b) => a + (b.count || 0), 0) || 1;
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#22c55e', '#06b6d4'];
  let cumulative = 0;
  const radius = 84;
  const cx = 110, cy = 110;

  const formatCount = (n) => (n || 0).toLocaleString('en-IN');
  const slices = data.map((d, idx) => {
    const value = Math.max(0, d.count || 0);
    const start = cumulative / total;
    cumulative += value;
    const end = cumulative / total;
    const largeArc = end - start > 0.5 ? 1 : 0;
    const startAngle = 2 * Math.PI * start;
    const endAngle = 2 * Math.PI * end;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    const midAngle = (startAngle + endAngle) / 2;
    const hoverTransform = hoverIdx === idx
      ? `translate(${Math.cos(midAngle) * 4}, ${Math.sin(midAngle) * 4})`
      : '';
    const percent = Number(((value / total) * 100).toFixed(1));
    return { path, color: colors[idx % colors.length], name: d.name, count: d.count, percent, hoverTransform };
  });

  return (
    <div className="flex flex-col items-center gap-4 w-full" ref={containerRef}>
      <svg width={220} height={220} viewBox="0 0 220 220"
        onMouseLeave={() => setTooltip(s => ({ ...s, visible: false }))}
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.25" />
          </filter>
        </defs>
        {slices.map((s, i) => (
          <g key={i} transform={s.hoverTransform}
            onMouseEnter={e => {
              setHoverIdx(i);
              const rect = containerRef.current?.getBoundingClientRect();
              const clientX = e.clientX - (rect?.left || 0);
              const clientY = e.clientY - (rect?.top || 0);
              setTooltip({ visible: true, x: clientX, y: clientY, name: s.name, count: s.count || 0, percent: s.percent, color: s.color });
            }}
            onMouseMove={e => {
              const rect = containerRef.current?.getBoundingClientRect();
              const clientX = e.clientX - (rect?.left || 0);
              const clientY = e.clientY - (rect?.top || 0);
              setTooltip(t => ({ ...t, x: clientX, y: clientY }));
            }}
            onMouseLeave={() => { setHoverIdx(-1); setTooltip(s => ({ ...s, visible: false })); }}
          >
            <path d={s.path} fill={s.color} opacity={hoverIdx === i ? 1 : 0.9} stroke="#fff" strokeWidth={1} filter="url(#shadow)" />
          </g>
        ))}
        {/* Donut hole */}
        <circle cx={cx} cy={cy} r={46} fill="#ffffff" />
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827">{total}</text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="11" fill="#6b7280">total</text>
      </svg>
      <div className="legend-grid">
        {data.length === 0 ? (
          <div className="text-gray-500">No data</div>
        ) : (
          data.map((d, i) => (
            <div key={i} className="legend-item">
              <div className="legend-left">
                <span className="legend-dot" style={{ background: colors[i % colors.length] }} />
                <span className="legend-name">{d.name}</span>
              </div>
              <div className="legend-value">{formatCount(d.count)} • {(((d.count || 0) / total) * 100).toFixed(1)}%</div>
            </div>
          ))
        )}
      </div>
      {tooltip.visible && (
        <div className="chart-tooltip" style={{ left: tooltip.x + 10, top: tooltip.y + 10, position: 'absolute' }}>
          <div className="row"><span className="dot" style={{ background: tooltip.color }}></span><span className="value">{tooltip.name}</span></div>
          <div className="muted">{formatCount(tooltip.count)} • {tooltip.percent.toFixed(1)}%</div>
        </div>
      )}
    </div>
  );
};

const AdminOverview = () => {
  const [stats, setStats] = React.useState({ totalStudents: 0, totalCompanies: 0, applicationsByCompany: [], roleDistribution: [], branchDistribution: [] });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch stats');
        setStats(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-gray-600">Loading stats...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6" style={{ marginLeft: '16rem'}}>
      <div className="stats-grid">
        <StatCard label="Total Students" value={stats.totalStudents} />
        <StatCard label="Total Companies" value={stats.totalCompanies} />
        <StatCard label="Total Applications" value={stats.applicationsByCompany.reduce((a, b) => a + b.count, 0)} />
      </div>
      <br />
      <div className="charts-row">
        <div className="chart-card chart-card--pie">
          <div className="chart-header">
            <h3 className="chart-title">Roles Offered by Companies</h3>
            <span className="chart-subtle">Company role offerings</span>
          </div>
          <div className="pie-wrap">
            <PieChart data={stats.roleDistribution} />
          </div>
        </div>
        <div className="chart-card chart-card--pie">
          <div className="chart-header">
            <h3 className="chart-title">Branches Allowed by Companies</h3>
            <span className="chart-subtle">Allowed branches per company</span>
          </div>
          <div className="pie-wrap">
            <PieChart data={stats.branchDistribution} />
          </div>
        </div>
      </div>
      <br />
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Applicants in each Company</h3>
          <span className="chart-subtle"></span>
        </div>
        {stats.applicationsByCompany.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No applications yet</div>
        ) : (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <BarChart data={stats.applicationsByCompany} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;


