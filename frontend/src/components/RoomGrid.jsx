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
  onDeleteRoom 
}) {
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [selectedFloor, setSelectedFloor] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

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

    return {
      totalRooms,
      totalCapacity,
      occupiedBeds,
      vacantBeds,
      occupancyRate,
      totalMonthlyRevenue
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
  }, [rooms, residents, selectedBlock, selectedFloor, selectedStatus, selectedType, searchTerm]);

  return (
    <div>
      {/* Top Banner Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <Building size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalRooms}</div>
            <div className="stat-label">Total Rooms</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Bed size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.occupiedBeds} / {stats.totalCapacity}</div>
            <div className="stat-label">Beds Occupied ({stats.vacantBeds} Vacant)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.occupancyRate}%</div>
            <div className="stat-label">Occupancy Rate</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <IndianRupee size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">₹{stats.totalMonthlyRevenue.toLocaleString()}</div>
            <div className="stat-label">Monthly Expected Rent</div>
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
                  <div className="beds-title">Bed Allocation ({occupiedCount}/{room.capacity})</div>
                  <div className="beds-list">
                    {room.beds.map((bed, idx) => {
                      const occupant = residents.find(r => r.id === bed.residentId);
                      return (
                        <div 
                          key={idx} 
                          className={`bed-item ${occupant ? 'occupied' : 'vacant'}`}
                          title={occupant ? `Bed ${bed.bedNo}: ${occupant.name}` : `Bed ${bed.bedNo}: Vacant`}
                        >
                          <Bed size={14} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {occupant ? occupant.name.split(' ')[0] : `Bed ${bed.bedNo}`}
                          </span>
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
