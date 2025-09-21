export interface Mannequin {
  id: string;
  name: string;
  imageUrl: string;
}

export interface ImageFile {
  name: string;
  base64: string;
  mimeType: string;
}

export type ProductCategory = 'clothing' | 'necklace' | 'earrings' | 'shoes' | 'scarf' | 'bag';

export interface GeneratedResult {
  id: string;
  mannequinImage: string;
  productImage: string;
  resultImage: string;
  prompt: string;
  timestamp: Date;
  productCategory: ProductCategory;
}