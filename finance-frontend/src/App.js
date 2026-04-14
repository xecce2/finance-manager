import React, { useState, useEffect, useCallback } from 'react';
import { getCategories, getTransactions, createTransaction } from './api/api';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';
import './index.css';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState(null);

  // Используем useCallback, чтобы функцию можно было безопасно передавать в дочерние компоненты
  const fetchData = useCallback(async () => {
    try {
      // setLoading(true); // Убираем принудительный лоадер при каждом обновлении, чтобы экран не мигал
      const [txRes, catRes] = await Promise.all([
        getTransactions(),
        getCategories(),
      ]);
      
      setTransactions(txRes || []);
      setCategories(catRes || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Cannot connect to backend. Make sure FastAPI is running on port 8000.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddTransaction = async (data) => {
    try {
      await createTransaction(data);
      await fetchData(); // Обновляем данные после добавления
      setShowModal(false);
    } catch (err) {
      alert("Ошибка при сохранении транзакции");
    }
  };

  // Расчеты
  const totalIncome = transactions?.filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const totalExpense = transactions?.filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;

  const balance = totalIncome - totalExpense;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">₴</span>
          <span className="logo-text">Finance</span>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Transactions
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="balance-pill">
            <span className="balance-label">Balance</span>
            <span className={`balance-amount ${balance >= 0 ? 'positive' : 'negative'}`}>
              {balance >= 0 ? '+' : ''}${balance.toFixed(2)}
            </span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-title">
            {activeTab === 'dashboard' ? 'Overview' : 'All Transactions'}
          </div>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add transaction
          </button>
        </header>

        {error && (
          <div className="error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner" />
            <span>Loading...</span>
          </div>
        ) : (
          <div className="content">
            {activeTab === 'dashboard' ? (
              <Dashboard
                transactions={transactions}
                categories={categories}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                balance={balance}
              />
            ) : (
              <TransactionList
                transactions={transactions}
                categories={categories}
                onRefresh={fetchData} // ВАЖНО: передаем функцию обновления
              />
            )}
          </div>
        )}
      </main>

      {showModal && (
        <AddTransactionModal
          categories={categories}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddTransaction}
        />
      )}
    </div>
  );
}