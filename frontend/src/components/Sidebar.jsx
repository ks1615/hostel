import React from 'react';
import { LayoutGrid, Users, CreditCard, Wrench, BarChart3, Database, Megaphone } from 'lucide-react';
import { calculateStorageStats } from '../utils/storage';

export default function Sidebar({ activeTab, setActiveTab, roomCount, residentCount, pendingPaymentsCount, openMaintenanceCount, noticeCount }) {
  const stats = calculateStorageStats();

  const navItems = [
    { id: 'rooms', label: 'Rooms & Floor Grid', icon: LayoutGrid, count: roomCount },
    { id: 'notices', label: 'Notices & Bulletins', icon: Megaphone, count: noticeCount > 0 ? noticeCount : null },
    { id: 'residents', label: 'Residents Directory', icon: Users, count: residentCount },
    { id: 'payments', label: 'Fees & Rent Payments', icon: CreditCard, count: pendingPaymentsCount > 0 ? `${pendingPaymentsCount} Due` : null },
    { id: 'maintenance', label: 'Maintenance & Complaints', icon: Wrench, count: openMaintenanceCount > 0 ? openMaintenanceCount : null },
    { id: 'analytics', label: 'Occupancy Analytics', icon: BarChart3 },
    { id: 'storage', label: 'Data Storage & Backup', icon: Database }
  ];

  return (
    <aside className="sidebar">
      <div className="nav-group-title">MAIN MENU</div>
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

      <div className="storage-widget">
        <div className="storage-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Database size={14} color="var(--accent-primary)" />
            Local Data Storage
          </span>
          <span>{stats.kb} KB</span>
        </div>
        <div className="storage-bar">
          <div className="storage-fill" style={{ width: `${Math.max(5, stats.percent)}%` }}></div>
        </div>
        <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>
          {stats.percent}% of browser 5MB quota used. Saved persistent.
        </div>
      </div>
    </aside>
  );
}
