import { motion } from "motion/react";
import { 
  Eye,
  Volume2,
  Type,
  MousePointer,
  Subtitles,
  Contrast,
  ZoomIn,
  Hand,
  Focus,
  PlayCircle,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AppLayout } from "@/app/components/AppLayout";

export function AccessibilitySettings() {
  const [settings, setSettings] = useState({
    fontSize: "medium",
    textSpacing: "normal",
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    closedCaptions: true,
    keyboardNav: true,
    focusIndicators: true,
    autoPlay: false,
    largeClickTargets: false
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const fontSizes = [
    { value: "small", label: "Small", size: "text-sm" },
    { value: "medium", label: "Medium", size: "text-base" },
    { value: "large", label: "Large", size: "text-lg" },
    { value: "xlarge", label: "Extra Large", size: "text-xl" }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link 
              to="/app/settings" 
              className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Settings
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Accessibility</h1>
                <p className="text-gray-600">Customize for your needs</p>
              </div>
            </div>
          </motion.div>

          {/* Text & Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Text & Display</h2>

            {/* Font Size */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Type className="w-4 h-4" />
                Font Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {fontSizes.map((size) => (
                  <motion.button
                    key={size.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSettings({...settings, fontSize: size.value})}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      settings.fontSize === size.value
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <span className={size.size + " font-medium"}>Aa</span>
                    <p className="text-xs text-gray-600 mt-1">{size.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Text Spacing */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <ZoomIn className="w-4 h-4" />
                Text Spacing
              </label>
              <select
                value={settings.textSpacing}
                onChange={(e) => setSettings({...settings, textSpacing: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="relaxed">Relaxed</option>
                <option value="loose">Loose</option>
              </select>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Contrast className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">High Contrast Mode</p>
                  <p className="text-sm text-gray-600">Increase color contrast</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSetting("highContrast")}
                className={`w-14 h-8 rounded-full transition-colors ${
                  settings.highContrast ? "bg-gray-900" : "bg-gray-300"
                }`}
              >
                <motion.div
                  animate={{ x: settings.highContrast ? 24 : 2 }}
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Motion & Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Motion & Animation</h2>

            <div className="space-y-4">
              {/* Reduced Motion */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Reduce Motion</p>
                    <p className="text-sm text-gray-600">Minimize animations and transitions</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting("reducedMotion")}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.reducedMotion ? "bg-purple-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.reducedMotion ? 24 : 2 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>

              {/* Auto-play */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Auto-play Media</p>
                    <p className="text-sm text-gray-600">Automatically play videos and audio</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting("autoPlay")}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.autoPlay ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.autoPlay ? 24 : 2 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Assistive Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Assistive Features</h2>

            <div className="space-y-4">
              {/* Screen Reader */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Screen Reader Support</p>
                    <p className="text-sm text-gray-600">Optimize for screen readers</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting("screenReader")}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.screenReader ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.screenReader ? 24 : 2 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>

              {/* Closed Captions */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Subtitles className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Closed Captions</p>
                    <p className="text-sm text-gray-600">Show captions for video content</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting("closedCaptions")}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.closedCaptions ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.closedCaptions ? 24 : 2 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>

              {/* Keyboard Navigation */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <MousePointer className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Keyboard Navigation</p>
                    <p className="text-sm text-gray-600">Navigate using keyboard only</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting("keyboardNav")}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.keyboardNav ? "bg-purple-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.keyboardNav ? 24 : 2 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>

              {/* Focus Indicators */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Focus className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Enhanced Focus Indicators</p>
                    <p className="text-sm text-gray-600">Highlight focused elements clearly</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting("focusIndicators")}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.focusIndicators ? "bg-yellow-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.focusIndicators ? 24 : 2 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>

              {/* Large Click Targets */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Hand className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Large Click Targets</p>
                    <p className="text-sm text-gray-600">Increase button and link sizes</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting("largeClickTargets")}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.largeClickTargets ? "bg-orange-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.largeClickTargets ? 24 : 2 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Accessibility Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-900 mb-2">WCAG 2.1 AA Compliant</h3>
                <p className="text-sm text-green-700 mb-3">
                  Ezri is designed to meet Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. 
                  We're committed to making mental health support accessible to everyone.
                </p>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium underline">
                  Learn more about our accessibility commitment
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}