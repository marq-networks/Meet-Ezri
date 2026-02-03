import { motion } from "motion/react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { 
  Mail,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  Copy,
  Save,
  Code,
  Type,
  Image as ImageIcon,
  Search
} from "lucide-react";
import { useState } from "react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: "welcome" | "notification" | "marketing" | "system" | "crisis";
  htmlContent: string;
  textContent: string;
  variables: string[];
  lastModified: Date;
  sentCount: number;
  openRate: number;
}

export function EmailTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "html" | "text">("preview");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock email templates
  const templates: EmailTemplate[] = [
    {
      id: "t1",
      name: "Welcome Email",
      subject: "Welcome to Ezri - Your Mental Wellness Journey Starts Here! 🌟",
      category: "welcome",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to Ezri!</h1>
          </div>
          <div style="padding: 40px; background: #f9fafb;">
            <p style="font-size: 16px; color: #374151;">Hi {{user_name}},</p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              We're thrilled to have you join our community! Ezri is here to support your mental health and wellness journey with AI-powered therapy sessions, mood tracking, and personalized insights.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{session_url}}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Start Your First Session
              </a>
            </div>
            <p style="font-size: 14px; color: #6b7280;">
              Best regards,<br>
              The Ezri Team
            </p>
          </div>
        </div>
      `,
      textContent: "Hi {{user_name}}, Welcome to Ezri! We're thrilled to have you join our community...",
      variables: ["user_name", "session_url"],
      lastModified: new Date("2024-06-15"),
      sentCount: 1205,
      openRate: 68.5
    },
    {
      id: "t2",
      name: "Session Reminder",
      subject: "Your therapy session starts in 1 hour",
      category: "notification",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #374151;">Session Reminder</h2>
          <p style="color: #6b7280;">Hi {{user_name}},</p>
          <p style="color: #6b7280;">Your therapy session is scheduled to start in 1 hour at {{session_time}}.</p>
          <a href="{{session_url}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">
            Join Session
          </a>
        </div>
      `,
      textContent: "Hi {{user_name}}, Your therapy session starts in 1 hour at {{session_time}}...",
      variables: ["user_name", "session_time", "session_url"],
      lastModified: new Date("2024-06-20"),
      sentCount: 3421,
      openRate: 82.3
    },
    {
      id: "t3",
      name: "Crisis Alert",
      subject: "URGENT: Crisis Support Available 24/7",
      category: "crisis",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fef2f2; border: 2px solid #dc2626;">
          <h2 style="color: #dc2626;">Crisis Support Available</h2>
          <p style="color: #374151; font-weight: bold;">If you're in crisis, help is available 24/7:</p>
          <ul style="color: #374151; line-height: 2;">
            <li>National Suicide Prevention Lifeline: 988</li>
            <li>Crisis Text Line: Text HOME to 741741</li>
            <li>Emergency: 911</li>
          </ul>
          <p style="color: #6b7280;">You are not alone. Please reach out.</p>
        </div>
      `,
      textContent: "Crisis Support Available 24/7. National Suicide Prevention Lifeline: 988...",
      variables: [],
      lastModified: new Date("2024-05-10"),
      sentCount: 23,
      openRate: 95.7
    },
    {
      id: "t4",
      name: "Weekly Progress Report",
      subject: "Your Weekly Wellness Summary 📊",
      category: "notification",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #374151;">Weekly Progress Report</h2>
          <p style="color: #6b7280;">Hi {{user_name}},</p>
          <p style="color: #6b7280;">Here's your wellness summary for this week:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Sessions Completed:</strong> {{sessions_count}}</p>
            <p><strong>Mood Check-ins:</strong> {{mood_count}}</p>
            <p><strong>Journal Entries:</strong> {{journal_count}}</p>
            <p><strong>Current Streak:</strong> {{streak_days}} days 🔥</p>
          </div>
        </div>
      `,
      textContent: "Hi {{user_name}}, Here's your wellness summary for this week...",
      variables: ["user_name", "sessions_count", "mood_count", "journal_count", "streak_days"],
      lastModified: new Date("2024-06-25"),
      sentCount: 892,
      openRate: 71.2
    },
    {
      id: "t5",
      name: "Premium Upgrade Offer",
      subject: "Unlock Premium Features - 30% Off! 🎉",
      category: "marketing",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0;">Unlock Premium</h1>
            <p style="color: white; font-size: 24px; margin: 10px 0;">30% Off Limited Time!</p>
          </div>
          <div style="padding: 40px;">
            <p>Premium features include:</p>
            <ul>
              <li>Unlimited AI therapy sessions</li>
              <li>Advanced analytics and insights</li>
              <li>Priority support</li>
              <li>Session recordings</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{upgrade_url}}" style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Upgrade Now
              </a>
            </div>
          </div>
        </div>
      `,
      textContent: "Unlock Premium Features - 30% Off! Premium includes unlimited sessions, advanced analytics...",
      variables: ["upgrade_url"],
      lastModified: new Date("2024-06-28"),
      sentCount: 567,
      openRate: 45.8
    },
    {
      id: "t6",
      name: "Password Reset",
      subject: "Reset Your Ezri Password",
      category: "system",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #374151;">Password Reset Request</h2>
          <p style="color: #6b7280;">Hi {{user_name}},</p>
          <p style="color: #6b7280;">We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{reset_url}}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 12px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      `,
      textContent: "Password Reset Request. Click the link to reset your password: {{reset_url}}",
      variables: ["user_name", "reset_url"],
      lastModified: new Date("2024-06-18"),
      sentCount: 234,
      openRate: 88.9
    }
  ];

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "welcome": return "bg-green-100 text-green-700";
      case "notification": return "bg-blue-100 text-blue-700";
      case "marketing": return "bg-purple-100 text-purple-700";
      case "system": return "bg-gray-100 text-gray-700";
      case "crisis": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const stats = {
    total: templates.length,
    sent: templates.reduce((sum, t) => sum + t.sentCount, 0),
    avgOpenRate: (templates.reduce((sum, t) => sum + t.openRate, 0) / templates.length).toFixed(1)
  };

  // Replace template variables with preview values
  const getPreviewContent = (template: EmailTemplate) => {
    let content = template.htmlContent;
    
    // Replace common variables with preview values
    const replacements: Record<string, string> = {
      '{{user_name}}': 'John Doe',
      '{{app_url}}': '/therapy-session',
      '{{session_url}}': '/therapy-session',
      '{{session_time}}': '2:00 PM',
      '{{reset_url}}': '/reset-password',
      '{{upgrade_url}}': '/pricing',
      '{{sessions_count}}': '5',
      '{{mood_count}}': '12',
      '{{journal_count}}': '8',
      '{{streak_days}}': '7'
    };
    
    Object.entries(replacements).forEach(([variable, value]) => {
      content = content.replace(new RegExp(variable, 'g'), value);
    });
    
    return content;
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
            <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
            <p className="text-gray-600 mt-1">Manage and customize email templates</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            New Template
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Templates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Emails Sent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.sent.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Avg Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgOpenRate}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Templates List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Templates ({filteredTemplates.length})</h2>

            <div className="space-y-3">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{template.subject}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs text-gray-600 mt-3">
                    <div>
                      <p className="font-medium">Sent</p>
                      <p>{template.sentCount}</p>
                    </div>
                    <div>
                      <p className="font-medium">Open Rate</p>
                      <p>{template.openRate}%</p>
                    </div>
                    <div>
                      <p className="font-medium">Variables</p>
                      <p>{template.variables.length}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Template Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-6"
          >
            {selectedTemplate ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Preview</h2>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-green-50 text-green-600"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* View Mode Tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setViewMode("preview")}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === "preview"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => setViewMode("html")}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === "html"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Code className="w-4 h-4 inline mr-1" />
                    HTML
                  </button>
                  <button
                    onClick={() => setViewMode("text")}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === "text"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Type className="w-4 h-4 inline mr-1" />
                    Text
                  </button>
                </div>

                {/* Subject Line */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Subject Line</p>
                  <p className="font-medium text-gray-900">{selectedTemplate.subject}</p>
                </div>

                {/* Variables */}
                {selectedTemplate.variables.length > 0 && (
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-700 font-medium mb-2">Available Variables</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables.map(variable => (
                        <code key={variable} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {`{{${variable}}}`}
                        </code>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {viewMode === "preview" && (
                    <div 
                      className="p-4 max-h-96 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: getPreviewContent(selectedTemplate) }}
                    />
                  )}
                  
                  {viewMode === "html" && (
                    <pre className="p-4 text-xs bg-gray-900 text-green-400 max-h-96 overflow-auto font-mono">
                      {selectedTemplate.htmlContent}
                    </pre>
                  )}
                  
                  {viewMode === "text" && (
                    <div className="p-4 text-sm text-gray-700 max-h-96 overflow-y-auto whitespace-pre-wrap">
                      {selectedTemplate.textContent}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-xs">Sent</p>
                    <p className="font-bold text-gray-900">{selectedTemplate.sentCount}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-xs">Open Rate</p>
                    <p className="font-bold text-gray-900">{selectedTemplate.openRate}%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-xs">Modified</p>
                    <p className="font-bold text-gray-900 text-xs">{selectedTemplate.lastModified.toLocaleDateString()}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Select a template to preview</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AdminLayoutNew>
  );
}