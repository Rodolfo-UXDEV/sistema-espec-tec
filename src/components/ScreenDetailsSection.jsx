import React from 'react';

export default function ScreenDetailsSection({ details, onAddClick, onEditClick, onDeleteClick }) {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header of the section: Title and Add Button on the same line */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
          Detalhamento da Tela
        </h2>
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow active:scale-95"
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
          Adicionar
        </button>
      </div>

      {/* List of Details (Components) */}
      <div className="mt-6 space-y-6">
        {details.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-slate-800">
              <svg
                className="h-6 w-6 text-slate-500 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Nenhum componente foi detalhado nesta tela ainda.
            </p>
            <button
              onClick={onAddClick}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Clique para adicionar o primeiro componente
            </button>
          </div>
        ) : (
          details.map((item, index) => (
            <div
              key={item.id}
              className="group relative rounded-xl border border-slate-150 bg-slate-50/30 p-5 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900/60"
            >
              {/* Top controls: Name, Badge and Edit/Delete */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-800 dark:text-white">
                      {item.name}
                    </h3>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => onEditClick(item)}
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-700 dark:hover:text-indigo-400"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteClick(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-rose-950/20"
                    title="Excluir Componente"
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

              {/* Middle Section: Photo & Description */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                {/* Component Description */}
                <div className={`space-y-1 ${item.image ? 'md:col-span-2' : 'md:col-span-3'}`}>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Descrição do Componente
                  </h4>
                  <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed">
                    {item.description || <span className="italic text-slate-400">Sem descrição fornecida.</span>}
                  </p>
                </div>

                {/* Component Image */}
                {item.image && (
                  <div className="flex items-center justify-center rounded-xl border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-850 dark:bg-slate-950/60 max-h-[140px] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full rounded object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Bottom Section: Fields and Validations Table */}
              {item.fields && item.fields.length > 0 && (
                <div className="mt-2 space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Campos e Regras de Validação
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-slate-150/70 bg-white dark:border-slate-800 dark:bg-slate-900/50">
                    <table className="w-full min-w-[600px] text-left text-xs text-slate-500 dark:text-slate-400">
                      <thead className="bg-slate-100/50 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                        <tr>
                          <th className="px-4 py-2 border-b border-slate-150 dark:border-slate-800 w-[20%]">Nome do Campo</th>
                          <th className="px-4 py-2 border-b border-slate-150 dark:border-slate-800 w-[30%]">Descrição</th>
                          <th className="px-4 py-2 border-b border-slate-150 dark:border-slate-800 w-[10%] text-center">Obrigatório</th>
                          <th className="px-4 py-2 border-b border-slate-150 dark:border-slate-800 w-[15%]">Formato</th>
                          <th className="px-4 py-2 border-b border-slate-150 dark:border-slate-800 w-[25%]">Regras de Validação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {item.fields.map((field) => (
                          <tr key={field.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                            <td className="px-4 py-2 font-mono font-semibold text-indigo-650 dark:text-indigo-400">{field.fieldName || '-'}</td>
                            <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{field.description || '-'}</td>
                            <td className="px-4 py-2 text-center">
                              {field.required ? (
                                <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                                  Sim
                                </span>
                              ) : (
                                <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                  Não
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <span className="inline-flex rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                                {field.format}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{field.validationRules || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Services Table */}
              {item.services && item.services.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Serviços Mapeados
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-slate-150/70 bg-white dark:border-slate-800 dark:bg-slate-900/50">
                    <table className="w-full min-w-[600px] text-left text-xs text-slate-500 dark:text-slate-400">
                      <thead className="bg-slate-100/50 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                        <tr>
                          <th className="px-4 py-2 border-b border-slate-150 dark:border-slate-800 w-[10%]">ID</th>
                          <th className="px-4 py-2 border-b border-slate-150 dark:border-slate-800 w-[15%]">Método / Tipo</th>
                          <th className="px-4 py-2 border-b border-slate-150 dark:border-slate-800 w-[25%]">Endpoint / Tópico / Arquivo</th>
                          <th className="px-4 py-2 border-b border-slate-150 dark:border-slate-800 w-[20%]">Descrição</th>
                          <th className="px-4 py-2 border-b border-slate-150 dark:border-slate-800 w-[15%]">Request</th>
                          <th className="px-4 py-2 border-b border-slate-150 dark:border-slate-800 w-[15%]">Response / Saída</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {item.services.map((srv) => (
                          <tr key={srv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                            <td className="px-4 py-2 font-mono font-semibold text-slate-700 dark:text-slate-300">{srv.serviceId || '-'}</td>
                            <td className="px-4 py-2">
                              <span className="inline-flex rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                                {srv.method}
                              </span>
                            </td>
                            <td className="px-4 py-2 font-mono text-slate-600 dark:text-slate-300">{srv.endpoint || '-'}</td>
                            <td className="px-4 py-2 text-slate-600 dark:text-slate-300">{srv.description || '-'}</td>
                            <td className="px-4 py-2 text-slate-600 dark:text-slate-300 font-mono">{srv.request || '-'}</td>
                            <td className="px-4 py-2 text-slate-600 dark:text-slate-300 font-mono">{srv.response || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
