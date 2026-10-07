import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';

export default function RoomFormModal({ roomToEdit, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    number: '',
    block: 'Block A',
    floor: 1,
    type: 'Double Shared',
    capacity: 2,
    rent: 7500,
    isAC: true,
    attachedBath: true,
    status: 'Available',
    amenitiesStr: 'WiFi, Study Desk, AC, Geyser',
    notes: ''
  });

  useEffect(() => {
    if (roomToEdit) {
      setFormData({
        number: roomToEdit.number || '',
        block: roomToEdit.block || 'Block A',
        floor: roomToEdit.floor || 1,
        type: roomToEdit.type || 'Double Shared',
        capacity: roomToEdit.capacity || 2,
        rent: roomToEdit.rent || 7500,
        isAC: roomToEdit.isAC !== undefined ? roomToEdit.isAC : true,
        attachedBath: roomToEdit.attachedBath !== undefined ? roomToEdit.attachedBath : true,
        status: roomToEdit.status || 'Available',
        amenitiesStr: roomToEdit.amenities ? roomToEdit.amenities.join(', ') : '',
        notes: roomToEdit.notes || ''
      });
    }
  }, [roomToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.number.trim()) {
      alert('Please enter a room number');
      return;
    }

    const amenities = formData.amenitiesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    onSave({
      id: roomToEdit ? roomToEdit.id : `room_${Date.now()}`,
      number: formData.number.trim(),
      block: formData.block,
      floor: Number(formData.floor),
      type: formData.type,
      capacity: Number(formData.capacity),
      rent: Number(formData.rent),
      isAC: formData.isAC,
      attachedBath: formData.attachedBath,
      status: formData.status,
      amenities,
      notes: formData.notes
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {roomToEdit ? `Edit Room ${roomToEdit.number}` : 'Add New Room'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Room Number *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 105"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hostel Block</label>
                <select 
                  className="form-select"
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                >
                  <option value="Block A">Block A</option>
                  <option value="Block B">Block B</option>
                  <option value="Block C">Block C</option>
                  <option value="Executive Wing">Executive Wing</option>
                </select>
              </div>

              <div className="form-group">
                <label>Floor Level</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  className="form-input"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Room Type</label>
                <select 
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Single Deluxe">Single Deluxe</option>
                  <option value="Double Shared">Double Shared</option>
                  <option value="Triple Shared">Triple Shared</option>
                  <option value="Executive Suite">Executive Suite</option>
                </select>
              </div>

              <div className="form-group">
                <label>Bed Capacity</label>
                <input 
                  type="number" 
                  min="1" 
                  max="6" 
                  className="form-input"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Monthly Rent (₹)</label>
                <input 
                  type="number" 
                  step="500" 
                  className="form-input"
                  value={formData.rent}
                  onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid" style={{ marginTop: '0.5rem' }}>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={formData.isAC}
                    onChange={(e) => setFormData({ ...formData, isAC: e.target.checked })}
                  />
                  <span>Air Conditioned (AC)</span>
                </label>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={formData.attachedBath}
                    onChange={(e) => setFormData({ ...formData, attachedBath: e.target.checked })}
                  />
                  <span>Attached Bathroom</span>
                </label>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select 
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Full">Full</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Amenities (Comma Separated)</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="WiFi, Study Desk, Geyser, Balcony"
                value={formData.amenitiesStr}
                onChange={(e) => setFormData({ ...formData, amenitiesStr: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Notes / Description</label>
              <textarea 
                className="form-textarea"
                rows="2"
                placeholder="Corner room, garden view..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            {roomToEdit && onDelete && (
              <button 
                type="button" 
                className="btn btn-secondary"
                style={{ color: 'var(--color-danger)', marginRight: 'auto' }}
                onClick={() => {
                  if (window.confirm(`Are you sure you want to DELETE Room ${roomToEdit.number}?`)) {
                    onClose();
                    onDelete(roomToEdit.id);
                  }
                }}
              >
                <Trash2 size={16} />
                <span>Delete Room</span>
              </button>
            )}

            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>Save Room</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
