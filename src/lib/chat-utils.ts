import { WorkoutDay, Exercise } from "./types";
import { WORKOUT_PLANS } from "./workout-data";
import { KNOWLEDGE_BASE } from "./knowledge-base";

export const getFakeAiResponse = (input: string, context?: string): string => {
  const query = input.toLowerCase();

  // Basic manners & greetings
  if (query.match(/^(hi|hello|hey|greetings|namaste|morning|evening)/)) {
    return "Hello! I'm your 365Fit AI assistant. I'm here to help you with your fitness, nutrition, and health goals. How can I assist you today?";
  }
  
  if (query.includes("thank")) {
    return "You're very welcome! I'm always here to help you stay on track with your fitness journey. Do you have any other questions?";
  }

  if (query.includes("who are you") || query.includes("what can you do")) {
    return "I am 365Fit AI, your personal health companion. I can help you understand nutrition facts (like calories/protein in Indian foods), explain exercises, provide health tips, and analyze your workout progress. If you add your own API keys, I can even provide deep LLM-powered analysis of your health data!";
  }

  // Knowledge Base Lookup - Foods
  for (const category in KNOWLEDGE_BASE.foods) {
    const foods = (KNOWLEDGE_BASE.foods as any)[category];
    for (const key in foods) {
      const food = foods[key];
      if (query.includes(food.name.toLowerCase()) || (food.hindi && query.includes(food.hindi))) {
        let response = `${food.name}${food.hindi ? ` (${food.hindi})` : ""} contains approx ${food.cal} calories per 100g. Macros: ${food.p}g Protein, ${food.c}g Carbs, ${food.f}g Fat.`;
        if (food.fiber) response += ` It's high in fiber (${food.fiber}g).`;
        if (food.benefits) response += ` Benefits: ${food.benefits.join(", ")}.`;
        return response;
      }
    }
  }

  // Knowledge Base Lookup - Exercises
  for (const group in KNOWLEDGE_BASE.exercises) {
    const exercises = (KNOWLEDGE_BASE.exercises as any)[group];
    if (query.includes(group)) {
      return `For your ${group}, the best exercises are: ${exercises.join(", ")}. Make sure to maintain proper form and focus on progressive overload.`;
    }
    for (const exercise of exercises) {
      if (query.includes(exercise.toLowerCase())) {
        return `${exercise} is a great exercise for targeting your ${group}. Focus on a full range of motion and controlled tempo.`;
      }
    }
  }

  // Health Principles
  if (query.includes("muscle") && query.includes("build")) return KNOWLEDGE_BASE.principles.muscle_building;
  if (query.includes("fat") && query.includes("loss")) return KNOWLEDGE_BASE.principles.fat_loss;
  if (query.includes("belly") || query.includes("pot belly")) return KNOWLEDGE_BASE.principles.indian_pot_belly;
  if (query.includes("supplement")) return KNOWLEDGE_BASE.principles.supplements;

  // Generic Nutrition/Health fallback
  if (query.includes("protein")) return "Protein is essential for muscle repair. Aim for 1.6-2.2g per kg of bodyweight. Good sources include eggs, chicken, paneer, and lentils.";
  if (query.includes("carb")) return "Carbohydrates provide energy. Opt for complex carbs like oats, brown rice, and sweet potatoes for sustained energy levels.";
  if (query.includes("water") || query.includes("hydrat")) return "Stay hydrated by drinking at least 3-4 liters of water daily. It helps with metabolism and recovery.";

  if (query.includes("tip") || query.includes("advice")) {
    const tips = [
      "Prioritize 7-9 hours of sleep for recovery.",
      "Consistency beats intensity every time.",
      "Track your calories and macros for better results.",
      "Don't skip your warm-up to avoid injuries.",
      "Mind-muscle connection is key during workouts."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  return "That's an interesting point! I can provide specific nutrition facts for hundreds of Indian foods, explain exercises for any muscle group, or give health tips. What would you like to know more about?";
};

export const callLLM = async (
  provider: string, 
  apiKey: string, 
  messages: any[], 
  systemPrompt: string
): Promise<string> => {
  try {
    if (provider === "openai") {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "system", content: systemPrompt }, ...messages],
        }),
      });
      const data = await response.json();
      return data.choices[0].message.content;
    }
    
    if (provider === "gemini") {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\n${messages.map(m => `${m.role}: ${m.content}`).join("\n")}` }]
          }]
        }),
      });
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }

    if (provider === "claude") {
      // Note: Anthropic usually requires a specific SDK or proxy for CORS, 
      // but we'll implement a direct fetch attempt. 
      // In a real app, this would likely go through a backend.
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages
        }),
      });
      const data = await response.json();
      return data.content[0].text;
    }

    if (provider === "grok" || provider === "llama") {
      // Grok (xAI) and many Llama providers use OpenAI-compatible APIs
      const baseUrl = provider === "grok" ? "https://api.x.ai/v1" : "https://api.groq.com/openai/v1";
      const model = provider === "grok" ? "grok-beta" : "llama3-70b-8192";
      
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "system", content: systemPrompt }, ...messages],
        }),
      });
      const data = await response.json();
      return data.choices[0].message.content;
    }

    return `Provider ${provider} integration is active! However, please ensure your API key is correct.`;
  } catch (error) {
    console.error(`Error calling ${provider}:`, error);
    return `I encountered an error connecting to ${provider}. Please check your API key or network connection.`;
  }
};
