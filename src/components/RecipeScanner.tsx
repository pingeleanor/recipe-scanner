'use client';

import React, { useState } from 'react';
import { createWorker} from 'tesseract.js';
import Tesseract from 'tesseract.js';

interface RecipeScannerProps {
  imageSrc: string;
  onTextExtracted: (text: string) => void;
}

const RecipeScanner: React.FC<RecipeScannerProps> = ({ imageSrc, onTextExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  const processImage = async () => {
    setIsProcessing(true);
    try {
      const worker = await createWorker('eng+deu+chi_sim+chi_tra');
      
      await worker.setParameters({
        tessedit_ocr_engine_mode: '1',
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        preserve_interword_spaces: '1',
      });

      const { data: { text } } = await worker.recognize(imageSrc);
      
      await worker.terminate();
      
      const cleanedText = text
        .replace(/\n\s*\n/g, '\n')
        .replace(/^\s+|\s+$/gm, '')
        .trim();
      
      setExtractedText(cleanedText);
      onTextExtracted(cleanedText);
    } catch (error) {
      console.error('OCR processing failed:', error);
      setExtractedText('文字识别失败，请重试 / Texterkennung fehlgeschlagen, bitte erneut versuchen');
      onTextExtracted('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative group">
          <img 
            src={imageSrc} 
            alt="Captured recipe" 
            className="max-w-md w-full rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <button
          onClick={processImage}
          disabled={isProcessing}
          className={`flex items-center gap-3 font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${
            isProcessing 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-lg">Processing...</span>
            </>
          ) : (
            <>
              <span className="text-2xl">🔍</span>
              <span className="text-lg">Extract Text</span>
            </>
          )}
        </button>
      </div>
      
      {extractedText && (
        <div className="backdrop-blur-sm bg-white/80 border border-white/30 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Extracted Text</h3>
          </div>
          <div className="bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 max-h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">{extractedText}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeScanner;