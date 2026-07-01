import React, { useState } from 'react';

export default function ComponentViewModal({ isOpen, onClose, component }) {
  const [expandedSections, setExpandedSections] = useState({
    general: false,
    fields: false,
    services: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!isOpen || !component) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in"
    >
      <div className="flex max-h-[90vh] w-full max-w-7xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Visualização de Componente
            </h3>
            <p className="text-xs text-slate-400 font-medium">Modo Leitura</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Centered Component Image at the top (Larger) */}
          {component.image ? (
            <div className="flex w-full justify-center rounded-2xl border border-slate-100 bg-slate-50/50 p-6 shadow-inner dark:border-slate-800 dark:bg-slate-950/40">
              <img
                src={component.image}
                alt={component.name}
                className="max-h-[380px] max-w-full rounded-lg object-contain shadow-lg"
              />
            </div>
          ) : (
            <div className="flex w-full h-[120px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-850 dark:bg-slate-950/20">
              <svg
                className="h-6 w-6 text-slate-300 dark:text-slate-600"
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
              <span className="mt-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                Sem foto disponível
              </span>
            </div>
          )}

          {/* Component Name centered below image */}
          <div className="flex flex-col items-center text-center space-y-2 pt-2">
            <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
              Componente
            </span>
            <h4 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {component.name}
            </h4>
          </div>
          {/* Accordion Panels */}
          <div className="space-y-4">
            {/* Panel 1: Geral / Descrição */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => toggleSection('general')}
                className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 px-5 py-3.5 text-left font-display text-sm font-bold text-slate-800 dark:text-white hover:bg-slate-105 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-5 w-1 rounded-full bg-indigo-600 dark:bg-indigo-500"></span>
                  <span>Geral / Descrição</span>
                </div>
                <svg
                  className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-200 ${expandedSections.general ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.general && (
                <div className="p-5 border-t border-slate-150 dark:border-slate-800/60 bg-white dark:bg-slate-900/10 space-y-3 animate-fade-in">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Descrição do Componente
                  </h5>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-5 dark:border-slate-800 dark:bg-slate-900/40">
                    <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-line">
                      {component.description || (
                        <span className="italic text-slate-400">
                          Nenhuma descrição fornecida para este componente.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Panel 2: Campos e Validações */}
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/20 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => toggleSection('fields')}
                className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 px-5 py-3.5 text-left font-display text-sm font-bold text-slate-800 dark:text-white hover:bg-slate-105 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-5 w-1 rounded-full bg-indigo-600 dark:bg-indigo-500"></span>
                  <span>Campos e Validações</span>
                </div>
                <svg
                  className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-200 ${expandedSections.fields ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.fields && (
                <div className="p-5 border-t border-slate-150 dark:border-slate-800/60 bg-white dark:bg-slate-900/10 space-y-3 animate-fade-in">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Campos e Validações Cadastrados
                  </h5>
                  {!component.fields || component.fields.length === 0 ? (
                    <p className="text-sm text-slate-450 italic">
                      Nenhum campo cadastrado neste componente.
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full min-w-[800px] border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <tr>
                            <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">Nome do Campo</th>
                            <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[30%]">Descrição</th>
                            <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[10%] text-center">Obrigatório</th>
                            <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[15%]">Formato</th>
                            <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[25%]">Regras de Validação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                          {component.fields.map((field) => (
                            <tr key={field.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                              <td className="px-4 py-2.5 font-mono font-semibold text-indigo-650 dark:text-indigo-400 break-all whitespace-pre-wrap">
                                {field.fieldName || '-'}
                              </td>
                              <td className="px-4 py-2.5 text-slate-655 dark:text-slate-355 break-words whitespace-pre-wrap">
                                {field.description || '-'}
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                {field.required ? (
                                  <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                                    Sim
                                  </span>
                                ) : (
                                  <span className="inline-flex rounded-full bg-slate-150/70 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                    Não
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2.5">
                                <span className="inline-flex rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-750 dark:bg-indigo-950/30 dark:text-indigo-400">
                                  {field.format}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-slate-655 dark:text-slate-355 break-words whitespace-pre-wrap">
                                {field.validationRules || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Panel 3: Serviços de Integração */}
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/20 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => toggleSection('services')}
                className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 px-5 py-3.5 text-left font-display text-sm font-bold text-slate-800 dark:text-white hover:bg-slate-105 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-5 w-1 rounded-full bg-indigo-650 dark:bg-indigo-500"></span>
                  <span>Serviços de Integração</span>
                </div>
                <svg
                  className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-200 ${expandedSections.services ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSections.services && (
                <div className="p-5 border-t border-slate-150 dark:border-slate-800/60 bg-white dark:bg-slate-900/10 space-y-3 animate-fade-in">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Serviços e Integrações Mapeados
                  </h5>
                  {!component.services || component.services.length === 0 ? (
                    <p className="text-sm text-slate-450 italic">
                      Nenhum serviço mapeado neste componente.
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full min-w-[850px] border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <tr>
                            <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[10%]">ID</th>
                            <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[10%]">Método / Tipo</th>
                            <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">Endpoint / Tópico / Arquivo</th>
                            <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">Descrição</th>
                            <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">Request</th>
                            <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">Response / Saída</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                          {component.services.map((srv) => (
                            <tr key={srv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                              <td className="px-4 py-2.5 font-mono font-semibold text-slate-700 dark:text-slate-300 break-all">
                                {srv.serviceId || '-'}
                              </td>
                              <td className="px-4 py-2.5">
                                <span className="inline-flex rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-750 dark:bg-indigo-950/30 dark:text-indigo-400">
                                  {srv.method}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 font-mono text-slate-650 dark:text-slate-300 break-all whitespace-pre-wrap">
                                {srv.endpoint || '-'}
                              </td>
                              <td className="px-4 py-2.5 text-slate-655 dark:text-slate-355 break-words whitespace-pre-wrap">
                                {srv.description || '-'}
                              </td>
                              <td className="px-4 py-2.5 text-slate-655 dark:text-slate-355 font-mono break-words whitespace-pre-wrap">
                                {srv.request || '-'}
                              </td>
                              <td className="px-4 py-2.5 text-slate-655 dark:text-slate-355 font-mono break-words whitespace-pre-wrap">
                                {srv.response || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-indigo-650 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
