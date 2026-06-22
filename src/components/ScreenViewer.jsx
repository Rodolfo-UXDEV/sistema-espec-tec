import React, { useState } from 'react';
import ComponentViewModal from './ComponentViewModal';

export default function ScreenViewer({
  screensList,
  selectedScreenId,
  loadScreenData,
  screenName,
  image,
  details,
  isLoading,
}) {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
    setIsViewModalOpen(true);
  };

  return (
    <div className="w-full space-y-8">
      {/* Selection Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Visualizar Telas
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Navegue e explore a especificação técnica de cada tela do sistema.
          </p>
        </div>

        {/* Screen Selector */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Selecionar Tela:
          </label>
          <select
            value={selectedScreenId}
            onChange={(e) => loadScreenData(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="">-- Selecione uma Tela --</option>
            {screensList.map((screen) => (
              <option key={screen.id} value={screen.id}>
                {screen.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-650"></div>
          <p className="text-sm font-medium text-slate-500">Carregando especificações...</p>
        </div>
      ) : !selectedScreenId ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-slate-250 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-450 dark:bg-slate-800/80">
            <svg
              className="h-6 w-6 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-700 dark:text-slate-200">
            Nenhuma tela selecionada
          </h3>
          <p className="mt-1 text-sm text-slate-400 max-w-sm">
            Escolha uma tela no seletor acima para visualizar seu design e detalhes técnicos.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* 1 & 2 - Nome da Tela e Imagem da Tela */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-indigo-500"></span>
              <h2 className="font-display text-2xl font-extrabold text-slate-850 dark:text-white tracking-tight">
                {screenName}
              </h2>
            </div>

            {image ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/20">
                <div className="flex justify-center py-4">
                  <img
                    src={image}
                    alt={`Mock-up de ${screenName}`}
                    className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-md"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-950/10">
                <svg
                  className="h-8 w-8 text-slate-300 dark:text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="mt-2 text-xs font-semibold text-slate-450 dark:text-slate-500">
                  Nenhum mockup cadastrado para esta tela
                </span>
              </div>
            )}
          </div>

          {/* 3 - Sessão Componentes com as imagens dos componentes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-indigo-500"></span>
              <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                Componentes da Tela
              </h2>
            </div>

            {!details || details.length === 0 ? (
              <p className="text-sm text-slate-450 italic pl-3">
                Nenhum componente cadastrado para esta tela.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {details.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => handleComponentClick(comp)}
                    className="group flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-950"
                  >
                    {/* Component Image */}
                    {comp.image ? (
                      <div className="flex h-[150px] items-center justify-center rounded-xl bg-slate-50 p-2 dark:bg-slate-950/40 overflow-hidden">
                        <img
                          src={comp.image}
                          alt={comp.name}
                          className="max-h-full max-w-full rounded object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex h-[150px] flex-col items-center justify-center rounded-xl bg-slate-50 text-slate-350 dark:bg-slate-950/20">
                        <svg
                          className="h-6 w-6 text-slate-300 dark:text-slate-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="mt-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                          Sem foto
                        </span>
                      </div>
                    )}

                    {/* Component Name */}
                    <div className="mt-4 flex items-center justify-between">
                      <h4 className="font-display text-sm font-bold text-slate-800 group-hover:text-indigo-650 dark:text-slate-200 dark:group-hover:text-indigo-400 truncate">
                        {comp.name}
                      </h4>
                      <svg
                        className="h-4 w-4 text-slate-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Component Details View Modal */}
      <ComponentViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        component={selectedComponent}
      />
    </div>
  );
}
