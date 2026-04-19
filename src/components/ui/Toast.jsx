// src/components/ui/Toast.jsx
import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import styles from './Toast.module.css';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
      <span className={styles.msg}>{message}</span>
      <button className={styles.close} onClick={onClose}><X size={14} /></button>
    </div>
  );
}

// Hook-friendly toast manager
import { useState, useCallback } from 'react';
export function useToast() {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, key: Date.now() });
  }, []);
  const closeToast = useCallback(() => setToast(null), []);
  return { toast, showToast, closeToast };
}
