#!/bin/bash

# Script to update all remaining admin pages to use AdminLayoutNew

# List of files to update
FILES=(
  "/src/app/pages/admin/CrisisEventDetails.tsx"
  "/src/app/pages/admin/CrisisFollowUpQueue.tsx"
  "/src/app/pages/admin/LiveSessionsMonitor.tsx"
  "/src/app/pages/admin/UsageAnalytics.tsx"
  "/src/app/pages/admin/SystemHealthEnhanced.tsx"
  "/src/app/pages/admin/NudgeManagement.tsx"
  "/src/app/pages/admin/WellnessContentCMS.tsx"
  "/src/app/pages/admin/ExerciseLibrary.tsx"
  "/src/app/pages/admin/TeamRoleManagement.tsx"
  "/src/app/pages/admin/SystemSettingsEnhanced.tsx"
  "/src/app/pages/admin/BillingSubscriptions.tsx"
  "/src/app/pages/admin/ComplianceDashboard.tsx"
  "/src/app/pages/admin/EnterpriseFeatures.tsx"
  "/src/app/pages/admin/DataRetentionPrivacy.tsx"
)

# For each file, replace AdminLayout with AdminLayoutNew
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    sed -i 's/AdminLayout"/AdminLayoutNew"/g' "$file"
    echo "Updated: $file"
  fi
done

echo "All files updated!"
