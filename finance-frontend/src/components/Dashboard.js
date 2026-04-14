import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

export default function Dashboard({ transactions, categories, totalIncome, totalExpense, balance }) {
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((c) => (map[c.id] = c.name));
    return map;
  }, [categories]);

  const spendingByCategory = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.amount < 0)
      .forEach((t) => {
        const name = categoryMap[t.category_id] || 'Other';
        map[name] = (map[name] || 0) + Math.abs(t.amount);
      });
    return Object.entries(map).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
  }, [transactions, categoryMap]);

  const timelineData = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (!map[month]) map[month] = { month, income: 0, expense: 0 };
      if (t.amount > 0) map[month].income += t.amount;
      else map[month].expense += Math.abs(t.amount);
    });
    return Object.values(map)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((d) => ({
        ...d,
        income: parseFloat(d.income.toFixed(2)),
        expense: parseFloat(d.expense.toFixed(2)),
      }));
  }, [transactions]);

  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [transactions]
  );

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total income</span>
          <span className="stat-value positive">+${totalIncome.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total expenses</span>
          <span className="stat-value negative">-${totalExpense.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Net balance</span>
          <span className={`stat-value ${balance >= 0 ? 'positive' : 'negative'}`}>
            {balance >= 0 ? '+' : ''}${balance.toFixed(2)}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Transactions</span>
          <span className="stat-value neutral">{transactions.length}</span>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card wide">
          <h3 className="chart-title">Income vs Expenses</h3>
          {timelineData.length === 0 ? (
            <div className="chart-empty">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={timelineData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} width={50} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => `$${v}`}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)" name="Expense" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Spending by category</h3>
          {spendingByCategory.length === 0 ? (
            <div className="chart-empty">No expense data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {spendingByCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `$${v}`} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="recent-card">
        <h3 className="chart-title">Recent transactions</h3>
        {recentTransactions.length === 0 ? (
          <div className="chart-empty">No transactions yet</div>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th className="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t) => (
                <tr key={t.id}>
                  <td className="muted">{t.date}</td>
                  <td>{t.description}</td>
                  <td>
                    <span className="badge">{categoryMap[t.category_id] || '—'}</span>
                  </td>
                  <td className={`right amount ${t.amount >= 0 ? 'positive' : 'negative'}`}>
                    {t.amount >= 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
