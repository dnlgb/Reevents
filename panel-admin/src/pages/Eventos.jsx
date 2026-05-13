import { useEffect, useState } from 'react'

export function EventModal({
  eventFormOpen,
  setEventFormOpen,
  eventSaving,
  editingEventId,
  eventForm,
  setEventForm,
  saveEvent,
  categorias,
  editingImagenUrl,
  onCreateCategoria,
}) {
  const [imagenFile, setImagenFile] = useState(null)
  const [imagenPreview, setImagenPreview] = useState('')
  const [showNewCat, setShowNewCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [creatingCat, setCreatingCat] = useState(false)

  useEffect(() => {
    if (!eventFormOpen) {
      setImagenPreview((prev) => {
        if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
        return ''
      })
      setImagenFile(null)
      setShowNewCat(false)
      setNewCatName('')
    }
  }, [eventFormOpen])

  const handleCreateCat = async (e) => {
    e?.preventDefault()
    const nombre = newCatName.trim()
    if (!nombre) return
    setCreatingCat(true)
    try {
      await onCreateCategoria(nombre)
      setEventForm((f) => ({ ...f, categoria: nombre }))
      setNewCatName('')
      setShowNewCat(false)
    } catch (err) {
      alert(err.message ?? 'Error al crear la categoría')
    } finally {
      setCreatingCat(false)
    }
  }

  return (
    <div
      className="admin-modal-overlay"
      role="presentation"
      onClick={() => !eventSaving && setEventFormOpen(false)}
    >
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="admin-modal-title">
          {editingEventId ? 'Editar evento' : 'Nuevo evento'}
        </h3>
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
              {categorias.length === 0 ? (
                <option value="" disabled>Sin categorías — crea una abajo</option>
              ) : (
                categorias.map((c) => (
                  <option key={c.id} value={c.nombre}>{c.nombre}</option>
                ))
              )}
            </select>
            <button
              type="button"
              className="admin-btn-link"
              onClick={() => setShowNewCat((v) => !v)}
            >
              {showNewCat ? '✕ Cancelar' : '+ Nueva categoría'}
            </button>
            {showNewCat && (
              <div className="admin-inline-cat-form">
                <input
                  className="admin-input admin-input--sm"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCreateCat() } }}
                  placeholder="Nombre de la nueva categoría"
                  maxLength={60}
                  autoFocus
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-small"
                  disabled={creatingCat}
                  onClick={handleCreateCat}
                >
                  {creatingCat ? '…' : 'Crear y seleccionar'}
                </button>
              </div>
            )}
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
                  if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
                  return URL.createObjectURL(file)
                })
                setImagenFile(file)
              }}
            />
          </label>
          {(imagenPreview || editingImagenUrl) && (
            <img
              src={imagenPreview || editingImagenUrl}
              alt=""
              style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8 }}
            />
          )}
          <div className="admin-modal-actions">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              disabled={eventSaving}
              onClick={() => setEventFormOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={eventSaving}
            >
              {eventSaving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
