"use client";

import { PetDto } from "@shared/types/pet";

interface PetCardProps {
  pet: PetDto;
}

export const PetCard = ({ pet }: PetCardProps) => {
  const mainImage = pet.images?.[0]?.url || '/placeholder-pet.jpg';

  return (
    <div className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img 
          src={mainImage} 
          alt={pet.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          loading="lazy"
        />
        
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#064E3B] shadow-sm">
          {pet.category.name}
        </div>

        {pet.isSterilized && (
          <div className="absolute top-4 right-4 p-2 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-600 shadow-sm" title="Стерилизован(а)">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-black text-[#111827]">{pet.name}</h3>
        </div>
        
        <p className="text-xs font-bold text-[#059669] uppercase tracking-tighter">
          {pet.breed?.name || 'Порода не указана'}
        </p>
        
        <div className="flex flex-col gap-1 pt-3">
          {pet.city && (
            <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
              <span className="opacity-70">📍</span> {pet.city}
            </p>
          )}
          
          <p className="text-[10px] text-gray-300 font-medium">
            Опубликовано: {new Date(pet.createdAt).toLocaleDateString('ru-RU')}
          </p>
        </div>
      </div>
    </div>
  );
};