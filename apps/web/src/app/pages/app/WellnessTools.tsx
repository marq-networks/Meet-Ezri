import { AppLayout } from "../../components/AppLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { EzriGuidedMode } from "../../components/modals";
import {
  Heart,
  Wind,
  Brain,
  Music,
  Coffee,
  Sun,
  Moon,
  Smile,
  Play,
  Pause,
  RotateCcw,
  X,
  Clock,
  Star,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";

export function WellnessTools() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "hold2">("inhale");
  const [phaseTimer, setPhaseTimer] = useState(0);
  const [guidedExercise, setGuidedExercise] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const categories = [
    { icon: Wind, label: "Breathing", color: "from-blue-400 to-cyan-500" },
    { icon: Brain, label: "Meditation", color: "from-purple-400 to-pink-500" },
    { icon: Music, label: "Sounds", color: "from-green-400 to-emerald-500" },
    { icon: Smile, label: "Gratitude", color: "from-amber-400 to-orange-500" }
  ];

  const exercises = [
    {
      id: "box-breathing",
      category: "Breathing",
      title: "Box Breathing",
      description: "4-4-4-4 breathing pattern to reduce stress",
      duration: "5 min",
      difficulty: "Beginner",
      icon: Wind,
      color: "from-blue-400 to-cyan-500",
      favorite: true
    },
    {
      id: "body-scan",
      category: "Meditation",
      title: "Body Scan Meditation",
      description: "Progressive relaxation from head to toe",
      duration: "10 min",
      difficulty: "Beginner",
      icon: Brain,
      color: "from-purple-400 to-pink-500",
      favorite: false
    },
    {
      id: "478-breathing",
      category: "Breathing",
      title: "4-7-8 Breathing",
      description: "Natural tranquilizer for the nervous system",
      duration: "3 min",
      difficulty: "Beginner",
      icon: Wind,
      color: "from-blue-400 to-cyan-500",
      favorite: true
    },
    {
      id: "mindfulness",
      category: "Meditation",
      title: "Mindfulness Practice",
      description: "Present moment awareness meditation",
      duration: "15 min",
      difficulty: "Intermediate",
      icon: Brain,
      color: "from-purple-400 to-pink-500",
      favorite: false
    },
    {
      id: "rain-sounds",
      category: "Sounds",
      title: "Rain & Thunder",
      description: "Calming nature sounds for relaxation",
      duration: "∞",
      difficulty: "Any",
      icon: Music,
      color: "from-green-400 to-emerald-500",
      favorite: true
    },
    {
      id: "gratitude",
      category: "Gratitude",
      title: "Gratitude Reflection",
      description: "Focus on three things you're grateful for",
      duration: "5 min",
      difficulty: "Beginner",
      icon: Smile,
      color: "from-amber-400 to-orange-500",
      favorite: false
    },
    {
      id: "morning-meditation",
      category: "Meditation",
      title: "Morning Meditation",
      description: "Start your day with positive intentions",
      duration: "10 min",
      difficulty: "Beginner",
      icon: Sun,
      color: "from-purple-400 to-pink-500",
      favorite: false
    },
    {
      id: "sleep-meditation",
      category: "Meditation",
      title: "Sleep Meditation",
      description: "Wind down and prepare for restful sleep",
      duration: "20 min",
      difficulty: "Beginner",
      icon: Moon,
      color: "from-indigo-400 to-purple-500",
      favorite: true
    }
  ];

  const stats = [
    { label: "Completed", value: "24", icon: Star },
    { label: "Minutes", value: "186", icon: Clock },
    { label: "Streak", value: "5 days", icon: Heart }
  ];

  const handleStartExercise = (exerciseId: string) => {
    setActiveExercise(exerciseId);
    setIsPlaying(true);
    setTimer(0);
    setBreathPhase("inhale");
    setPhaseTimer(0);
  };

  const handleCloseExercise = () => {
    setActiveExercise(null);
    setIsPlaying(false);
    setTimer(0);
    setBreathPhase("inhale");
    setPhaseTimer(0);
  };

  const activeExerciseData = exercises.find((ex) => ex.id === activeExercise);

  useEffect(() => {
    if (isPlaying && activeExerciseData) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
        setPhaseTimer((prevPhaseTimer) => prevPhaseTimer + 1);

        const duration = parseInt(activeExerciseData.duration.replace(" min", ""), 10) * 60;

        if (timer >= duration) {
          setIsPlaying(false);
          setTimer(0);
          setBreathPhase("inhale");
          setPhaseTimer(0);
        }

        if (breathPhase === "inhale" && phaseTimer >= 4) {
          setBreathPhase("hold");
          setPhaseTimer(0);
        } else if (breathPhase === "hold" && phaseTimer >= 4) {
          setBreathPhase("exhale");
          setPhaseTimer(0);
        } else if (breathPhase === "exhale" && phaseTimer >= 4) {
          setBreathPhase("hold2");
          setPhaseTimer(0);
        } else if (breathPhase === "hold2" && phaseTimer >= 4) {
          setBreathPhase("inhale");
          setPhaseTimer(0);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, activeExerciseData, timer, breathPhase, phaseTimer]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Wellness Tools</h1>
          </div>
          <p className="text-muted-foreground">
            Guided exercises to support your mental wellbeing
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="p-4 text-center shadow-lg">
                  <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-6 rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg`}
                >
                  <Icon className="w-8 h-8 mb-2 mx-auto" />
                  <p className="font-bold">{category.label}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Exercises Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {showOnlyFavorites ? "Favorite Exercises" : "All Exercises"}
            </h2>
            <button 
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              {showOnlyFavorites ? (
                <>
                  <X className="w-4 h-4" />
                  Show All
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  View Favorites
                </>
              )}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(showOnlyFavorites ? exercises.filter(ex => ex.favorite) : exercises).map((exercise, index) => {
              const Icon = exercise.icon;
              return (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="p-5 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className={`p-3 rounded-xl bg-gradient-to-br ${exercise.color} text-white`}
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                      {exercise.favorite && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        </motion.div>
                      )}
                    </div>
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                      {exercise.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {exercise.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {exercise.duration}
                      </div>
                      <div className="px-2 py-1 bg-gray-100 rounded-full">
                        {exercise.difficulty}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setGuidedExercise(exercise.id)}
                        variant="outline"
                        className="flex-1 group/ezri border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                        size="sm"
                      >
                        <Sparkles className="w-4 h-4 mr-2 text-purple-600 group-hover/ezri:scale-110 transition-transform" />
                        <span className="text-purple-700 font-medium">Ezri</span>
                      </Button>
                      <Button
                        onClick={() => handleStartExercise(exercise.id)}
                        className="flex-1 group/btn"
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                        Start
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Exercise Player Modal */}
        <AnimatePresence>
          {activeExercise && activeExerciseData && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseExercise}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg z-50"
              >
                <Card
                  className={`p-8 shadow-2xl bg-gradient-to-br ${activeExerciseData.color} text-white relative overflow-hidden`}
                >
                  {/* Animated Background */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-20 -right-20 w-60 h-60 bg-white/20 rounded-full blur-3xl"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/20 rounded-full blur-3xl"
                  />

                  <div className="relative z-10">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCloseExercise}
                      className="absolute top-0 right-0 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>

                    <div className="text-center mb-8">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                      >
                        <activeExerciseData.icon className="w-12 h-12" />
                      </motion.div>
                      <h2 className="text-2xl font-bold mb-2">{activeExerciseData.title}</h2>
                      <p className="text-white/90">{activeExerciseData.description}</p>
                    </div>

                    {/* Breathing Animation */}
                    <div className="flex flex-col items-center justify-center mb-8">
                      <motion.div
                        animate={{
                          scale: breathPhase === "inhale" || breathPhase === "hold" ? 1.8 : 1,
                        }}
                        transition={{
                          duration: breathPhase === "inhale" ? 4 : breathPhase === "exhale" ? 4 : 0.5,
                          ease: "easeInOut"
                        }}
                        className="w-40 h-40 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center relative"
                      >
                        <motion.div
                          animate={{
                            scale: breathPhase === "inhale" || breathPhase === "hold" ? 1.2 : 0.6,
                          }}
                          transition={{
                            duration: breathPhase === "inhale" ? 4 : breathPhase === "exhale" ? 4 : 0.5,
                            ease: "easeInOut"
                          }}
                          className="w-28 h-28 rounded-full bg-white/60 flex items-center justify-center"
                        >
                          <motion.div
                            animate={{
                              scale: breathPhase === "inhale" || breathPhase === "hold" ? 1 : 0.5,
                            }}
                            transition={{
                              duration: breathPhase === "inhale" ? 4 : breathPhase === "exhale" ? 4 : 0.5,
                              ease: "easeInOut"
                            }}
                            className="w-16 h-16 rounded-full bg-white/80"
                          />
                        </motion.div>
                      </motion.div>
                      
                      {/* Breath Phase Indicator */}
                      <motion.div
                        key={breathPhase}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 text-center"
                      >
                        <div className="text-2xl font-bold mb-1">
                          {breathPhase === "inhale" && "Breathe In"}
                          {breathPhase === "hold" && "Hold"}
                          {breathPhase === "exhale" && "Breathe Out"}
                          {breathPhase === "hold2" && "Hold"}
                        </div>
                        <div className="text-sm text-white/70">
                          {4 - phaseTimer} seconds
                        </div>
                      </motion.div>
                    </div>

                    {/* Timer */}
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold mb-2">
                        {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                      </div>
                      <p className="text-white/80 text-sm">
                        {isPlaying ? "Stay focused on your breath" : "Ready to begin"}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setTimer(0)}
                        className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-6 rounded-full bg-white text-primary shadow-lg hover:shadow-xl transition-all"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8" />
                        ) : (
                          <Play className="w-8 h-8" />
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Ezri Guided Mode */}
      {guidedExercise && exercises.find(ex => ex.id === guidedExercise) && (
        <EzriGuidedMode
          isOpen={!!guidedExercise}
          onClose={() => setGuidedExercise(null)}
          exerciseTitle={exercises.find(ex => ex.id === guidedExercise)!.title}
          exerciseDescription={exercises.find(ex => ex.id === guidedExercise)!.description}
          exerciseColor={exercises.find(ex => ex.id === guidedExercise)!.color}
          exerciseIcon={exercises.find(ex => ex.id === guidedExercise)!.icon}
          duration={exercises.find(ex => ex.id === guidedExercise)!.duration}
        />
      )}
    </AppLayout>
  );
}