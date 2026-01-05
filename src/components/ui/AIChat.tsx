"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles, Globe, Settings, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFakeAiResponse, callLLM } from "@/lib/chat-utils";
import { getApiKeys, saveApiKeys, getUserData } from "@/lib/storage";
import { ApiKeys } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  context?: string;
}

export function AIChat({ context }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const keys = getApiKeys();
    if (keys) setApiKeys(keys);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSaveKeys = (newKeys: ApiKeys) => {
    setApiKeys(newKeys);
    saveApiKeys(newKeys);
    setShowSettings(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

      try {
        const userData = getUserData();
        const progress = getDailyProgressAll();
        const systemPrompt = `You are 365Fit AI, a professional fitness and health assistant. 
          User Data: ${JSON.stringify(userData || {})}
          Daily Progress History: ${JSON.stringify(progress)}
          Current Context: ${context || "General fitness query"}
          Always be encouraging, factually correct, and concise. 
          Use your knowledge to analyze the user's progress, nutrition, and routine. 
          If asked for an opinion or analysis, use the provided data.`;

      let assistantResponse = "";

      // Check for available API key
      const activeProvider = apiKeys.openai ? "openai" : apiKeys.gemini ? "gemini" : null;

      if (activeProvider) {
        const apiKey = apiKeys[activeProvider as keyof ApiKeys]!;
        assistantResponse = await callLLM(activeProvider, apiKey, messages.concat(userMessage), systemPrompt);
      } else {
        // Fallback to Fake AI / Search
        // First try fake AI for greetings/internal knowledge
        assistantResponse = getFakeAiResponse(input.trim(), context);
        
        // If fake AI gives a generic response, optionally try search (simulated)
        if (assistantResponse.includes("interesting question") && !input.toLowerCase().match(/hi|hello|hey/)) {
          const searchResponse = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input.trim(), context }),
          });
          if (searchResponse.ok) {
            const data = await searchResponse.json();
            assistantResponse = data.answer;
          }
        }
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantResponse || "Sorry, I couldn't find a response for that.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble thinking right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "Protein for muscle gain?",
    "How to measure waist properly?",
    "Workout recovery tips",
    "Healthy Indian breakfast ideas",
  ];

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 flex items-center justify-center text-white"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] flex flex-col bg-zinc-900 rounded-t-3xl border-t border-zinc-800 shadow-2xl sm:bottom-6 sm:right-6 sm:left-auto sm:w-[400px] sm:max-h-[600px] sm:rounded-2xl sm:border"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                    <Bot className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">365Fit AI</h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${apiKeys.openai || apiKeys.gemini ? "bg-emerald-500 animate-pulse" : "bg-zinc-500"}`} />
                      {apiKeys.openai || apiKeys.gemini ? "LLM Powered" : "Standard Mode"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${showSettings ? "bg-emerald-500/20 text-emerald-500" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
                {showSettings ? (
                  <div className="space-y-4 p-2">
                    <div className="flex items-center gap-2 text-emerald-500 mb-4">
                      <Key className="w-4 h-4" />
                      <h4 className="font-medium text-sm">AI Configuration</h4>
                    </div>
                    <p className="text-xs text-zinc-400 mb-4">
                      Enter your API keys to enable advanced AI analysis and personal coaching. Keys are stored locally on your device.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 block">OpenAI API Key</label>
                        <input
                          type="password"
                          value={apiKeys.openai || ""}
                          onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                          placeholder="sk-..."
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 block">Gemini API Key</label>
                        <input
                          type="password"
                          value={apiKeys.gemini || ""}
                          onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                          placeholder="AIza..."
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 block">Claude (Anthropic) Key</label>
                        <input
                          type="password"
                          value={apiKeys.claude || ""}
                          onChange={(e) => setApiKeys({ ...apiKeys, claude: e.target.value })}
                          placeholder="sk-ant-..."
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 block">Grok (xAI) / Llama Key</label>
                        <input
                          type="password"
                          value={apiKeys.grok || apiKeys.llama || ""}
                          onChange={(e) => setApiKeys({ ...apiKeys, grok: e.target.value, llama: e.target.value })}
                          placeholder="xai-..."
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <Button
                        onClick={() => handleSaveKeys(apiKeys)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4"
                      >
                        Save Configuration
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-600/10 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h4 className="font-semibold text-white mb-2">How can I help you?</h4>
                        <p className="text-sm text-zinc-400 mb-6 px-4">
                          I can give you fitness tips, explain exercises, or analyze your progress.
                        </p>
                        <div className="space-y-2 px-4">
                          {quickQuestions.map((question, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setInput(question);
                                inputRef.current?.focus();
                              }}
                              className="w-full text-left p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-800 hover:border-emerald-500/50 transition-all"
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {messages.map((message, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                            message.role === "user"
                              ? "bg-zinc-700"
                              : "bg-emerald-500/20 border border-emerald-500/50"
                          }`}
                        >
                          {message.role === "user" ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                            message.role === "user"
                              ? "bg-emerald-600 text-white rounded-tr-md"
                              : "bg-zinc-800 text-zinc-200 rounded-tl-md border border-zinc-700"
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-emerald-500 animate-pulse" />
                        </div>
                        <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-md border border-zinc-700">
                          <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={showSettings ? "Configuration mode..." : "Ask 365Fit AI..."}
                    disabled={showSettings}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading || showSettings}
                    className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
