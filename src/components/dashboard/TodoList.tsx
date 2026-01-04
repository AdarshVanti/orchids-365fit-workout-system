import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2, Circle, Trash2, Pill, ShoppingCart, Book, Bell, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TodoItem, TodoCategory } from "@/lib/types";
import { getTodos, saveTodos } from "@/lib/storage";

export function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [category, setCategory] = useState<TodoCategory>("task");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setTodos(getTodos());
  }, []);

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    const todo: TodoItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: newTodo.trim(),
      category,
      completed: false,
      recurring: true, // Default to recurring as requested for medicines/supplements
    };
    const updated = [...todos, todo];
    setTodos(updated);
    saveTodos(updated);
    setNewTodo("");
    setIsAdding(false);
  };

  const toggleTodo = (id: string) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
    saveTodos(updated);
  };

  const deleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);
    saveTodos(updated);
  };

  const getCategoryIcon = (cat: TodoCategory) => {
    switch (cat) {
      case "medicine": return <Pill className="w-4 h-4 text-rose-500" />;
      case "supplement": return <Pill className="w-4 h-4 text-emerald-500" />;
      case "book": return <Book className="w-4 h-4 text-blue-500" />;
      case "other": return <ShoppingCart className="w-4 h-4 text-amber-500" />;
      default: return <ListTodo className="w-4 h-4 text-zinc-400" />;
    }
  };

  const categories: { label: string; value: TodoCategory }[] = [
    { label: "Task", value: "task" },
    { label: "Medicine", value: "medicine" },
    { label: "Supplement", value: "supplement" },
    { label: "Reading", value: "book" },
    { label: "Other", value: "other" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-emerald-500" />
          Daily Routine
        </h3>
        <Button
          onClick={() => setIsAdding(true)}
          variant="ghost"
          size="sm"
          className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Item
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 space-y-3"
          >
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    category === cat.value
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTodo} className="flex-1 bg-emerald-600 hover:bg-emerald-700">Add</Button>
              <Button onClick={() => setIsAdding(false)} variant="ghost" className="text-zinc-400">Cancel</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {todos.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-sm">No items in your routine yet.</p>
          </div>
        ) : (
          todos.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${
                todo.completed
                  ? "bg-zinc-900/50 border-zinc-800 opacity-60"
                  : "bg-zinc-800/30 border-zinc-800 hover:border-zinc-700 shadow-sm"
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className="flex-shrink-0 transition-transform active:scale-90"
              >
                {todo.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(todo.category)}
                  <p className={`text-sm font-medium truncate ${todo.completed ? "text-zinc-500 line-through" : "text-zinc-200"}`}>
                    {todo.text}
                  </p>
                </div>
              </div>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/10 text-zinc-600 hover:text-rose-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
