// src/components/layout/Sidebar.jsx
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, MessageSquareWarning, PlusCircle,
  UtensilsCrossed, LogOut, Shield,
} from 'lucide-react';
import styles from './Sidebar.module.css';
import logo from '../../assets/logo.png';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/complaints', icon: MessageSquareWarning, label: 'Complaints' },
  { to: '/complaints/new', icon: PlusCircle, label: 'New Complaint' },
  { to: '/mess', icon: UtensilsCrossed, label: 'Mess Menu' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { profile, logout } = useAuth();
  const location = useLocation();

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <img src={logo} alt="UniStay Logo" className={styles.logoImg} />
        <div>
          <div className={styles.logoName}>UniStay</div>
          <div className={styles.logoSub}>Hostel Management</div>
        </div>
      </div>

      {/* User card */}
      <div className={styles.userCard}>
        <div className={styles.avatar}>
          {profile?.name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{profile?.name ?? 'User'}</div>
          <div className={styles.userRoom}>
            {profile?.role === 'admin'
              ? <span className={styles.adminBadge}><Shield size={10} /> Admin</span>
              : `Room ${profile?.roomNumber ?? '—'}`}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <span className={styles.navLabel}>Navigation</span>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            end={to === '/dashboard'}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.spacer} />

      {/* Logout */}
      <button className={styles.logout} onClick={logout}>
        <LogOut size={16} />
        <span>Log out</span>
      </button>
    </aside>
  );
}
