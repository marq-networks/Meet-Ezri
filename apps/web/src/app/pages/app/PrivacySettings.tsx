import { motion } from "motion/react";
import { 
  Shield,
  Lock,
  Eye,
  EyeOff,
  Download,
  Trash2,
  FileText,
  UserX,
  Globe,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Bell,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSafetyConsent } from "@/app/contexts/SafetyContext";
import { AppLayout } from "@/app/components/AppLayout";

export function PrivacySettings() {
  const { consent, updateConsent } = useSafetyConsent();
  const [settings, setSettings] = useState({
    profileVisibility: "private",
    showOnlineStatus: false,
    allowAnalytics: true,
    shareProgress: false,
    allowCookies: true,
    marketingEmails: false,
    thirdPartySharing: false
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDownloadData = () => {
    // Collect all user data from localStorage or state
    const userData = {
      profile: {
        name: localStorage.getItem('userName') || 'User',
        email: localStorage.getItem('userEmail') || 'user@example.com',
        joinedDate: new Date().toISOString()
      },
      settings: settings,
      exportDate: new Date().toISOString(),
      dataType: 'Ezri User Data Export'
    };

    // Create a blob with formatted JSON data
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ezri-data-export-${new Date().toISOString().split('T')[0]}.json`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Your data has been downloaded successfully!');
  };

  const handleDeleteAllData = () => {
    const confirmation = window.confirm(
      '⚠️ Warning: This will permanently delete ALL your data including:\n\n' +
      '• Profile information\n' +
      '• Mood tracking history\n' +
      '• Journal entries\n' +
      '• Session data\n' +
      '• Habits and goals\n' +
      '• All wellness data\n\n' +
      'This action CANNOT be undone. Are you sure you want to continue?'
    );
    
    if (confirmation) {
      const finalConfirmation = window.confirm(
        'Final confirmation: Type "DELETE" in your mind and click OK to permanently delete all your data.'
      );
      
      if (finalConfirmation) {
        // Clear all localStorage data
        localStorage.clear();
        
        // Reset settings to default
        setSettings({
          profileVisibility: "private",
          showOnlineStatus: false,
          allowAnalytics: true,
          shareProgress: false,
          allowCookies: true,
          marketingEmails: false,
          thirdPartySharing: false
        });
        
        alert('✓ All your data has been permanently deleted.');
        
        // Optionally redirect to home or logout
        // window.location.href = '/';
      }
    }
  };

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
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Privacy & Security</h1>
                <p className="text-gray-600">Control your data and privacy settings</p>
              </div>
            </div>
          </motion.div>

          {/* Privacy Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy Controls</h2>

            <div className="space-y-4">
              {/* Profile Visibility */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Profile Visibility</p>
                    <p className="text-sm text-gray-600">Who can see your profile</p>
                  </div>
                </div>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => setSettings({...settings, profileVisibility: e.target.value})}
                  className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              {/* Online Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Show Online Status</p>
                    <p className="text-sm text-gray-600">Let others see when you're active</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting("showOnlineStatus")}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.showOnlineStatus ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.showOnlineStatus ? 24 : 2 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>

              {/* Share Progress */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Share Progress</p>
                    <p className="text-sm text-gray-600">Allow sharing wellness milestones</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting("shareProgress")}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.shareProgress ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.shareProgress ? 24 : 2 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Safety & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Safety & Support</h2>
              <Link
                to="/app/settings/notification-history"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium underline"
              >
                View History
              </Link>
            </div>

            <div className="space-y-4">
              {/* Trusted Contact Notifications */}
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div className="flex items-center gap-3 flex-1">
                  <Bell className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Trusted Contact Notifications</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Allow your trusted contacts to receive supportive check-in messages when our safety system detects you may need extra support
                    </p>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-purple-500" />
                      <span className="text-xs text-purple-700 font-medium">
                        Privacy-safe • No medical details shared
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateConsent({ trustedContactEnabled: !consent.trustedContactEnabled })}
                  className={`w-14 h-8 rounded-full transition-colors flex-shrink-0 ml-4 ${ 
                    consent.trustedContactEnabled ? "bg-purple-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: consent.trustedContactEnabled ? 24 : 2 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>

              {/* Info about trusted contacts */}
              {consent.trustedContactEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 font-medium mb-1">
                        Trusted Contact Notifications Enabled
                      </p>
                      <p className="text-sm text-blue-700 mb-3">
                        Your trusted contacts will receive supportive messages if HIGH_RISK or SAFETY_MODE is detected. Messages are privacy-safe and contain no details about your conversations or sessions.
                      </p>
                      <Link
                        to="/app/settings/emergency-contacts"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
                      >
                        Manage Trusted Contacts →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Data & Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Data & Analytics</h2>

            <div className="space-y-4">
              {/* Allow Analytics */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium text-gray-900">Usage Analytics</p>
                    <p className="text-sm text-gray-600">Help improve Ezri with usage data</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting("allowAnalytics")}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.allowAnalytics ? "bg-indigo-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.allowAnalytics ? 24 : 2 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>

              {/* Cookies */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Essential Cookies</p>
                    <p className="text-sm text-gray-600">Required for app functionality</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting("allowCookies")}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.allowCookies ? "bg-yellow-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.allowCookies ? 24 : 2 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>

              {/* Marketing Emails */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <UserX className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">Marketing Communications</p>
                    <p className="text-sm text-gray-600">Receive promotional emails</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting("marketingEmails")}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.marketingEmails ? "bg-red-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.marketingEmails ? 24 : 2 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>

              {/* Third Party */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Third-Party Data Sharing</p>
                    <p className="text-sm text-gray-600">Share with partner services</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSetting("thirdPartySharing")}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    settings.thirdPartySharing ? "bg-orange-500" : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.thirdPartySharing ? 24 : 2 }}
                    className="w-6 h-6 bg-white rounded-full shadow-md"
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Data Management</h2>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-4 flex items-center justify-between transition-colors"
                onClick={handleDownloadData}
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Download My Data</p>
                    <p className="text-sm text-gray-600">Get a copy of all your information</p>
                  </div>
                </div>
                <div className="text-blue-600 font-medium">Export</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-red-50 hover:bg-red-100 rounded-xl p-4 flex items-center justify-between transition-colors"
                onClick={handleDeleteAllData}
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Delete All Data</p>
                    <p className="text-sm text-gray-600">Permanently remove all your information</p>
                  </div>
                </div>
                <div className="text-red-600 font-medium">Delete</div>
              </motion.button>
            </div>
          </motion.div>

          {/* HIPAA Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-purple-900 mb-2">HIPAA Compliant</h3>
                <p className="text-sm text-purple-700 mb-3">
                  Your mental health data is protected under HIPAA regulations. We encrypt all 
                  sensitive information and never share your health records without explicit consent.
                </p>
                <div className="flex gap-2">
                  <Link
                    to="/privacy"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium underline"
                  >
                    Privacy Policy
                  </Link>
                  <span className="text-purple-400">•</span>
                  <Link
                    to="/terms"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium underline"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}