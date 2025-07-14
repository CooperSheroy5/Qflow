# Qflow API Endpoints Documentation

## Overview

This document lists all API endpoints used by the n8n frontend that need to be implemented in the Qflow backend. The endpoints are categorized by functionality and include request/response formats.

## Authentication Endpoints

### User Management
- `GET /me` - Get current user information
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /users` - Get all users (admin only)
- `POST /users` - Create new user
- `GET /users/:id` - Get specific user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Session Management
- `GET /session` - Get current session
- `POST /session` - Create new session
- `DELETE /session` - End current session

## Workflow Management

### Workflow CRUD Operations
- `GET /workflows` - Get all workflows
- `POST /workflows` - Create new workflow
- `GET /workflows/:id` - Get specific workflow
- `PATCH /workflows/:id` - Update workflow
- `DELETE /workflows/:id` - Delete workflow
- `GET /workflows/new` - Get new workflow template

### Workflow Execution
- `POST /workflows/:id/activate` - Activate workflow
- `POST /workflows/:id/deactivate` - Deactivate workflow
- `GET /active-workflows` - Get all active workflows
- `POST /workflows/:id/execute` - Execute workflow manually

### Workflow Folders
- `GET /projects/:projectId/folders` - Get project folders
- `POST /projects/:projectId/folders` - Create folder
- `GET /projects/:projectId/folders/:folderId` - Get specific folder
- `PATCH /projects/:projectId/folders/:folderId` - Update folder
- `DELETE /projects/:projectId/folders/:folderId` - Delete folder
- `GET /projects/:projectId/folders/:folderId/tree` - Get folder tree
- `GET /projects/:projectId/folders/:folderId/content` - Get folder content
- `GET /projects/:projectId/folders/:folderId/credentials` - Get folder credentials

## Execution Management

### Execution Tracking
- `GET /executions` - Get all executions
- `GET /executions/:id` - Get specific execution
- `GET /executions/:id/data` - Get execution data
- `DELETE /executions/:id` - Delete execution

### Active Executions
- `GET /executions/active` - Get active executions
- `POST /executions/:id/stop` - Stop execution

## Credentials Management

### Credentials CRUD
- `GET /credentials` - Get all credentials
- `POST /credentials` - Create new credential
- `GET /credentials/:id` - Get specific credential
- `PATCH /credentials/:id` - Update credential
- `DELETE /credentials/:id` - Delete credential

### Credential Types
- `GET /credentials/types` - Get available credential types
- `GET /credentials/types/:type` - Get specific credential type

## Node Management

### Node Types
- `GET /nodes` - Get all available nodes
- `GET /nodes/:type` - Get specific node type
- `GET /nodes/:type/description` - Get node description

### Node Execution (Python Nodes for Qflow)
- `POST /nodes/python/validate` - Validate Python code
- `POST /nodes/python/execute` - Execute Python node
- `GET /nodes/python/types` - Get Python type definitions
- `POST /nodes/python/types/validate` - Validate type compatibility

## Type System (Qflow Specific)

### Type Management
- `GET /types` - Get all type definitions
- `POST /types` - Create custom type
- `GET /types/:id` - Get specific type
- `PATCH /types/:id` - Update type
- `DELETE /types/:id` - Delete type

### Type Compatibility
- `GET /types/compatibility` - Get type compatibility matrix
- `POST /types/compatibility/check` - Check type compatibility
- `POST /types/conversion` - Convert between types

## Container Management (Qflow Specific)

### Container Operations
- `GET /containers` - Get all containers
- `POST /containers` - Create new container
- `GET /containers/:id` - Get container status
- `DELETE /containers/:id` - Stop and remove container

### Container Resources
- `GET /containers/:id/resources` - Get container resource usage
- `GET /containers/:id/logs` - Get container logs

### Python Dependencies
- `POST /containers/:id/dependencies` - Install dependencies
- `GET /containers/:id/dependencies` - Get installed dependencies
- `DELETE /containers/:id/dependencies/:package` - Remove dependency

## File Management

### File Operations
- `POST /files/upload` - Upload file
- `GET /files/:id` - Download file
- `DELETE /files/:id` - Delete file
- `GET /files/:id/metadata` - Get file metadata

## Settings and Configuration

### System Settings
- `GET /settings` - Get system settings
- `PATCH /settings` - Update system settings

### User Settings
- `GET /users/:id/settings` - Get user settings
- `PATCH /users/:id/settings` - Update user settings

## Webhooks

### Webhook Management
- `GET /webhooks` - Get all webhooks
- `POST /webhooks` - Create webhook
- `GET /webhooks/:id` - Get specific webhook
- `DELETE /webhooks/:id` - Delete webhook

## AI and Templates

### AI Services
- `POST /ai/generate` - Generate workflow with AI
- `POST /ai/explain` - Explain workflow
- `POST /ai/optimize` - Optimize workflow

### Templates
- `GET /templates` - Get available templates
- `GET /templates/:id` - Get specific template
- `POST /templates/:id/import` - Import template

## Usage and Analytics

### Usage Statistics
- `GET /usage` - Get usage statistics
- `GET /usage/workflows` - Get workflow usage
- `GET /usage/executions` - Get execution usage

### Analytics
- `GET /analytics/performance` - Get performance analytics
- `GET /analytics/errors` - Get error analytics

## Health and Status

### System Health
- `GET /health` - System health check
- `GET /health/database` - Database health
- `GET /health/redis` - Redis health
- `GET /health/containers` - Container health

## Detailed Endpoint Specifications

### Workflow Endpoints

#### GET /workflows
**Purpose**: Retrieve all workflows
**Parameters**:
- `filter` (object): Filter criteria
- `options` (object): Pagination and sorting options
- `includeScopes` (boolean): Include permission scopes
- `includeFolders` (boolean): Include folder information
- `onlySharedWithMe` (boolean): Only workflows shared with current user

**Response**:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "nodes": [],
      "connections": {},
      "settings": {},
      "active": boolean,
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "count": number
}
```

#### POST /workflows
**Purpose**: Create new workflow
**Request Body**:
```json
{
  "name": "string",
  "description": "string",
  "nodes": [],
  "connections": {},
  "settings": {},
  "python_version": "string"
}
```

#### GET /workflows/:id
**Purpose**: Get specific workflow
**Response**:
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "nodes": [],
  "connections": {},
  "settings": {},
  "active": boolean,
  "python_version": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Execution Endpoints

#### GET /executions
**Purpose**: Get workflow executions
**Parameters**:
- `filter` (object): Execution filters
- `options` (object): Pagination options

**Response**:
```json
{
  "count": number,
  "results": [
    {
      "id": "string",
      "workflowId": "string",
      "status": "string",
      "startedAt": "datetime",
      "completedAt": "datetime",
      "duration": number
    }
  ],
  "estimated": boolean
}
```

#### GET /executions/:id
**Purpose**: Get specific execution
**Response**:
```json
{
  "id": "string",
  "workflowId": "string",
  "status": "string",
  "startedAt": "datetime",
  "completedAt": "datetime",
  "duration": number,
  "data": {},
  "error": "string"
}
```

### Python Node Endpoints (Qflow Specific)

#### POST /nodes/python/validate
**Purpose**: Validate Python code
**Request Body**:
```json
{
  "code": "string",
  "python_version": "string",
  "dependencies": ["string"]
}
```

**Response**:
```json
{
  "valid": boolean,
  "errors": ["string"],
  "warnings": ["string"],
  "functions": ["string"],
  "suggested_types": {}
}
```

#### POST /nodes/python/execute
**Purpose**: Execute Python node
**Request Body**:
```json
{
  "code": "string",
  "function": "string",
  "input_data": {},
  "python_version": "string"
}
```

**Response**:
```json
{
  "success": boolean,
  "output": {},
  "execution_time": number,
  "error": "string"
}
```

### Type System Endpoints (Qflow Specific)

#### GET /types
**Purpose**: Get all type definitions
**Response**:
```json
{
  "types": [
    {
      "id": "string",
      "name": "string",
      "category": "string",
      "python_type": "string",
      "description": "string",
      "is_builtin": boolean
    }
  ]
}
```

#### POST /types/compatibility/check
**Purpose**: Check type compatibility
**Request Body**:
```json
{
  "source_type": "string",
  "target_type": "string"
}
```

**Response**:
```json
{
  "compatible": boolean,
  "conversion_required": boolean,
  "conversion_method": "string"
}
```

### Container Endpoints (Qflow Specific)

#### GET /containers
**Purpose**: Get all containers
**Response**:
```json
{
  "containers": [
    {
      "id": "string",
      "python_version": "string",
      "status": "string",
      "created_at": "datetime",
      "resource_usage": {
        "cpu_percent": number,
        "memory_bytes": number
      }
    }
  ]
}
```

#### POST /containers/:id/dependencies
**Purpose**: Install Python dependencies
**Request Body**:
```json
{
  "packages": ["string"],
  "requirements_file": "string"
}
```

**Response**:
```json
{
  "success": boolean,
  "installed_packages": ["string"],
  "failed_packages": ["string"],
  "installation_time": number
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": {
    "message": "string",
    "code": "string",
    "details": {}
  }
}
```

## Authentication

Most endpoints require authentication via:
- Session cookies
- JWT tokens in Authorization header
- API keys for specific endpoints

## Rate Limiting

- Standard endpoints: 1000 requests/hour
- Execution endpoints: 100 requests/hour
- Container operations: 50 requests/hour

## WebSocket Endpoints

For real-time updates:
- `WS /ws/executions` - Execution progress updates
- `WS /ws/containers` - Container status updates
- `WS /ws/workflows` - Workflow changes

This documentation provides the complete API specification needed to implement the Qflow backend that will work with the isolated frontend. 