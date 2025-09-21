import React, { useState, useCallback, useRef } from 'react';
import { PREMADE_MANNEQUINS } from '../constants';
import { Mannequin, ImageFile, GeneratedResult, ProductCategory } from '../types';
import { toBase64 } from '../utils/fileUtils';
import { generateVirtualTryOn } from '../services/geminiService';
import Loader from '../components/Loader';
import UploadIcon from '../components/icons/UploadIcon';

const StepCard: React.FC<{
  step: number;
  title: string;
  children: React.ReactNode;
}> = ({ step, title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <div className="flex items-center mb-4">
      <div className="flex-shrink-0 bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
        {step}
      </div>
      <h3 className="mr-4 text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

const MannequinSelector: React.FC<{
  onSelect: (mannequin: Mannequin | File) => void;
  selectedId: string | null;
}> = ({ onSelect, selectedId }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSelect(e.target.files[0]);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {PREMADE_MANNEQUINS.map((m) => (
          <div
            key={m.id}
            onClick={() => onSelect(m)}
            className={`cursor-pointer rounded-lg overflow-hidden border-4 transition-all duration-200 ${
              selectedId === m.id ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-blue-300'
            }`}
          >
            <img src={m.imageUrl} alt={m.name} className="w-full h-auto object-cover aspect-[2/3]" />
            <p className="text-center bg-gray-100 py-1 text-sm font-medium text-gray-700">{m.name}</p>
          </div>
        ))}
        <label
          className={`cursor-pointer rounded-lg border-4 bg-gray-50 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 aspect-[2/3] ${
            selectedId === 'custom' ? 'border-blue-500 shadow-lg' : 'border-dashed border-gray-300'
          }`}
        >
          <UploadIcon className="w-10 h-10 mb-2" />
          <span className="text-center text-sm font-semibold">آپلود مانکن شخصی</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
    </div>
  );
};

const ProductUploader: React.FC<{
    onUpload: (file: File) => void;
    productPreview: string | null;
    onCategoryChange: (category: ProductCategory) => void;
    selectedCategory: ProductCategory;
    onDescriptionChange: (description: string) => void;
    description: string;
}> = ({ onUpload, productPreview, onCategoryChange, selectedCategory, onDescriptionChange, description }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    const categories: { id: ProductCategory; label: string }[] = [
        { id: 'clothing', label: 'لباس' },
        { id: 'shoes', label: 'کفش' },
        { id: 'necklace', label: 'گردنبند' },
        { id: 'earrings', label: 'گوشواره' },
        { id: 'scarf', label: 'روسری' },
        { id: 'bag', label: 'کیف' },
    ];

    return (
        <div className="w-full space-y-6">
            {productPreview ? (
                 <div className="relative group">
                    <img src={productPreview} alt="Product Preview" className="w-full max-w-sm mx-auto rounded-lg shadow-inner" />
                     <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                        تغییر عکس
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                 </div>
            ) : (
                <label className="w-full max-w-sm mx-auto flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <UploadIcon className="w-12 h-12 text-gray-400 mb-3" />
                    <span className="text-gray-600 font-medium">برای آپلود کلیک کنید یا فایل را بکشید</span>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
            )}

            <fieldset>
                <legend className="text-center font-medium text-gray-700 mb-3">نوع محصول را مشخص کنید:</legend>
                <div className="flex justify-center items-center gap-2 flex-wrap">
                    {categories.map(cat => (
                        <div key={cat.id}>
                            <input
                                type="radio"
                                name="productCategory"
                                id={cat.id}
                                value={cat.id}
                                checked={selectedCategory === cat.id}
                                onChange={() => onCategoryChange(cat.id)}
                                className="sr-only peer"
                            />
                            <label
                                htmlFor={cat.id}
                                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                                    peer-checked:bg-blue-600 peer-checked:text-white peer-checked:shadow-md peer-checked:border-blue-600
                                    bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent
                                `}
                            >
                                {cat.label}
                            </label>
                        </div>
                    ))}
                </div>
            </fieldset>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 text-center mb-2">
                    توضیحات (اختیاری)
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={2}
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="مثال: کفش اسپرت سفید روی پای چپ"
                ></textarea>
            </div>
        </div>
    );
};

interface TryOnStudioProps {
  onGenerate: (result: GeneratedResult) => void;
}

const TryOnStudio: React.FC<TryOnStudioProps> = ({ onGenerate }) => {
    const [selectedMannequinFile, setSelectedMannequinFile] = useState<ImageFile | null>(null);
    const [selectedMannequinId, setSelectedMannequinId] = useState<string | null>(null);
    const [productFile, setProductFile] = useState<ImageFile | null>(null);
    const [productPreview, setProductPreview] = useState<string | null>(null);
    const [productCategory, setProductCategory] = useState<ProductCategory>('clothing');
    const [productDescription, setProductDescription] = useState('');

    const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const [zoomLevel, setZoomLevel] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStart = useRef({ x: 0, y: 0 });


    const handleMannequinSelect = useCallback(async (selection: Mannequin | File) => {
        setIsLoading(true);
        setLoadingMessage('در حال پردازش مانکن...');
        if (selection instanceof File) {
            const imageFile = await toBase64(selection);
            setSelectedMannequinFile(imageFile);
            setSelectedMannequinId('custom');
        } else {
            // For premade mannequins, we'll fetch and convert them to base64.
            const response = await fetch(selection.imageUrl);
            const blob = await response.blob();
            const file = new File([blob], `${selection.id}.jpg`, { type: 'image/jpeg' });
            const imageFile = await toBase64(file);
            setSelectedMannequinFile(imageFile);
            setSelectedMannequinId(selection.id);
        }
        setIsLoading(false);
    }, []);

    const handleProductUpload = useCallback(async (file: File) => {
        setProductPreview(URL.createObjectURL(file));
        const imageFile = await toBase64(file);
        setProductFile(imageFile);
    }, []);

    const handleGenerate = async () => {
        if (!selectedMannequinFile || !productFile) {
            setError('لطفاً هم مانکن و هم محصول را انتخاب کنید.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedResult(null);

        try {
            setLoadingMessage('در حال آماده‌سازی تصاویر...');
            await new Promise(res => setTimeout(res, 500));
            
            setLoadingMessage('ارسال به هوش مصنوعی...');
            const resultBase64 = await generateVirtualTryOn(selectedMannequinFile, productFile, productCategory, productDescription);

            setLoadingMessage('در حال ساخت تصویر نهایی...');
            const newResult: GeneratedResult = {
                id: new Date().toISOString(),
                mannequinImage: `data:${selectedMannequinFile.mimeType};base64,${selectedMannequinFile.base64}`,
                productImage: `data:${productFile.mimeType};base64,${productFile.base64}`,
                resultImage: `data:image/png;base64,${resultBase64}`,
                prompt: 'Virtual Try-On',
                timestamp: new Date(),
                productCategory: productCategory
            };
            setGeneratedResult(newResult);
            onGenerate(newResult);

            let initialZoom = 1;
            switch(newResult.productCategory) {
                case 'necklace': initialZoom = 2.5; break;
                case 'earrings': initialZoom = 3; break;
                case 'shoes': initialZoom = 2.5; break;
                case 'scarf': initialZoom = 2; break;
                case 'bag': initialZoom = 1.5; break;
            }
            setZoomLevel(initialZoom);
            setPan({ x: 0, y: 0 });


        } catch (err: any) {
            setError(err.message || 'یک خطای ناشناخته رخ داد.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (zoomLevel <= 1) return;
        e.preventDefault();
        panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
        setIsPanning(true);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isPanning || zoomLevel <= 1) return;
        e.preventDefault();
        setPan({
            x: e.clientX - panStart.current.x,
            y: e.clientY - panStart.current.y
        });
    };

    const handleMouseUpOrLeave = () => {
        setIsPanning(false);
    };

    const isGenerateDisabled = !selectedMannequinFile || !productFile || isLoading;

    return (
        <div className="container mx-auto max-w-7xl space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">استودیو پرو مجازی</h1>
                <p className="mt-2 text-lg text-gray-600">محصولات را قبل از خرید به صورت آنلاین امتحان کنید</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                     <StepCard step={1} title="یک مانکن انتخاب کنید">
                        <MannequinSelector onSelect={handleMannequinSelect} selectedId={selectedMannequinId} />
                    </StepCard>

                    <StepCard step={2} title="محصول خود را آپلود کنید">
                        <ProductUploader 
                            onUpload={handleProductUpload} 
                            productPreview={productPreview}
                            onCategoryChange={setProductCategory}
                            selectedCategory={productCategory}
                            onDescriptionChange={setProductDescription}
                            description={productDescription}
                        />
                    </StepCard>
                </div>

                <div className="lg:sticky lg:top-24">
                     <StepCard step={3} title="نتیجه را مشاهده کنید">
                        <div className="relative min-h-[300px]">
                            {isLoading && <Loader message={loadingMessage} />}
                            {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg text-center">{error}</div>}
                            
                            {!isLoading && !generatedResult && !error && (
                                <div className="text-center text-gray-500 py-12">
                                    <p>نتیجه نهایی در اینجا نمایش داده می‌شود.</p>
                                </div>
                            )}

                            {generatedResult && (
                                <div>
                                    <h4 className="font-semibold mb-4 text-center">مقایسه قبل و بعد</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="border rounded-lg p-2">
                                            <p className="text-sm text-center mb-1 font-medium">اصلی</p>
                                            <img src={generatedResult.mannequinImage} alt="Mannequin" className="rounded-md w-full" />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="border-2 border-green-500 rounded-lg p-2 shadow-lg">
                                                <p className="text-sm text-center mb-1 font-medium text-green-700">نتیجه نهایی</p>
                                                 <div 
                                                    className="rounded-md overflow-hidden aspect-[2/3] bg-gray-100 relative"
                                                    onMouseDown={handleMouseDown}
                                                    onMouseMove={handleMouseMove}
                                                    onMouseUp={handleMouseUpOrLeave}
                                                    onMouseLeave={handleMouseUpOrLeave}
                                                 >
                                                     <img 
                                                        src={generatedResult.resultImage} 
                                                        alt="Generated Result" 
                                                        className="w-full h-full object-cover"
                                                        style={{ 
                                                          transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
                                                          cursor: zoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
                                                          willChange: 'transform'
                                                        }}
                                                        draggable="false"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                                                <label htmlFor="zoom" className="block text-sm font-medium text-gray-700 text-center mb-1">
                                                    بزرگ‌نمایی: {Math.round(zoomLevel * 100)}%
                                                </label>
                                                <input
                                                    id="zoom"
                                                    type="range"
                                                    min="1"
                                                    max="5"
                                                    step="0.1"
                                                    value={zoomLevel}
                                                    onChange={(e) => {
                                                        const newZoom = parseFloat(e.target.value);
                                                        setZoomLevel(newZoom);
                                                        if (newZoom <= 1) {
                                                            setPan({ x: 0, y: 0 });
                                                        }
                                                    }}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <a 
                                      href={generatedResult.resultImage} 
                                      download={`virtual_try_on_${Date.now()}.png`}
                                      className="mt-6 w-full bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                                    >
                                        دانلود تصویر
                                    </a>
                                </div>
                            )}
                        </div>
                    </StepCard>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerateDisabled}
                        className={`w-full mt-6 py-4 px-6 text-lg font-bold rounded-lg transition-all duration-300 transform
                        ${isGenerateDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-lg hover:shadow-xl'}`}
                    >
                       {isLoading ? 'در حال پردازش...' : 'ایجاد تصویر'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TryOnStudio;