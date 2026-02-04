import { AppLayout } from "../../components/AppLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import {
  Video,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle,
  User,
  Volume2,
  Settings,
  ArrowRight,
  Play,
  X,
  Check
} from "lucide-react";
import { useState } from "react";

export function SessionLobby() {
  const [selectedMode, setSelectedMode] = useState<"now" | "schedule">("now");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("Voice 1");
  const [selectedAvatar, setSelectedAvatar] = useState("Alex");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const voices = [
    { id: "voice1", name: "Voice 1", description: "Warm and friendly", gender: "Female" },
    { id: "voice2", name: "Voice 2", description: "Calm and reassuring", gender: "Male" },
    { id: "voice3", name: "Voice 3", description: "Professional and clear", gender: "Female" },
    { id: "voice4", name: "Voice 4", description: "Gentle and soothing", gender: "Male" }
  ];

  const avatars = [
    { id: "alex", name: "Alex", emoji: "👨‍⚕️", description: "Supportive and empathetic" },
    { id: "sarah", name: "Sarah", emoji: "👩‍⚕️", description: "Warm and understanding" },
    { id: "michael", name: "Michael", emoji: "👨‍💼", description: "Professional and attentive" },
    { id: "emma", name: "Emma", emoji: "👩‍🦰", description: "Kind and patient" }
  ];

  const durations = [15, 30, 45, 60];

  const preSessionChecklist = [
    { label: "Find a quiet, private space", checked: true },
    { label: "Check your audio/video", checked: true },
    { label: "Take a few deep breaths", checked: false },
    { label: "Set your intention for this session", checked: false }
  ];

  const upcomingSessions = [
    {
      date: "Tomorrow, 2:00 PM",
      duration: "45 min",
      type: "Weekly Check-in",
      avatar: "👨‍⚕️"
    },
    {
      date: "Friday, 10:00 AM",
      duration: "30 min",
      type: "Mood Session",
      avatar: "👩‍⚕️"
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
          <h1 className="text-3xl font-bold mb-2">AI Session with Ezri</h1>
          <p className="text-muted-foreground">
            Start a conversation or schedule a session for later
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Session Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mode Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-4">Session Type</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/app/active-session">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-xl border-2 transition-all w-full ${
                        selectedMode === "now"
                          ? "border-primary bg-primary/10 shadow-lg"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Play className={`w-8 h-8 mb-3 mx-auto ${selectedMode === "now" ? "text-primary" : "text-gray-400"}`} />
                      <h3 className="font-bold mb-1">Start Now</h3>
                      <p className="text-sm text-muted-foreground">Begin immediately</p>
                    </motion.button>
                  </Link>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMode("schedule")}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedMode === "schedule"
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Calendar className={`w-8 h-8 mb-3 mx-auto ${selectedMode === "schedule" ? "text-primary" : "text-gray-400"}`} />
                    <h3 className="font-bold mb-1">Schedule</h3>
                    <p className="text-sm text-muted-foreground">Pick a time</p>
                  </motion.button>
                </div>
              </Card>
            </motion.div>

            {/* Duration Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">Session Duration</h2>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {durations.map((duration, index) => (
                    <motion.button
                      key={duration}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDuration(duration)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedDuration === duration
                          ? "border-primary bg-primary text-white shadow-lg"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-2xl font-bold">{duration}</div>
                      <div className="text-xs mt-1">min</div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Ezri Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 shadow-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white overflow-hidden relative">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"
                />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl"
                    >
                      👨‍⚕️
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-lg">Ezri is ready</h3>
                      <p className="text-white/90 text-sm">Your AI companion</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-4">
                    "I'm here to listen and support you. Let's have a meaningful conversation together."
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Available 24/7 • Private & Secure</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Pre-Session Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-4">Before You Start</h2>
                <div className="space-y-3">
                  {preSessionChecklist.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          item.checked
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {item.checked && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className={item.checked ? "text-muted-foreground line-through" : ""}>
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Start Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {selectedMode === "now" ? (
                <Link to="/app/active-session">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="w-full h-16 text-lg group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-purple-500/50 transition-all">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Video className="w-6 h-6" />
                        </motion.div>
                        <span className="font-bold">Start Session Now ({selectedDuration} min)</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </motion.div>
                </Link>
              ) : (
                <Button 
                  className="w-full h-16 text-lg bg-gradient-to-r from-gray-600 to-gray-700"
                  onClick={() => setShowScheduleModal(true)}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule for Later
                </Button>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">Session Settings</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Voice</span>
                    </div>
                    <span className="text-sm font-medium">{selectedVoice}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Avatar</span>
                    </div>
                    <span className="text-sm font-medium">{selectedAvatar}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowCustomizeModal(true)}
                  >
                    Customize
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">Upcoming</h3>
                </div>
                <div className="space-y-3">
                  {upcomingSessions.map((session, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{session.avatar}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{session.type}</p>
                          <p className="text-xs text-muted-foreground">{session.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {session.duration}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 shadow-xl bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200">
                <div className="flex items-start gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <h3 className="font-bold text-amber-900">Session Tip</h3>
                </div>
                <p className="text-sm text-amber-800">
                  Try to be present and honest during your session. There's no right or wrong way to feel.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Customize Modal */}
        <AnimatePresence>
          {showCustomizeModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCustomizeModal(false)}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              >
                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-2xl"
                >
                  <Card className="p-6 shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold">Customize Voice & Avatar</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Personalize your session experience
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowCustomizeModal(false)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* Voice Selection */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Volume2 className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg">Voice Selection</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {voices.map((voice, index) => (
                          <motion.button
                            key={voice.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedVoice(voice.name)}
                            className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                              selectedVoice === voice.name
                                ? "border-primary bg-primary/10 shadow-lg"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {selectedVoice === voice.name && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 bg-primary rounded-full p-1"
                              >
                                <Check className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                            <div className="font-bold mb-1">{voice.name}</div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {voice.description}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                              {voice.gender}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Avatar Selection */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg">Avatar Selection</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {avatars.map((avatar, index) => (
                          <motion.button
                            key={avatar.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedAvatar(avatar.name)}
                            className={`p-4 rounded-xl border-2 transition-all text-center relative ${
                              selectedAvatar === avatar.name
                                ? "border-primary bg-primary/10 shadow-lg"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {selectedAvatar === avatar.name && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 bg-primary rounded-full p-1"
                              >
                                <Check className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                            <div className="text-4xl mb-2">{avatar.emoji}</div>
                            <div className="font-bold mb-1">{avatar.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {avatar.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setShowCustomizeModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        onClick={() => setShowCustomizeModal(false)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Schedule Modal */}
        <AnimatePresence>
          {showScheduleModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowScheduleModal(false)}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              >
                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-2xl"
                >
                  <Card className="p-6 shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold">Schedule a Session</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pick a date and time for your session
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowScheduleModal(false)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* Date and Time Selection */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg">Date & Time</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl border-2 transition-all text-left relative">
                          <input
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className="w-full p-2 border-none outline-none"
                          />
                        </div>
                        <div className="p-4 rounded-xl border-2 transition-all text-left relative">
                          <input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="w-full p-2 border-none outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setShowScheduleModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        onClick={() => setShowScheduleModal(false)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}