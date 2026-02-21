# Mobile App Store Submission Guide

Complete guide for submitting ZIP Platform mobile apps to iOS App Store and Google Play Store.

---

## Overview

This guide covers the submission process for:
- **iOS App Store** (Apple)
- **Google Play Store** (Android)

Both apps are built with React Native (Expo) and distributed through EAS Build.

---

## Prerequisites

### Required Accounts
- **Apple Developer Account**: $99/year ([apple.com/developer](https://developer.apple.com))
- **Google Play Console Account**: $25 one-time fee ([play.google.com/console](https://play.google.com/console))
- **Expo Account**: Free (or EAS Production $29/month)

### Required Tools
- **EAS CLI**: `npm install -g eas-cli`
- **Expo CLI**: `npm install -g expo-cli`
- **Xcode** (for iOS, macOS only)
- **Android Studio** (optional, for Android)

---

## iOS App Store Submission

### Step 1: Apple Developer Account Setup

1. **Create Apple Developer Account**
   - Go to [developer.apple.com](https://developer.apple.com)
   - Sign up for Apple Developer Program ($99/year)
   - Complete enrollment process (can take 24-48 hours)

2. **Create App Identifier**
   - Go to [developer.apple.com/account](https://developer.apple.com/account)
   - Navigate to Certificates, Identifiers & Profiles
   - Create new App ID (e.g., `com.zipconcierge.tenant`)
   - Enable required capabilities (Push Notifications, etc.)

3. **Create Distribution Certificate**
   - Generate certificate for App Store distribution
   - Download and install certificate

### Step 2: Configure EAS Build for iOS

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Configure eas.json**
   ```json
   {
     "build": {
       "production": {
         "ios": {
           "bundleIdentifier": "com.zipconcierge.tenant",
           "buildConfiguration": "Release"
         }
       }
     },
     "submit": {
       "production": {
         "ios": {
           "appleId": "your-email@example.com",
           "ascAppId": "your-app-store-connect-app-id",
           "appleTeamId": "your-team-id"
         }
       }
     }
   }
   ```

3. **Configure app.json/app.config.js**
   ```json
   {
     "expo": {
       "name": "ZIP Concierge",
       "slug": "zip-concierge",
       "version": "1.0.0",
       "ios": {
         "bundleIdentifier": "com.zipconcierge.tenant",
         "buildNumber": "1",
         "supportsTablet": true,
         "infoPlist": {
           "NSLocationWhenInUseUsageDescription": "We need your location to show properties near you.",
           "NSCameraUsageDescription": "We need camera access to upload property photos."
         }
       }
     }
   }
   ```

### Step 3: Build iOS App

```bash
# Build for iOS
eas build --platform ios --profile production

# This will:
# - Build app in cloud
# - Generate .ipa file
# - Upload to EAS servers
```

### Step 4: App Store Connect Setup

1. **Create App in App Store Connect**
   - Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Click "My Apps" → "+" → "New App"
   - Fill in app information:
     - Name: ZIP Concierge
     - Primary Language: English
     - Bundle ID: com.zipconcierge.tenant
     - SKU: ZIP-TENANT-001

2. **App Information**
   - Category: Lifestyle or Real Estate
   - Privacy Policy URL: https://zipconcierge.com/privacy
   - Support URL: https://zipconcierge.com/support

3. **App Store Listing**
   - App Name: ZIP Concierge
   - Subtitle: Verified Rental Marketplace
   - Description: (See template below)
   - Keywords: rental, housing, student, verified, toronto
   - Promotional Text: (Optional)
   - Marketing URL: (Optional)

### Step 5: Prepare App Store Assets

**Required Screenshots:**
- iPhone 6.7" (iPhone 14 Pro Max): 1290 x 2796 pixels
- iPhone 6.5" (iPhone 11 Pro Max): 1242 x 2688 pixels
- iPhone 5.5" (iPhone 8 Plus): 1242 x 2208 pixels
- iPad Pro 12.9": 2048 x 2732 pixels

**Required Assets:**
- App Icon: 1024 x 1024 pixels (PNG, no transparency)
- Privacy Policy: Must be hosted on your website

**Screenshot Template:**
1. Landing/Home screen
2. Property search/browse
3. Property details
4. Saved properties
5. User profile

### Step 6: Submit for Review

```bash
# Submit to App Store
eas submit --platform ios --profile production

# Or manually:
# 1. Download .ipa from EAS
# 2. Use Transporter app to upload
# 3. Complete submission in App Store Connect
```

### Step 7: App Review Process

1. **Submit for Review**
   - Complete all required information
   - Answer App Review questions
   - Submit for review

2. **Review Timeline**
   - Initial review: 24-48 hours
   - If rejected: Fix issues and resubmit

3. **Common Rejection Reasons**
   - Missing privacy policy
   - Incomplete app information
   - Crashes or bugs
   - Violation of App Store guidelines

---

## Google Play Store Submission

### Step 1: Google Play Console Setup

1. **Create Google Play Console Account**
   - Go to [play.google.com/console](https://play.google.com/console)
   - Pay $25 one-time registration fee
   - Complete account setup

2. **Create App**
   - Click "Create app"
   - Fill in app details:
     - App name: ZIP Concierge
     - Default language: English
     - App or game: App
     - Free or paid: Free

### Step 2: Configure EAS Build for Android

1. **Configure eas.json**
   ```json
   {
     "build": {
       "production": {
         "android": {
           "package": "com.zipconcierge.tenant",
           "versionCode": 1
         }
       }
     }
   }
   ```

2. **Configure app.json**
   ```json
   {
     "expo": {
       "android": {
         "package": "com.zipconcierge.tenant",
         "versionCode": 1,
         "permissions": [
           "ACCESS_FINE_LOCATION",
           "CAMERA"
         ],
         "adaptiveIcon": {
           "foregroundImage": "./assets/adaptive-icon.png",
           "backgroundColor": "#ffffff"
         }
       }
     }
   }
   ```

### Step 3: Build Android App

```bash
# Build for Android
eas build --platform android --profile production

# This generates .aab (Android App Bundle) file
```

### Step 4: Prepare Play Store Listing

1. **Store Listing**
   - App name: ZIP Concierge
   - Short description: Verified rental marketplace for international students
   - Full description: (See template below)
   - App icon: 512 x 512 pixels
   - Feature graphic: 1024 x 500 pixels

2. **Required Screenshots:**
   - Phone: At least 2 screenshots (1080 x 1920 or larger)
   - Tablet (7"): At least 2 screenshots (1200 x 1920 or larger)
   - Tablet (10"): At least 2 screenshots (1600 x 2560 or larger)

3. **Content Rating**
   - Complete content rating questionnaire
   - Get rating certificate

4. **Privacy Policy**
   - Must be hosted on your website
   - URL required in Play Console

### Step 5: App Content

1. **Content Rating**
   - Complete questionnaire
   - Get rating (typically "Everyone")

2. **Target Audience**
   - Age groups: 18+
   - Content: Real estate listings

3. **Data Safety**
   - Declare data collection practices
   - Privacy policy URL required

### Step 6: Release Management

1. **Create Release**
   - Go to Production → Create new release
   - Upload .aab file from EAS Build
   - Add release notes

2. **Release Notes Template**
   ```
   Version 1.0.0
   - Initial release
   - Browse rental properties and purchase verification when needed
   - Search by location and filters
   - Save favorite properties
   - Contact property owners
   ```

### Step 7: Submit for Review

1. **Review Release**
   - Check all information
   - Verify app works correctly
   - Submit for review

2. **Review Timeline**
   - Initial review: 1-3 days
   - If rejected: Fix issues and resubmit

---

## App Store Listing Content

### App Description Template

**Short Description (80 characters max):**
```
Verified rental marketplace for international students in Toronto
```

**Full Description:**
```
ZIP Concierge - See It Before You Sign

Find your perfect rental in Toronto with verified property listings designed for international students.

KEY FEATURES:
✓ On-Demand Verification - Purchase verification packages before signing
✓ University Proximity - Find properties near your university
✓ Student-Friendly - Designed specifically for international students
✓ Safe & Secure - Verified listings reduce rental scams
✓ Easy Search - Filter by price, location, and amenities

PERFECT FOR:
• International students studying in Toronto
• Students looking for rental properties with optional paid verification
• Anyone seeking safe, verified housing options

Download ZIP Concierge today and find your perfect home in Toronto!
```

### Keywords (iOS)

```
rental, housing, student, verified, toronto, calgary, apartment, room, international student, university, housing search, property, real estate
```

---

## App Store Assets Checklist

### iOS App Store
- [ ] App Icon (1024 x 1024)
- [ ] Screenshots for all required device sizes
- [ ] App Preview Video (optional but recommended)
- [ ] Privacy Policy URL
- [ ] Support URL
- [ ] Marketing URL (optional)

### Google Play Store
- [ ] App Icon (512 x 512)
- [ ] Feature Graphic (1024 x 500)
- [ ] Phone Screenshots (at least 2)
- [ ] Tablet Screenshots (at least 2)
- [ ] Privacy Policy URL
- [ ] Content Rating completed

---

## EAS Build Configuration

### Complete eas.json Example

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "ios": {
        "bundleIdentifier": "com.zipconcierge.tenant",
        "buildConfiguration": "Release"
      },
      "android": {
        "package": "com.zipconcierge.tenant",
        "versionCode": 1
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-email@example.com",
        "ascAppId": "your-app-id",
        "appleTeamId": "your-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

---

## Over-the-Air Updates

### Configure OTA Updates

```bash
# Publish update
eas update --branch production --message "Bug fixes and improvements"

# This updates the app without going through app store review
# Users get update on next app launch
```

### Update Strategy

- **Critical Bugs**: OTA update immediately
- **New Features**: App store update (requires review)
- **Minor Fixes**: OTA update

---

## Common Issues & Solutions

### Issue: Build Fails

**Solution**:
- Check `eas.json` configuration
- Verify app.json/app.config.js
- Check EAS build logs
- Ensure all dependencies are compatible

### Issue: App Rejected by Apple

**Common Reasons**:
- Missing privacy policy
- App crashes
- Incomplete functionality
- Guideline violations

**Solution**:
- Fix all issues mentioned in rejection
- Test thoroughly before resubmission
- Provide detailed explanation if needed

### Issue: App Rejected by Google

**Common Reasons**:
- Missing privacy policy
- Content rating issues
- Data safety declaration incomplete
- App crashes

**Solution**:
- Complete all required information
- Fix crashes and bugs
- Update data safety section
- Resubmit with fixes

---

## Post-Launch Maintenance

### Version Updates

1. **Update Version Numbers**
   ```json
   // app.json
   {
     "version": "1.0.1",  // User-facing version
     "ios": {
       "buildNumber": "2"  // Increment for each build
     },
     "android": {
       "versionCode": 2  // Increment for each build
     }
   }
   ```

2. **Build New Version**
   ```bash
   eas build --platform all --profile production
   ```

3. **Submit Update**
   ```bash
   eas submit --platform all --profile production
   ```

### Monitoring

- Monitor app store reviews
- Track crash reports (Sentry)
- Monitor analytics (PostHog)
- Respond to user feedback

---

## Submission Checklist

### Pre-Submission
- [ ] App tested on real devices
- [ ] All features working correctly
- [ ] No crashes or critical bugs
- [ ] Privacy policy published
- [ ] All assets prepared
- [ ] App store listings complete
- [ ] Content rating completed (Android)
- [ ] Data safety declared (Android)

### iOS Specific
- [ ] Apple Developer account active
- [ ] App ID created
- [ ] Distribution certificate created
- [ ] App Store Connect app created
- [ ] Screenshots for all device sizes
- [ ] App icon (1024 x 1024)

### Android Specific
- [ ] Google Play Console account created
- [ ] App created in Play Console
- [ ] Content rating completed
- [ ] Data safety section completed
- [ ] Screenshots uploaded
- [ ] Feature graphic uploaded

---

## Resources

- **Apple Developer**: https://developer.apple.com
- **App Store Connect**: https://appstoreconnect.apple.com
- **Google Play Console**: https://play.google.com/console
- **Expo Documentation**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **EAS Submit**: https://docs.expo.dev/submit/introduction/

---

*Last Updated: [Current Date]*
