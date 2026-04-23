import { AdminHeader } from '../components/AdminHeader.jsx'

export function Dashboard({
  onLogout,
  statsLoading,
  stats,
  onGoEventos,
  onGoAsistentes,
}) {
  return (
    <div className="admin-app">
      <AdminHeader onLogout={onLogout} />
      <main className="admin-main">
        {statsLoading ? (
          <p className="admin-muted">Cargando estadísticas…</p>
        ) : (
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-label">Total eventos</span>
              <span className="admin-stat-value">{stats.eventos}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Total usuarios</span>
              <span className="admin-stat-value">{stats.usuarios}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Total asistencias</span>
              <span className="admin-stat-value">{stats.asistencias}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Evento más popular</span>
              <span className="admin-stat-value admin-stat-value--small">{stats.popularLabel}</span>
            </div>
          </div>
        )}
        <div className="admin-actions">
          <button type="button" className="admin-btn admin-btn-primary" onClick={onGoEventos}>
            Gestión de eventos
          </button>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onGoAsistentes}>
            Asistentes por evento
          </button>
        </div>
      </main>
    </div>
  )
}
