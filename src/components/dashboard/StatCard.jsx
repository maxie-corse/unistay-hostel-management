// src/components/dashboard/StatCard.jsx
import styles from './StatCard.module.css';

export default function StatCard({ label, value, icon, accent, sub }) {
  return (
    <div className={styles.card} style={{ '--card-accent': accent }}>
      <div className={styles.top}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.value}>{value}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
      <div className={styles.bar} />
    </div>
  );
}
