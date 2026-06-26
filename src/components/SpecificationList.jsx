import React, { useState } from 'react';

export default function SpecificationList({
  screensList,
  onEdit,
  onView,
  onNew,
  onArchive,
  onUnarchive,
  archivedIds,
  isLoading,
  specAuthors = {},
  isDeveloper = false,
}) {
  const [showArchived, setShowArchived] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecAuthor, setNewSpecAuthor] = useState('Rodolfo Rodrigues');

  const handleCloseModal = () => {
    setIsNewModalOpen(false);
    setNewSpecName('');
    setNewSpecAuthor('Rodolfo Rodrigues');
  };

  const handleConfirmNewSpec = () => {
    if (!newSpecName.trim()) {
      alert('Por favor, insira o nome da especificação.');
      return;
    }
    onNew(newSpecName.trim(), newSpecAuthor.trim());
    handleCloseModal();
  };

  const getCurrentFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter list based on archive state
  const displayedScreens = screensList.filter((screen) => {
    const isArchived = archivedIds.includes(screen.id);
    return showArchived ? isArchived : !isArchived;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-6 dark:border-slate-800/60">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Lista de Especificações
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {showArchived
              ? 'Gerencie as especificações técnicas que foram arquivadas.'
              : 'Gerencie e visualize as especificações técnicas ativas da Alesp.'}
          </p>
        </div>

        {/* Action Buttons */}
        {!isDeveloper && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border transition-all active:scale-95 ${
                showArchived
                  ? 'bg-slate-200 border-slate-350 text-slate-850 hover:bg-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-650 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400'
              }`}
            >
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {showArchived ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                )}
              </svg>
              {showArchived ? 'Ver Especificações Ativas' : 'Arquivar Especificação'}
            </button>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-650 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:from-indigo-600 hover:to-violet-700 active:scale-95 transition-all dark:shadow-none"
            >
              <svg
                className="h-4.5 w-4.5"
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
              Nova especificação
            </button>
          </div>
        )}
      </div>

      {/* Specifications List Table / Cards */}
      {isLoading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
          <p className="text-sm font-medium text-slate-500">Carregando especificações do Supabase...</p>
        </div>
      ) : displayedScreens.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
            <svg
              className="h-6 w-6"
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
          <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
            Nenhuma especificação encontrada
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {showArchived
              ? 'Nenhuma especificação foi arquivada até o momento.'
              : 'Clique em "Nova especificação" para começar a documentar suas telas.'}
          </p>
          {!showArchived && !isDeveloper && (
            <button
              onClick={onNew}
              className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-all"
            >
              Começar Agora
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                  <th className="px-6 py-4">Nome da Especificação</th>
                  <th className="px-6 py-4">Autor</th>
                  <th className="px-6 py-4">Data de Criação</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                {displayedScreens.map((screen) => (
                  <tr
                    key={screen.id}
                    className="group hover:bg-slate-50/50 transition-colors dark:hover:bg-slate-800/30"
                  >
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
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
                        <div>
                          <button
                            onClick={() => onView(screen.id)}
                            className="text-left font-display text-sm font-bold text-slate-850 hover:text-indigo-650 dark:text-slate-200 dark:hover:text-indigo-400 transition-colors"
                          >
                            {screen.name}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-sm text-slate-600 dark:text-slate-350">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {(specAuthors[screen.id] || 'Rodolfo Rodrigues')
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase() || 'U'}
                        </div>
                        <span>{specAuthors[screen.id] || 'Rodolfo Rodrigues'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(screen.created_at)}
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        {/* Botão Visualizar */}
                        <button
                          onClick={() => onView(screen.id)}
                          title="Visualizar"
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-all"
                        >
                          <svg
                            className="h-4.5 w-4.5"
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
                        </button>

                        {/* Botão Editar */}
                        {!isDeveloper && (
                          <button
                            onClick={() => onEdit(screen.id)}
                            title="Editar"
                            className="rounded-lg p-1.5 text-slate-550 hover:bg-slate-100 hover:text-indigo-650 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-all"
                          >
                            <svg
                              className="h-4.5 w-4.5"
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
                        )}

                        {/* Botão Arquivar / Restaurar */}
                        {!isDeveloper && (
                          showArchived ? (
                            <button
                              onClick={() => onUnarchive(screen.id)}
                              title="Desarquivar / Restaurar"
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-400 transition-all"
                            >
                              <svg
                                className="h-4.5 w-4.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 19v-5m-9-4H3"
                                />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => onArchive(screen.id)}
                              title="Arquivar"
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-amber-400 transition-all"
                            >
                              <svg
                                className="h-4.5 w-4.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                />
                              </svg>
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Nova Especificação */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Nova Especificação
              </h2>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <div className="space-y-4">
              {/* Nome da Especificação */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Nome da Especificação
                </label>
                <input
                  type="text"
                  value={newSpecName}
                  onChange={(e) => setNewSpecName(e.target.value)}
                  placeholder="Ex: Dashboard de Indicadores, Tela de Login"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Data de Criação (Disabled) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Data de Criação
                </label>
                <input
                  type="text"
                  value={getCurrentFormattedDate()}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-400 outline-none cursor-not-allowed dark:border-slate-800 dark:bg-slate-850 dark:text-slate-500"
                />
              </div>

              {/* Autor */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Autor
                </label>
                <input
                  type="text"
                  value={newSpecAuthor}
                  onChange={(e) => setNewSpecAuthor(e.target.value)}
                  placeholder="Nome do Autor"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-350 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmNewSpec}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
