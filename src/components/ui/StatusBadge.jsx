// src/components/ui/StatusBadge.jsx
import { STATUS_COLORS } from '../../utils/helpers';
import styles from './StatusBadge.module.css';

export default function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS['Pending'];
  return (
    <span
      className={styles.badge}
      style={{ background: colors.bg, color: colors.text }}
    >
      <span className={styles.dot} style={{ background: colors.dot }} />
      {status}
    </span>
  );
}
