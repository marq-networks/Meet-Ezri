import { motion } from "motion/react";
import { 
  User,
  Shield,
  Bell,
  Eye,
  Palette,
  HelpCircle,
  Lock,
  Mail,
  Globe,
  Smartphone,
  Moon,
  Zap,
  Heart,
  ChevronRight,
  ArrowLeft,
  LogOut,
  Trophy,
  Users,
  BookOpen,
  Brain,
  Phone,
  FileHeart,
  TrendingUp,
  AlertCircle,
  BarChart3,
  History,
  Wind
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AppLayout } from "@/app/components/AppLayout";

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  route: string;
  badge?: string;
}

export function SettingsHub() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Quick Settings State
  const [quickSettings, setQuickSettings] = useState([
    { icon: Moon, label: "Dark Mode", enabled: false, key: "darkMode" },
    { icon: Bell, label: "Notifications", enabled: true, key: "notifications" },
    { icon: Smartphone, label: "Mobile Alerts", enabled: true, key: "mobileAlerts" },
    { icon: Mail, label: "Email Updates", enabled: false, key: "emailUpdates" }
  ]);

  const toggleQuickSetting = (key: string) => {
    setQuickSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.key === key ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const settingSections: SettingSection[] = [
    {
      id: "account",
      title: "Account Settings",
      description: "Manage your profile, email, and password",
      icon: User,
      color: "from-blue-500 to-indigo-600",
      route: "/app/settings/account"
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      description: "Control your data, privacy settings, and security",
      icon: Shield,
      color: "from-purple-500 to-pink-600",
      route: "/app/settings/privacy"
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Customize alerts, reminders, and updates",
      icon: Bell,
      color: "from-yellow-500 to-orange-600",
      route: "/app/settings/notifications",
      badge: "3"
    },
    {
      id: "accessibility",
      title: "Accessibility",
      description: "Screen reader, text size, and assistive features",
      icon: Eye,
      color: "from-green-500 to-emerald-600",
      route: "/app/settings/accessibility"
    },
    {
      id: "appearance",
      title: "Appearance",
      description: "Theme, colors, and visual preferences",
      icon: Palette,
      color: "from-pink-500 to-rose-600",
      route: "/app/settings/appearance"
    },
    {
      id: "change-avatar",
      title: "Change AI Therapist",
      description: "Switch to a different AI companion for your sessions",
      icon: Brain,
      color: "from-blue-500 to-cyan-600",
      route: "/app/settings/change-avatar"
    },
    {
      id: "achievements",
      title: "Achievements",
      description: "View your badges, milestones, and progress",
      icon: Trophy,
      color: "from-yellow-500 to-amber-600",
      route: "/app/settings/achievements"
    },
    {
      id: "community",
      title: "Community",
      description: "Connect with others and share your journey",
      icon: Users,
      color: "from-cyan-500 to-blue-600",
      route: "/app/settings/community"
    },
    {
      id: "resources",
      title: "Resources Library",
      description: "Browse articles, videos, and wellness exercises",
      icon: BookOpen,
      color: "from-indigo-500 to-purple-600",
      route: "/app/settings/resources"
    },
    {
      id: "brain",
      title: "Brain Health",
      description: "Explore cognitive exercises and brain health tips",
      icon: Brain,
      color: "from-teal-500 to-cyan-600",
      route: "/app/wellness-tools"
    }
  ];

  const safetySections: SettingSection[] = [
    {
      id: "emergency-contacts",
      title: "Emergency Contacts",
      description: "Add trusted contacts who get notified",
      icon: Phone,
      color: "from-red-500 to-rose-600",
      route: "/app/settings/emergency-contacts"
    },
    {
      id: "safety-plan",
      title: "Safety Plan",
      description: "Personalized safety plan builder (6 sections)",
      icon: FileHeart,
      color: "from-orange-500 to-red-600",
      route: "/app/settings/safety-plan"
    },
    {
      id: "safety-insights",
      title: "Safety Insights",
      description: "Your safety score, patterns, recommendations",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
      route: "/app/settings/safety-insights",
      badge: "NEW"
    },
    {
      id: "crisis-resources",
      title: "Crisis Resources",
      description: "27 international hotlines (6 regions)",
      icon: AlertCircle,
      color: "from-red-600 to-pink-600",
      route: "/app/crisis-resources"
    },
    {
      id: "resource-analytics",
      title: "Resource Analytics",
      description: "Track which resources you use",
      icon: BarChart3,
      color: "from-purple-500 to-indigo-600",
      route: "/app/settings/resource-analytics"
    },
    {
      id: "notification-history",
      title: "Notification History",
      description: "See all notifications sent",
      icon: History,
      color: "from-blue-500 to-cyan-600",
      route: "/app/settings/notification-history"
    },
    {
      id: "cooldown-screen",
      title: "Cooldown Screen",
      description: "Recovery exercises after tough sessions",
      icon: Wind,
      color: "from-cyan-500 to-teal-600",
      route: "/app/settings/cooldown-screen"
    }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link 
              to="/app/dashboard" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-4 mb-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg"
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Customize your Ezri experience</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Settings</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {quickSettings.map((setting, index) => {
                const Icon = setting.icon;
                return (
                  <motion.button
                    key={setting.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      setting.enabled
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    onClick={() => toggleQuickSetting(setting.key)}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                      setting.enabled ? "text-blue-600" : "text-gray-400"
                    }`} />
                    <p className={`text-xs font-medium ${
                      setting.enabled ? "text-blue-900" : "text-gray-600"
                    }`}>
                      {setting.label}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Main Settings Sections */}
          <div className="space-y-4">
            {settingSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={section.route}
                    className="block bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{section.title}</h3>
                          {section.badge && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                              {section.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{section.description}</p>
                      </div>

                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Safety & Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Safety & Support</h2>
                <p className="text-sm text-gray-600">Your wellbeing is our priority</p>
              </div>
            </div>

            <div className="space-y-4">
              {safetySections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={section.route}
                      className="block bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{section.title}</h3>
                            {section.badge && (
                              <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                                {section.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{section.description}</p>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Additional Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 space-y-3"
          >
            <Link
              to="/app/settings/help-support"
              className="block bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Help & Support</span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-600">Log Out</span>
              </div>
            </button>
          </motion.div>

          {/* App Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-2">
              <Heart className="w-4 h-4" />
              <span>Made with care for your wellbeing</span>
            </div>
            <p className="text-xs text-gray-400">
              Ezri v1.0.0 • © 2024 • <Link to="/privacy" className="underline">Privacy</Link> • <Link to="/terms" className="underline">Terms</Link>
            </p>
          </motion.div>

          {/* Logout Modal */}
          {showLogoutModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowLogoutModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogOut className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Log Out?</h3>
                  <p className="text-gray-600">Are you sure you want to log out of your account?</p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/login")}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium"
                  >
                    Log Out
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}