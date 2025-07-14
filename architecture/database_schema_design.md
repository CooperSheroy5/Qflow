# Qflow Database Schema Design

## Overview

This document defines the complete database schema for Qflow, a Python-first workflow orchestration platform. The schema supports Python node creation, workflow execution, type validation, container management, and comprehensive execution tracking.

## Database Technology

- **Primary Database**: PostgreSQL 14+
- **Cache Layer**: Redis 6+
- **File Storage**: Local filesystem with metadata in PostgreSQL

## Core Schema Design

### 1. Users and Authentication

```sql
-- Users table (inherited from n8n)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    is_owner BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Python Nodes

```sql
-- Python node definitions
CREATE TABLE python_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    code TEXT NOT NULL,
    main_function VARCHAR(255) NOT NULL,
    python_version VARCHAR(10) NOT NULL, -- e.g., '3.10', '3.11'
    dependencies JSONB, -- Extracted pip requirements
    input_types JSONB NOT NULL, -- Type definitions for inputs
    output_types JSONB NOT NULL, -- Type definitions for outputs
    is_template BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1
);

-- Python node versions (for version control)
CREATE TABLE python_node_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID REFERENCES python_nodes(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    code TEXT NOT NULL,
    main_function VARCHAR(255) NOT NULL,
    input_types JSONB NOT NULL,
    output_types JSONB NOT NULL,
    dependencies JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(node_id, version)
);

-- Python node tags for organization
CREATE TABLE python_node_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Many-to-many relationship between nodes and tags
CREATE TABLE python_node_tag_relations (
    node_id UUID REFERENCES python_nodes(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES python_node_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (node_id, tag_id)
);
```

### 3. Workflows

```sql
-- Workflow definitions
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    nodes JSONB NOT NULL, -- Array of node configurations
    connections JSONB NOT NULL, -- Array of connection definitions
    settings JSONB, -- Workflow-specific settings
    python_version VARCHAR(10) NOT NULL, -- Default Python version
    is_active BOOLEAN DEFAULT TRUE,
    is_template BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1
);

-- Workflow versions
CREATE TABLE workflow_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    nodes JSONB NOT NULL,
    connections JSONB NOT NULL,
    settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workflow_id, version)
);

-- Workflow tags
CREATE TABLE workflow_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE workflow_tag_relations (
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES workflow_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (workflow_id, tag_id)
);
```

### 4. Workflow Executions

```sql
-- Workflow execution instances
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL, -- 'running', 'completed', 'failed', 'cancelled'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER, -- Execution duration in milliseconds
    input_data JSONB, -- Input data for the workflow
    output_data JSONB, -- Final output data
    error_message TEXT,
    error_stack_trace TEXT,
    container_id VARCHAR(255), -- Docker container ID
    python_version VARCHAR(10),
    resource_usage JSONB, -- CPU, memory usage
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Node execution instances within workflows
CREATE TABLE node_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE,
    node_id VARCHAR(255) NOT NULL, -- Node ID within the workflow
    node_type VARCHAR(50) NOT NULL, -- 'python', 'builtin', etc.
    status VARCHAR(50) NOT NULL, -- 'pending', 'running', 'completed', 'failed'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    error_stack_trace TEXT,
    execution_order INTEGER, -- Order of execution in the workflow
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3
);

-- Data flow between nodes
CREATE TABLE node_data_flow (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE,
    source_node_id VARCHAR(255) NOT NULL,
    target_node_id VARCHAR(255) NOT NULL,
    data_type VARCHAR(50) NOT NULL, -- 'json', 'pickle', 'file'
    data_size_bytes INTEGER,
    serialization_time_ms INTEGER,
    transfer_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Type System

```sql
-- Type definitions
CREATE TABLE type_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'basic', 'collection', 'special'
    python_type VARCHAR(100),
    description TEXT,
    is_builtin BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Type compatibility matrix
CREATE TABLE type_compatibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type_id UUID REFERENCES type_definitions(id) ON DELETE CASCADE,
    target_type_id UUID REFERENCES type_definitions(id) ON DELETE CASCADE,
    is_compatible BOOLEAN NOT NULL,
    conversion_required BOOLEAN DEFAULT FALSE,
    conversion_method VARCHAR(255), -- e.g., 'int()', 'str()'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_type_id, target_type_id)
);

-- Custom type definitions for users
CREATE TABLE custom_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    definition JSONB NOT NULL, -- Type structure definition
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, created_by)
);
```

### 6. Container Management

```sql
-- Container instances
CREATE TABLE containers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    container_id VARCHAR(255) UNIQUE NOT NULL, -- Docker container ID
    python_version VARCHAR(10) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'running', 'stopped', 'error'
    workflow_execution_id UUID REFERENCES workflow_executions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    stopped_at TIMESTAMP WITH TIME ZONE,
    resource_limits JSONB, -- CPU, memory limits
    resource_usage JSONB -- Current usage
);

-- Container dependencies
CREATE TABLE container_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    container_id UUID REFERENCES containers(id) ON DELETE CASCADE,
    package_name VARCHAR(255) NOT NULL,
    version VARCHAR(100),
    installation_status VARCHAR(50), -- 'pending', 'installing', 'completed', 'failed'
    installation_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. File Storage

```sql
-- File metadata
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100),
    hash_sha256 VARCHAR(64),
    workflow_execution_id UUID REFERENCES workflow_executions(id),
    node_execution_id UUID REFERENCES node_executions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- For temporary files
    is_temporary BOOLEAN DEFAULT FALSE
);

-- File access logs
CREATE TABLE file_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    access_type VARCHAR(50) NOT NULL, -- 'read', 'write', 'delete'
    accessed_by UUID REFERENCES users(id),
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. Monitoring and Analytics

```sql
-- Performance metrics
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10, 4) NOT NULL,
    metric_unit VARCHAR(20), -- 'ms', 'bytes', 'count'
    workflow_execution_id UUID REFERENCES workflow_executions(id),
    node_execution_id UUID REFERENCES node_executions(id),
    container_id UUID REFERENCES containers(id),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error logs
CREATE TABLE error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_type VARCHAR(100) NOT NULL, -- 'type_error', 'runtime_error', 'container_error'
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    workflow_execution_id UUID REFERENCES workflow_executions(id),
    node_execution_id UUID REFERENCES node_executions(id),
    container_id UUID REFERENCES containers(id),
    severity VARCHAR(20) DEFAULT 'error', -- 'info', 'warning', 'error', 'critical'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System health metrics
CREATE TABLE system_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cpu_usage_percent DECIMAL(5, 2),
    memory_usage_percent DECIMAL(5, 2),
    disk_usage_percent DECIMAL(5, 2),
    active_containers INTEGER,
    active_workflows INTEGER,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Indexes for Performance

```sql
-- Performance indexes
CREATE INDEX idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX idx_workflow_executions_created_at ON workflow_executions(created_at);
CREATE INDEX idx_workflow_executions_created_by ON workflow_executions(created_by);

CREATE INDEX idx_node_executions_workflow_execution_id ON node_executions(workflow_execution_id);
CREATE INDEX idx_node_executions_status ON node_executions(status);
CREATE INDEX idx_node_executions_node_id ON node_executions(node_id);

CREATE INDEX idx_python_nodes_created_by ON python_nodes(created_by);
CREATE INDEX idx_python_nodes_python_version ON python_nodes(python_version);
CREATE INDEX idx_python_nodes_is_template ON python_nodes(is_template);

CREATE INDEX idx_containers_status ON containers(status);
CREATE INDEX idx_containers_python_version ON containers(python_version);

CREATE INDEX idx_files_workflow_execution_id ON files(workflow_execution_id);
CREATE INDEX idx_files_expires_at ON files(expires_at);

CREATE INDEX idx_performance_metrics_recorded_at ON performance_metrics(recorded_at);
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at);
CREATE INDEX idx_error_logs_severity ON error_logs(severity);

-- Composite indexes
CREATE INDEX idx_workflow_executions_status_created_at ON workflow_executions(status, created_at);
CREATE INDEX idx_node_executions_workflow_status ON node_executions(workflow_execution_id, status);
```

## Data Retention Policies

```sql
-- Cleanup policies for temporary data
CREATE OR REPLACE FUNCTION cleanup_temporary_files()
RETURNS void AS $$
BEGIN
    DELETE FROM files 
    WHERE is_temporary = TRUE 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Cleanup old execution logs (keep for 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_executions()
RETURNS void AS $$
BEGIN
    DELETE FROM workflow_executions 
    WHERE created_at < NOW() - INTERVAL '30 days'
    AND status IN ('completed', 'failed', 'cancelled');
END;
$$ LANGUAGE plpgsql;

-- Cleanup old performance metrics (keep for 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_metrics()
RETURNS void AS $$
BEGIN
    DELETE FROM performance_metrics 
    WHERE recorded_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;
```

## Backup and Recovery

```sql
-- Backup configuration
-- Enable WAL archiving for point-in-time recovery
-- Configure automated backups with pg_dump
-- Set up replication for high availability

-- Example backup script
-- pg_dump -h localhost -U qflow_user -d qflow_db --format=custom --file=backup_$(date +%Y%m%d_%H%M%S).sql
```

## Security Considerations

```sql
-- Row Level Security (RLS) for multi-tenant support
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE python_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY workflow_access_policy ON workflows
    FOR ALL USING (created_by = current_user_id());

CREATE POLICY python_node_access_policy ON python_nodes
    FOR ALL USING (created_by = current_user_id() OR is_public = TRUE);

CREATE POLICY execution_access_policy ON workflow_executions
    FOR ALL USING (created_by = current_user_id());
```

## Migration Scripts

```sql
-- Example migration script
-- Version 1.0.0 to 1.1.0
BEGIN;

-- Add new columns
ALTER TABLE python_nodes ADD COLUMN IF NOT EXISTS dependencies JSONB;
ALTER TABLE workflow_executions ADD COLUMN IF NOT EXISTS resource_usage JSONB;

-- Update existing data
UPDATE python_nodes SET dependencies = '[]'::jsonb WHERE dependencies IS NULL;

COMMIT;
```

## Summary

This database schema provides:

1. **Complete Workflow Management**: Support for workflow creation, versioning, and execution
2. **Python Node System**: Full support for custom Python nodes with type definitions
3. **Execution Tracking**: Comprehensive tracking of workflow and node executions
4. **Type Safety**: Complete type system with compatibility matrix
5. **Container Management**: Docker container lifecycle tracking
6. **File Management**: Secure file storage with metadata
7. **Monitoring**: Performance metrics and error tracking
8. **Security**: Row-level security and user management
9. **Scalability**: Proper indexing and data retention policies

The schema is designed to support the full Qflow feature set while maintaining performance and data integrity. 