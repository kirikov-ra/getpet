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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {step === 'PHONE' ? 'Вход в GetPet' : 'Подтверждение'}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {step === 'PHONE' 
              ? 'Введите номер телефона для входа' 
              : `Мы отправили код на ${phone}`}
          </p>
        </div>

        {step === 'PHONE' ? (
          <form onSubmit={phoneForm.handleSubmit(onSendCode)} className="space-y-4">
            <input
              {...phoneForm.register('phone')}
              type="tel"
              placeholder="+79990000000"
              className="w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-blue-500 transition-all"
            />
            {phoneForm.formState.errors.phone && (
              <p className="text-xs text-red-500">{phoneForm.formState.errors.phone.message}</p>
            )}
            <button
              disabled={phoneForm.formState.isSubmitting}
              className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg disabled:opacity-50"
            >
              Получить код
            </button>
          </form>
        ) : (
          <form onSubmit={codeForm.handleSubmit(onVerifyCode)} className="space-y-4">
            <input
              {...codeForm.register('code')}
              type="number"
              placeholder="0000"
              className="w-full rounded-xl border border-gray-200 p-4 text-center text-2xl tracking-[1em] outline-none focus:border-blue-500 transition-all"
            />
            {codeForm.formState.errors.code && (
              <p className="text-xs text-red-500 text-center">{codeForm.formState.errors.code.message}</p>
            )}
            <button
              disabled={codeForm.formState.isSubmitting}
              className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg disabled:opacity-50"
            >
              Войти
            </button>
            <button 
              type="button"
              onClick={() => setStep('PHONE')}
              className="w-full text-sm text-gray-400 hover:text-blue-500"
            >
              Изменить номер телефона
            </button>
          </form>
        )}

        {serverError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 text-center">
            {serverError}
          </div>
        )}
      </div>
    </div>
  );
}
