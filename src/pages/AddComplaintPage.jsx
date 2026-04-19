// src/pages/AddComplaintPage.jsx
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, EyeOff, Eye, Shield } from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import Toast, { useToast } from '../components/ui/Toast';
import { CATEGORIES } from '../utils/helpers';
import styles from './AddComplaintPage.module.css';

const INIT = {
  title: '',
  description: '',
  category: '',
  location: '',
  isAnonymous: false,
  isUrgent: false,
};

export default function AddComplaintPage() {
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addComplaint } = useComplaints();
  const { toast, showToast, closeToast } = useToast();
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.description.trim()) e.description = 'Description is required.';
    if (!form.category) e.category = 'Please select a category.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await addComplaint(form);
      setSubmitted(true);
      showToast('Complaint submitted successfully!', 'success');
      setTimeout(() => navigate('/complaints'), 2000);
    } catch (err) {
      showToast('Failed to submit. Please try again.', 'error');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isRagging = form.category === 'Ragging';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>New Complaint</h2>
          <p className={styles.sub}>
            All complaints are reviewed by hostel administration. Sensitive issues can be submitted anonymously.
          </p>
        </div>

        {/* Ragging callout */}
        {isRagging && (
          <div className={styles.raggingAlert}>
            <Shield size={20} className={styles.shieldIcon} />
            <div>
              <strong>Ragging is a serious offence.</strong>
              <p>Your complaint will be handled with strict confidentiality. We strongly recommend enabling Anonymous mode below. You are safe to report.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Title */}
          <div className={styles.field}>
            <label className={styles.label}>
              Complaint Title <span className={styles.req}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              placeholder="e.g. WiFi not working in Room 012"
              maxLength={100}
            />
            {errors.title && <span className={styles.errMsg}>{errors.title}</span>}
          </div>

          {/* Category */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>
                Category <span className={styles.req}>*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`${styles.input} ${errors.category ? styles.inputError : ''}`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <span className={styles.errMsg}>{errors.category}</span>}
            </div>

            {/* Location */}
            <div className={styles.field}>
              <label className={styles.label}>Location <span className={styles.optional}>(optional)</span></label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g. Ground Floor, Room 012"
                maxLength={80}
              />
            </div>
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>
              Description <span className={styles.req}>*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              placeholder="Describe the issue in detail. The more context you provide, the faster it gets resolved."
              rows={5}
              maxLength={1000}
            />
            <div className={styles.charCount}>{form.description.length}/1000</div>
            {errors.description && <span className={styles.errMsg}>{errors.description}</span>}
          </div>

          {/* Toggles */}
          <div className={styles.togglesRow}>
            {/* Anonymous */}
            <label className={`${styles.toggle} ${form.isAnonymous ? styles.toggleOn : ''}`}>
              <input
                type="checkbox"
                name="isAnonymous"
                checked={form.isAnonymous}
                onChange={handleChange}
                className={styles.hiddenCheck}
              />
              <div className={styles.toggleContent}>
                <div className={styles.toggleIcon}>
                  {form.isAnonymous ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
                <div>
                  <div className={styles.toggleLabel}>Submit Anonymously</div>
                  <div className={styles.toggleDesc}>
                    {form.isAnonymous
                      ? 'Your identity will NOT be shown to anyone.'
                      : 'Your name and room will be visible to admin.'}
                  </div>
                </div>
                <div className={`${styles.pill} ${form.isAnonymous ? styles.pillOn : styles.pillOff}`}>
                  {form.isAnonymous ? 'ON' : 'OFF'}
                </div>
              </div>
            </label>

            {/* Urgent */}
            <label className={`${styles.toggle} ${form.isUrgent ? styles.toggleUrgent : ''}`}>
              <input
                type="checkbox"
                name="isUrgent"
                checked={form.isUrgent}
                onChange={handleChange}
                className={styles.hiddenCheck}
              />
              <div className={styles.toggleContent}>
                <div className={styles.toggleIcon}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <div className={styles.toggleLabel}>Mark as Urgent</div>
                  <div className={styles.toggleDesc}>
                    Use for safety issues or critical problems that need immediate attention.
                  </div>
                </div>
                <div className={`${styles.pill} ${form.isUrgent ? styles.pillUrgent : styles.pillOff}`}>
                  {form.isUrgent ? 'URGENT' : 'OFF'}
                </div>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate('/complaints')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={submitting || submitted}
            >
              {submitting
                ? <><span className={styles.spinner} /> Submitting…</>
                : submitted
                  ? '✓ Submitted!'
                  : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} key={toast.key} />
      )}
    </div>
  );
}
