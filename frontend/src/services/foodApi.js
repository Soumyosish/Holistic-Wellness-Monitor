import axios from 'axios';

// API Configuration
// Get your free key at: https://fdc.nal.usda.gov/api-key-signup.html
const API_KEY = import.meta.env.VITE_USDA_API_KEY || 'DEMO_KEY'; // DEMO_KEY has 30 req/hour limit
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export const foodApi = {
  /**
   * Search for foods using the USDA FoodData Central API
   * @param {string} query - The search term (e.g., "apple")
   * @returns {Promise<Array>} - Array of mapped food items
   */
  async search(query) {
    try {
      const response = await axios.get(`${BASE_URL}/foods/search`, {
        params: {
          api_key: API_KEY,
          query: query,
          pageSize: 10,
          dataType: ['Foundation', 'SR Legacy'] // Focus on basic foods first
        }
      });

      return response.data.foods.map(food => {
        // Helper to find nutrient value by ID
        const getNutrient = (id) => {
          const n = food.foodNutrients.find(n => n.nutrientId === id);
          return n ? n.value : 0;
        };

        return {
          foodId: food.fdcId,
          label: food.description,
          // Nutrient IDs: 1008=Calories, 1003=Protein, 1004=Fat, 1005=Carbs
          calories: getNutrient(1008),
          protein: getNutrient(1003),
          fat: getNutrient(1004),
          carbs: getNutrient(1005),
          servingUnit: food.servingSizeUnit || 'g',
          servingWeight: food.servingSize || 100
        };
      });
    } catch (error) {
      console.warn("USDA API request failed. Using fallback data.", error);
      // Fallback/Mock data if request fails (e.g., rate limit)
      return new Promise(resolve => setTimeout(() => resolve(getMockResults(query)), 500));
    }
  }
};

// Helper for 'Offline/Error' mode
const getMockResults = (query) => {
  const commonFoods = [
    { foodId: 'mock1', label: 'Apple (Raw)', calories: 52, protein: 0.3, fat: 0.2, carbs: 14, servingUnit: 'medium' },
    { foodId: 'mock2', label: 'Banana (Raw)', calories: 89, protein: 1.1, fat: 0.3, carbs: 23, servingUnit: 'medium' },
    { foodId: 'mock3', label: 'Chicken Breast (Cooked)', calories: 165, protein: 31, fat: 3.6, carbs: 0, servingUnit: '100g' },
    { foodId: 'mock4', label: 'Rice (White, Cooked)', calories: 130, protein: 2.7, fat: 0.3, carbs: 28, servingUnit: '100g' },
    { foodId: 'mock5', label: 'Egg (Boiled)', calories: 155, protein: 13, fat: 11, carbs: 1.1, servingUnit: 'large' },
  ];
  return commonFoods.filter(f => f.label.toLowerCase().includes(query.toLowerCase()));
};
