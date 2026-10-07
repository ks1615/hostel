import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
        {toast.type === 'error' ? (
          <AlertTriangle size={18} color="var(--color-danger)" />
        ) : (
          <CheckCircle2 size={18} color="var(--color-available)" />
        )}
        <span>{toast.message}</span>
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '0.5rem' }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
