// src/components/layout/Topbar.jsx
import { useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import styles from './Topbar.module.css';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/complaints': 'Complaints',
  '/complaints/new': 'New Complaint',
  '/mess': 'Mess Menu',
};

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'UniStay';

  return (
    <header className={styles.topbar}>
      <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Open menu">
        <Menu size={20} />
      </button>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.right}>
        <div className={styles.bellWrap}>
          <Bell size={18} className={styles.bell} />
        </div>
      </div>
    </header>
  );
}
