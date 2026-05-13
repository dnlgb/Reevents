import { Calendar, Users, Flame, MapPin, UserCheck } from 'lucide-react'
import { AdminHeader } from '../components/AdminHeader.jsx'
import { EventModal } from './Eventos.jsx'
import { AsistentesTab } from './Asistentes.jsx'
import { CategoriasTab } from './Categorias.jsx'

function StatCard({ label, value, small, icon: Icon }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon-wrap">
        <Icon size={20} color="#1a2e5a" strokeWidth={2} />
      </div>
      <span className="admin-stat-label">{label}</span>
      <span className={`admin-stat-value${small ? ' admin-stat-value--small' : ''}`}>{value}</span>
    </div>
  )
}

function ActivityChart({ events }) {
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 2 + i, 1)
    return {
      label: d.toLocaleString('es-CO', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth(),
      count: 0,
    }
  })

  for (const ev of events) {
    if (!ev.fecha) continue
    const d = new Date(ev.fecha)
    const m = months.find((mo) => mo.year === d.getFullYear() && mo.month === d.getMonth())
    if (m) m.count++
  }

  const max = Math.max(...months.map((m) => m.count), 1)

  return (
    <section className="admin-chart-section">
      <h3 className="admin-chart-title">Actividad · eventos por mes</h3>
      <div className="admin-chart">
        {months.map((m, i) => (
          <div key={i} className="admin-chart-col">
            <span className="admin-chart-val">{m.count > 0 ? m.count : ''}</span>
            <div className="admin-chart-track">
              <div
                className="admin-chart-bar"
                style={{ height: `${(m.count / max) * 100}%` }}
              />
            </div>
            <span className="admin-chart-lbl">{m.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function EventCard({ ev, asistenciasCount, openEditEvent, deleteEvent }) {
  const count = asistenciasCount[String(ev.id)] ?? 0
  const fecha = ev.fecha ? String(ev.fecha).slice(0, 10) : '—'
  const initials = (ev.titulo ?? '?').slice(0, 2).toUpperCase()

  return (
    <div className="admin-event-card">
      <div className="admin-event-img-wrap">
        {ev.imagen_url ? (
          <img src={ev.imagen_url} alt={ev.titulo} className="admin-event-img" />
        ) : (
          <div className="admin-event-img-placeholder">{initials}</div>
        )}
      </div>
      <div className="admin-event-info">
        <p className="admin-event-title">{ev.titulo}</p>
        <p className="admin-event-meta"><Calendar size={13} strokeWidth={1.75} /> {fecha}</p>
        <p className="admin-event-meta"><MapPin size={13} strokeWidth={1.75} /> {ev.lugar || '—'}</p>
        <p className="admin-event-meta"><UserCheck size={13} strokeWidth={1.75} /> {count} asistente{count !== 1 ? 's' : ''}</p>
        <div className="admin-event-actions">
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
        </div>
      </div>
    </div>
  )
}

export function Dashboard({
  onLogout,
  statsLoading,
  stats,
  asistenciasCount,
  events,
  eventsLoading,
  openCreateEvent,
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
  activeTab,
  setActiveTab,
  selectedEventId,
  setSelectedEventId,
  asistentes,
  asistentesLoading,
  categoriasLoading,
  categoriaForm,
  setCategoriaForm,
  categoriaSaving,
  createCategoria,
  deleteCategoria,
  onCreateCategoria,
}) {
  return (
    <div className="admin-app">
      <AdminHeader onLogout={onLogout} />

      <main className="admin-main">
        {/* Stats */}
        {statsLoading ? (
          <p className="admin-muted">Cargando estadísticas…</p>
        ) : (
          <div className="admin-stats-grid">
            <StatCard label="Total eventos" value={stats.eventos} icon={Calendar} />
            <StatCard label="Total usuarios" value={stats.usuarios} icon={Users} />
            <StatCard label="Evento más popular" value={stats.popularLabel} small icon={Flame} />
          </div>
        )}

        {/* Chart */}
        {!eventsLoading && events.length > 0 && (
          <ActivityChart events={events} />
        )}

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab${activeTab === 'eventos' ? ' admin-tab--active' : ''}`}
            onClick={() => setActiveTab('eventos')}
          >
            Gestión de eventos
          </button>
          <button
            type="button"
            className={`admin-tab${activeTab === 'asistentes' ? ' admin-tab--active' : ''}`}
            onClick={() => setActiveTab('asistentes')}
          >
            Asistentes por evento
          </button>
          <button
            type="button"
            className={`admin-tab${activeTab === 'categorias' ? ' admin-tab--active' : ''}`}
            onClick={() => setActiveTab('categorias')}
          >
            Categorías
          </button>
        </div>

        {/* Tab: eventos */}
        {activeTab === 'eventos' && (
          <div className="admin-events-list">
            {eventsLoading ? (
              <p className="admin-muted">Cargando eventos…</p>
            ) : events.length === 0 ? (
              <p className="admin-muted">No hay eventos registrados.</p>
            ) : (
              events.map((ev) => (
                <EventCard
                  key={ev.id}
                  ev={ev}
                  asistenciasCount={asistenciasCount}
                  openEditEvent={openEditEvent}
                  deleteEvent={deleteEvent}
                />
              ))
            )}
          </div>
        )}

        {/* Tab: asistentes */}
        {activeTab === 'asistentes' && (
          <AsistentesTab
            events={events}
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
            asistentes={asistentes}
            asistentesLoading={asistentesLoading}
          />
        )}

        {/* Tab: categorias */}
        {activeTab === 'categorias' && (
          <CategoriasTab
            categorias={categorias}
            categoriasLoading={categoriasLoading}
            categoriaForm={categoriaForm}
            setCategoriaForm={setCategoriaForm}
            categoriaSaving={categoriaSaving}
            createCategoria={createCategoria}
            deleteCategoria={deleteCategoria}
          />
        )}
      </main>

      {/* Floating action button */}
      {activeTab === 'eventos' && (
        <button type="button" className="admin-fab" onClick={openCreateEvent}>
          + Crear evento
        </button>
      )}

      {/* Event modal */}
      {eventFormOpen && (
        <EventModal
          eventFormOpen={eventFormOpen}
          setEventFormOpen={setEventFormOpen}
          eventSaving={eventSaving}
          editingEventId={editingEventId}
          eventForm={eventForm}
          setEventForm={setEventForm}
          saveEvent={saveEvent}
          categorias={categorias}
          editingImagenUrl={editingImagenUrl}
          onCreateCategoria={onCreateCategoria}
        />
      )}
    </div>
  )
}
