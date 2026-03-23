export default function DashboardPage() {
  // TODO: reemplazar con datos reales de tu API
  const stats = [
    { label: 'Grupos activos',  value: 12,  change: '↑ 2 vs ciclo anterior', accent: 'teal' },
    { label: 'Alumnos',         value: 347, change: '↑ 18 nuevos',           accent: 'teal' },
    { label: 'Docentes',        value: 24,  change: '3 tutores asignados',    accent: 'green' },
    { label: 'Bajas del ciclo', value: 7,   change: '↑ 2 vs ciclo anterior',  accent: 'red' },
  ]

  const carreras = [
    { name: 'Ing. Software',    count: 98, pct: 85 },
    { name: 'Ing. Redes',       count: 81, pct: 70 },
    { name: 'TSU Mecatrónica',  count: 69, pct: 60, green: true },
    { name: 'TSU Electrónica',  count: 61, pct: 53, green: true },
    { name: 'Otros',            count: 38, pct: 33, gray: true },
  ]

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="topbar-title">Dashboard</h1>
          <p className="topbar-sub">Ciclo 2025-A · Cuatrimestre Enero–Abril</p>
        </div>
      </div>

      <div className="content-area">
        {/* Stat cards */}
        <div className="stats-grid">
          {stats.map(s => (
            <div key={s.label} className={`stat-card ${s.accent === 'green' ? 'green-accent' : s.accent === 'red' ? 'red-accent' : ''}`}>
              <p className="stat-label">{s.label}</p>
              <p className={`stat-val ${s.accent === 'red' ? 'red' : ''}`}>{s.value}</p>
              <p className={`stat-change ${s.accent === 'red' ? 'red' : ''}`}>{s.change}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Bar chart */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Alumnos por carrera</p>
            {carreras.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ width: 130, fontSize: 11, color: 'var(--gray-600)', textAlign: 'right', flexShrink: 0 }}>{c.name}</span>
                <div style={{ flex: 1, background: 'var(--gray-100)', borderRadius: 4, height: 14, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4, width: `${c.pct}%`,
                    background: c.gray ? 'var(--gray-400)' : c.green ? 'var(--green)' : 'var(--teal)',
                  }} />
                </div>
                <span style={{ width: 28, fontSize: 11, color: 'var(--gray-600)' }}>{c.count}</span>
              </div>
            ))}
          </div>

          {/* Donut */}
          <div style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Estatus de alumnos</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center' }}>
              <svg width="110" height="110" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#EEF0F2" strokeWidth="16"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#00A896" strokeWidth="16" strokeDasharray="202 238" strokeDashoffset="60"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#1B6B3A" strokeWidth="16" strokeDasharray="25 238" strokeDashoffset="-142"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#E8A020" strokeWidth="16" strokeDasharray="11 238" strokeDashoffset="-167"/>
                <text x="50" y="54" textAnchor="middle" fontSize="13" fontWeight="700" fill="#007A6E">347</text>
              </svg>
              <div>
                {[
                  { color: '#00A896', label: 'Activos', count: 315 },
                  { color: '#1B6B3A', label: 'Egresados', count: 25 },
                  { color: '#E8A020', label: 'Baja', count: 7 },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, fontSize: 12, color: 'var(--gray-600)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                    {l.label} ({l.count})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
