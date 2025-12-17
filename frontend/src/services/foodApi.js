// Get your free key at: https://fdc.nal.usda.gov/api-key-signup.html
const API_KEY = import.meta.env.VITE_USDA_API_KEY || "DEMO_KEY"; // DEMO_KEY has 30 req/hour limit
const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

export const foodApi = {
  /**
   * Search for foods using the USDA FoodData Central API
   * @param {string} query - The search term (e.g., "apple")
   * @returns {Promise<Array>} - Array of mapped food items
   */
  async search(query) {
    try {
      // Construct URL parameters manually to ensure correct formatting for repeated 'dataType'
      const params = new URLSearchParams();
      params.append("api_key", API_KEY);
      params.append("query", query);
      params.append("pageSize", "25");
      // USDA API expects repeated keys for arrays, not brackets (dataType=X&dataType=Y)
      params.append("dataType", "Foundation");
      params.append("dataType", "SR Legacy");
      params.append("dataType", "Branded");

      const url = `${BASE_URL}/foods/search?${params.toString()}`;

      // Debug log (Safe: exposes only first 4 chars of key if needed)
      // console.log(`Fetching from USDA: ${url.replace(API_KEY, API_KEY.substring(0,4) + '...')}`);

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`USDA API responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (!data.foods || !Array.isArray(data.foods)) {
        console.warn("USDA API returned unexpected structure:", data);
        return [];
      }

      return data.foods.map((food) => {
        // Helper to find nutrient value by ID
        const getNutrient = (id) => {
          const n = food.foodNutrients.find((n) => n.nutrientId === id);
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
          servingUnit: food.servingSizeUnit || "g",
          servingWeight: food.servingSize || 100,
        };
      });
    } catch (error) {
      console.error("USDA API request failed:", error);
      console.warn("Falling back to mock data due to API error.");
      
      // Fallback/Mock data if request fails (e.g., rate limit, invalid key)
      return new Promise((resolve) =>
        setTimeout(() => resolve(getMockResults(query)), 500)
      );
    }
  },
};

// Helper for 'Offline/Error' mode
const getMockResults = (query) => {
  const commonFoods = [
    {
      foodId: "mock1",
      label: "Apple (Raw)",
      calories: 52,
      protein: 0.3,
      fat: 0.2,
      carbs: 14,
      servingUnit: "medium",
      servingWeight: 182,
    },
    {
      foodId: "mock2",
      label: "Banana (Raw)",
      calories: 89,
      protein: 1.1,
      fat: 0.3,
      carbs: 23,
      servingUnit: "medium",
      servingWeight: 118,
    },
    {
      foodId: "mock3",
      label: "Chicken Breast (Cooked)",
      calories: 165,
      protein: 31,
      fat: 3.6,
      carbs: 0,
      servingUnit: "100g",
      servingWeight: 100,
    },
    {
      foodId: "mock4",
      label: "Rice (White, Cooked)",
      calories: 130,
      protein: 2.7,
      fat: 0.3,
      carbs: 28,
      servingUnit: "100g",
      servingWeight: 100,
    },
    {
      foodId: "mock5",
      label: "Egg (Boiled)",
      calories: 155,
      protein: 13,
      fat: 11,
      carbs: 1.1,
      servingUnit: "large",
      servingWeight: 50,
    },
  ];
  return commonFoods.filter((f) =>
    f.label.toLowerCase().includes(query.toLowerCase())
  );
};
