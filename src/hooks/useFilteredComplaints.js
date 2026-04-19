// src/hooks/useFilteredComplaints.js
import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['All', 'Pending', 'In Progress', 'Resolved'];
const CATEGORY_OPTIONS = [
  'All', 'Room Cleaning', 'Washing Machines', 'Pantry',
  'WiFi', 'Electricity', 'Water', 'Mess', 'Ragging', 'Other',
];

export const useFilteredComplaints = (complaints) => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyMine, setOnlyMine] = useState(false);
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'upvotes'

  const filtered = useMemo(() => {
    let result = complaints.filter((c) => {
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchCat = categoryFilter === 'All' || c.category === categoryFilter;

      const matchSearch =
        !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchMine =
        !onlyMine || c.createdBy === user?.uid; 

      return matchStatus && matchCat && matchSearch && matchMine;
    });

    if (sortBy === 'upvotes') {
      result = result.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else {
      result = result.sort((a, b) =>
        (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );
    }

    return result;
  }, [complaints, statusFilter, categoryFilter, searchQuery, onlyMine, sortBy, user]); 

  return {
    filtered,
    onlyMine, setOnlyMine,
    statusFilter, setStatusFilter,
    categoryFilter, setCategoryFilter,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    STATUS_OPTIONS,
    CATEGORY_OPTIONS,
  };
};