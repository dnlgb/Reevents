export function AdminStyles() {
  return (
    <style>{`
      .admin-app {
        min-height: 100svh;
        box-sizing: border-box;
        text-align: left;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        color: #1a1a1a;
        background: #f4f6f9;
      }
      .admin-app--center {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px 16px;
      }
      .admin-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 16px 20px;
        background: #1B3A6B;
        color: #fff;
      }
      .admin-header-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .admin-main {
        max-width: 1100px;
        margin: 0 auto;
        padding: 24px 20px 48px;
      }
      .admin-nav {
        margin-bottom: 20px;
      }
      .admin-muted {
        margin: 0;
        color: #5c6470;
        font-size: 0.95rem;
      }
      .admin-mb {
        margin-bottom: 20px;
      }
      .admin-card {
        background: #fff;
        border-radius: 12px;
        padding: 28px 24px;
        box-shadow: 0 4px 24px rgba(27, 58, 107, 0.12);
        width: 100%;
        max-width: 420px;
        box-sizing: border-box;
      }
      .admin-card--narrow {
        max-width: 440px;
      }
      .admin-card-title {
        margin: 0 0 8px;
        font-size: 1.35rem;
        color: #1B3A6B;
        font-weight: 600;
      }
      .admin-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .admin-label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        color: #334155;
      }
      .admin-label-inline {
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
      }
      .admin-input {
        padding: 10px 12px;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        font-size: 1rem;
        font-family: inherit;
        color: #0f172a;
        background: #fff;
      }
      .admin-input:focus {
        outline: 2px solid #1B3A6B;
        outline-offset: 1px;
        border-color: #1B3A6B;
      }
      .admin-textarea {
        resize: vertical;
        min-height: 96px;
      }
      .admin-form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      @media (max-width: 520px) {
        .admin-form-row {
          grid-template-columns: 1fr;
        }
      }
      .admin-select-wide {
        min-width: min(100%, 320px);
        flex: 1;
      }
      .admin-error {
        margin: 0;
        color: #b91c1c;
        font-size: 0.875rem;
      }
      .admin-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 10px 18px;
        border-radius: 8px;
        font-size: 0.95rem;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        border: none;
        transition: background 0.15s, opacity 0.15s;
      }
      .admin-btn:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
      .admin-btn-primary {
        background: #1B3A6B;
        color: #fff;
      }
      .admin-btn-primary:hover:not(:disabled) {
        background: #152d54;
      }
      .admin-btn-secondary {
        background: #fff;
        color: #1B3A6B;
        border: 2px solid #1B3A6B;
      }
      .admin-btn-secondary:hover:not(:disabled) {
        background: #eef3f9;
      }
      .admin-btn-ghost {
        background: transparent;
        color: #fff;
        border: 2px solid rgba(255,255,255,0.55);
      }
      .admin-btn-ghost:hover:not(:disabled) {
        background: rgba(255,255,255,0.1);
      }
      .admin-btn-danger {
        background: #fff;
        color: #b91c1c;
        border: 2px solid #fecaca;
      }
      .admin-btn-danger:hover:not(:disabled) {
        background: #fef2f2;
      }
      .admin-btn-small {
        padding: 6px 12px;
        font-size: 0.8rem;
      }
      .admin-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 28px;
      }
      .admin-stat-card {
        background: #fff;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 12px rgba(27, 58, 107, 0.08);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .admin-stat-label {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #64748b;
        font-weight: 600;
      }
      .admin-stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: #1B3A6B;
      }
      .admin-stat-value--small {
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.35;
        word-break: break-word;
      }
      .admin-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      .admin-toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
      }
      .admin-section-title {
        margin: 0 0 16px;
        font-size: 1.25rem;
        color: #1B3A6B;
        font-weight: 600;
      }
      .admin-toolbar .admin-section-title {
        margin: 0;
      }
      .admin-counter {
        margin: 12px 0 16px;
        font-weight: 600;
        color: #334155;
      }
      .admin-table-wrap {
        overflow-x: auto;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(27, 58, 107, 0.08);
        border: 1px solid #e2e8f0;
      }
      .admin-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95rem;
      }
      .admin-table th,
      .admin-table td {
        padding: 12px 14px;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }
      .admin-table th {
        background: #f8fafc;
        color: #1B3A6B;
        font-weight: 600;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      .admin-table tr:last-child td {
        border-bottom: none;
      }
      .admin-th-actions {
        width: 200px;
      }
      .admin-td-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .admin-td-empty {
        text-align: center;
        color: #64748b;
        padding: 28px 16px !important;
      }
      .admin-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        z-index: 50;
        box-sizing: border-box;
      }
      .admin-modal {
        background: #fff;
        border-radius: 12px;
        padding: 24px;
        width: 100%;
        max-width: 480px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 50px rgba(27, 58, 107, 0.2);
      }
      .admin-modal-title {
        margin: 0 0 20px;
        font-size: 1.15rem;
        color: #1B3A6B;
        font-weight: 600;
      }
      .admin-modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 8px;
      }
    `}</style>
  )
}
