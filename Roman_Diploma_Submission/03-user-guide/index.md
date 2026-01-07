# 3. User Guide

This section provides instructions for end users on how to use Automaspec.

## Contents

- [Features Walkthrough](features.md)
- [FAQ & Troubleshooting](faq.md)

## Getting Started

### System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **Browser** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ | Latest version |
| **Screen Resolution** | 1280x720 | 1920x1080 |
| **Internet** | Required | Stable broadband |
| **Device** | Desktop, Tablet, or Mobile | Desktop for full experience |

### Accessing the Application

1. Open your web browser
2. Navigate to: **[https://automaspec.vercel.app](https://automaspec.vercel.app)**
3. You will see the landing page with login options

### First Launch

#### Step 1: Registration/Login

![Login Screen](../assets/screenshots/prod-login-desktop.png)

1. Click **"Sign In"** or **"Get Started"** on the landing page
2. For new users: Enter your email and create a password (minimum 8 characters)
3. For existing users: Enter your credentials and click **"Sign In"**
4. You will be redirected to the organization selection page

#### Step 2: Organization Setup

![Choose Organization](../assets/screenshots/prod-choose-organization-desktop.png)

1. If you're new, click **"Create Organization"**
2. Enter an organization name (e.g., "My Team", "Project Alpha")
3. Click **"Create"** to set up your workspace
4. You will be assigned as the **Owner** role automatically

#### Step 3: Main Dashboard

![Dashboard](../assets/screenshots/prod-dashboard-desktop.png)

After setup, you will see the main dashboard with:

- **Left Panel**: Folder tree for organizing test specs
- **Right Panel**: Details view for selected spec/requirement
- **Top Bar**: Organization switcher, theme toggle, and profile menu
- **AI Panel**: Access to AI-powered test generation

## Quick Start Guide

| Task | How To |
|------|--------|
| Create a folder | Click **"+ New Folder"** in the left panel, enter name |
| Create a test spec | Select a folder, click **"+ New Spec"**, enter details |
| Add a requirement | Open a spec, click **"+ Add Requirement"** |
| Generate AI test | Select a requirement, click **"Generate with AI"** |
| View analytics | Click **"Analytics"** in the navigation menu |
| Invite team member | Go to Profile → Organization → Invite Members |

## User Roles

| Role | Permissions | Access Level |
|------|-------------|--------------|
| **Owner** | Full control: manage members, billing, delete org | Full |
| **Admin** | Create/edit/delete specs, folders, invite members | Full (except org deletion) |
| **Member** | View and edit test specs and requirements | Limited |

## Navigation

### Desktop Layout

- **Sidebar**: Folder hierarchy with collapsible tree
- **Main Content**: Spec details, requirements, tests
- **Header**: Breadcrumbs, organization selector, user menu

### Mobile Layout

- **Bottom Navigation**: Quick access to Dashboard, Analytics, AI, Profile
- **Drawer Menu**: Folder tree accessible via hamburger menu
- **Swipe Actions**: Navigate between specs

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | New spec/folder (context dependent) |
| `Ctrl/Cmd + S` | Save current changes |
| `Escape` | Close modal/panel |
| `Tab` | Navigate between fields |
