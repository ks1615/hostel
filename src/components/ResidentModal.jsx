import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save } from 'lucide-react';

export default function ResidentModal({ 
  rooms, 
  preSelectedRoom, 
  preSelectedBed, 
  residentToEdit, 
  onClose, 
  onSave 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guardianName: '',
    guardianPhone: '',
    roomId: '',
    bedNo: 1,
    checkInDate: new Date().toISOString().slice(0, 10),
    rentStatus: 'Paid',
    monthlyRent: 7500,
    securityDeposit: 15000,
    idProof: ''
  });

  useEffect(() => {
    if (residentToEdit) {
      setFormData({
        name: residentToEdit.name || '',
        email: residentToEdit.email || '',
        phone: residentToEdit.phone || '',
        guardianName: residentToEdit.guardianName || '',
        guardianPhone: residentToEdit.guardianPhone || '',
        roomId: residentToEdit.roomId || '',
        bedNo: residentToEdit.bedNo || 1,
        checkInDate: residentToEdit.checkInDate || new Date().toISOString().slice(0, 10),
        rentStatus: residentToEdit.rentStatus || 'Paid',
        monthlyRent: residentToEdit.monthlyRent || 7500,
        securityDeposit: residentToEdit.securityDeposit || 15000,
        idProof: residentToEdit.idProof || ''
      });
    } else if (preSelectedRoom) {
      const selectedRoomObj = rooms.find(r => r.id === preSelectedRoom.id);
      const targetBed = preSelectedBed || (selectedRoomObj ? selectedRoomObj.beds.find(b => !b.residentId)?.bedNo : 1);
      setFormData(prev => ({
        ...prev,
        roomId: preSelectedRoom.id,
        bedNo: targetBed || 1,
        monthlyRent: preSelectedRoom.rent || 7500,
        securityDeposit: (preSelectedRoom.rent || 7500) * 2
      }));
    } else if (rooms.length > 0) {
      setFormData(prev => ({
        ...prev,
        roomId: rooms[0].id,
        monthlyRent: rooms[0].rent || 7500,
        securityDeposit: (rooms[0].rent || 7500) * 2
      }));
    }
  }, [preSelectedRoom, preSelectedBed, residentToEdit, rooms]);

  const handleRoomChange = (e) => {
    const selectedId = e.target.value;
    const targetRoom = rooms.find(r => r.id === selectedId);
    if (targetRoom) {
      const vacantBed = targetRoom.beds.find(b => !b.residentId)?.bedNo || 1;
      setFormData(prev => ({
        ...prev,
        roomId: selectedId,
        bedNo: vacantBed,
        monthlyRent: targetRoom.rent,
        securityDeposit: targetRoom.rent * 2
      }));
    }
  };

  const selectedRoomObj = rooms.find(r => r.id === formData.roomId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill out Name and Phone number.');
      return;
    }

    if (!selectedRoomObj) {
      alert('Please select a valid room.');
      return;
    }

    onSave({
      id: residentToEdit ? residentToEdit.id : `res_${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      guardianName: formData.guardianName.trim(),
      guardianPhone: formData.guardianPhone.trim(),
      roomId: formData.roomId,
      roomNumber: selectedRoomObj.number,
      bedNo: Number(formData.bedNo),
      checkInDate: formData.checkInDate,
      rentStatus: formData.rentStatus,
      monthlyRent: Number(formData.monthlyRent),
      securityDeposit: Number(formData.securityDeposit),
      idProof: formData.idProof.trim()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {residentToEdit ? `Edit Profile: ${residentToEdit.name}` : 'Resident Check-In & Bed Booking'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Personal & Contact Information
            </h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>ID Proof (Aadhaar / Passport / License)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Aadhaar 1234-5678-9012"
                  value={formData.idProof}
                  onChange={(e) => setFormData({ ...formData, idProof: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Guardian / Emergency Contact Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Parent / Guardian name"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Guardian Phone</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="+91 98765 00000"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                />
              </div>
            </div>

            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '1rem 0 0.75rem', textTransform: 'uppercase' }}>
              Room Allocation & Financials
            </h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Select Room</label>
                <select 
                  className="form-select"
                  value={formData.roomId}
                  onChange={handleRoomChange}
                >
                  {rooms.map(r => {
                    const occupied = r.beds.filter(b => b.residentId).length;
                    return (
                      <option key={r.id} value={r.id}>
                        Room {r.number} ({r.block}) - ₹{r.rent}/mo - ({occupied}/{r.capacity} Occupied)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group">
                <label>Assigned Bed Number</label>
                <select 
                  className="form-select"
                  value={formData.bedNo}
                  onChange={(e) => setFormData({ ...formData, bedNo: Number(e.target.value) })}
                >
                  {selectedRoomObj && selectedRoomObj.beds.map(b => (
                    <option key={b.bedNo} value={b.bedNo}>
                      Bed #{b.bedNo} {b.residentId && b.residentId !== residentToEdit?.id ? '(Occupied)' : '(Vacant)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Check-In Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={formData.checkInDate}
                  onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Initial Rent Status</label>
                <select 
                  className="form-select"
                  value={formData.rentStatus}
                  onChange={(e) => setFormData({ ...formData, rentStatus: e.target.value })}
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div className="form-group">
                <label>Monthly Rent (₹)</label>
                <input 
                  type="number" 
                  className="form-input"
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Security Deposit (₹)</label>
                <input 
                  type="number" 
                  className="form-input"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>{residentToEdit ? 'Save Profile' : 'Complete Check-In'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
