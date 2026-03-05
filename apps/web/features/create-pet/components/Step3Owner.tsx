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
      ownerType: data.ownerType,
      consentGiven: data.consentPersonalData,
      ownerId: data.ownerType === 'user' ? user?.id : undefined,
      shelterId: data.ownerType === 'shelter' ? '55555555-5555-5555-5555-555555555555' : undefined, 
    };

    updateForm(finalData);
    await submitWizard();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 max-w-md w-full">
      <div>
        <h2 className="text-2xl font-black text-[#111827] tracking-tight">Публикация</h2>
        <p className="text-sm text-gray-400 mt-1 font-medium">Проверьте данные и подтвердите владение</p>
      </div>

      <div className="space-y-4">
        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-1">Кто размещает объявление?</label>
        <div className="grid grid-cols-2 gap-4">
          <label className={`flex flex-col p-6 rounded-[2rem] border-2 transition-all cursor-pointer ${user?.role !== 'SHELTER_ADMIN' ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-50/50' : 'border-gray-50 bg-gray-50/50'}`}>
            <input 
              type="radio" 
              value="user" 
              {...register('ownerType')} 
              disabled={user?.role !== 'SHELTER_ADMIN'} 
              className="sr-only"
            />
            <span className="font-black text-sm text-[#111827]">От себя</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-tighter">Частное лицо</span>
          </label>
          <label className={`flex flex-col p-6 rounded-[2rem] border-2 transition-all cursor-pointer ${user?.role === 'SHELTER_ADMIN' ? 'border-[#059669] bg-[#ECFDF5]' : 'border-gray-50 bg-gray-50/50'}`}>
            <input 
              type="radio" 
              value="shelter" 
              {...register('ownerType')} 
              className="sr-only"
            />
            <span className="font-black text-sm text-[#111827]">От приюта</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-tighter">Организация</span>
          </label>
        </div>
      </div>

      <div className="bg-[#F9FAFB] p-6 rounded-[2rem] border border-gray-100">
        <label className="flex items-start gap-4 cursor-pointer">
          <input
            type="checkbox"
            {...register('consentPersonalData')}
            className="mt-1 h-5 w-5 rounded-full border-gray-300 text-[#059669] focus:ring-[#059669] transition-all"
          />
          <span className="text-[11px] font-medium text-gray-500 leading-relaxed">
              Я согласен(на) с условиями 
            <a href="/terms" className="text-[#059669] hover:underline mx-1 font-bold">Пользовательского соглашения</a> 
              и даю согласие на 
            <a href="/privacy" className="text-[#059669] hover:underline mx-1 font-bold">обработку персональных данных</a> 
              (в т.ч. их публикацию в открытом доступе).
          </span>
        </label>
        {errors.consentPersonalData && (
          <p className="mt-3 text-[10px] text-red-500 font-bold uppercase tracking-tight ml-9">{errors.consentPersonalData.message}</p>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-[11px] font-bold uppercase rounded-2xl border border-red-100 text-center">
          {error}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 py-5 rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors active:scale-95"
        >
          Назад
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-2 bg-[#064E3B] text-white py-5 rounded-[1.5rem] font-bold hover:cursor-pointer hover:shadow-xl shadow-emerald-50 active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center gap-3"
        >
          {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
          Опубликовать
        </button>
      </div>
    </form>
  );
};