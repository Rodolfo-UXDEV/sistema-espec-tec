import React from 'react';

export default function FunctionalRequirementsSection({
  requirements = [],
  onChange,
  isExpanded,
  onToggleExpand
}) {
  const handleAddRequirement = () => {
    const nextNum = requirements.length + 1;
    const newReq = {
      id: `req-${Date.now()}-${Math.random()}`,
      customId: `RF-${String(nextNum).padStart(2, '0')}`,
      name: '',
      description: '',
    };
    onChange([...requirements, newReq]);
  };

  const handleUpdateRequirement = (index, field, value) => {
    const updated = requirements.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const handleRemoveRequirement = (index) => {
    const filtered = requirements.filter((_, idx) => idx !== index);
    const updated = filtered.map((item, idx) => ({
      ...item,
      customId: `RF-${String(idx + 1).padStart(2, '0')}`
    }));
    onChange(updated);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <button
        type="button"
        onClick={onToggleExpand}
        className="flex w-full items-center justify-between p-6 hover:bg-slate-50 transition-all"
      >
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
            Requisitos Funcionais
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {requirements.length > 0 && (
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400">
              {requirements.length} {requirements.length === 1 ? 'requisito' : 'requisitos'}
            </span>
          )}
          <svg
            className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100 p-6 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <h3 className="font-display text-base font-bold text-slate-800 dark:text-white">
              Requisitos Funcionais Cadastrados
            </h3>
            <button
              type="button"
              onClick={handleAddRequirement}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-650 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow active:scale-95 duration-200 cursor-pointer"
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
                  strokeWidth="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Adicionar requisito
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[12%]">Nº Requisito</th>
                  <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[28%]">Nome Requisito</th>
                  <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[50%]">Descrição Requisito</th>
                  <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 text-left w-[10%]">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-900">
                {requirements.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                      Nenhum requisito funcional cadastrado. Clique em "+ Adicionar requisito" para começar.
                    </td>
                  </tr>
                ) : (
                  requirements.map((req, index) => (
                    <tr key={req.id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                        {req.customId || `RF-${String(index + 1).padStart(2, '0')}`}
                      </td>
                      <td className="px-3 py-2">
                        <textarea
                          value={req.name || ''}
                          onChange={(e) => handleUpdateRequirement(index, 'name', e.target.value)}
                          rows={1}
                          ref={(el) => {
                            if (el) {
                              el.style.height = 'auto';
                              el.style.height = `${el.scrollHeight}px`;
                            }
                          }}
                          placeholder="Ex: Login com Google"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200 resize-none overflow-hidden"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <textarea
                          value={req.description || ''}
                          onChange={(e) => handleUpdateRequirement(index, 'description', e.target.value)}
                          rows={1}
                          ref={(el) => {
                            if (el) {
                              el.style.height = 'auto';
                              el.style.height = `${el.scrollHeight}px`;
                            }
                          }}
                          placeholder="Ex: O sistema deve permitir login social com contas do Google..."
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200 resize-none overflow-hidden"
                        />
                      </td>
                      <td className="px-3 py-2 text-left">
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(index)}
                          className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Remover requisito"
                        >
                          <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
