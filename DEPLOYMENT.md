# 🚀 GitHub Live Link Setup Guide

This guide will walk you through setting up your Project Live Tracker + Timesheet application on GitHub with a live demo link.

## 📋 Prerequisites

- GitHub account
- Git installed on your local machine
- Node.js and npm installed

## 🔧 Step-by-Step Setup

### 1. Create GitHub Repository

1. **Go to GitHub.com** and sign in to your account
2. **Click the "+" icon** in the top right corner
3. **Select "New repository"**
4. **Repository name**: `project-live-tracker-timesheet`
5. **Description**: `Real-time project tracking and timesheet management application`
6. **Visibility**: Choose Public or Private (Public recommended for portfolio)
7. **Initialize with**: 
   - ✅ Add a README file
   - ✅ Add .gitignore (Node)
   - ✅ Choose a license (MIT)
8. **Click "Create repository"**

### 2. Update Homepage URL

**IMPORTANT**: Replace `yourusername` with your actual GitHub username in these files:

#### Update `package.json`:
```json
"homepage": "https://YOUR_ACTUAL_USERNAME.github.io/project-live-tracker-timesheet"
```

#### Update `README.md`:
```markdown
**[View Live Application](https://YOUR_ACTUAL_USERNAME.github.io/project-live-tracker-timesheet)**
```

### 3. Connect Local Repository to GitHub

```bash
# Add the remote origin (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/project-live-tracker-timesheet.git

# Verify remote is added
git remote -v

# Push your code to GitHub
git push -u origin main
```

### 4. Deploy to GitHub Pages

```bash
# Build and deploy the application
npm run deploy
```

### 5. Configure GitHub Pages

1. **Go to your repository** on GitHub
2. **Click "Settings"** tab
3. **Scroll down to "Pages"** section
4. **Source**: Select `gh-pages` branch
5. **Folder**: Leave as `/ (root)`
6. **Click "Save"**

### 6. Wait for Deployment

- GitHub Pages deployment takes 2-5 minutes
- You'll see a green checkmark when deployment is complete
- Your live link will be: `https://YOUR_USERNAME.github.io/project-live-tracker-timesheet`

## 🔄 Updating the Live Site

Whenever you make changes to your code:

```bash
# Commit your changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push origin main

# Deploy to GitHub Pages
npm run deploy
```

## 🐛 Troubleshooting

### Common Issues:

1. **404 Error on Live Site**
   - Check if GitHub Pages is enabled
   - Verify the `gh-pages` branch exists
   - Wait 5-10 minutes for deployment

2. **Build Errors**
   - Run `npm run build` locally to test
   - Check for syntax errors in your code
   - Verify all dependencies are installed

3. **Homepage Not Working**
   - Double-check the homepage URL in `package.json`
   - Ensure it matches your GitHub username exactly

### Check Deployment Status:

1. Go to your repository
2. Click "Actions" tab
3. Look for GitHub Pages deployment workflow
4. Check for any error messages

## 📱 Testing Your Live Site

1. **Open your live URL** in a browser
2. **Test all major features**:
   - Login with demo accounts
   - Navigate between sections
   - Test responsive design on mobile
   - Verify all components load correctly

3. **Test on different devices**:
   - Desktop browsers
   - Mobile devices
   - Different screen sizes

## 🌟 Demo Credentials for Live Site

Share these credentials with visitors to your live site:

- **Admin**: `admin@ikf.com` (Full access)
- **Team**: `team@ikf.com` (Project updates & timesheets)
- **Client**: `client@company.com` (View & approve projects)

## 🔗 Useful Links

- **GitHub Pages Documentation**: https://pages.github.com/
- **React Deployment Guide**: https://create-react-app.dev/docs/deployment/
- **gh-pages Package**: https://www.npmjs.com/package/gh-pages

## 📞 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review GitHub Pages documentation
3. Check the Actions tab for error logs
4. Create an issue in your repository

---

**Your live application will be available at:**
`https://YOUR_USERNAME.github.io/project-live-tracker-timesheet`

Replace `YOUR_USERNAME` with your actual GitHub username!
