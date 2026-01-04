export const KNOWLEDGE_BASE = {
  foods: {
    fruits: {
      apple: { name: "Apple", hindi: "सेब", cal: 52, p: 0.3, c: 14, f: 0.2, fiber: 2.4, gi: 36, benefits: ["heart health", "weight loss", "digestion"] },
      banana: { name: "Banana", hindi: "केला", cal: 89, p: 1.1, c: 23, f: 0.3, fiber: 2.6, gi: 51, benefits: ["energy", "muscle recovery", "potassium"] },
      mango: { name: "Mango", hindi: "आम", cal: 60, p: 0.8, c: 15, f: 0.4, fiber: 1.6, gi: 51, benefits: ["immunity", "eye health", "vitamin A"] },
      orange: { name: "Orange", hindi: "संतरा", cal: 47, p: 0.9, c: 12, f: 0.1, fiber: 2.4, gi: 43, benefits: ["vitamin C", "immunity", "skin health"] },
      papaya: { name: "Papaya", hindi: "पपीता", cal: 43, p: 0.5, c: 11, f: 0.3, fiber: 1.7, gi: 60, benefits: ["digestion", "enzymes", "anti-inflammatory"] },
      watermelon: { name: "Watermelon", hindi: "तरबूज", cal: 30, p: 0.6, c: 8, f: 0.2, fiber: 0.4, gi: 72, benefits: ["hydration", "citrulline", "recovery"] },
      pomegranate: { name: "Pomegranate", hindi: "अनार", cal: 83, p: 1.7, c: 19, f: 1.2, fiber: 4, gi: 53, benefits: ["antioxidants", "heart health", "blood flow"] },
      guava: { name: "Guava", hindi: "अमरूद", cal: 68, p: 2.6, c: 14, f: 1, fiber: 5.4, gi: 12, benefits: ["vitamin C", "fiber", "immunity"] },
    },
    vegetables: {
      spinach: { name: "Spinach", hindi: "पालक", cal: 23, p: 2.9, c: 3.6, f: 0.4, fiber: 2.2, gi: 15, iron: 2.7, benefits: ["iron", "vitamin K", "eye health"] },
      broccoli: { name: "Broccoli", hindi: "ब्रोकली", cal: 34, p: 2.8, c: 7, f: 0.4, fiber: 2.6, gi: 10, benefits: ["vitamin C", "cancer prevention", "detox"] },
      carrot: { name: "Carrot", hindi: "गाजर", cal: 41, p: 0.9, c: 10, f: 0.2, fiber: 2.8, gi: 39, benefits: ["vitamin A", "eye health", "beta-carotene"] },
      tomato: { name: "Tomato", hindi: "टमाटर", cal: 18, p: 0.9, c: 3.9, f: 0.2, fiber: 1.2, gi: 38, benefits: ["lycopene", "heart health", "antioxidants"] },
      cucumber: { name: "Cucumber", hindi: "खीरा", cal: 15, p: 0.7, c: 3.6, f: 0.1, fiber: 0.5, water: 95, gi: 15, benefits: ["hydration", "low calorie", "weight loss"] },
      potato: { name: "Potato", hindi: "आलू", cal: 77, p: 2, c: 17, f: 0.1, fiber: 2.1, gi: 85, benefits: ["potassium", "energy", "vitamin C"] },
      sweetPotato: { name: "Sweet Potato", hindi: "शकरकंद", cal: 86, p: 1.6, c: 20, f: 0.1, fiber: 3, gi: 63, benefits: ["complex carbs", "vitamin A", "fiber"] },
      ladyFinger: { name: "Lady Finger/Okra", hindi: "भिंडी", cal: 33, p: 1.9, c: 7, f: 0.2, fiber: 3.2, gi: 20, benefits: ["fiber", "digestion", "blood sugar"] },
    },
    proteins: {
      chickenBreast: { name: "Chicken Breast", hindi: "चिकन ब्रेस्ट", cal: 165, p: 31, c: 0, f: 3.6, benefits: ["lean protein", "muscle building", "low fat"] },
      egg_whole: { name: "Whole Egg", hindi: "अंडा", cal: 155, p: 13, c: 1.1, f: 11, benefits: ["complete protein", "vitamin D", "choline"] },
      egg_white: { name: "Egg White", hindi: "अंडे की सफेदी", cal: 52, p: 11, c: 0.7, f: 0.2, benefits: ["pure protein", "fat free"] },
      paneer: { name: "Paneer", hindi: "पनीर", cal: 265, p: 18, c: 3.4, f: 20, calcium: 200, benefits: ["vegetarian protein", "calcium"] },
      tofu: { name: "Tofu", cal: 76, p: 8, c: 1.9, f: 4.8, calcium: 350, benefits: ["vegan protein", "low calorie", "calcium"] },
      lentils: { name: "Lentils", hindi: "दाल", cal: 116, p: 9, c: 20, f: 0.4, fiber: 8, benefits: ["plant protein", "fiber", "iron"] },
      chickpeas: { name: "Chickpeas", hindi: "छोले", cal: 164, p: 8.9, c: 27, f: 2.6, fiber: 7.6, benefits: ["protein", "fiber", "complex carbs"] },
    },
    dishes: {
      poha: { name: "Poha", hindi: "पोहा", cal: 250, p: 6, c: 45, f: 5, benefits: ["quick breakfast", "light meal"] },
      idli: { name: "Idli", hindi: "इडली", cal: 40, p: 1.5, c: 8, f: 0.2, benefits: ["weight loss", "easy digestion"] },
      dosa: { name: "Plain Dosa", hindi: "डोसा", cal: 120, p: 3, c: 22, f: 2, benefits: ["breakfast", "light dinner"] },
      upma: { name: "Upma", hindi: "उपमा", cal: 220, p: 5, c: 40, f: 5, benefits: ["breakfast", "easy to digest"] },
      paratha: { name: "Aloo Paratha", hindi: "आलू पराठा", cal: 250, p: 5, c: 35, f: 10, benefits: ["filling", "traditional"] },
    }
  },
  exercises: {
    chest: ["Bench Press", "Incline Dumbbell Press", "Push-ups", "Chest Flyes", "Dips"],
    back: ["Pull-ups", "Deadlift", "Barbell Rows", "Lat Pulldown", "Seated Row"],
    legs: ["Squat", "Leg Press", "Lunges", "Leg Extension", "Hamstring Curls"],
    shoulders: ["Overhead Press", "Lateral Raises", "Front Raises", "Reverse Flyes"],
    arms: ["Bicep Curls", "Tricep Pushdowns", "Hammer Curls", "Skull Crushers"],
    core: ["Plank", "Crunches", "Leg Raises", "Russian Twists"],
  },
  principles: {
    muscle_building: "Build muscle through progressive overload (increasing weights/reps), high protein (1.8-2.2g/kg), and consistent strength training 3-5 times a week.",
    fat_loss: "Lose fat through a calorie deficit (consuming fewer calories than you burn), high protein to preserve muscle, and a mix of strength and cardio.",
    indian_pot_belly: "To reduce an Indian pot belly, focus on reducing refined carbs (sugar, white rice, maida), increasing protein, and performing compound exercises along with high-intensity interval training (HIIT).",
    supplements: "Creatine Monohydrate (5g daily) and Whey Protein are the most effective supplements. Vitamins D and B12 are also important as many Indians are deficient.",
  }
};
