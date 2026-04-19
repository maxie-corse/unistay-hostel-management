// src/pages/ComplaintsPage.jsx
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useFilteredComplaints } from '../hooks/useFilteredComplaints';
import ComplaintCard from '../components/complaints/ComplaintCard';
import EmptyState from '../components/ui/EmptyState';
import styles from './ComplaintsPage.module.css';

export default function ComplaintsPage() {
  const { complaints, loading } = useComplaints();
  const {
    filtered,
    onlyMine, setOnlyMine,
    statusFilter, setStatusFilter,
    categoryFilter, setCategoryFilter,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    STATUS_OPTIONS, CATEGORY_OPTIONS,
  } = useFilteredComplaints(complaints);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Complaints</h2>
          <p className={styles.sub}>
            {complaints.length} total · {filtered.length} shown
          </p>
        </div>
        <Link to="/complaints/new" className={styles.newBtn}>+ New Complaint</Link>
      </div>

      {/* Filters */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search complaints…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <label>
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => setOnlyMine(e.target.checked)}
          />
          My Complaints
        </label>

        <div className={styles.filters}>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className={styles.select}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className={styles.select}
          >
            {CATEGORY_OPTIONS.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.select}
          >
            <option value="latest">Latest</option>
            <option value="upvotes">Most Upvoted</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className={styles.skeletonList}>
          {[1,2,3,4].map(i => <div key={i} className={styles.skeleton} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={complaints.length === 0 ? '📭' : '🔍'}
          title={complaints.length === 0 ? 'No complaints yet' : 'No results found'}
          description={
            complaints.length === 0
              ? 'Submit your first complaint using the button above.'
              : 'Try adjusting your filters or search query.'
          }
          action={
            complaints.length === 0 &&
            <Link to="/complaints/new" className={styles.newBtn}>+ New Complaint</Link>
          }
        />
      ) : (
        <div className={styles.list}>
          {filtered.map(c => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
}
