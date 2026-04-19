// src/context/ComplaintsContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { subscribeToComplaints, createComplaint, updateComplaintStatus } from '../services/firebase';
import { useAuth } from './AuthContext';

const ComplaintsContext = createContext(null);

export const ComplaintsProvider = ({ children }) => {
  const { user, profile } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !profile) {
      setComplaints([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToComplaints(user.uid, profile.role, (data) => {
      setComplaints(data);
      setLoading(false);
    });
    return unsub;
  }, [user, profile]);

  const addComplaint = useCallback(async (data) => {
    const payload = {
      ...data,

      // ALWAYS store user internally
      createdBy: user.uid,

      // Hide identity only if anonymous
      createdByName: data.isAnonymous ? null : profile?.name,
      createdByRoom: data.isAnonymous ? null : profile?.roomNumber,
    };
    await createComplaint(payload);
  }, [user, profile]);

  const resolveComplaint = useCallback((id, status) =>
    updateComplaintStatus(id, status), []);

  return (
    <ComplaintsContext.Provider value={{ complaints, loading, addComplaint, resolveComplaint }}>
      {children}
    </ComplaintsContext.Provider>
  );
};

export const useComplaints = () => {
  const ctx = useContext(ComplaintsContext);
  if (!ctx) throw new Error('useComplaints must be used within ComplaintsProvider');
  return ctx;
};
