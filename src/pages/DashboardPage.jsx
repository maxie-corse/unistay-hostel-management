// src/pages/DashboardPage.jsx
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintsContext';
import StatCard from '../components/dashboard/StatCard';
import ComplaintCard from '../components/complaints/ComplaintCard';
import EmptyState from '../components/ui/EmptyState';
import { CATEGORY_ICONS } from '../utils/helpers';
import styles from './DashboardPage.module.css';
import { seedMessMenu } from '../services/firebase';

const CHART_COLORS = ['#f59e0b','#4f83f7','#10b981','#ef4444','#a78bfa','#34d399','#fb923c','#f472b6','#94a3b8'];

export default function DashboardPage() {
  const { profile } = useAuth();
  const { complaints, loading } = useComplaints();

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const urgent = complaints.filter(c => c.isUrgent).length;

    // Category breakdown
    const catMap = {};
    for (const c of complaints) {
      catMap[c.category] = (catMap[c.category] ?? 0) + 1;
    }
    const byCategory = Object.entries(catMap)
      .map(([name, count]) => ({ name, count, icon: CATEGORY_ICONS[name] ?? '📌' }))
      .sort((a, b) => b.count - a.count);

    return { total, pending, inProgress, resolved, urgent, byCategory };
  }, [complaints]);

  const recentComplaints = useMemo(() =>
    complaints.slice(0, 5), [complaints]);

  return (
    <div className={styles.page}>
      {/* Welcome */}
      <div className={styles.welcomeRow}>
        <div>
          <h2 className={styles.welcome}>
            Good {getGreeting()}, {profile?.name?.split(' ')[0] ?? 'there'} 👋
          </h2>
          <p className={styles.welcomeSub}>
            {profile?.role === 'admin'
              ? 'Here\'s an overview of all hostel complaints.'
              : `Room ${profile?.roomNumber ?? '—'} · Here's your complaint summary.`}
          </p>
        </div>
        <Link to="/complaints/new" className={styles.newBtn}>
          + New Complaint
        </Link>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Complaints" value={stats.total} icon="📋" accent="var(--blue)" />
        <StatCard label="Pending" value={stats.pending} icon="⏳" accent="var(--yellow)"
          sub={stats.total ? `${Math.round(stats.pending/stats.total*100)}% of total` : undefined} />
        <StatCard label="In Progress" value={stats.inProgress} icon="🔧" accent="var(--blue)" />
        <StatCard label="Resolved" value={stats.resolved} icon="✅" accent="var(--green)"
          sub={stats.total ? `${Math.round(stats.resolved/stats.total*100)}% resolved` : undefined} />
      </div>

      {stats.urgent > 0 && (
        <div className={styles.urgentBanner}>
          <span>🚨</span>
          <strong>{stats.urgent} urgent complaint{stats.urgent > 1 ? 's' : ''}</strong>
          {' '}need{stats.urgent === 1 ? 's' : ''} immediate attention.
          <Link to="/complaints" className={styles.urgentLink}>View all →</Link>
        </div>
      )}

      <div className={styles.lower}>
        {/* Chart */}
        {stats.byCategory.length > 0 && (
          <div className={styles.chartSection}>
            <h3 className={styles.sectionTitle}>Complaints by Category</h3>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.byCategory} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--text-3)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tick={{ fill: 'var(--text-3)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: 'var(--text)',
                    }}
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    formatter={(v, n, p) => [v, p.payload.icon + ' ' + p.payload.name]}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {stats.byCategory.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent */}
        <div className={styles.recentSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent Complaints</h3>
            <Link to="/complaints" className={styles.viewAll}>View all →</Link>
          </div>

          {loading ? (
            <div className={styles.loadingList}>
              {[1,2,3].map(i => <div key={i} className={styles.skeleton} />)}
            </div>
          ) : recentComplaints.length === 0 ? (
            <EmptyState
              icon="📭"
              title="No complaints yet"
              description="Raise your first complaint to get started."
              action={<Link to="/complaints/new" className={styles.newBtn}>+ New Complaint</Link>}
            />
          ) : (
            <div className={styles.cardList}>
              {recentComplaints.map(c => (
                <ComplaintCard key={c.id} complaint={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
