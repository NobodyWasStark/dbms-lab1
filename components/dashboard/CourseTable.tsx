'use client';

import React, { useState, useMemo } from 'react';
import { BookOpen, Search, LayoutGrid, Table as TableIcon, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export interface CourseRecord {
  id: string;
  title: string;
  code: string;
  credits: number;
  description: string | null;
}

interface CourseTableProps {
  courses: CourseRecord[];
  isLoading?: boolean;
}

export default function CourseTable({ courses, isLoading = false }: CourseTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    showToast('Course UUID copied', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [courses, searchTerm]);

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xs backdrop-blur-sm">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-300">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-bold text-zinc-100">
                  Course Catalog
                </h2>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {courses.length} Courses
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                SELECT * FROM &quot;Course&quot; ORDER BY &quot;code&quot; ASC
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors w-44 sm:w-56"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Course Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-950/40 animate-pulse space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-zinc-800 rounded w-20" />
                  <div className="h-4 bg-zinc-800 rounded w-14" />
                </div>
                <div className="h-5 bg-zinc-800 rounded w-3/4" />
                <div className="h-4 bg-zinc-800/60 rounded w-full" />
              </div>
            ))
          ) : filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-12 text-zinc-500 text-sm font-mono">
              No courses matching your search.
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-950/40 hover:bg-zinc-950/70 hover:border-zinc-700/80 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs sm:text-sm font-bold px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200 group-hover:text-white transition-colors">
                      {course.code}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-zinc-400">
                      {course.credits} {course.credits === 1 ? 'Credit' : 'Credits'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-zinc-100">
                    {course.title}
                  </h3>

                  <p className="text-sm text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {course.description || 'Core university computer science curriculum.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>UUID</span>
                  <button
                    onClick={() => handleCopyId(course.id)}
                    className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                    title="Copy UUID"
                  >
                    <span>{course.id.substring(0, 8)}...</span>
                    {copiedId === course.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-zinc-500" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-950/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/70 text-zinc-300 font-medium border-b border-zinc-800/80 select-none">
              <tr>
                <th className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider">Code</th>
                <th className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider">Title</th>
                <th className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider">Credits</th>
                <th className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider">Description</th>
                <th className="py-3.5 px-4 text-right text-xs font-semibold uppercase tracking-wider">UUID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredCourses.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-zinc-200">
                    {c.code}
                  </td>
                  <td className="py-4 px-4 font-semibold text-zinc-100">{c.title}</td>
                  <td className="py-4 px-4 text-zinc-300">{c.credits}</td>
                  <td className="py-4 px-4 text-zinc-400 max-w-xs truncate">
                    {c.description || 'Core curriculum'}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-zinc-400 text-xs">
                    <button
                      onClick={() => handleCopyId(c.id)}
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>{c.id.substring(0, 8)}...</span>
                      {copiedId === c.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-zinc-500" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
