import React, { useState } from 'react';

export default function SpecificationList({
  screensList,
  projectsList = [],
  onEdit,
  onView,
  onNew,
  onNewProject,
  onAssociateSpecs,
  onArchive,
  onUnarchive,
  archivedIds,
  isLoading,
  specAuthors = {},
  isDeveloper = false,
  onTrocarPerfil,
}) {
  const [showArchived, setShowArchived] = useState(false);
  
  // New Spec Modal States
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecAuthor, setNewSpecAuthor] = useState('Rodolfo Rodrigues');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // New Project Modal States
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // Collapsed state for projects (key: projectId, value: boolean)
  const [collapsedProjects, setCollapsedProjects] = useState({});

  // Tabs State: 'projects' or 'standalone'
  const [activeListTab, setActiveListTab] = useState('projects');

  // Batch association modal states (from Project Header)
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [associateTargetProjectId, setAssociateTargetProjectId] = useState('');
  const [selectedSpecIdsToAssociate, setSelectedSpecIdsToAssociate] = useState([]);

  // Single association modal states (from Standalone Spec Row)
  const [isMoveSingleSpecModalOpen, setIsMoveSingleSpecModalOpen] = useState(false);
  const [moveSingleSpecTargetId, setMoveSingleSpecTargetId] = useState('');
  const [moveSingleSpecTargetProjectId, setMoveSingleSpecTargetProjectId] = useState('');

  const handleCloseModal = () => {
    setIsNewModalOpen(false);
    setNewSpecName('');
    setNewSpecAuthor('Rodolfo Rodrigues');
    setSelectedProjectId('');
  };

  const handleConfirmNewSpec = () => {
    if (!newSpecName.trim()) {
      alert('Por favor, insira o nome da especificação.');
      return;
    }
    const projId = selectedProjectId ? selectedProjectId : null;
    onNew(newSpecName.trim(), newSpecAuthor.trim(), projId);
    handleCloseModal();
  };

  const handleCloseProjectModal = () => {
    setIsNewProjectModalOpen(false);
    setNewProjectName('');
    setNewProjectDesc('');
  };

  const handleConfirmNewProject = async () => {
    if (!newProjectName.trim()) {
      alert('Por favor, insira o nome do projeto.');
      return;
    }
    if (onNewProject) {
      await onNewProject(newProjectName.trim(), newProjectDesc.trim());
    }
    handleCloseProjectModal();
  };

  const handleCloseAssociateModal = () => {
    setIsAssociateModalOpen(false);
    setAssociateTargetProjectId('');
    setSelectedSpecIdsToAssociate([]);
  };

  const handleConfirmAssociate = async () => {
    if (selectedSpecIdsToAssociate.length === 0) {
      alert('Por favor, selecione ao menos uma especificação.');
      return;
    }
    if (onAssociateSpecs) {
      await onAssociateSpecs(associateTargetProjectId, selectedSpecIdsToAssociate);
    }
    handleCloseAssociateModal();
  };

  const handleCloseMoveSingleSpecModal = () => {
    setIsMoveSingleSpecModalOpen(false);
    setMoveSingleSpecTargetId('');
    setMoveSingleSpecTargetProjectId('');
  };

  const handleConfirmMoveSingleSpec = async () => {
    if (!moveSingleSpecTargetProjectId) {
      alert('Por favor, selecione um projeto.');
      return;
    }
    if (onAssociateSpecs) {
      await onAssociateSpecs(moveSingleSpecTargetProjectId, [moveSingleSpecTargetId]);
    }
    handleCloseMoveSingleSpecModal();
  };

  const toggleProjectCollapse = (projectId) => {
    setCollapsedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
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

  const renderSpecsTable = (specs) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-250 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:border-slate-800/40 dark:bg-slate-800/30 dark:text-slate-400">
            <th className="px-6 py-3.5">Nome da Especificação</th>
            <th className="px-6 py-3.5">Autor</th>
            <th className="px-6 py-3.5">Data de Criação</th>
            <th className="px-6 py-3.5">Conclusão</th>
            <th className="px-6 py-3.5 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
          {specs.map((screen) => (
            <tr
              key={screen.id}
              className="group hover:bg-slate-50/40 transition-colors dark:hover:bg-slate-800/20"
            >
              <td className="px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50/50 text-indigo-655 dark:bg-indigo-950/40 dark:text-indigo-400">
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <button
                      onClick={() => onView(screen.id)}
                      className="text-left font-display text-sm font-bold text-slate-800 hover:text-indigo-650 dark:text-slate-200 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      {screen.name}
                    </button>
                  </div>
                </div>
              </td>
              <td className="px-6 py-3.5 text-sm text-slate-600 dark:text-slate-350">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-650 dark:bg-slate-800 dark:text-slate-300">
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
              <td className="px-6 py-3.5 text-sm text-slate-500 dark:text-slate-400">
                {formatDate(screen.created_at)}
              </td>
              <td className="px-6 py-3.5">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border shrink-0 ${
                  (screen.progress || 0) === 100
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-955/20 dark:text-emerald-400 dark:border-emerald-800/40'
                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-955/20 dark:text-rose-400 dark:border-rose-800/40'
                }`}>
                  {screen.progress || 0}% concluído
                </span>
              </td>
              <td className="px-6 py-3.5 text-right">
                <div className="flex items-center justify-end gap-2.5">
                  {/* Botão Visualizar */}
                  {isDeveloper && (
                    <button
                      onClick={() => onView(screen.id)}
                      title="Visualizar"
                      className="rounded-lg p-1.5 text-slate-450 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-all cursor-pointer"
                    >
                      <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  )}

                  {/* Botão Vincular a Projeto / Mover */}
                  {!isDeveloper && !showArchived && (
                    <button
                      onClick={() => {
                        setMoveSingleSpecTargetId(screen.id);
                        setMoveSingleSpecTargetProjectId(screen.project_id || '');
                        setIsMoveSingleSpecModalOpen(true);
                      }}
                      title="Vincular a Projeto / Mover"
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-650 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-all cursor-pointer"
                    >
                      <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </button>
                  )}

                  {/* Botão Editar */}
                  {!isDeveloper && (
                    <button
                      onClick={() => onEdit(screen.id)}
                      title="Editar"
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-650 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition-all cursor-pointer"
                    >
                      <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}

                  {/* Botão Arquivar / Restaurar */}
                  {!isDeveloper && (
                    showArchived ? (
                      <button
                        onClick={() => onUnarchive(screen.id)}
                        title="Desarquivar / Restaurar"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-400 transition-all cursor-pointer"
                      >
                        <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 19v-5m-9-4H3" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={() => onArchive(screen.id)}
                        title="Arquivar"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-amber-400 transition-all cursor-pointer"
                      >
                        <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
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
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/60 pb-6 dark:border-slate-800/60">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Lista de Projetos/Especificações
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {showArchived
              ? 'Gerencie as especificações técnicas que foram arquivadas.'
              : 'Gerencie e organize os projetos e suas especificações técnicas.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onTrocarPerfil}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-650 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400 active:scale-95 transition-all cursor-pointer"
          >
            <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Trocar Perfil
          </button>

          {!isDeveloper && (
            <>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border transition-all active:scale-95 cursor-pointer ${
                  showArchived
                    ? 'bg-slate-200 border-slate-350 text-slate-850 hover:bg-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-650 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400'
                }`}
              >
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showArchived ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  )}
                </svg>
                {showArchived ? 'Ver Especificações Ativas' : 'Ver Arquivadas'}
              </button>

              {!showArchived && (
                <>
                  {/* Botão Novo Projeto */}
                  <button
                    onClick={() => setIsNewProjectModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl border border-indigo-250 bg-indigo-50/60 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-all dark:border-indigo-950 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-950/50 cursor-pointer"
                  >
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h7a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    Novo projeto
                  </button>

                  {/* Botão Nova Especificação */}
                  <button
                    onClick={() => {
                      setSelectedProjectId('');
                      setIsNewModalOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-800 active:scale-95 transition-all cursor-pointer"
                  >
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Nova especificação
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Tabs Selector (only if not viewing archived) */}
      {!showArchived && (
        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveListTab('projects')}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition-all cursor-pointer -mb-px ${
              activeListTab === 'projects'
                ? 'border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-350'
            }`}
          >
            <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Projetos
            <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-850 dark:text-slate-400 border border-slate-200 dark:border-slate-750">
              {projectsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveListTab('standalone')}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition-all cursor-pointer -mb-px ${
              activeListTab === 'standalone'
                ? 'border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-350'
            }`}
          >
            <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Especificações Avulsas
            <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-850 dark:text-slate-400 border border-slate-200 dark:border-slate-750">
              {displayedScreens.filter((s) => !s.project_id).length}
            </span>
          </button>
        </div>
      )}

      {/* Main Content */}
      {isLoading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-655"></div>
          <p className="text-sm font-medium text-slate-500">Carregando dados do Supabase...</p>
        </div>
      ) : showArchived ? (
        /* Arquivadas View (Simples) */
        displayedScreens.length === 0 ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-400">Nenhuma especificação arquivada.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {renderSpecsTable(displayedScreens)}
          </div>
        )
      ) : (
        /* Active Projects & Standalone Specs View */
        <div className="space-y-6">
          {activeListTab === 'projects' ? (
            /* 1. PROJECTS SECTION */
            <div className="space-y-4">
              {projectsList.length === 0 ? (
                <div className="flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/50">
                  <p className="text-sm text-slate-400">Nenhum projeto cadastrado.</p>
                  {!isDeveloper && (
                    <button
                      onClick={() => setIsNewProjectModalOpen(true)}
                      className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-755 dark:text-indigo-400 cursor-pointer"
                    >
                      + Criar primeiro projeto
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {projectsList.map((project) => {
                    const projectSpecs = displayedScreens.filter(s => s.project_id === project.id);
                    const isCollapsed = collapsedProjects[project.id];
                    
                    return (
                      <div 
                        key={project.id} 
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900"
                      >
                        {/* Project Header */}
                        <div 
                          onClick={() => toggleProjectCollapse(project.id)}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/60 p-4 dark:bg-slate-800/40 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 select-none border-b border-slate-100 dark:border-slate-800"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 shrink-0 dark:bg-indigo-950/60 dark:text-indigo-400">
                              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="flex items-center gap-2.5">
                                <h3 className="font-display font-bold text-slate-800 dark:text-white">
                                  {project.name}
                                </h3>
                                <span className="inline-flex items-center rounded-full bg-slate-150 px-2 py-0.5 text-[10px] font-bold text-slate-655 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                  {projectSpecs.length} especs
                                </span>
                              </div>
                              {project.description && (
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                  {project.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Project Actions */}
                          <div className="flex items-center gap-3 self-end sm:self-auto" onClick={e => e.stopPropagation()}>
                            {!isDeveloper && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setAssociateTargetProjectId(project.id);
                                    setIsAssociateModalOpen(true);
                                  }}
                                  title="Vincular especificações avulsas existentes"
                                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer animate-all duration-200"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                  </svg>
                                  Vincular Espec
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedProjectId(project.id);
                                    setIsNewModalOpen(true);
                                  }}
                                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-650 hover:bg-indigo-700 px-3 py-1.5 text-xs font-semibold text-white transition-all cursor-pointer"
                                >
                                  + Adicionar espec
                                </button>
                              </div>
                            )}
                            <button
                              onClick={() => toggleProjectCollapse(project.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-855 cursor-pointer"
                            >
                              <svg 
                                className={`h-4.5 w-4.5 transform transition-transform duration-250 ${isCollapsed ? '' : 'rotate-180'}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Project Specifications List */}
                        {!isCollapsed && (
                          <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                            {projectSpecs.length === 0 ? (
                              <div className="py-8 text-center text-sm text-slate-450 italic">
                                Nenhuma especificação associada a este projeto.
                              </div>
                            ) : (
                              renderSpecsTable(projectSpecs)
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* 2. STANDALONE SPECIFICATIONS SECTION */
            <div className="space-y-4">
              {displayedScreens.filter(s => !s.project_id).length === 0 ? (
                <div className="flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/50">
                  <p className="text-sm text-slate-400">Nenhuma especificação avulsa encontrada.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  {renderSpecsTable(displayedScreens.filter(s => !s.project_id))}
                </div>
              )}
            </div>
          )}
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
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-855 dark:text-slate-200"
                />
              </div>

              {/* Projeto (Opcional) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Projeto (Opcional)
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-855 dark:text-slate-200 cursor-pointer"
                >
                  <option value="">-- Sem projeto (Avulsa) --</option>
                  {projectsList.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-855 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-350 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmNewSpec}
                className="rounded-xl bg-indigo-650 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Projeto */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Novo Projeto
              </h2>
              <button
                onClick={handleCloseProjectModal}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <div className="space-y-4">
              {/* Nome do Projeto */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Nome do Projeto
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Ex: Novo Portal Alesp, Sistema de RH"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-855 dark:text-slate-200"
                />
              </div>

              {/* Descrição do Projeto */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Descrição do Projeto
                </label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Descreva brevemente o objetivo do projeto..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-855 dark:text-slate-200 resize-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseProjectModal}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-355 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmNewProject}
                className="rounded-xl bg-indigo-650 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Vincular Especificações Existentes (em lote) */}
      {isAssociateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Vincular Especificações ao Projeto
              </h2>
              <button
                onClick={handleCloseAssociateModal}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              <p className="text-sm text-slate-550 dark:text-slate-400">
                Selecione as especificações avulsas que deseja mover para este projeto:
              </p>
              
              <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 dark:border-slate-800 dark:divide-slate-850">
                {displayedScreens.filter(s => !s.project_id).length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-450 italic">
                    Nenhuma especificação avulsa disponível para associação.
                  </div>
                ) : (
                  displayedScreens.filter(s => !s.project_id).map((screen) => {
                    const isChecked = selectedSpecIdsToAssociate.includes(screen.id);
                    return (
                      <label 
                        key={screen.id} 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-855 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedSpecIdsToAssociate(prev => prev.filter(id => id !== screen.id));
                            } else {
                              setSelectedSpecIdsToAssociate(prev => [...prev, screen.id]);
                            }
                          }}
                          className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 dark:border-slate-700"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{screen.name}</span>
                          <span className="text-xs text-slate-455">Autor: {specAuthors[screen.id] || 'Rodolfo Rodrigues'}</span>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseAssociateModal}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-350 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAssociate}
                disabled={displayedScreens.filter(s => !s.project_id).length === 0}
                className="rounded-xl bg-indigo-650 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Vincular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Vincular Especificação Individual a Projeto */}
      {isMoveSingleSpecModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Vincular a Projeto
              </h2>
              <button
                onClick={handleCloseMoveSingleSpecModal}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              <p className="text-sm text-slate-550 dark:text-slate-400">
                Selecione o projeto ao qual deseja vincular a especificação <strong className="text-slate-800 dark:text-slate-200">"{screensList.find(s => s.id === moveSingleSpecTargetId)?.name}"</strong>:
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Projeto de Destino
                </label>
                <select
                  value={moveSingleSpecTargetProjectId}
                  onChange={(e) => setMoveSingleSpecTargetProjectId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-855 dark:text-slate-200 cursor-pointer"
                >
                  <option value="">-- Sem projeto (Tornar Avulsa) --</option>
                  {projectsList.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseMoveSingleSpecModal}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-355 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmMoveSingleSpec}
                className="rounded-xl bg-indigo-650 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 transition-all cursor-pointer"
              >
                Vincular
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
