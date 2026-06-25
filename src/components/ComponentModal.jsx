import React, { useState, useEffect, useRef } from 'react';

export default function ComponentModal({ isOpen, onClose, onSave, editingComponent }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [fields, setFields] = useState([]);
  const [services, setServices] = useState([]);
  
  const fileInputRef = useRef(null);

  // Load initial data if editing
  useEffect(() => {
    if (isOpen) {
      if (editingComponent) {
        setName(editingComponent.name || '');
        setDescription(editingComponent.description || '');
        setImage(editingComponent.image || null);
        setFields(editingComponent.fields || []);
        setServices(editingComponent.services || []);
      } else {
        // Reset form for fresh creation
        setName('');
        setDescription('');
        setImage(null);
        setFields([
          { id: Date.now(), fieldName: '', description: '', required: false, format: 'Texto', validationRules: '' }
        ]);
        setServices([
          { id: Date.now() + 1, serviceId: '', method: 'GET', endpoint: '', description: '', request: '', response: '' }
        ]);
      }
    }
  }, [isOpen, editingComponent]);

  if (!isOpen) return null;

  // Handle image upload inside modal
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Add field to fields table
  const addFieldRow = () => {
    setFields([
      ...fields,
      {
        id: Date.now(),
        fieldName: '',
        description: '',
        required: false,
        format: 'Texto',
        validationRules: '',
      },
    ]);
  };

  // Update a specific cell in the fields table
  const updateFieldRow = (id, column, value) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, [column]: value } : field
      )
    );
  };

  // Remove a row from the fields table
  const removeFieldRow = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  // Add service row to services table
  const addServiceRow = () => {
    setServices([
      ...services,
      {
        id: Date.now(),
        serviceId: '',
        method: 'GET',
        endpoint: '',
        description: '',
        request: '',
        response: '',
      },
    ]);
  };

  // Update a specific cell in the services table
  const updateServiceRow = (id, column, value) => {
    setServices(
      services.map((srv) =>
        srv.id === id ? { ...srv, [column]: value } : srv
      )
    );
  };

  // Remove a row from the services table
  const removeServiceRow = (id) => {
    setServices(services.filter((srv) => srv.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor, insira o nome do componente.');
      return;
    }
    
    onSave({
      id: editingComponent ? editingComponent.id : Date.now(),
      name,
      description,
      image,
      fields,
      services,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="flex max-h-[90vh] w-full max-w-7xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            {editingComponent ? 'Editar Componente' : 'Adicionar Componente'}
          </h3>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Component Name and Photo upload row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              {/* 1 - Campo para inserir o nome da tela */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Nome do Componente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Componente de Login, Dashboard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              {/* 3 - Campo para inserir uma descrição da tela */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Descrição do Componente
                </label>
                <textarea
                  placeholder="Descreva a função deste componente e seu comportamento..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* 2 - Adicionar uma foto da tela */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Mock-up / Imagem do Componente
              </label>
              
              {!image ? (
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-slate-600"
                >
                  <svg
                    className="h-8 w-8 text-slate-400"
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
                  <span className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    Clique para selecionar imagem
                  </span>
                </div>
              ) : (
                <div className="relative flex h-[200px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950/20">
                  <img
                    src={image}
                    alt="Preview Componente"
                    className="h-full max-w-full rounded object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 rounded-lg bg-rose-500 p-1.5 text-white hover:bg-rose-600 shadow-md transition-all active:scale-95"
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
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* 4 - Tabela de Campos e Validações */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-base font-bold text-slate-850 dark:text-slate-200">
                Tabela de Campos e Validações
              </label>
              <button
                type="button"
                onClick={addFieldRow}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <svg
                  className="h-3.5 w-3.5"
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
                Adicionar Campo
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[15%]">NOME DO CAMPO</th>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">DESCRIÇÃO</th>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[10%] text-center">OBRIGATÓRIO</th>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[15%]">FORMATO</th>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[35%]">REGRAS DE VALIDAÇÃO</th>
                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 text-center w-[5%]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {fields.map((field) => (
                    <tr key={field.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          required
                          placeholder="Ex: email, cpf"
                          value={field.fieldName}
                          onChange={(e) => updateFieldRow(field.id, 'fieldName', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          placeholder="Ex: Endereço de email do usuário"
                          value={field.description}
                          onChange={(e) => updateFieldRow(field.id, 'description', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateFieldRow(field.id, 'required', e.target.checked)}
                          className="h-4 w-4 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={field.format}
                          onChange={(e) => updateFieldRow(field.id, 'format', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <option value="Texto">Texto</option>
                          <option value="Número">Número</option>
                          <option value="Data/Hora">Data/Hora</option>
                          <option value="E-mail">E-mail</option>
                          <option value="Booleano">Booleano</option>
                          <option value="Monetário">Monetário</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          placeholder="Ex: Mínimo 8 caracteres"
                          value={field.validationRules}
                          onChange={(e) => updateFieldRow(field.id, 'validationRules', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeFieldRow(field.id)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 active:scale-90 transition-all"
                          title="Remover linha"
                          disabled={fields.length === 1}
                        >
                          <svg
                            className={`h-4 w-4 ${fields.length === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabela de Serviços */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-base font-bold text-slate-855 dark:text-slate-200">
                Tabela de Serviços
              </label>
              <button
                type="button"
                onClick={addServiceRow}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <svg
                  className="h-3.5 w-3.5"
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
                Adicionar Serviço
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                     <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[10%]">ID</th>
                     <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[10%]">MÉTODO / TIPO</th>
                     <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">ENDPOINT / TÓPICO / ARQUIVO</th>
                     <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">DESCRIÇÃO</th>
                     <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[20%]">REQUEST</th>
                     <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[15%]">RESPONSE / SAÍDA</th>
                     <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 text-center w-[5%]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {services.map((srv) => (
                    <tr key={srv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          required
                          placeholder="Ex: SRV-01"
                          value={srv.serviceId}
                          onChange={(e) => updateServiceRow(srv.id, 'serviceId', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={srv.method}
                          onChange={(e) => updateServiceRow(srv.id, 'method', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200"
                        >
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                          <option value="PATCH">PATCH</option>
                          <option value="RPC">RPC</option>
                          <option value="Tópico/Pub-Sub">Tópico/Pub-Sub</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          placeholder="Ex: /api/v1/auth/login"
                          value={srv.endpoint}
                          onChange={(e) => updateServiceRow(srv.id, 'endpoint', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          placeholder="Ex: Realiza a autenticação"
                          value={srv.description}
                          onChange={(e) => updateServiceRow(srv.id, 'description', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          placeholder="Ex: { email, senha }"
                          value={srv.request}
                          onChange={(e) => updateServiceRow(srv.id, 'request', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          placeholder="Ex: { token, user }"
                          value={srv.response}
                          onChange={(e) => updateServiceRow(srv.id, 'response', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeServiceRow(srv.id)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 active:scale-90 transition-all"
                          title="Remover linha"
                          disabled={services.length === 1}
                        >
                          <svg
                            className={`h-4 w-4 ${services.length === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-indigo-650 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Salvar Componente
          </button>
        </div>
      </div>
    </div>
  );
}
