"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePetWizardStore } from '../store/usePetWizardStore';

const step1Schema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  // NestJS ждет UUID, поэтому добавляем валидацию на фронтенде для надежности
  categoryId: z.string().min(1, 'Выберите категорию'),
  breedId: z.string().min(1, 'Выберите породу'),
});

type Step1FormValues = z.infer<typeof step1Schema>;

export const Step1BasicInfo = () => {
  const { formData, updateForm, nextStep } = usePetWizardStore();
  
  const [categories] = useState([
    { id: '2d0d7818-6b76-475c-ae83-899450530822', name: 'Собаки' }, 
    { id: '867a8fee-39a7-4c6c-8fa5-cc8f587cee12', name: 'Кошки' }
  ]);
  const [breeds] = useState([
    { id: '799119af-76b1-422a-b901-abfed8579b74', name: 'Лабрадор' }, 
    { id: '4e7995d6-12f2-4c4a-a1dd-41b20093b9e5', name: 'Персидская' }
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: formData.name || '',
      categoryId: (formData.categoryId?.length === 36) ? formData.categoryId : '',
      breedId: (formData.breedId?.length === 36) ? formData.breedId : '',
    },
  });

  const onSubmit = (data: Step1FormValues) => {
    updateForm(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 max-w-md w-full p-10">
      <h2 className="text-2xl font-black text-gray-900 tracking-tight">Базовая информация</h2>

      <div className="space-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Имя питомца</label>
          <input
            {...register('name')}
            className="w-full rounded-2xl bg-gray-50 text-gray-900 border-none p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-400"
            placeholder="Например: Шарик"
          />
          {errors.name && <span className="text-red-500 text-[10px] font-bold ml-1 uppercase">{errors.name.message}</span>}
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Категория</label>
            <select
              {...register('categoryId')}
              className="w-full rounded-2xl text-gray-400 bg-gray-50 border-none p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">Выберите...</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Порода</label>
            <select
              {...register('breedId')}
              className="w-full rounded-2xl text-gray-400 bg-gray-50 border-none p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">Выберите...</option>
              {breeds.map((breed) => <option key={breed.id} value={breed.id}>{breed.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <button className="w-full rounded-2xl bg-[#064E3B] py-5 font-bold text-white hover:cursor-pointer hover:shadow-xl shadow-emerald-50 transition-all active:scale-95">
        Продолжить
      </button>
    </form>
  );
};