import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import ComponentModal from './ComponentModal';
import FlowsGallery from './FlowsGallery';

export default function ScreenEditor({ screen, onSave, onBack, isSaving, specFunctionalRequirements = [] }) {
  const [currentScreen, setCurrentScreen] = useState(screen);
  const [name, setName] = useState(screen ? screen.name : '');
  const [image, setImage] = useState(screen ? screen.image : null);
  const [components, setComponents] = useState(screen && screen.components ? screen.components : []);
  const [screenCriteria, setScreenCriteria] = useState(screen && screen.criteria ? screen.criteria : []);
  const [screenFunctionalRequirements, setScreenFunctionalRequirements] = useState(screen && screen.functionalRequirements ? screen.functionalRequirements : []);
  const [screenFlows, setScreenFlows] = useState(screen && screen.flows ? screen.flows : []);

  // Modal states for requirements linkage
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [tempSelectedReqs, setTempSelectedReqs] = useState({});

  const handleAddCriterion = () => {
    const nextNum = screenCriteria.length + 1;
    const newCriterion = {
      id: `new-${Date.now()}-${Math.random()}`,
      customId: `CA-TELA-${String(nextNum).padStart(2, '0')}`,
      scenario: '',
      given: '',
      when: '',
      then: '',
      traceability: '',
    };
    setScreenCriteria([...screenCriteria, newCriterion]);
  };

  const handleUpdateCriterion = (index, field, value) => {
    const updated = [...screenCriteria];
    updated[index] = { ...updated[index], [field]: value };
    setScreenCriteria(updated);
  };

  const handleRemoveCriterion = (index) => {
    setScreenCriteria(screenCriteria.filter((_, idx) => idx !== index));
  };



  const handleOpenReqModal = () => {
    const selection = {};
    screenFunctionalRequirements.forEach(r => {
      selection[r.id] = true;
    });
    setTempSelectedReqs(selection);
    setIsReqModalOpen(true);
  };

  const handleToggleTempSelection = (reqId) => {
    setTempSelectedReqs(prev => ({
      ...prev,
      [reqId]: !prev[reqId]
    }));
  };

  const handleConfirmLinkRequirements = () => {
    const selected = specFunctionalRequirements.filter(r => tempSelectedReqs[r.id]);
    setScreenFunctionalRequirements(selected);
    setIsReqModalOpen(false);
  };

  const handleRemoveFunctionalRequirement = (reqId) => {
    setScreenFunctionalRequirements(prev => prev.filter(r => r.id !== reqId));
  };

  const totalComps = components.length;
  const completedComps = components.filter((c) => c.status === 'concluido').length;
  const pct = totalComps > 0 ? Math.round((completedComps / totalComps) * 105) : 0;
  // Wait, let's keep it at 100 max or standard percentage calculation:
  // Math.round((completedComps / totalComps) * 100)
  const screenPct = totalComps > 0 ? Math.round((completedComps / totalComps) * 100) : 0;

  // Modal states for child components
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);

  // Save Confirmation / Success Modal states
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);
  const [expandedStates, setExpandedStates] = useState({});
  const [componentToDelete, setComponentToDelete] = useState(null);

  const toggleExpand = (compId) => {
    setExpandedStates((prev) => ({
      ...prev,
      [compId]: prev[compId] === undefined ? true : !prev[compId],
    }));
  };

  const [expandedDetails, setExpandedDetails] = useState({});

  const toggleDetail = (compId, section) => {
    const key = `${compId}-${section}`;
    setExpandedDetails((prev) => ({
      ...prev,
      [key]: prev[key] === undefined ? true : !prev[key],
    }));
  };

  const handleAddComponent = () => {
    setEditingComponent(null);
    setIsModalOpen(true);
  };

  const handleEditComponent = (comp) => {
    setEditingComponent(comp);
    setIsModalOpen(true);
  };

  const handleDeleteComponent = (id) => {
    setComponentToDelete(id);
  };

  const confirmDeleteComponent = () => {
    if (componentToDelete !== null) {
      setComponents(components.filter((c) => c.id !== componentToDelete));
      setComponentToDelete(null);
    }
  };

  const handleSaveComponent = (savedComp) => {
    const exists = components.some((c) => c.id === savedComp.id);
    if (exists) {
      setComponents(components.map((c) => (c.id === savedComp.id ? { ...c, ...savedComp } : c)));
    } else {
      setComponents([...components, savedComp]);
    }
  };

  const handleSaveScreen = () => {
    if (!name.trim()) {
      alert('Por favor, insira o nome da tela.');
      return;
    }
    setShowSaveConfirmModal(true);
  };

  const executeSaveScreen = async () => {
    setShowSaveConfirmModal(false);
    const result = await onSave({
      id: currentScreen ? currentScreen.id : Date.now(),
      name: name.trim(),
      image,
      components,
      criteria: screenCriteria,
      functionalRequirements: screenFunctionalRequirements,
      flows: screenFlows,
    });
    if (result) {
      setCurrentScreen(result);
      setShowSaveSuccessModal(true);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {screen ? 'Editar Tela' : 'Adicionar Tela'}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Gerencie o mockup principal da tela e detalhe seus componentes, campos e serviços.
          </p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Voltar para Especificação
        </button>
      </div>

      {/* Screen Name Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Nome da Tela Input */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Nome da Tela
          </label>
          <input
            type="text"
            placeholder="Ex: Tela de Login, Home Dashboard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200"
          />
        </div>

        {/* Conclusão da Tela */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Conclusão da Tela
          </label>
          <div className="flex items-center gap-3 mt-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase border shrink-0 ${
              screenPct === 100
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-955/20 dark:text-emerald-400 dark:border-emerald-800/40'
                : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-955/20 dark:text-rose-400 dark:border-rose-800/40'
            }`}>
              {screenPct}% concluído
            </span>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner max-w-[100px] hidden xs:block">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  screenPct === 100 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${screenPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 1 - Upload da Imagem da Tela */}
      <div className="space-y-3">
        <label className="font-display text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
          Mock-up / Imagem da Tela
        </label>
        <ImageUploader image={image} setImage={setImage} />
      </div>

      {/* Fluxo de Tela */}
      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
          Fluxo de Tela
        </h2>
        <FlowsGallery flows={screenFlows} onChange={setScreenFlows} />
      </div>

      {/* Requisitos Funcionais da Tela */}
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
            Requisitos Funcionais da Tela
          </h2>
          <button
            type="button"
            onClick={handleOpenReqModal}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Adicionar
          </button>
        </div>

        <div className="mt-4">
          {screenFunctionalRequirements.length === 0 ? (
            <p className="text-sm text-slate-450 italic pl-3">
              Nenhum requisito funcional associado a esta tela. Clique em "+ Adicionar" para vincular.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full min-w-[600px] border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[15%]">Nº Requisito</th>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[25%]">Nome Requisito</th>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[50%]">Descrição Requisito</th>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 text-left w-[10%]">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-900">
                  {screenFunctionalRequirements.map((req, index) => (
                    <tr key={req.id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                        {req.customId || `RF-${String(index + 1).padStart(2, '0')}`}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                        {req.name || 'Sem nome definido.'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                        {req.description || 'Sem descrição inserida.'}
                      </td>
                      <td className="px-3 py-2 text-left">
                        <button
                          type="button"
                          onClick={() => handleRemoveFunctionalRequirement(req.id)}
                          className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Desvincular requisito"
                        >
                          <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 2 - Seção Detalhamento da Tela */}
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
            Componentes da Tela
          </h2>
          <button
            onClick={handleAddComponent}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all duration-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Novo
          </button>
        </div>

        {/* List of Detailed Components */}
        <div className="mt-4">
          {components.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-slate-800">
                <svg className="h-6 w-6 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Nenhum componente foi detalhado nesta tela ainda.
              </p>
              <button
                onClick={handleAddComponent}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Clique para adicionar o primeiro detalhamento
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {components.map((comp, index) => (
                <div
                  key={comp.id}
                  className="rounded-2xl border border-slate-150 bg-slate-50/20 p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/10"
                >
                  {/* Component Header */}
                  <div className="flex items-center justify-between dark:border-slate-800/50">
                    <div
                      onClick={() => toggleExpand(comp.id)}
                      className="flex flex-wrap items-center gap-3 cursor-pointer select-none group/title"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400 transition-colors group-hover/title:bg-indigo-100 dark:group-hover/title:bg-indigo-900/60">
                        {index + 1}
                      </div>
                      <span className="font-display text-base font-bold text-slate-900 dark:text-white group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors">
                        {comp.name}
                      </span>
                      {comp.status === 'concluido' ? (
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 uppercase">
                          concluído
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-[9px] font-bold text-rose-750 dark:bg-rose-955/20 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 uppercase">
                          não desenvolvido
                        </span>
                      )}
                      <svg
                        className={`h-4.5 w-4.5 text-slate-400 group-hover/title:text-indigo-650 dark:group-hover/title:text-indigo-400 transition-transform duration-200 ${expandedStates[comp.id] === true ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditComponent(comp)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-90 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                        title="Editar Componente"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteComponent(comp.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-rose-950/20"
                        title="Excluir Componente"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* Component Details Content */}
                  {expandedStates[comp.id] === true && (
                    <div className="mt-4 space-y-4 animate-fade-in">
                      {/* Section 1: Geral / Descrição */}
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => toggleDetail(comp.id, 'general')}
                          className="w-full flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 px-4 py-2.5 text-left font-display text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-4 w-1 rounded-full bg-indigo-650 dark:bg-indigo-500"></span>
                            <span>Descrição e Mock-up</span>
                          </div>
                          <svg
                            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${expandedDetails[`${comp.id}-general`] === true ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {expandedDetails[`${comp.id}-general`] === true && (
                          <div className="p-4 border-t border-slate-150 dark:border-slate-800/60 bg-white dark:bg-slate-900/10 space-y-4 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Left: Description */}
                              <div className="space-y-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
                                  Descrição do Componente
                                </span>
                                <div className="rounded-xl bg-white dark:bg-slate-955/10 p-4 border border-slate-100 dark:border-slate-800/40 min-h-[120px] flex items-start">
                                  <p className="text-sm text-slate-650 dark:text-slate-355 leading-relaxed whitespace-pre-wrap">
                                    {comp.description || <span className="italic text-slate-400">Sem descrição fornecida.</span>}
                                  </p>
                                </div>
                              </div>

                              {/* Right: Mock-up / Imagem */}
                              <div className="space-y-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
                                  Mock-up / Imagem do Componente
                                </span>
                                {comp.image ? (
                                  <div className="flex h-[120px] items-center justify-center rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-955/40 overflow-hidden shadow-sm">
                                    <img
                                      src={comp.image}
                                      alt={comp.name}
                                      className="max-h-full max-w-full rounded object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800/40">
                                    <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="mt-1 text-xs text-slate-450">Sem imagem de mock-up</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Section 2: Campos e Validações */}
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => toggleDetail(comp.id, 'fields')}
                          className="w-full flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 px-4 py-2.5 text-left font-display text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-4 w-1 rounded-full bg-indigo-650 dark:bg-indigo-500"></span>
                            <span>Tabela de Campos e Validações</span>
                          </div>
                          <svg
                            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${expandedDetails[`${comp.id}-fields`] === true ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {expandedDetails[`${comp.id}-fields`] === true && (
                          <div className="p-4 border-t border-slate-150 dark:border-slate-800/60 bg-white dark:bg-slate-900/10 space-y-2 animate-fade-in">
                            {!comp.fields || comp.fields.length === 0 ? (
                              <p className="text-xs text-slate-400 italic pl-1">Nenhum campo cadastrado.</p>
                            ) : (
                              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-955/20 shadow-sm">
                                <table className="w-full min-w-[900px] text-left text-xs border-collapse">
                                  <thead className="bg-slate-50 dark:bg-slate-800/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                                    <tr>
                                      <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[15%]">NOME DO CAMPO</th>
                                      <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">DESCRIÇÃO</th>
                                      <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[10%] text-center">OBRIGATÓRIO</th>
                                      <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[15%]">FORMATO</th>
                                      <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[35%]">REGRAS DE VALIDAÇÃO</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/10">
                                    {comp.fields.map((f) => (
                                      <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                        <td className="px-4 py-2.5 font-mono font-semibold text-indigo-650 dark:text-indigo-400 break-all whitespace-pre-wrap">
                                          {f.fieldName || '-'}
                                        </td>
                                        <td className="px-4 py-2.5 text-slate-655 dark:text-slate-355 break-words whitespace-pre-wrap">
                                          {f.description || '-'}
                                        </td>
                                        <td className="px-4 py-2.5 text-center">
                                          {f.required ? (
                                            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                                              Sim
                                            </span>
                                          ) : (
                                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                              Não
                                            </span>
                                          )}
                                        </td>
                                        <td className="px-4 py-2.5">
                                          <span className="inline-flex rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-750 dark:bg-indigo-950/30 dark:text-indigo-400">
                                            {f.format || '-'}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-slate-655 dark:text-slate-355 break-words whitespace-pre-wrap">
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
                      </div>

                      {/* Section 3: Serviços */}
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => toggleDetail(comp.id, 'services')}
                          className="w-full flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 px-4 py-2.5 text-left font-display text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-4 w-1 rounded-full bg-indigo-650 dark:bg-indigo-500"></span>
                            <span>Tabela de Serviços</span>
                          </div>
                          <svg
                            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${expandedDetails[`${comp.id}-services`] === true ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {expandedDetails[`${comp.id}-services`] === true && (
                          <div className="p-4 border-t border-slate-150 dark:border-slate-800/60 bg-white dark:bg-slate-900/10 space-y-2 animate-fade-in">
                            {!comp.services || comp.services.length === 0 ? (
                              <p className="text-xs text-slate-400 italic pl-1">Nenhum serviço mapeado.</p>
                            ) : (
                              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-955/20 shadow-sm">
                                <table className="w-full min-w-[900px] text-left text-xs border-collapse">
                                  <thead className="bg-slate-50 dark:bg-slate-800/40 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                                    <tr>
                                      <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[10%]">ID</th>
                                      <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[10%]">MÉTODO / TIPO</th>
                                      <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">ENDPOINT / TÓPICO / ARQUIVO</th>
                                      <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">DESCRIÇÃO</th>
                                      <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">REQUEST</th>
                                      <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">RESPONSE / SAÍDA</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/10">
                                    {comp.services.map((s) => (
                                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                        <td className="px-4 py-2.5 font-mono font-semibold text-slate-700 dark:text-slate-300 break-all">
                                          {s.serviceId || '-'}
                                        </td>
                                        <td className="px-4 py-2.5">
                                          <span className="inline-flex rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-750 dark:bg-indigo-950/30 dark:text-indigo-400">
                                            {s.method}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2.5 font-mono text-slate-655 dark:text-slate-350 break-all whitespace-pre-wrap">
                                          {s.endpoint || '-'}
                                        </td>
                                        <td className="px-4 py-2.5 text-slate-655 dark:text-slate-355 break-words whitespace-pre-wrap">
                                          {s.description || '-'}
                                        </td>
                                        <td className="px-4 py-2.5 font-mono text-slate-655 dark:text-slate-355 break-words whitespace-pre-wrap">
                                          {s.request || '-'}
                                        </td>
                                        <td className="px-4 py-2.5 font-mono text-slate-655 dark:text-slate-355 break-words whitespace-pre-wrap">
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
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Critérios de Aceite da Tela */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
            Critérios de Aceite da Tela
          </h2>
          <button
            type="button"
            onClick={handleAddCriterion}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow active:scale-95 duration-200 cursor-pointer"
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
            Adicionar critério
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">Cenário</th>
                <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">Dado que</th>
                <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">Quando</th>
                <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">Então</th>
                <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[15%]">Rastreabilidade</th>
                <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 text-left w-[5%]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-900">
              {screenCriteria.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                    Nenhum critério de aceite cadastrado para esta tela. Clique em "+ Adicionar critério" para começar.
                  </td>
                </tr>
              ) : (
                screenCriteria.map((criterion, index) => (
                  <tr key={criterion.id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-3 py-2">
                      <textarea
                        value={criterion.scenario || ''}
                        onChange={(e) => handleUpdateCriterion(index, 'scenario', e.target.value)}
                        rows={2}
                        placeholder="Ex: Cenário 1: Sucesso no Login"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200 resize-y"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <textarea
                        value={criterion.given || ''}
                        onChange={(e) => handleUpdateCriterion(index, 'given', e.target.value)}
                        rows={2}
                        placeholder="Ex: Dado que o usuário está na tela..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200 resize-y"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <textarea
                        value={criterion.when || ''}
                        onChange={(e) => handleUpdateCriterion(index, 'when', e.target.value)}
                        rows={2}
                        placeholder="Ex: Quando preenche os campos..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200 resize-y"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <textarea
                        value={criterion.then || ''}
                        onChange={(e) => handleUpdateCriterion(index, 'then', e.target.value)}
                        rows={2}
                        placeholder="Ex: Então redireciona para..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200 resize-y"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <textarea
                        value={criterion.traceability || ''}
                        onChange={(e) => handleUpdateCriterion(index, 'traceability', e.target.value)}
                        rows={2}
                        placeholder="Ex: RF-01, RF-02"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200 resize-y"
                      />
                    </td>
                    <td className="px-3 py-2 text-left">
                      <button
                        type="button"
                        onClick={() => handleRemoveCriterion(index)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Remover critério"
                      >
                        <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSaveScreen}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg hover:from-indigo-600 hover:to-violet-700 active:scale-98 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Gravando...
            </>
          ) : (
            'Gravar'
          )}
        </button>
      </div>

      {/* Modal Dialog for Detalhamento (attached style) */}
      <ComponentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveComponent}
        editingComponent={editingComponent}
      />

      {/* Delete Confirmation Modal */}
      {componentToDelete !== null && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-slate-250 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Warning Icon Header */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/30 dark:text-rose-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Content text */}
            <div className="mt-4 text-center">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Tem certeza que deseja excluir esse componente da tela?
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Esta ação irá remover permanentemente o detalhamento e todas as suas tabelas de campos e serviços associados.
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setComponentToDelete(null)}
                className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-200 active:scale-95 transition-all cursor-pointer"
              >
                Não
              </button>
              <button
                type="button"
                onClick={confirmDeleteComponent}
                className="flex-1 rounded-xl bg-rose-500 hover:bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white active:scale-95 transition-all cursor-pointer"
              >
                Sim, excluir!
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Save Confirmation Modal */}
      {showSaveConfirmModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-slate-250 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 mb-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-1.5-1.5M12 14V3" />
              </svg>
            </div>
            <h3 className="text-center font-display text-lg font-bold text-slate-800 dark:text-white mb-2">
              Confirmar Gravação
            </h3>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
              Deseja gravar as alterações realizadas nesta tela?
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSaveConfirmModal(false)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              >
                Não
              </button>
              <button
                type="button"
                onClick={executeSaveScreen}
                className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-sm font-semibold text-white active:scale-95 transition-all cursor-pointer"
              >
                Sim, gravar!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Success Modal */}
      {showSaveSuccessModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-slate-250 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400 mb-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-center font-display text-lg font-bold text-slate-800 dark:text-white mb-2">
              Gravado com sucesso!
            </h3>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
              A tela e todos os seus detalhamentos foram gravados com sucesso no banco de dados.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowSaveSuccessModal(false)}
                className="w-full sm:w-auto min-w-[120px] rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 px-6 text-sm font-semibold text-white active:scale-95 transition-all cursor-pointer"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Link Functional Requirements Modal */}
      {isReqModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Vincular Requisitos Funcionais à Tela
              </h3>
              <button
                type="button"
                onClick={() => setIsReqModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto py-4">
              {specFunctionalRequirements.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                  Nenhum requisito funcional cadastrado nesta especificação técnica ainda. 
                  Cadastre-os na tela de edição da especificação antes de vinculá-los.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <tr>
                        <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[12%] text-center">Vincular</th>
                        <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[18%]">Nº Requisito</th>
                        <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[30%]">Nome Requisito</th>
                        <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[40%]">Descrição Requisito</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-900">
                      {specFunctionalRequirements.map((req) => (
                        <tr 
                          key={req.id} 
                          onClick={() => handleToggleTempSelection(req.id)}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 cursor-pointer"
                        >
                          <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={!!tempSelectedReqs[req.id]}
                              onChange={() => handleToggleTempSelection(req.id)}
                              className="h-4.5 w-4.5 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-750 dark:text-slate-300">
                            {req.customId}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                            {req.name || 'Sem nome'}
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                            {req.description || 'Sem descrição'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 pt-4 flex justify-end gap-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsReqModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmLinkRequirements}
                disabled={specFunctionalRequirements.length === 0}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Vincular Selecionados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
