import React from 'react';

export default function ScreensListSection({ screens = [], onAddClick, onEditClick, onDeleteClick }) {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header with Title and Add Button on the same line */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
          Detalhamento das Telas
        </h2>
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow active:scale-95 duration-200"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Adicionar tela
        </button>
      </div>

      {/* List of Screens */}
      <div className="mt-4">
        {screens.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-slate-800">
              <svg
                className="h-6 w-6 text-slate-505 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Nenhuma tela foi detalhada nesta especificação ainda.
            </p>
            <button
              onClick={onAddClick}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Clique para adicionar a primeira tela
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {screens.map((screen, index) => {
              const screenComponents = screen.components || [];
              const totalComps = screenComponents.length;
              const completedComps = screenComponents.filter(c => c.status === 'concluido').length;
              const pct = totalComps > 0 ? Math.round((completedComps / totalComps) * 100) : 0;

              return (
                <div
                  key={screen.id}
                  className="flex items-center justify-between py-3.5 group hover:bg-slate-50/40 px-2 rounded-xl transition-colors dark:hover:bg-slate-800/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                      {index + 1}
                    </div>
                    <span className="font-display text-sm font-bold text-slate-805 dark:text-slate-200">
                      {screen.name}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border shrink-0 ${
                      pct === 100
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-955/20 dark:text-emerald-400 dark:border-emerald-800/40'
                        : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-955/20 dark:text-rose-400 dark:border-rose-800/40'
                    }`}>
                      {pct}% concluído
                    </span>
                  </div>

                  {/* Edit and Delete Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditClick(screen)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-90 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                      title="Editar Tela"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => onDeleteClick(screen.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-rose-950/20"
                      title="Excluir Tela"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
