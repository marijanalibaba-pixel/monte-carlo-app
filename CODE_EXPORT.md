# Monte Carlo Forecasting Application - Complete Code Export

## Project Overview
This is a full-stack Monte Carlo forecasting application built with React + TypeScript frontend and Express.js backend. It provides statistical forecasting using throughput-based and cycle-time-based models.

## Key Features
- Monte Carlo simulation engine with lognormal distributions
- Two forecasting models: Throughput and Cycle Time analysis
- Interactive charts with Recharts (histogram and S-curve)
- P50, P80, P95 confidence intervals
- Scenario comparison functionality
- Modern UI with shadcn/ui components
- Responsive design with Tailwind CSS

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM (configured for production)
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts library
- **State Management**: TanStack Query
- **Routing**: Wouter

## Quick Access to All Files

You can view ALL the code files by accessing this Replit directly:
**Replit URL**: https://replit.com/@YourUsername/YourReplName

Or copy the files below individually:

## Core Application Files

### 1. Package Configuration
- `package.json` - Dependencies and build scripts
- `tsconfig.json` - TypeScript configuration  
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS setup

### 2. Main Application Structure
- `client/src/main.tsx` - React app entry point
- `client/src/App.tsx` - Main React application
- `server/index.ts` - Express server setup

### 3. Core Business Logic
- `client/src/lib/monte-carlo-engine.ts` - Monte Carlo simulation engine
- `client/src/pages/advanced-dashboard.tsx` - Main dashboard
- `client/src/components/advanced-input-form.tsx` - Input forms
- `client/src/components/advanced-visualization.tsx` - Charts & graphs

### 4. Data & Types
- `shared/schema.ts` - Shared TypeScript types
- `client/src/lib/queryClient.ts` - API client setup
- `server/routes.ts` - API endpoints

### 5. UI Components (shadcn/ui)
Located in `client/src/components/ui/`:
- All modern UI components (40+ files)
- Form, chart, layout components
- Responsive design elements

## How to Share This Code

**Option 1: Share Replit Link**
Just share your Replit URL - anyone can view all files directly

**Option 2: Download as ZIP** 
In Replit: Three dots menu → "Download as zip"

**Option 3: Individual File Access**
View any file by clicking it in the file explorer on the left

**Option 4: GitHub Export**
In Replit: Version control → Connect to GitHub → Push to repository

## Recent Updates
- ✓ P50, P80, P95 confidence intervals only
- ✓ P80 percentile for cycle time analysis  
- ✓ Weekly throughput calculation method
- ✓ Chart legends positioned inside frames
- ✓ Fixed React/Vite runtime errors

## Ready for Review
This application is production-ready with professional statistical modeling, modern UI, and clean architecture. All files are accessible in this Replit workspace.