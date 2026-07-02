import React, { useState, useEffect } from 'react';
import ComponentViewModal from './ComponentViewModal';
import FlowsGallery from './FlowsGallery';
import EvidenceModal from './EvidenceModal';

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
  specCriteria = [],
  specFigmaUrl,
  specBusinessRules = [],
  onSelectScreen,
  onBack,
}) {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [activeCriterionIndex, setActiveCriterionIndex] = useState(null);
  const [isBusinessRulesExpanded, setIsBusinessRulesExpanded] = useState(false);

  // Reset modal and collapse states when the selected specification changes
  useEffect(() => {
    setSelectedComponent(null);
    setIsViewModalOpen(false);
    setIsBusinessRulesExpanded(false);
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

  const totalComponents = details ? details.reduce((acc, screen) => acc + (screen.components ? screen.components.length : 0), 0) : 0;
  const completedComponents = details ? details.reduce((acc, screen) => {
    if (!screen.components) return acc;
    return acc + screen.components.filter(c => c.status === 'concluido').length;
  }, 0) : 0;
  const completionPercentage = totalComponents > 0 ? Math.round((completedComponents / totalComponents) * 100) : 0;

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

        {/* Spec Selector */}
        <div className="flex items-center gap-3 self-start md:self-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="md:col-span-3">
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
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Conclusão da Especificação</span>
              <div className="flex items-center gap-3 mt-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border shrink-0 ${
                  completionPercentage === 100
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-955/20 dark:text-emerald-400 dark:border-emerald-800/40'
                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-955/20 dark:text-rose-400 dark:border-rose-800/40'
                }`}>
                  {completionPercentage}% concluído
                </span>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner max-w-[100px] hidden xs:block">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      completionPercentage === 100 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
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

          {/* Business Rules Display */}
          {specBusinessRules && specBusinessRules.length > 0 && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setIsBusinessRulesExpanded(!isBusinessRulesExpanded)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 font-display text-sm font-semibold tracking-wide uppercase text-slate-700 shadow-sm hover:bg-slate-50 transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full bg-indigo-500"></span>
                  <span>Regras de Negócios</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400">
                    {specBusinessRules.length} {specBusinessRules.length === 1 ? 'regra' : 'regras'}
                  </span>
                  <svg
                    className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                      isBusinessRulesExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isBusinessRulesExpanded && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-in fade-in duration-200">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                      <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <tr>
                          <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 w-[15%]">Nº Regra</th>
                          <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 w-[85%]">Descrição da Regra</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {specBusinessRules.map((rule, index) => (
                          <tr key={rule.id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                              {rule.customId || `RN-${String(index + 1).padStart(2, '0')}`}
                            </td>
                            <td className="px-6 py-4 text-slate-650 dark:text-slate-305 whitespace-pre-wrap leading-relaxed">
                              {rule.description || 'Sem descrição inserida.'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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

          {/* Figma Embed display */}
          {specFigmaUrl && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-indigo-500"></span>
                <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                  Design do Figma
                </h2>
              </div>
              <div className="w-full h-[450px] overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                <iframe
                  className="h-full w-full border-0"
                  src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(specFigmaUrl)}`}
                  allowFullScreen
                  title="Figma Viewer"
                />
              </div>
            </div>
          )}

          {/* Screens List display */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-indigo-500"></span>
                <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                  Telas da Especificação
                </h2>
              </div>
            </div>

            {!details || details.length === 0 ? (
              <p className="text-sm text-slate-450 italic pl-3">
                Nenhuma tela detalhada para esta especificação.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {details.map((comp) => {
                  const screenTotal = comp.components ? comp.components.length : 0;
                  const screenCompleted = comp.components ? comp.components.filter(c => c.status === 'concluido').length : 0;
                  const screenPercentage = screenTotal > 0 ? Math.round((screenCompleted / screenTotal) * 100) : 0;

                  return (
                    <div
                      key={comp.id}
                      onClick={() => onSelectScreen && onSelectScreen(comp)}
                      className="relative group flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-950"
                    >
                      {/* Completion Tag */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          screenPercentage === 100
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-955/20 dark:text-emerald-400 dark:border-emerald-800/40'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-955/20 dark:text-rose-400 dark:border-rose-800/40'
                        }`}>
                          {screenPercentage}% concluído
                        </span>
                      </div>

                      {/* Screen image */}
                      {comp.image ? (
                        <div className="flex h-[150px] items-center justify-center rounded-xl bg-slate-50 p-2 dark:bg-slate-955/40 overflow-hidden">
                          <img
                            src={comp.image}
                            alt={comp.name}
                            className="max-h-full max-w-full rounded object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="flex h-[150px] flex-col items-center justify-center rounded-xl bg-slate-50 text-slate-350 dark:bg-slate-955/20">
                          <svg
                            className="h-6 w-6 text-slate-305 dark:text-slate-700"
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
                          className="h-4 w-4 text-slate-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-slate-505"
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
                  );
                })}
              </div>
            )}
          </div>

          {/* Critérios de Aceite display */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-indigo-500"></span>
              <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                Critérios de Aceite
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[12%]">ID</th>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[48%]">CRITÉRIO</th>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[15%]">STATUS</th>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[15%]">RESPONSÁVEL</th>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[10%]">EVIDÊNCIA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-900">
                  {!specCriteria || specCriteria.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                        Nenhum critério de aceite cadastrado para esta especificação.
                      </td>
                    </tr>
                  ) : (
                    specCriteria.map((criterion, index) => (
                      <tr key={criterion.id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-3.5 font-bold text-slate-700 dark:text-slate-300">
                          {criterion.customId || '-'}
                        </td>
                        <td className="px-4 py-3.5 text-slate-655 dark:text-slate-350 break-words whitespace-pre-wrap">
                          {criterion.criterion || '-'}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase border ${
                            criterion.status === 'Concluído'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-955/20 dark:text-emerald-400 dark:border-emerald-800/40'
                              : criterion.status === 'Em Desenvolvimento'
                              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/40'
                              : criterion.status === 'Bloqueado'
                              ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-955/20 dark:text-rose-400 dark:border-rose-800/40'
                              : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                          }`}>
                            {criterion.status || 'Pendente'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-655 dark:text-slate-350">
                          {criterion.responsible || '-'}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-start">
                            <button
                              type="button"
                              onClick={() => {
                                if (criterion.evidence && criterion.evidence.trim()) {
                                  setActiveCriterionIndex(index);
                                  setIsEvidenceModalOpen(true);
                                }
                              }}
                              disabled={!criterion.evidence || !criterion.evidence.trim()}
                              className={`p-1.5 rounded-lg transition-all active:scale-90 ${
                                criterion.evidence && criterion.evidence.trim()
                                  ? "text-indigo-655 hover:bg-indigo-50 hover:text-indigo-750 dark:text-indigo-400 dark:hover:bg-indigo-950/40 cursor-pointer"
                                  : "text-slate-300 dark:text-slate-750 cursor-not-allowed"
                              }`}
                              title="Visualizar Evidência"
                            >
                              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Component Details View Modal */}
      <ComponentViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        component={selectedComponent}
      />

      {/* Evidence View Modal */}
      <EvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        evidence={activeCriterionIndex !== null ? specCriteria[activeCriterionIndex].evidence : ''}
        criterionId={activeCriterionIndex !== null ? specCriteria[activeCriterionIndex].customId : ''}
        mode="view"
      />

    </div>
  );
}
