export interface Product {
  id: string;
  name: string;
  slug: string;
  lot?: string;
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

export interface OriginFarm {
  id: string;
  slug: string;
  farmName: string;
  producer: string;
  region: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  approximateLocation?: boolean;
  altitude: string;
  varieties: string[];
  process: string;
  harvest: string;
  lotName: string;
  linkedProductSlug?: string;
  scaScore?: number;
  sensoryNotes: string;
  image: string;
  producerImage?: string;
  description: string;
  traceabilitySummary: string;
  featured: boolean;
  active: boolean;
}

export interface Partner {
  id: string;
  publicName: string;
  internalName?: string;
  slug: string;
  type: string;
  category: string;
  city: string;
  state: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  website?: string;
  googleMapsUrl?: string;
  rating?: string;
  priceRange?: string;
  openingHours: string;
  weeklySchedule?: string;
  shortDescription: string;
  longDescription?: string;
  coverImage: string;
  gallery?: string[];
  availableProducts: string[];
  productDetails?: { name: string; description: string; method?: string; sensoryNotes?: string }[];
  consumptionMethods?: string[];
  tags: string[];
  featured: boolean;
  active: boolean;
  status?: string;
  internalNotes?: string;
  seoTitle?: string;
  seoDescription?: string;
  isRoutePartner?: boolean;
  isOpen24h?: boolean;
  isPendingValidation?: boolean;
  showOnHome?: boolean;
  showOnPartnersPage?: boolean;
  
  // Location validation & search
  fullAddress?: string;
  locationStatus?: "draft" | "missing_coordinates" | "suggested" | "confirmed" | "invalid";
  locationValidatedAt?: string;
  locationSource?: "manual" | "google_maps" | "admin" | "imported" | "unknown";
  locationNotes?: string;
  cep?: string;
  coordinatesConfirmed?: boolean;
  aliases?: string[];
  
  // Legacy / fallback fields
  name?: string;
  partnerBadge?: string;
  isOpenNow?: boolean;
  services?: string[];
  ifoodUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  format: string;
}
