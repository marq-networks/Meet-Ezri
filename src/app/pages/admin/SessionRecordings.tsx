import { useState } from "react";
import { motion } from "motion/react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import {
  Video,
  Flag,
  AlertTriangle,
  Star,
  User,
  Calendar,
  Clock,
  MessageSquare,
  Pause,
  Play,
  VolumeX,
  Volume2,
  Download,
  CheckCircle,
  Search,
} from "lucide-react";

interface SessionRecording {
  id: string;
  userId: string;
  userName: string;
  sessionDate: Date;
  duration: number;
  status: "completed" | "flagged" | "reviewed" | "escalated";
  aiTherapist: string;
  topics: string[];
  sentiment: "positive" | "neutral" | "negative" | "crisis";
  flaggedIssues?: string[];
  qualityScore: number;
  transcriptAvailable: boolean;
  reviewedBy?: string;
  reviewNotes?: string;
}

export function SessionRecordings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRecording, setSelectedRecording] = useState<SessionRecording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Mock session recordings
  const recordings: SessionRecording[] = [
    {
      id: "rec001",
      userId: "u456",
      userName: "Sarah J.",
      sessionDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 42,
      status: "flagged",
      aiTherapist: "Dr. Emma (Compassionate)",
      topics: ["Anxiety", "Work Stress", "Sleep Issues"],
      sentiment: "negative",
      flaggedIssues: ["Mention of self-harm", "Severe anxiety indicators"],
      qualityScore: 78,
      transcriptAvailable: true
    },
    {
      id: "rec002",
      userId: "u789",
      userName: "Michael C.",
      sessionDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
      duration: 38,
      status: "completed",
      aiTherapist: "Dr. James (Professional)",
      topics: ["Depression", "Relationships"],
      sentiment: "neutral",
      qualityScore: 92,
      transcriptAvailable: true
    },
    {
      id: "rec003",
      userId: "u234",
      userName: "Emily R.",
      sessionDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      duration: 45,
      status: "reviewed",
      aiTherapist: "Dr. Sofia (Empathetic)",
      topics: ["Grief", "Loss", "Coping"],
      sentiment: "negative",
      qualityScore: 88,
      transcriptAvailable: true,
      reviewedBy: "Admin John",
      reviewNotes: "High quality session, appropriate responses, follow-up scheduled"
    },
    {
      id: "rec004",
      userId: "u567",
      userName: "David L.",
      sessionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      duration: 52,
      status: "escalated",
      aiTherapist: "Dr. Alex (Supportive)",
      topics: ["Suicidal Ideation", "Crisis"],
      sentiment: "crisis",
      flaggedIssues: ["Active suicidal ideation", "Plan mentioned", "Immediate intervention required"],
      qualityScore: 95,
      transcriptAvailable: true,
      reviewedBy: "Crisis Team Lead",
      reviewNotes: "Escalated to crisis team. User contacted by hotline within 10 minutes."
    },
    {
      id: "rec005",
      userId: "u890",
      userName: "Jessica M.",
      sessionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      duration: 35,
      status: "completed",
      aiTherapist: "Dr. Emma (Compassionate)",
      topics: ["Self-esteem", "Personal Growth"],
      sentiment: "positive",
      qualityScore: 91,
      transcriptAvailable: true
    },
    {
      id: "rec006",
      userId: "u123",
      userName: "Robert K.",
      sessionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      duration: 29,
      status: "flagged",
      aiTherapist: "Dr. James (Professional)",
      topics: ["Anger Management", "Workplace Conflict"],
      sentiment: "negative",
      flaggedIssues: ["Violence indicators", "Threats toward others"],
      qualityScore: 72,
      transcriptAvailable: true
    }
  ];

  const filteredRecordings = recordings.filter(rec => {
    const matchesSearch = rec.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === "all" || rec.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-700";
      case "flagged": return "bg-yellow-100 text-yellow-700";
      case "reviewed": return "bg-blue-100 text-blue-700";
      case "escalated": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case "positive": return "text-green-600";
      case "neutral": return "text-gray-600";
      case "negative": return "text-orange-600";
      case "crisis": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "completed": return CheckCircle;
      case "flagged": return Flag;
      case "reviewed": return MessageSquare;
      case "escalated": return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const stats = {
    totalRecordings: recordings.length,
    flaggedSessions: recordings.filter(r => r.status === "flagged").length,
    escalatedSessions: recordings.filter(r => r.status === "escalated").length,
    avgQualityScore: Math.round(recordings.reduce((sum, r) => sum + r.qualityScore, 0) / recordings.length)
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
            <h1 className="text-3xl font-bold text-gray-900">AI Session Recordings</h1>
            <p className="text-gray-600 mt-1">Review and analyze therapy session recordings</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Recordings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRecordings}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600">
                <Flag className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Flagged</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.flaggedSessions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Escalated</p>
                <p className="text-2xl font-bold text-red-600">{stats.escalatedSessions}</p>
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
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Avg Quality</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgQualityScore}/100</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by user name or topic..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="flagged">Flagged</option>
              <option value="reviewed">Reviewed</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </motion.div>

        {/* Recordings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Session Recordings</h2>

          <div className="space-y-4">
            {filteredRecordings.map((recording, index) => {
              const StatusIcon = getStatusIcon(recording.status);
              
              return (
                <motion.div
                  key={recording.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  onClick={() => setSelectedRecording(selectedRecording?.id === recording.id ? null : recording)}
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                    selectedRecording?.id === recording.id
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl flex-shrink-0 bg-gradient-to-br ${
                      recording.status === "escalated" ? "from-red-500 to-rose-600" :
                      recording.status === "flagged" ? "from-yellow-500 to-orange-600" :
                      recording.status === "reviewed" ? "from-blue-500 to-indigo-600" :
                      "from-green-500 to-emerald-600"
                    }`}>
                      <Video className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{recording.userName}</h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium uppercase flex items-center gap-1 ${getStatusColor(recording.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          {recording.status}
                        </span>
                        <span className={`text-xs font-medium ${getSentimentColor(recording.sentiment)}`}>
                          {recording.sentiment}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {recording.aiTherapist}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {recording.sessionDate.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {recording.duration} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {recording.qualityScore}/100
                        </div>
                      </div>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {recording.topics.map((topic, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Flagged Issues */}
                      {recording.flaggedIssues && recording.flaggedIssues.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <p className="text-xs font-bold text-red-700 uppercase">Flagged Issues:</p>
                          </div>
                          <div className="space-y-1">
                            {recording.flaggedIssues.map((issue, idx) => (
                              <p key={idx} className="text-xs text-red-700">• {issue}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Review Notes */}
                      {recording.reviewNotes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                            <p className="text-xs font-bold text-blue-700 uppercase">
                              Reviewed by {recording.reviewedBy}:
                            </p>
                          </div>
                          <p className="text-sm text-blue-700">{recording.reviewNotes}</p>
                        </div>
                      )}

                      {/* Expanded Player */}
                      {selectedRecording?.id === recording.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-4 border-t border-gray-300"
                        >
                          {/* Mock Audio Player */}
                          <div className="bg-gray-100 rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-4 mb-3">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsPlaying(!isPlaying);
                                }}
                                className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                              >
                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                              </motion.button>

                              {/* Progress Bar */}
                              <div className="flex-1">
                                <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                                  <motion.div
                                    animate={{ width: isPlaying ? "100%" : "0%" }}
                                    transition={{ duration: recording.duration * 60, ease: "linear" }}
                                    className="h-full bg-blue-500"
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                  <span>0:00</span>
                                  <span>{recording.duration}:00</span>
                                </div>
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsMuted(!isMuted);
                                }}
                                className="p-2 rounded-lg hover:bg-gray-200"
                              >
                                {isMuted ? <VolumeX className="w-5 h-5 text-gray-600" /> : <Volume2 className="w-5 h-5 text-gray-600" />}
                              </motion.button>
                            </div>

                            <p className="text-xs text-gray-600 text-center">
                              Audio playback simulation • Actual recordings require secure access
                            </p>
                          </div>

                          {/* Transcript Preview */}
                          {recording.transcriptAvailable && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <h4 className="font-bold text-gray-900 mb-2 text-sm">Transcript Preview:</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex gap-2">
                                  <span className="font-medium text-blue-600">{recording.aiTherapist}:</span>
                                  <span className="text-gray-700">Hello {recording.userName.split(" ")[0]}, how are you feeling today?</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="font-medium text-purple-600">{recording.userName}:</span>
                                  <span className="text-gray-700">I've been struggling with anxiety lately...</span>
                                </div>
                                <p className="text-xs text-gray-500 italic mt-2">Full transcript available for download</p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecording(recording);
                          }}
                          className="flex-1 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium flex items-center justify-center gap-1"
                        >
                          <Play className="w-4 h-4" />
                          {selectedRecording?.id === recording.id ? "Playing" : "Play"}
                        </motion.button>

                        {recording.transcriptAvailable && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-3 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Transcript
                          </motion.button>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>

                        {recording.status === "flagged" && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Reviewed
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AdminLayoutNew>
  );
}