import { AppLayout } from "../../components/AppLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import {
  Target,
  Plus,
  Check,
  Flame,
  Trophy,
  Calendar,
  TrendingUp,
  Clock,
  Zap,
  Star,
  Edit,
  Trash2,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../../lib/api";
import { format, isToday, isSameDay, subDays, startOfWeek, endOfWeek, isWithinInterval, differenceInDays } from "date-fns";

interface HabitLog {
  completed_at: string;
}

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: "daily" | "weekly";
  currentStreak: number;
  bestStreak: number;
  completedToday: boolean;
  completedThisWeek: number;
  category: string;
  weekProgress: boolean[];
  habit_logs?: HabitLog[];
}

export function HabitTracker() {
  const { session } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewHabit, setShowNewHabit] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitFormData, setHabitFormData] = useState({
    name: "",
    icon: "🎯",
    category: "",
    frequency: "daily" as "daily" | "weekly",
    color: "from-blue-400 to-cyan-500"
  });

  useEffect(() => {
    if (session) {
      fetchHabits();
    }
  }, [session]);

  const processHabitData = (backendHabit: any): Habit => {
    const logs = backendHabit.habit_logs || [];
    const sortedLogs = logs
      .map((log: any) => new Date(log.completed_at))
      .sort((a: Date, b: Date) => b.getTime() - a.getTime());

    const today = new Date();
    const completedToday = sortedLogs.some((date: Date) => isSameDay(date, today));

    // Calculate streaks
    let currentStreak = 0;
    let bestStreak = 0;
    
    // Simple daily streak calculation
    // This is a simplified version. Robust streak calculation is complex.
    // We assume one log per day matters.
    const uniqueDates = Array.from(new Set(sortedLogs.map((d: Date) => format(d, 'yyyy-MM-dd'))))
      .map((d: string) => new Date(d))
      .sort((a: Date, b: Date) => b.getTime() - a.getTime());

    if (uniqueDates.length > 0) {
      let streak = 0;
      let checkDate = today;
      
      // If not completed today, check if completed yesterday to continue streak
      if (!completedToday) {
        checkDate = subDays(today, 1);
      }

      for (const logDate of uniqueDates) {
        if (isSameDay(logDate, checkDate)) {
          streak++;
          checkDate = subDays(checkDate, 1);
        } else if (isSameDay(logDate, subDays(checkDate, 1))) {
           // Gap of one day? No, strict daily streak means consecutive days.
           // But if we are iterating sorted dates, and we missed a day, streak breaks.
           // Wait, logic above: checkDate decrements only if match found.
           // If match not found for checkDate, but found for earlier date, streak broke.
           break;
        } else {
           // Date is older than checkDate, streak broke.
           if (differenceInDays(checkDate, logDate) > 0) {
             break;
           }
        }
      }
      currentStreak = streak;
    }

    // Calculate best streak (simplified: just current streak or some random logic if historical data is complex)
    // For now, let's just use current streak as best streak if it's higher than stored, but we don't store best streak in backend yet.
    // We can iterate all logs to find longest sequence.
    let tempStreak = 0;
    let maxStreak = 0;
    if (uniqueDates.length > 0) {
       // uniqueDates is desc
       const ascDates = [...uniqueDates].reverse();
       let prevDate: Date | null = null;
       for (const d of ascDates) {
         if (!prevDate) {
           tempStreak = 1;
         } else {
           if (differenceInDays(d, prevDate) === 1) {
             tempStreak++;
           } else {
             tempStreak = 1;
           }
         }
         maxStreak = Math.max(maxStreak, tempStreak);
         prevDate = d;
       }
    }
    bestStreak = maxStreak;

    // Week progress
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekProgress = Array(7).fill(false).map((_, i) => {
      const day = new Date(startOfCurrentWeek);
      day.setDate(day.getDate() + i);
      return sortedLogs.some((logDate: Date) => isSameDay(logDate, day));
    });

    const completedThisWeek = weekProgress.filter(Boolean).length;

    return {
      id: backendHabit.id,
      name: backendHabit.name,
      icon: backendHabit.icon || "🎯",
      color: backendHabit.color || "from-blue-400 to-cyan-500",
      frequency: backendHabit.frequency as "daily" | "weekly",
      currentStreak,
      bestStreak,
      completedToday,
      completedThisWeek,
      category: backendHabit.category || "General",
      weekProgress,
      habit_logs: logs
    };
  };

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      const data = await api.habits.getAll();
      const processedHabits = data.map(processHabitData);
      setHabits(processedHabits);
    } catch (error) {
      console.error("Failed to fetch habits", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setHabitFormData({
      name: "",
      icon: "🎯",
      category: "",
      frequency: "daily",
      color: "from-blue-400 to-cyan-500"
    });
    setEditingHabit(null);
  };

  const handleCreateHabit = async () => {
    try {
      await api.habits.create(habitFormData);
      fetchHabits();
      setShowNewHabit(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create habit", error);
      alert("Failed to create habit");
    }
  };

  const handleUpdateHabit = async () => {
    if (!editingHabit) return;
    
    try {
      await api.habits.update(editingHabit.id, habitFormData);
      fetchHabits();
      setShowNewHabit(false);
      resetForm();
    } catch (error) {
      console.error("Failed to update habit", error);
      alert("Failed to update habit");
    }
  };

  const handleDeleteHabit = async (id: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      try {
        await api.habits.delete(id);
        setHabits(habits.filter(h => h.id !== id));
      } catch (error) {
        console.error("Failed to delete habit", error);
        alert("Failed to delete habit");
      }
    }
  };

  const handleSaveHabit = () => {
    if (editingHabit) {
      handleUpdateHabit();
    } else {
      handleCreateHabit();
    }
  };

  const toggleHabit = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    try {
      if (habit.completedToday) {
        // Uncomplete
        await api.habits.uncomplete(id, format(new Date(), 'yyyy-MM-dd'));
      } else {
        // Complete
        await api.habits.complete(id, new Date().toISOString());
      }
      fetchHabits(); // Refresh to update streaks and logs
    } catch (error) {
      console.error("Failed to toggle habit", error);
    }
  };

  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const completionRate = Math.round((completedToday / totalHabits) * 100);
  const longestStreak = Math.max(...habits.map(h => h.currentStreak));

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">Habit Tracker</h1>
              </div>
              <p className="text-muted-foreground">
                Build healthy habits, one day at a time
              </p>
            </div>
            <Button
              onClick={() => setShowNewHabit(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              New Habit
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{completedToday}/{totalHabits}</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500 rounded-xl">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{longestStreak}</p>
                  <p className="text-xs text-muted-foreground">Best Streak</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{completionRate}%</p>
                  <p className="text-xs text-muted-foreground">Completion</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 rounded-xl">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{totalHabits}</p>
                  <p className="text-xs text-muted-foreground">Active Habits</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Today's Habits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Today's Habits
          </h2>
          <div className="space-y-3">
            {habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
              >
                <Card className={`p-4 transition-all ${
                  habit.completedToday ? "ring-2 ring-green-500 shadow-lg" : "hover:shadow-md"
                }`}>
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleHabit(habit.id)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        habit.completedToday
                          ? "bg-green-500 text-white shadow-lg"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {habit.completedToday ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <div className="w-6 h-6" />
                      )}
                    </motion.button>

                    {/* Habit Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{habit.icon}</span>
                        <h3 className={`font-bold ${habit.completedToday ? "text-green-700" : ""}`}>
                          {habit.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span>{habit.currentStreak} day streak</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>Best: {habit.bestStreak}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                          {habit.category}
                        </span>
                      </div>
                    </div>

                    {/* Week Progress */}
                    <div className="hidden sm:flex items-center gap-1">
                      {habit.weekProgress.map((completed, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            completed
                              ? `bg-gradient-to-br ${habit.color} text-white`
                              : "bg-gray-100"
                          }`}
                          title={weekDays[i]}
                        >
                          <span className="text-xs font-medium">
                            {completed ? "✓" : weekDays[i][0]}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        onClick={() => handleEditHabit(habit)}
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-red-50 rounded-lg"
                        onClick={() => handleDeleteHabit(habit.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </motion.button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Motivation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white">
            <div className="flex items-start gap-4">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Zap className="w-8 h-8" />
              </motion.div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2">You're doing amazing!</h3>
                <p className="text-white/90 mb-4">
                  You've completed {completedToday} out of {totalHabits} habits today. Keep up the great work!
                  {completionRate === 100 && " 🎉 Perfect day!"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    <span>{longestStreak} day streak</span>
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    <span>{habits.filter(h => h.currentStreak >= 7).length} habits on fire</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card className="p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Habit Building Tips
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-bold">1</span>
                </div>
                <p className="text-sm text-gray-700">Start small - focus on tiny, manageable habits</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-bold">2</span>
                </div>
                <p className="text-sm text-gray-700">Stack habits - link new habits to existing routines</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-bold">3</span>
                </div>
                <p className="text-sm text-gray-700">Track consistently - don't break the chain!</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-bold">4</span>
                </div>
                <p className="text-sm text-gray-700">Celebrate wins - reward yourself for milestones</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* New/Edit Habit Modal */}
        <AnimatePresence>
          {showNewHabit && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowNewHabit(false);
                  resetForm();
                }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl z-50"
              >
                <Card className="p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Target className="w-6 h-6 text-primary" />
                      {editingHabit ? "Edit Habit" : "New Habit"}
                    </h3>
                    <button
                      onClick={() => {
                        setShowNewHabit(false);
                        resetForm();
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Habit Name
                      </label>
                      <input
                        type="text"
                        value={habitFormData.name}
                        onChange={(e) => setHabitFormData({ ...habitFormData, name: e.target.value })}
                        placeholder="e.g., Morning Exercise"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon (Emoji)
                        </label>
                        <input
                          type="text"
                          value={habitFormData.icon}
                          onChange={(e) => setHabitFormData({ ...habitFormData, icon: e.target.value })}
                          placeholder="🎯"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-2xl text-center"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frequency
                        </label>
                        <select
                          value={habitFormData.frequency}
                          onChange={(e) => setHabitFormData({ ...habitFormData, frequency: e.target.value as "daily" | "weekly" })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={habitFormData.category}
                        onChange={(e) => setHabitFormData({ ...habitFormData, category: e.target.value })}
                        placeholder="e.g., Physical, Mental, Social"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Theme
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "Blue", value: "from-blue-400 to-cyan-500" },
                          { label: "Purple", value: "from-purple-400 to-indigo-500" },
                          { label: "Green", value: "from-green-400 to-teal-500" },
                          { label: "Orange", value: "from-orange-400 to-red-500" },
                          { label: "Pink", value: "from-pink-400 to-rose-500" },
                          { label: "Amber", value: "from-amber-400 to-orange-500" }
                        ].map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => setHabitFormData({ ...habitFormData, color: color.value })}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              habitFormData.color === color.value
                                ? "ring-2 ring-primary shadow-md"
                                : "hover:shadow"
                            } bg-gradient-to-br ${color.value} text-white`}
                          >
                            {color.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowNewHabit(false);
                          resetForm();
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleSaveHabit();
                        }}
                        className="flex-1"
                        disabled={!habitFormData.name || !habitFormData.category}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {editingHabit ? "Update Habit" : "Create Habit"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}