import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ScreenDetailsSection from './components/ScreenDetailsSection';
import ComponentModal from './components/ComponentModal';
import ScreenViewer from './components/ScreenViewer';
import { supabase } from './supabaseClient';
import './App.css';

export default function App() {
  const [image, setImage] = useState(null);
  const [details, setDetails] = useState([]);
  const [screenName, setScreenName] = useState('');
  
  // Navigation state
  const [currentView, setCurrentView] = useState('edit'); // 'edit' or 'view'
  
  // Supabase states
  const [screensList, setScreensList] = useState([]);
  const [selectedScreenId, setSelectedScreenId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);

  // Fetch screens on mount
  useEffect(() => {
    fetchScreensList();
  }, []);

  const fetchScreensList = async () => {
    try {
      const { data, error } = await supabase
        .from('screens')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      if (data) setScreensList(data);
    } catch (err) {
      console.error('Erro ao buscar lista de telas:', err.message);
    }
  };

  const loadScreenData = async (id) => {
    if (!id) {
      // Clear current state if "Nova Tela" is selected
      setScreenName('');
      setImage(null);
      setDetails([]);
      setSelectedScreenId('');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Fetch screen info
      const { data: screenData, error: screenErr } = await supabase
        .from('screens')
        .select('*')
        .eq('id', id)
        .single();
      
      if (screenErr) throw screenErr;

      setScreenName(screenData.name);
      setImage(screenData.image_url);
      setSelectedScreenId(screenData.id);

      // 2. Fetch components
      const { data: compsData, error: compsErr } = await supabase
        .from('components')
        .select('*')
        .eq('screen_id', id);

      if (compsErr) throw compsErr;

      if (!compsData || compsData.length === 0) {
        setDetails([]);
        return;
      }

      // 3. For each component, load fields and services
      const fullComponents = await Promise.all(
        compsData.map(async (comp) => {
          // Fetch fields
          const { data: fieldsData, error: fieldsErr } = await supabase
            .from('component_fields')
            .select('*')
            .eq('component_id', comp.id);
          
          if (fieldsErr) throw fieldsErr;

          // Fetch services
          const { data: servicesData, error: servicesErr } = await supabase
            .from('component_services')
            .select('*')
            .eq('component_id', comp.id);
          
          if (servicesErr) throw servicesErr;

          return {
            id: comp.id,
            name: comp.name,
            description: comp.description,
            image: comp.image_url,
            fields: fieldsData
              ? fieldsData.map((f) => ({
                  id: f.id,
                  fieldName: f.field_name,
                  description: f.description,
                  required: f.required,
                  format: f.format,
                  validationRules: f.validation_rules,
                }))
              : [],
            services: servicesData
              ? servicesData.map((s) => ({
                  id: s.id,
                  serviceId: s.service_id,
                  method: s.method,
                  endpoint: s.endpoint,
                  description: s.description,
                  request: s.request,
                  response: s.response,
                }))
              : [],
          };
        })
      );

      setDetails(fullComponents);
    } catch (err) {
      alert('Erro ao carregar os dados da tela: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingComponent(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (component) => {
    setEditingComponent(component);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (confirm('Tem certeza que deseja remover este componente do detalhamento?')) {
      setDetails(details.filter((item) => item.id !== id));
    }
  };

  const handleSaveComponent = (savedComponent) => {
    const exists = details.some((item) => item.id === savedComponent.id);
    if (exists) {
      setDetails(details.map((item) => (item.id === savedComponent.id ? savedComponent : item)));
    } else {
      setDetails([...details, savedComponent]);
    }
  };

  const handleSaveAllToSupabase = async () => {
    if (!screenName.trim()) {
      alert('Por favor, insira o nome da tela.');
      return;
    }

    setIsSaving(true);
    try {
      let screenId = selectedScreenId;

      // 1. Check if the screen already exists by ID or by name
      if (screenId) {
        // Update screen
        const { error: updateErr } = await supabase
          .from('screens')
          .update({ name: screenName, image_url: image })
          .eq('id', screenId);
        
        if (updateErr) throw updateErr;
      } else {
        // Check if there is a screen with the same name to prevent duplicates
        const { data: existingScreen } = await supabase
          .from('screens')
          .select('id')
          .eq('name', screenName)
          .maybeSingle();

        if (existingScreen) {
          screenId = existingScreen.id;
          const { error: updateErr } = await supabase
            .from('screens')
            .update({ image_url: image })
            .eq('id', screenId);
          
          if (updateErr) throw updateErr;
        } else {
          // Insert new screen
          const { data: newScreen, error: insertErr } = await supabase
            .from('screens')
            .insert({ name: screenName, image_url: image })
            .select()
            .single();
          
          if (insertErr) throw insertErr;
          screenId = newScreen.id;
          setSelectedScreenId(screenId);
        }
      }

      // 2. Clean up existing components for this screen to perform a full overwrite
      const { error: deleteCompsErr } = await supabase
        .from('components')
        .delete()
        .eq('screen_id', screenId);

      if (deleteCompsErr) throw deleteCompsErr;

      // 3. Insert components and their respective fields and services
      for (const comp of details) {
        // Insert component
        const { data: insertedComp, error: compInsertErr } = await supabase
          .from('components')
          .insert({
            screen_id: screenId,
            name: comp.name,
            description: comp.description,
            image_url: comp.image,
          })
          .select()
          .single();

        if (compInsertErr) throw compInsertErr;
        const newCompId = insertedComp.id;

        // Insert fields
        if (comp.fields && comp.fields.length > 0) {
          const fieldsToInsert = comp.fields.map((f) => ({
            component_id: newCompId,
            field_name: f.fieldName,
            description: f.description,
            required: f.required,
            format: f.format,
            validation_rules: f.validationRules,
          }));

          const { error: fieldsInsertErr } = await supabase
            .from('component_fields')
            .insert(fieldsToInsert);

          if (fieldsInsertErr) throw fieldsInsertErr;
        }

        // Insert services
        if (comp.services && comp.services.length > 0) {
          const servicesToInsert = comp.services.map((s) => ({
            component_id: newCompId,
            service_id: s.serviceId,
            method: s.method,
            endpoint: s.endpoint,
            description: s.description,
            request: s.request,
            response: s.response,
          }));

          const { error: servicesInsertErr } = await supabase
            .from('component_services')
            .insert(servicesToInsert);

          if (servicesInsertErr) throw servicesInsertErr;
        }
      }

      alert('Especificações da tela salvas com sucesso no Supabase!');
      fetchScreensList(); // refresh screens list dropdown
    } catch (err) {
      alert('Erro ao salvar especificações: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">
      {/* Header com o nome "Especificação Técnica Alesp" e navegação */}
      <Header currentView={currentView} setCurrentView={setCurrentView} />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {currentView === 'view' ? (
          <ScreenViewer
            screensList={screensList}
            selectedScreenId={selectedScreenId}
            loadScreenData={loadScreenData}
            screenName={screenName}
            image={image}
            details={details}
            isLoading={isLoading}
          />
        ) : (
          <>
            {/* Page Title & Loader/Controls */}
            <div className="mb-8 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Adicionar/editar Telas
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Gerencie a interface visual, componentes e especificações técnicas sincronizadas no Supabase.
                  </p>
                </div>

                {/* Load Screen Selector */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-450">
                    Carregar Tela:
                  </label>
                  <select
                    value={selectedScreenId}
                    onChange={(e) => loadScreenData(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <option value="">-- Nova Tela --</option>
                    {screensList.map((screen) => (
                      <option key={screen.id} value={screen.id}>
                        {screen.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Screen Name Input */}
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Nome da Tela (ex: Login, Dashboard)"
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-650"></div>
                <p className="text-sm font-medium text-slate-500">Carregando especificações do Supabase...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Upload da imagem da tela */}
                <div className="space-y-3">
                  <label className="font-display text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                    Mock-up / Imagem da Tela
                  </label>
                  <ImageUploader image={image} setImage={setImage} />
                </div>

                {/* Seção "Detalhamento da Tela" com botão "Adicionar" na mesma linha */}
                <ScreenDetailsSection
                  details={details}
                  onAddClick={handleAddClick}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                />
                
                {/* Action button to save to Supabase */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSaveAllToSupabase}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-100 hover:from-indigo-600 hover:to-violet-700 active:scale-98 transition-all disabled:opacity-50 dark:shadow-none"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Salvando no Supabase...
                      </>
                    ) : (
                      'Salvar Configurações'
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Component modal dialog */}
      <ComponentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveComponent}
        editingComponent={editingComponent}
      />
    </div>
  );

}
