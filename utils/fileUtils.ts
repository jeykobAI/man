
import { ImageFile } from '../types';

export const toBase64 = (file: File): Promise<ImageFile> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve({ name: file.name, base64, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
