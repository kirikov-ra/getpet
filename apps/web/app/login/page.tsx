"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { PhoneFormValues, PhoneSchema, VerifyCodeFormValues, VerifyCodeSchema } from '../../features/auth/schemas/auth.schema';

export default function LoginPage() {
  const [step, setStep] = useState<'PHONE' | 'CODE'>('PHONE');
  const [phone, setPhone] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(PhoneSchema),
  });

  const codeForm = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(VerifyCodeSchema),
  });

  const onSendCode = async (data: PhoneFormValues) => {
    setServerError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Не удалось отправить код');
      
      setPhone(data.phone);
      setStep('CODE');
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  const onVerifyCode = async (data: VerifyCodeFormValues) => {
    setServerError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: data.code }),
      });

      if (!response.ok) throw new Error('Неверный код');

      const { access_token, user } = await response.json();
      setAuth(access_token, user);
      
      router.push('/');
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-10 bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 text-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#111827]">Добро пожаловать</h2>
          <p className="mt-3 text-sm text-gray-400">Начните путь к спасению друга</p>
        </div>

        <form onSubmit={step === 'PHONE' ? phoneForm.handleSubmit(onSendCode) : codeForm.handleSubmit(onVerifyCode)} className="space-y-4">
          <input
            {...(step === 'PHONE' ? phoneForm.register('phone') : codeForm.register('code'))}
            className="w-full rounded-2xl bg-[#F3F4F6] border-none p-5 text-sm font-medium focus:ring-2 focus:ring-[#059669] transition-all placeholder:text-gray-400"
            placeholder={step === 'PHONE' ? "+7 000 000 00 00" : "0 0 0 0"}
          />
          
          <button className="w-full rounded-2xl bg-[#064E3B] py-5 font-bold text-white shadow-xl shadow-emerald-100 transition-all active:scale-95">
            {step === 'PHONE' ? 'Запросить код' : 'Подтвердить'}
          </button>
        </form>
      </div>
    </div>
  );
}
