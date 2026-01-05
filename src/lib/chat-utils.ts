import { WorkoutDay, Exercise } from "./types";
import { WORKOUT_PLANS } from "./workout-data";
import { KNOWLEDGE_BASE } from "./knowledge-base";

export const getFakeAiResponse = (input: string, context?: string): string => {
  const query = input.toLowerCase();

  // Basic manners & greetings
  if (query.match(/^(hi|hello|hey|greetings|namaste|morning|evening|hi there|hello there)/)) {
    return "Hello what can I do for you";
  }
  
  if (query.includes("thank")) {
    return "You're very welcome! I'm always here to help you stay on track with your fitness journey. Do you have any other questions about your health or routine?";
  }

  if (query.includes("who are you") || query.includes("what can you do")) {
    return "I am 365Fit AI, your personal health companion. I have a built-in encyclopedia for Indian nutrition, thousands of exercise facts, and health tips. I can also analyze your progress if you provide LLM keys (OpenAI, Gemini, etc.) via the settings icon.";
  }

  // Knowledge Base Lookup - Foods & Dishes
  const foodCats = ['fruits', 'vegetables', 'proteins', 'dishes'];
  for (const cat of foodCats) {
    const items = (KNOWLEDGE_BASE.foods as any)[cat];
    for (const key in items) {
      const item = items[key];
      if (query.includes(item.name.toLowerCase()) || (item.hindi && query.includes(item.hindi))) {
        let res = `${item.name}${item.hindi ? ` (${item.hindi})` : ""} has approx ${item.cal} calories per 100g/serving. `;
        res += `Macros: ${item.p}g Protein, ${item.c || 0}g Carbs, ${item.f || 0}g Fat. `;
        if (item.benefits) res += `Benefits: ${item.benefits.join(", ")}. `;
        return res;
      }
    }
  }

  // Knowledge Base Lookup - Exercises
  for (const group in KNOWLEDGE_BASE.exercises) {
    const exercises = (KNOWLEDGE_BASE.exercises as any)[group];
    // Check if user mentioned the group (e.g., "chest")
    if (query.includes(group)) {
      const exNames = Object.values(exercises).map((e: any) => e.name || e);
      return `For your ${group}, effective exercises include: ${exNames.join(", ")}. Focus on proper form and progressive overload.`;
    }
    // Check if user mentioned a specific exercise
    for (const key in exercises) {
      const ex = exercises[key];
      const name = (ex.name || ex).toLowerCase();
      if (query.includes(name)) {
        if (typeof ex === 'string') return `${ex} is excellent for targeting your ${group}.`;
        let res = `${ex.name} targets your ${ex.primary || group}. `;
        if (ex.secondary) res += `Secondary muscles: ${ex.secondary.join(", ")}. `;
        if (ex.benefits) res += `Benefits: ${ex.benefits.join(", ")}. `;
        return res;
      }
    }
  }

  // Health Principles & Tips
  if (query.includes("muscle") && query.includes("build")) return KNOWLEDGE_BASE.principles.muscle_building;
  if (query.includes("fat") && query.includes("loss")) return KNOWLEDGE_BASE.principles.fat_loss;
  if (query.includes("belly") || query.includes("pot belly")) return KNOWLEDGE_BASE.principles.indian_pot_belly;
  if (query.includes("supplement")) return KNOWLEDGE_BASE.principles.supplements;
  if (query.includes("water") || query.includes("hydrat")) return KNOWLEDGE_BASE.principles.hydration;
  if (query.includes("recover")) return KNOWLEDGE_BASE.principles.recovery;
  if (query.includes("breakfast")) return KNOWLEDGE_BASE.principles.indian_breakfasts;
  if (query.includes("protein")) return KNOWLEDGE_BASE.principles.protein_sources;

  if (query.includes("tip") || query.includes("advice")) {
    const tips = [
      "Prioritize 7-9 hours of sleep for recovery.",
      "Consistency beats intensity every time.",
      "Track your calories and macros for better results.",
      "Don't skip your warm-up to avoid injuries.",
      "Mind-muscle connection is key during workouts.",
      "Drink a glass of water before every meal.",
      "Walk for 10 minutes after a heavy lunch."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  return "That's an interesting point! I have detailed data on Indian foods, exercise techniques, and health principles. Would you like to know about a specific food, muscle group, or fitness goal?";
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
