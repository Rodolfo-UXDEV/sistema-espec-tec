import React from 'react';

export default function Header({ currentView, setCurrentView, isDeveloper = false }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* Logo Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200 dark:shadow-none transition-all group-hover:scale-105">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors">
            Especificação Técnica Alesp
          </span>
        </div>

        {/* Navigation Tabs */}
        {!isDeveloper && (
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setCurrentView('edit')}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                currentView === 'edit'
                  ? 'bg-white text-indigo-650 shadow-sm dark:bg-slate-700 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Editar Especificação
            </button>
            <button
              onClick={() => setCurrentView('view')}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                currentView === 'view'
                  ? 'bg-white text-indigo-650 shadow-sm dark:bg-slate-700 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Visualizar Especificação
            </button>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Ambiente Local
          </span>
        </div>
      </div>
    </header>
  );
}

