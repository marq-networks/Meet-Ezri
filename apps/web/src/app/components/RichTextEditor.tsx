import { motion } from "motion/react";
import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Smile,
  Image,
  Paperclip,
  Undo,
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const [selectedMood, setSelectedMood] = useState<string>("");

  const moods = [
    { emoji: "😊", label: "Happy", color: "text-green-500" },
    { emoji: "😌", label: "Calm", color: "text-blue-500" },
    { emoji: "😰", label: "Anxious", color: "text-orange-500" },
    { emoji: "😢", label: "Sad", color: "text-gray-500" },
    { emoji: "🤩", label: "Excited", color: "text-purple-500" },
    { emoji: "😡", label: "Angry", color: "text-red-500" }
  ];

  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: "bold" },
    { icon: Italic, label: "Italic", action: "italic" },
    { icon: Underline, label: "Underline", action: "underline" },
    { icon: null, label: "divider" },
    { icon: List, label: "Bullet List", action: "insertUnorderedList" },
    { icon: ListOrdered, label: "Numbered List", action: "insertOrderedList" },
    { icon: Quote, label: "Quote", action: "formatBlock" },
    { icon: null, label: "divider" },
    { icon: AlignLeft, label: "Align Left", action: "justifyLeft" },
    { icon: AlignCenter, label: "Align Center", action: "justifyCenter" },
    { icon: AlignRight, label: "Align Right", action: "justifyRight" },
  ];

  const handleFormat = (action: string) => {
    document.execCommand(action, false);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {toolbarButtons.map((button, index) => {
            if (button.label === "divider") {
              return <div key={index} className="w-px h-6 bg-gray-300 mx-1" />;
            }

            const Icon = button.icon!;
            return (
              <motion.button
                key={button.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFormat(button.action)}
                className="p-2 rounded hover:bg-gray-200 transition-colors"
                title={button.label}
              >
                <Icon className="w-4 h-4 text-gray-700" />
              </motion.button>
            );
          })}

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Undo/Redo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.execCommand("undo")}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Undo"
          >
            <Undo className="w-4 h-4 text-gray-700" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.execCommand("redo")}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Redo"
          >
            <Redo className="w-4 h-4 text-gray-700" />
          </motion.button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Media Buttons */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Insert Image"
          >
            <Image className="w-4 h-4 text-gray-700" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Attach File"
          >
            <Paperclip className="w-4 h-4 text-gray-700" />
          </motion.button>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="bg-blue-50 border-b border-gray-300 p-3">
        <div className="flex items-center gap-2">
          <Smile className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">How are you feeling?</span>
          <div className="flex gap-2 ml-2">
            {moods.map((mood) => (
              <motion.button
                key={mood.label}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedMood(mood.label)}
                className={`text-2xl transition-all ${
                  selectedMood === mood.label
                    ? "scale-125 drop-shadow-lg"
                    : "opacity-50 hover:opacity-100"
                }`}
                title={mood.label}
              >
                {mood.emoji}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        className="min-h-[300px] p-4 focus:outline-none text-gray-900"
        data-placeholder={placeholder}
        style={{
          emptyPlaceholder: {
            content: `attr(data-placeholder)`,
            color: "#9ca3af"
          }
        }}
      >
        {value}
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>{value ? value.split(" ").length : 0} words</span>
          <span>{value ? value.length : 0} characters</span>
        </div>
        {selectedMood && (
          <div className="flex items-center gap-2">
            <span>Mood:</span>
            <span className="font-medium">{selectedMood}</span>
            <span>{moods.find(m => m.label === selectedMood)?.emoji}</span>
          </div>
        )}
      </div>
    </div>
  );
}
