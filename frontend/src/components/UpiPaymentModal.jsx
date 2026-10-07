import React, { useState } from 'react';
import { X, QrCode, Copy, Check, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function UpiPaymentModal({ 
  resident, 
  upiConfig, 
  onClose, 
  onConfirmPayment, 
  showToast 
}) {
  const [copied, setCopied] = useState(false);
  const [upiRefNo, setUpiRefNo] = useState('');
  const [paymentMonth, setPaymentMonth] = useState('October 2026');
  const [qrType, setQrType] = useState('phonepe'); // 'phonepe' or 'dynamic'

  if (!resident) return null;

  const payeeVpa = upiConfig?.upiId || 'sakhareplot@upi';
  const payeeName = upiConfig?.payeeName || 'Sakhare Plot Hostel';
  const amount = resident.monthlyRent || 7500;
  const note = `Rent Room ${resident.roomNumber} - ${resident.name}`;

  // Standardized UPI Payment URI Scheme (NPCI Spec)
  const upiUri = `upi://pay?pa=${encodeURIComponent(payeeVpa)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  // Dynamic QR Code API URL as alternative
  const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(upiUri)}`;

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(payeeVpa);
    setCopied(true);
    if (showToast) showToast('UPI ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmPayment({
      id: `pay_${Date.now()}`,
      residentId: resident.id,
      residentName: resident.name,
      roomNumber: resident.roomNumber,
      amount: Number(amount),
      date: new Date().toISOString().slice(0, 10),
      month: paymentMonth,
      paymentMethod: 'UPI',
      upiRefNo: upiRefNo.trim() || `UTR-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      status: 'Completed',
      receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(16, 185, 129, 0.2))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#6366f1', color: '#fff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={22} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.2rem' }}>Sakhare Plot Hostel UPI Scanner</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Scan using GPay, PhonePe, Paytm or BHIM</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ textAlign: 'center' }}>
            {/* Resident & Rent Header Summary */}
            <div style={{ 
              background: 'var(--bg-card)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1rem',
              border: '1px solid var(--border-color)',
              marginBottom: '1rem',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{resident.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Room {resident.roomNumber} (Bed #{resident.bedNo})
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Amount Payable</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                  ₹{amount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Selector: Official PhonePe QR vs Dynamic QR */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${qrType === 'phonepe' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setQrType('phonepe')}
              >
                📱 Hostel Official PhonePe QR
              </button>
              <button
                type="button"
                className={`btn btn-sm ${qrType === 'dynamic' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setQrType('dynamic')}
              >
                ⚡ Amount Pre-filled QR
              </button>
            </div>

            {/* QR Scanner Display Card */}
            <div style={{ 
              background: '#ffffff', 
              padding: '1.25rem', 
              borderRadius: '16px', 
              display: 'inline-block',
              boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
              border: '4px solid #6366f1',
              marginBottom: '1rem',
              maxWidth: '280px'
            }}>
              {qrType === 'phonepe' ? (
                <img 
                  src="/sakhare-upi-qr.jpg" 
                  alt="Sakhare Plot Hostel Official PhonePe Scanner" 
                  style={{ width: '220px', height: 'auto', display: 'block', borderRadius: '8px', margin: '0 auto' }} 
                />
              ) : (
                <img 
                  src={dynamicQrUrl} 
                  alt="Dynamic Amount UPI QR Code" 
                  style={{ width: '220px', height: '220px', display: 'block', borderRadius: '8px', margin: '0 auto' }} 
                />
              )}
              <div style={{ marginTop: '0.5rem', color: '#111827', fontSize: '0.8rem', fontWeight: 700 }}>
                {qrType === 'phonepe' ? 'SAKHARE PLOT HOSTEL PHONEPE' : `₹${amount.toLocaleString()} Pre-filled QR`}
              </div>
            </div>

            {/* UPI ID Copy Pill */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justify: 'center', 
              gap: '0.5rem', 
              marginBottom: '1.25rem',
              background: 'var(--bg-card)',
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-highlight)'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>UPI VPA:</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--accent-primary)', fontFamily: 'monospace' }}>{payeeVpa}</strong>
              <button 
                type="button" 
                onClick={handleCopyVpa}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.2rem' }}
                title="Copy UPI VPA"
              >
                {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              </button>
            </div>

            {/* Direct App Launch Button */}
            <div style={{ marginBottom: '1.25rem' }}>
              <a 
                href={upiUri} 
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                <Smartphone size={15} />
                <span>Open in PhonePe / GPay App</span>
              </a>
            </div>

            {/* UTR & Transaction Recording Form */}
            <div style={{ textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem' }}>Billing Month</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={paymentMonth}
                    onChange={(e) => setPaymentMonth(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem' }}>12-Digit UPI Ref / UTR No. *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. 428910283412"
                    value={upiRefNo}
                    onChange={(e) => setUpiRefNo(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <ShieldCheck size={16} />
              <span>Confirm & Record Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
