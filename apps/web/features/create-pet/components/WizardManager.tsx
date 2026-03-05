"use client";

import { usePetWizardStore } from '../store/usePetWizardStore';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2Photos } from './Step2Photos';
import { Step3Owner } from './Step3Owner';

export const WizardManager = () => {
  const step = usePetWizardStore((state) => state.step);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-10 px-2">
        <div className="flex justify-between mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <span>Этап {step} из 3</span>
          <span>{step === 1 ? 'Базовая информация' : step === 2 ? 'Медиа' : 'Владение'}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#059669] transition-all duration-500 ease-out shadow-[0_0_8px_rgba(5,150,105,0.4)]"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 p-8">
        {step === 1 && <Step1BasicInfo />}
        {step === 2 && <Step2Photos />}
        {step === 3 && <Step3Owner />}
      </div>
    </div>
  );
};