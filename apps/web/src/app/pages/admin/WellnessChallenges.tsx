import { motion, AnimatePresence } from "motion/react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { 
  Trophy,
  Target,
  Users,
  TrendingUp,
  Calendar,
  Plus,
  Edit,
  Play,
  Pause,
  CheckCircle,
  Award,
  Heart,
  Zap,
  Moon,
  Coffee,
  Book,
  Footprints,
  Smile,
  X,
  Save,
  BarChart3,
  Eye
} from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";

interface Challenge {
  id: string;
  name: string;
  description: string;
  category: "mindfulness" | "exercise" | "sleep" | "journaling" | "social" | "habits";
  status: "active" | "draft" | "completed" | "scheduled";
  startDate: Date;
  endDate: Date;
  participants: number;
  completionRate: number;
  goal: string;
  difficulty: "easy" | "medium" | "hard";
  rewards: {
    points: number;
    badge?: string;
  };
  dailyTasks: string[];
}

export function WellnessChallenges() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  
  // Modal states
  const [viewStatsModal, setViewStatsModal] = useState<Challenge | null>(null);
  const [editModal, setEditModal] = useState<Challenge | null>(null);

  // Mock challenges
  const challenges: Challenge[] = [
    {
      id: "chal001",
      name: "7-Day Mindfulness Journey",
      description: "Practice daily meditation and breathing exercises",
      category: "mindfulness",
      status: "active",
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      participants: 342,
      completionRate: 68,
      goal: "Complete 7 days of 10-minute meditation",
      difficulty: "easy",
      rewards: {
        points: 100,
        badge: "Mindful Master"
      },
      dailyTasks: [
        "10 minutes guided meditation",
        "5 deep breathing exercises",
        "Mindful moment reflection"
      ]
    },
    {
      id: "chal002",
      name: "30-Day Sleep Optimization",
      description: "Establish healthy sleep habits and track progress",
      category: "sleep",
      status: "active",
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      participants: 456,
      completionRate: 72,
      goal: "Get 7-8 hours of sleep for 30 days",
      difficulty: "medium",
      rewards: {
        points: 300,
        badge: "Sleep Champion"
      },
      dailyTasks: [
        "Track sleep hours",
        "No screens 1 hour before bed",
        "Consistent sleep schedule"
      ]
    },
    {
      id: "chal003",
      name: "Gratitude Journal Challenge",
      description: "Write daily gratitude entries",
      category: "journaling",
      status: "active",
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      participants: 289,
      completionRate: 81,
      goal: "Write 3 gratitude items daily for 14 days",
      difficulty: "easy",
      rewards: {
        points: 150,
        badge: "Grateful Heart"
      },
      dailyTasks: [
        "Write 3 things you're grateful for",
        "Reflect on positive moments",
        "Share one gratitude with someone"
      ]
    },
    {
      id: "chal004",
      name: "Move More Challenge",
      description: "Daily physical activity tracking",
      category: "exercise",
      status: "active",
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      participants: 521,
      completionRate: 64,
      goal: "30 minutes of activity daily for 21 days",
      difficulty: "medium",
      rewards: {
        points: 250,
        badge: "Active Achiever"
      },
      dailyTasks: [
        "30 minutes of physical activity",
        "Track steps (goal: 8000+)",
        "Stretch for 5 minutes"
      ]
    },
    {
      id: "chal005",
      name: "Social Connection Week",
      description: "Reach out and connect with others",
      category: "social",
      status: "scheduled",
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      participants: 0,
      completionRate: 0,
      goal: "Connect with someone daily for 7 days",
      difficulty: "easy",
      rewards: {
        points: 100,
        badge: "Social Butterfly"
      },
      dailyTasks: [
        "Call or meet with someone",
        "Send a thoughtful message",
        "Join a group activity"
      ]
    },
    {
      id: "chal006",
      name: "Digital Detox Weekend",
      description: "Reduce screen time and find balance",
      category: "habits",
      status: "completed",
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      participants: 234,
      completionRate: 58,
      goal: "Limit screen time to 2 hours/day",
      difficulty: "hard",
      rewards: {
        points: 200,
        badge: "Digital Warrior"
      },
      dailyTasks: [
        "Track daily screen time",
        "2 hours screen-free activities",
        "No phone during meals"
      ]
    }
  ];

  // Participation trend
  const participationTrend = [
    { month: "Jan", participants: 234 },
    { month: "Feb", participants: 289 },
    { month: "Mar", participants: 312 },
    { month: "Apr", participants: 378 },
    { month: "May", participants: 456 },
    { month: "Jun", participants: 521 }
  ];

  // Completion rates by category
  const categoryData = [
    { category: "Mindfulness", rate: 68 },
    { category: "Sleep", rate: 72 },
    { category: "Journal", rate: 81 },
    { category: "Exercise", rate: 64 },
    { category: "Social", rate: 75 },
    { category: "Habits", rate: 58 }
  ];

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "mindfulness": return Heart;
      case "exercise": return Footprints;
      case "sleep": return Moon;
      case "journaling": return Book;
      case "social": return Users;
      case "habits": return Coffee;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "mindfulness": return "from-purple-500 to-pink-600";
      case "exercise": return "from-green-500 to-emerald-600";
      case "sleep": return "from-blue-500 to-indigo-600";
      case "journaling": return "from-yellow-500 to-orange-600";
      case "social": return "from-red-500 to-rose-600";
      case "habits": return "from-gray-500 to-slate-600";
      default: return "from-blue-500 to-indigo-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "active": return "bg-green-100 text-green-700";
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-gray-100 text-gray-700";
      case "draft": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "easy": return "bg-green-100 text-green-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const stats = {
    activeChallenges: challenges.filter(c => c.status === "active").length,
    totalParticipants: challenges.reduce((sum, c) => sum + c.participants, 0),
    avgCompletionRate: Math.round(challenges.reduce((sum, c) => sum + c.completionRate, 0) / challenges.length),
    totalBadgesEarned: 1847
  };

  return (
    <AdminLayoutNew>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Wellness Challenges</h1>
            <p className="text-gray-600 mt-1">Create and manage wellness challenges</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Create Challenge
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active Challenges</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeChallenges}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Avg Completion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgCompletionRate}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Badges Earned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBadgesEarned.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Participation Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Participation Growth</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={participationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px' 
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="participants" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Completion by Category */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Completion Rates by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px' 
                  }}
                />
                <Bar dataKey="rate" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Challenges List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">All Challenges</h2>

          <div className="space-y-4">
            {challenges.map((challenge, index) => {
              const CategoryIcon = getCategoryIcon(challenge.category);
              
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  onClick={() => setSelectedChallenge(selectedChallenge?.id === challenge.id ? null : challenge)}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                    selectedChallenge?.id === challenge.id
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl flex-shrink-0 bg-gradient-to-br ${getCategoryColor(challenge.category)}`}>
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{challenge.name}</h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium uppercase ${getStatusColor(challenge.status)}`}>
                          {challenge.status}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium uppercase ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3">{challenge.description}</p>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-600">Participants</p>
                          <p className="font-bold text-gray-900">{challenge.participants.toLocaleString()}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-600">Completion</p>
                          <p className="font-bold text-gray-900">{challenge.completionRate}%</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-600">Points</p>
                          <p className="font-bold text-yellow-600">{challenge.rewards.points}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-600">Duration</p>
                          <p className="font-bold text-gray-900">
                            {Math.ceil((challenge.endDate.getTime() - challenge.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </div>
                      </div>

                      {/* Goal & Badge */}
                      <div className="bg-blue-50 rounded-lg p-3 mb-3">
                        <div className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-blue-700 uppercase mb-1">Goal:</p>
                            <p className="text-sm text-blue-900">{challenge.goal}</p>
                          </div>
                        </div>

                        {challenge.rewards.badge && (
                          <div className="flex items-center gap-2 mt-2">
                            <Award className="w-4 h-4 text-yellow-600" />
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Badge:</span> {challenge.rewards.badge}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Expanded Details */}
                      {selectedChallenge?.id === challenge.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-4 border-t border-gray-300"
                        >
                          <h4 className="font-bold text-gray-900 mb-3">Daily Tasks:</h4>
                          <div className="space-y-2 mb-4">
                            {challenge.dailyTasks.map((task, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{task}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {challenge.startDate.toLocaleDateString()} - {challenge.endDate.toLocaleDateString()}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        {challenge.status === "active" && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Paused: ${challenge.name}`);
                              }}
                              className="flex-1 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium flex items-center justify-center gap-1"
                            >
                              <Pause className="w-4 h-4" />
                              Pause
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewStatsModal(challenge);
                              }}
                              className="flex-1 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium flex items-center justify-center gap-1"
                            >
                              <TrendingUp className="w-4 h-4" />
                              View Stats
                            </motion.button>
                          </>
                        )}

                        {challenge.status === "scheduled" && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Started early: ${challenge.name}`);
                            }}
                            className="flex-1 px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <Play className="w-4 h-4" />
                            Start Early
                          </motion.button>
                        )}

                        {challenge.status === "draft" && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Published: ${challenge.name}`);
                            }}
                            className="flex-1 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <Play className="w-4 h-4" />
                            Publish
                          </motion.button>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditModal(challenge);
                          }}
                          className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Create Challenge Modal */}
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Wellness Challenge</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Name</label>
                  <input
                    type="text"
                    placeholder="e.g., 21-Day Fitness Challenge"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="What will participants do in this challenge?"
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none">
                      <option>Mindfulness</option>
                      <option>Exercise</option>
                      <option>Sleep</option>
                      <option>Journaling</option>
                      <option>Social</option>
                      <option>Habits</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none">
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reward Points</label>
                    <input
                      type="number"
                      placeholder="100"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Badge Name</label>
                    <input
                      type="text"
                      placeholder="Challenge Master"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium"
                >
                  Create Challenge
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* View Stats Modal */}
        <AnimatePresence>
          {viewStatsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setViewStatsModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Challenge Statistics</h3>
                  <Button variant="ghost" size="sm" onClick={() => setViewStatsModal(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Users className="w-6 h-6 text-blue-600 mb-2" />
                      <p className="text-3xl font-bold text-blue-600">{viewStatsModal.participants}</p>
                      <p className="text-sm text-gray-600">Participants</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                      <p className="text-3xl font-bold text-green-600">{viewStatsModal.completionRate}%</p>
                      <p className="text-sm text-gray-600">Completion</p>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Award className="w-6 h-6 text-yellow-600 mb-2" />
                      <p className="text-3xl font-bold text-yellow-600">{viewStatsModal.rewards.points}</p>
                      <p className="text-sm text-gray-600">Points</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-3 text-gray-900">{viewStatsModal.name}</h4>
                    <p className="text-gray-600">{viewStatsModal.description}</p>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 text-gray-900">Daily Tasks:</h4>
                    <div className="space-y-2">
                      {viewStatsModal.dailyTasks.map((task, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <span className="text-sm text-gray-700">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={() => setViewStatsModal(null)}>
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {editModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setEditModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Edit Challenge</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditModal(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Name</label>
                    <Input defaultValue={editModal.name} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      defaultValue={editModal.description}
                      rows={3}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select 
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        defaultValue={editModal.category}
                      >
                        <option value="mindfulness">Mindfulness</option>
                        <option value="exercise">Exercise</option>
                        <option value="sleep">Sleep</option>
                        <option value="journaling">Journaling</option>
                        <option value="social">Social</option>
                        <option value="habits">Habits</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                      <select 
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        defaultValue={editModal.difficulty}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select 
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        defaultValue={editModal.status}
                      >
                        <option value="active">Active</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="draft">Draft</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reward Points</label>
                      <Input type="number" defaultValue={editModal.rewards.points} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Badge Name</label>
                    <Input defaultValue={editModal.rewards.badge} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
                    <Input defaultValue={editModal.goal} />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditModal(null)}
                    className="flex-1 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      alert(`Saved changes to: ${editModal.name}`);
                      setEditModal(null);
                    }}
                    className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium"
                  >
                    <Save className="w-4 h-4 inline mr-2" />
                    Save Changes
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayoutNew>
  );
}