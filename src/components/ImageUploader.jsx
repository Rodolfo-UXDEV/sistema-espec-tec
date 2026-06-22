import React, { useState, useRef } from 'react';

export default function ImageUploader({ image, setImage }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

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
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <div className="w-full">
      {!image ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`group relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
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
          
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-transform duration-300 group-hover:scale-110 dark:bg-slate-800">
            <svg
              className="h-6 w-6 text-slate-500 dark:text-slate-400"
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
          </div>

          <h3 className="font-display text-lg font-semibold text-slate-700 dark:text-slate-200">
            Arraste ou clique para fazer upload da tela
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Suporta arquivos PNG, JPG, JPEG, WEBP
          </p>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-inner dark:border-slate-800 dark:bg-slate-950/40">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={triggerFileInput}
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-slate-700 shadow-md hover:bg-slate-50 active:scale-95 transition-all dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Substituir
            </button>
            <button
              onClick={removeImage}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shadow-md hover:bg-rose-600 active:scale-95 transition-all"
              title="Remover Imagem"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

          <div className="flex w-full justify-center overflow-auto py-8">
            {/* Displaying image fully as requested */}
            <img
              src={image}
              alt="Preview da Tela"
              className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
