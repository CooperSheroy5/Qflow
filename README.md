# Qflow - Python-First Workflow Orchestration Platform

## Overview

Qflow is a Python-first drag-and-drop workflow orchestration platform that reuses the n8n frontend editor UI but replaces the backend with a Python-based architecture. Users can create Python nodes, define input/output types, test nodes, and build complex workflows with Python execution in isolated containers.

## Project Structure

```
Qflow/
├── architecture/                    # Architecture documentation
│   ├── Qflow.md                    # Main project overview
│   ├── Qflow_Architecture.md       # Detailed architecture
│   ├── Qflow_Development_Plan.md   # Development roadmap
│   ├── database_schema_design.md   # Database schema
│   ├── monitoring_and_observability.md # Monitoring setup
│   └── README.md                   # Architecture overview
├── qflow-frontend/                 # Isolated frontend application
│   ├── src/                        # Vue.js application source
│   ├── API_ENDPOINTS.md           # Complete API documentation
│   ├── README.md                   # Frontend development guide
│   └── FRONTEND_SUMMARY.md        # Frontend isolation summary
├── qflow-backend/                  # Backend application (to be implemented)
├── n8n_backup/                     # Original n8n codebase (reference)
├── python_node_linking_diagram.md  # Node linking strategy diagrams
├── python_node_linking_strategy.md # Detailed linking strategy
└── README.md                       # This file
```

## Key Features

### 🐍 **Python Node Support**

- Create Python nodes with custom code
- Select Python versions (3.8, 3.9, 3.10, 3.11, 3.12)
- Install dependencies with progress reporting
- Execute code in isolated Docker containers

### 🔗 **Type-Based Node Linking**

- Strict type compatibility validation
- Visual feedback for compatible/incompatible connections
- Type conversion system for compatible types
- Custom type definitions and validation

### 🚀 **Workflow Execution**

- Multi-node Python workflows
- Parallel execution capabilities
- Real-time execution monitoring
- Error handling and recovery

### 📊 **Advanced Features**

- Graph plot display for data visualization
- Container resource monitoring
- Performance optimization
- Security isolation

## Development Status

### ✅ **Completed**

- **Architecture Design**: Complete system architecture and documentation
- **Frontend Isolation**: Standalone frontend with mock API
- **API Documentation**: Comprehensive endpoint specifications
- **Database Schema**: Complete PostgreSQL schema design
- **Monitoring Setup**: Observability and monitoring strategy

### 🚧 **In Progress**

- **Frontend Development**: Python node editor and type system UI
- **Backend Implementation**: FastAPI backend with Python execution engine

### 📋 **Planned**

- **Container Management**: Docker container lifecycle management
- **Type System**: Python type validation and conversion
- **Execution Engine**: Workflow orchestration and monitoring
- **Testing**: Comprehensive test suite

## Getting Started

### Frontend Development

```bash
cd qflow-frontend
pnpm install
pnpm dev
# Access at http://localhost:8080
```

### Backend Development

```bash
cd qflow-backend
# Backend implementation to be added
```

## Architecture

### Frontend (Vue.js + TypeScript)

- **Editor UI**: Drag-and-drop workflow editor
- **Python Node Editor**: Code editor with syntax highlighting
- **Type System UI**: Type validation and compatibility
- **Execution Monitor**: Real-time workflow monitoring

### Backend (FastAPI + Python)

- **API Layer**: RESTful API with WebSocket support
- **Execution Engine**: Python code execution in containers
- **Container Management**: Docker container lifecycle
- **Type System**: Python type validation and conversion

### Data Layer

- **PostgreSQL**: Primary database for workflows and metadata
- **Redis**: Caching and session management
- **File Storage**: Large data and file storage

## Technology Stack

### Frontend

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Element Plus** for UI components
- **Pinia** for state management
- **Vue Router** for navigation
- **CodeMirror 6** for code editing

### Backend

- **FastAPI** for API framework
- **SQLAlchemy** for database ORM
- **Docker** for containerization
- **Redis** for caching
- **PostgreSQL** for data storage

### Infrastructure

- **Docker** for container management
- **Prometheus** for metrics
- **Grafana** for visualization
- **ELK Stack** for logging

## Development Phases

### Phase 1: Foundation ✅

- [x] Architecture design and documentation
- [x] Frontend isolation and mock API
- [x] Database schema design
- [x] API endpoint specifications

### Phase 2: Frontend Integration 🚧

- [ ] Python node editor implementation
- [ ] Type system UI components
- [ ] Workflow execution monitoring
- [ ] Container management interface

### Phase 3: Backend Implementation 📋

- [ ] FastAPI backend setup
- [ ] Database implementation
- [ ] Python execution engine
- [ ] Container management system

### Phase 4: Advanced Features 📋

- [ ] Type validation and conversion
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Comprehensive testing

## Contributing

### Frontend Team

- Focus on Python node editor development
- Implement type system UI components
- Add workflow execution monitoring
- Enhance user experience

### Backend Team

- Implement FastAPI backend
- Create Python execution engine
- Set up container management
- Implement type validation system

## Documentation

- **Architecture**: `architecture/` - Complete system design
- **API**: `qflow-frontend/API_ENDPOINTS.md` - API specifications
- **Database**: `architecture/database_schema_design.md` - Schema design
- **Monitoring**: `architecture/monitoring_and_observability.md` - Observability setup

## License

This project is based on n8n (original license in `n8n_backup/`) and has been modified for Qflow's Python-first workflow orchestration platform.

---

**Qflow** - Empowering Python developers with visual workflow orchestration.
