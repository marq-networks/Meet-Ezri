import { useState } from "react";
import { motion } from "motion/react";
import { AdminLayoutNew } from "../../components/AdminLayoutNew";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { AnimatePresence } from "motion/react";
import {
  Building2,
  Users,
  Shield,
  Zap,
  Globe,
  Lock,
  Settings,
  BarChart3,
  Cloud,
  Code,
  Layers,
  Network,
  Server,
  Database,
  CheckCircle,
  XCircle,
  Crown,
  Sparkles,
  TrendingUp,
  AlertCircle,
  X,
  Plus,
  Clock,
} from "lucide-react";

interface EnterpriseFeature {
  id: string;
  name: string;
  description: string;
  category: "security" | "infrastructure" | "integration" | "customization" | "support";
  status: "enabled" | "disabled" | "beta" | "coming_soon";
  icon: any;
  settings?: {
    label: string;
    type: "toggle" | "input" | "select";
    value: any;
  }[];
}

export function EnterpriseFeatures() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showConfigModal, setShowConfigModal] = useState<EnterpriseFeature | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState<EnterpriseFeature | null>(null);
  const [features, setFeatures] = useState<EnterpriseFeature[]>([
    {
      id: "sso",
      name: "Single Sign-On (SSO)",
      description: "Enterprise SSO with SAML 2.0 and OAuth 2.0 support",
      category: "security",
      status: "enabled",
      icon: Shield,
      settings: [
        { label: "SAML 2.0", type: "toggle", value: true },
        { label: "OAuth 2.0", type: "toggle", value: true },
        { label: "LDAP Integration", type: "toggle", value: false },
      ],
    },
    {
      id: "custom_domain",
      name: "Custom Domain & Branding",
      description: "White-label solution with custom domain and branding",
      category: "customization",
      status: "enabled",
      icon: Globe,
      settings: [
        { label: "Custom Domain", type: "input", value: "health.yourcompany.com" },
        { label: "Custom Logo", type: "toggle", value: true },
        { label: "Custom Colors", type: "toggle", value: true },
      ],
    },
    {
      id: "advanced_analytics",
      name: "Advanced Analytics & Reporting",
      description: "Custom reports, dashboards, and data export capabilities",
      category: "infrastructure",
      status: "enabled",
      icon: BarChart3,
      settings: [
        { label: "Custom Reports", type: "toggle", value: true },
        { label: "Data Export API", type: "toggle", value: true },
        { label: "Real-time Analytics", type: "toggle", value: true },
      ],
    },
    {
      id: "dedicated_instance",
      name: "Dedicated Cloud Instance",
      description: "Isolated cloud infrastructure for maximum security and performance",
      category: "infrastructure",
      status: "enabled",
      icon: Cloud,
      settings: [
        { label: "Region", type: "select", value: "us-east-1" },
        { label: "Auto-scaling", type: "toggle", value: true },
        { label: "Dedicated IP", type: "toggle", value: true },
      ],
    },
    {
      id: "api_access",
      name: "Advanced API Access",
      description: "Full REST API with webhooks and custom integrations",
      category: "integration",
      status: "enabled",
      icon: Code,
      settings: [
        { label: "API Rate Limit", type: "input", value: "10000/hour" },
        { label: "Webhooks", type: "toggle", value: true },
        { label: "Custom Endpoints", type: "toggle", value: true },
      ],
    },
    {
      id: "role_hierarchy",
      name: "Advanced Role Hierarchy",
      description: "Multi-level role management with custom permissions",
      category: "security",
      status: "enabled",
      icon: Users,
      settings: [
        { label: "Custom Roles", type: "toggle", value: true },
        { label: "Role Inheritance", type: "toggle", value: true },
        { label: "Granular Permissions", type: "toggle", value: true },
      ],
    },
    {
      id: "data_residency",
      name: "Data Residency Control",
      description: "Choose where your data is stored for compliance",
      category: "security",
      status: "enabled",
      icon: Database,
      settings: [
        { label: "Primary Region", type: "select", value: "US" },
        { label: "Backup Region", type: "select", value: "EU" },
        { label: "Geo-replication", type: "toggle", value: true },
      ],
    },
    {
      id: "audit_logging",
      name: "Enhanced Audit Logging",
      description: "Comprehensive audit trails with long-term retention",
      category: "security",
      status: "enabled",
      icon: Lock,
      settings: [
        { label: "Retention Period", type: "select", value: "7 years" },
        { label: "Real-time Alerts", type: "toggle", value: true },
        { label: "SIEM Integration", type: "toggle", value: false },
      ],
    },
    {
      id: "dedicated_support",
      name: "24/7 Dedicated Support",
      description: "Priority support with dedicated account manager",
      category: "support",
      status: "enabled",
      icon: Sparkles,
      settings: [
        { label: "Dedicated Manager", type: "toggle", value: true },
        { label: "24/7 Phone Support", type: "toggle", value: true },
        { label: "SLA: 99.9% uptime", type: "toggle", value: true },
      ],
    },
    {
      id: "multi_tenant",
      name: "Multi-Tenant Architecture",
      description: "Manage multiple organizations under one account",
      category: "infrastructure",
      status: "beta",
      icon: Layers,
      settings: [
        { label: "Tenant Isolation", type: "toggle", value: true },
        { label: "Cross-tenant Analytics", type: "toggle", value: false },
      ],
    },
    {
      id: "vpn_access",
      name: "VPN & Private Network Access",
      description: "Secure access through VPN and private network connections",
      category: "security",
      status: "coming_soon",
      icon: Network,
    },
    {
      id: "disaster_recovery",
      name: "Disaster Recovery Plan",
      description: "Automated backups and recovery procedures",
      category: "infrastructure",
      status: "enabled",
      icon: Server,
      settings: [
        { label: "Backup Frequency", type: "select", value: "Hourly" },
        { label: "Recovery Point Objective", type: "input", value: "1 hour" },
        { label: "Geo-redundancy", type: "toggle", value: true },
      ],
    },
  ]);

  const categories = [
    { id: "all", label: "All Features", count: features.length },
    { id: "security", label: "Security", count: features.filter(f => f.category === "security").length },
    { id: "infrastructure", label: "Infrastructure", count: features.filter(f => f.category === "infrastructure").length },
    { id: "integration", label: "Integration", count: features.filter(f => f.category === "integration").length },
    { id: "customization", label: "Customization", count: features.filter(f => f.category === "customization").length },
    { id: "support", label: "Support", count: features.filter(f => f.category === "support").length },
  ];

  const filteredFeatures = selectedCategory === "all" 
    ? features 
    : features.filter(f => f.category === selectedCategory);

  const stats = {
    totalFeatures: features.length,
    enabled: features.filter(f => f.status === "enabled").length,
    beta: features.filter(f => f.status === "beta").length,
    comingSoon: features.filter(f => f.status === "coming_soon").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "enabled":
        return "bg-green-100 text-green-700 border-green-300";
      case "disabled":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "beta":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "coming_soon":
        return "bg-purple-100 text-purple-700 border-purple-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "enabled":
        return CheckCircle;
      case "disabled":
        return XCircle;
      case "beta":
        return AlertCircle;
      case "coming_soon":
        return Clock;
      default:
        return AlertCircle;
    }
  };

  return (
    <AdminLayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Enterprise Features</h1>
                <p className="text-muted-foreground">
                  Advanced capabilities for enterprise deployments
                </p>
              </div>
            </div>
            <Button className="gap-2" onClick={() => setShowRequestModal(true)}>
              <Plus className="w-4 h-4" />
              Request Feature
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Features</p>
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold">{stats.totalFeatures}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Enabled</p>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.enabled}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Beta</p>
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.beta}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Coming Soon</p>
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.comingSoon}</p>
            </Card>
          </motion.div>
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const StatusIcon = getStatusIcon(feature.status);
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{feature.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {feature.category.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-5 h-5 ${
                        feature.status === 'enabled' ? 'text-green-600' : 
                        feature.status === 'beta' ? 'text-blue-600' : 
                        feature.status === 'coming_soon' ? 'text-purple-600' : 'text-gray-600'
                      }`} />
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(feature.status)}`}>
                        {feature.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>

                  {/* Settings Preview */}
                  {feature.settings && feature.status === "enabled" && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Active Settings:
                      </p>
                      <div className="space-y-1">
                        {feature.settings.slice(0, 2).map((setting, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span>{setting.label}</span>
                            {setting.type === "toggle" ? (
                              <CheckCircle className={`w-4 h-4 ${setting.value ? 'text-green-600' : 'text-gray-400'}`} />
                            ) : (
                              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {setting.value}
                              </span>
                            )}
                          </div>
                        ))}
                        {feature.settings.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{feature.settings.length - 2} more settings
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {feature.status === "enabled" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setShowConfigModal(feature)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setShowDisableModal(feature)}
                        >
                          Disable
                        </Button>
                      </>
                    )}
                    {feature.status === "disabled" && (
                      <Button size="sm" className="flex-1">
                        Enable Feature
                      </Button>
                    )}
                    {feature.status === "beta" && (
                      <Button size="sm" className="flex-1">
                        Join Beta
                      </Button>
                    )}
                    {feature.status === "coming_soon" && (
                      <Button variant="outline" size="sm" className="flex-1" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Configuration Modal */}
        <AnimatePresence>
          {showConfigModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowConfigModal(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      {showConfigModal.icon && <showConfigModal.icon className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{showConfigModal.name}</h2>
                      <p className="text-sm text-muted-foreground">{showConfigModal.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfigModal(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {showConfigModal.settings?.map((setting, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <label className="font-medium">{setting.label}</label>
                        {setting.type === "toggle" && (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={setting.value} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        )}
                        {setting.type === "input" && (
                          <Input defaultValue={setting.value} className="max-w-xs" />
                        )}
                        {setting.type === "select" && (
                          <select className="px-3 py-2 border rounded-lg" defaultValue={setting.value}>
                            <option>{setting.value}</option>
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setShowConfigModal(null)}>
                      Cancel
                    </Button>
                    <Button className="flex-1">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Request Feature Modal */}
        <AnimatePresence>
          {showRequestModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowRequestModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Request a New Feature</h2>
                      <p className="text-sm text-muted-foreground">Let us know what you need!</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRequestModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <Input
                    placeholder="Feature Name"
                    className="w-full"
                  />
                  <Input
                    placeholder="Description"
                    className="w-full"
                  />
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setShowRequestModal(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        console.log("Feature request submitted");
                        setShowRequestModal(false);
                      }}
                    >
                      Submit Request
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disable Feature Modal */}
        <AnimatePresence>
          {showDisableModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDisableModal(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      {showDisableModal.icon && <showDisableModal.icon className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Disable {showDisableModal.name}</h2>
                      <p className="text-sm text-muted-foreground">Are you sure you want to disable this feature?</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDisableModal(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setShowDisableModal(null)}>
                      Cancel
                    </Button>
                    <Button className="flex-1">
                      Disable Feature
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayoutNew>
  );
}