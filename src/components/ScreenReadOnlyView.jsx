import React, { useState } from 'react';

export default function ScreenReadOnlyView({ screen, onBack }) {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'fields', 'services'

  const components = screen && screen.components ? screen.components : [];

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Visualizar tela
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Visualize o mockup e os componentes detalhados desta tela.
          </p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
        >
          Voltar para Especificação
        </button>
      </div>

      {/* Screen Info Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Nome da Tela
          </span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {screen ? screen.name : ''}
          </h2>
        </div>

        {/* Screen Mockup/Image */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Mock-up / Imagem da Tela
          </span>
          {screen && screen.image ? (
            <div className="flex max-h-[400px] items-center justify-center rounded-2xl border border-slate-150 bg-slate-50/30 p-4 dark:border-slate-800 dark:bg-slate-950/20 overflow-hidden shadow-sm">
              <img
                src={screen.image}
                alt={screen.name}
                className="max-h-[360px] rounded-lg object-contain transition-transform duration-300 hover:scale-[1.01]"
              />
            </div>
          ) : (
            <div className="flex h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-250 bg-slate-50/50 p-6 text-center dark:border-slate-800 dark:bg-slate-955/20">
              <svg
                className="h-10 w-10 text-slate-350 dark:text-slate-600 mb-2"
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
              <span className="text-sm font-medium text-slate-455 dark:text-slate-500">Sem imagem de mock-up da tela</span>
            </div>
          )}
        </div>
      </div>

      {/* Components Grid Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800 mb-6">
          <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
            Componentes da Tela
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Clique em qualquer componente para visualizar seus campos, validações e serviços integrados.
          </p>
        </div>

        {components.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-slate-800">
              <svg className="h-6 w-6 text-slate-500 dark:text-slate-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-450 dark:text-slate-500">
              Nenhum componente cadastrado nesta tela.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {components.map((comp, index) => (
              <div
                key={comp.id}
                onClick={() => {
                  setSelectedComponent(comp);
                  setActiveTab('general');
                }}
                className="group flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-indigo-950"
              >
                {/* Component photo */}
                {comp.image ? (
                  <div className="flex h-[150px] items-center justify-center rounded-xl bg-slate-50 p-2 dark:bg-slate-950/40 overflow-hidden border border-slate-100/50 dark:border-slate-800/40">
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
                      Sem imagem
                    </span>
                  </div>
                )}

                {/* Component name & info */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400">
                      {index + 1}
                    </span>
                    <h4 className="font-display text-sm font-bold text-slate-800 group-hover:text-indigo-650 dark:text-slate-200 dark:group-hover:text-indigo-400 truncate">
                      {comp.name}
                    </h4>
                  </div>
                  <svg
                    className="h-4 w-4 shrink-0 text-slate-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 dark:text-slate-500"
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

      {/* Component Detail Tabs Modal */}
      {selectedComponent && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-7xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-250 bg-white shadow-2xl animate-in zoom-in-95 duration-200 dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <h3 className="font-display text-lg font-bold text-slate-800 dark:text-white">
                Detalhes do Componente: {selectedComponent.name}
              </h3>
              <button
                onClick={() => setSelectedComponent(null)}
                className="rounded-full p-1.5 text-slate-450 hover:bg-slate-100 active:scale-90 transition-all dark:text-slate-500 dark:hover:bg-slate-800 cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Component Photo at the Top */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Foto do Componente
                </span>
                {selectedComponent.image ? (
                  <div className="flex max-h-[250px] w-full items-center justify-center bg-slate-50/50 p-4 dark:bg-slate-950/20 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/60 shadow-inner">
                    <img
                      src={selectedComponent.image}
                      alt={selectedComponent.name}
                      className="max-h-[210px] rounded object-contain shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="flex h-[120px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/30 p-4 text-center dark:border-slate-800/40">
                    <svg className="h-8 w-8 text-slate-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-slate-455 dark:text-slate-500">Sem imagem de mock-up cadastrada</span>
                  </div>
                )}
              </div>

              {/* Tabs Navigation */}
              <div className="border-b border-slate-100 dark:border-slate-800">
                <nav className="flex gap-6 text-sm font-semibold" aria-label="Abas">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`pb-3 border-b-2 px-1 transition-all cursor-pointer ${
                      activeTab === 'general'
                        ? 'border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400'
                        : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                    }`}
                  >
                    Geral
                  </button>
                  <button
                    onClick={() => setActiveTab('fields')}
                    className={`pb-3 border-b-2 px-1 transition-all cursor-pointer ${
                      activeTab === 'fields'
                        ? 'border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400'
                        : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-355'
                    }`}
                  >
                    Campos e Validações
                  </button>
                  <button
                    onClick={() => setActiveTab('services')}
                    className={`pb-3 border-b-2 px-1 transition-all cursor-pointer ${
                      activeTab === 'services'
                        ? 'border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400'
                        : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-355'
                    }`}
                  >
                    Serviços
                  </button>
                </nav>
              </div>

              {/* Tab Panels */}
              <div className="animate-fade-in">
                {activeTab === 'general' && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Descrição do Componente
                    </span>
                    <div className="rounded-2xl bg-slate-50/40 dark:bg-slate-955/10 p-5 border border-slate-150 dark:border-slate-800/60 min-h-[120px]">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedComponent.description || (
                          <span className="italic text-slate-400">Sem descrição fornecida.</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'fields' && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Campos e Validações
                    </span>
                    {!selectedComponent.fields || selectedComponent.fields.length === 0 ? (
                      <p className="text-sm text-slate-400 italic bg-slate-50/20 dark:bg-slate-950/10 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                        Nenhum campo cadastrado para este componente.
                      </p>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/10 shadow-sm">
                        <table className="w-full min-w-[700px] text-left text-xs border-collapse">
                          <thead className="bg-slate-50/50 dark:bg-slate-800/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                            <tr>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">NOME DO CAMPO</th>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[25%]">DESCRIÇÃO</th>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[12%] text-center">OBRIGATÓRIO</th>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[15%]">FORMATO</th>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[28%]">REGRAS DE VALIDAÇÃO</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/10">
                            {selectedComponent.fields.map((f) => (
                              <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                <td className="px-4 py-3 font-mono font-semibold text-indigo-650 dark:text-indigo-400 break-all whitespace-pre-wrap">
                                  {f.fieldName || '-'}
                                </td>
                                <td className="px-4 py-3 text-slate-655 dark:text-slate-350 break-words whitespace-pre-wrap font-medium">
                                  {f.description || '-'}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {f.required ? (
                                    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                                      Sim
                                    </span>
                                  ) : (
                                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-505 dark:bg-slate-800 dark:text-slate-400">
                                      Não
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <span className="inline-flex rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-755 dark:bg-indigo-950/30 dark:text-indigo-400">
                                    {f.format || '-'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-slate-655 dark:text-slate-350 break-words whitespace-pre-wrap font-medium">
                                  {f.validationRules || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Serviços Associados
                    </span>
                    {!selectedComponent.services || selectedComponent.services.length === 0 ? (
                      <p className="text-sm text-slate-400 italic bg-slate-50/20 dark:bg-slate-950/10 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                        Nenhum serviço mapeado para este componente.
                      </p>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/10 shadow-sm">
                        <table className="w-full min-w-[800px] text-left text-xs border-collapse">
                          <thead className="bg-slate-50/50 dark:bg-slate-800/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                            <tr>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[12%]">ID</th>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[12%]">MÉTODO / TIPO</th>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">ENDPOINT / TÓPICO / ARQUIVO</th>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">DESCRIÇÃO</th>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[18%]">REQUEST</th>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[18%]">RESPONSE / SAÍDA</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/10">
                            {selectedComponent.services.map((s) => (
                              <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                <td className="px-4 py-3 font-mono font-semibold text-slate-700 dark:text-slate-350 break-all font-medium">
                                  {s.serviceId || '-'}
                                </td>
                                <td className="px-4 py-3">
                                  <span className="inline-flex rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-755 dark:bg-indigo-950/30 dark:text-indigo-400">
                                    {s.method}
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-mono text-slate-655 dark:text-slate-350 break-all whitespace-pre-wrap font-medium">
                                  {s.endpoint || '-'}
                                </td>
                                <td className="px-4 py-3 text-slate-655 dark:text-slate-350 break-words whitespace-pre-wrap font-medium">
                                  {s.description || '-'}
                                </td>
                                <td className="px-4 py-3 font-mono text-slate-655 dark:text-slate-350 break-all whitespace-pre-wrap font-medium">
                                  {s.request || '-'}
                                </td>
                                <td className="px-4 py-3 font-mono text-slate-655 dark:text-slate-355 break-all whitespace-pre-wrap font-medium">
                                  {s.response || '-'}
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

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <button
                onClick={() => setSelectedComponent(null)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
