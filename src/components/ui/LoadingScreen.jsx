// src/components/ui/LoadingScreen.jsx
import styles from './LoadingScreen.module.css';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className={styles.screen}>
      <div className={styles.spinner} />
      <p className={styles.msg}>{message}</p>
    </div>
  );
}
