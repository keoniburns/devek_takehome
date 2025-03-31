# Bun React Chat Application

A full-stack chat application built with Bun, React, and TypeScript. This project provides a real-time chat experience with authentication using WebSockets.

## Prerequisites

- [Bun](https://bun.sh) v1.2.7 or later
- Docker and Docker Compose (for containerized deployment)
- Node.js v18 or later (optional, as Bun is the primary runtime)

## Getting Started

### Local Development

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd bun-react-template
   ```

2. Install dependencies

   ```bash
   bun install
   ```

3. Start the development server

   ```bash
   # Start both frontend and backend
   bun dev

   # Start just the backend
   bun dev:backend

   # Start just the frontend
   bun dev:frontend
   ```

### Docker Development

This project includes Docker configuration for easy deployment:

1. Build and start all services

   ```bash
   docker-compose up
   ```

2. Access the application
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000

### Production Build

```bash
# Clean previous builds
bun run clean

# Build just the frontend
bun run build:frontend

# Build just the backend
bun run build:backend

# Build both frontend and backend (includes cleaning)
bun run build
```

### Running in Production

```bash
# Run the frontend development server in production mode
bun run start:frontend

# Run the compiled backend
bun run start:backend

# Run both frontend and backend servers
bun run start
```

The build process:

1. Cleans previous build directories
2. Compiles the frontend into optimized static files
3. Compiles the backend with external dependencies
4. Copies frontend assets to the backend distribution folder

## Project Structure

```

bun-react-template/
├── src/
│ ├── frontend/ # React frontend application
│ │ ├── assets/ # Static assets
│ │ ├── components/ # Reusable React components
│ │ ├── context/ # React context providers
│ │ ├── middleware/ # Frontend middleware
│ │ ├── pages/ # Application pages
│ │ ├── styles/ # CSS and theme configuration
│ │ ├── App.tsx # Main application component
│ │ ├── main.tsx # Frontend entry point
│ │ ├── dev-server.ts # Development server
│ │ └── index.html # HTML template
│ │
│ ├── backend/ # Bun backend server
│ │ ├── data/ # Data storage directory
│ │ ├── auth.ts # Authentication handlers
│ │ ├── chat.ts # Chat WebSocket handlers
│ │ ├── cors.ts # CORS configuration
│ │ └── index.tsx # Backend entry point
│ │
│ └── shared/ # Shared code between frontend and backend
│ └── types.ts # TypeScript type definitions
│
├── data/ # Persistent data storage
├── Dockerfile.backend # Backend Docker configuration
├── Dockerfile.frontend # Frontend Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── package.json # Project dependencies and scripts

```

## Architecture

This application follows a full-stack JavaScript architecture:

- **Frontend**: React 19 with Material UI for the user interface
- **Backend**: Bun server handling HTTP requests and WebSocket connections
- **Communication**: WebSockets for real-time chat and REST API for authentication
- **Data Persistence**: JSON files for storing user data and chat messages, given the scale of the assessment using a database such as mongoDB would have been more trouble than what was required
- **Authentication**: JWT-based authentication with bcrypt for password hashing

## Technical Decisions

- **Bun**: Used as the JavaScript runtime for both development and production. Bun provides excellent performance and compatibility.
- **React 19**: Latest version of React for building the user interface.
- **TypeScript**: Strong typing for better code quality and developer experience.
- **Material UI**: Component library for consistent UI design.
- **WebSockets**: For real-time bidirectional communication.
- **Docker**: For containerization and easy deployment.

## Production Improvements

For production deployment, consider the following improvements:

1. **Environment Variables**: Implement a proper environment variable management system for sensitive data like JWT secrets.
2. **Database Integration**: Replace JSON file storage with a proper database (MongoDB, PostgreSQL).
3. **Monitoring**: Add logging and monitoring tools (Prometheus, Grafana).
4. **CI/CD Pipeline**: Implement automated testing and deployment.
5. **Load Balancing**: Set up load balancing for handling multiple instances.
6. **Caching**: Implement caching strategies for improved performance.
7. **Rate Limiting**: Add rate limiting to prevent abuse.
8. **HTTPS**: Enable HTTPS for secure communications.
9. **Error Handling**: Improve error handling and implement proper error reporting.
10. **Performance Optimization**: Optimize bundle size, implement code splitting, and lazy loading.

```

```
