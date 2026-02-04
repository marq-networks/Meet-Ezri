import { AppLayout } from "../../components/AppLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import {
  Moon,
  Sun,
  Clock,
  TrendingUp,
  Calendar,
  Plus,
  Bed,
  Coffee,
  Activity,
  Brain,
  Heart,
  Zap,
  X
} from "lucide-react";
import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export function SleepTracker() {
  const [selectedDate, setSelectedDate] = useState("2024-12-29");
  const [showLogModal, setShowLogModal] = useState(false);
  const [sleepFormData, setSleepFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    bedTime: "",
    wakeTime: "",
    quality: "85",
    notes: ""
  });

  const handleLogSleep = () => {
    // In a real app, this would save to backend/localStorage
    console.log("Logging sleep data:", sleepFormData);
    
    // Reset form
    setSleepFormData({
      date: new Date().toISOString().split('T')[0],
      bedTime: "",
      wakeTime: "",
      quality: "85",
      notes: ""
    });
    
    // Close modal
    setShowLogModal(false);
    
    // Show success feedback
    alert("Sleep data logged successfully!");
  };

  const sleepData = [
    { day: "Mon", hours: 7.2, quality: 85 },
    { day: "Tue", hours: 6.5, quality: 70 },
    { day: "Wed", hours: 8.1, quality: 92 },
    { day: "Thu", hours: 7.8, quality: 88 },
    { day: "Fri", hours: 6.0, quality: 65 },
    { day: "Sat", hours: 9.2, quality: 95 },
    { day: "Sun", hours: 8.5, quality: 90 }
  ];

  const sleepQualityFactors = [
    { factor: "Duration", value: 85 },
    { factor: "Deep Sleep", value: 75 },
    { factor: "REM Sleep", value: 70 },
    { factor: "Awakenings", value: 90 },
    { factor: "Consistency", value: 80 }
  ];

  const recentSleep = [
    {
      date: "December 29, 2024",
      bedTime: "10:30 PM",
      wakeTime: "6:45 AM",
      duration: "8h 15m",
      quality: 92,
      deepSleep: "2h 30m",
      remSleep: "1h 45m",
      awakenings: 2,
      notes: "Felt very rested, had a relaxing evening routine"
    },
    {
      date: "December 28, 2024",
      bedTime: "11:45 PM",
      wakeTime: "7:15 AM",
      duration: "7h 30m",
      quality: 78,
      deepSleep: "1h 50m",
      remSleep: "1h 20m",
      awakenings: 3,
      notes: "Watched TV late, took longer to fall asleep"
    },
    {
      date: "December 27, 2024",
      bedTime: "10:00 PM",
      wakeTime: "6:30 AM",
      duration: "8h 30m",
      quality: 95,
      deepSleep: "3h 0m",
      remSleep: "2h 0m",
      awakenings: 1,
      notes: "Perfect sleep! Exercised in the afternoon"
    }
  ];

  const avgSleepDuration = (sleepData.reduce((acc, d) => acc + d.hours, 0) / sleepData.length).toFixed(1);
  const avgQuality = Math.round(sleepData.reduce((acc, d) => acc + d.quality, 0) / sleepData.length);

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
                <Moon className="w-8 h-8 text-indigo-500" />
                <h1 className="text-3xl font-bold">Sleep Tracker</h1>
              </div>
              <p className="text-muted-foreground">
                Monitor your sleep patterns and improve sleep quality
              </p>
            </div>
            <Button className="gap-2" onClick={() => setShowLogModal(true)}>
              <Plus className="w-4 h-4" />
              Log Sleep
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500 rounded-xl">
                  <Bed className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600">{avgSleepDuration}h</p>
                  <p className="text-xs text-muted-foreground">Avg Sleep</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{avgQuality}%</p>
                  <p className="text-xs text-muted-foreground">Avg Quality</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">2.5h</p>
                  <p className="text-xs text-muted-foreground">Avg Deep Sleep</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500 rounded-xl">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">5</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sleep Duration Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Weekly Sleep Duration
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Tip:</strong> Aim for 7-9 hours of sleep each night for optimal health.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Sleep Quality Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Sleep Quality Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={sleepData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="quality"
                    stroke="#8b5cf6"
                    fill="url(#colorQuality)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Great progress!</strong> Your sleep quality has improved by 15% this week.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sleep Quality Factors Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Sleep Quality Factors
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={sleepQualityFactors}>
                <PolarGrid />
                <PolarAngleAxis dataKey="factor" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Quality"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Recent Sleep Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-xl font-bold mb-4">Recent Sleep Logs</h2>
          <div className="space-y-4">
            {recentSleep.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                    <div className="flex items-center gap-3 mb-3 sm:mb-0">
                      <div className={`p-3 rounded-xl ${
                        log.quality >= 90
                          ? "bg-green-100"
                          : log.quality >= 75
                          ? "bg-blue-100"
                          : "bg-orange-100"
                      }`}>
                        <Moon className={`w-6 h-6 ${
                          log.quality >= 90
                            ? "text-green-600"
                            : log.quality >= 75
                            ? "text-blue-600"
                            : "text-orange-600"
                        }`} />
                      </div>
                      <div>
                        <p className="font-bold">{log.date}</p>
                        <p className="text-sm text-muted-foreground">{log.duration} total sleep</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-4 py-2 rounded-full font-bold ${
                        log.quality >= 90
                          ? "bg-green-100 text-green-700"
                          : log.quality >= 75
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {log.quality}% Quality
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-indigo-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Bedtime</p>
                        <p className="text-sm font-medium">{log.bedTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Wake Time</p>
                        <p className="text-sm font-medium">{log.wakeTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Deep Sleep</p>
                        <p className="text-sm font-medium">{log.deepSleep}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">REM Sleep</p>
                        <p className="text-sm font-medium">{log.remSleep}</p>
                      </div>
                    </div>
                  </div>

                  {log.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Notes:</strong> {log.notes}
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sleep Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
              <Coffee className="w-6 h-6" />
              Sleep Hygiene Tips
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-sm text-white/90">Maintain a consistent sleep schedule, even on weekends</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-sm text-white/90">Create a relaxing bedtime routine 30-60 minutes before sleep</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-sm text-white/90">Keep your bedroom cool, dark, and quiet</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-sm text-white/90">Avoid caffeine and screens 2-3 hours before bedtime</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Log Sleep Modal */}
      <AnimatePresence>
        {showLogModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogModal(false)}
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
                    <Moon className="w-6 h-6 text-indigo-500" />
                    Log Sleep
                  </h3>
                  <button
                    onClick={() => setShowLogModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={sleepFormData.date}
                      onChange={(e) => setSleepFormData({ ...sleepFormData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Moon className="w-4 h-4 inline mr-1" />
                        Bedtime
                      </label>
                      <input
                        type="time"
                        value={sleepFormData.bedTime}
                        onChange={(e) => setSleepFormData({ ...sleepFormData, bedTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Sun className="w-4 h-4 inline mr-1" />
                        Wake Time
                      </label>
                      <input
                        type="time"
                        value={sleepFormData.wakeTime}
                        onChange={(e) => setSleepFormData({ ...sleepFormData, wakeTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Activity className="w-4 h-4 inline mr-1" />
                      Sleep Quality ({sleepFormData.quality}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sleepFormData.quality}
                      onChange={(e) => setSleepFormData({ ...sleepFormData, quality: e.target.value })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Poor</span>
                      <span>Good</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={sleepFormData.notes}
                      onChange={(e) => setSleepFormData({ ...sleepFormData, notes: e.target.value })}
                      placeholder="How did you feel? Any factors affecting your sleep?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowLogModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleLogSleep}
                      className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Log Sleep
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}