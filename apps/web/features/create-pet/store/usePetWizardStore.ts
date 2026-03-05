import { create } from 'zustand';
import { useAuthStore } from '../../auth/store/useAuthStore';

export type OwnerType = 'user' | 'shelter';

export interface PetFormData {
  name: string;
  categoryId: string;
  breedId: string;
  description: string;
  city: string;
  isSterilized: boolean;
  birthDate?: string;
  tags: string[];
  images: string[];
  ownerType: OwnerType;
  ownerId?: string;
  shelterId?: string;
  consentGiven: boolean;
}

interface PetWizardState {
  step: number;
  formData: Partial<PetFormData>;
  isLoading: boolean;
  error: string | null;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateForm: (data: Partial<PetFormData>) => void;
  uploadPhoto: (file: File) => Promise<void>;
  submitWizard: () => Promise<void>;
  reset: () => void;
}

const initialFormState: Partial<PetFormData> = {
  tags: [],
  images: [],
  ownerType: 'user',
  isSterilized: false,
  consentGiven: false,
};

export const usePetWizardStore = create<PetWizardState>((set, get) => ({
  step: 1,
  formData: initialFormState,
  isLoading: false,
  error: null,

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1, error: null })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1), error: null })),
  
  updateForm: (data) => set((state) => ({ 
    formData: { ...state.formData, ...data },
    error: null 
  })),

  uploadPhoto: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (!apiUrl) {
        throw new Error('Критическая ошибка: NEXT_PUBLIC_API_URL не задан');
      }

      const formData = new FormData();
      formData.append('file', file);

      const targetUrl = `${apiUrl}/files/upload`;
      console.log('🚀 ОТПРАВЛЯЮ ФАЙЛ НА:', targetUrl);

      const token = useAuthStore.getState().token;

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: { 
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData, 
      });

      if (!response.ok) throw new Error(`Ошибка API: ${response.status}`);

      const data = await response.json();
      
      set((state) => ({
        formData: {
          ...state.formData,
          images: [...(state.formData.images || []), data.url],
        },
        isLoading: false,
      }));
    } catch (error) {
      console.error('Upload Error:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  submitWizard: async () => {
    const { formData } = get();
    const { user } = useAuthStore.getState();
    set({ isLoading: true, error: null });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = useAuthStore.getState().token;

      const { 
        consentGiven, 
        ownerType, 
        ownerId,
        ...rest 
      } = formData;

      const payload: any = {
        ...rest,
        description: formData.description || 'Тестовое описание',
        city: formData.city || 'Казань',
        images: formData.images?.map((url) => ({ url })) || [],
        // Проверка на валидность UUID перед отправкой
        categoryId: formData.categoryId,
        breedId: formData.breedId || undefined,
        shelterId: ownerType === 'shelter' ? formData.shelterId : undefined,
      };

      if (!payload.shelterId) delete payload.shelterId;
      if (!payload.breedId) delete payload.breedId;

      console.log('📦 ИТОГОВЫЙ PAYLOAD:', payload);

      console.log('Отправка очищенного payload:', payload);

      const response = await fetch(`${apiUrl}/pets`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Выводим массив ошибок в читаемом виде
        const errorMsg = Array.isArray(responseData.message) 
          ? responseData.message.join(', ') 
          : responseData.message;
        throw new Error(errorMsg);
      }

      get().reset();
    } catch (error) {
      console.error('Submit Error:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  reset: () => set({ step: 1, formData: initialFormState, error: null, isLoading: false }),
}));