export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "grão" | "moído" | "cápsula" | "kit" | "presente" | "b2b";
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  sensoryNotes: string[];
  origin: string;
  region: string;
  producer?: string;
  farm?: string;
  altitude?: string;
  variety?: string;
  process?: string;
  roastLevel: "clara" | "média" | "escura";
  formats: string[];
  image: string;
  featured: boolean;
  stock: number;
  isAwardWinning?: boolean;
  awardName?: string;
  awardYear?: string;
  externalValidation?: string;
  cuppingScore?: number;
  traceabilityInfo?: string;
  whySelected?: string;
  originStory?: string;
  bestPreparation?: string;
  recommendedFor?: string;
}

export interface Partner {
  id: string;
  name: string;
  type: "Cafeteria" | "Restaurante" | "Hotel" | "Escritório" | "Loja" | "Revendedor";
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  phone: string;
  instagram: string;
  ifoodUrl?: string;
  availableProducts: string[];
  openingHours: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  format: string;
}
