'use client';

import React, { useState, useEffect } from 'react';
import { Ingredient } from '@/utils/recipeParser';

interface ShoppingListProps {
  ingredients: Ingredient[];
}

const ShoppingList: React.FC<ShoppingListProps> = ({ ingredients }) => {
  const [shoppingList, setShoppingList] = useState<Ingredient[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedList = localStorage.getItem('shoppingList');
    const savedChecked = localStorage.getItem('checkedItems');
    
    if (savedList) {
      setShoppingList(JSON.parse(savedList));
    }
    
    if (savedChecked) {
      setCheckedItems(new Set(JSON.parse(savedChecked)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('checkedItems', JSON.stringify([...checkedItems]));
  }, [checkedItems]);

  const addIngredientsToList = () => {
    const newIngredients = ingredients.filter(
      ingredient => !shoppingList.some(item => 
        item.name.toLowerCase() === ingredient.name.toLowerCase()
      )
    );
    
    setShoppingList(prev => [...prev, ...newIngredients]);
  };

  const removeIngredient = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const clearList = () => {
    setShoppingList([]);
    setCheckedItems(new Set());
  };

  const clearCheckedItems = () => {
    const uncheckedItems = shoppingList.filter(item => !checkedItems.has(item.id));
    setShoppingList(uncheckedItems);
    setCheckedItems(new Set());
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Shopping List</h2>
        <div className="space-x-2">
          {ingredients.length > 0 && (
            <button
              onClick={addIngredientsToList}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
            >
              Add to List ({ingredients.length})
            </button>
          )}
          {shoppingList.length > 0 && (
            <>
              <button
                onClick={clearCheckedItems}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Remove Checked
              </button>
              <button
                onClick={clearList}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {ingredients.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Parsed Ingredients:</h3>
          <div className="space-y-2">
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="text-sm">
                <span className="font-medium">{ingredient.amount} {ingredient.unit}</span> {ingredient.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {shoppingList.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Your shopping list is empty. Scan a recipe to add ingredients!
        </p>
      ) : (
        <div className="space-y-3">
          {shoppingList.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 border rounded-lg ${
                checkedItems.has(item.id) 
                  ? 'bg-gray-100 text-gray-500 line-through' 
                  : 'bg-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={checkedItems.has(item.id)}
                  onChange={() => toggleCheck(item.id)}
                  className="w-5 h-5"
                />
                <div>
                  <span className="font-medium">
                    {item.amount} {item.unit}
                  </span>{' '}
                  {item.name}
                </div>
              </div>
              <button
                onClick={() => removeIngredient(item.id)}
                className="text-red-500 hover:text-red-700 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Total items: {shoppingList.length} | 
        Checked: {checkedItems.size} | 
        Remaining: {shoppingList.length - checkedItems.size}
      </div>
    </div>
  );
};

export default ShoppingList;