import React, { useState, useMemo } from 'react';
import { Users, Phone, Mail, FileSpreadsheet, Edit3, UserMinus, Plus, CreditCard, Search } from 'lucide-react';
import { exportResidentsCSV } from '../utils/storage';

export default function ResidentsList({ 
  residents, 
  rooms, 
  searchTerm, 
  onOpenCheckIn, 
  onEditResident, 
  onVacateResident, 
  onRecordPayment,
  isOwner = false 
}) {
  const [rentFilter, setRentFilter] = useState('All');

  const filteredResidents = useMemo(() => {
    return residents.filter(res => {
      if (rentFilter !== 'All' && res.rentStatus !== rentFilter) return false;
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const nameMatch = res.name.toLowerCase().includes(query);
        const phoneMatch = res.phone.toLowerCase().includes(query);
        const emailMatch = res.email.toLowerCase().includes(query);
        const roomMatch = res.roomNumber.toString().includes(query);
        if (!nameMatch && !phoneMatch && !emailMatch && !roomMatch) return false;
      }
      return true;
    });
  }, [residents, rentFilter, searchTerm]);

  return (
    <div>
      {/* Header bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <Users size={18} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Filter Status:</span>

          <select 
            className="select-custom"
            value={rentFilter}
            onChange={(e) => setRentFilter(e.target.value)}
          >
            <option value="All">All Rent Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => exportResidentsCSV(filteredResidents)}
            title="Export list as CSV"
          >
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>

          {isOwner && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => onOpenCheckIn()}
            >
              <Plus size={16} />
              <span>New Resident</span>
            </button>
          )}
        </div>
      </div>

      {/* Directory Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Resident Name</th>
              <th>Room & Bed</th>
              <th>Contact Info</th>
              <th>Check-In Date</th>
              <th>Monthly Rent</th>
              <th>Rent Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No residents match your search query.
                </td>
              </tr>
            ) : (
              filteredResidents.map(res => {
                const roomObj = rooms.find(r => r.id === res.roomId);
                let badgeClass = 'badge-available';
                if (res.rentStatus === 'Pending') badgeClass = 'badge-maintenance';
                if (res.rentStatus === 'Overdue') badgeClass = 'badge-full';

                return (
                  <tr key={res.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="resident-avatar">
                          {res.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{res.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {res.idProof || 'N/A'}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Room {res.roomNumber}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Bed #{res.bedNo} ({roomObj?.block || 'Block A'})
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.85rem' }}><Phone size={12} style={{ display: 'inline', marginRight: '4px' }} /> {res.phone}</div>
                      {res.email && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <Mail size={12} style={{ display: 'inline', marginRight: '4px' }} /> {res.email}
                        </div>
                      )}
                    </td>

                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{res.checkInDate}</span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700 }}>₹{res.monthlyRent.toLocaleString()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dep: ₹{res.securityDeposit.toLocaleString()}</div>
                    </td>

                    <td>
                      <span className={`badge ${badgeClass}`}>
                        {res.rentStatus}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => onRecordPayment(res)}
                          title="Pay via UPI QR Scanner"
                        >
                          <CreditCard size={14} />
                          <span>Pay UPI</span>
                        </button>
                        {isOwner && (
                          <>
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => onEditResident(res)}
                              title="Edit Resident Profile"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              className="btn btn-secondary btn-sm"
                              style={{ color: 'var(--color-danger)' }}
                              onClick={() => onVacateResident(res.roomId, res.bedNo, res.id)}
                              title="Vacate Bed / Check Out"
                            >
                              <UserMinus size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
