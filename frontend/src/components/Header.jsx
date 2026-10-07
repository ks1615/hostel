import React from 'react';
import { Building2, Search, Download, Upload, Sun, Moon, Plus, Database } from 'lucide-react';

export default function Header({ 
  searchTerm, 
  setSearchTerm, 
  theme, 
  toggleTheme, 
  onExport, 
  onImportTrigger, 
  onOpenAddRoom 
}) {
  return (
    <header className="top-header">
      <div className="header-brand">
        <div className="header-logo">
          <Building2 size={24} />
        </div>
        <div>
          <h1 className="brand-title">Sakhare Plot Hostel</h1>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Room Data Storage & UPI Payments</span>
        </div>
      </div>

      <div className="search-box">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search rooms, residents, phones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="header-actions">
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={onExport}
          title="Download Local Storage JSON Backup"
        >
          <Download size={16} />
          <span>Export JSON</span>
        </button>

        <button 
          className="btn btn-secondary btn-sm" 
          onClick={onImportTrigger}
          title="Import JSON Backup into Data Storage"
        >
          <Upload size={16} />
          <span>Import JSON</span>
        </button>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={toggleTheme}
          title="Toggle Light / Dark Mode"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button 
          className="btn btn-primary"
          onClick={onOpenAddRoom}
        >
          <Plus size={18} />
          <span>Add Room</span>
        </button>
      </div>
    </header>
  );
}
