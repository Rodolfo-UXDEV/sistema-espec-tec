import React, { useState, useEffect } from 'react';
import ComponentViewModal from './ComponentViewModal';
import FlowsGallery from './FlowsGallery';

export default function ScreenViewer({
  screensList,
  selectedScreenId,
  loadScreenData,
  screenName,
  details,
  isLoading,
  specDescription,
  specFlows = [],
  specAuthors = {},
  onSelectScreen,
  onBack,
}) {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Reset modal state when the selected specification changes
  useEffect(() => {
    setSelectedComponent(null);
    setIsViewModalOpen(false);
  }, [selectedScreenId]);

  const handleComponentClick = (screenObj) => {
    if (screenObj.components && screenObj.components.length > 0) {
      setSelectedComponent(screenObj.components[0]);
      setIsViewModalOpen(true);
    } else {
      alert("Nenhum detalhamento cadastrado para esta tela.");
    }
  };

  const authorName = selectedScreenId ? (specAuthors[selectedScreenId] || 'Rodolfo Rodrigues') : 'Rodolfo Rodrigues';
  const creationDate = selectedScreenId 
    ? new Date(screensList.find((s) => s.id === selectedScreenId)?.created_at || Date.now()).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

  return (
    <div className="w-full space-y-8">
      {/* Selection Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Visualizar Especificação
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Navegue e explore a especificação técnica e suas telas associadas.
          </p>
        </div>

        {/* Spec Selector & Back Button */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
            >
              Voltar para Lista
            </button>
          )}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Selecionar Especificação:
            </label>
            <select
              value={selectedScreenId}
              onChange={(e) => loadScreenData(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="">-- Selecione uma Especificação --</option>
              {screensList.map((screen) => (
                <option key={screen.id} value={screen.id}>
                  {screen.name}
                </option>
              ))}
            </select>
          </div>
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
            Nenhuma especificação selecionada
          </h3>
          <p className="mt-1 text-sm text-slate-400 max-w-sm">
            Escolha uma especificação no seletor acima para visualizar seu design e detalhes técnicos.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Metadata Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Nome da Especificação</span>
              <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white mt-1">{screenName}</h3>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Autor</span>
              <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white mt-1">{authorName}</h3>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Data de Criação</span>
              <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white mt-1">{creationDate}</h3>
            </div>
          </div>

          {/* Description display */}
          {specDescription && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-indigo-500"></span>
                <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                  Descrição da Especificação
                </h2>
              </div>
              <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm whitespace-pre-wrap">
                {specDescription}
              </p>
            </div>
          )}

          {/* Flow Gallery display */}
          {specFlows && specFlows.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-indigo-500"></span>
                <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                  Fluxos Propostos
                </h2>
              </div>
              <FlowsGallery flows={specFlows} readOnly={true} />
            </div>
          )}

          {/* Screens List display */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-indigo-500"></span>
              <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                Telas da Especificação
              </h2>
            </div>

            {!details || details.length === 0 ? (
              <p className="text-sm text-slate-450 italic pl-3">
                Nenhuma tela detalhada para esta especificação.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {details.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => onSelectScreen && onSelectScreen(comp)}
                    className="group flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-950"
                  >
                    {/* Screen image */}
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
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="mt-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                          Sem mockup
                        </span>
                      </div>
                    )}

                    {/* Screen name */}
                    <div className="mt-4 flex items-center justify-between">
                      <h4 className="font-display text-sm font-bold text-slate-805 group-hover:text-indigo-650 dark:text-slate-200 dark:group-hover:text-indigo-400 truncate">
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
