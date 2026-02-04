import { AppLayout } from "../../components/AppLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion } from "motion/react";
import {
  Calendar,
  TrendingUp,
  Heart,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Download
} from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export function MoodHistory() {
  const [selectedView, setSelectedView] = useState<"week" | "month" | "year">("week");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Functions to navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Mock data for charts
  const weeklyData = [
    { day: "Mon", mood: 7, intensity: 5 },
    { day: "Tue", mood: 8, intensity: 6 },
    { day: "Wed", mood: 6, intensity: 7 },
    { day: "Thu", mood: 9, intensity: 4 },
    { day: "Fri", mood: 7, intensity: 5 },
    { day: "Sat", mood: 8, intensity: 3 },
    { day: "Sun", mood: 9, intensity: 4 }
  ];

  const moodDistribution = [
    { name: "Happy", value: 35, color: "#fbbf24" },
    { name: "Calm", value: 30, color: "#3b82f6" },
    { name: "Anxious", value: 15, color: "#a855f7" },
    { name: "Sad", value: 10, color: "#6366f1" },
    { name: "Tired", value: 10, color: "#6b7280" }
  ];

  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - 5; // Start from previous month
    const mood = Math.floor(Math.random() * 4);
    return {
      day: dayNumber > 0 && dayNumber <= 30 ? dayNumber : null,
      mood: dayNumber > 0 && dayNumber <= 30 ? mood : null,
      emoji: ["😊", "😌", "😰", "😢"][mood] || ""
    };
  });

  const insights = [
    {
      icon: TrendingUp,
      title: "Mood Trend",
      value: "+15%",
      description: "Improvement this week",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: Heart,
      title: "Average Mood",
      value: "7.8/10",
      description: "This month",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Calendar,
      title: "Check-ins",
      value: "24",
      description: "Last 30 days",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: BarChart3,
      title: "Best Day",
      value: "Friday",
      description: "Most positive moods",
      color: "text-amber-500",
      bgColor: "bg-amber-50"
    }
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mood History</h1>
              <p className="text-muted-foreground">
                Track your emotional journey over time
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          </div>
        </motion.div>

        {/* Insights Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className={`p-4 shadow-lg ${insight.bgColor}`}>
                  <Icon className={`w-6 h-6 mb-2 ${insight.color}`} />
                  <p className="text-sm text-muted-foreground mb-1">{insight.title}</p>
                  <p className="text-2xl font-bold mb-1">{insight.value}</p>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex gap-2 bg-white p-1 rounded-lg inline-flex shadow-md">
            {(["week", "month", "year"] as const).map((view) => (
              <motion.button
                key={view}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedView(view)}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  selectedView === view
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Mood Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Mood Trend</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: "#6366f1", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Mood Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Mood Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={moodDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {moodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Intensity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <Card className="p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Emotion Intensity</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="intensity" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Calendar View</h2>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={goToPreviousMonth}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <span className="font-medium">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric"
                  })}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={goToNextMonth}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 pb-2">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.01 }}
                  whileHover={day.day ? { scale: 1.1 } : {}}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                    day.day
                      ? "bg-gray-50 hover:bg-gray-100 cursor-pointer border border-gray-200"
                      : "bg-transparent"
                  }`}
                >
                  {day.day && (
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">{day.day}</div>
                      <div className="text-lg">{day.emoji}</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">😊</span>
                <span className="text-muted-foreground">Happy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">😌</span>
                <span className="text-muted-foreground">Calm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">😰</span>
                <span className="text-muted-foreground">Anxious</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">😢</span>
                <span className="text-muted-foreground">Sad</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}