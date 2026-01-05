import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, X, CheckCircle2, AlertCircle } from "lucide-react";
import { getTodos, getUserData } from "@/lib/storage";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<{ id: string; text: string; type: "info" | "success" }[]>([]);

  useEffect(() => {
    // Simulate daily reminders
    const checkReminders = () => {
      const todos = getTodos();
      const incomplete = todos.filter(t => !t.completed);
      const userData = getUserData();
      
      const newNotifications: any[] = [];
      
      if (incomplete.length > 0) {
        newNotifications.push({
          id: "todo-reminder",
          text: `You have ${incomplete.length} items left in your routine today!`,
          type: "info"
        });
      }

      // Workout reminder
      const today = new Date().toISOString().split("T")[0];
      // Simple logic: if it's 8 AM and no workout done
      const now = new Date();
      if (now.getHours() >= 8 && now.getHours() <= 22) {
        newNotifications.push({
          id: "workout-reminder",
          text: "Don't forget your workout today! Stay consistent for your 365-day goal.",
          type: "success"
        });
      }

      setNotifications(newNotifications);
    };

    // Check once on mount and then every hour (simulated)
    checkReminders();
    const interval = setInterval(checkReminders, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: i * 0.1 }}
            className="mb-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl pointer-events-auto flex items-start gap-3"
          >
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${n.type === "success" ? "bg-emerald-500/20 text-emerald-500" : "bg-blue-500/20 text-blue-500"}`}>
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm font-medium text-white leading-tight">{n.text}</p>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="p-1 rounded-full hover:bg-zinc-800 text-zinc-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
