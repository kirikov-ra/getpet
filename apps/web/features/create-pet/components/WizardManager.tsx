"use client";

import React from 'react';
import { usePetWizardStore } from '../store/usePetWizardStore';
import { Step1BasicInfo } from './Step1BasicInfo';

const Step2Photos = () => <div>Шаг 2: Загрузка фото (в разработке)</div>;
const Step3Owner = () => <div>Шаг 3: Выбор владельца и ФЗ-152 (в разработке)</div>;

export const WizardManager = () => {
  const step = usePetWizardStore((state) => state.step);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-8 flex justify-between items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
        <span className={step >= 1 ? "text-blue-600" : ""}>Инфо</span>
        <div className="h-px bg-gray-200 flex-1 mx-4" />
        <span className={step >= 2 ? "text-blue-600" : ""}>Фото</span>
        <div className="h-px bg-gray-200 flex-1 mx-4" />
        <span className={step >= 3 ? "text-blue-600" : ""}>Владелец</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {step === 1 && <Step1BasicInfo />}
        {step === 2 && <Step2Photos />}
        {step === 3 && <Step3Owner />}
      </div>
    </div>
  );
};