import { AppLayout } from "../../components/AppLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { RichTextEditor } from "../../components/RichTextEditor";
import { JournalExportModal } from "../../components/modals";
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  Heart,
  Sparkles,
  Lock,
  Edit,
  Trash2,
  Filter,
  Download
} from "lucide-react";
import { useState } from "react";

export function Journal() {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryContent, setNewEntryContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "json">("pdf");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [editingEntry, setEditingEntry] = useState<number | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterMood, setFilterMood] = useState<string>("");
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [filterDateRange, setFilterDateRange] = useState<"all" | "week" | "month" | "year">("all");
  const [entries, setEntries] = useState([
    {
      id: 1,
      title: "A Beautiful Day",
      date: "December 28, 2024",
      mood: "😊",
      preview: "Today was filled with joy and gratitude. I spent time with my family and felt truly connected...",
      content: "Full entry content here...",
      favorite: true
    },
    {
      id: 2,
      title: "Reflections on Progress",
      date: "December 25, 2024",
      mood: "😌",
      preview: "Looking back at how far I've come. The journey hasn't been easy, but I'm proud of myself...",
      content: "Full entry content here...",
      favorite: false
    },
    {
      id: 3,
      title: "Dealing with Uncertainty",
      date: "December 22, 2024",
      mood: "😰",
      preview: "Feeling anxious about upcoming changes. Writing helps me process these emotions...",
      content: "Full entry content here...",
      favorite: false
    },
    {
      id: 4,
      title: "Gratitude Practice",
      date: "December 20, 2024",
      mood: "🤩",
      preview: "Three things I'm grateful for today: my health, my support system, and new opportunities...",
      content: "Full entry content here...",
      favorite: true
    }
  ]);

  const moods = [
    { value: "happy", emoji: "😊" },
    { value: "calm", emoji: "😌" },
    { value: "anxious", emoji: "😰" },
    { value: "sad", emoji: "😢" },
    { value: "excited", emoji: "🤩" }
  ];

  const handleSaveEntry = () => {
    // Save logic here
    setShowNewEntry(false);
    setNewEntryTitle("");
    setNewEntryContent("");
    setSelectedMood("");
  };

  const handleEditEntry = (entryId: number) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      setNewEntryTitle(entry.title);
      setNewEntryContent(entry.content);
      setSelectedMood(entry.mood);
      setEditingEntry(entryId);
      setShowNewEntry(true);
    }
  };

  const handleDeleteEntry = (entryId: number) => {
    if (confirm("Are you sure you want to delete this journal entry?")) {
      setEntries(entries.filter(e => e.id !== entryId));
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
                <BookOpen className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">My Journal</h1>
              </div>
              <p className="text-muted-foreground">
                Your private space for thoughts and reflections
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <Download className="w-5 h-5 text-gray-700" />
                <span className="hidden sm:inline text-gray-700 font-medium">Export</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewEntry(true)}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Entry</span>
              </motion.button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your entries..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilterModal(true)}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </motion.div>

        {/* New Entry Modal */}
        <AnimatePresence>
          {showNewEntry && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNewEntry(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl z-50"
              >
                <Card className="p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">New Journal Entry</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowNewEntry(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title (Optional)</label>
                      <input
                        type="text"
                        value={newEntryTitle}
                        onChange={(e) => setNewEntryTitle(e.target.value)}
                        placeholder="Give your entry a title..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">How are you feeling?</label>
                      <div className="flex gap-3">
                        {moods.map((mood) => (
                          <motion.button
                            key={mood.value}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedMood(mood.value)}
                            className={`text-4xl p-2 rounded-lg transition-all ${
                              selectedMood === mood.value
                                ? "bg-primary/10 ring-2 ring-primary"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {mood.emoji}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Write your thoughts...</label>
                      <RichTextEditor
                        value={newEntryContent}
                        onChange={(e) => setNewEntryContent(e)}
                        placeholder="Start writing... Let your thoughts flow freely."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      <span>Your journal is private and secure</span>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => setShowNewEntry(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEntry} className="flex-1">
                        Save Entry
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 text-center shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="text-3xl font-bold text-primary mb-1">42</div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="p-4 text-center shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="text-3xl font-bold text-purple-600 mb-1">7</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 text-center shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="text-3xl font-bold text-amber-600 mb-1">4</div>
              <div className="text-sm text-muted-foreground">This Week</div>
            </Card>
          </motion.div>
        </div>

        {/* Journal Entries */}
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.01, y: -2 }}
            >
              <Card className="p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <motion.span
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="text-3xl"
                    >
                      {entry.mood}
                    </motion.span>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {entry.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {entry.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.favorite && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      </motion.div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg transition-all"
                      onClick={() => handleEditEntry(entry.id)}
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </motion.button>
                  </div>
                </div>
                <p className="text-muted-foreground line-clamp-2">{entry.preview}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Inspiration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold mb-2">Journaling Prompt</h3>
                <p className="text-white/90 mb-3">
                  "What are three things that brought you joy this week, and why were they meaningful to you?"
                </p>
                <Button
                  onClick={() => setShowNewEntry(true)}
                  variant="outline"
                  className="bg-white text-primary hover:bg-white/90"
                  size="sm"
                >
                  Write About This
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilterModal(false)}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md"
              >
                <Card className="p-6 shadow-2xl bg-white">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-bold">Filter Entries</h2>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowFilterModal(false)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      ✕
                    </motion.button>
                  </div>

                  {/* Filter by Mood */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Filter by Mood</label>
                    <div className="flex gap-2 flex-wrap">
                      {moods.map((mood) => (
                        <motion.button
                          key={mood.value}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setFilterMood(filterMood === mood.emoji ? "" : mood.emoji)}
                          className={`text-3xl p-3 rounded-lg transition-all ${
                            filterMood === mood.emoji
                              ? "bg-primary/10 ring-2 ring-primary"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {mood.emoji}
                        </motion.button>
                      ))}
                    </div>
                    {filterMood && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setFilterMood("")}
                        className="text-sm text-primary mt-2 hover:underline"
                      >
                        Clear mood filter
                      </motion.button>
                    )}
                  </div>

                  {/* Filter by Date Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Filter by Date</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["all", "week", "month", "year"].map((range) => (
                        <motion.button
                          key={range}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFilterDateRange(range as any)}
                          className={`p-3 rounded-lg border-2 transition-all capitalize ${
                            filterDateRange === range
                              ? "border-primary bg-primary text-white"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {range === "all" ? "All Time" : `Past ${range}`}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Filter by Favorites */}
                  <div className="mb-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFilterFavorites(!filterFavorites)}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                        filterFavorites
                          ? "border-red-500 bg-red-50"
                          : "border-border hover:border-red-500/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Heart className={`w-5 h-5 ${filterFavorites ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
                        <span className="font-medium">Show Favorites Only</span>
                      </div>
                      <div className={`w-12 h-6 rounded-full transition-colors ${filterFavorites ? "bg-red-500" : "bg-gray-300"}`}>
                        <motion.div
                          animate={{ x: filterFavorites ? 24 : 0 }}
                          className="w-6 h-6 bg-white rounded-full shadow-md"
                        />
                      </div>
                    </motion.button>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilterMood("");
                        setFilterDateRange("all");
                        setFilterFavorites(false);
                      }}
                      className="flex-1"
                    >
                      Clear All
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                      onClick={() => setShowFilterModal(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <JournalExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        entriesCount={entries.length}
      />
    </AppLayout>
  );
}