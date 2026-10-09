import React, { useState } from 'react';
import { ShieldCheck, User, KeyRound, Smartphone, Sparkles, X, Building2, CheckCircle2 } from 'lucide-react';

export default function LoginModal({ residents, onLogin, onClose }) {
  const [roleTab, setRoleTab] = useState('owner'); // 'owner' or 'member'

  // Owner Form State
  const [ownerUsername, setOwnerUsername] = useState('admin');
  const [ownerPassword, setOwnerPassword] = useState('admin123');

  // Member Form State
  const [selectedResidentId, setSelectedResidentId] = useState(
    residents && residents.length > 0 ? residents[0].id : ''
  );
  const [memberPin, setMemberPin] = useState('1234');

  const handleOwnerSubmit = (e) => {
    e.preventDefault();
    if (!ownerUsername.trim() || !ownerPassword.trim()) {
      alert('Please enter username and password');
      return;
    }

    onLogin({
      role: 'owner',
      name: 'Owner (Sakhare Plot Management)',
      username: ownerUsername,
      email: 'owner@sakharehostel.com'
    });
  };

  const handleMemberSubmit = (e) => {
    e.preventDefault();
    const resident = residents.find(r => r.id === selectedResidentId);
    if (!resident) {
      alert('Please select your resident account');
      return;
    }

    onLogin({
      role: 'member',
      id: resident.id,
      name: resident.name,
      phone: resident.phone,
      email: resident.email,
      roomId: resident.roomId,
      roomNumber: resident.roomNumber,
      bedNo: resident.bedNo
    });
  };

  const handleQuickOwnerLogin = () => {
    onLogin({
      role: 'owner',
      name: 'Owner (Sakhare Plot Management)',
      username: 'admin',
      email: 'owner@sakharehostel.com'
    });
  };

  const handleQuickMemberLogin = (resident) => {
    onLogin({
      role: 'member',
      id: resident.id,
      name: resident.name,
      phone: resident.phone,
      email: resident.email,
      roomId: resident.roomId,
      roomNumber: resident.roomNumber,
      bedNo: resident.bedNo
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)', 
              color: '#fff', 
              width: '42px', 
              height: '42px', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justify: 'center' 
            }}>
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.2rem' }}>Sakhare Plot Hostel Login</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Select your account role to continue</span>
            </div>
          </div>
          {onClose && (
            <button className="modal-close" onClick={onClose}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Role Selector Tabs */}
        <div style={{ 
          display: 'flex', 
          background: 'var(--bg-surface)', 
          padding: '0.4rem', 
          margin: '1.25rem 1.5rem 0', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)' 
        }}>
          <button
            type="button"
            className={`nav-link ${roleTab === 'owner' ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }}
            onClick={() => setRoleTab('owner')}
          >
            <ShieldCheck size={16} />
            <span>Owner / Admin</span>
          </button>
          <button
            type="button"
            className={`nav-link ${roleTab === 'member' ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }}
            onClick={() => setRoleTab('member')}
          >
            <User size={16} />
            <span>Hostel Member</span>
          </button>
        </div>

        <div className="modal-body">
          {/* Owner Login Form */}
          {roleTab === 'owner' && (
            <form onSubmit={handleOwnerSubmit}>
              <div style={{ 
                background: 'rgba(99, 102, 241, 0.08)', 
                border: '1px solid rgba(99, 102, 241, 0.2)', 
                borderRadius: 'var(--radius-md)', 
                padding: '0.75rem 1rem', 
                fontSize: '0.8rem', 
                color: 'var(--text-secondary)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <ShieldCheck size={18} color="var(--accent-primary)" />
                <span>Full administrative access to manage rooms, residents, rent & notices.</span>
              </div>

              <div className="form-group">
                <label>Owner Username / Email</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="admin"
                    value={ownerUsername}
                    onChange={(e) => setOwnerUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••"
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <ShieldCheck size={18} />
                <span>Login as Owner</span>
              </button>

              <div style={{ margin: '1rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                <span style={{ background: 'var(--bg-surface)', padding: '0 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', position: 'relative', top: '-10px' }}>
                  DEMO QUICK ACCESS
                </span>
              </div>

              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ width: '100%' }}
                onClick={handleQuickOwnerLogin}
              >
                <Sparkles size={16} color="var(--accent-primary)" />
                <span>One-Click Demo Owner Login</span>
              </button>
            </form>
          )}

          {/* Hostel Member / Resident Login Form */}
          {roleTab === 'member' && (
            <form onSubmit={handleMemberSubmit}>
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.08)', 
                border: '1px solid rgba(16, 185, 129, 0.2)', 
                borderRadius: 'var(--radius-md)', 
                padding: '0.75rem 1rem', 
                fontSize: '0.8rem', 
                color: 'var(--text-secondary)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <User size={18} color="#10b981" />
                <span>Resident portal to view room details, pay rent via UPI QR & check notices.</span>
              </div>

              <div className="form-group">
                <label>Select Resident Student Account</label>
                <select 
                  className="form-select"
                  value={selectedResidentId}
                  onChange={(e) => setSelectedResidentId(e.target.value)}
                >
                  {residents && residents.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Room {r.roomNumber} - Bed #{r.bedNo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Passcode / PIN</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="1234"
                  value={memberPin}
                  onChange={(e) => setMemberPin(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <User size={18} />
                <span>Login as Hostel Member</span>
              </button>

              {residents && residents.length > 0 && (
                <>
                  <div style={{ margin: '1rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <span style={{ background: 'var(--bg-surface)', padding: '0 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', position: 'relative', top: '-10px' }}>
                      DEMO RESIDENT ACCOUNTS
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '140px', overflowY: 'auto' }}>
                    {residents.slice(0, 3).map(res => (
                      <button
                        key={res.id}
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ justifyContent: 'space-between', fontSize: '0.8rem' }}
                        onClick={() => handleQuickMemberLogin(res)}
                      >
                        <span style={{ fontWeight: 600 }}>🎓 {res.name} (Room {res.roomNumber})</span>
                        <span style={{ color: 'var(--accent-primary)' }}>Quick Login →</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
