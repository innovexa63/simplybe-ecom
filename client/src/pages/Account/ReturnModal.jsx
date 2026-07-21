import React, { useState } from 'react';

export default function ReturnModal({ order, onClose, onSubmit }) {
  const [reason, setReason] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Please tell us the reason for return.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('returnReason', reason);
      if (image) formData.append('image', image);
      await onSubmit(order._id, formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16
    }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, maxWidth: 420, width: '100%' }}>
        <h3 style={{ margin: 0, marginBottom: 4, fontSize: 18, fontWeight: 'bold' }}>Request Return</h3>
        <p style={{ fontSize: 13, color: '#777', marginBottom: 16 }}>
          Order #{order._id.slice(-8).toUpperCase()}
        </p>

        <label style={{ fontSize: 13, fontWeight: 'bold', color: '#333' }}>Reason for return</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="e.g. Wrong size received, item damaged..."
          style={{ width: '100%', marginTop: 6, marginBottom: 14, padding: 10, border: '1px solid #ddd', borderRadius: 8, fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }}
        />

        <label style={{ fontSize: 13, fontWeight: 'bold', color: '#333' }}>Upload photo (optional)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'block', marginTop: 6, marginBottom: 10, fontSize: 13 }} />
        {preview && (
          <img src={preview} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 14, border: '1px solid #eee' }} />
        )}

        {error && <p style={{ color: 'red', fontSize: 13, marginBottom: 10 }}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
          <button
            onClick={onClose}
            disabled={submitting}
            style={{ padding: '8px 18px', background: '#fff', border: '1px solid #ccc', color: '#333', borderRadius: 20, fontWeight: 'bold', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ padding: '8px 18px', background: '#111', border: 'none', color: '#fff', borderRadius: 20, fontWeight: 'bold', cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? 'Submitting...' : 'Submit Return'}
          </button>
        </div>
      </div>
    </div>
  );
}