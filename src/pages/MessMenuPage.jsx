// src/pages/MessMenuPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMessMenu, updateMessMenu } from '../services/firebase';
import { DAYS_ORDER } from '../utils/helpers';
import styles from './MessMenuPage.module.css';

const MEALS = ['breakfast', 'lunch', 'dinner'];
const MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', dinner: '🌙' };
const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };

export default function MessMenuPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState({});

  const today = new Date().toLocaleString('en-US', { weekday: 'long' });

  useEffect(() => {
    fetchMessMenu()
      .then(data => {
        const sorted = DAYS_ORDER.map(day =>
          data.find(d => d.day?.toLowerCase() === day.toLowerCase())
        ).filter(Boolean);
        setMenu(sorted);
      })
      .catch(() => setError('Failed to load mess menu.'))
      .finally(() => setLoading(false));
  }, []);

  // 🔥 handle edit (admin only)
  const handleEdit = useCallback(async (dayId, field, value) => {
    try {
      await updateMessMenu(dayId, { [field]: value });

      // update UI instantly
      setMenu(prev =>
        prev.map(d =>
          d.id === dayId ? { ...d, [field]: value } : d
        )
      );
    } catch (err) {
      console.error("Update failed:", err);
    }
  }, []);

  if (loading) {
    return <div className={styles.page}>Loading menu...</div>;
  }

  if (error) {
    return <div className={styles.page}>{error}</div>;
  }

  if (menu.length === 0) {
    return <div className={styles.page}>No menu available</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Mess Menu</h2>
        <p className={styles.sub}>
          Weekly schedule · Today is <strong>{today}</strong>
        </p>
      </div>

      <div className={styles.grid}>
        {menu.map(dayMenu => {
          const isToday = dayMenu.day === today;

          return (
            <div
              key={dayMenu.id}
              className={`${styles.card} ${isToday ? styles.todayCard : ''}`}
            >
              <div className={styles.dayHeader}>
                <span>{dayMenu.day}</span>
                {isToday && <span>Today</span>}
              </div>

              <div className={styles.meals}>
                {MEALS.map(meal => (
                  <div key={meal} className={styles.meal}>
                    <div>
                      {MEAL_ICONS[meal]} {MEAL_LABELS[meal]}
                    </div>

                    {isAdmin ? (
                      <textarea
                        value={
                          drafts[dayMenu.id]?.[meal] ?? dayMenu[meal] ?? ''
                        }
                        onChange={(e) => {
                          const value = e.target.value;

                          setDrafts(prev => ({
                            ...prev,
                            [dayMenu.id]: {
                              ...prev[dayMenu.id],
                              [meal]: value,
                            },
                          }));
                        }}
                        onBlur={() => {
                          const value = drafts[dayMenu.id]?.[meal];
                          if (value !== undefined) {
                            handleEdit(dayMenu.id, meal, value);

                            // 🧹 clear draft after save
                            setDrafts(prev => {
                              const updated = { ...prev };
                              if (updated[dayMenu.id]) {
                                delete updated[dayMenu.id][meal];
                                if (Object.keys(updated[dayMenu.id]).length === 0) {
                                  delete updated[dayMenu.id];
                                }
                              }
                              return updated;
                            });
                          }
                        }}
                        className={styles.input}
                      />
                    ) : (
                      <p>
                        {dayMenu[meal] || 'Not specified'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}