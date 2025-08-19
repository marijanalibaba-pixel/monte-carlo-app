# Monte Carlo Forecasting Application

## Overview

This is a full-stack web application that performs Monte Carlo simulations for project forecasting. The application allows users to predict project completion dates using two different statistical models: throughput-based and cycle-time-based forecasting. Users can input parameters such as backlog size, team throughput metrics, or historical cycle times, and the application generates probabilistic forecasts with confidence intervals and visualizations.

The application is built as a modern React frontend with an Express.js backend, using TypeScript throughout for type safety. It features interactive charts, form validation, and a responsive design suitable for project managers and teams doing agile delivery forecasting.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (August 18, 2025)

✓ **Chart Legend Positioning** - Moved legends inside chart frames at optimal position (bottom-4)
✓ **Confidence Intervals Reduced** - Now only shows P50, P80, P95 (removed P85, P90, P99)
✓ **Cycle Time Analysis Updated** - Changed from P85 to P80 percentile throughout application
✓ **New Weekly Throughput Calculation** - Implemented methodology: fit lognormal to P50/P80/P95, draw cycle time per week, convert to weekly throughput (5/X items/week)
✓ **Fixed React Fast Refresh Issues** - Resolved development server cache conflicts after reverts

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for client-side routing instead of React Router
- **TanStack Query** for server state management and API caching
- **Tailwind CSS** with **shadcn/ui** component library for styling and UI components
- **Recharts** for data visualization (histogram and S-curve charts)
- **React Hook Form** with **Zod validation** for form handling and validation
- **date-fns** for date manipulation and formatting

### Backend Architecture
- **Express.js** server with TypeScript
- **In-memory storage** using a custom storage interface pattern for user data
- Modular route registration system with error handling middleware
- Development-only Vite integration for SSR and hot reloading
- RESTful API structure with `/api` prefix convention

### Data Management
- **Drizzle ORM** with PostgreSQL support configured for production database operations
- **Zod schemas** for runtime type validation and database schema generation
- Shared type definitions between client and server using a `shared/` directory
- Environment-based configuration for database connections

### UI/UX Design System
- **shadcn/ui** component library with Radix UI primitives
- **New York** design style with neutral color palette
- CSS custom properties for theming with light/dark mode support
- Responsive design with mobile-first approach
- Custom fonts including Inter, Geist Mono, and Architects Daughter

### Build and Development
- **TypeScript** configuration with path mapping for clean imports
- **ESBuild** for production server bundling
- **PostCSS** with Tailwind CSS for styling
- Hot module replacement in development with error overlay
- Separate client and server build processes

### Monte Carlo Simulation Engine
- Pure TypeScript implementation of statistical functions including:
  - Box-Muller transformation for normal distribution sampling
  - Lognormal distribution modeling for both throughput and cycle time
  - Percentile calculations for forecast confidence intervals
- Two forecasting models:
  - **Throughput model**: Uses team velocity and variability (coefficient of variation)
  - **Cycle time model**: Uses historical percentile data (P50, P80, P95)
- Client-side computation to avoid server load and provide instant results

### External Dependencies

- **@neondatabase/serverless**: Serverless PostgreSQL database driver for production deployment
- **Recharts**: Chart library built on D3.js for histogram and S-curve visualizations  
- **Radix UI**: Headless UI component primitives for accessibility and customization
- **TanStack Query**: Server state management for API calls and caching
- **Wouter**: Lightweight client-side routing library
- **date-fns**: Date manipulation library for forecast date calculations
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Modern build tool with fast HMR for development experience

The application uses a PostgreSQL database in production but can fall back to in-memory storage for development. All major statistical computations are performed client-side to ensure responsiveness and reduce server load.