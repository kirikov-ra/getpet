import { create } from 'zustand';
import { useAuthStore } from '../../auth/store/useAuthStore';

export type OwnerType = 'user' | 'shelter';

export interface PetFormData {
  name: string;
  categorySlug: string;
  breedSlug: string;
  description: string;
  isSterilized: boolean;
  birthDate?: string;
  tags: string[];
  images: string[];
  ownerType: OwnerType;
  ownerId?: string | null;
  shelterId?: string | null;
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
    set({ isLoading: true, error: null });

    try {
      const payload = {
        ...formData,
        ownerId: formData.ownerType === 'user' ? formData.ownerId : null,
        shelterId: formData.ownerType === 'shelter' ? formData.shelterId : null,
      };

      delete payload.ownerType;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Ошибка создания карточки питомца');

      get().reset();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  reset: () => set({ step: 1, formData: initialFormState, error: null, isLoading: false }),
}));