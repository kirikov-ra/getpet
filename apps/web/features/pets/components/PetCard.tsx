import Image from 'next/image';
import Link from 'next/link';
import { PetDto } from "@shared/types/pet";

interface PetCardProps {
  pet: PetDto;
}

export const PetCard = ({ pet }: PetCardProps) => {
  const mainImage = pet.images?.[0]?.url || '/placeholder-pet.png';
  
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(pet.createdAt));

  return (
    <article className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 transition-all hover:shadow-xl hover:-translate-y-1">
      
      <Link 
        href={`/pets/${pet.id}`} 
        className="absolute inset-0 z-10"
        aria-label={`Перейти к анкете питомца ${pet.name}`}
      />

      <figure className="relative aspect-[4/5] overflow-hidden bg-gray-100 m-0">
        <Image 
          src={mainImage} 
          alt={`Фотография питомца по имени ${pet.name}`}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        <figcaption className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#064E3B] shadow-sm">
          {pet.category.name}
        </figcaption>

        {pet.isSterilized && (
          <div 
            className="absolute top-4 right-4 z-20 p-2 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-600 shadow-sm" 
            title="Стерилизован(а)"
            aria-label="Стерилизован(а)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </figure>
      
      <div className="p-6 space-y-1 relative z-20 pointer-events-none">
        <div className="flex justify-between items-start pointer-events-auto">
          <h3 className="text-xl font-black text-[#111827]">{pet.name}</h3>
        </div>
        
        <p className="text-xs font-bold text-[#059669] uppercase tracking-tighter">
          {pet.breed?.name || 'Порода не указана'}
        </p>
        
        <div className="flex flex-col gap-1 pt-3">
          {pet.city && (
            <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
              <span aria-hidden="true" className="opacity-70">📍</span> 
              <span>{pet.city}</span>
            </p>
          )}
          
          <time dateTime={pet.createdAt} className="text-[10px] text-gray-300 font-medium">
            Опубликовано: {formattedDate}
          </time>
        </div>
      </div>
    </article>
  );
};