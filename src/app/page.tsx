'use client';

import React, { useState, useEffect } from 'react';
import CameraCapture from '@/components/CameraCapture';
import RecipeScanner from '@/components/RecipeScanner';
import RecipeStorage from '@/components/RecipeStorage';

type SectionType = 'ingredients' | 'steps';

interface Recipe {
  id: string;
  ingredientsText: string;
  stepsText: string;
  title: string;
  createdAt: string;
}

export default function Home() {
  const [currentSection, setCurrentSection] = useState<SectionType | null>(null);
  const [ingredientsImage, setIngredientsImage] = useState<string | null>(null);
  const [stepsImage, setStepsImage] = useState<string | null>(null);
  const [ingredientsText, setIngredientsText] = useState<string>('');
  const [stepsText, setStepsText] = useState<string>('');
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = () => {
    const saved = localStorage.getItem('savedRecipes');
    if (saved) {
      setSavedRecipes(JSON.parse(saved));
    }
  };

  const deleteRecipe = (id: string) => {
    const updatedRecipes = savedRecipes.filter(recipe => recipe.id !== id);
    setSavedRecipes(updatedRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
  };

  const handleImageCapture = (imageSrc: string) => {
    if (currentSection === 'ingredients') {
      setIngredientsImage(imageSrc);
      setIngredientsText('');
    } else if (currentSection === 'steps') {
      setStepsImage(imageSrc);
      setStepsText('');
    }
  };

  const handleTextExtracted = (text: string) => {
    if (currentSection === 'ingredients') {
      setIngredientsText(text);
    } else if (currentSection === 'steps') {
      setStepsText(text);
    }
  };

  const resetApp = () => {
    setCurrentSection(null);
    setIngredientsImage(null);
    setStepsImage(null);
    setIngredientsText('');
    setStepsText('');
  };

  const handleRecipeSaved = () => {
    loadSavedRecipes(); // Reload recipes after saving
    // resetApp(); // Could optionally reset after saving
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

        <div className="max-w-6xl mx-auto">
          {!currentSection ? (
            <div className="backdrop-blur-sm bg-white/70 border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <h2 className="text-2xl font-bold text-gray-800">Choose Section to Capture</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setCurrentSection('ingredients')}
                  className="group relative overflow-hidden bg-gradient-to-br from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">🥕</div>
                    <h3 className="text-2xl font-bold">Ingredients</h3>
                    <p className="text-orange-100">Capture the ingredients list</p>
                  </div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <button
                  onClick={() => setCurrentSection('steps')}
                  className="group relative overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">📝</div>
                    <h3 className="text-2xl font-bold">Steps</h3>
                    <p className="text-blue-100">Capture the cooking instructions</p>
                  </div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Section Navigation */}
              <div className="backdrop-blur-sm bg-white/70 border border-white/20 p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCurrentSection('ingredients')}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        currentSection === 'ingredients'
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                          : 'bg-white/50 text-gray-600 hover:bg-white/70'
                      }`}
                    >
                      🥕 Ingredients {ingredientsText && '✓'}
                    </button>
                    <button
                      onClick={() => setCurrentSection('steps')}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        currentSection === 'steps'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'bg-white/50 text-gray-600 hover:bg-white/70'
                      }`}
                    >
                      📝 Steps {stepsText && '✓'}
                    </button>
                  </div>
                  <button
                    onClick={resetApp}
                    className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    🔄 Start Over
                  </button>
                </div>
              </div>

              {/* Current Section Content */}
              {currentSection && (
                <div>
                  {/* Capture Phase */}
                  {(currentSection === 'ingredients' && !ingredientsImage) || 
                   (currentSection === 'steps' && !stepsImage) ? (
                    <div className="backdrop-blur-sm bg-white/70 border border-white/20 p-8 rounded-3xl shadow-xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          currentSection === 'ingredients' 
                            ? 'bg-gradient-to-r from-orange-500 to-red-600' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}>
                          {currentSection === 'ingredients' ? '🥕' : '📝'}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          Capture {currentSection === 'ingredients' ? 'Ingredients' : 'Steps'}
                        </h2>
                      </div>
                      <CameraCapture onCapture={handleImageCapture} />
                    </div>
                  ) : (
                    /* Extract Phase */
                    <div className="backdrop-blur-sm bg-white/70 border border-white/20 p-8 rounded-3xl shadow-xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          currentSection === 'ingredients' 
                            ? 'bg-gradient-to-r from-orange-500 to-red-600' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}>
                          🔍
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          Extract {currentSection === 'ingredients' ? 'Ingredients' : 'Steps'} Text
                        </h2>
                      </div>
                      <RecipeScanner
                        imageSrc={currentSection === 'ingredients' ? ingredientsImage! : stepsImage!}
                        onTextExtracted={handleTextExtracted}
                        sectionType={currentSection}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Save Recipe Section - Show when both sections have text */}
              {ingredientsText && stepsText && (
                <div className="backdrop-blur-sm bg-white/70 border border-white/20 p-8 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">💾</div>
                    <h2 className="text-2xl font-bold text-gray-800">Save Complete Recipe</h2>
                  </div>
                  <RecipeStorage
                    ingredientsImage={ingredientsImage!}
                    stepsImage={stepsImage!}
                    ingredientsText={ingredientsText}
                    stepsText={stepsText}
                    onSaved={handleRecipeSaved}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Saved Recipes Section */}
        {savedRecipes.length > 0 && (
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="backdrop-blur-sm bg-white/80 border border-white/30 p-8 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  {savedRecipes.length}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Your Saved Recipes</h2>
              </div>

              <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                {savedRecipes.map((recipe) => (
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
                        <div className="bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 max-h-40 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">{recipe.ingredientsText}</pre>
                        </div>
                      </div>

                      {/* Steps Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">📝</span>
                          <h4 className="font-semibold text-gray-800">Cooking Steps</h4>
                        </div>
                        <div className="bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 max-h-40 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">{recipe.stepsText}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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