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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-900">Базовая информация</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">Имя питомца</label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none"
          placeholder="Например: Шарик"
        />
        {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="categoryId" className="text-sm font-medium text-gray-700">Категория</label>
        <select
          id="categoryId"
          {...register('categoryId')}
          className="rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">Выберите категорию...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.categoryId && <span className="text-red-500 text-xs">{errors.categoryId.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="breedId" className="text-sm font-medium text-gray-700">Порода</label>
        <select
          id="breedId"
          {...register('breedId')}
          className="rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">Выберите породу...</option>
          {breeds.map((breed) => (
            <option key={breed.id} value={breed.id}>{breed.name}</option>
          ))}
        </select>
        {errors.breedId && <span className="text-red-500 text-xs">{errors.breedId.message}</span>}
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        Далее
      </button>
    </form>
  );
};