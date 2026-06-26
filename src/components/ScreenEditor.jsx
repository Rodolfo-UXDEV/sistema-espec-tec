import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import ComponentModal from './ComponentModal';

export default function ScreenEditor({ screen, onSave, onBack, isSaving }) {
  const [currentScreen, setCurrentScreen] = useState(screen);
  const [name, setName] = useState(screen ? screen.name : '');
  const [image, setImage] = useState(screen ? screen.image : null);
  const [components, setComponents] = useState(screen && screen.components ? screen.components : []);

  // Modal states for child components
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
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

  const handleSaveScreen = async () => {
    if (!name.trim()) {
      alert('Por favor, insira o nome da tela.');
      return;
    }
    const result = await onSave({
      id: currentScreen ? currentScreen.id : Date.now(),
      name: name.trim(),
      image,
      components,
    });
    if (result) {
      setCurrentScreen(result);
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
      <div className="flex flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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

      {/* 1 - Upload da Imagem da Tela */}
      <div className="space-y-3">
        <label className="font-display text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
          Mock-up / Imagem da Tela
        </label>
        <ImageUploader image={image} setImage={setImage} />
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
                      className="flex items-center gap-3 cursor-pointer select-none group/title"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400 transition-colors group-hover/title:bg-indigo-100 dark:group-hover/title:bg-indigo-900/60">
                        {index + 1}
                      </div>
                      <span className="font-display text-base font-bold text-slate-900 dark:text-white group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors">
                        {comp.name}
                      </span>
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
                                        <td className="px-4 py-2.5 font-mono text-slate-655 dark:text-slate-355 break-all whitespace-pre-wrap">
                                          {s.request || '-'}
                                        </td>
                                        <td className="px-4 py-2.5 font-mono text-slate-655 dark:text-slate-355 break-all whitespace-pre-wrap">
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
    </div>
  );
}
