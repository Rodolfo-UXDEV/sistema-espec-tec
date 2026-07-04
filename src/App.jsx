import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ScreensListSection from './components/ScreensListSection';
import ComponentModal from './components/ComponentModal';
import ScreenViewer from './components/ScreenViewer';
import SpecificationList from './components/SpecificationList';
import FlowsGallery from './components/FlowsGallery';
import ScreenEditor from './components/ScreenEditor';
import ScreenReadOnlyView from './components/ScreenReadOnlyView';
import LandingPage from './components/LandingPage';
import EvidenceModal from './components/EvidenceModal';
import FunctionalRequirementsSection from './components/FunctionalRequirementsSection';
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
  const [projectsList, setProjectsList] = useState([]);
  const [specProjectId, setSpecProjectId] = useState(null);

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

  // Spec Figma URL states
  const [specFigmaUrl, setSpecFigmaUrl] = useState('');
  const [specFigmaUrls, setSpecFigmaUrls] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('spec_figma_urls') || '{}');
    } catch {
      return {};
    }
  });

  // Spec criteria states
  const [specCriteria, setSpecCriteria] = useState([]);
  const [specCriteriaMap, setSpecCriteriaMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('spec_criteria') || '{}');
    } catch {
      return {};
    }
  });

  // Spec business rules states
  const [specBusinessRules, setSpecBusinessRules] = useState([]);
  const [specBusinessRulesMap, setSpecBusinessRulesMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('spec_business_rules') || '{}');
    } catch {
      return {};
    }
  });
  const [isBusinessRulesExpanded, setIsBusinessRulesExpanded] = useState(false);

  // Spec functional requirements states
  const [specFunctionalRequirements, setSpecFunctionalRequirements] = useState([]);
  const [specFunctionalRequirementsMap, setSpecFunctionalRequirementsMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('spec_functional_requirements') || '{}');
    } catch {
      return {};
    }
  });
  const [isFunctionalRequirementsExpanded, setIsFunctionalRequirementsExpanded] = useState(false);

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

  // Evidence Modal states
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceModalMode, setEvidenceModalMode] = useState('edit'); // 'edit' or 'view'
  const [activeCriterionIndex, setActiveCriterionIndex] = useState(null);

  // Save Confirmation / Success Modal states
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);

  const fetchProjectsList = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');
      if (error) throw error;
      setProjectsList(data || []);
    } catch (e) {
      console.error('Erro ao buscar projetos:', e);
    }
  };

  const handleNewProject = async (name, description) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({ name, description })
        .select()
        .single();
      if (error) throw error;
      await fetchProjectsList();
      return data;
    } catch (err) {
      alert('Erro ao criar projeto: ' + err.message);
      return null;
    }
  };

  const handleAssociateSpecsToProject = async (projectId, specIds) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('screens')
        .update({ project_id: projectId })
        .in('id', specIds);
      if (error) throw error;
      await fetchScreensList();
    } catch (err) {
      alert('Erro ao associar especificações: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch screens and projects on mount and view changes
  useEffect(() => {
    if (currentView === 'home' || currentView === 'edit') {
      fetchScreensList();
      fetchProjectsList();
    }
  }, [currentView]);

  // Security guard for Developer role: redirect if they try to access edit views
  useEffect(() => {
    if (userRole === 'desenvolvedor' && currentView === 'edit') {
      setCurrentView('home');
    }
  }, [userRole, currentView]);

  const fetchScreensList = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch screens
      const { data: screensData, error: screensErr } = await supabase
        .from('screens')
        .select('id, name, created_at, author, description, project_id')
        .order('name');
      
      if (screensErr) throw screensErr;

      if (screensData) {
        // Build author and description mappings dynamically from DB
        const loadedAuthors = {};
        const loadedDescriptions = {};
        screensData.forEach(screen => {
          if (screen.author) {
            loadedAuthors[screen.id] = screen.author;
          }
          if (screen.description) {
            loadedDescriptions[screen.id] = screen.description;
          }
        });

        const storedAuthors = JSON.parse(localStorage.getItem('spec_authors') || '{}');
        const storedDescriptions = JSON.parse(localStorage.getItem('spec_descriptions') || '{}');

        setSpecAuthors({ ...storedAuthors, ...loadedAuthors });
        setSpecDescriptions({ ...storedDescriptions, ...loadedDescriptions });

        // 2. Fetch all components to compute specification progress
        const { data: allComps, error: compsErr } = await supabase
          .from('components')
          .select('id, screen_id, description');

        if (compsErr) throw compsErr;

        // Group components by screen_id and calculate progress for each specification
        const screensWithProgress = screensData.map(screen => {
          const comps = allComps ? allComps.filter(c => c.screen_id === screen.id) : [];
          
          let total = 0;
          let completed = 0;

          comps.forEach(comp => {
            let parentScreenId = null;
            let status = 'não desenvolvido';
            try {
              if (comp.description && comp.description.trim().startsWith('{')) {
                const parsed = JSON.parse(comp.description);
                if (parsed && parsed.parent_screen_id) {
                  parentScreenId = parsed.parent_screen_id;
                  status = parsed.status || 'não desenvolvido';
                }
              }
            } catch (e) {}

            if (parentScreenId) {
              total++;
              if (status === 'concluido') {
                completed++;
              }
            }
          });

          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
          return {
            ...screen,
            progress
          };
        });

        setScreensList(screensWithProgress);
      }
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
      setSpecCriteria([]);
      setSpecFigmaUrl('');
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
      setSpecProjectId(screenData.project_id || null);

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
      if (screenData.description) {
        setSpecDescription(screenData.description);
      } else {
        const storedDescriptions = JSON.parse(localStorage.getItem('spec_descriptions') || '{}');
        setSpecDescription(storedDescriptions[id] || '');
      }

      // Load author
      let loadedAuthor = 'Rodolfo Rodrigues';
      if (screenData.author) {
        loadedAuthor = screenData.author;
      } else {
        const storedAuthors = JSON.parse(localStorage.getItem('spec_authors') || '{}');
        loadedAuthor = storedAuthors[id] || 'Rodolfo Rodrigues';
      }
      setSpecAuthors(prev => ({ ...prev, [id]: loadedAuthor }));

      // Load criteria
      if (screenData.criteria) {
        try {
          setSpecCriteria(JSON.parse(screenData.criteria));
        } catch (e) {
          console.error("Erro ao fazer parse dos critérios do Supabase:", e);
          const storedCriteria = JSON.parse(localStorage.getItem('spec_criteria') || '{}');
          setSpecCriteria(storedCriteria[id] || []);
        }
      } else {
        const storedCriteria = JSON.parse(localStorage.getItem('spec_criteria') || '{}');
        setSpecCriteria(storedCriteria[id] || []);
      }

      // Load figma_url
      if (screenData.figma_url) {
        setSpecFigmaUrl(screenData.figma_url);
      } else {
        const storedFigmaUrls = JSON.parse(localStorage.getItem('spec_figma_urls') || '{}');
        setSpecFigmaUrl(storedFigmaUrls[id] || '');
      }

      // Load business rules
      if (screenData.business_rules) {
        try {
          setSpecBusinessRules(JSON.parse(screenData.business_rules));
        } catch (e) {
          console.error("Erro ao fazer parse das regras de negócios do Supabase:", e);
          const storedRules = JSON.parse(localStorage.getItem('spec_business_rules') || '{}');
          setSpecBusinessRules(storedRules[id] || []);
        }
      } else {
        const storedRules = JSON.parse(localStorage.getItem('spec_business_rules') || '{}');
        setSpecBusinessRules(storedRules[id] || []);
      }

      // Load functional requirements
      if (screenData.functional_requirements) {
        try {
          setSpecFunctionalRequirements(JSON.parse(screenData.functional_requirements));
        } catch (e) {
          console.error("Erro ao fazer parse dos requisitos funcionais do Supabase:", e);
          const storedReqs = JSON.parse(localStorage.getItem('spec_functional_requirements') || '{}');
          setSpecFunctionalRequirements(storedReqs[id] || []);
        }
      } else {
        const storedReqs = JSON.parse(localStorage.getItem('spec_functional_requirements') || '{}');
        setSpecFunctionalRequirements(storedReqs[id] || []);
      }

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
        let status = 'não desenvolvido';
        let change_history = [];
        let criteria = [];
        let functionalRequirements = [];
        let flows = [];
        try {
          if (comp.description && comp.description.trim().startsWith('{')) {
            const parsed = JSON.parse(comp.description);
            if (parsed && parsed.parent_screen_id) {
              parentScreenId = parsed.parent_screen_id;
              actualDescription = parsed.description || '';
              status = parsed.status || 'não desenvolvido';
              change_history = parsed.change_history || [];
            } else if (parsed && parsed.type === 'SCREEN_PARENT') {
              actualDescription = parsed.description || '';
              criteria = parsed.criteria || [];
              functionalRequirements = parsed.functionalRequirements || [];
              flows = parsed.flows || [];
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
          status,
          change_history,
          criteria,
          functionalRequirements,
          flows,
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
          criteria: screen.criteria || [],
          functionalRequirements: screen.functionalRequirements || [],
          flows: screen.flows || [],
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

      // 0. Build a status/history map of existing components in the database to preserve them
      const statusMap = {};
      if (screenId) {
        try {
          const { data: dbComps } = await supabase
            .from('components')
            .select('id, name, description')
            .eq('screen_id', screenId);
          
          if (dbComps) {
            // Find parent screen IDs and their names
            const parentMap = {};
            dbComps.forEach(c => {
              if (c.description === 'SCREEN_PARENT') {
                parentMap[c.id] = c.name;
              }
            });

            // Build statusMap: Key is "ParentScreenName::ComponentName"
            dbComps.forEach(c => {
              if (c.description && c.description.trim().startsWith('{')) {
                try {
                  const parsed = JSON.parse(c.description);
                  const parentName = parentMap[parsed.parent_screen_id] || '';
                  const key = `${parentName}::${c.name}`;
                  statusMap[key] = {
                    status: parsed.status,
                    change_history: parsed.change_history
                  };
                } catch (e) {
                  // Ignore JSON parse errors
                }
              }
            });
          }
        } catch (e) {
          console.error('Erro ao mapear status existentes:', e);
        }
      }

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
            .insert({ name: screenName, image_url: JSON.stringify(specFlows), project_id: specProjectId })
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
          .update({ name: screenName, image_url: JSON.stringify(specFlows), project_id: specProjectId })
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
          description: JSON.stringify({
            type: 'SCREEN_PARENT',
            description: savedScreen.description || '',
            criteria: savedScreen.criteria || [],
            functionalRequirements: savedScreen.functionalRequirements || [],
            flows: savedScreen.flows || []
          }),
          image_url: savedScreen.image,
        })
        .select()
        .single();

      if (screenInsertErr) throw screenInsertErr;
      const newScreenParentId = insertedScreen.id;

      // 4. Insert child components
      if (savedScreen.components && savedScreen.components.length > 0) {
        for (const comp of savedScreen.components) {
          const key = `${savedScreen.name}::${comp.name}`;
          const preserved = statusMap[key] || {};
          const status = comp.status || preserved.status || 'não desenvolvido';
          const change_history = comp.change_history || preserved.change_history || [];

          const { data: insertedComp, error: compInsertErr } = await supabase
            .from('components')
            .insert({
              screen_id: screenId,
              name: comp.name,
              description: JSON.stringify({ 
                parent_screen_id: newScreenParentId, 
                description: comp.description,
                status,
                change_history
              }),
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
        criteria: savedScreen.criteria || []
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

      fetchScreensList(); // refresh screens list dropdown
      
      return updatedScreenObj;
    } catch (err) {
      alert('Erro ao gravar tela: ' + err.message);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAllToSupabase = () => {
    if (!screenName.trim()) {
      alert('Por favor, insira o nome da especificação.');
      return;
    }
    setShowSaveConfirmModal(true);
  };

  const executeSaveAllToSupabase = async () => {
    setIsSaving(true);
    try {
      let screenId = selectedScreenId;

      // 0. Build a status/history map of existing components in the database to preserve them
      const statusMap = {};
      if (screenId) {
        try {
          const { data: dbComps } = await supabase
            .from('components')
            .select('id, name, description')
            .eq('screen_id', screenId);
          
          if (dbComps) {
            // Find parent screen IDs and their names
            const parentMap = {};
            dbComps.forEach(c => {
              if (c.description === 'SCREEN_PARENT') {
                parentMap[c.id] = c.name;
              }
            });

            // Build statusMap: Key is "ParentScreenName::ComponentName"
            dbComps.forEach(c => {
              if (c.description && c.description.trim().startsWith('{')) {
                try {
                  const parsed = JSON.parse(c.description);
                  const parentName = parentMap[parsed.parent_screen_id] || '';
                  const key = `${parentName}::${c.name}`;
                  statusMap[key] = {
                    status: parsed.status,
                    change_history: parsed.change_history
                  };
                } catch (e) {
                  // Ignore JSON parse errors
                }
              }
            });
          }
        } catch (e) {
          console.error('Erro ao mapear status existentes:', e);
        }
      }

      const imageValue = JSON.stringify(specFlows);

      // 1. Check if the screen already exists by ID or by name
      if (screenId) {
        // Update screen
        const { error: updateErr } = await supabase
          .from('screens')
          .update({
            name: screenName,
            image_url: imageValue,
            criteria: JSON.stringify(specCriteria),
            figma_url: specFigmaUrl,
            description: specDescription,
            author: specAuthors[screenId] || pendingAuthor || 'Rodolfo Rodrigues',
            business_rules: JSON.stringify(specBusinessRules),
            functional_requirements: JSON.stringify(specFunctionalRequirements),
            project_id: specProjectId
          })
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
            .update({
              image_url: imageValue,
              criteria: JSON.stringify(specCriteria),
              figma_url: specFigmaUrl,
              description: specDescription,
              author: specAuthors[screenId] || pendingAuthor || 'Rodolfo Rodrigues',
              business_rules: JSON.stringify(specBusinessRules),
              functional_requirements: JSON.stringify(specFunctionalRequirements),
              project_id: specProjectId
            })
            .eq('id', screenId);
          
          if (updateErr) throw updateErr;
        } else {
          // Insert new screen
          const { data: newScreen, error: insertErr } = await supabase
            .from('screens')
            .insert({
              name: screenName,
              image_url: imageValue,
              criteria: JSON.stringify(specCriteria),
              figma_url: specFigmaUrl,
              description: specDescription,
              author: pendingAuthor || 'Rodolfo Rodrigues',
              business_rules: JSON.stringify(specBusinessRules),
              functional_requirements: JSON.stringify(specFunctionalRequirements),
              project_id: specProjectId
            })
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

      // Save figma URL mapping
      const updatedFigmaUrls = { ...specFigmaUrls, [screenId]: specFigmaUrl };
      setSpecFigmaUrls(updatedFigmaUrls);
      localStorage.setItem('spec_figma_urls', JSON.stringify(updatedFigmaUrls));

      // Save criteria mapping
      const updatedCriteria = { ...specCriteriaMap, [screenId]: specCriteria };
      setSpecCriteriaMap(updatedCriteria);
      localStorage.setItem('spec_criteria', JSON.stringify(updatedCriteria));

      // Save business rules mapping
      const updatedRules = { ...specBusinessRulesMap, [screenId]: specBusinessRules };
      setSpecBusinessRulesMap(updatedRules);
      localStorage.setItem('spec_business_rules', JSON.stringify(updatedRules));

      // Save functional requirements mapping
      const updatedReqs = { ...specFunctionalRequirementsMap, [screenId]: specFunctionalRequirements };
      setSpecFunctionalRequirementsMap(updatedReqs);
      localStorage.setItem('spec_functional_requirements', JSON.stringify(updatedReqs));

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
            description: JSON.stringify({
              type: 'SCREEN_PARENT',
              description: screenObj.description || '',
              criteria: screenObj.criteria || [],
              functionalRequirements: screenObj.functionalRequirements || [],
              flows: screenObj.flows || []
            }),
            image_url: screenObj.image,
          })
          .select()
          .single();

        if (screenInsertErr) throw screenInsertErr;
        const newScreenParentId = insertedScreen.id;

        // 3.2 Insert child components for this screen
        if (screenObj.components && screenObj.components.length > 0) {
          for (const comp of screenObj.components) {
            const key = `${screenObj.name}::${comp.name}`;
            const preserved = statusMap[key] || {};
            const status = comp.status || preserved.status || 'não desenvolvido';
            const change_history = comp.change_history || preserved.change_history || [];

            const { data: insertedComp, error: compInsertErr } = await supabase
              .from('components')
              .insert({
                screen_id: screenId,
                name: comp.name,
                description: JSON.stringify({ 
                  parent_screen_id: newScreenParentId, 
                  description: comp.description,
                  status,
                  change_history
                }),
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

      setShowSaveSuccessModal(true);
      fetchScreensList(); // refresh screens list dropdown
    } catch (err) {
      alert('Erro ao salvar especificações: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCriterion = () => {
    const nextNum = specCriteria.length + 1;
    const newCriterion = {
      id: `new-${Date.now()}-${Math.random()}`,
      customId: `CA-${String(nextNum).padStart(2, '0')}`,
      criterion: '',
      status: 'Pendente',
      responsible: '',
      evidence: ''
    };
    setSpecCriteria([...specCriteria, newCriterion]);
  };

  const handleUpdateCriterion = (index, field, value) => {
    setSpecCriteria(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleRemoveCriterion = (index) => {
    setSpecCriteria(prev => {
      const filtered = prev.filter((_, idx) => idx !== index);
      return filtered.map((item, idx) => {
        if (item.customId.startsWith('CA-')) {
          return { ...item, customId: `CA-${String(idx + 1).padStart(2, '0')}` };
        }
        return item;
      });
    });
  };

  const handleAddBusinessRule = () => {
    const nextNum = specBusinessRules.length + 1;
    const newRule = {
      id: `rule-${Date.now()}-${Math.random()}`,
      customId: `RN-${String(nextNum).padStart(2, '0')}`,
      name: '',
      description: '',
    };
    setSpecBusinessRules([...specBusinessRules, newRule]);
  };

  const handleUpdateBusinessRule = (index, field, value) => {
    setSpecBusinessRules(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleRemoveBusinessRule = (index) => {
    setSpecBusinessRules(prev => {
      const filtered = prev.filter((_, idx) => idx !== index);
      return filtered.map((item, idx) => ({
        ...item,
        customId: `RN-${String(idx + 1).padStart(2, '0')}`
      }));
    });
  };

  const handleOpenRegisterEvidence = (index) => {
    setActiveCriterionIndex(index);
    setEvidenceModalMode('edit');
    setIsEvidenceModalOpen(true);
  };

  const handleOpenViewEvidence = (index) => {
    setActiveCriterionIndex(index);
    setEvidenceModalMode('view');
    setIsEvidenceModalOpen(true);
  };

  const handleSaveEvidence = (evidenceValue) => {
    if (activeCriterionIndex !== null) {
      handleUpdateCriterion(activeCriterionIndex, 'evidence', evidenceValue);
    }
    setIsEvidenceModalOpen(false);
  };

  const handleExportPDF = () => {
    if (!screenName.trim()) {
      alert('Por favor, defina o nome da especificação primeiro.');
      return;
    }

    const downloadPDF = () => {
      const author = selectedScreenId
        ? specAuthors[selectedScreenId] || 'Rodolfo Rodrigues'
        : pendingAuthor || 'Rodolfo Rodrigues';

      const rawDate = selectedScreenId
        ? screensList.find((s) => s.id === selectedScreenId)?.created_at
        : null;
      const dateStr = rawDate
        ? new Date(rawDate).toLocaleDateString('pt-BR', {
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
          });

      // Construct HTML Content for PDF
      let htmlContent = `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1e293b; line-height: 1.5; padding: 20px; font-size: 14px;">
          <style>
            h1, h2, h3, h4 { color: #0f172a; font-weight: 700; margin-top: 0; }
            h1 { font-size: 28px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; }
            h2 { font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 30px; margin-bottom: 14px; }
            h3 { font-size: 15px; margin-top: 20px; margin-bottom: 10px; color: #1e1b4b; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; background-color: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .meta-item { font-size: 12px; }
            .meta-label { font-weight: 700; text-transform: uppercase; font-size: 10px; color: #64748b; margin-bottom: 2px; }
            .meta-value { font-weight: 500; color: #334155; }
            .section { margin-bottom: 24px; }
            .section p { margin: 0 0 12px 0; white-space: pre-wrap; }
            .image-gallery { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px; }
            .image-gallery img { max-width: 100%; max-height: 200px; object-fit: contain; border: 1px solid #e2e8f0; border-radius: 6px; padding: 3px; background-color: #f8fafc; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; font-size: 12px; table-layout: fixed; }
            th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #e2e8f0; vertical-align: top; word-break: break-word; overflow-wrap: break-word; }
            th { background-color: #f1f5f9; color: #475569; font-weight: 600; text-transform: uppercase; font-size: 10px; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 9999px; font-size: 10px; font-weight: 600; text-transform: uppercase; }
            .badge-pendente { background-color: #fef3c7; color: #d97706; }
            .badge-emdesenvolvimento { background-color: #dbeafe; color: #2563eb; }
            .badge-concluído, .badge-concluido { background-color: #dcfce7; color: #16a34a; }
            .badge-bloqueado { background-color: #fee2e2; color: #dc2626; }
            .page-break { page-break-before: always; }
            .avoid-break { page-break-inside: avoid; }
            * { box-sizing: border-box; }
          </style>
          
          <h1>Especificação Técnica</h1>
          
          <div class="meta-grid">
            <div class="meta-item">
              <div class="meta-label">Nome da Especificação</div>
              <div class="meta-value">${screenName}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Autor</div>
              <div class="meta-value">${author}</div>
            </div>
            <div class="meta-item" style="grid-column: span 2;">
              <div class="meta-label">Data de Criação</div>
              <div class="meta-value">${dateStr}</div>
            </div>
          </div>

           <div class="section">
             <h2>Descrição Geral</h2>
             <p>${specDescription || 'Sem descrição cadastrada.'}</p>
           </div>
         `;

      if (specBusinessRules && specBusinessRules.length > 0) {
        htmlContent += `
          <div class="section avoid-break">
            <h2>Regras de Negócios</h2>
            <table>
              <thead>
                <tr>
                  <th style="width: 15%;">Nº REGRA</th>
                  <th style="width: 25%;">NOME DA REGRA</th>
                  <th style="width: 60%;">DESCRIÇÃO DA REGRA</th>
                </tr>
              </thead>
              <tbody>
                ${specBusinessRules
                  .map(
                    (r, index) => `
                  <tr>
                    <td><strong>${r.customId || `RN-${String(index + 1).padStart(2, '0')}`}</strong></td>
                    <td><strong>${r.name || ''}</strong></td>
                    <td>${r.description || ''}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        `;
      }

      if (specFunctionalRequirements && specFunctionalRequirements.length > 0) {
        htmlContent += `
          <div class="section avoid-break">
            <h2>Requisitos Funcionais</h2>
            <table>
              <thead>
                <tr>
                  <th style="width: 15%;">Nº REQUISITO</th>
                  <th style="width: 25%;">NOME DO REQUISITO</th>
                  <th style="width: 60%;">DESCRIÇÃO DO REQUISITO</th>
                </tr>
              </thead>
              <tbody>
                ${specFunctionalRequirements
                  .map(
                    (r, index) => `
                  <tr>
                    <td><strong>${r.customId || `RF-${String(index + 1).padStart(2, '0')}`}</strong></td>
                    <td><strong>${r.name || ''}</strong></td>
                    <td>${r.description || ''}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        `;
      }

      if (specFlows && specFlows.length > 0) {
        htmlContent += `
          <div class="section">
            <h2>Fluxos Propostos</h2>
            <div class="image-gallery">
              ${specFlows.map((flow) => `<img src="${flow}" alt="Fluxo Proposto">`).join('')}
            </div>
          </div>
        `;
      }

      if (specFigmaUrl) {
        htmlContent += `
          <div class="section">
            <h2>Design do Figma</h2>
            <p><a href="${specFigmaUrl}" target="_blank" style="color: #4f46e5; text-decoration: underline; font-weight: bold;">${specFigmaUrl}</a></p>
          </div>
        `;
      }

      htmlContent += `
        <div class="section">
          <h2>Critérios de Aceite</h2>
          ${
            specCriteria.length === 0
              ? '<p>Nenhum critério de aceite cadastrado.</p>'
              : `
              <table>
                <thead>
                  <tr>
                    <th style="width: 12%;">ID</th>
                    <th style="width: 43%;">CRITÉRIO</th>
                    <th style="width: 15%;">STATUS</th>
                    <th style="width: 15%;">RESPONSÁVEL</th>
                    <th style="width: 15%;">EVIDÊNCIA</th>
                  </tr>
                </thead>
                <tbody>
                  ${specCriteria
                    .map(
                      (c) => `
                    <tr>
                      <td><strong>${c.customId || ''}</strong></td>
                      <td>${c.criterion || ''}</td>
                      <td>
                        <span class="badge badge-${(c.status || 'Pendente')
                          .toLowerCase()
                          .replace(/\s+/g, '')}">${c.status || 'Pendente'}</span>
                      </td>
                      <td>${c.responsible || ''}</td>
                      <td>${(() => {
                        if (!c.evidence) return '-';
                        try {
                          if (c.evidence.startsWith('{')) {
                            const parsed = JSON.parse(c.evidence);
                            let content = parsed.description || '';
                            if (parsed.image) {
                              content += `<div style="margin-top: 5px;"><img src="${parsed.image}" style="max-height: 60px; max-width: 100%; border-radius: 4px; border: 1px solid #e2e8f0;"/></div>`;
                            }
                            return content || '-';
                          }
                          return c.evidence;
                        } catch (e) {
                          return c.evidence;
                        }
                      })()}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            `
          }
        </div>
      `;

      if (details && details.length > 0) {
        htmlContent += `<h2>Detalhamento das Telas</h2>`;
        
        details.forEach((screen, screenIndex) => {
          htmlContent += `
            <div class="section page-break">
              <h3 style="font-size: 18px; border-bottom: 2px solid #818cf8; padding-bottom: 5px; margin-bottom: 12px;">
                Tela ${screenIndex + 1}: ${screen.name}
              </h3>
              <p><strong>Descrição da Tela:</strong> ${screen.description || 'Sem descrição cadastrada.'}</p>
          `;

          if (screen.image) {
            htmlContent += `
              <div style="margin-bottom: 20px;">
                <strong>Mock-up da Tela:</strong><br/>
                <img src="${screen.image}" alt="${screen.name}" style="max-width: 100%; max-height: 300px; margin-top: 8px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 3px;">
              </div>
            `;
          }

          if (screen.flows && screen.flows.length > 0) {
            htmlContent += `
              <div style="margin-bottom: 20px;">
                <strong>Fluxo de Tela:</strong><br/>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px;">
                  ${screen.flows
                    .map(
                      (flow, idx) => `
                    <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 2px; background-color: #ffffff;">
                      <img src="${flow}" alt="Fluxo ${idx + 1}" style="max-height: 120px; object-fit: contain;">
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>
            `;
          }

          if (screen.functionalRequirements && screen.functionalRequirements.length > 0) {
            htmlContent += `
              <div style="margin-bottom: 20px;">
                <strong>Requisitos Funcionais da Tela:</strong>
                <table style="width: 100%; border-collapse: collapse; margin-top: 8px; border: 1px solid #e2e8f0;">
                  <thead>
                    <tr style="background-color: #f8fafc;">
                      <th style="width: 20%; text-align: left; padding: 8px; font-size: 11px; border-bottom: 1.5px solid #cbd5e1; font-weight: 700; color: #475569;">Nº REQUISITO</th>
                      <th style="width: 30%; text-align: left; padding: 8px; font-size: 11px; border-bottom: 1.5px solid #cbd5e1; font-weight: 700; color: #475569;">NOME</th>
                      <th style="width: 50%; text-align: left; padding: 8px; font-size: 11px; border-bottom: 1.5px solid #cbd5e1; font-weight: 700; color: #475569;">DESCRIÇÃO</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${screen.functionalRequirements
                      .map(
                        (r) => `
                      <tr>
                        <td style="padding: 8px; font-size: 11px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #334155;">${r.customId || ''}</td>
                        <td style="padding: 8px; font-size: 11px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${r.name || ''}</td>
                        <td style="padding: 8px; font-size: 11px; border-bottom: 1px solid #e2e8f0; color: #475569;">${r.description || ''}</td>
                      </tr>
                    `
                      )
                      .join('')}
                  </tbody>
                </table>
              </div>
            `;
          }

          if (screen.components && screen.components.length > 0) {
            htmlContent += `<h4>Componentes da Tela</h4>`;
            
            screen.components.forEach((comp) => {
              htmlContent += `
                <div style="margin-bottom: 24px; padding: 12px; border: 1px dashed #cbd5e1; border-radius: 8px; background-color: #fafafa;">
                  <h5 style="font-size: 13px; margin: 0 0 6px 0; color: #1e1b4b; font-weight: 700;">
                    Componente: ${comp.name}
                  </h5>
                  <p style="font-size: 12px; margin-bottom: 10px;"><strong>Descrição:</strong> ${comp.description || 'Sem descrição.'}</p>
              `;

              if (comp.image) {
                htmlContent += `
                  <div style="margin-bottom: 12px;">
                    <img src="${comp.image}" alt="${comp.name}" style="max-height: 120px; border: 1px solid #e2e8f0; border-radius: 4px;">
                  </div>
                `;
              }

              if (comp.fields && comp.fields.length > 0) {
                htmlContent += `
                  <div style="margin-top: 10px;">
                    <strong style="font-size: 10px; text-transform: uppercase; color: #64748b;">Campos e Validações</strong>
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 20%;">Nome do Campo</th>
                          <th style="width: 30%;">Descrição</th>
                          <th style="width: 10%; text-align: center;">Obrigatório</th>
                          <th style="width: 15%;">Formato</th>
                          <th style="width: 25%;">Regras de Validação</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${comp.fields
                          .map(
                            (f) => `
                          <tr>
                            <td><strong>${f.fieldName || ''}</strong></td>
                            <td>${f.description || ''}</td>
                            <td style="text-align: center;">${f.required ? 'Sim' : 'Não'}</td>
                            <td>${f.format || ''}</td>
                            <td>${f.validationRules || ''}</td>
                          </tr>
                        `
                          )
                          .join('')}
                      </tbody>
                    </table>
                  </div>
                `;
              }

              if (comp.services && comp.services.length > 0) {
                htmlContent += `
                  <div style="margin-top: 10px;">
                    <strong style="font-size: 10px; text-transform: uppercase; color: #64748b;">Serviços de Integração</strong>
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 10%;">ID</th>
                          <th style="width: 12%;">Método / Tipo</th>
                          <th style="width: 28%;">Endpoint / Tópico / Arquivo</th>
                          <th style="width: 20%;">Descrição</th>
                          <th style="width: 15%;">Request</th>
                          <th style="width: 15%;">Response</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${comp.services
                          .map(
                            (s) => `
                          <tr>
                            <td><strong>${s.serviceId || ''}</strong></td>
                            <td>${s.method || ''}</td>
                            <td style="word-break: break-all;">${s.endpoint || ''}</td>
                            <td>${s.description || ''}</td>
                            <td style="font-family: monospace; white-space: pre-wrap; word-break: break-word;">${s.request || '-'}</td>
                            <td style="font-family: monospace; white-space: pre-wrap; word-break: break-word;">${s.response || '-'}</td>
                          </tr>
                        `
                          )
                          .join('')}
                      </tbody>
                    </table>
                  </div>
                `;
              }

              htmlContent += `</div>`;
            });
          }

          htmlContent += `</div>`;
        });
      }

      htmlContent += `</div>`;

      // Create a wrapper that is absolute and hidden off-screen to prevent scroll offset issues
      const wrapper = document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.style.top = '0';
      wrapper.style.left = '-9999px';
      wrapper.style.width = '1020px';
      wrapper.style.height = '1px';
      wrapper.style.overflow = 'hidden';
      wrapper.style.zIndex = '-9999';
      wrapper.style.opacity = '0.01';
      
      // Create the content container that we pass to html2pdf (no positioning inline style!)
      const tempContainer = document.createElement('div');
      tempContainer.style.width = '1020px';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.innerHTML = htmlContent;
      
      wrapper.appendChild(tempContainer);
      document.body.appendChild(wrapper);

      // Wait for all images in the container to load
      const images = tempContainer.getElementsByTagName('img');
      const promises = Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // resolve anyway on error to avoid blocking forever
        });
      });

      Promise.all(promises).then(() => {
        const filename = `Especificacao_Tecnica_${screenName.trim().replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        const options = {
          margin: 10,
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0, scrollX: 0 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
          pagebreak: { mode: ['avoid-all', 'css'] }
        };

        window.html2pdf()
          .set(options)
          .from(tempContainer)
          .save()
          .then(() => {
            document.body.removeChild(wrapper);
          })
          .catch((err) => {
            console.error('Erro ao gerar PDF:', err);
            document.body.removeChild(wrapper);
          });
      });
    };

    // Load html2pdf dynamically if it is not present in window
    if (!window.html2pdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = downloadPDF;
      script.onerror = () => alert('Erro ao carregar biblioteca de exportação de PDF. Verifique sua conexão.');
      document.body.appendChild(script);
    } else {
      downloadPDF();
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

  const handleNewScreen = (name, author, projectId = null) => {
    setScreenName(name);
    setImage(null);
    setDetails([]);
    setSelectedScreenId('');
    setPendingAuthor(author);
    setSpecProjectId(projectId);
    setSpecFlows([]);
    setSpecDescription('');
    setSpecCriteria([]);
    setSpecFigmaUrl('');
    setSpecBusinessRules([]);
    setIsBusinessRulesExpanded(false);
    setSpecFunctionalRequirements([]);
    setIsFunctionalRequirementsExpanded(false);
    setCurrentView('edit');
  };

  const totalComponents = details ? details.reduce((acc, screen) => acc + (screen.components ? screen.components.length : 0), 0) : 0;
  const completedComponents = details ? details.reduce((acc, screen) => {
    if (!screen.components) return acc;
    return acc + screen.components.filter(c => c.status === 'concluido').length;
  }, 0) : 0;
  const completionPercentage = totalComponents > 0 ? Math.round((completedComponents / totalComponents) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">
      {/* Header com o nome "Especificação Técnica Alesp" e navegação */}
      {currentView !== 'landing' && (
        <Header 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          isDeveloper={userRole === 'desenvolvedor'}
        />
      )}

      <main className={`mx-auto max-w-7xl px-6 ${currentView === 'home' || currentView === 'landing' ? 'py-10' : 'pt-3 pb-10'}`}>
        {/* Caminho de Pão (Breadcrumbs) */}
        {currentView !== 'home' && currentView !== 'landing' && (
          <nav className="mb-9 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            {/* Breadcrumb links */}
            <div className="flex items-center gap-2">
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
                    onClick={() => setCurrentView(userRole === 'desenvolvedor' ? 'view' : 'edit')}
                    className="font-medium hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {screenName || 'Especificação'}
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {userRole === 'desenvolvedor'
                      ? `Visualizar Tela: ${activeScreen?.name || ''}`
                      : (activeScreen ? `Editar Tela: ${activeScreen.name}` : 'Adicionar Tela')}
                  </span>
                </>
              )}
            </div>

            {/* Back Button (Voltar para Lista) */}
            {(currentView === 'edit' || currentView === 'view') && (
              <button
                onClick={() => setCurrentView('home')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                Voltar para Lista
              </button>
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
            projectsList={projectsList}
            onEdit={handleEditScreen}
            onView={handleViewScreen}
            onNew={handleNewScreen}
            onNewProject={handleNewProject}
            onAssociateSpecs={handleAssociateSpecsToProject}
            onArchive={handleArchive}
            onUnarchive={handleUnarchive}
            archivedIds={archivedIds}
            isLoading={isLoading}
            specAuthors={specAuthors}
            isDeveloper={userRole === 'desenvolvedor'}
            onTrocarPerfil={() => setCurrentView('landing')}
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
            specCriteria={specCriteria}
            specFigmaUrl={specFigmaUrl}
            specBusinessRules={specBusinessRules}
            specFunctionalRequirements={specFunctionalRequirements}
            onSelectScreen={(screen) => {
              setActiveScreen(screen);
              setCurrentView('screen-editor');
            }}
            onBack={() => setCurrentView('home')}
          />
        ) : currentView === 'screen-editor' ? (
          userRole === 'desenvolvedor' ? (
            <ScreenReadOnlyView
              screen={activeScreen}
              onBack={() => setCurrentView('view')}
              onComponentStatusToggle={(compId, newStatus, newHistory) => {
                // 1. Update details state (so other pages like overall progress update)
                const updatedDetails = details.map(scr => {
                  if (scr.id === activeScreen.id) {
                    const updatedComps = scr.components.map(c => 
                      c.id === compId ? { ...c, status: newStatus, change_history: newHistory } : c
                    );
                    return { ...scr, components: updatedComps };
                  }
                  return scr;
                });
                setDetails(updatedDetails);

                // 2. Update activeScreen state (so ScreenReadOnlyView receives the fresh prop)
                const updatedActiveScreen = {
                  ...activeScreen,
                  components: activeScreen.components.map(c => 
                    c.id === compId ? { ...c, status: newStatus, change_history: newHistory } : c
                  )
                };
                setActiveScreen(updatedActiveScreen);
              }}
            />
          ) : (
            <ScreenEditor
              screen={activeScreen}
              onSave={handleSaveScreen}
              onBack={() => setCurrentView('edit')}
              isSaving={isSaving}
              specFunctionalRequirements={specFunctionalRequirements}
            />
          )
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
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-455">
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
              
              {/* Specification Metadata Grid (Nome, Data Criacao, Autor, Progresso) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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

                {/* Projeto Associado */}
                <div className="flex flex-col gap-1.5 md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-400">
                    Projeto Associado
                  </label>
                  <select
                    value={specProjectId || ''}
                    onChange={(e) => setSpecProjectId(e.target.value || null)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-955/60 dark:text-slate-200 cursor-pointer"
                  >
                    <option value="">-- Sem projeto (Avulsa) --</option>
                    {projectsList.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
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

                {/* Conclusão da Especificação */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-slate-400">
                    Conclusão da Especificação
                  </label>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border shrink-0 ${
                      completionPercentage === 100
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-955/20 dark:text-emerald-400 dark:border-emerald-800/40'
                        : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-955/20 dark:text-rose-400 dark:border-rose-800/40'
                    }`}>
                      {completionPercentage}% concluído
                    </span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner max-w-[100px] hidden xs:block">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          completionPercentage === 100 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
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
                  <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                    Descrição da Especificação
                  </h2>
                  <textarea
                    placeholder="Escreva uma descrição detalhada dos objetivos desta especificação técnica..."
                    value={specDescription}
                    onChange={(e) => setSpecDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>

                {/* Regras de Negócios */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsBusinessRulesExpanded(!isBusinessRulesExpanded)}
                    className="flex w-full items-center justify-between p-6 hover:bg-slate-50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                        Regras de Negócios
                      </h2>
                    </div>
                    <div className="flex items-center gap-3">
                      {specBusinessRules.length > 0 && (
                        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400">
                          {specBusinessRules.length} {specBusinessRules.length === 1 ? 'regra' : 'regras'}
                        </span>
                      )}
                      <svg
                        className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                          isBusinessRulesExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {isBusinessRulesExpanded && (
                    <div className="border-t border-slate-100 p-6 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                        <h3 className="font-display text-base font-bold text-slate-800 dark:text-white">
                          Regras de Negócios Cadastradas
                        </h3>
                        <button
                          type="button"
                          onClick={handleAddBusinessRule}
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
                          Adicionar regra
                        </button>
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full min-w-[600px] border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            <tr>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[12%]">Nº Regra</th>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[28%]">Nome Regra</th>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[50%]">Descrição Regra</th>
                              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 text-left w-[10%]">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-900">
                            {specBusinessRules.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                                  Nenhuma regra de negócios cadastrada. Clique em "+ Adicionar regra" para começar.
                                </td>
                              </tr>
                            ) : (
                              specBusinessRules.map((rule, index) => (
                                <tr key={rule.id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                  <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                                    {rule.customId || `RN-${String(index + 1).padStart(2, '0')}`}
                                  </td>
                                  <td className="px-3 py-2">
                                    <textarea
                                      value={rule.name || ''}
                                      onChange={(e) => handleUpdateBusinessRule(index, 'name', e.target.value)}
                                      rows={1}
                                      ref={(el) => {
                                        if (el) {
                                          el.style.height = 'auto';
                                          el.style.height = `${el.scrollHeight}px`;
                                        }
                                      }}
                                      placeholder="Ex: Validação de Saldo"
                                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200 resize-none overflow-hidden"
                                    />
                                  </td>
                                  <td className="px-3 py-2">
                                    <textarea
                                      value={rule.description || ''}
                                      onChange={(e) => handleUpdateBusinessRule(index, 'description', e.target.value)}
                                      rows={1}
                                      ref={(el) => {
                                        if (el) {
                                          el.style.height = 'auto';
                                          el.style.height = `${el.scrollHeight}px`;
                                        }
                                      }}
                                      placeholder="Ex: O usuário só pode solicitar reembolso caso o valor seja superior..."
                                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200 resize-none overflow-hidden"
                                    />
                                  </td>
                                  <td className="px-3 py-2 text-left">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveBusinessRule(index)}
                                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                                      title="Remover regra"
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

                {/* Requisitos Funcionais */}
                <FunctionalRequirementsSection
                  requirements={specFunctionalRequirements}
                  onChange={setSpecFunctionalRequirements}
                  isExpanded={isFunctionalRequirementsExpanded}
                  onToggleExpand={() => setIsFunctionalRequirementsExpanded(!isFunctionalRequirementsExpanded)}
                />

                {/* 3 - Galeria de Fluxos Propostos */}
                <div className="space-y-3">
                  <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                    Fluxos Propostos
                  </h2>
                  <FlowsGallery flows={specFlows} onChange={setSpecFlows} />
                </div>

                {/* 3.5 - Figma Link and Preview Section */}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                    <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                      Link do Figma
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Cole aqui o link do design ou protótipo do Figma (ex: https://www.figma.com/file/...)"
                      value={specFigmaUrl}
                      onChange={(e) => setSpecFigmaUrl(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200"
                    />
                    
                    {specFigmaUrl && (
                      <div className="mt-2 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Pré-visualização do Figma
                        </span>
                        <div className="relative w-full h-[450px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-955/20">
                          <iframe
                            className="absolute inset-0 h-full w-full border-0"
                            src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(specFigmaUrl)}`}
                            allowFullScreen
                            title="Figma Preview"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4 & 5 - Seção Detalhamento das Telas e Lista de Telas */}
                <ScreensListSection
                  screens={details}
                  onAddClick={handleAddClick}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                />

                {/* Critérios de Aceite */}
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                    <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                      Critérios de Aceite
                    </h2>
                    <button
                      type="button"
                      onClick={handleAddCriterion}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow active:scale-95 duration-200 cursor-pointer"
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
                      Adicionar critério
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full min-w-[900px] border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                      <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <tr>
                          <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[12%]">ID</th>
                          <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[43%]">CRITÉRIO</th>
                          <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[15%]">STATUS</th>
                          <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[15%]">RESPONSÁVEL</th>
                          <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 w-[15%]">EVIDÊNCIA</th>
                          <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 text-left w-[5%]">AÇÕES</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850 bg-white dark:bg-slate-900">
                        {specCriteria.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                              Nenhum critério de aceite cadastrado. Clique em "+ Adicionar critério" para começar.
                            </td>
                          </tr>
                        ) : (
                          specCriteria.map((criterion, index) => (
                            <tr key={criterion.id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={criterion.customId || ''}
                                  onChange={(e) => handleUpdateCriterion(index, 'customId', e.target.value)}
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <textarea
                                  value={criterion.criterion || ''}
                                  onChange={(e) => handleUpdateCriterion(index, 'criterion', e.target.value)}
                                  rows={1}
                                  placeholder="Ex: O botão de login deve ficar desabilitado até preencher..."
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200 resize-y"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <select
                                  value={criterion.status || 'Pendente'}
                                  onChange={(e) => handleUpdateCriterion(index, 'status', e.target.value)}
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                                >
                                  <option value="Pendente">Pendente</option>
                                  <option value="Em Desenvolvimento">Em Desenvolvimento</option>
                                  <option value="Concluído">Concluído</option>
                                  <option value="Bloqueado">Bloqueado</option>
                                </select>
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={criterion.responsible || ''}
                                  onChange={(e) => handleUpdateCriterion(index, 'responsible', e.target.value)}
                                  placeholder="Responsável..."
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-200"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex items-center justify-start gap-1.5">
                                  {/* Visualizar Evidência */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (criterion.evidence && criterion.evidence.trim()) {
                                        handleOpenViewEvidence(index);
                                      }
                                    }}
                                    disabled={!criterion.evidence || !criterion.evidence.trim()}
                                    className={`p-1.5 rounded-lg transition-all active:scale-90 ${
                                      criterion.evidence && criterion.evidence.trim()
                                        ? "text-indigo-655 hover:bg-indigo-50 hover:text-indigo-750 dark:text-indigo-400 dark:hover:bg-indigo-950/40 cursor-pointer"
                                        : "text-slate-300 dark:text-slate-750 cursor-not-allowed"
                                    }`}
                                    title="Visualizar Evidência"
                                  >
                                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </button>

                                  {/* Cadastrar Evidência */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenRegisterEvidence(index)}
                                    className={`p-1.5 rounded-lg transition-all active:scale-90 cursor-pointer ${
                                      criterion.evidence && criterion.evidence.trim()
                                        ? "text-emerald-655 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                                        : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-450 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                    }`}
                                    title="Cadastrar / Editar Evidência"
                                  >
                                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h7a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                  </button>
                                </div>
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
                
                {/* Action buttons */}
                <div className="flex justify-end items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleExportPDF}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 active:scale-98 transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-850 cursor-pointer"
                  >
                    <svg
                      className="h-5 w-5 text-slate-500 dark:text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Gerar PDF
                  </button>

                  <button
                    onClick={handleSaveAllToSupabase}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-100 hover:from-indigo-600 hover:to-violet-700 active:scale-98 transition-all disabled:opacity-50 dark:shadow-none cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Gravando...
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

      <EvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        onSave={handleSaveEvidence}
        evidence={activeCriterionIndex !== null ? specCriteria[activeCriterionIndex].evidence : ''}
        criterionId={activeCriterionIndex !== null ? specCriteria[activeCriterionIndex].customId : ''}
        mode={evidenceModalMode}
      />

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
            <h3 className="text-center font-display text-lg font-bold text-slate-855 dark:text-white mb-2">
              Confirmar Gravação
            </h3>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
              Deseja gravar as alterações realizadas na especificação técnica?
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
                onClick={() => {
                  setShowSaveConfirmModal(false);
                  executeSaveAllToSupabase();
                }}
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
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-955/30 dark:text-emerald-400 mb-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-center font-display text-lg font-bold text-slate-855 dark:text-white mb-2">
              Gravado com sucesso!
            </h3>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">
              As especificações da tela foram gravadas com sucesso no banco de dados.
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
    </div>
  );
}
