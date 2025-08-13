'use client';

import React, { useState, useEffect } from 'react';

interface Recipe {
  id: string;
  ingredientsText: string;
  stepsText: string;
  title: string;
  createdAt: string;
}

interface RecipeStorageProps {
  ingredientsImage: string;
  stepsImage: string;
  ingredientsText: string;
  stepsText: string;
  onSaved: () => void;
}

const RecipeStorage: React.FC<RecipeStorageProps> = ({ ingredientsImage, stepsImage, ingredientsText, stepsText, onSaved }) => {
  const [title, setTitle] = useState('');

  const saveRecipe = () => {
    if (!title.trim()) {
      alert('Please enter a recipe title');
      return;
    }

    const recipe: Recipe = {
      id: Date.now().toString(),
      ingredientsText,
      stepsText,
      title: title.trim(),
      createdAt: new Date().toISOString()
    };

    const saved = localStorage.getItem('savedRecipes');
    const existingRecipes = saved ? JSON.parse(saved) : [];
    const updatedRecipes = [...existingRecipes, recipe];
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
    
    setTitle('');
    onSaved();
    alert('🎉 Complete recipe saved successfully with ingredients and steps!');
  };

  return (
    <div className="space-y-8">
      <div className="backdrop-blur-sm bg-white/80 border border-white/30 p-8 rounded-2xl shadow-xl">
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Recipe Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your recipe..."
              className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm bg-white/60"
            />
          </div>
          
          <button
            onClick={saveRecipe}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span className="text-xl">💾</span>
            <span className="text-lg">Save Complete Recipe</span>
          </button>
          
          <div className="mt-4 p-4 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>📋 Recipe includes:</strong>
            </p>
            <ul className="text-sm text-green-600 mt-2 space-y-1">
              <li>• Ingredients text (extracted and edited)</li>
              <li>• Cooking steps text (extracted and edited)</li>
              <li>• Recipe title you specify above</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeStorage;