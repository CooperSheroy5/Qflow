# Qflow Backend

## Overview

This directory will contain the Qflow backend implementation using FastAPI and Python. The backend will handle Python node execution, container management, type validation, and workflow orchestration.

## Architecture

### Core Components

- **FastAPI Application**: RESTful API with WebSocket support
- **Python Execution Engine**: Code execution in isolated containers
- **Container Management**: Docker container lifecycle management
- **Type System**: Python type validation and conversion
- **Database Layer**: PostgreSQL with SQLAlchemy ORM
- **Cache Layer**: Redis for session and data caching

### Key Features

- 🐍 **Python Node Execution**: Execute Python code in isolated containers
- 🔗 **Type Validation**: Validate type compatibility between nodes
- 🚀 **Workflow Orchestration**: Manage multi-node workflow execution
- 📊 **Real-time Monitoring**: WebSocket-based execution monitoring
- 🔐 **Security**: Container isolation and resource limits

## API Endpoints

All API endpoints are documented in `../qflow-frontend/API_ENDPOINTS.md`. Key endpoint categories:

### Workflow Management

- `GET /workflows` - List workflows
- `POST /workflows` - Create workflow
- `GET /workflows/:id` - Get workflow
- `PATCH /workflows/:id` - Update workflow
- `DELETE /workflows/:id` - Delete workflow

### Python Node Execution

- `POST /nodes/python/validate` - Validate Python code
- `POST /nodes/python/execute` - Execute Python node
- `GET /types` - Get type definitions
- `POST /types/compatibility/check` - Check type compatibility

### Container Management

- `GET /containers` - List containers
- `POST /containers/:id/dependencies` - Install dependencies
- `GET /containers/:id/resources` - Get resource usage

## Database Schema

The complete database schema is documented in `../architecture/database_schema_design.md`. Key tables:

- **workflows**: Workflow definitions and metadata
- **python_nodes**: Python node configurations
- **workflow_executions**: Execution tracking and results
- **node_executions**: Individual node execution data
- **type_definitions**: Type system and compatibility
- **containers**: Docker container management

## Technology Stack

### Core Framework

- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **Alembic**: Database migrations
- **Pydantic**: Data validation

### Container & Execution

- **Docker**: Container management
- **docker-py**: Python Docker client
- **asyncio**: Asynchronous execution

### Database & Cache

- **PostgreSQL**: Primary database
- **Redis**: Caching and sessions
- **psycopg2**: PostgreSQL adapter

### Monitoring & Logging

- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **ELK Stack**: Logging

## Development Setup

### Prerequisites

- Python 3.11+
- Docker and Docker Compose
- PostgreSQL 14+
- Redis 6+

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start the application
uvicorn app.main:app --reload
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost/qflow
REDIS_URL=redis://localhost:6379

# Docker
DOCKER_HOST=unix:///var/run/docker.sock
CONTAINER_MEMORY_LIMIT=1GB
CONTAINER_CPU_LIMIT=50%

# Security
SECRET_KEY=your-secret-key
JWT_SECRET=your-jwt-secret

# Monitoring
PROMETHEUS_ENABLED=true
GRAFANA_ENABLED=true
```

## Project Structure

```
qflow-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   ├── config.py               # Configuration settings
│   ├── database.py             # Database connection
│   ├── models/                 # SQLAlchemy models
│   ├── schemas/                # Pydantic schemas
│   ├── api/                    # API routes
│   ├── services/               # Business logic
│   ├── core/                   # Core functionality
│   └── utils/                  # Utility functions
├── alembic/                    # Database migrations
├── tests/                      # Test suite
├── docker/                     # Docker configuration
├── requirements.txt            # Python dependencies
├── requirements-dev.txt        # Development dependencies
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## Key Implementation Areas

### 1. **Python Execution Engine**

- Container creation and management
- Code validation and execution
- Dependency installation
- Resource monitoring

### 2. **Type System**

- Type definition and validation
- Compatibility checking
- Type conversion utilities
- Custom type support

### 3. **Workflow Orchestration**

- Multi-node execution
- Parallel processing
- Error handling and recovery
- Real-time monitoring

### 4. **API Implementation**

- RESTful endpoints
- WebSocket connections
- Authentication and authorization
- Rate limiting and security

## Testing

### Unit Tests

```bash
pytest tests/unit/
```

### Integration Tests

```bash
pytest tests/integration/
```

### API Tests

```bash
pytest tests/api/
```

## Deployment

### Docker Compose

```bash
docker-compose up -d
```

### Production

```bash
# Build image
docker build -t qflow-backend .

# Run container
docker run -p 8000:8000 qflow-backend
```

## Monitoring

### Health Checks

- `GET /health` - Application health
- `GET /health/database` - Database health
- `GET /health/redis` - Redis health
- `GET /health/containers` - Container health

### Metrics

- Prometheus metrics at `/metrics`
- Custom metrics for execution times
- Container resource usage
- API performance metrics

## Next Steps

1. **Set up FastAPI application structure**
2. **Implement database models and migrations**
3. **Create Python execution engine**
4. **Add container management system**
5. **Implement type validation system**
6. **Add authentication and security**
7. **Set up monitoring and logging**
8. **Write comprehensive tests**

## Resources

- **API Documentation**: `../qflow-frontend/API_ENDPOINTS.md`
- **Database Schema**: `../architecture/database_schema_design.md`
- **Monitoring Setup**: `../architecture/monitoring_and_observability.md`
- **Architecture Overview**: `../architecture/Qflow_Architecture.md`

---

**Ready to build the Python-first workflow orchestration backend!**
