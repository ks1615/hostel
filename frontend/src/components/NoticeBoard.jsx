import React, { useState } from 'react';
import { Bell, Plus, Pin, Trash2, Edit3, X, AlertCircle, Megaphone } from 'lucide-react';

export default function NoticeBoard({ 
  notices, 
  onSaveNotice, 
  onDeleteNotice, 
  onTogglePinNotice,
  isOwner = false 
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'General',
    author: 'Hostel Warden',
    isPinned: false
  });

  const handleOpenAdd = () => {
    setEditingNotice(null);
    setForm({
      title: '',
      content: '',
      category: 'General',
      author: 'Hostel Warden',
      isPinned: false
    });
    setShowModal(true);
  };

  const handleOpenEdit = (notice) => {
    setEditingNotice(notice);
    setForm({
      title: notice.title,
      content: notice.content,
      category: notice.category || 'General',
      author: notice.author || 'Hostel Management',
      isPinned: notice.isPinned || false
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert('Please fill out notice title and content.');
      return;
    }

    const noticeData = {
      id: editingNotice ? editingNotice.id : `notice_${Date.now()}`,
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      author: form.author.trim(),
      isPinned: form.isPinned,
      date: editingNotice ? editingNotice.date : new Date().toISOString().slice(0, 10)
    };

    onSaveNotice(noticeData);
    setShowModal(false);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete notice: "${title}"?`)) {
      onDeleteNotice(id);
    }
  };

  const filteredNotices = notices.filter(n => {
    if (filterCategory !== 'All' && n.category !== filterCategory) return false;
    return true;
  });

  // Sort pinned notices first
  const sortedNotices = [...filteredNotices].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div>
      {/* Control bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Megaphone size={22} style={{ color: 'var(--accent-primary)' }} />
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Hostel Information & Notice Board</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Official announcements, rule updates & emergency notices
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select 
            className="select-custom"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Urgent">Urgent</option>
            <option value="General">General</option>
            <option value="Utility">Utility</option>
            <option value="Rules">Rules</option>
          </select>

          {isOwner && (
            <button 
              className="btn btn-gold"
              onClick={handleOpenAdd}
            >
              <Plus size={16} />
              <span>Post New Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Notices Grid */}
      {sortedNotices.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          background: 'var(--bg-card)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)' 
        }}>
          <Bell size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3>No Announcements Posted</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {isOwner ? 'Click "Post New Notice" to issue a hostel announcement.' : 'No announcements currently active.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {sortedNotices.map(notice => {
            let catColor = 'var(--accent-primary)';
            if (notice.category === 'Urgent') catColor = 'var(--color-danger)';
            else if (notice.category === 'Utility') catColor = 'var(--color-gold)';

            return (
              <div 
                key={notice.id}
                style={{ 
                  background: 'var(--bg-card)', 
                  border: notice.isPinned ? '2px solid var(--color-gold)' : '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: notice.isPinned ? 'var(--shadow-gold-glow)' : 'var(--shadow-sm)'
                }}
              >
                {/* Notice Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span style={{ 
                    background: 'var(--bg-surface)', 
                    color: catColor, 
                    border: `1px solid ${catColor}40`, 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase' 
                  }}>
                    {notice.category}
                  </span>

                  {isOwner && (
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onTogglePinNotice(notice.id)}
                        title={notice.isPinned ? 'Unpin Notice' : 'Pin Notice to Top'}
                        style={{ color: notice.isPinned ? 'var(--color-gold)' : 'var(--text-muted)' }}
                      >
                        <Pin size={14} />
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEdit(notice)}
                        title="Edit Notice"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--color-danger)' }}
                        onClick={() => handleDelete(notice.id, notice.title)}
                        title="Delete Notice"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Title & Body */}
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {notice.isPinned && <Pin size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--accent-primary)' }} />}
                  {notice.title}
                </h4>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>
                  {notice.content}
                </p>

                {/* Footer Metadata */}
                <div style={{ 
                  display: 'flex', 
                  justify: 'space-between', 
                  fontSize: '0.75rem', 
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.65rem'
                }}>
                  <span>By: <strong>{notice.author}</strong></span>
                  <span>Date: {notice.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Notice Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingNotice ? 'Edit Hostel Announcement' : 'Post New Hostel Announcement'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Notice Title *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. Main Gate Timings Notice"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      className="form-select"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="General">General</option>
                      <option value="Urgent">Urgent Warning</option>
                      <option value="Utility">Utility / Maintenance</option>
                      <option value="Rules">Hostel Rules</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Posted By (Author)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notice Announcement Details *</label>
                  <textarea 
                    className="form-textarea"
                    rows="4"
                    placeholder="Write announcement description here..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={form.isPinned}
                      onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                    />
                    <span>Pin notice to top of board</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Megaphone size={16} />
                  <span>{editingNotice ? 'Update Notice' : 'Publish Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
