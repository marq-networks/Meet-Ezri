import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Heart, ArrowRight, Shield, Crown, Building2, Users, Eye, EyeOff, Home, ArrowLeft } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { FloatingElement } from "../../components/FloatingElement";
import { toast } from "sonner";

type AdminRole = "super" | "org" | "team";

interface RoleOption {
  id: AdminRole;
  name: string;
  description: string;
  icon: typeof Crown;
  gradient: string;
  credentials: {
    username: string;
    password: string;
  };
}

const roleOptions: RoleOption[] = [
  {
    id: "super",
    name: "Super Admin",
    description: "Full platform access & system management",
    icon: Crown,
    gradient: "from-purple-500 to-pink-500",
    credentials: {
      username: "superadmin",
      password: "super123",
    },
  },
  {
    id: "org",
    name: "Organization Admin",
    description: "Manage organization users & settings",
    icon: Building2,
    gradient: "from-blue-500 to-cyan-500",
    credentials: {
      username: "orgadmin",
      password: "org123",
    },
  },
  {
    id: "team",
    name: "Team Admin",
    description: "Manage team members & activities",
    icon: Users,
    gradient: "from-green-500 to-emerald-500",
    credentials: {
      username: "teamadmin",
      password: "team123",
    },
  },
];

export function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const [step, setStep] = useState<"role" | "credentials">("role");
  const [error, setError] = useState("");

  const handleRoleSelect = (role: RoleOption) => {
    setSelectedRole(role);
    setStep("credentials");
    setError("");
    setUsername("");
    setPassword("");
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!selectedRole) return;
    
    // Validate credentials for the selected role
    if (
      username === selectedRole.credentials.username &&
      password === selectedRole.credentials.password
    ) {
      // Store role in localStorage
      localStorage.setItem("adminRole", selectedRole.id);
      localStorage.setItem("adminUsername", username);
      
      // Show success toast
      toast.success(`Welcome back, ${selectedRole.name}!`);
      
      // Navigate to appropriate dashboard
      if (selectedRole.id === "super") {
        navigate("/admin/super-admin-dashboard");
      } else if (selectedRole.id === "org") {
        navigate("/admin/org-admin-dashboard");
      } else {
        navigate("/admin/team-admin-dashboard");
      }
    } else {
      const errorMessage = "Invalid credentials for this admin role. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        description: `Expected username: ${selectedRole.credentials.username}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden flex items-center justify-center">
      {/* Back to Home Button - Fixed Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed top-6 right-6 z-50"
      >
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-xl text-white font-medium transition-all shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement delay={0} duration={4}>
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        </FloatingElement>
        <FloatingElement delay={1.5} duration={5}>
          <div className="absolute bottom-40 right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
        </FloatingElement>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
          >
            <Heart className="w-8 h-8 text-white" fill="white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Admin Portal
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300"
          >
            {step === "role" 
              ? "Select your administrative role"
              : "Enter your credentials"}
          </motion.p>
        </motion.div>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className={`h-2 w-16 rounded-full transition-all ${
            step === "role" ? "bg-primary" : "bg-primary/50"
          }`} />
          <div className={`h-2 w-16 rounded-full transition-all ${
            step === "credentials" ? "bg-primary" : "bg-white/20"
          }`} />
        </motion.div>

        {step === "role" ? (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {roleOptions.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  onClick={() => handleRoleSelect(role)}
                  className="p-6 cursor-pointer border-2 hover:border-primary transition-all bg-white/95 backdrop-blur-sm relative overflow-hidden group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                      <role.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2">{role.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {role.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                      Select Role
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="p-6 md:p-8 shadow-2xl backdrop-blur-sm bg-white/95 max-w-md mx-auto">
              {/* Credentials hint */}
              {selectedRole && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    {selectedRole.name} Credentials:
                  </p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p>Username: <code className="bg-blue-100 px-2 py-0.5 rounded">{selectedRole.credentials.username}</code></p>
                    <p>Password: <code className="bg-blue-100 px-2 py-0.5 rounded">{selectedRole.credentials.password}</code></p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    className="bg-input-background transition-all focus:scale-[1.02]"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      className="bg-input-background transition-all focus:scale-[1.02]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" className="w-full group relative overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Continue
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent to-secondary"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-2 text-center"
                  >
                    <p className="text-sm text-red-500">
                      {error}
                    </p>
                  </motion.div>
                )}
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-muted-foreground">
                  <Link to="/" className="text-primary font-medium hover:underline">
                    ← Back to Ezri App
                  </Link>
                </p>
              </motion.div>
            </Card>
          </motion.div>
        )}

        {step === "credentials" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center"
          >
            <Button
              variant="ghost"
              onClick={() => setStep("role")}
              className="text-white hover:text-white/80"
            >
              ← Back to role selection
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-400">
            <Shield className="w-3 h-3 inline mr-1" />
            Protected by enterprise-grade security
          </p>
        </motion.div>
      </div>
    </div>
  );
}