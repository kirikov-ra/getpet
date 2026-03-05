"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePetWizardStore } from '../store/usePetWizardStore';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../auth/store/useAuthStore';

const step3Schema = z.object({
  ownerType: z.enum(['user', 'shelter']),
  
  consentPersonalData: z.boolean().refine((val) => val === true, {
    message: 'Для публикации объявления необходимо согласие по ФЗ-152',
  }),
});

type Step3Values = z.infer<typeof step3Schema>;

export const Step3Owner = () => {
  const { updateForm, submitWizard, isLoading, error, prevStep } = usePetWizardStore();
  const { user } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      ownerType: user?.role === 'SHELTER_ADMIN' ? 'shelter' : 'user',
      consentPersonalData: false,
    },
  });

  const onSubmit = async (data: Step3Values) => {
    const finalData = {
      ...data,
      ownerId: data.ownerType === 'user' ? user?.id : null,
      shelterId: data.ownerType === 'shelter' ? 'some-shelter-uuid' : null, 
    };

    updateForm(finalData);
    
    await submitWizard();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-md w-full">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Публикация</h2>
        <p className="text-sm text-gray-500 mt-1">Проверьте данные и подтвердите владение</p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Кто размещает объявление?</label>
        <div className="grid grid-cols-2 gap-3">
          <label className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${user?.role !== 'SHELTER_ADMIN' ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <input 
              type="radio" 
              value="user" 
              {...register('ownerType')} 
              disabled={user?.role !== 'SHELTER_ADMIN'} 
              className="sr-only"
            />
            <span className="font-bold text-sm">От себя</span>
            <span className="text-xs text-gray-400">Частное лицо</span>
          </label>
          <label className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${user?.role !== 'SHELTER_ADMIN' ? 'border-blue-600 bg-blue-50' : ''}`}>
            <input 
              type="radio" 
              value="shelter" 
              {...register('ownerType')} 
              className="sr-only"
            />
            <span className="font-bold text-sm">От приюта</span>
            <span className="text-xs text-gray-400">Организация</span>
          </label>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('consentPersonalData')}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-600 leading-relaxed">
              Я согласен(на) с условиями 
            <a href="/terms" className="text-blue-600 hover:underline mx-1">Пользовательского соглашения</a> 
              и даю согласие на 
            <a href="/privacy" className="text-blue-600 hover:underline mx-1">обработку персональных данных</a> 
              (в т.ч. их публикацию в открытом доступе).
          </span>
        </label>
        {errors.consentPersonalData && (
          <p className="mt-2 text-xs text-red-500 font-medium">{errors.consentPersonalData.message}</p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 py-4 px-4 rounded-xl font-bold border border-gray-300 text-gray-700 active:scale-95 transition-transform"
        >
          Назад
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-2 bg-blue-600 text-white py-4 px-4 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
          Опубликовать
        </button>
      </div>
    </form>
  );
};