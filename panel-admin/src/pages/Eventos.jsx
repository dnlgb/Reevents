import { useEffect, useState } from 'react'
import { AdminHeader } from '../components/AdminHeader.jsx'

export function Eventos({
  onLogout,
  onBackDashboard,
  openCreateEvent,
  events,
  eventsLoading,
  openEditEvent,
  deleteEvent,
  eventFormOpen,
  setEventFormOpen,
  eventSaving,
  editingEventId,
  eventForm,
  setEventForm,
  saveEvent,
  categorias,
  editingImagenUrl,
}) {
  const [imagenFile, setImagenFile] = useState(null)
  const [imagenPreview, setImagenPreview] = useState('')

  useEffect(() => {
    if (!eventFormOpen) {
      setImagenPreview((prev) => {
        if (prev && prev.startsWith('blob:')) {
          URL.revokeObjectURL(prev)
        }
        return ''
      })
      setImagenFile(null)
    }
  }, [eventFormOpen])

  return (
    <div className="admin-app">
      <AdminHeader onLogout={onLogout} />
      <main className="admin-main">
        <nav className="admin-nav">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onBackDashboard}>
            ← Dashboard
          </button>
        </nav>
        <div className="admin-toolbar">
          <h2 className="admin-section-title">Eventos</h2>
          <button type="button" className="admin-btn admin-btn-primary" onClick={openCreateEvent}>
            Crear evento
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Fecha</th>
                <th>Lugar</th>
                <th className="admin-th-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventsLoading ? (
                <tr>
                  <td colSpan={5} className="admin-td-empty">
                    Cargando…
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-td-empty">
                    No hay eventos registrados.
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.titulo}</td>
                    <td>{ev.categoria}</td>
                    <td>{ev.fecha ? String(ev.fecha).slice(0, 10) : '—'}</td>
                    <td>{ev.lugar}</td>
                    <td className="admin-td-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-small admin-btn-secondary"
                        onClick={() => openEditEvent(ev)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-small admin-btn-danger"
                        onClick={() => deleteEvent(ev)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
      {eventFormOpen ? (
        <div className="admin-modal-overlay" role="presentation" onClick={() => !eventSaving && setEventFormOpen(false)}>
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="admin-modal-title">{editingEventId ? 'Editar evento' : 'Nuevo evento'}</h3>
            <form className="admin-form" onSubmit={(e) => saveEvent(e, imagenFile)}>
              <label className="admin-label">
                Título
                <input
                  className="admin-input"
                  value={eventForm.titulo}
                  onChange={(e) => setEventForm((f) => ({ ...f, titulo: e.target.value }))}
                  required
                />
              </label>
              <label className="admin-label">
                Descripción
                <textarea
                  className="admin-input admin-textarea"
                  rows={4}
                  value={eventForm.descripcion}
                  onChange={(e) => setEventForm((f) => ({ ...f, descripcion: e.target.value }))}
                />
              </label>
              <label className="admin-label">
                Categoría
                <select
                  className="admin-input"
                  value={eventForm.categoria}
                  onChange={(e) => setEventForm((f) => ({ ...f, categoria: e.target.value }))}
                >
                  {categorias.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <div className="admin-form-row">
                <label className="admin-label">
                  Fecha
                  <input
                    className="admin-input"
                    type="date"
                    value={eventForm.fecha}
                    onChange={(e) => setEventForm((f) => ({ ...f, fecha: e.target.value }))}
                  />
                </label>
                <label className="admin-label">
                  Hora
                  <input
                    className="admin-input"
                    type="time"
                    value={eventForm.hora}
                    onChange={(e) => setEventForm((f) => ({ ...f, hora: e.target.value }))}
                  />
                </label>
              </div>
              <label className="admin-label">
                Lugar
                <input
                  className="admin-input"
                  value={eventForm.lugar}
                  onChange={(e) => setEventForm((f) => ({ ...f, lugar: e.target.value }))}
                  required
                />
              </label>
              <label className="admin-label">
                Imagen
                <input
                  className="admin-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setImagenPreview((prev) => {
                      if (prev && prev.startsWith('blob:')) {
                        URL.revokeObjectURL(prev)
                      }
                      return URL.createObjectURL(file)
                    })
                    setImagenFile(file)
                  }}
                />
              </label>
              {imagenPreview || editingImagenUrl ? (
                <img src={imagenPreview || editingImagenUrl} alt="" />
              ) : null}
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  disabled={eventSaving}
                  onClick={() => setEventFormOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={eventSaving}>
                  {eventSaving ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
