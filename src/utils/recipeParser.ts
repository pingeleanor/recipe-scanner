export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export const parseRecipeText = (text: string): Ingredient[] => {
  const ingredients: Ingredient[] = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  // Common measurement units
  const units = [
    'cup', 'cups', 'tbsp', 'tablespoon', 'tablespoons', 'tsp', 'teaspoon', 'teaspoons',
    'oz', 'ounce', 'ounces', 'lb', 'pound', 'pounds', 'g', 'gram', 'grams',
    'kg', 'kilogram', 'kilograms', 'ml', 'milliliter', 'milliliters',
    'l', 'liter', 'liters', 'pint', 'pints', 'quart', 'quarts', 'gallon', 'gallons',
    'clove', 'cloves', 'piece', 'pieces', 'slice', 'slices', 'can', 'cans',
    'package', 'packages', 'bottle', 'bottles'
  ];
  
  // Patterns for ingredients
  const ingredientPatterns = [
    // Pattern: "2 cups flour" or "1/2 cup sugar"
    /^(\d+(?:\/\d+)?|\d+\.\d+)\s+(\w+)\s+(.+)$/i,
    // Pattern: "2-3 cups flour"
    /^(\d+[-–]\d+)\s+(\w+)\s+(.+)$/i,
    // Pattern: "A pinch of salt" or "Salt to taste"
    /^(a\s+(?:pinch|dash|handful)\s+of|to\s+taste)\s*(.+)$/i,
    // Pattern: Just ingredient name
    /^([a-zA-Z\s,]+)$/
  ];

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines and common recipe headers
    if (!trimmedLine || 
        /^(ingredients?|directions?|instructions?|method|recipe|prep|cook)/i.test(trimmedLine) ||
        trimmedLine.length < 3) {
      continue;
    }

    let matched = false;
    
    for (const pattern of ingredientPatterns) {
      const match = trimmedLine.match(pattern);
      
      if (match) {
        let amount = '';
        let unit = '';
        let name = '';
        
        if (pattern === ingredientPatterns[0] || pattern === ingredientPatterns[1]) {
          // Structured ingredient with amount and unit
          amount = match[1];
          const potentialUnit = match[2].toLowerCase();
          
          if (units.includes(potentialUnit)) {
            unit = match[2];
            name = match[3];
          } else {
            // No valid unit found, treat as part of name
            name = `${match[2]} ${match[3]}`;
          }
        } else if (pattern === ingredientPatterns[2]) {
          // Special cases like "a pinch of" or "to taste"
          amount = match[1];
          name = match[2];
        } else {
          // Just ingredient name
          name = match[1];
        }
        
        // Clean up the ingredient name
        name = name.replace(/[,\.\-\(\)]/g, '').trim();
        
        if (name && name.length > 1) {
          ingredients.push({
            id: Math.random().toString(36).substr(2, 9),
            name: name,
            amount: amount || '1',
            unit: unit || 'item'
          });
          matched = true;
          break;
        }
      }
    }
    
    // If no pattern matched but line looks like an ingredient, add it anyway
    if (!matched && trimmedLine.length > 2 && 
        !/\d{1,2}:\d{2}|minutes?|hours?|degrees?|°[CF]|step\s+\d+/i.test(trimmedLine)) {
      const cleanName = trimmedLine.replace(/[,\.\-\(\)]/g, '').trim();
      if (cleanName.length > 1) {
        ingredients.push({
          id: Math.random().toString(36).substr(2, 9),
          name: cleanName,
          amount: '1',
          unit: 'item'
        });
      }
    }
  }
  
  return ingredients;
};