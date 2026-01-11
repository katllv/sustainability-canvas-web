# Sustainability Canvas Web

A comprehensive web application for creating, managing, and analyzing sustainability canvases for projects. This tool helps organizations evaluate projects across economic, environmental, and social dimensions while mapping impacts to UN Sustainable Development Goals (SDGs).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Architecture](#architecture)
- [Canvas Sections](#canvas-sections)
- [Contributing](#contributing)

## Overview

The Sustainability Canvas Web application provides a structured framework for evaluating projects through a sustainability lens. It extends traditional business model canvas concepts by incorporating environmental and social impact assessment, enabling organizations to make more informed, sustainable decisions.

### Key Concepts

- **Sustainability Canvas**: A visual tool divided into 11 sections covering key aspects of a project from stakeholders to revenue streams
- **Impact Assessment**: Each canvas entry is evaluated across three dimensions (Economic, Environmental, Social) with sentiment analysis
- **SDG Mapping**: Projects are mapped to relevant UN Sustainable Development Goals
- **Analysis & Reporting**: Comprehensive analytics, visualizations, and exportable reports (Excel, PDF)

## Features

### Project Management
- Create and manage multiple sustainability projects
- Real-time collaboration with team members
- Project ownership and access control
- Archive/close projects when complete

### Sustainability Canvas
- **11 Canvas Sections**:
  - Unique Value Proposition (UVP)
  - Customer Segment (CS)
  - Customer Relationship (CR)
  - Channels (CH)
  - Governance (GO)
  - Key Stakeholders (KS)
  - Key Activities (KA)
  - Waste Management (WM)
  - Key Resources (KTR)
  - Cost Structure (CO)
  - Revenue Streams (RE)
- Guided questions for each section
- Rich text impact entries
- SDG tagging for each impact

### Impact Analysis
- Multi-dimensional scoring (Economic, Environmental, Social)
- Sentiment analysis (Positive, Negative, Neutral)
- Visual analytics dashboard with charts:
  - Impact type distribution
  - Dimension distribution
  - Score distribution
  - SDG coverage analysis
  - Sentiment distribution
- Export analysis to Excel format
- Print-friendly reports

### Collaboration
- Invite team members to projects
- Role-based access (Owner, Collaborator)
- View collaborator profiles
- Remove collaborators

### User Management
- Secure authentication with JWT
- User profiles with avatars
- Account settings (email, password, bio)
- Account deletion with data cleanup

### Admin Features
- User management dashboard
- Registration code system
- View all user profiles
- Delete users and associated data
- Close/archive projects
- System shutdown procedures

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **Tailwind CSS v4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Recharts** - Data visualization
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend Integration
- **Azure Functions** - Serverless REST API backend
- **Azure PostgreSQL** - Database
- JWT-based authentication
- Local development proxy to `localhost:7071`

### UI Components
- Custom component library built on Radix UI
- Form components with validation
- Dialogs, dropdowns, tooltips
- Data visualization charts
- Toast notifications (Sonner)

### Utilities
- **ExcelJS** - Excel export
- **lucide-react** - Icon library

## Project Structure

```
sustainability-canvas-web/
├── src/
│   ├── api/              # API client functions and React Query hooks
│   │   ├── analysis.ts   # Analysis endpoints
│   │   ├── impacts.ts    # Impact CRUD operations
│   │   ├── profiles.ts   # User profile management
│   │   ├── projects.ts   # Project management
│   │   ├── sdgs.ts       # SDG data
│   │   └── users.ts      # User operations
│   ├── components/
│   │   ├── admin/        # Admin dashboard components
│   │   ├── analysis/     # Charts and analytics
│   │   ├── canvas/       # Canvas sections and impact forms
│   │   ├── layout/       # App layout and header
│   │   ├── navigation/   # Navigation components
│   │   ├── projects/     # Project cards and dialogs
│   │   ├── settings/     # User settings dialogs
│   │   ├── team/         # Collaboration components
│   │   └── ui/           # Reusable UI components (buttons, forms, etc.)
│   ├── lib/
│   │   ├── auth.tsx              # Authentication context
│   │   ├── analysis-constants.ts # Chart colors and constants
│   │   ├── export-analysis.ts    # Excel export for analysis
│   │   ├── export-canvas.ts      # Excel export for canvas
│   │   └── section-questions.ts  # Canvas section definitions
│   ├── pages/            # Page components
│   ├── routes/           # Route definitions
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Azure Functions backend** running locally at `http://localhost:7071` for development
- **Azure PostgreSQL database** accessible by the backend
- Environment variables configured

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:7071
# For production, use your Azure Functions URL:
# VITE_API_URL=https://your-function-app.azurewebsites.net
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sustainability-canvas-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Development

### Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Type-check and build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Development Server

The Vite dev server runs on `http://localhost:5173` by default and proxies API requests to `http://localhost:7071/api/*`.

### Code Style

- **ESLint** enforces code quality rules
- **Prettier** handles code formatting
- **TypeScript** provides static type checking
- Run `npm run lint:fix && npm run format` before committing

### Component Development

- Use TypeScript for all components
- Follow the existing component structure in `src/components/`
- Use Radix UI primitives for accessible components
- Apply Tailwind classes for styling
- Use React Hook Form + Zod for form validation
- Leverage TanStack Query for server state

## Building for Production

```bash
npm run build
```

This will:
1. Run TypeScript type checking
2. Build the application with Vite
3. Output optimized files to `dist/`

The production build is configured for deployment to Azure Static Web Apps (see `staticwebapp.config.json`).

### Deployment

The application is designed to deploy to Azure Static Web Apps with:
- SPA routing handled via `navigationFallback`
- Static asset caching
- API routes proxied to backend

## Architecture

### State Management
- **TanStack Query**: Server state, caching, and synchronization
- **React Context**: Authentication state
- **React Hook Form**: Form state
- **URL State**: Route parameters and search params

### Routing
- **TanStack Router**: Type-safe file-based routing
- Nested layouts with `app-layout` and `public-layout`
- Protected routes requiring authentication
- Dynamic project routes with `$projectId` parameter

### API Integration
- RESTful API client functions in `src/api/`
- JWT-based authentication (token stored in localStorage)
- React Query hooks for data fetching and mutations
- Automatic error handling and retry logic

### Authentication Flow
1. User signs up/logs in via `LoginPage` or `SignUpPage`
2. Backend returns JWT token
3. Token stored in localStorage and used in Authorization headers
4. `AuthProvider` manages auth state and provides `useAuth` hook
5. Protected routes redirect unauthenticated users to login

## Canvas Sections

The Sustainability Canvas is divided into 11 sections, each addressing specific aspects of a project:

| Section | Code | Focus Area |
|---------|------|------------|
| **Unique Value Proposition** | UVP | Core value delivered to customers and society |
| **Customer Segment** | CS | Target customer groups and their needs |
| **Customer Relationship** | CR | Types of relationships with customer segments |
| **Channels** | CH | Distribution and communication channels |
| **Governance** | GO | Regulations, ethics, and responsible management |
| **Key Stakeholders** | KS | Partners and suppliers |
| **Key Activities** | KA | Value-creating activities and operations |
| **Waste Management** | WM | Waste reduction and management practices |
| **Key Resources** | KTR | Essential assets and their impacts |
| **Cost Structure** | CO | Major costs and sustainability considerations |
| **Revenue Streams** | RE | Revenue sources and sustainable pricing |

Each section includes guided questions to help users think critically about their project's sustainability implications.

## Design System

### Colors
- Canvas sections use custom color scheme (light blue, pink, yellow, green, lavender)
- Analysis charts use consistent color mapping for dimensions and impacts
- SDGs use official UN SDG colors

### Typography
- System font stack for optimal performance
- Responsive sizing with Tailwind utilities
- Print-optimized styles with `print:` variants

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Print-friendly layouts for reports

## Contributing

### Development Workflow

1. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes and test thoroughly

3. Ensure code quality
   ```bash
   npm run lint:fix
   npm run format
   npm run build
   ```

4. Commit with descriptive messages

5. Push and create a pull request

### Coding Standards

- Write self-documenting code with clear variable names
- Add comments for complex logic
- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks
- Use TypeScript strictly (avoid `any`)
- Follow existing patterns in the codebase