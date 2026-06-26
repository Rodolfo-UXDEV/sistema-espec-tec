import React, { useState, useRef, useEffect } from 'react';

export default function FlowsGallery({ flows = [], onChange, readOnly = false }) {
  const [activeFlowIndex, setActiveFlowIndex] = useState(null);

  // Keyboard navigation for carousel
  useEffect(() => {
    if (activeFlowIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setActiveFlowIndex((prev) => (prev + 1) % flows.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveFlowIndex((prev) => (prev - 1 + flows.length) % flows.length);
      } else if (e.key === 'Escape') {
        setActiveFlowIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFlowIndex, flows.length]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFlows = [...flows, event.target.result];
        onChange(newFlows);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      // Process all uploaded files
      Array.from(e.target.files).forEach(file => {
        processFile(file);
      });
    }
  };

  const removeFlowImage = (index, e) => {
    e.stopPropagation(); // prevent opening the lightbox
    const newFlows = flows.filter((_, idx) => idx !== index);
    onChange(newFlows);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {/* Render existing flow images */}
        {flows.map((flow, index) => (
          <div
            key={index}
            onClick={() => setActiveFlowIndex(index)}
            className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-indigo-950"
          >
            <img
              src={flow}
              alt={`Fluxo ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Delete button overlay */}
            {!readOnly && (
              <button
                onClick={(e) => removeFlowImage(index, e)}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-white shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 active:scale-95 duration-200"
                title="Remover Fluxo"
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
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-2 text-left opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-semibold text-white">Fluxo {index + 1} (Clique para ampliar)</span>
            </div>
          </div>
        ))}

        {/* Add new image card (Upload Dropzone) */}
        {!readOnly && (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={`relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all duration-300 ${
              isDragActive
                ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                : "border-slate-300 bg-slate-50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-slate-600"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="hidden"
            />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm dark:bg-slate-800">
              <svg
                className="h-4.5 w-4.5 text-slate-550 dark:text-slate-400"
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
            </div>
            <span className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-350">
              Adicionar Imagem
            </span>
            <span className="text-[10px] text-slate-405 mt-0.5">Arraste ou clique</span>
          </div>
        )}
      </div>

      {/* Lightbox / Expanded View Modal */}
      {activeFlowIndex !== null && flows[activeFlowIndex] && (
        <div
          onClick={() => setActiveFlowIndex(null)}
          className="fixed inset-0 z-[110] flex flex-col items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm cursor-zoom-out animate-in fade-in duration-200"
        >
          {/* Close button */}
          <button
            onClick={() => setActiveFlowIndex(null)}
            className="absolute top-6 right-6 z-[120] flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            title="Fechar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Controls Wrapper */}
          <div className="relative flex items-center justify-center w-full max-w-7xl h-full max-h-[80vh] px-16 md:px-24">
            
            {/* Previous Button */}
            {flows.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFlowIndex((prev) => (prev - 1 + flows.length) % flows.length);
                }}
                className="absolute left-2 md:left-6 z-[120] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
                title="Anterior"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Image Container */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="relative max-h-[80vh] max-w-full overflow-hidden rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 cursor-default bg-slate-900/50"
            >
              <img
                key={activeFlowIndex}
                src={flows[activeFlowIndex]}
                alt={`Fluxo ${activeFlowIndex + 1}`}
                className="max-h-[80vh] max-w-full object-contain rounded-xl select-none animate-in fade-in zoom-in-98 duration-300"
              />
            </div>

            {/* Next Button */}
            {flows.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFlowIndex((prev) => (prev + 1) % flows.length);
                }}
                className="absolute right-2 md:right-6 z-[120] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
                title="Próximo"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Indicator Counter */}
          {flows.length > 1 && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="mt-6 z-[120] select-none rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-sm cursor-default shadow-md"
            >
              {activeFlowIndex + 1} de {flows.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
