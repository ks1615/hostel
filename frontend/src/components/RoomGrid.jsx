import React, { useState, useMemo } from 'react';
import { 
  Building, 
  Users, 
  Bed, 
  IndianRupee, 
  Filter, 
  Eye, 
  UserPlus, 
  Edit3, 
  Trash2,
  Wifi, 
  Wind, 
  Flame, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function RoomGrid({ 
  rooms, 
  residents, 
  searchTerm, 
  onViewRoom, 
  onCheckInResident, 
  onEditRoom,
  onDeleteRoom,
  isOwner = false
}) {
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [selectedFloor, setSelectedFloor] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState('All');

  // Compute stats
  const stats = useMemo(() => {
    const totalRooms = rooms.length;
    let totalCapacity = 0;
    let occupiedBeds = 0;

    rooms.forEach(room => {
      totalCapacity += room.capacity;
      const occupied = room.beds.filter(b => b.residentId).length;
      occupiedBeds += occupied;
    });

    const vacantBeds = Math.max(0, totalCapacity - occupiedBeds);
    const occupancyRate = totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;
    const totalMonthlyRevenue = residents.reduce((acc, r) => acc + (Number(r.monthlyRent) || 0), 0);
    const paidCount = residents.filter(r => r.rentStatus === 'Paid').length;
    const unpaidCount = residents.filter(r => r.rentStatus !== 'Paid').length;

    return {
      totalRooms,
      totalCapacity,
      occupiedBeds,
      vacantBeds,
      occupancyRate,
      totalMonthlyRevenue,
      paidCount,
      unpaidCount
    };
  }, [rooms, residents]);

  // Unique filter dropdown options
  const blocks = ['All', ...Array.from(new Set(rooms.map(r => r.block)))];
  const floors = ['All', ...Array.from(new Set(rooms.map(r => r.floor.toString())))];
  const statuses = ['All', 'Available', 'Occupied', 'Full', 'Maintenance'];
  const roomTypes = ['All', ...Array.from(new Set(rooms.map(r => r.type)))];

  // Filter logic
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      // Block match
      if (selectedBlock !== 'All' && room.block !== selectedBlock) return false;
      // Floor match
      if (selectedFloor !== 'All' && room.floor.toString() !== selectedFloor) return false;
      // Status match
      if (selectedStatus !== 'All' && room.status !== selectedStatus) return false;
      // Type match
      if (selectedType !== 'All' && room.type !== selectedType) return false;

      // Payment Status match
      if (selectedPaymentFilter === 'Paid') {
        const hasPaid = room.beds.some(b => {
          const occ = residents.find(r => r.id === b.residentId);
          return occ && occ.rentStatus === 'Paid';
        });
        if (!hasPaid) return false;
      } else if (selectedPaymentFilter === 'Unpaid') {
        const hasUnpaid = room.beds.some(b => {
          const occ = residents.find(r => r.id === b.residentId);
          return occ && occ.rentStatus !== 'Paid';
        });
        if (!hasUnpaid) return false;
      }

      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const numMatch = room.number.toLowerCase().includes(query);
        const blockMatch = room.block.toLowerCase().includes(query);
        const typeMatch = room.type.toLowerCase().includes(query);
        const notesMatch = room.notes ? room.notes.toLowerCase().includes(query) : false;
        
        // Also check if occupant name matches
        const occupantIds = room.beds.map(b => b.residentId).filter(Boolean);
        const occupantNames = residents
          .filter(r => occupantIds.includes(r.id))
          .map(r => r.name.toLowerCase());
        const occupantMatch = occupantNames.some(name => name.includes(query));

        if (!numMatch && !blockMatch && !typeMatch && !notesMatch && !occupantMatch) {
          return false;
        }
      }
      return true;
    });
  }, [rooms, residents, selectedBlock, selectedFloor, selectedStatus, selectedType, selectedPaymentFilter, searchTerm]);

  return (
    <div>
      {!isOwner && (
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-md)', 
          padding: '0.75rem 1.25rem', 
          marginBottom: '1.25rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <strong style={{ color: 'var(--color-black)', fontSize: '0.9rem' }}>
              🌐 Public Live Directory (Read-Only)
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
              Showing real-time room occupancy, residents, and Paid / Unpaid rent status.
            </span>
          </div>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: 'var(--color-black)', 
            background: 'var(--bg-surface)', 
            padding: '0.2rem 0.6rem', 
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)'
          }}>
            🔒 Edits & Deletes Locked to Owner
          </span>
        </div>
      )}

      {/* Top Banner Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(20, 18, 16, 0.08)', color: 'var(--color-black)' }}>
            <Building size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalRooms} Rooms</div>
            <div className="stat-label">Total Rooms ({stats.totalCapacity} Total Beds)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(197, 160, 89, 0.15)', color: '#8c6b2d' }}>
            <Bed size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.occupiedBeds} / {stats.totalCapacity}</div>
            <div className="stat-label">Beds Occupied ({stats.vacantBeds} Vacant)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 126, 89, 0.12)', color: '#107e59' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#107e59' }}>{stats.paidCount} Residents</div>
            <div className="stat-label">Rent Status: ✓ Fully Paid</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(185, 28, 28, 0.12)', color: '#b91c1c' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: '#b91c1c' }}>{stats.unpaidCount} Residents</div>
            <div className="stat-label">Rent Status: ⚠️ Unpaid / Dues</div>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <Filter size={18} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Filter By:</span>

          <select 
            className="select-custom"
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
          >
            <option value="All">All Blocks</option>
            {blocks.filter(b => b !== 'All').map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select 
            className="select-custom"
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
          >
            <option value="All">All Floors</option>
            {floors.filter(f => f !== 'All').map(f => (
              <option key={f} value={f}>Floor {f}</option>
            ))}
          </select>

          <select 
            className="select-custom"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {statuses.filter(s => s !== 'All').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select 
            className="select-custom"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="All">All Room Types</option>
            {roomTypes.filter(t => t !== 'All').map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select 
            className="select-custom"
            value={selectedPaymentFilter}
            onChange={(e) => setSelectedPaymentFilter(e.target.value)}
            style={{ fontWeight: 600 }}
          >
            <option value="All">All Rent Statuses</option>
            <option value="Paid">🟢 Filter: Only Paid Rent</option>
            <option value="Unpaid">🔴 Filter: Only Unpaid Dues</option>
          </select>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredRooms.length}</strong> of {rooms.length} rooms
        </div>
      </div>

      {/* Room Cards Grid */}
      {filteredRooms.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          background: 'var(--bg-card)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)' 
        }}>
          <AlertTriangle size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3>No Rooms Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            No rooms match your filter criteria or search query. Try clearing filters.
          </p>
        </div>
      ) : (
        <div className="rooms-grid">
          {filteredRooms.map(room => {
            const occupiedCount = room.beds.filter(b => b.residentId).length;
            const isFull = occupiedCount >= room.capacity;
            const isVacant = occupiedCount === 0;

            let badgeClass = 'badge-available';
            if (room.status === 'Maintenance') badgeClass = 'badge-maintenance';
            else if (isFull) badgeClass = 'badge-full';
            else if (occupiedCount > 0) badgeClass = 'badge-occupied';

            return (
              <div key={room.id} className="room-card">
                <div className="room-card-header">
                  <div className="room-number-box">
                    <span className="room-number">Room {room.number}</span>
                    <span className="room-block">{room.block} (F{room.floor})</span>
                  </div>
                  <span className={`badge ${badgeClass}`}>
                    {room.status === 'Maintenance' ? 'Maintenance' : isFull ? 'Full' : isVacant ? 'Vacant' : `${occupiedCount}/${room.capacity} Occupied`}
                  </span>
                </div>

                <div className="room-meta">
                  <span>{room.type}</span>
                  <span>•</span>
                  <span>{room.isAC ? '⚡ AC' : '🌀 Non-AC'}</span>
                  <span>•</span>
                  <span>{room.attachedBath ? '🚿 Attached Bath' : 'Shared Bath'}</span>
                </div>

                {/* Bed Allocation Indicator Matrix */}
                <div className="beds-container">
                  <div className="beds-title">
                    Hostel Residents & Payment Status ({occupiedCount}/{room.capacity})
                  </div>
                  <div className="beds-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {room.beds.map((bed, idx) => {
                      const occupant = residents.find(r => r.id === bed.residentId);
                      const isPaid = occupant?.rentStatus === 'Paid';
                      return (
                        <div 
                          key={idx} 
                          className={`bed-item ${occupant ? 'occupied' : 'vacant'}`}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            padding: '0.4rem 0.65rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                            <Bed size={14} style={{ flexShrink: 0 }} />
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {occupant ? `Bed ${bed.bedNo}: ${occupant.name}` : `Bed ${bed.bedNo}: Available`}
                            </span>
                          </div>

                          {occupant ? (
                            <span style={{ 
                              fontSize: '0.725rem', 
                              fontWeight: 800, 
                              padding: '0.15rem 0.5rem', 
                              borderRadius: 'var(--radius-full)',
                              background: isPaid ? 'rgba(16, 126, 89, 0.12)' : 'rgba(185, 28, 28, 0.12)',
                              color: isPaid ? '#107e59' : '#b91c1c',
                              border: `1px solid ${isPaid ? 'rgba(16, 126, 89, 0.3)' : 'rgba(185, 28, 28, 0.3)'}`,
                              flexShrink: 0
                            }}>
                              {isPaid ? '✓ PAID' : '⚠️ UNPAID'}
                            </span>
                          ) : (
                            <span style={{ 
                              fontSize: '0.7rem', 
                              fontWeight: 700, 
                              padding: '0.12rem 0.45rem', 
                              borderRadius: 'var(--radius-full)', 
                              background: 'var(--bg-surface)', 
                              color: 'var(--text-muted)', 
                              border: '1px solid var(--border-color)', 
                              flexShrink: 0 
                            }}>
                              VACANT
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {room.notes && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', fontStyle: 'italic' }}>
                    "{room.notes}"
                  </p>
                )}

                <div className="room-footer">
                  <div className="room-price">
                    ₹{room.rent.toLocaleString()} <span>/ month</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onViewRoom(room)}
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>

                    {isOwner && (
                      <>
                        {!isFull && room.status !== 'Maintenance' && (
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => onCheckInResident(room)}
                            title="Allocate Bed"
                          >
                            <UserPlus size={14} />
                            <span>Book</span>
                          </button>
                        )}

                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => onEditRoom(room)}
                          title="Edit Room Details"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button 
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--color-danger)' }}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to DELETE Room ${room.number} (${room.block})? This action cannot be undone.`)) {
                              onDeleteRoom(room.id);
                            }
                          }}
                          title="Delete Room"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
