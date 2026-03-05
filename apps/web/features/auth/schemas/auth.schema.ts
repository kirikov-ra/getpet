import { z } from 'zod';

export const PhoneSchema = z.object({
  phone: z.string().regex(/^(\+7|8)[0-9]{10}$/, 'Введите корректный номер (напр. +79991234567)'),
});

export const VerifyCodeSchema = z.object({
  code: z.string().length(4, 'Код должен состоять из 4 цифр'),
});

export type PhoneFormValues = z.infer<typeof PhoneSchema>;
export type VerifyCodeFormValues = z.infer<typeof VerifyCodeSchema>;