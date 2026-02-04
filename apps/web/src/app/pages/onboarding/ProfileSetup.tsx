import { OnboardingLayout } from "../../components/OnboardingLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft, Camera, User } from "lucide-react";
import { useState } from "react";

export function OnboardingProfileSetup() {
  const [selectedPronoun, setSelectedPronoun] = useState("");

  const pronounOptions = [
    { value: "he/him", label: "He/Him" },
    { value: "she/her", label: "She/Her" },
    { value: "they/them", label: "They/Them" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
    { value: "custom", label: "Custom" }
  ];

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={8}
      title="Tell Us About Yourself"
      subtitle="Help us personalize your Ezri experience"
    >
      <Card className="p-6 md:p-8 shadow-xl backdrop-blur-sm bg-white/90">
        <form className="space-y-6">
          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <User className="w-12 h-12 text-primary" />
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </motion.div>
            <p className="text-sm text-muted-foreground mt-2">Add a profile photo (optional)</p>
          </motion.div>

          {/* Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="John"
                className="bg-input-background transition-all focus:scale-[1.02]"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-2"
            >
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="bg-input-background transition-all focus:scale-[1.02]"
                required
              />
            </motion.div>
          </div>

          {/* Pronouns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <Label>Pronouns (optional)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {pronounOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPronoun(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedPronoun === option.value
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Age */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              min="13"
              max="120"
              placeholder="25"
              className="bg-input-background transition-all focus:scale-[1.02]"
              required
            />
            <p className="text-xs text-muted-foreground">
              You must be at least 13 years old to use Ezri
            </p>
          </motion.div>

          {/* Timezone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-2"
          >
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              className="w-full px-3 py-2 border border-border rounded-md bg-input-background transition-all focus:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="auto">Auto-detect (Recommended)</option>
              <option value="PST">Pacific Time (PST)</option>
              <option value="MST">Mountain Time (MST)</option>
              <option value="CST">Central Time (CST)</option>
              <option value="EST">Eastern Time (EST)</option>
            </select>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-3 pt-4"
          >
            <Link to="/onboarding/welcome" className="flex-1">
              <Button type="button" variant="outline" className="w-full group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back
              </Button>
            </Link>

            <Link to="/onboarding/wellness-baseline" className="flex-1">
              <motion.div
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
            </Link>
          </motion.div>
        </form>
      </Card>
    </OnboardingLayout>
  );
}
