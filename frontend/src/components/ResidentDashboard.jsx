import React, { useState } from 'react';
import { Bed, Phone, Calendar, IndianRupee, QrCode, ShieldCheck, Wrench, Bell, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import UpiPaymentModal from './UpiPaymentModal';

export default function ResidentDashboard({ 
  currentUser, 
  rooms, 
  residents, 
  payments, 
  maintenance, 
  notices, 
  upiConfig, 
  onSavePayment, 
  onSaveTicket, 
  showToast 
}) {
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [issueText, setIssueText] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [priority, setPriority] = useState('Medium');

  // Find resident object
  const resident = residents.find(r => r.id === currentUser.id) || {
    id: currentUser.id,
    name: currentUser.name,
    roomNumber: currentUser.roomNumber || '101',
    bedNo: currentUser.bedNo || 1,
    phone: currentUser.phone || '',
    rentStatus: 'Paid',
    monthlyRent: 7500
  };

  // Find assigned room
  const myRoom = rooms.find(r => r.id === resident.roomId) || rooms[0];

  // Roommates
  const roommates = myRoom ? myRoom.beds
    .filter(b => b.residentId && b.residentId !== resident.id)
    .map(b => residents.find(r => r.id === b.residentId))
    .filter(Boolean) : [];

  // My Payments
  const myPayments = payments.filter(p => p.residentId === resident.id || p.residentName === resident.name);

  // My Maintenance Complaints
  const myComplaints = maintenance.filter(m => m.roomNumber === resident.roomNumber);

  const handleCreateComplaint = (e) => {
    e.preventDefault();
    if (!issueText.trim()) {
      alert('Please describe the issue');
      return;
    }
    const newTicket = {
      id: `maint_${Date.now()}`,
      roomId: myRoom?.id || 'room_101',
      roomNumber: resident.roomNumber,
      issue: issueText.trim(),
      category: category,
      priority: priority,
      status: 'Open',
      reportedDate: new Date().toISOString().slice(0, 10)
    };

    onSaveTicket(newTicket);
    setShowMaintenanceModal(false);
    setIssueText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Welcome Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(20, 18, 16, 0.04), rgba(197, 160, 89, 0.12))', 
        border: '1px solid var(--border-highlight)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '1.5rem 2rem', 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="resident-avatar" style={{ width: '54px', height: '54px', fontSize: '1.4rem' }}>
            {resident.name.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome, {resident.name}!</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Resident Student • Sakhare Plot Hostel • <strong>Room {resident.roomNumber} (Bed #{resident.bedNo})</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setShowUpiModal(true)}
          >
            <QrCode size={18} />
            <span>Pay Rent via UPI QR</span>
          </button>
        </div>
      </div>

      {/* Grid: Room Info & Financial Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Room Details Card */}
        <div className="chart-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bed size={20} color="var(--accent-primary)" />
            My Room Details
          </h3>

          {myRoom && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Room Number:</span>
                <strong>Room {myRoom.number} ({myRoom.block})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Assigned Bed:</span>
                <strong style={{ color: 'var(--accent-primary)' }}>Bed #{resident.bedNo}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Room Type:</span>
                <strong>{myRoom.type}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>AC & Bath:</span>
                <strong>{myRoom.isAC ? '⚡ AC' : 'Non-AC'} | {myRoom.attachedBath ? 'Attached' : 'Shared'}</strong>
              </div>

              {/* Roommates */}
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Roommates
                </div>
                {roommates.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No other occupants assigned.</div>
                ) : (
                  roommates.map((rm, idx) => (
                    <div key={idx} style={{ background: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span>🎓 {rm.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}><Phone size={12} style={{ display: 'inline' }} /> {rm.phone}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Rent & Financial Status Card */}
        <div className="chart-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IndianRupee size={20} color="#10b981" />
            Rent & Fee Status
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              background: 'var(--bg-surface)', 
              padding: '1.25rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-color)',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly Rent</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{resident.monthlyRent?.toLocaleString()}</div>
              </div>
              <span className={`badge ${resident.rentStatus === 'Paid' ? 'badge-available' : 'badge-maintenance'}`}>
                {resident.rentStatus}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => setShowUpiModal(true)}
              >
                <QrCode size={16} />
                <span>Pay Rent via UPI</span>
              </button>
            </div>

            {/* Quick UPI Details */}
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-highlight)' }}>
              Hostel UPI VPA: <strong style={{ color: 'var(--accent-primary)', fontFamily: 'monospace' }}>{upiConfig?.upiId || 'sakhareplot@upi'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Receipts History Table */}
      <div className="table-container">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <FileText size={18} color="var(--accent-primary)" />
          <span>My Payment Receipts Log</span>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Period / Month</th>
              <th>Amount Paid</th>
              <th>Mode</th>
              <th>UPI UTR / Ref No.</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myPayments.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  No payment history found yet.
                </td>
              </tr>
            ) : (
              myPayments.map(p => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary)' }}>{p.receiptNo}</td>
                  <td>{p.month}</td>
                  <td style={{ fontWeight: 700, color: '#10b981' }}>₹{p.amount.toLocaleString()}</td>
                  <td>{p.paymentMethod}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.upiRefNo || 'N/A'}</td>
                  <td>{p.date}</td>
                  <td><span className="badge badge-available">✓ {p.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Maintenance Complaints for My Room */}
      <div className="table-container">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <Wrench size={18} color="var(--color-maintenance)" />
            <span>Room {resident.roomNumber} Maintenance Complaints</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowMaintenanceModal(true)}>
            + Report Issue
          </button>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Category</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Reported Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myComplaints.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No active maintenance issues reported for your room.
                </td>
              </tr>
            ) : (
              myComplaints.map(m => (
                <tr key={m.id}>
                  <td style={{ fontFamily: 'monospace' }}>{m.id}</td>
                  <td>{m.category}</td>
                  <td>{m.issue}</td>
                  <td>{m.priority}</td>
                  <td>{m.reportedDate}</td>
                  <td>
                    <span className={`badge ${m.status === 'Resolved' ? 'badge-available' : 'badge-maintenance'}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Notice Board */}
      <div className="chart-card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={20} color="var(--accent-primary)" />
          Hostel Notices & Announcements
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {notices && notices.map(n => (
            <div key={n.id} style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <strong style={{ fontSize: '0.95rem' }}>{n.title}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.date}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{n.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* UPI QR Payment Modal */}
      {showUpiModal && (
        <UpiPaymentModal 
          resident={resident}
          upiConfig={upiConfig}
          onClose={() => setShowUpiModal(false)}
          onConfirmPayment={onSavePayment}
          showToast={showToast}
        />
      )}

      {/* Report Issue Modal */}
      {showMaintenanceModal && (
        <div className="modal-overlay" onClick={() => setShowMaintenanceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Report Maintenance Issue (Room {resident.roomNumber})</h2>
              <button className="modal-close" onClick={() => setShowMaintenanceModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateComplaint}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Issue Category</label>
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="AC / Appliance">AC / Appliance / Geyser</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Cleaning">Cleaning</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Issue Description</label>
                  <textarea 
                    className="form-textarea" 
                    rows="3" 
                    placeholder="Describe problem..."
                    value={issueText}
                    onChange={(e) => setIssueText(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMaintenanceModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
