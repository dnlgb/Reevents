export function Login({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loginError,
  loginLoading,
  handleLogin,
}) {
  return (
    <div className="admin-app admin-app--center">
        <div className="admin-card admin-card--narrow">
          <h2 className="admin-card-title">Acceso administrador</h2>
          <p className="admin-muted admin-mb">Corporación Universitaria Reformada · ReEvents</p>
          <form className="admin-form" onSubmit={handleLogin}>
            <label className="admin-label">
              Correo
              <input
                className="admin-input"
                type="email"
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </label>
            <label className="admin-label">
              Contraseña
              <input
                className="admin-input"
                type="password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </label>
            {loginError ? <p className="admin-error">{loginError}</p> : null}
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loginLoading}>
              {loginLoading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
  )
}
