export function CategoriasTab({
  categorias,
  categoriasLoading,
  categoriaForm,
  setCategoriaForm,
  categoriaSaving,
  createCategoria,
  deleteCategoria,
}) {
  return (
    <div>
      <h3 className="admin-section-title">Nueva categoría</h3>
      <form className="admin-categorias-form" onSubmit={createCategoria}>
        <label className="admin-label">
          Nombre
          <input
            className="admin-input"
            value={categoriaForm.nombre}
            onChange={(e) => setCategoriaForm((f) => ({ ...f, nombre: e.target.value }))}
            required
            placeholder="Ej. Conferencia"
            maxLength={60}
          />
        </label>
        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          disabled={categoriaSaving}
          style={{ alignSelf: 'flex-start' }}
        >
          {categoriaSaving ? 'Guardando…' : 'Crear categoría'}
        </button>
      </form>

      <h3 className="admin-section-title admin-section-title--mt">
        Categorías registradas
        {categorias.length > 0 && (
          <span className="admin-badge">{categorias.length}</span>
        )}
      </h3>

      {categoriasLoading ? (
        <p className="admin-muted">Cargando…</p>
      ) : categorias.length === 0 ? (
        <p className="admin-muted">No hay categorías registradas aún.</p>
      ) : (
        <div className="admin-categorias-list">
          {categorias.map((cat) => (
            <div key={cat.id} className="admin-categoria-item">
              <span className="admin-categoria-nombre">{cat.nombre}</span>
              <button
                type="button"
                className="admin-btn admin-btn-small admin-btn-danger"
                onClick={() => deleteCategoria(cat)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
