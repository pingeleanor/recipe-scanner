'use client';

import React, { useState, useEffect } from 'react';

interface Recipe {
  id: string;
  ingredientsImage: string;
  stepsImage: string;
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
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = () => {
    const saved = localStorage.getItem('savedRecipes');
    if (saved) {
      setSavedRecipes(JSON.parse(saved));
    }
  };

  const saveRecipe = () => {
    if (!title.trim()) {
      alert('Please enter a recipe title');
      return;
    }

    const recipe: Recipe = {
      id: Date.now().toString(),
      ingredientsImage,
      stepsImage,
      ingredientsText,
      stepsText,
      title: title.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedRecipes = [...savedRecipes, recipe];
    setSavedRecipes(updatedRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
    
    setTitle('');
    onSaved();
    alert('Recipe saved successfully!');
  };

  const deleteRecipe = (id: string) => {
    const updatedRecipes = savedRecipes.filter(recipe => recipe.id !== id);
    setSavedRecipes(updatedRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
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
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span className="text-xl">💾</span>
            <span className="text-lg">Save Recipe</span>
          </button>
        </div>
      </div>

      <div className="backdrop-blur-sm bg-white/80 border border-white/30 p-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
              {savedRecipes.length}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Saved Recipes</h2>
          </div>
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            {showSaved ? '👁️ Hide' : '👁️ Show'} Recipes
          </button>
        </div>

        {showSaved && (
          <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
            {savedRecipes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 text-lg">No saved recipes yet.</p>
                <p className="text-gray-400 text-sm mt-2">Start by capturing and saving your first recipe!</p>
              </div>
            ) : (
              savedRecipes.map((recipe) => (
                <div key={recipe.id} className="group backdrop-blur-sm bg-white/60 border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{recipe.title}</h3>
                    <button
                      onClick={() => deleteRecipe(recipe.id)}
                      className="bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <p className="text-sm text-gray-600 font-medium">
                      Saved: {new Date(recipe.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-6">
                    {/* Ingredients Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🥕</span>
                        <h4 className="font-semibold text-gray-800">Ingredients</h4>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="relative group/img">
                          <img
                            src={recipe.ingredientsImage}
                            alt={`${recipe.title} ingredients`}
                            className="w-full h-32 object-cover rounded-xl shadow-md group-hover/img:shadow-lg transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 max-h-32 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">{recipe.ingredientsText}</pre>
                        </div>
                      </div>
                    </div>

                    {/* Steps Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">📝</span>
                        <h4 className="font-semibold text-gray-800">Cooking Steps</h4>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="relative group/img">
                          <img
                            src={recipe.stepsImage}
                            alt={`${recipe.title} steps`}
                            className="w-full h-32 object-cover rounded-xl shadow-md group-hover/img:shadow-lg transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 max-h-32 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">{recipe.stepsText}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeStorage;