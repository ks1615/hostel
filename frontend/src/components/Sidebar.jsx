import React from 'react';
import { LayoutGrid, Users, CreditCard, Wrench, BarChart3, Database, Megaphone, LogIn, ShieldAlert } from 'lucide-react';
import { calculateStorageStats } from '../utils/storage';

export default function Sidebar({ 
  currentUser, 
  activeTab, 
  setActiveTab, 
  roomCount, 
  residentCount, 
  pendingPaymentsCount, 
  openMaintenanceCount, 
  noticeCount,
  onOpenLogin 
}) {
  const stats = calculateStorageStats();
  const isOwner = currentUser?.role === 'owner';
  const isMember = currentUser?.role === 'member';

  // Navigation items based on user role
  let navItems = [];

  if (isOwner) {
    navItems = [
      { id: 'rooms', label: 'Rooms & Floor Grid', icon: LayoutGrid, count: roomCount },
      { id: 'notices', label: 'Notices & Bulletins', icon: Megaphone, count: noticeCount > 0 ? noticeCount : null },
      { id: 'residents', label: 'Residents Directory', icon: Users, count: residentCount },
      { id: 'payments', label: 'Fees & Rent Payments', icon: CreditCard, count: pendingPaymentsCount > 0 ? `${pendingPaymentsCount} Due` : null },
      { id: 'maintenance', label: 'Maintenance & Complaints', icon: Wrench, count: openMaintenanceCount > 0 ? openMaintenanceCount : null },
      { id: 'analytics', label: 'Occupancy Analytics', icon: BarChart3 },
      { id: 'storage', label: 'Data Storage & Backup', icon: Database }
    ];
  } else if (isMember) {
    navItems = [
      { id: 'member_portal', label: 'My Resident Dashboard', icon: Users },
      { id: 'rooms', label: 'Rooms & Amenities', icon: LayoutGrid, count: roomCount },
      { id: 'notices', label: 'Hostel Notices', icon: Megaphone, count: noticeCount > 0 ? noticeCount : null }
    ];
  } else {
    // Public / Shared Link Visitor (Read-Only)
    navItems = [
      { id: 'rooms', label: 'Rooms & Floor Grid', icon: LayoutGrid, count: roomCount },
      { id: 'residents', label: 'Residents Directory', icon: Users, count: residentCount },
      { id: 'notices', label: 'Notices & Bulletins', icon: Megaphone, count: noticeCount > 0 ? noticeCount : null },
      { id: 'payments', label: 'Fees & Rent Payments', icon: CreditCard, count: pendingPaymentsCount > 0 ? `${pendingPaymentsCount} Due` : null },
      { id: 'maintenance', label: 'Maintenance & Complaints', icon: Wrench, count: openMaintenanceCount > 0 ? openMaintenanceCount : null },
      { id: 'analytics', label: 'Occupancy Analytics', icon: BarChart3 }
    ];
  }

  return (
    <aside className="sidebar">
      <div className="nav-group-title">
        {isOwner ? 'OWNER ADMIN MENU' : isMember ? 'RESIDENT MENU' : 'VISITOR DIRECTORY'}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.count && (
                <span className="nav-badge">{item.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Guest Login Banner */}
      {!currentUser && (
        <div style={{ 
          marginTop: 'auto', 
          background: 'rgba(99, 102, 241, 0.1)', 
          border: '1px solid rgba(99, 102, 241, 0.25)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1rem',
          textAlign: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
            <ShieldAlert size={16} />
            <span>Read-Only Mode</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Only verified Owner can edit room and hostel details.
          </p>
          <button 
            className="btn btn-primary btn-sm" 
            style={{ width: '100%', fontSize: '0.8rem' }}
            onClick={onOpenLogin}
          >
            <LogIn size={14} />
            <span>Owner / Member Login</span>
          </button>
        </div>
      )}

      {/* Storage widget visible to Owner only */}
      {isOwner && (
        <div className="storage-widget">
          <div className="storage-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Database size={14} color="var(--accent-primary)" />
              Database Health
            </span>
            <span>{stats.kb} KB</span>
          </div>
          <div className="storage-bar">
            <div className="storage-fill" style={{ width: `${Math.max(5, stats.percent)}%` }}></div>
          </div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
            Admin edit access enabled.
          </div>
        </div>
      )}
    </aside>
  );
}
