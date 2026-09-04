'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Copy, Check, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function QueryInspector() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'orm' | 'viva'>('sql');
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const { showToast } = useToast();

  const queries = [
    {
      name: '1. Logged-in User Profile',
      sql: `SELECT id, "fullName", email, phone, gender, "createdAt", "updatedAt"
FROM "User"
WHERE id = $1
LIMIT 1;`,
      orm: `await prisma.user.findUnique({
  where: { id: session.userId },
  select: { id: true, fullName: true, email: true, phone: true, gender: true, createdAt: true }
});`,
      note: 'Indexed B-Tree lookup by Primary Key UUID. passwordHash is excluded from projection.',
    },
    {
      name: '2. Aggregate Live Counters',
      sql: `SELECT COUNT(*) AS total_users FROM "User";
SELECT COUNT(*) AS total_courses FROM "Course";`,
      orm: `const [totalUsers, totalCourses] = await Promise.all([
  prisma.user.count(),
  prisma.course.count(),
]);`,
      note: 'Executed concurrently using Promise.all to minimize query latency.',
    },
    {
      name: '3. Registered Users Directory',
      sql: `SELECT id, "fullName", email, phone, gender, "createdAt"
FROM "User"
ORDER BY "createdAt" DESC;`,
      orm: `await prisma.user.findMany({
  select: { id: true, fullName: true, email: true, phone: true, gender: true, createdAt: true },
  orderBy: { createdAt: 'desc' }
});`,
      note: 'Leverages the B-Tree index on "createdAt" for descending sort without memory overhead.',
    },
    {
      name: '4. Course Catalog (Independent Sample Table)',
      sql: `SELECT id, title, code, credits, description
FROM "Course"
ORDER BY "code" ASC;`,
      orm: `await prisma.course.findMany({
  orderBy: { code: 'asc' }
});`,
      note: 'Independent normalized table demonstrating multi-table relational retrieval.',
    },
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(label);
    showToast(`Copied to clipboard`, 'info');
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700 shadow-lg transition-colors"
      >
        <Terminal className="w-3.5 h-3.5 text-zinc-400" />
        <span>SQL Query Inspector</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-2xl max-h-[85vh] rounded-xl border border-zinc-800 bg-zinc-900 flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-zinc-800 text-zinc-300">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">
                      DBMS Query Inspector
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Live raw SQL and Prisma ORM queries for viva presentation
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-zinc-800 bg-zinc-950/30 px-4 pt-2 gap-1 text-xs">
                <button
                  onClick={() => setActiveTab('sql')}
                  className={`pb-2 px-3 font-medium border-b-2 transition-colors ${
                    activeTab === 'sql'
                      ? 'border-zinc-300 text-zinc-100'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Raw SQL
                </button>
                <button
                  onClick={() => setActiveTab('orm')}
                  className={`pb-2 px-3 font-medium border-b-2 transition-colors ${
                    activeTab === 'orm'
                      ? 'border-zinc-300 text-zinc-100'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Prisma ORM
                </button>
                <button
                  onClick={() => setActiveTab('viva')}
                  className={`pb-2 px-3 font-medium border-b-2 transition-colors ${
                    activeTab === 'viva'
                      ? 'border-zinc-300 text-zinc-100'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Viva Q&amp;A
                </button>
              </div>

              {/* Body */}
              <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
                {activeTab === 'sql' && (
                  <div className="space-y-3">
                    {queries.map((q, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3.5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-zinc-300">{q.name}</span>
                          <button
                            onClick={() => handleCopy(q.sql, q.name)}
                            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 transition-colors"
                          >
                            {copiedQuery === q.name ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            Copy
                          </button>
                        </div>
                        <pre className="p-2.5 rounded bg-zinc-950 text-zinc-300 font-mono text-xs overflow-x-auto border border-zinc-800/80">
                          <code>{q.sql}</code>
                        </pre>
                        <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                          <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                          {q.note}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'orm' && (
                  <div className="space-y-3">
                    {queries.map((q, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3.5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-zinc-300">{q.name}</span>
                          <button
                            onClick={() => handleCopy(q.orm, q.name)}
                            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 transition-colors"
                          >
                            {copiedQuery === q.name ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            Copy
                          </button>
                        </div>
                        <pre className="p-2.5 rounded bg-zinc-950 text-zinc-300 font-mono text-xs overflow-x-auto border border-zinc-800/80">
                          <code>{q.orm}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'viva' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-lg bg-zinc-950/50 border border-zinc-800 space-y-1">
                      <h4 className="font-semibold text-zinc-200">
                        Q: How is SQL Injection prevented?
                      </h4>
                      <p className="text-zinc-400 leading-relaxed">
                        Prisma internally generates parameterized queries with prepared statements. Input variables are never concatenated into raw SQL strings.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-zinc-950/50 border border-zinc-800 space-y-1">
                      <h4 className="font-semibold text-zinc-200">
                        Q: Why use bcrypt with 12 salt rounds?
                      </h4>
                      <p className="text-zinc-400 leading-relaxed">
                        Bcrypt includes an adaptive cryptographic salt that protects against rainbow table lookups. 12 rounds (4,096 iterations) prevents brute-forcing without lagging the server.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-zinc-950/50 border border-zinc-800 space-y-1">
                      <h4 className="font-semibold text-zinc-200">
                        Q: Why use an httpOnly cookie for session management?
                      </h4>
                      <p className="text-zinc-400 leading-relaxed">
                        Unlike localStorage, httpOnly cookies cannot be read by JavaScript in the browser, eliminating XSS token theft. SameSite=Lax protects against CSRF.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3.5 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-end text-xs">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
