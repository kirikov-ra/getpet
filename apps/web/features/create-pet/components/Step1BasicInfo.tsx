"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePetWizardStore } from '../store/usePetWizardStore';

const step1Schema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  categorySlug: z.string().min(1, 'Выберите категорию'),
  breedSlug: z.string().min(1, 'Выберите породу'),
});

type Step1FormValues = z.infer<typeof step1Schema>;

export const Step1BasicInfo = () => {
  const { formData, updateForm, nextStep } = usePetWizardStore();
  
  const [categories] = useState([{ slug: 'dogs', name: 'Собаки' }, { slug: 'cats', name: 'Кошки' }]);
  const [breeds] = useState([{ slug: 'labrador', name: 'Лабрадор' }, { slug: 'persian', name: 'Персидская' }]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: formData.name || '',
      categorySlug: formData.categorySlug || '',
      breedSlug: formData.breedSlug || '',
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
        <label htmlFor="categorySlug" className="text-sm font-medium text-gray-700">Категория</label>
        <select
          id="categorySlug"
          {...register('categorySlug')}
          className="rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">Выберите категорию...</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        {errors.categorySlug && <span className="text-red-500 text-xs">{errors.categorySlug.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="breedSlug" className="text-sm font-medium text-gray-700">Порода</label>
        <select
          id="breedSlug"
          {...register('breedSlug')}
          className="rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">Выберите породу...</option>
          {breeds.map((breed) => (
            <option key={breed.slug} value={breed.slug}>{breed.name}</option>
          ))}
        </select>
        {errors.breedSlug && <span className="text-red-500 text-xs">{errors.breedSlug.message}</span>}
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