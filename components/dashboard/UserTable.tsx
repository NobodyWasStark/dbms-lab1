'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  Copy,
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  createdAt: string;
}

interface UserTableProps {
  users: UserRecord[];
  isLoading?: boolean;
}

type SortField = 'fullName' | 'email' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function UserTable({ users, isLoading = false }: UserTableProps) {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isSearching = searchInput !== debouncedSearch;

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 180);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const processedUsers = useMemo(() => {
    const result = users.filter((u) => {
      const query = debouncedSearch.toLowerCase().trim();
      const matchesSearch =
        !query ||
        u.fullName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.phone.includes(query);
      const matchesGender = genderFilter === 'ALL' || u.gender === genderFilter;
      return matchesSearch && matchesGender;
    });

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'createdAt') {
        const timeA = new Date(aVal).getTime();
        const timeB = new Date(bVal).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }

      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, debouncedSearch, genderFilter, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(processedUsers.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedUsers.slice(start, start + pageSize);
  }, [processedUsers, currentPage, pageSize]);

  const getGenderBadge = (gender: string) => {
    switch (gender) {
      case 'MALE':
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-800/90 text-zinc-200 border border-zinc-700/60">
            Male
          </span>
        );
      case 'FEMALE':
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-800/90 text-zinc-100 border border-zinc-700/60">
            Female
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-800/90 text-zinc-300 border border-zinc-700/60">
            Other
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-zinc-600" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-zinc-200" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-zinc-200" />
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 shadow-xs backdrop-blur-sm">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
              <UserCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-bold text-zinc-100">
                  Registered Students
                </h2>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/60 text-zinc-300">
                  {users.length} Records
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                SELECT * FROM &quot;User&quot; ORDER BY {sortField} {sortOrder.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-9 py-2 text-sm rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors w-48 sm:w-60"
            />
            {isSearching && (
              <Loader2 className="w-3.5 h-3.5 text-zinc-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>

          {/* Understated Filter Tabs */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm">
            {(['ALL', 'MALE', 'FEMALE'] as const).map((g) => {
              const isActive = genderFilter === g;
              return (
                <button
                  key={g}
                  onClick={() => {
                    setGenderFilter(g);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/70 shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>

          {/* Page Size Select */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-zinc-600 cursor-pointer"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-950/40">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900/60 text-zinc-300 font-medium border-b border-zinc-800/80 select-none">
            <tr>
              <th
                onClick={() => handleSort('fullName')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="uppercase text-xs tracking-wider font-semibold">Student Name</span>
                  {renderSortIcon('fullName')}
                </div>
              </th>

              <th
                onClick={() => handleSort('email')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="uppercase text-xs tracking-wider font-semibold">Contact Info</span>
                  {renderSortIcon('email')}
                </div>
              </th>

              <th className="py-3.5 px-4 uppercase text-xs tracking-wider font-semibold">Gender</th>

              <th
                onClick={() => handleSort('createdAt')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="uppercase text-xs tracking-wider font-semibold">Registration Date</span>
                  {renderSortIcon('createdAt')}
                </div>
              </th>

              <th className="py-3.5 px-4 text-right uppercase text-xs tracking-wider font-semibold">Primary Key (UUID)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/50 font-sans">
            {isLoading ? (
              [...Array(pageSize)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-4"><div className="h-4.5 bg-zinc-800 rounded w-32" /></td>
                  <td className="py-4 px-4"><div className="h-4.5 bg-zinc-800 rounded w-40" /></td>
                  <td className="py-4 px-4"><div className="h-4.5 bg-zinc-800 rounded w-16" /></td>
                  <td className="py-4 px-4"><div className="h-4.5 bg-zinc-800 rounded w-28" /></td>
                  <td className="py-4 px-4 text-right"><div className="h-4.5 bg-zinc-800 rounded w-24 ml-auto" /></td>
                </tr>
              ))
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-zinc-500 font-mono text-sm">
                  No matching student records found.
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {paginatedUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    layout
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.03,
                      ease: 'easeOut',
                    }}
                    whileHover={{
                      backgroundColor: 'rgba(39, 39, 42, 0.3)',
                    }}
                    className="transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center font-mono font-medium text-zinc-300 text-xs shrink-0">
                          {getInitials(user.fullName)}
                        </div>
                        <div className="font-semibold text-zinc-100 text-sm">
                          {user.fullName}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      <div className="flex items-center gap-2 text-zinc-200 text-sm">
                        <Mail className="w-4 h-4 text-zinc-500" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono mt-1">
                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{user.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">{getGenderBadge(user.gender)}</td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-xs text-zinc-400">
                      <div className="relative inline-block">
                        <button
                          onClick={() => handleCopyId(user.id)}
                          className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs"
                          title="Copy full UUID"
                        >
                          <span className="truncate max-w-[95px]">{user.id.substring(0, 8)}...</span>
                          {copiedId === user.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-zinc-500" />
                          )}
                        </button>

                        <AnimatePresence>
                          {copiedId === user.id && (
                            <motion.span
                              initial={{ opacity: 0, y: 3, scale: 0.85 }}
                              animate={{ opacity: 1, y: -24, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              transition={{ duration: 0.12 }}
                              className="absolute right-0 bg-zinc-800 border border-zinc-700 text-zinc-100 font-mono text-xs font-semibold px-2.5 py-1 rounded shadow-lg pointer-events-none z-20 whitespace-nowrap"
                            >
                              Copied!
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Summary Footer */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-zinc-400">
        <div>
          Showing{' '}
          <strong className="text-zinc-200 font-mono">
            {processedUsers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </strong>{' '}
          to{' '}
          <strong className="text-zinc-200 font-mono">
            {Math.min(currentPage * pageSize, processedUsers.length)}
          </strong>{' '}
          of <strong className="text-zinc-200 font-mono">{processedUsers.length}</strong> student records
        </div>

        {/* Pagination Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm text-zinc-300 font-mono px-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
