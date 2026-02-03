import { AppLayout } from "../../components/AppLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  Calendar,
  Video,
  MessageSquare,
  TrendingUp,
  Heart,
  Bookmark,
  Play,
  ChevronRight,
  Filter,
  Search,
  Download,
  Smile,
  Meh,
  Frown,
  Star
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface SessionData {
  id: string;
  date: string;
  duration: string;
  type: "video" | "chat";
  mood: "positive" | "neutral" | "concerned";
  moodEmoji: string;
  messagesCount: number;
  highlightsCount: number;
  topicsDiscussed: string[];
  thumbnail: string;
  summary: string;
  sentiment: number;
  favorite: boolean;
  status?: "completed" | "upcoming";
}

export function SessionHistory() {
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  const [filterMood, setFilterMood] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"completed" | "upcoming">("completed");

  const handleReplaySession = () => {
    // Navigate to active session page to replay the session
    navigate("/app/active-session");
  };

  const handleExportSession = (session: SessionData) => {
    // Create session data object
    const exportData = {
      sessionId: session.id,
      date: session.date,
      duration: session.duration,
      type: session.type,
      mood: session.mood,
      sentiment: `${session.sentiment}%`,
      messagesCount: session.messagesCount,
      highlightsCount: session.highlightsCount,
      topicsDiscussed: session.topicsDiscussed.join(", "),
      summary: session.summary,
      exportedAt: new Date().toISOString()
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create a blob and download
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `session-${session.id}-${session.date.replace(/,?\s+/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const completedSessions: SessionData[] = [
    {
      id: "1",
      date: "December 29, 2024",
      duration: "45 min",
      type: "video",
      mood: "positive",
      moodEmoji: "😊",
      messagesCount: 28,
      highlightsCount: 5,
      topicsDiscussed: ["Work Stress", "Coping Strategies", "Self-Care"],
      thumbnail: "gradient-1",
      summary: "We discussed managing work-related stress and explored healthy coping mechanisms. You identified three key self-care activities to incorporate into your routine.",
      sentiment: 85,
      favorite: true,
      status: "completed"
    },
    {
      id: "2",
      date: "December 27, 2024",
      duration: "38 min",
      type: "chat",
      mood: "neutral",
      moodEmoji: "😐",
      messagesCount: 22,
      highlightsCount: 3,
      topicsDiscussed: ["Daily Routine", "Goals", "Motivation"],
      thumbnail: "gradient-2",
      summary: "Focused on establishing a consistent daily routine and setting achievable short-term goals. Discussed strategies for maintaining motivation.",
      sentiment: 70,
      favorite: false,
      status: "completed"
    },
    {
      id: "3",
      date: "December 25, 2024",
      duration: "52 min",
      type: "video",
      mood: "concerned",
      moodEmoji: "😟",
      messagesCount: 35,
      highlightsCount: 7,
      topicsDiscussed: ["Anxiety", "Breathing Exercises", "Support System"],
      thumbnail: "gradient-3",
      summary: "Addressed feelings of anxiety and practiced breathing exercises together. Identified key members of your support system and ways to reach out.",
      sentiment: 55,
      favorite: true,
      status: "completed"
    },
    {
      id: "4",
      date: "December 22, 2024",
      duration: "40 min",
      type: "chat",
      mood: "positive",
      moodEmoji: "😊",
      messagesCount: 25,
      highlightsCount: 4,
      topicsDiscussed: ["Achievements", "Gratitude", "Future Plans"],
      thumbnail: "gradient-4",
      summary: "Celebrated recent achievements and practiced gratitude. Discussed exciting plans for the future and steps to get there.",
      sentiment: 90,
      favorite: false,
      status: "completed"
    },
    {
      id: "5",
      date: "December 20, 2024",
      duration: "35 min",
      type: "video",
      mood: "neutral",
      moodEmoji: "😐",
      messagesCount: 20,
      highlightsCount: 2,
      topicsDiscussed: ["Sleep Patterns", "Energy Levels", "Exercise"],
      thumbnail: "gradient-5",
      summary: "Explored your sleep patterns and energy levels throughout the day. Discussed the connection between physical activity and mental wellness.",
      sentiment: 75,
      favorite: false,
      status: "completed"
    }
  ];

  const upcomingSessions: SessionData[] = [
    {
      id: "u1",
      date: "December 31, 2024 at 2:00 PM",
      duration: "45 min",
      type: "video",
      mood: "positive",
      moodEmoji: "😊",
      messagesCount: 0,
      highlightsCount: 0,
      topicsDiscussed: ["Year Review", "Goal Setting", "New Year Plans"],
      thumbnail: "gradient-1",
      summary: "Scheduled year-end review session to reflect on progress and set intentions for the new year.",
      sentiment: 0,
      favorite: false,
      status: "upcoming"
    },
    {
      id: "u2",
      date: "January 2, 2025 at 10:00 AM",
      duration: "30 min",
      type: "chat",
      mood: "neutral",
      moodEmoji: "😊",
      messagesCount: 0,
      highlightsCount: 0,
      topicsDiscussed: ["Weekly Check-in"],
      thumbnail: "gradient-2",
      summary: "Regular weekly check-in to discuss progress and any challenges.",
      sentiment: 0,
      favorite: false,
      status: "upcoming"
    },
    {
      id: "u3",
      date: "January 5, 2025 at 4:00 PM",
      duration: "60 min",
      type: "video",
      mood: "positive",
      moodEmoji: "😊",
      messagesCount: 0,
      highlightsCount: 0,
      topicsDiscussed: ["Deep Dive Session", "Personal Growth"],
      thumbnail: "gradient-3",
      summary: "Extended session for in-depth discussion on personal growth strategies.",
      sentiment: 0,
      favorite: true,
      status: "upcoming"
    }
  ];

  const sessions = activeTab === "completed" ? completedSessions : upcomingSessions;

  const filteredSessions = sessions.filter((session) => {
    if (activeTab === "upcoming") return true; // Don't filter upcoming sessions by mood
    const matchesMood = filterMood === "all" || session.mood === filterMood;
    const matchesSearch = session.topicsDiscussed.some(topic => 
      topic.toLowerCase().includes(searchQuery.toLowerCase())
    ) || session.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMood && (searchQuery === "" || matchesSearch);
  });

  const gradientStyles: Record<string, string> = {
    "gradient-1": "from-blue-400 to-purple-500",
    "gradient-2": "from-purple-400 to-pink-500",
    "gradient-3": "from-orange-400 to-red-500",
    "gradient-4": "from-green-400 to-teal-500",
    "gradient-5": "from-indigo-400 to-blue-500"
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "positive": return <Smile className="w-4 h-4 text-green-500" />;
      case "neutral": return <Meh className="w-4 h-4 text-blue-500" />;
      case "concerned": return <Frown className="w-4 h-4 text-orange-500" />;
      default: return null;
    }
  };

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
                <Clock className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">Session History</h1>
              </div>
              <p className="text-muted-foreground">
                Review your past sessions and track your progress
              </p>
            </div>
            <Link to="/app/session-lobby">
              <Button className="gap-2">
                <Video className="w-4 h-4" />
                New Session
              </Button>
            </Link>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">{completedSessions.length}</p>
                </div>
                <Video className="w-8 h-8 text-primary" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Time</p>
                  <p className="text-2xl font-bold">3.5h</p>
                </div>
                <Clock className="w-8 h-8 text-secondary" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Sentiment</p>
                  <p className="text-2xl font-bold">75%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{upcomingSessions.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <motion.button
              onClick={() => setActiveTab("completed")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "completed"
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Completed Sessions ({completedSessions.length})
              {activeTab === "completed" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-3 font-medium transition-colors relative ${
                activeTab === "upcoming"
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Upcoming Sessions ({upcomingSessions.length})
              {activeTab === "upcoming" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          </div>

          {/* Filters & Search - Only show for completed sessions */}
          {activeTab === "completed" && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search topics or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                {["all", "positive", "neutral", "concerned"].map((mood) => (
                  <Button
                    key={mood}
                    onClick={() => setFilterMood(mood)}
                    variant={filterMood === mood ? "default" : "outline"}
                    className="capitalize"
                  >
                    {mood === "all" ? "All" : mood}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Sessions List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredSessions.length === 0 && (
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">
                {activeTab === "upcoming" ? "No Upcoming Sessions" : "No Sessions Found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === "upcoming"
                  ? "Schedule a session to get started"
                  : "Try adjusting your filters"}
              </p>
              {activeTab === "upcoming" && (
                <Link to="/app/session-lobby">
                  <Button>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Session
                  </Button>
                </Link>
              )}
            </Card>
          )}
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  <div className={`w-full sm:w-48 h-32 bg-gradient-to-br ${gradientStyles[session.thumbnail]} relative`}>
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-white/20 rounded-full blur-3xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedSession(session)}
                        className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl"
                      >
                        <Play className="w-6 h-6 text-primary ml-1" />
                      </motion.button>
                    </div>
                    {session.favorite && (
                      <div className="absolute top-2 right-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-muted-foreground">{session.date}</span>
                          <span className="text-gray-300">•</span>
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-muted-foreground">{session.duration}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{session.summary}</p>
                      </div>
                      {getMoodIcon(session.mood)}
                    </div>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {session.topicsDiscussed.map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{session.messagesCount} messages</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark className="w-4 h-4" />
                        <span>{session.highlightsCount} highlights</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{session.sentiment}% positive</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 flex sm:flex-col gap-2 border-t sm:border-t-0 sm:border-l border-gray-200">
                    <Button
                      onClick={() => setSelectedSession(session)}
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportSession(session);
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Session Detail Modal */}
        <AnimatePresence>
          {selectedSession && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedSession(null)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-3xl z-50"
              >
                <Card className="p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Session Details</h2>
                      <p className="text-sm text-muted-foreground">{selectedSession.date}</p>
                    </div>
                    <button
                      onClick={() => setSelectedSession(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Summary */}
                    <div>
                      <h3 className="font-bold mb-2">Summary</h3>
                      <p className="text-sm text-gray-600">{selectedSession.summary}</p>
                    </div>

                    {/* Key Highlights */}
                    <div>
                      <h3 className="font-bold mb-2">Key Highlights</h3>
                      <div className="space-y-2">
                        {[
                          "Identified work stress triggers",
                          "Practiced breathing exercises",
                          "Created action plan for self-care",
                          "Discussed support system",
                          "Set goals for next session"
                        ].slice(0, selectedSession.highlightsCount).map((highlight, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-600">{highlight}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sentiment Analysis */}
                    <div>
                      <h3 className="font-bold mb-2">Sentiment Analysis</h3>
                      <div className="flex items-center gap-3">
                        {getMoodIcon(selectedSession.mood)}
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedSession.sentiment}%` }}
                              transition={{ duration: 1 }}
                              className={`h-full rounded-full ${
                                selectedSession.mood === "positive"
                                  ? "bg-green-500"
                                  : selectedSession.mood === "concerned"
                                  ? "bg-orange-500"
                                  : "bg-blue-500"
                              }`}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium">{selectedSession.sentiment}%</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <Button className="flex-1" onClick={handleReplaySession}>
                        <Play className="w-4 h-4 mr-2" />
                        Replay Session
                      </Button>
                      <Button variant="outline" onClick={() => handleExportSession(selectedSession)}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
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