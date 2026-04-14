import React, { useState } from 'react';

export default function AddTransactionModal({ onClose, onSubmit }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    amount: '',
    description: '',
    date: today,
    category_name: '', 
    type: 'expense',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.amount || !form.description || !form.date || !form.category_name) {
      setError('Please enter everything.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const amount = parseFloat(form.amount);
      await onSubmit({
        amount: form.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        description: form.description,
        date: form.date,
        category_name: form.category_name, 
      });
      onClose();
    } catch (e) {
      setError('Backend error, check connection.');
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">New transaction</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="type-toggle">
          <button className={`type-btn ${form.type === 'expense' ? 'active expense' : ''}`} onClick={() => set('type', 'expense')}>Expense</button>
          <button className={`type-btn ${form.type === 'income' ? 'active income' : ''}`} onClick={() => set('type', 'income')}>Income</button>
        </div>

        <div className="form-group">
          <label className="form-label">Amount</label>
          <input type="number" className="form-input" placeholder="0.00" value={form.amount} onChange={(e) => set('amount', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input type="text" className="form-input" placeholder="What expense for?" value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Food, Taxi..." 
              value={form.category_name} 
              onChange={(e) => set('category_name', e.target.value)} 
            />
          </div>
        </div>

        {error && <div className="form-error" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className={`btn-save ${form.type}`} onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}