import React, { useState, useEffect, useRef } from 'react';

export default function EvidenceModal({ isOpen, onClose, onSave, evidence, criterionId, mode = 'edit' }) {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Parse initial evidence
  useEffect(() => {
    if (isOpen) {
      if (evidence) {
        try {
          if (evidence.startsWith('{')) {
            const parsed = JSON.parse(evidence);
            setDescription(parsed.description || '');
            setImage(parsed.image || null);
          } else {
            setDescription(evidence);
            setImage(null);
          }
        } catch (e) {
          setDescription(evidence);
          setImage(null);
        }
      } else {
        setDescription('');
        setImage(null);
      }
    }
  }, [isOpen, evidence]);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
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
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const resultObj = {
      description,
      image
    };
    onSave(JSON.stringify(resultObj));
  };

  const isUrl = (str) => {
    return str && (str.startsWith('http://') || str.startsWith('https://'));
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200 dark:border-slate-800 dark:bg-slate-900 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {mode === 'edit' ? 'Cadastrar Evidência' : 'Visualizar Evidência'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-455 mt-0.5">
              Critério: <span className="font-semibold text-slate-700 dark:text-slate-300">{criterionId}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {mode === 'edit' ? (
          <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Imagem da Evidência
                </label>
                
                {image ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 flex flex-col items-center">
                    <img 
                      src={image} 
                      alt="Preview da evidência" 
                      className="max-h-[300px] object-contain rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute top-4 right-4 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white p-2 transition-all cursor-pointer hover:scale-105"
                      title="Remover imagem"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                    className={`group relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
                      isDragActive
                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                        : "border-slate-300 bg-slate-50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-slate-600"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-transform duration-300 group-hover:scale-110 dark:bg-slate-800">
                      <svg className="h-5 w-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-display text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Arraste ou clique para selecionar uma imagem
                    </h4>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      Formatos aceitos: PNG, JPG, WEBP
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Descrição / Informações da Evidência
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva a evidência ou insira links, notas, logs de teste..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 resize-y"
                />
              </div>

            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-6 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Salvar Evidência
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Descrição da Evidência
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850">
                {description ? (
                  isUrl(description) ? (
                    <a
                      href={description}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline break-all inline-flex items-center gap-1.5 font-medium"
                    >
                      <span>{description}</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <p className="text-sm text-slate-700 dark:text-slate-350 break-words whitespace-pre-line leading-relaxed">
                      {description}
                    </p>
                  )
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-650 italic">
                    Nenhuma descrição fornecida.
                  </p>
                )}
              </div>
            </div>

            {/* Image display */}
            {image ? (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Captura de Tela / Imagem
                </h4>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 flex justify-center overflow-hidden">
                  <a href={image} target="_blank" rel="noopener noreferrer" title="Clique para ver em tela cheia">
                    <img 
                      src={image} 
                      alt="Evidência anexa" 
                      className="max-h-[400px] object-contain rounded-xl hover:scale-[1.01] transition-transform duration-200 cursor-zoom-in"
                    />
                  </a>
                </div>
              </div>
            ) : null}

            {!description && !image ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-600">
                <svg className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">Nenhuma evidência foi cadastrada para este critério.</p>
              </div>
            ) : null}

            {/* Close footer button */}
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
