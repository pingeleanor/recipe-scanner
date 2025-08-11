'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
      setIsCameraOpen(false);
    }
  }, [onCapture]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        if (imageSrc) {
          onCapture(imageSrc);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onCapture]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: { exact: "environment" } // Use back camera on mobile
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      {!isCameraOpen ? (
        <div className="w-full max-w-lg">
          <p className="text-center text-gray-600 mb-8 text-lg">Choose how to add your recipe image:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setIsCameraOpen(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">📷</div>
                <span className="text-lg">Open Camera</span>
              </div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button
              onClick={triggerFileInput}
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">📁</div>
                <span className="text-lg">Upload Files</span>
              </div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-t-2xl">
            <Webcam
              audio={false}
              height={480}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={640}
              videoConstraints={videoConstraints}
              className="rounded-xl w-full h-auto"
            />
          </div>
          <div className="bg-white p-6 rounded-b-2xl shadow-lg">
            <div className="flex justify-center space-x-4">
              <button
                onClick={capture}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="text-xl">📸</span>
                Capture Photo
              </button>
              <button
                onClick={() => setIsCameraOpen(false)}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="text-xl">✕</span>
                Close Camera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;