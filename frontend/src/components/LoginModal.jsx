import React, { useState } from 'react';
import { ShieldCheck, User, KeyRound, X, Building2, AlertCircle } from 'lucide-react';

export default function LoginModal({ residents, onLogin, onClose }) {
  const [roleTab, setRoleTab] = useState('owner'); // 'owner' or 'member'

  // Owner Form State - Empty by default, no password shown or leaked
  const [ownerUsername, setOwnerUsername] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');

  // Member Form State - Empty by default
  const [selectedResidentId, setSelectedResidentId] = useState(
    residents && residents.length > 0 ? residents[0].id : ''
  );
  const [memberPin, setMemberPin] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleOwnerSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const username = ownerUsername.trim().toLowerCase();
    const password = ownerPassword.trim();

    if (!username || !password) {
      setErrorMessage('Please enter both owner username and password.');
      return;
    }

    // Owner credential check (admin / admin123)
    if ((username === 'admin' || username === 'owner') && password === 'admin123') {
      onLogin({
        role: 'owner',
        name: 'Owner (Sakhare Plot Management)',
        username: 'admin',
        email: 'owner@sakharehostel.com'
      });
    } else {
      setErrorMessage('Incorrect owner username or password. Access denied.');
    }
  };

  const handleMemberSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const resident = residents.find(r => r.id === selectedResidentId);
    if (!resident) {
      setErrorMessage('Please select your resident account.');
      return;
    }

    if (!memberPin.trim()) {
      setErrorMessage('Please enter your 4-digit PIN.');
      return;
    }

    // Default PIN is 1234
    if (memberPin.trim() === '1234') {
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
    } else {
      setErrorMessage('Incorrect resident PIN. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
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
              justifyContent: 'center' 
            }}>
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.2rem' }}>Sakhare Plot Hostel Login</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sign in to manage hostel data</span>
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
            onClick={() => {
              setRoleTab('owner');
              setErrorMessage('');
            }}
          >
            <ShieldCheck size={16} />
            <span>Owner / Admin</span>
          </button>
          <button
            type="button"
            className={`nav-link ${roleTab === 'member' ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }}
            onClick={() => {
              setRoleTab('member');
              setErrorMessage('');
            }}
          >
            <User size={16} />
            <span>Hostel Member</span>
          </button>
        </div>

        <div className="modal-body">
          {errorMessage && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.12)', 
              border: '1px solid rgba(239, 68, 68, 0.3)', 
              color: '#ef4444', 
              borderRadius: 'var(--radius-md)', 
              padding: '0.75rem 1rem', 
              fontSize: '0.825rem', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

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
                <span>Owner login required to add, edit or delete hostel records.</span>
              </div>

              <div className="form-group">
                <label>Owner Username</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter owner username"
                  value={ownerUsername}
                  onChange={(e) => setOwnerUsername(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Enter owner password"
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}>
                <ShieldCheck size={18} />
                <span>Login as Owner</span>
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
                <span>Resident portal to view room details, receipts & pay dues via UPI QR.</span>
              </div>

              <div className="form-group">
                <label>Select Resident Account</label>
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
                <label>Resident PIN</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Enter 4-digit PIN"
                  value={memberPin}
                  onChange={(e) => setMemberPin(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <User size={18} />
                <span>Login as Member</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
