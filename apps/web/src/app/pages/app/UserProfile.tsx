import { AppLayout } from "../../components/AppLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Camera,
  Bell,
  Lock,
  Shield,
  Heart,
  Volume2,
  Palette,
  LogOut,
  ChevronRight,
  Trash2,
  AlertTriangle,
  X
} from "lucide-react";
import { useState, useEffect } from "react";

import { api } from "@/lib/api";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export function UserProfile() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [joinedAt, setJoinedAt] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    location: ""
  });

  const [userStats, setUserStats] = useState({
    sessions: 0,
    checkins: 0,
    daysActive: 0
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const profile = await api.getMe();
      setFormData({
        name: profile.full_name || "",
        email: profile.email || user?.email || "",
        phone: profile.emergency_contact_phone || "",
        birthday: profile.age ? `${profile.age} years old` : "",
        location: profile.timezone || ""
      });
      setProfileImage(profile.avatar_url);
      if (profile.created_at) {
        setJoinedAt(new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }));
      }

      // Update stats from real data
      if (profile.stats) {
        setUserStats({
          sessions: profile.stats.completed_sessions || 0,
          checkins: profile.stats.total_checkins || 0,
          daysActive: profile.stats.streak_days || 0
        });
      } else {
        // Fallback for partial data
        setUserStats({
          sessions: 0,
          checkins: 0,
          daysActive: profile.streak_days || 0
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        setProfileImage(publicUrl);
        
        // Auto-save the profile image
        await api.updateProfile({
          avatar_url: publicUrl
        });
        
        toast.success("Profile photo updated successfully");
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error("Error uploading image");
      }
    }
  };

  const handleSaveProfile = async () => {
    if (isEditing) {
      try {
        const updatedProfile = await api.updateProfile({
          full_name: formData.name,
          email: formData.email,
          avatar_url: profileImage
        });
        setFormData({
          ...formData,
          name: updatedProfile.full_name || '',
          email: updatedProfile.email || '',
        });
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } catch (error) {
        toast.error("Failed to update profile");
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await signOut();
      navigate('/login');
    }
  };

  const handleDeleteAccount = () => {
    // Clear all user data
    localStorage.clear();
    alert('Account deleted successfully. We\'re sorry to see you go.');
    // Navigate to signup
    navigate('/signup');
  };

  const stats = [
    { label: "Sessions", value: userStats.sessions.toString(), icon: Heart },
    { label: "Check-ins", value: userStats.checkins.toString(), icon: Calendar },
    { label: "Days Active", value: userStats.daysActive.toString(), icon: Calendar }
  ];

  const preferences = [
    {
      icon: Volume2,
      title: "Voice",
      value: "Voice 1 - Soothing & Deep",
      link: "/app/settings"
    },
    {
      icon: User,
      title: "Avatar",
      value: "Alex - Calm & Professional",
      link: "/app/settings"
    },
    {
      icon: Palette,
      title: "Environment",
      value: "Beach Sunset 🏖️",
      link: "/app/settings"
    }
  ];

  const settingsSections = [
    {
      title: "Account",
      items: [
        { icon: Bell, label: "Notifications", link: "/app/settings/notifications" },
        { icon: Lock, label: "Privacy & Security", link: "/app/settings/privacy" },
        { icon: Shield, label: "Data & Permissions", link: "/app/settings/privacy" }
      ]
    },
    {
      title: "Support",
      items: [
        { icon: Heart, label: "Emergency Contacts", link: "/app/settings/emergency-contacts" },
        { icon: Mail, label: "Contact Support", link: "/app/settings/help-support" },
        { icon: Shield, label: "Safety Plan", link: "/app/settings/safety-plan" }
      ]
    }
  ];



  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Profile & Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 shadow-xl">
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <input
                      type="file"
                      id="profile-image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      onClick={() => document.getElementById('profile-image-upload')?.click()}
                      className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-5xl cursor-pointer relative overflow-hidden"
                    >
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        '👤'
                      )}
                      <motion.div
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transition-opacity"
                      >
                        <div className="text-center">
                          <Camera className="w-8 h-8 text-white mx-auto mb-1" />
                          <p className="text-white text-xs">Change Photo</p>
                        </div>
                      </motion.div>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => document.getElementById('profile-image-upload')?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{formData.name}</h2>
                  <p className="text-muted-foreground text-sm">Member since {joinedAt || '...'}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="text-center"
                      >
                        <Icon className="w-5 h-5 text-primary mx-auto mb-1" />
                        <div className="text-xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </div>

                <Button
                  onClick={handleSaveProfile}
                  variant="outline"
                  className="w-full"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </Card>
            </motion.div>

            {/* Session Preferences */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 shadow-xl">
                <h3 className="font-bold mb-4">Session Preferences</h3>
                <div className="space-y-3">
                  {preferences.map((pref, index) => {
                    const Icon = pref.icon;
                    return (
                      <Link key={index} to={pref.link}>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                        >
                          <div className="p-2 bg-white rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{pref.title}</p>
                            <p className="text-xs text-muted-foreground">{pref.value}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className={`p-6 shadow-xl transition-all ${isEditing ? 'ring-2 ring-primary shadow-2xl' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Personal Information</h3>
                  {isEditing && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xs bg-primary text-white px-3 py-1 rounded-full"
                    >
                      Editing Mode
                    </motion.span>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block">Full Name</Label>
                      <div className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${
                        isEditing 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'border-gray-300'
                      }`}>
                        <User className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.name}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="flex-1 outline-none bg-transparent disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Email</Label>
                      <div className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${
                        isEditing 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'border-gray-300'
                      }`}>
                        <Mail className="w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="flex-1 outline-none bg-transparent disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Phone</Label>
                      <div className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${
                        isEditing 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'border-gray-300'
                      }`}>
                        <Phone className="w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="flex-1 outline-none bg-transparent disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Birthday</Label>
                      <div className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${
                        isEditing 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'border-gray-300'
                      }`}>
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.birthday}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setFormData({ ...formData, birthday: e.target.value })
                          }
                          className="flex-1 outline-none bg-transparent disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <Label className="mb-2 block">Location</Label>
                      <div className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${
                        isEditing 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'border-gray-300'
                      }`}>
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.location}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setFormData({ ...formData, location: e.target.value })
                          }
                          className="flex-1 outline-none bg-transparent disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Settings Sections */}
            {settingsSections.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + sectionIndex * 0.1 }}
              >
                <Card className="p-6 shadow-xl">
                  <h3 className="font-bold text-lg mb-4">{section.title}</h3>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      return (
                        <Link key={itemIndex} to={item.link}>
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 shadow-xl border-red-200">
                <h3 className="font-bold text-lg mb-4 text-red-600">Danger Zone</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center justify-between p-3 border-2 border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all group"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5 text-red-600" />
                      <div className="text-left">
                        <p className="font-medium text-red-600">Log Out</p>
                        <p className="text-xs text-red-500">Sign out of your account</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-red-400" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center justify-between p-3 border-2 border-red-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all group"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-5 h-5 text-red-600" />
                      <div className="text-left">
                        <p className="font-medium text-red-600">Delete Account</p>
                        <p className="text-xs text-red-500">
                          Permanently delete your account and all data
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-red-400" />
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowDeleteModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md z-50"
            >
              <Card className="p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h3 className="font-bold text-xl text-red-600">Delete Account</h3>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-6">
                  <p className="text-gray-700 mb-3">
                    Are you sure you want to delete your account? This action cannot be undone.
                  </p>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium">
                      ⚠️ This will permanently delete:
                    </p>
                    <ul className="text-sm text-red-700 mt-2 space-y-1 ml-4">
                      <li>• All your session history</li>
                      <li>• Your mood tracking data</li>
                      <li>• Journal entries and notes</li>
                      <li>• Account settings and preferences</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowDeleteModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </AppLayout>
  );
}