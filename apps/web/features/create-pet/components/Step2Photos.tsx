"use client";

import React, { useRef } from 'react';
import { UploadCloud, Loader2, X} from 'lucide-react';
import { usePetWizardStore } from '../store/usePetWizardStore';

export const Step2Photos = () => {
  const { formData, uploadPhoto, isLoading, error, nextStep, prevStep, updateForm } = usePetWizardStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = formData.images || [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      await uploadPhoto(file);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (urlToRemove: string) => {
    updateForm({ images: images.filter((url) => url !== urlToRemove) });
  };

  return (
    <div className="flex flex-col gap-8 max-w-md w-full">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Галерея</h2>
        <p className="text-sm text-gray-400 mt-1">Добавьте до 5 качественных снимков</p>
      </div>

      <div 
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center w-full h-48 rounded-[2rem] border-2 border-dashed transition-all ${
          isLoading ? 'border-gray-100 bg-gray-50' : 'border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer'
        }`}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
        
        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-white rounded-2xl shadow-sm text-emerald-600">
              <UploadCloud className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-tighter">Загрузить фото</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {images.map((url, idx) => (
          <div key={idx} className="relative aspect-square rounded-3xl overflow-hidden shadow-sm group border-4 border-white">
            <img src={url} alt="Pet" className="object-cover w-full h-full transition-transform group-hover:scale-110" />
            <button 
              onClick={() => removePhoto(url)}
              className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur shadow-sm rounded-xl text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={prevStep} className="flex-1 py-5 rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer">Назад</button>
        <button onClick={nextStep} className="flex-[2] py-5 rounded-2xl bg-[#064E3B] font-bold text-white hover:cursor-pointer hover:shadow-xl shadow-emerald-50">Далее</button>
      </div>
    </div>
  );
};