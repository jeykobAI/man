import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import TryOnStudio from './views/TryOnStudio';
import Dashboard from './views/Dashboard';
import Pricing from './views/Pricing';
import Login from './views/Login';
import Register from './views/Register';
import { GeneratedResult } from './types';

const App: React.FC = () => {
  const [generatedResults, setGeneratedResults] = useState<GeneratedResult[]>([]);

  const addGeneratedResult = (result: GeneratedResult) => {
    setGeneratedResults(prevResults => [result, ...prevResults]);
  };

  const deleteGeneratedResult = (id: string) => {
    setGeneratedResults(prevResults => prevResults.filter(result => result.id !== id));
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Header />
      <main className="p-4 sm:p-6 md:p-8">
        <Routes>
          <Route path="/" element={<TryOnStudio onGenerate={addGeneratedResult} />} />
          <Route path="/dashboard" element={<Dashboard results={generatedResults} onDelete={deleteGeneratedResult} />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;