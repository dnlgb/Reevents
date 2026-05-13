import { useCallback, useEffect, useState } from 'react'
import { supabase } from './lib/supabase.js'
import { Login } from './pages/Login.jsx'
import { Dashboard } from './pages/Dashboard.jsx'

const emptyEventForm = {
  titulo: '',
  descripcion: '',
  categoria: '',
  fecha: '',
  hora: '',
  lugar: '',
}

function App() {
  const [view, setView] = useState('login')
  const [authUser, setAuthUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [stats, setStats] = useState({
    eventos: 0,
    usuarios: 0,
    asistencias: 0,
    popularLabel: '—',
  })
  const [statsLoading, setStatsLoading] = useState(false)
  const [asistenciasCount, setAsistenciasCount] = useState({})

  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [eventFormOpen, setEventFormOpen] = useState(false)
  const [eventForm, setEventForm] = useState(emptyEventForm)
  const [editingEventId, setEditingEventId] = useState(null)
  const [editingEventImagenUrl, setEditingEventImagenUrl] = useState('')
  const [eventSaving, setEventSaving] = useState(false)

  const [categorias, setCategorias] = useState([])
  const [categoriasLoading, setCategoriasLoading] = useState(false)
  const [categoriaForm, setCategoriaForm] = useState({ nombre: '' })
  const [categoriaSaving, setCategoriaSaving] = useState(false)

  const [activeTab, setActiveTab] = useState('eventos')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [asistentes, setAsistentes] = useState([])
  const [asistentesLoading, setAsistentesLoading] = useState(false)

  const ensureAdminProfile = useCallback(async (user) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (error || !profile || profile.role !== 'admin') {
      await supabase.auth.signOut()
      return false
    }
    return true
  }, [])

  const loadDashboardStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const [evRes, prRes, asRes] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'estudiante'),
        supabase.from('asistencias').select('*', { count: 'exact', head: true }),
      ])

      const eventos = evRes.count ?? 0
      const usuarios = prRes.count ?? 0
      const asistenciasTotal = asRes.count ?? 0

      let popularLabel = '—'
      const { data: asRows, error: asErr } = await supabase
        .from('asistencias')
        .select('event_id')

      const counts = {}
      if (!asErr && asRows?.length) {
        for (const row of asRows) {
          const key = String(row.event_id)
          counts[key] = (counts[key] || 0) + 1
        }
        let topId = null
        let topN = 0
        for (const [id, n] of Object.entries(counts)) {
          if (n > topN) {
            topN = n
            topId = id
          }
        }
        if (topId) {
          const { data: ev } = await supabase
            .from('events')
            .select('titulo')
            .eq('id', topId)
            .maybeSingle()
          popularLabel = ev?.titulo
            ? `${ev.titulo} (${topN})`
            : `ID: ${topId} (${topN})`
        }
      }

      setStats({ eventos, usuarios, asistencias: asistenciasTotal, popularLabel })
      setAsistenciasCount(counts)
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const loadEvents = useCallback(async () => {
    setEventsLoading(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('fecha', { ascending: true })

      if (error) throw error
      setEvents(data ?? [])
    } catch {
      setEvents([])
    } finally {
      setEventsLoading(false)
    }
  }, [])

  const loadCategorias = useCallback(async () => {
    setCategoriasLoading(true)
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre', { ascending: true })
      if (error) throw error
      setCategorias(data ?? [])
    } catch {
      setCategorias([])
    } finally {
      setCategoriasLoading(false)
    }
  }, [])

  const createCategoria = async (e) => {
    e.preventDefault()
    setCategoriaSaving(true)
    try {
      const nombre = categoriaForm.nombre.trim()
      const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1)
      const { error } = await supabase.from('categorias').insert({
        nombre: nombreCapitalizado,
      })
      if (error) throw error
      setCategoriaForm({ nombre: '' })
      await loadCategorias()
    } catch (err) {
      alert(err.message ?? 'Error al crear la categoría')
    } finally {
      setCategoriaSaving(false)
    }
  }

  const createCategoriaInline = useCallback(async (nombre) => {
    const { error } = await supabase.from('categorias').insert({ nombre: nombre.trim() })
    if (error) throw error
    await loadCategorias()
  }, [loadCategorias])

  const deleteCategoria = async (cat) => {
    if (!confirm(`¿Eliminar la categoría "${cat.nombre}"? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('categorias').delete().eq('id', cat.id)
    if (error) {
      alert(error.message)
      return
    }
    await loadCategorias()
  }

  useEffect(() => {
    let cancelled = false

    const initSession = async (session) => {
      if (!session?.user) {
        setAuthUser(null)
        setView('login')
        return
      }
      const ok = await ensureAdminProfile(session.user)
      if (cancelled) return
      if (ok) {
        setAuthUser(session.user)
        setView((v) => (v === 'login' ? 'dashboard' : v))
      } else {
        setAuthUser(null)
        setView('login')
        setLoginError('No tienes permisos de administrador')
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return
      initSession(session).finally(() => {
        if (!cancelled) setAuthReady(true)
      })
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      initSession(session)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [ensureAdminProfile])

  useEffect(() => {
    if (!authUser || view !== 'dashboard') return
    loadDashboardStats()
    loadEvents()
    loadCategorias()
  }, [view, authUser, loadDashboardStats, loadEvents, loadCategorias])

  useEffect(() => {
    if (activeTab !== 'asistentes' || !selectedEventId) {
      setAsistentes([])
      return
    }
    let cancelled = false
    setAsistentesLoading(true)

    const fetchAsistentes = async () => {
      const { data: asRows, error } = await supabase
        .from('asistencias')
        .select('id, created_at, user_id')
        .eq('event_id', selectedEventId)

      if (error || !asRows?.length) {
        if (!cancelled) {
          setAsistentes([])
          setAsistentesLoading(false)
        }
        return
      }

      const userIds = asRows.map((a) => a.user_id)

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, nombre, carrera')
        .in('id', userIds)

      if (cancelled) return

      const merged = asRows.map((a) => ({
        ...a,
        profiles: profilesData?.find((p) => p.id === a.user_id) ?? null,
      }))

      setAsistentes(merged)
      setAsistentesLoading(false)
    }

    fetchAsistentes()
    return () => { cancelled = true }
  }, [activeTab, selectedEventId])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      })
      if (error) {
        setLoginError(error.message)
        return
      }
      const user = data.user
      if (!user) {
        setLoginError('No se pudo iniciar sesión')
        return
      }
      const { data: profile, error: pErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (pErr || !profile || profile.role !== 'admin') {
        await supabase.auth.signOut()
        setLoginError('No tienes permisos de administrador')
        return
      }
      setAuthUser(user)
      setView('dashboard')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setAuthUser(null)
    setView('login')
    setLoginEmail('')
    setLoginPassword('')
  }

  const openCreateEvent = () => {
    setEditingEventId(null)
    setEditingEventImagenUrl('')
    setEventForm({ ...emptyEventForm, categoria: categorias[0]?.nombre ?? '' })
    setEventFormOpen(true)
  }

  const openEditEvent = (ev) => {
    setEditingEventId(ev.id)
    setEditingEventImagenUrl(ev.imagen_url ?? '')
    setEventForm({
      titulo: ev.titulo ?? '',
      descripcion: ev.descripcion ?? '',
      categoria: ev.categoria ?? 'Conferencia',
      fecha: ev.fecha ? String(ev.fecha).slice(0, 10) : '',
      hora: ev.hora ? String(ev.hora).slice(0, 5) : String(ev.hora ?? ''),
      lugar: ev.lugar ?? '',
    })
    setEventFormOpen(true)
  }

  const saveEvent = async (e, imagenFile = null) => {
    e.preventDefault()
    setEventSaving(true)
    try {
      const payload = {
        titulo: eventForm.titulo.trim(),
        descripcion: eventForm.descripcion.trim(),
        categoria: eventForm.categoria,
        fecha: eventForm.fecha || null,
        hora: eventForm.hora || null,
        lugar: eventForm.lugar.trim(),
      }
      if (imagenFile) {
        const fileName = `${Date.now()}-${imagenFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('eventos')
          .upload(fileName, imagenFile)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage
          .from('eventos')
          .getPublicUrl(fileName)
        payload.imagen_url = urlData.publicUrl
      } else if (editingEventId && editingEventImagenUrl) {
        payload.imagen_url = editingEventImagenUrl
      }
      if (editingEventId) {
        const { error } = await supabase
          .from('events')
          .update(payload)
          .eq('id', editingEventId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('events').insert(payload)
        if (error) throw error
      }
      setEventFormOpen(false)
      setEditingEventId(null)
      setEditingEventImagenUrl('')
      setEventForm(emptyEventForm)
      await loadEvents()
      await loadDashboardStats()
    } catch (err) {
      alert(err.message ?? 'Error al guardar el evento')
    } finally {
      setEventSaving(false)
    }
  }

  const deleteEvent = async (ev) => {
    if (!confirm(`¿Eliminar el evento "${ev.titulo}"? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('events').delete().eq('id', ev.id)
    if (error) {
      alert(error.message)
      return
    }
    await loadEvents()
    await loadDashboardStats()
    if (selectedEventId === String(ev.id)) setSelectedEventId('')
  }

  if (!authReady && view === 'login' && !loginError) {
    return (
      <div className="admin-app admin-app--center">
        <p className="admin-muted">Cargando…</p>
      </div>
    )
  }

  if (view === 'login') {
    return (
      <Login
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        loginError={loginError}
        loginLoading={loginLoading}
        handleLogin={handleLogin}
      />
    )
  }

  return (
    <Dashboard
        onLogout={handleLogout}
        statsLoading={statsLoading}
        stats={stats}
        asistenciasCount={asistenciasCount}
        events={events}
        eventsLoading={eventsLoading}
        openCreateEvent={openCreateEvent}
        openEditEvent={openEditEvent}
        deleteEvent={deleteEvent}
        eventFormOpen={eventFormOpen}
        setEventFormOpen={setEventFormOpen}
        eventSaving={eventSaving}
        editingEventId={editingEventId}
        eventForm={eventForm}
        setEventForm={setEventForm}
        saveEvent={saveEvent}
        categorias={categorias}
        editingImagenUrl={editingEventImagenUrl}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        asistentes={asistentes}
        asistentesLoading={asistentesLoading}
        categoriasLoading={categoriasLoading}
        categoriaForm={categoriaForm}
        setCategoriaForm={setCategoriaForm}
        categoriaSaving={categoriaSaving}
        createCategoria={createCategoria}
        deleteCategoria={deleteCategoria}
        onCreateCategoria={createCategoriaInline}
      />
  )
}

export default App
