import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ScreensListSection from './components/ScreensListSection';
import ComponentModal from './components/ComponentModal';
import ScreenViewer from './components/ScreenViewer';
import SpecificationList from './components/SpecificationList';
import FlowsGallery from './components/FlowsGallery';
import ScreenEditor from './components/ScreenEditor';
import LandingPage from './components/LandingPage';
import { supabase } from './supabaseClient';
import './App.css';

export default function App() {
  const [image, setImage] = useState(null);
  const [details, setDetails] = useState([]);
  const [screenName, setScreenName] = useState('');
  
  // Navigation state
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'home', 'edit', 'view' or 'screen-editor'
  const [activeScreen, setActiveScreen] = useState(null);
  const [screenToDelete, setScreenToDelete] = useState(null);
  const [userRole, setUserRole] = useState('analista'); // 'analista' or 'desenvolvedor'
  
  // Supabase states
  const [screensList, setScreensList] = useState([]);
  const [selectedScreenId, setSelectedScreenId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Spec authors state (localStorage)
  const [specAuthors, setSpecAuthors] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('spec_authors') || '{}');
    } catch {
      return {};
    }
  });
  const [pendingAuthor, setPendingAuthor] = useState('');

  // Spec description and flows states
  const [specFlows, setSpecFlows] = useState([]);
  const [specDescription, setSpecDescription] = useState('');
  const [specDescriptions, setSpecDescriptions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('spec_descriptions') || '{}');
    } catch {
      return {};
    }
  });

  // Archive state (localStorage)
  const [archivedIds, setArchivedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('archived_specs') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('archived_specs', JSON.stringify(archivedIds));
  }, [archivedIds]);

  // No modal states needed in App.jsx (managed inside ScreenEditor)

  // Fetch screens on mount
  useEffect(() => {
    fetchScreensList();
  }, []);

  const fetchScreensList = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('screens')
        .select('id, name, created_at')
        .order('name');
      
      if (error) throw error;
      if (data) setScreensList(data);
    } catch (err) {
      console.error('Erro ao buscar lista de telas:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadScreenData = async (id) => {
    if (!id) {
      // Clear current state if "Nova Tela" is selected
      setScreenName('');
      setImage(null);
      setSpecFlows([]);
      setSpecDescription('');
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

      // Parse flows from image_url
      let flowsArray = [];
      if (screenData.image_url) {
        try {
          if (screenData.image_url.startsWith('[')) {
            flowsArray = JSON.parse(screenData.image_url);
          } else {
            flowsArray = screenData.image_url.split(',').filter(Boolean);
          }
        } catch (e) {
          flowsArray = [screenData.image_url];
        }
      }
      setSpecFlows(flowsArray);

      // Load description
      const storedDescriptions = JSON.parse(localStorage.getItem('spec_descriptions') || '{}');
      setSpecDescription(storedDescriptions[id] || '');

      // 2. Fetch components (both parent screens and child components)
      const { data: compsData, error: compsErr } = await supabase
        .from('components')
        .select('*')
        .eq('screen_id', id);

      if (compsErr) throw compsErr;

      if (!compsData || compsData.length === 0) {
        setDetails([]);
        return;
      }

      // Helper to parse parent/child association from description
      const parsedComponents = compsData.map(comp => {
        let parentScreenId = null;
        let actualDescription = comp.description || '';
        try {
          if (comp.description && comp.description.trim().startsWith('{')) {
            const parsed = JSON.parse(comp.description);
            if (parsed && parsed.parent_screen_id) {
              parentScreenId = parsed.parent_screen_id;
              actualDescription = parsed.description || '';
            }
          }
        } catch (e) {
          // Keep actualDescription as description text
        }
        return {
          id: comp.id,
          name: comp.name,
          parentScreenId,
          description: actualDescription,
          image: comp.image_url,
          fields: [],
          services: []
        };
      });

      // Split into parent screens and child components
      const parentScreens = parsedComponents.filter(c => !c.parentScreenId);
      const childCompsRaw = parsedComponents.filter(c => c.parentScreenId);

      // Load fields and services for child components
      const childComps = await Promise.all(
        childCompsRaw.map(async (comp) => {
          const { data: fieldsData, error: fieldsErr } = await supabase
            .from('component_fields')
            .select('*')
            .eq('component_id', comp.id);
          
          if (fieldsErr) throw fieldsErr;

          const { data: servicesData, error: servicesErr } = await supabase
            .from('component_services')
            .select('*')
            .eq('component_id', comp.id);
          
          if (servicesErr) throw servicesErr;

          return {
            ...comp,
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

      // Assemble hierarchy: group child components under their parent screens
      const assembledScreens = parentScreens.map((screen) => {
        return {
          id: screen.id,
          name: screen.name,
          image: screen.image,
          description: screen.description,
          components: childComps.filter((c) => c.parentScreenId === screen.id)
        };
      });

      setDetails(assembledScreens);
    } catch (err) {
      alert('Erro ao carregar os dados da tela: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setActiveScreen(null);
    setCurrentView('screen-editor');
  };

  const handleEditClick = (screen) => {
    setActiveScreen(screen);
    setCurrentView('screen-editor');
  };

  const handleDeleteClick = (id) => {
    setScreenToDelete(id);
  };

  const confirmDeleteScreen = () => {
    if (screenToDelete !== null) {
      setDetails(details.filter((item) => item.id !== screenToDelete));
      setScreenToDelete(null);
    }
  };

  const handleSaveScreen = async (savedScreen) => {
    setIsSaving(true);
    try {
      let screenId = selectedScreenId;

      // 1. Ensure the specification (screens table) exists
      if (!screenId) {
        if (!screenName.trim()) {
          alert('Por favor, insira o nome da especificação primeiro no topo da página de edição.');
          setIsSaving(false);
          return null;
        }

        // Check if screen name already exists
        const { data: existingScreen } = await supabase
          .from('screens')
          .select('id')
          .eq('name', screenName)
          .maybeSingle();

        if (existingScreen) {
          screenId = existingScreen.id;
          setSelectedScreenId(screenId);
        } else {
          const { data: newScreen, error: insertErr } = await supabase
            .from('screens')
            .insert({ name: screenName, image_url: JSON.stringify(specFlows) })
            .select()
            .single();
          
          if (insertErr) throw insertErr;
          screenId = newScreen.id;
          setSelectedScreenId(screenId);
        }
      } else {
        // Update the specification name / flows if necessary
        const { error: updateErr } = await supabase
          .from('screens')
          .update({ name: screenName, image_url: JSON.stringify(specFlows) })
          .eq('id', screenId);
        
        if (updateErr) throw updateErr;
      }

      // 2. If savedScreen.id is a UUID (string), clean up its old database records (parent and children)
      const isExistingUUID = typeof savedScreen.id === 'string' && savedScreen.id.includes('-');
      if (isExistingUUID) {
        // Fetch all components for this specification to identify children of this screen
        const { data: compsData, error: fetchCompsErr } = await supabase
          .from('components')
          .select('id, description')
          .eq('screen_id', screenId);

        if (fetchCompsErr) throw fetchCompsErr;

        const idsToDelete = [savedScreen.id]; // Delete the parent screen component itself
        if (compsData) {
          compsData.forEach(comp => {
            try {
              if (comp.description && comp.description.trim().startsWith('{')) {
                const parsed = JSON.parse(comp.description);
                if (parsed && parsed.parent_screen_id === savedScreen.id) {
                  idsToDelete.push(comp.id);
                }
              }
            } catch (e) {
              // Ignore parse errors
            }
          });
        }

        // Delete all these components (cascade will delete fields/services)
        const { error: deleteErr } = await supabase
          .from('components')
          .delete()
          .in('id', idsToDelete);

        if (deleteErr) throw deleteErr;
      }

      // 3. Insert parent screen component
      const { data: insertedScreen, error: screenInsertErr } = await supabase
        .from('components')
        .insert({
          screen_id: screenId,
          name: savedScreen.name,
          description: 'SCREEN_PARENT',
          image_url: savedScreen.image,
        })
        .select()
        .single();

      if (screenInsertErr) throw screenInsertErr;
      const newScreenParentId = insertedScreen.id;

      // 4. Insert child components
      if (savedScreen.components && savedScreen.components.length > 0) {
        for (const comp of savedScreen.components) {
          const { data: insertedComp, error: compInsertErr } = await supabase
            .from('components')
            .insert({
              screen_id: screenId,
              name: comp.name,
              description: JSON.stringify({ parent_screen_id: newScreenParentId, description: comp.description }),
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
      }

      // 5. Update local state
      const updatedScreenObj = {
        ...savedScreen,
        id: newScreenParentId,
      };

      const exists = details.some((item) => item.id === savedScreen.id);
      let updatedDetails;
      if (exists) {
        updatedDetails = details.map((item) => (item.id === savedScreen.id ? updatedScreenObj : item));
      } else {
        updatedDetails = [...details, updatedScreenObj];
      }
      setDetails(updatedDetails);
      setActiveScreen(updatedScreenObj);

      alert('Tela gravada com sucesso no banco de dados!');
      fetchScreensList(); // refresh screens list dropdown
      
      return updatedScreenObj;
    } catch (err) {
      alert('Erro ao gravar tela: ' + err.message);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAllToSupabase = async () => {
    if (!screenName.trim()) {
      alert('Por favor, insira o nome da especificação.');
      return;
    }

    setIsSaving(true);
    try {
      let screenId = selectedScreenId;
      const imageValue = JSON.stringify(specFlows);

      // 1. Check if the screen already exists by ID or by name
      if (screenId) {
        // Update screen
        const { error: updateErr } = await supabase
          .from('screens')
          .update({ name: screenName, image_url: imageValue })
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
            .update({ image_url: imageValue })
            .eq('id', screenId);
          
          if (updateErr) throw updateErr;
        } else {
          // Insert new screen
          const { data: newScreen, error: insertErr } = await supabase
            .from('screens')
            .insert({ name: screenName, image_url: imageValue })
            .select()
            .single();
          
          if (insertErr) throw insertErr;
          screenId = newScreen.id;
          setSelectedScreenId(screenId);
        }
      }

      // Save author mapping if pending
      if (pendingAuthor) {
        const updatedAuthors = { ...specAuthors, [screenId]: pendingAuthor };
        setSpecAuthors(updatedAuthors);
        localStorage.setItem('spec_authors', JSON.stringify(updatedAuthors));
        setPendingAuthor('');
      }

      // Save description mapping
      const updatedDescriptions = { ...specDescriptions, [screenId]: specDescription };
      setSpecDescriptions(updatedDescriptions);
      localStorage.setItem('spec_descriptions', JSON.stringify(updatedDescriptions));

      // 2. Clean up existing components for this screen to perform a full overwrite
      const { error: deleteCompsErr } = await supabase
        .from('components')
        .delete()
        .eq('screen_id', screenId);

      if (deleteCompsErr) throw deleteCompsErr;

      // 3. Insert parent screens and child components and their fields and services
      for (const screenObj of details) {
        // 3.1 Insert parent screen
        const { data: insertedScreen, error: screenInsertErr } = await supabase
          .from('components')
          .insert({
            screen_id: screenId,
            name: screenObj.name,
            description: 'SCREEN_PARENT',
            image_url: screenObj.image,
          })
          .select()
          .single();

        if (screenInsertErr) throw screenInsertErr;
        const newScreenParentId = insertedScreen.id;

        // 3.2 Insert child components for this screen
        if (screenObj.components && screenObj.components.length > 0) {
          for (const comp of screenObj.components) {
            const { data: insertedComp, error: compInsertErr } = await supabase
              .from('components')
              .insert({
                screen_id: screenId,
                name: comp.name,
                description: JSON.stringify({ parent_screen_id: newScreenParentId, description: comp.description }),
                image_url: comp.image,
              })
              .select()
              .single();

            if (compInsertErr) throw compInsertErr;
            const newCompId = insertedComp.id;

            // Insert fields for child component
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

            // Insert services for child component
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

  const handleArchive = (id) => {
    setArchivedIds((prev) => [...prev, id]);
  };

  const handleUnarchive = (id) => {
    setArchivedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleEditScreen = async (id) => {
    await loadScreenData(id);
    setCurrentView('edit');
  };

  const handleViewScreen = async (id) => {
    await loadScreenData(id);
    setCurrentView('view');
  };

  const handleNewScreen = (name, author) => {
    setScreenName(name);
    setImage(null);
    setDetails([]);
    setSelectedScreenId('');
    setPendingAuthor(author);
    setCurrentView('edit');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">
      {/* Header com o nome "Especificação Técnica Alesp" e navegação */}
      {currentView !== 'landing' && (
        <Header currentView={currentView} setCurrentView={setCurrentView} />
      )}

      <main className={`mx-auto max-w-7xl px-6 ${currentView === 'home' || currentView === 'landing' ? 'py-10' : 'pt-3 pb-10'}`}>
        {/* Caminho de Pão (Breadcrumbs) */}
        {currentView !== 'home' && currentView !== 'landing' && (
          <nav className="mb-9 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <button
              onClick={() => setCurrentView('home')}
              className="font-medium hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Início
            </button>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            {currentView === 'edit' && (
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {screenName || 'Nova Especificação'}
              </span>
            )}
            {currentView === 'view' && (
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {screenName || 'Especificação'} (Visualizar)
              </span>
            )}
            {currentView === 'screen-editor' && (
              <>
                <button
                  onClick={() => setCurrentView('edit')}
                  className="font-medium hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {screenName || 'Especificação'}
                </button>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {activeScreen ? `Editar Tela: ${activeScreen.name}` : 'Adicionar Tela'}
                </span>
              </>
            )}
          </nav>
        )}

        {currentView === 'landing' ? (
          <LandingPage 
            onSelectAnalista={() => {
              setUserRole('analista');
              setCurrentView('home');
            }} 
            onSelectDesenvolvedor={() => {
              setUserRole('desenvolvedor');
              setCurrentView('home');
            }}
          />
        ) : currentView === 'home' ? (
          <SpecificationList
            screensList={screensList}
            onEdit={handleEditScreen}
            onView={handleViewScreen}
            onNew={handleNewScreen}
            onArchive={handleArchive}
            onUnarchive={handleUnarchive}
            archivedIds={archivedIds}
            isLoading={isLoading}
            specAuthors={specAuthors}
            isDeveloper={userRole === 'desenvolvedor'}
          />
        ) : currentView === 'view' ? (
          <ScreenViewer
            screensList={screensList}
            selectedScreenId={selectedScreenId}
            loadScreenData={loadScreenData}
            screenName={screenName}
            image={image}
            details={details}
            isLoading={isLoading}
            specDescription={specDescription}
            specFlows={specFlows}
            specAuthors={specAuthors}
          />
        ) : currentView === 'screen-editor' ? (
          <ScreenEditor
            screen={activeScreen}
            onSave={handleSaveScreen}
            onBack={() => setCurrentView('edit')}
            isSaving={isSaving}
          />
        ) : (
          <>
            {/* Page Title & Loader/Controls */}
            <div className="mb-8 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Editar Especificação
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Gerencie os detalhes, descrição, fluxos e detalhamento de telas desta especificação técnica.
                  </p>
                </div>

                {/* Load Spec Selector */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-450">
                    Carregar Especificação:
                  </label>
                  <select
                    value={selectedScreenId}
                    onChange={(e) => loadScreenData(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <option value="">-- Nova Especificação --</option>
                    {screensList.map((screen) => (
                      <option key={screen.id} value={screen.id}>
                        {screen.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Specification Metadata Grid (Nome, Data Criacao, Autor) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {/* Nome da Especificação */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-400">
                    Nome da Especificação
                  </label>
                  <input
                    type="text"
                    placeholder="Nome da Especificação (ex: Login, Dashboard)"
                    value={screenName}
                    onChange={(e) => setScreenName(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-955/60 dark:text-slate-200"
                  />
                </div>

                {/* Data de Criação */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                    Data de Criação
                  </label>
                  <input
                    type="text"
                    value={
                      selectedScreenId
                        ? new Date(screensList.find((s) => s.id === selectedScreenId)?.created_at || Date.now()).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : new Date().toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                    }
                    disabled
                    className="rounded-xl border border-slate-250 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-450 outline-none cursor-not-allowed dark:border-slate-800 dark:bg-slate-850 dark:text-slate-500"
                  />
                </div>

                {/* Autor */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-400">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={
                      selectedScreenId
                        ? specAuthors[selectedScreenId] || 'Rodolfo Rodrigues'
                        : pendingAuthor || 'Rodolfo Rodrigues'
                    }
                    disabled
                    className="rounded-xl border border-slate-250 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-455 outline-none cursor-not-allowed dark:border-slate-800 dark:bg-slate-855 dark:text-slate-500"
                  />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-650"></div>
                <p className="text-sm font-medium text-slate-500">Carregando especificações do Supabase...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* 2 - Campo de Descrição da Especificação */}
                <div className="space-y-3">
                  <label className="font-display text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                    Descrição da Especificação
                  </label>
                  <textarea
                    placeholder="Escreva uma descrição detalhada dos objetivos desta especificação técnica..."
                    value={specDescription}
                    onChange={(e) => setSpecDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>

                {/* 3 - Galeria de Fluxos Propostos */}
                <div className="space-y-3">
                  <label className="font-display text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                    Fluxos Propostos
                  </label>
                  <FlowsGallery flows={specFlows} onChange={setSpecFlows} />
                </div>

                {/* 4 & 5 - Seção Detalhamento das Telas e Lista de Telas */}
                <ScreensListSection
                  screens={details}
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

      {/* Delete Screen Confirmation Modal */}
      {screenToDelete !== null && (
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
                Tem certeza que deseja excluir essa tela?
              </h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Esta ação irá remover permanentemente a tela e todos os seus detalhamentos de componentes associados da especificação técnica.
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setScreenToDelete(null)}
                className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-200 active:scale-95 transition-all cursor-pointer"
              >
                Não
              </button>
              <button
                type="button"
                onClick={confirmDeleteScreen}
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
