import { AppLayout } from "../../components/AppLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion } from "motion/react";
import {
  TrendingUp,
  Award,
  Target,
  Calendar,
  Heart,
  Video,
  BookOpen,
  Flame,
  Star,
  Trophy,
  Zap,
  Download
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export function Progress() {
  const weeklyProgress = [
    { week: "Week 1", mood: 6, sessions: 2, journals: 3, checkIns: 5 },
    { week: "Week 2", mood: 7, sessions: 3, journals: 4, checkIns: 6 },
    { week: "Week 3", mood: 7.5, sessions: 2, journals: 5, checkIns: 7 },
    { week: "Week 4", mood: 8, sessions: 3, journals: 6, checkIns: 7 }
  ];

  const wellnessScore = [
    { category: "Emotional", score: 85 },
    { category: "Mental", score: 78 },
    { category: "Physical", score: 72 },
    { category: "Social", score: 80 },
    { category: "Sleep", score: 70 }
  ];

  const monthlyActivity = [
    { month: "Sep", value: 45 },
    { month: "Oct", value: 52 },
    { month: "Nov", value: 68 },
    { month: "Dec", value: 78 }
  ];

  const achievements = [
    {
      icon: Flame,
      title: "7 Day Streak",
      description: "Checked in every day this week",
      unlocked: true,
      color: "from-orange-400 to-red-500"
    },
    {
      icon: Star,
      title: "First Session",
      description: "Completed your first AI session",
      unlocked: true,
      color: "from-yellow-400 to-amber-500"
    },
    {
      icon: Trophy,
      title: "Journal Master",
      description: "Written 25 journal entries",
      unlocked: true,
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: Zap,
      title: "Wellness Warrior",
      description: "Completed 10 wellness exercises",
      unlocked: false,
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: Heart,
      title: "Mood Maven",
      description: "Tracked mood for 30 days",
      unlocked: false,
      color: "from-pink-400 to-rose-500"
    },
    {
      icon: Target,
      title: "Goal Getter",
      description: "Achieved 5 personal goals",
      unlocked: false,
      color: "from-green-400 to-emerald-500"
    }
  ];

  const stats = [
    {
      icon: Video,
      label: "AI Sessions",
      value: "12",
      change: "+3 this week",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Heart,
      label: "Mood Check-ins",
      value: "45",
      change: "+7 this week",
      color: "text-pink-500",
      bgColor: "bg-pink-50"
    },
    {
      icon: BookOpen,
      label: "Journal Entries",
      value: "28",
      change: "+4 this week",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: "7 days",
      change: "Best: 12 days",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
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
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">Your Progress</h1>
              </div>
              <p className="text-muted-foreground">
                Track your wellness journey and celebrate wins
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Download className="w-4 h-4" />
              Export Report
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className={`p-5 shadow-lg ${stat.bgColor}`}>
                  <Icon className={`w-7 h-7 mb-3 ${stat.color}`} />
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Weekly Progress</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" />
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
                    name="Mood Score"
                  />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="#ec4899"
                    strokeWidth={3}
                    name="Sessions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Wellness Score */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-4">Wellness Score</h2>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={wellnessScore}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="category" stroke="#6b7280" />
                  <PolarRadiusAxis stroke="#6b7280" />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Monthly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Monthly Activity</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {monthlyActivity.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"][index]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Achievements</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    whileHover={achievement.unlocked ? { scale: 1.03, y: -5 } : {}}
                  >
                    <Card
                      className={`p-5 transition-all ${
                        achievement.unlocked
                          ? `bg-gradient-to-br ${achievement.color} text-white shadow-lg cursor-pointer`
                          : "bg-gray-100 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <motion.div
                          animate={
                            achievement.unlocked
                              ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }
                              : {}
                          }
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          className={`p-3 rounded-full ${
                            achievement.unlocked ? "bg-white/20" : "bg-white/50"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">{achievement.title}</h3>
                          <p
                            className={`text-sm ${
                              achievement.unlocked ? "text-white/90" : "text-gray-600"
                            }`}
                          >
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <div className="flex items-center gap-1 text-xs font-medium">
                          <Star className="w-3 h-3" />
                          Unlocked
                        </div>
                      )}
                      {!achievement.unlocked && (
                        <div className="text-xs font-medium text-gray-500">🔒 Locked</div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Motivational Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <Card className="p-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white shadow-xl">
            <div className="flex items-start gap-3">
              <Trophy className="w-8 h-8 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">You're Doing Great! 🎉</h3>
                <p className="text-white/90 mb-4">
                  You've completed 78% of your wellness goals this month. Keep up the amazing work!
                </p>
                <div className="flex gap-3">
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    +15% vs last month
                  </div>
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    Top 10% of users
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}