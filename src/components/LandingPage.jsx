import React from 'react';

export default function LandingPage({ onSelectAnalista, onSelectDesenvolvedor }) {
  return (
    <div className="relative flex min-h-[80vh] w-full flex-col items-center justify-center px-4 py-12 overflow-hidden">
      
      {/* Hexagonal Watermark Logo behind cards */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <svg
          viewBox="0 0 100 100"
          className="w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] md:w-[500px] md:h-[500px] text-indigo-900/5 dark:text-white/5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Outer Hexagon */}
          <polygon points="50,2 93,27 93,73 50,98 7,73 7,27" />
          {/* Inner Hexagon */}
          <polygon points="50,12 83,31 83,69 50,88 17,69 17,31" strokeDasharray="3 3" />
          {/* Center details */}
          <circle cx="50" cy="50" r="10" strokeWidth="1" />
          <line x1="50" y1="2" x2="50" y2="12" />
          <line x1="50" y1="88" x2="50" y2="98" />
          <line x1="7" y1="27" x2="17" y2="31" />
          <line x1="93" y1="27" x2="83" y2="31" />
          <line x1="7" y1="73" x2="17" y2="69" />
          <line x1="93" y1="73" x2="83" y2="69" />
        </svg>
      </div>

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-12 text-center">
        {/* Title */}
        <div className="space-y-3">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-widest text-[#262454] dark:text-white uppercase">
            Especificação Técnica Alesp
          </h1>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-violet-650"></div>
        </div>

        {/* Selection Cards Container */}
        <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-8 md:gap-12 mt-4">
          
          {/* Card 1: SOU DESENVOLVEDOR (Active) */}
          <button
            onClick={onSelectDesenvolvedor}
            className="group relative flex aspect-square w-full max-w-[280px] sm:max-w-[300px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 cursor-pointer active:scale-98"
          >
            {/* Hover Gradient Border Glow */}
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-violet-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

            {/* Icon Container */}
            <div className="flex h-20 w-28 items-center justify-center rounded-2xl border border-indigo-50 bg-indigo-50/30 text-indigo-650 shadow-sm dark:border-indigo-950/40 dark:bg-indigo-950/20 dark:text-indigo-400 transition-colors duration-300 group-hover:bg-indigo-50/70 dark:group-hover:bg-indigo-950/40">
              <svg
                className="h-10 w-10 transition-transform duration-300 group-hover:scale-105"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>

            {/* Role Title */}
            <span className="mt-8 text-base font-extrabold tracking-wider text-indigo-650 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors uppercase">
              Sou Desenvolvedor
            </span>

            {/* Visual CTA Hint */}
            <div className="absolute bottom-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Acessar</span>
              <svg className="h-3 w-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Card 2: SOU ANALISTA (Active) */}
          <button
            onClick={onSelectAnalista}
            className="group relative flex aspect-square w-full max-w-[280px] sm:max-w-[300px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 cursor-pointer active:scale-98"
          >
            {/* Hover Gradient Border Glow */}
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-violet-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

            {/* Icon Container */}
            <div className="flex h-20 w-28 items-center justify-center rounded-2xl border border-indigo-50 bg-indigo-50/30 text-indigo-650 shadow-sm dark:border-indigo-950/40 dark:bg-indigo-950/20 dark:text-indigo-400 transition-colors duration-300 group-hover:bg-indigo-50/70 dark:group-hover:bg-indigo-950/40">
              <svg
                className="h-10 w-10 transition-transform duration-300 group-hover:scale-105"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            {/* Role Title */}
            <span className="mt-8 text-base font-extrabold tracking-wider text-indigo-650 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors uppercase">
              Sou Analista
            </span>

            {/* Visual CTA Hint */}
            <div className="absolute bottom-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Acessar</span>
              <svg className="h-3 w-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}
