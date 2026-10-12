import React from 'react';
import { Building2, Search, Download, Upload, Sun, Moon, Plus, LogOut, ShieldCheck, User, Globe } from 'lucide-react';

export default function Header({ 
  currentUser,
  searchTerm, 
  setSearchTerm, 
  theme, 
  toggleTheme, 
  onExport, 
  onImportTrigger, 
  onOpenAddRoom,
  onOpenLogin,
  onLogout,
  onNavigateToPublic
}) {
  const isOwner = currentUser?.role === 'owner';
  const isMember = currentUser?.role === 'member';

  return (
    <header className="top-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
      <div className="header-brand">
        <div className="header-logo">
          <Building2 size={24} />
        </div>
        <div>
          <h1 className="brand-title">Sakhare Plot Hostel</h1>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {isOwner ? '👑 Owner Admin (Full Edit/Delete)' : isMember ? '🎓 Member Student Portal' : '🌐 Page 3: Public Shared Link (Rooms & Paid/Unpaid)'}
          </span>
        </div>
      </div>

      {/* 3 Pages Portal Selector */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.35rem', 
        background: 'var(--bg-surface)', 
        padding: '0.25rem', 
        borderRadius: 'var(--radius-full)', 
        border: '1px solid var(--border-color)' 
      }}>
        <button
          type="button"
          className={`btn btn-sm ${!currentUser ? 'btn-primary' : 'btn-secondary'}`}
          style={{ 
            borderRadius: 'var(--radius-full)', 
            fontSize: '0.75rem', 
            padding: '0.35rem 0.75rem',
            fontWeight: 700 
          }}
          onClick={() => {
            if (currentUser) onLogout();
            else if (onNavigateToPublic) onNavigateToPublic();
          }}
          title="Page 3: Public Shared Link — View who is in which room and Paid/Unpaid rent (Read-Only)"
        >
          <Globe size={14} />
          <span>3. Public View (Paid/Unpaid)</span>
        </button>

        <button
          type="button"
          className={`btn btn-sm ${isMember ? 'btn-primary' : 'btn-secondary'}`}
          style={{ 
            borderRadius: 'var(--radius-full)', 
            fontSize: '0.75rem', 
            padding: '0.35rem 0.75rem',
            fontWeight: 700 
          }}
          onClick={() => onOpenLogin('member')}
          title="Page 2: Member Portal — Student login for my room and payments"
        >
          <User size={14} />
          <span>2. Member Login</span>
        </button>

        <button
          type="button"
          className={`btn btn-sm ${isOwner ? 'btn-primary' : 'btn-secondary'}`}
          style={{ 
            borderRadius: 'var(--radius-full)', 
            fontSize: '0.75rem', 
            padding: '0.35rem 0.75rem',
            fontWeight: 700 
          }}
          onClick={() => onOpenLogin('owner')}
          title="Page 1: Owner Admin — Full control to add, edit and delete rooms & residents"
        >
          <ShieldCheck size={14} />
          <span>1. Owner Admin (Edit/Delete)</span>
        </button>
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
        {isOwner && (
          <>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={onExport}
              title="Download JSON Backup"
            >
              <Download size={16} />
              <span>Export JSON</span>
            </button>

            <button 
              className="btn btn-secondary btn-sm" 
              onClick={onImportTrigger}
              title="Import JSON Backup"
            >
              <Upload size={16} />
              <span>Import</span>
            </button>

            <button 
              className="btn btn-primary btn-sm"
              onClick={onOpenAddRoom}
            >
              <Plus size={16} />
              <span>Add Room</span>
            </button>
          </>
        )}

        <button 
          className="btn btn-secondary btn-sm" 
          onClick={toggleTheme}
          title="Toggle Light / Dark Mode"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
            <span style={{ 
              background: isOwner ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)', 
              color: isOwner ? 'var(--accent-primary)' : '#10b981', 
              padding: '0.15rem 0.5rem', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '0.75rem', 
              fontWeight: 700 
            }}>
              {isOwner ? '👑 Owner' : '🎓 Member'}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser.name.split(' ')[0]}
            </span>
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ padding: '0.2rem 0.4rem', border: 'none', background: 'transparent', color: 'var(--color-danger)' }}
              onClick={onLogout}
              title="Logout / Switch Account"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
