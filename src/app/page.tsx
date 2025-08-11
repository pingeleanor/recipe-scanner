'use client';

import React, { useState } from 'react';
import CameraCapture from '@/components/CameraCapture';
import RecipeScanner from '@/components/RecipeScanner';
import RecipeStorage from '@/components/RecipeStorage';

export default function Home() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');

  const handleImageCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setExtractedText('');
  };

  const handleTextExtracted = (text: string) => {
    setExtractedText(text);
  };

  const resetApp = () => {
    setCapturedImage(null);
    setExtractedText('');
  };

  const handleRecipeSaved = () => {
    // Could optionally reset after saving, or keep the current state
    // resetApp();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <span className="text-2xl">📖</span>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Recipe Scanner
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your recipe images into organized digital collections with AI-powered text extraction
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {!capturedImage ? (
            <div className="backdrop-blur-sm bg-white/70 border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <h2 className="text-2xl font-bold text-gray-800">Capture Recipe</h2>
              </div>
              <CameraCapture onCapture={handleImageCapture} />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="backdrop-blur-sm bg-white/70 border border-white/20 p-8 rounded-3xl shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <h2 className="text-2xl font-bold text-gray-800">Extract Text</h2>
                  </div>
                  <button
                    onClick={resetApp}
                    className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    🔄 Start Over
                  </button>
                </div>
                <RecipeScanner
                  imageSrc={capturedImage}
                  onTextExtracted={handleTextExtracted}
                />
              </div>
              
              {extractedText && capturedImage && (
                <div className="backdrop-blur-sm bg-white/70 border border-white/20 p-8 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <h2 className="text-2xl font-bold text-gray-800">Save Recipe</h2>
                  </div>
                  <RecipeStorage
                    image={capturedImage}
                    text={extractedText}
                    onSaved={handleRecipeSaved}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <p className="text-gray-600 font-medium">Your recipes are securely stored locally</p>
          </div>
        </div>
      </div>
    </div>
  );
}