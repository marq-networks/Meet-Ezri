import { useState } from "react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
  Heart,
  Lightbulb,
  X,
} from "lucide-react";

interface Exercise {
  id: number;
  name: string;
  category: string;
  duration: string;
  uses: number;
  status: string;
}

interface Prompt {
  id: number;
  text: string;
  category: string;
  uses: number;
}

interface Resource {
  id: number;
  title: string;
  type: string;
  views: number;
  rating: number;
}

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState<"exercises" | "prompts" | "resources">(
    "exercises"
  );

  // State for content items
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: 1,
      name: "Deep Breathing Exercise",
      category: "Anxiety Relief",
      duration: "5 min",
      uses: 1284,
      status: "active",
    },
    {
      id: 2,
      name: "Body Scan Meditation",
      category: "Mindfulness",
      duration: "10 min",
      uses: 892,
      status: "active",
    },
    {
      id: 3,
      name: "Progressive Muscle Relaxation",
      category: "Stress Management",
      duration: "8 min",
      uses: 756,
      status: "active",
    },
  ]);

  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: 1,
      text: "What are three things you're grateful for today?",
      category: "Gratitude",
      uses: 2341,
    },
    {
      id: 2,
      text: "Describe a recent challenge and how you overcame it",
      category: "Growth Mindset",
      uses: 1876,
    },
    {
      id: 3,
      text: "What self-care activities energize you?",
      category: "Self-Care",
      uses: 1543,
    },
  ]);

  const [resources, setResources] = useState<Resource[]>([
    {
      id: 1,
      title: "Understanding Anxiety",
      type: "Article",
      views: 4521,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Sleep Hygiene Guide",
      type: "PDF",
      views: 3892,
      rating: 4.9,
    },
    {
      id: 3,
      title: "Managing Depression",
      type: "Video",
      views: 5234,
      rating: 4.7,
    },
  ]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form states for Exercise
  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    category: "",
    duration: "",
  });

  // Form states for Prompt
  const [promptForm, setPromptForm] = useState({
    text: "",
    category: "",
  });

  // Form states for Resource
  const [resourceForm, setResourceForm] = useState({
    title: "",
    type: "Article",
  });

  // Handle Add New
  const handleAddNew = () => {
    // Reset forms
    setExerciseForm({ name: "", category: "", duration: "" });
    setPromptForm({ text: "", category: "" });
    setResourceForm({ title: "", type: "Article" });
    setShowAddModal(true);
  };

  // Handle Edit
  const handleEdit = (item: any) => {
    setSelectedItem(item);
    
    if (activeTab === "exercises") {
      setExerciseForm({
        name: item.name,
        category: item.category,
        duration: item.duration,
      });
    } else if (activeTab === "prompts") {
      setPromptForm({
        text: item.text,
        category: item.category,
      });
    } else if (activeTab === "resources") {
      setResourceForm({
        title: item.title,
        type: item.type,
      });
    }
    
    setShowEditModal(true);
  };

  // Handle Delete
  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  // Confirm Add
  const confirmAdd = () => {
    if (activeTab === "exercises") {
      const newExercise: Exercise = {
        id: exercises.length + 1,
        name: exerciseForm.name,
        category: exerciseForm.category,
        duration: exerciseForm.duration,
        uses: 0,
        status: "active",
      };
      setExercises([...exercises, newExercise]);
    } else if (activeTab === "prompts") {
      const newPrompt: Prompt = {
        id: prompts.length + 1,
        text: promptForm.text,
        category: promptForm.category,
        uses: 0,
      };
      setPrompts([...prompts, newPrompt]);
    } else if (activeTab === "resources") {
      const newResource: Resource = {
        id: resources.length + 1,
        title: resourceForm.title,
        type: resourceForm.type,
        views: 0,
        rating: 0,
      };
      setResources([...resources, newResource]);
    }
    setShowAddModal(false);
  };

  // Confirm Edit
  const confirmEdit = () => {
    if (activeTab === "exercises") {
      setExercises(
        exercises.map((ex) =>
          ex.id === selectedItem.id
            ? { ...ex, ...exerciseForm }
            : ex
        )
      );
    } else if (activeTab === "prompts") {
      setPrompts(
        prompts.map((pr) =>
          pr.id === selectedItem.id
            ? { ...pr, ...promptForm }
            : pr
        )
      );
    } else if (activeTab === "resources") {
      setResources(
        resources.map((res) =>
          res.id === selectedItem.id
            ? { ...res, ...resourceForm }
            : res
        )
      );
    }
    setShowEditModal(false);
  };

  // Confirm Delete
  const confirmDelete = () => {
    if (activeTab === "exercises") {
      setExercises(exercises.filter((ex) => ex.id !== selectedItem.id));
    } else if (activeTab === "prompts") {
      setPrompts(prompts.filter((pr) => pr.id !== selectedItem.id));
    } else if (activeTab === "resources") {
      setResources(resources.filter((res) => res.id !== selectedItem.id));
    }
    setShowDeleteModal(false);
  };

  return (
    <AdminLayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground">
            Manage wellness exercises, journal prompts, and resources
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("exercises")}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === "exercises"
                    ? "bg-primary text-white shadow-md"
                    : "hover:bg-gray-100"
                }`}
              >
                <Heart className="w-4 h-4 inline mr-2" />
                Wellness Exercises
              </button>
              <button
                onClick={() => setActiveTab("prompts")}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === "prompts"
                    ? "bg-primary text-white shadow-md"
                    : "hover:bg-gray-100"
                }`}
              >
                <Lightbulb className="w-4 h-4 inline mr-2" />
                Journal Prompts
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === "resources"
                    ? "bg-primary text-white shadow-md"
                    : "hover:bg-gray-100"
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Resources
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search content..." className="pl-10" />
              </div>
              <Button className="gap-2" onClick={handleAddNew}>
                <Plus className="w-4 h-4" />
                Add New
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Content List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            {activeTab === "exercises" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Exercise Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total Uses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {exercises.map((exercise) => (
                      <tr key={exercise.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{exercise.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {exercise.category}
                        </td>
                        <td className="px-6 py-4 text-sm">{exercise.duration}</td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {exercise.uses.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {exercise.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(exercise)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(exercise)}>
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "prompts" && (
              <div className="p-6 space-y-4">
                {prompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium flex-1">{prompt.text}</p>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(prompt)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(prompt)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        {prompt.category}
                      </span>
                      <span>{prompt.uses.toLocaleString()} uses</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "resources" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {resources.map((resource) => (
                      <tr key={resource.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{resource.title}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {resource.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {resource.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          ⭐ {resource.rating}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(resource)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(resource)}>
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">
                    Add New {activeTab === "exercises" ? "Exercise" : activeTab === "prompts" ? "Prompt" : "Resource"}
                  </h3>
                  <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {activeTab === "exercises" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Exercise Name</label>
                        <Input
                          value={exerciseForm.name}
                          onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                          placeholder="e.g., Deep Breathing Exercise"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <Input
                          value={exerciseForm.category}
                          onChange={(e) => setExerciseForm({ ...exerciseForm, category: e.target.value })}
                          placeholder="e.g., Anxiety Relief"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Duration</label>
                        <Input
                          value={exerciseForm.duration}
                          onChange={(e) => setExerciseForm({ ...exerciseForm, duration: e.target.value })}
                          placeholder="e.g., 5 min"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "prompts" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Prompt Text</label>
                        <textarea
                          value={promptForm.text}
                          onChange={(e) => setPromptForm({ ...promptForm, text: e.target.value })}
                          placeholder="Enter journal prompt..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <Input
                          value={promptForm.category}
                          onChange={(e) => setPromptForm({ ...promptForm, category: e.target.value })}
                          placeholder="e.g., Gratitude"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "resources" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Resource Title</label>
                        <Input
                          value={resourceForm.title}
                          onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                          placeholder="e.g., Understanding Anxiety"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Type</label>
                        <select
                          value={resourceForm.type}
                          onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="Article">Article</option>
                          <option value="PDF">PDF</option>
                          <option value="Video">Video</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={confirmAdd}>
                    Add {activeTab === "exercises" ? "Exercise" : activeTab === "prompts" ? "Prompt" : "Resource"}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {showEditModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">
                    Edit {activeTab === "exercises" ? "Exercise" : activeTab === "prompts" ? "Prompt" : "Resource"}
                  </h3>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {activeTab === "exercises" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Exercise Name</label>
                        <Input
                          value={exerciseForm.name}
                          onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                          placeholder="e.g., Deep Breathing Exercise"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <Input
                          value={exerciseForm.category}
                          onChange={(e) => setExerciseForm({ ...exerciseForm, category: e.target.value })}
                          placeholder="e.g., Anxiety Relief"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Duration</label>
                        <Input
                          value={exerciseForm.duration}
                          onChange={(e) => setExerciseForm({ ...exerciseForm, duration: e.target.value })}
                          placeholder="e.g., 5 min"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "prompts" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Prompt Text</label>
                        <textarea
                          value={promptForm.text}
                          onChange={(e) => setPromptForm({ ...promptForm, text: e.target.value })}
                          placeholder="Enter journal prompt..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <Input
                          value={promptForm.category}
                          onChange={(e) => setPromptForm({ ...promptForm, category: e.target.value })}
                          placeholder="e.g., Gratitude"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === "resources" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Resource Title</label>
                        <Input
                          value={resourceForm.title}
                          onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                          placeholder="e.g., Understanding Anxiety"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Type</label>
                        <select
                          value={resourceForm.type}
                          onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="Article">Article</option>
                          <option value="PDF">PDF</option>
                          <option value="Video">Video</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={confirmEdit}>
                    Save Changes
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-red-600">Confirm Delete</h3>
                  <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this {activeTab === "exercises" ? "exercise" : activeTab === "prompts" ? "prompt" : "resource"}? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={confirmDelete}>
                    Delete
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayoutNew>
  );
}
