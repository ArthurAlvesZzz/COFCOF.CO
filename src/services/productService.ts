import { ProductAdmin } from '../types/admin';

// Mocked data for now, ideally this connects to Firebase later
let mockProducts: ProductAdmin[] = [
  {
    id: 'prod_1',
    name: 'Cerrado Clássico',
    slug: 'cerrado-classico',
    category: 'Café',
    price: 65,
    format: 'Pacote 250g',
    roast: 'Média',
    sensoryProfile: 'Doce e Equilibrado',
    sensoryNotes: ['Chocolate', 'Caramelo', 'Nozes'],
    origin: 'Cerrado Mineiro',
    region: 'Cerrado Mineiro',
    farm: 'Fazenda Primavera',
    producer: 'João Garcia',
    altitude: '1100m',
    variety: 'Catuaí Amarelo',
    process: 'Natural',
    isAwardWinning: false,
    hasTraceability: true,
    shortDescription: 'Café clássico de dia a dia.',
    fullDescription: 'Um café que representa muito bem o Cerrado Mineiro. Corpo aveludado e doçura presente.',
    mainImage: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80',
    gallery: [],
    stock: 50,
    active: true,
    featured: true,
    idealFor: ['Dia a dia', 'Espresso']
  }
];

export const productService = {
  async listProducts(): Promise<ProductAdmin[]> {
    return Promise.resolve([...mockProducts]);
  },

  async getProductById(id: string): Promise<ProductAdmin | undefined> {
    return Promise.resolve(mockProducts.find(p => p.id === id));
  },

  async createProduct(data: Omit<ProductAdmin, 'id'>): Promise<ProductAdmin> {
    const newProduct = {
      ...data,
      id: `prod_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts.push(newProduct as ProductAdmin);
    return Promise.resolve(newProduct as ProductAdmin);
  },

  async updateProduct(id: string, data: Partial<ProductAdmin>): Promise<ProductAdmin | undefined> {
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx === -1) return Promise.resolve(undefined);
    
    mockProducts[idx] = {
      ...mockProducts[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve(mockProducts[idx]);
  },

  async toggleProductActive(id: string): Promise<void> {
    const product = mockProducts.find(p => p.id === id);
    if (product) {
      product.active = !product.active;
      product.updatedAt = new Date().toISOString();
    }
  },

  async archiveProduct(id: string): Promise<void> {
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx !== -1) {
      mockProducts.splice(idx, 1);
    }
  }
};
