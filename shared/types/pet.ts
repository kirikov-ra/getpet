export interface PetDto {
  id: string;
  name: string;
  description: string;
  city: string;
  isSterilized: boolean;
  images: { url: string }[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  breed?: {
    id: string;
    name: string;
  };
  createdAt: string;
}