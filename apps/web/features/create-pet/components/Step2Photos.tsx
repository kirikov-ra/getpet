"use client";

import React, { useRef } from 'react';
import { UploadCloud, Loader2, X} from 'lucide-react';
import { usePetWizardStore } from '../store/usePetWizardStore';

export const Step2Photos = () => {
  const { formData, uploadPhoto, isLoading, error, nextStep, prevStep, updateForm } = usePetWizardStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = formData.images || [];
  const isValid = images.length > 0;

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
    <div className="flex flex-col gap-6 max-w-md w-full">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Фотографии</h2>
        <p className="text-sm text-gray-500 mt-1">Добавьте хотя бы одно фото питомца</p>
      </div>

      <div 
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          isLoading ? 'border-gray-200 bg-gray-50' : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
          disabled={isLoading}
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center text-blue-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="text-sm font-medium">Загрузка...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-blue-600">
            <UploadCloud className="w-10 h-10 mb-2" />
            <span className="text-sm font-medium">Нажмите для выбора фото</span>
          </div>
        )}
      </div>

      {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">{error}</div>}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-2">
          {images.map((url, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group bg-gray-100 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Превью ${idx + 1}`} className="object-cover w-full h-full" />
              
              <button
                type="button"
                onClick={() => removePhoto(url)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={isLoading}
          className="flex-1 py-3 px-4 rounded-xl font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Назад
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={!isValid || isLoading}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-gray-300"
        >
          Далее
        </button>
      </div>
    </div>
  );
};