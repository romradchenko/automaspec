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

| Task | How To | Expected Result |
|------|--------|-----------------|
| **Create a folder** | Click **"+ New Folder"** in the left panel, enter name | New folder appears in the tree hierarchy |
| **Create a test spec** | Select a folder, click **"+ New Spec"**, enter details | New spec card appears with default status indicators |
| **Add a requirement** | Open a spec, click **"+ Add Requirement"**, enter title and description | Requirement appears in the spec's requirement list |
| **Generate AI test** | Select a requirement, click **"Generate with AI"**, review and accept code | Vitest test code attached to the requirement |
| **View analytics** | Click **"Analytics"** in the navigation menu | Dashboard showing metrics, charts, and trends |
| **Invite team member** | Go to Profile → Organization → Invite Members, enter email and role | Invitation sent, member appears after acceptance |
| **Export test code** | Open a requirement with generated test, click copy/export button | Test code ready to paste into your project |
| **Update test status** | Manually mark tests as passed/failed or connect CI/CD for automatic updates | Status indicators update across the hierarchy |

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

| Shortcut | Action | Context |
|----------|--------|---------|
| `Escape` | Close modal/panel | Closes any open dialog or side panel |
| `Tab` | Navigate between fields | Form navigation |

## Common Workflows

### Workflow 1: Setting Up a New Test Suite

1. **Create Organization Structure**
   - Create top-level folders for major features or modules
   - Example: "Authentication", "User Management", "Payment Processing"

2. **Define Test Specifications**
   - For each folder, create test specs that represent test scenarios
   - Example: "Login Flow", "Password Reset", "Session Management"

3. **Break Down Requirements**
   - Add detailed requirements to each spec
   - Write clear, testable requirements with acceptance criteria

4. **Generate Tests**
   - Use AI to generate test code for each requirement
   - Review and refine generated code as needed

5. **Export and Integrate**
   - Export test code to your project structure
   - Set up CI/CD integration for automatic status updates

### Workflow 2: Daily Test Management

1. **Review Dashboard**
   - Check analytics dashboard for overall test health
   - Identify failing tests or coverage gaps

2. **Investigate Failures**
   - Drill down from folder → spec → requirement → test
   - Review test code and execution results

3. **Update Status**
   - Mark tests as fixed after code changes
   - Or wait for CI/CD to update automatically

4. **Add New Tests**
   - Create new requirements for new features
   - Generate tests using AI assistance

### Workflow 3: Team Collaboration

1. **Invite Team Members**
   - Add QA engineers, developers, and team leads
   - Assign appropriate roles (Admin or Member)

2. **Organize Work**
   - Use folders to organize work by sprint, feature, or team
   - Assign specs to team members via naming conventions

3. **Review and Approve**
   - Team members review AI-generated tests
   - Provide feedback and iterate on test quality

4. **Track Progress**
   - Use analytics to track team productivity
   - Monitor test coverage growth over time
