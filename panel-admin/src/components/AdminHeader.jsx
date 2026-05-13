export function AdminHeader({ onLogout }) {
  return (
    <header className="admin-header">
      <h1 className="admin-header-title">Administrador · ReEvents</h1>
      <button type="button" className="admin-btn admin-btn-ghost" onClick={onLogout}>
        Cerrar sesión
      </button>
    </header>
  )
}
