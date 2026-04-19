// src/components/complaints/ComplaintCard.jsx
import { useCallback } from 'react';
import { AlertTriangle, EyeOff, Clock } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import { CATEGORY_ICONS, timeAgo } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintsContext';
import styles from './ComplaintCard.module.css';
import { ThumbsUp } from 'lucide-react';
import { toggleUpvote } from '../../services/firebase';

const STATUS_CYCLE = ['Pending', 'In Progress', 'Resolved'];

export default function ComplaintCard({ complaint }) {
  const { user, profile } = useAuth();
  const { resolveComplaint } = useComplaints();
  const isAdmin = profile?.role === 'admin';
  const isOwner = complaint.createdBy === user?.uid;
  const isRagging = complaint.category === 'Ragging';
  const isUrgent = complaint.isUrgent;
  const hasUpvoted = complaint.upvotedBy?.includes(user?.uid);

  const handleUpvote = async () => {
    try {
      if (complaint.createdBy === user.uid) return;
      await toggleUpvote(complaint.id, user.uid, hasUpvoted);
    } catch (err) {
      console.error("Upvote failed:", err);
    }
  };

  const handleStatusChange = useCallback(async (e) => {
    await resolveComplaint(complaint.id, e.target.value);
  }, [complaint.id, resolveComplaint]);

  return (
    <div className={`
      ${styles.card}
      ${isRagging ? styles.ragging : ''}
      ${isUrgent && !isRagging ? styles.urgent : ''}
      fade-in
    `}>
      {/* Top row */}
      <div className={styles.header}>
        <div className={styles.categoryChip}>
          <span>{CATEGORY_ICONS[complaint.category] ?? '📌'}</span>
          <span>{complaint.category}</span>
        </div>
        <div className={styles.badges}>
          {isUrgent && (
            <span className={styles.urgentBadge}>
              <AlertTriangle size={11} /> Urgent
            </span>
          )}
          {complaint.isAnonymous && (
            <span className={styles.anonBadge}>
              <EyeOff size={11} /> Anonymous
            </span>
          )}
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      {/* Title */}
      <h3 className={styles.title}>{complaint.title}</h3>

      {/* Description */}
      <p className={styles.desc}>{complaint.description}</p>

      {/* Location */}
      {complaint.location && (
        <p className={styles.location}>📍 {complaint.location}</p>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.meta}>
          <Clock size={13} />
          <span>{timeAgo(complaint.createdAt)}</span>
          {(isAdmin || isOwner) && !complaint.isAnonymous && complaint.createdByName && 
          ( <span className={styles.submittedBy}> 
          · {complaint.createdByName} 
          {complaint.createdByRoom && ` · Room ${complaint.createdByRoom}`} 
          </span> )}
          <div className={styles.actions}>
            <button
              onClick={handleUpvote}
              className={`${styles.upvoteBtn} ${hasUpvoted ? styles.active : ''}`}
            >
              <ThumbsUp size={14} />
              <span>{complaint.upvotes || 0}</span>
            </button>
          </div>
        </div>

        {/* Admin status changer */}
        {isAdmin && (
          <select
            className={styles.statusSelect}
            value={complaint.status}
            onChange={handleStatusChange}
          >
            {STATUS_CYCLE.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
