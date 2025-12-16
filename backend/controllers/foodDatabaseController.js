import FoodDatabase from "../models/FoodDatabase.js";

/**
 * Search food database
 */
export const searchFood = async (req, res) => {
  try {
    const { query, category, isVeg, limit = 20 } = req.query;
    
    const searchQuery = {};
    
    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }
    
    // Category filter
    if (category) {
      searchQuery.category = category;
    }
    
    // Dietary filter
    if (isVeg !== undefined) {
      searchQuery.isVeg = isVeg === 'true';
    }
    
    const foods = await FoodDatabase.find(searchQuery)
      .limit(parseInt(limit))
      .sort(query ? { score: { $meta: "textScore" }, popularityScore: -1 } : { popularityScore: -1 });
    
    res.json(foods);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Get food by ID
 */
export const getFoodById = async (req, res) => {
  try {
    const food = await FoodDatabase.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ msg: "Food not found" });
    }
    
    // Increment popularity score
    food.popularityScore += 1;
    await food.save();
    
    res.json(food);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Add food to database (admin/user contribution)
 */
export const addFood = async (req, res) => {
  try {
    const foodData = req.body;
    const food = await FoodDatabase.create(foodData);
    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Get popular foods
 */
export const getPopularFoods = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const foods = await FoodDatabase.find()
      .sort({ popularityScore: -1 })
      .limit(parseInt(limit));
    res.json(foods);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Get foods by category
 */
export const getFoodsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const foods = await FoodDatabase.find({ category })
      .sort({ popularityScore: -1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Seed initial food database with common Indian and international foods
 */
export const seedFoodDatabase = async (req, res) => {
  try {
    const existingCount = await FoodDatabase.countDocuments();
    if (existingCount > 0) {
      return res.json({ msg: "Database already seeded", count: existingCount });
    }

    const commonFoods = [
      // Fruits
      { name: "Apple", category: "fruits", calories: 52, protein: 0.3, carbs: 14, fats: 0.2, fiber: 2.4, sugar: 10, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Banana", category: "fruits", calories: 89, protein: 1.1, carbs: 23, fats: 0.3, fiber: 2.6, sugar: 12, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Orange", category: "fruits", calories: 47, protein: 0.9, carbs: 12, fats: 0.1, fiber: 2.4, sugar: 9, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Mango", category: "fruits", calories: 60, protein: 0.8, carbs: 15, fats: 0.4, fiber: 1.6, sugar: 14, isVeg: true, isVegan: true, servingSize: "100g" },
      
      // Vegetables
      { name: "Broccoli", category: "vegetables", calories: 34, protein: 2.8, carbs: 7, fats: 0.4, fiber: 2.6, sugar: 1.7, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Spinach", category: "vegetables", calories: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2, sugar: 0.4, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Tomato", category: "vegetables", calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2, fiber: 1.2, sugar: 2.6, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Potato", category: "vegetables", calories: 77, protein: 2, carbs: 17, fats: 0.1, fiber: 2.2, sugar: 0.8, isVeg: true, isVegan: true, servingSize: "100g" },
      
      // Grains
      { name: "White Rice (cooked)", category: "grains", calories: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4, sugar: 0.1, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Brown Rice (cooked)", category: "grains", calories: 111, protein: 2.6, carbs: 23, fats: 0.9, fiber: 1.8, sugar: 0.4, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Whole Wheat Bread", category: "grains", calories: 247, protein: 13, carbs: 41, fats: 3.4, fiber: 7, sugar: 6, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Oats", category: "grains", calories: 389, protein: 17, carbs: 66, fats: 7, fiber: 11, sugar: 1, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Roti (Chapati)", category: "grains", calories: 297, protein: 11, carbs: 51, fats: 7, fiber: 7, sugar: 2, isVeg: true, isVegan: true, servingSize: "100g" },
      
      // Protein
      { name: "Chicken Breast (cooked)", category: "protein", calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, sugar: 0, isVeg: false, isVegan: false, servingSize: "100g" },
      { name: "Eggs (boiled)", category: "protein", calories: 155, protein: 13, carbs: 1.1, fats: 11, fiber: 0, sugar: 1.1, isVeg: true, isVegan: false, servingSize: "100g" },
      { name: "Paneer", category: "protein", calories: 265, protein: 18, carbs: 3.4, fats: 20, fiber: 0, sugar: 2.6, isVeg: true, isVegan: false, servingSize: "100g" },
      { name: "Tofu", category: "protein", calories: 76, protein: 8, carbs: 1.9, fats: 4.8, fiber: 0.3, sugar: 0.7, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Lentils (cooked)", category: "protein", calories: 116, protein: 9, carbs: 20, fats: 0.4, fiber: 8, sugar: 1.8, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Chickpeas (cooked)", category: "protein", calories: 164, protein: 8.9, carbs: 27, fats: 2.6, fiber: 7.6, sugar: 4.8, isVeg: true, isVegan: true, servingSize: "100g" },
      
      // Dairy
      { name: "Milk (whole)", category: "dairy", calories: 61, protein: 3.2, carbs: 4.8, fats: 3.3, fiber: 0, sugar: 5.1, isVeg: true, isVegan: false, servingSize: "100ml" },
      { name: "Yogurt (plain)", category: "dairy", calories: 59, protein: 3.5, carbs: 4.7, fats: 3.3, fiber: 0, sugar: 4.7, isVeg: true, isVegan: false, servingSize: "100g" },
      { name: "Cheese (cheddar)", category: "dairy", calories: 402, protein: 25, carbs: 1.3, fats: 33, fiber: 0, sugar: 0.5, isVeg: true, isVegan: false, servingSize: "100g" },
      
      // Nuts & Seeds
      { name: "Almonds", category: "nuts_seeds", calories: 579, protein: 21, carbs: 22, fats: 50, fiber: 12, sugar: 4.4, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Peanuts", category: "nuts_seeds", calories: 567, protein: 26, carbs: 16, fats: 49, fiber: 8.5, sugar: 4.7, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Walnuts", category: "nuts_seeds", calories: 654, protein: 15, carbs: 14, fats: 65, fiber: 6.7, sugar: 2.6, isVeg: true, isVegan: true, servingSize: "100g" },
      
      // Beverages
      { name: "Green Tea", category: "beverages", calories: 1, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, isVeg: true, isVegan: true, servingSize: "100ml" },
      { name: "Coffee (black)", category: "beverages", calories: 2, protein: 0.3, carbs: 0, fats: 0, fiber: 0, sugar: 0, isVeg: true, isVegan: true, servingSize: "100ml" },
      { name: "Orange Juice", category: "beverages", calories: 45, protein: 0.7, carbs: 10, fats: 0.2, fiber: 0.2, sugar: 8.4, isVeg: true, isVegan: true, servingSize: "100ml" },
      
      // Indian Foods
      { name: "Dal (Lentil Curry)", category: "protein", calories: 105, protein: 7, carbs: 18, fats: 0.5, fiber: 6, sugar: 2, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Rajma (Kidney Beans)", category: "protein", calories: 127, protein: 8.7, carbs: 23, fats: 0.5, fiber: 6.4, sugar: 0.3, isVeg: true, isVegan: true, servingSize: "100g" },
      { name: "Idli", category: "grains", calories: 58, protein: 2, carbs: 12, fats: 0.2, fiber: 0.8, sugar: 0.5, isVeg: true, isVegan: true, servingSize: "1 piece (40g)" },
      { name: "Dosa", category: "grains", calories: 168, protein: 4, carbs: 25, fats: 6, fiber: 2, sugar: 1, isVeg: true, isVegan: true, servingSize: "1 dosa (70g)" },
      { name: "Paratha", category: "grains", calories: 320, protein: 6, carbs: 38, fats: 16, fiber: 3, sugar: 2, isVeg: true, isVegan: true, servingSize: "1 paratha (100g)" },
    ];

    const inserted = await FoodDatabase.insertMany(commonFoods);
    res.status(201).json({ 
      msg: "Food database seeded successfully", 
      count: inserted.length 
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
