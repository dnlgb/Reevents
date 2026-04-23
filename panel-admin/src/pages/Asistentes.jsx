import { AdminHeader } from '../components/AdminHeader.jsx'

export function Asistentes({
  onLogout,
  onBackDashboard,
  events,
  selectedEventId,
  setSelectedEventId,
  asistentes,
  asistentesLoading,
}) {
  const count = asistentes.length
  return (
    <div className="admin-app">
      <AdminHeader onLogout={onLogout} />
      <main className="admin-main">
        <nav className="admin-nav">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onBackDashboard}>
            ← Dashboard
          </button>
        </nav>
        <h2 className="admin-section-title">Asistentes por evento</h2>
        <label className="admin-label admin-label-inline">
          Evento
          <select
            className="admin-input admin-select-wide"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">— Selecciona un evento —</option>
            {events.map((ev) => (
              <option key={ev.id} value={String(ev.id)}>
                {ev.titulo}
              </option>
            ))}
          </select>
        </label>
        <p className="admin-counter">
          {selectedEventId
            ? `${count} asistente${count === 1 ? '' : 's'} confirmado${count === 1 ? '' : 's'}`
            : 'Selecciona un evento para ver asistentes'}
        </p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Carrera</th>
              </tr>
            </thead>
            <tbody>
              {!selectedEventId ? (
                <tr>
                  <td colSpan={2} className="admin-td-empty">
                    Elige un evento arriba.
                  </td>
                </tr>
              ) : asistentesLoading ? (
                <tr>
                  <td colSpan={2} className="admin-td-empty">
                    Cargando…
                  </td>
                </tr>
              ) : asistentes.length === 0 ? (
                <tr>
                  <td colSpan={2} className="admin-td-empty">
                    Nadie ha confirmado asistencia a este evento.
                  </td>
                </tr>
              ) : (
                asistentes.map((row) => {
                  const p = row.profiles
                  return (
                    <tr key={row.id}>
                      <td>{p?.nombre ?? '—'}</td>
                      <td>{p?.carrera ?? '—'}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
