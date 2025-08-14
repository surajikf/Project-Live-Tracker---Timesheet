# 🚀 Project Live Tracker + Timesheet

A comprehensive real-time project tracking and timesheet management application built with React, Redux, and Tailwind CSS.

## 🌟 Live Demo

**[View Live Application](https://surajikf.github.io/Project-Live-Tracker---Timesheet/)**

## ✨ Features

### 🎯 **Project Management**
- Real-time project tracking with 8-stage lifecycle workflow
- Dual approval system (IKF + Client) at each stage
- Progress calculation with weighted stage completion
- File management and document sharing
- Team assignment and role-based permissions

### 👥 **User Roles & Permissions**
- **Admin/Project Manager**: Full control over projects, team, and approvals
- **Internal Team Members**: View assigned projects, update progress, log timesheets
- **Client POC**: View own projects, approve stages, track progress

### 📊 **Dashboard & Analytics**
- Role-specific dashboards with contextual information
- Real-time project status updates
- Pending approvals tracking
- Timesheet analytics and reporting

### ⏰ **Timesheet Management**
- Easy time logging with project and task association
- Work description and categorization
- Approval workflows for time entries
- Historical data and reporting

### 🔄 **Workflow Automation**
- Automatic progress calculation
- Approval reminders and notifications
- Role-based access control
- Process workflow visualization

## 🛠️ Technology Stack

- **Frontend**: React.js 18, Redux Toolkit, React Router DOM
- **Styling**: Tailwind CSS, Lucide React Icons
- **State Management**: Redux Toolkit with async thunks
- **Build Tool**: Create React App
- **Deployment**: GitHub Pages

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/project-live-tracker-timesheet.git
   cd project-live-tracker-timesheet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Login Credentials

- **Admin User**: 
  - Username: `admin@ikf.com`
  - Role: Full access to all features
  
- **Team Member**: 
  - Username: `team@ikf.com`
  - Role: Project updates and timesheet logging
  
- **Client User**: 
  - Username: `client@company.com`
  - Role: Project viewing and stage approvals

## 📱 Features Overview

### Dashboard
- Welcome banner with role-specific information
- Quick stats overview (Total Projects, Active Projects, Pending Approvals, Total Hours)
- Role-specific dashboard views
- Quick actions and process tips
- Interactive onboarding guide

### Projects
- Global project list with role-based filtering
- Project details with comprehensive information
- Stage management and approval workflows
- File upload and management
- Team assignment and management
- Comments and communication system

### Timesheets
- Time logging interface
- Project and task association
- Approval workflows
- Historical data viewing

### Team Management
- Team member listing
- Role and department information
- Project assignments

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build production bundle
- `npm test` - Run test suite
- `npm run deploy` - Deploy to GitHub Pages

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── projects/       # Project management
│   ├── timesheets/     # Timesheet components
│   ├── team/           # Team management
│   ├── onboarding/     # User onboarding
│   ├── workflow/       # Process workflow
│   └── actions/        # Quick actions
├── store/              # Redux store and slices
│   ├── slices/         # Redux Toolkit slices
│   └── store.js        # Store configuration
├── styles/             # CSS and styling
└── utils/              # Utility functions
```

## 🎨 Design System

### Color Scheme
- **Primary**: Blue (#3B82F6) - Main brand color
- **Success**: Green (#10B981) - Completed/Approved states
- **Warning**: Yellow (#F59E0B) - Pending/In Progress states
- **Error**: Red (#EF4444) - On Hold/Error states

### Status Logic
- 🟢 **Green**: In Progress - Active development
- 🟡 **Yellow**: Completed - Ready for review
- 🔴 **Red**: On Hold - Blocked or paused

## 🔐 Security Features

- Role-based access control (RBAC)
- Protected routes and components
- JWT token authentication (planned)
- Secure API endpoints (planned)

## 🚀 Deployment

### GitHub Pages Deployment

1. **Update homepage in package.json**
   ```json
   "homepage": "https://yourusername.github.io/project-live-tracker-timesheet"
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

3. **Configure GitHub Pages**
   - Go to repository Settings > Pages
   - Set source to `gh-pages` branch
   - Save configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation and onboarding guide

## 🔮 Roadmap

- [ ] Real-time updates with Socket.io
- [ ] Advanced reporting and analytics
- [ ] Mobile app development
- [ ] API integration with backend services
- [ ] Advanced file management with cloud storage
- [ ] Email notifications and reminders
- [ ] Multi-language support
- [ ] Advanced search and filtering

---

**Built with ❤️ by the IKF Development Team**

*Project Live Tracker + Timesheet - Making project management simple and efficient*
