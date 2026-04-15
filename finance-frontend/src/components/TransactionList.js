import React, { useMemo, useState } from 'react';
import { deleteTransaction } from '../api/api';

export default function TransactionList({ transactions, categories, onRefresh }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [sortDir, setSortDir] = useState('desc');

  const categoryMap = useMemo(() => {
    const map = {};
    categories?.forEach((c) => (map[c.id] = c.name));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    if (!transactions) return [];
    
    return transactions
      .filter((t) => {
        const description = t.description || '';
        const matchSearch = description.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === '' || String(t.category_id) === filterCat;
        return matchSearch && matchCat;
      })
      .sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return sortDir === 'desc'
          ? b.date.localeCompare(a.date)
          : a.date.localeCompare(b.date);
      });
  }, [transactions, search, filterCat, sortDir]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id);
        if (onRefresh) onRefresh(); 
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete transaction. Is the backend running?");
      }
    }
  };

  return (
    <div className="tx-page">
      <div className="filters">
        <input
          type="text"
          placeholder="Search by description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input"
        />
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="filter-select"
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          className="btn-sort"
          onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
        >
          Date {sortDir === 'desc' ? '↓' : '↑'}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="chart-empty" style={{ marginTop: '3rem' }}>
          No transactions found
        </div>
      ) : (
        <div className="tx-list-card">
          <table className="tx-table full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th className="right">Amount</th>
                <th className="right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="muted">{t.date}</td>
                  <td>{t.description}</td>
                  <td>
                    <span className="badge">
                      {categoryMap[t.category_id] || 'General'}
                    </span>
                  </td>
                  <td className={`right amount ${t.amount >= 0 ? 'positive' : 'negative'}`}>
                    {t.amount >= 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                  </td>
                  <td className="right">
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(t.id)}
                      title="Delete transaction"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="tx-count">
        {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}