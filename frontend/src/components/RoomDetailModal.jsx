import React from 'react';
import { X, Bed, User, Phone, Mail, Calendar, ShieldCheck, IndianRupee, UserMinus, UserPlus, Wrench, Edit3, Trash2 } from 'lucide-react';

export default function RoomDetailModal({ 
  room, 
  residents, 
  onClose, 
  onVacateBed, 
  onCheckInResident, 
  onOpenMaintenance,
  onEditRoom,
  onDeleteRoom
}) {
  if (!room) return null;

  const occupants = room.beds
    .map(bed => {
      const res = residents.find(r => r.id === bed.residentId);
      return { bedNo: bed.bedNo, resident: res };
    });

  const vacantBeds = room.beds.filter(b => !b.residentId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Room {room.number} Details</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {room.block} • Floor {room.floor} • {room.type}
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Room quick stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1rem', 
            marginBottom: '1.5rem',
            background: 'var(--bg-card)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly Rent</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹{room.rent.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AC / Bath</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                {room.isAC ? '⚡ AC' : 'Non-AC'} | {room.attachedBath ? 'Attached' : 'Shared'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Room Status</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                {room.status}
              </div>
            </div>
          </div>

          {/* Amenities tags */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Amenities Checklist
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {room.amenities && room.amenities.map((item, idx) => (
                <span key={idx} style={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)', 
                  padding: '0.25rem 0.65rem', 
                  borderRadius: 'var(--radius-full)', 
                  fontSize: '0.8rem' 
                }}>
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Occupants list */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Bed Occupants ({room.beds.filter(b => b.residentId).length}/{room.capacity})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {occupants.map(({ bedNo, resident }) => (
                <div key={bedNo} style={{ 
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  {resident ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div className="resident-avatar">
                          {resident.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                            Bed {bedNo}: {resident.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                            <span><Phone size={12} style={{ display: 'inline', marginRight: '3px' }} /> {resident.phone}</span>
                            <span><Calendar size={12} style={{ display: 'inline', marginRight: '3px' }} /> Checked-in: {resident.checkInDate}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={`badge ${resident.rentStatus === 'Paid' ? 'badge-available' : resident.rentStatus === 'Pending' ? 'badge-maintenance' : 'badge-full'}`}>
                          {resident.rentStatus}
                        </span>
                        <button 
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--color-danger)' }}
                          onClick={() => onVacateBed(room.id, bedNo, resident.id)}
                          title="Check Out Resident"
                        >
                          <UserMinus size={14} />
                          <span>Vacate</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-available)' }}>
                        <Bed size={20} />
                        <span style={{ fontWeight: 600 }}>Bed {bedNo}: Available for Booking</span>
                      </div>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          onClose();
                          onCheckInResident(room, bedNo);
                        }}
                      >
                        <UserPlus size={14} />
                        <span>Allocate</span>
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary"
            onClick={() => {
              onClose();
              if (onEditRoom) onEditRoom(room);
            }}
          >
            <Edit3 size={16} />
            <span>Edit Room Details</span>
          </button>

          <button 
            className="btn btn-secondary"
            style={{ color: 'var(--color-danger)' }}
            onClick={() => {
              if (window.confirm(`Are you sure you want to DELETE Room ${room.number} (${room.block})?`)) {
                onClose();
                if (onDeleteRoom) onDeleteRoom(room.id);
              }
            }}
          >
            <Trash2 size={16} />
            <span>Delete Room</span>
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => {
              onClose();
              onOpenMaintenance(room);
            }}
          >
            <Wrench size={16} />
            <span>Report Maintenance</span>
          </button>

          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
