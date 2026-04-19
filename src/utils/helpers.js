// src/utils/helpers.js
import { formatDistanceToNow } from 'date-fns';

export const timeAgo = (timestamp) => {
  if (!timestamp) return 'Just now';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const STATUS_COLORS = {
  Pending: { bg: 'var(--badge-pending-bg)', text: 'var(--badge-pending-text)', dot: '#f59e0b' },
  'In Progress': { bg: 'var(--badge-progress-bg)', text: 'var(--badge-progress-text)', dot: '#3b82f6' },
  Resolved: { bg: 'var(--badge-resolved-bg)', text: 'var(--badge-resolved-text)', dot: '#10b981' },
};

export const CATEGORY_ICONS = {
  'Room Cleaning': '🧹',
  'Washing Machines': '🌀',
  'Pantry': '🍳',
  'WiFi': '📶',
  'Electricity': '⚡',
  'Water': '💧',
  'Mess': '🍽️',
  'Ragging': '🚨',
  'Other': '📌',
};

export const CATEGORIES = [
  'Room Cleaning', 'Washing Machines', 'Pantry',
  'WiFi', 'Electricity', 'Water', 'Mess', 'Ragging', 'Other',
];

export const DAYS_ORDER = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];
