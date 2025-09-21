import React, { useState } from 'react';
import { GeneratedResult } from '../types';
import ConfirmationDialog from '../components/ConfirmationDialog';

interface DashboardProps {
  results: GeneratedResult[];
  onDelete: (id: string) => void;
}

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const Dashboard: React.FC<DashboardProps> = ({ results, onDelete }) => {
  const [resultToDelete, setResultToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setResultToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (resultToDelete) {
      onDelete(resultToDelete);
      setResultToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setResultToDelete(null);
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">داشبورد شما</h1>
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">تاریخچه پروها</h2>
        
        {results.length === 0 ? (
          <div className="mt-8 border-2 border-dashed border-gray-200 rounded-lg py-16 text-center">
            <p className="text-gray-400">هنوز هیچ تصویری ایجاد نکرده‌اید.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((result) => (
              <div key={result.id} className="group relative border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                <img src={result.resultImage} alt="Generated result" className="w-full h-auto object-cover aspect-[2/3]" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleDeleteClick(result.id)}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-red-500"
                    aria-label="حذف تصویر"
                  >
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={!!resultToDelete}
        title="حذف تصویر"
        message="آیا از حذف این تصویر مطمئن هستید؟ این عمل غیرقابل بازگشت است."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Dashboard;
