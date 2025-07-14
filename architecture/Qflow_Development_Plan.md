# Qflow Development Plan

## Implementation Strategy

### Phase 1: Foundation Setup (Weeks 1-2)

#### 1.1 Repository Structure Setup
```
qflow/
├── frontend/                    # n8n editor-ui fork
│   ├── src/
│   │   ├── components/
│   │   │   ├── PythonNode/     # New Python node components
│   │   │   ├── PythonEditor/   # Code editor for Python
│   │   │   └── TypeSelector/   # Type definition interface
│   │   ├── stores/
│   │   │   ├── pythonNodes.ts  # Python node state management
│   │   │   └── workflows.ts    # Workflow state management
│   │   └── composables/
│   │       └── pythonExecution.ts
├── backend/                     # Python FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   │   ├── nodes.py        # Node management endpoints
│   │   │   ├── workflows.py    # Workflow execution endpoints
│   │   │   └── python.py       # Python execution endpoints
│   │   ├── core/
│   │   │   ├── execution.py    # Python execution engine
│   │   │   ├── containers.py   # Docker container management
│   │   │   └── dependencies.py # Library management
│   │   ├── models/
│   │   │   ├── node.py         # Node data models
│   │   │   ├── workflow.py     # Workflow data models
│   │   │   └── execution.py    # Execution data models
│   │   └── services/
│   │       ├── python_service.py
│   │       ├── container_service.py
│   │       └── workflow_service.py
├── docker/
│   ├── python-environments/    # Python version images
│   └── docker-compose.yml
└── docs/
```

#### 1.2 Core Backend Services

**Python Execution Service**
```python
# backend/app/services/python_service.py
class PythonExecutionService:
    def __init__(self):
        self.container_service = ContainerService()
        self.dependency_service = DependencyService()
    
    async def execute_node(self, node_code: str, inputs: dict, python_version: str) -> dict:
        # Create isolated container
        # Install dependencies
        # Execute Python code
        # Return results
```

**Container Management Service**
```python
# backend/app/services/container_service.py
class ContainerService:
    def create_python_container(self, version: str) -> str:
        # Create Docker container with specified Python version
    
    def install_dependencies(self, container_id: str, requirements: list) -> bool:
        # Install pip packages in container
    
    def execute_code(self, container_id: str, code: str, inputs: dict) -> dict:
        # Execute Python code in container
```

**Dependency Management Service**
```python
# backend/app/services/dependency_service.py
class DependencyService:
    def extract_imports(self, code: str) -> list:
        # Parse Python code and extract import statements
    
    def resolve_dependencies(self, imports: list) -> list:
        # Convert imports to pip requirements
    
    def install_packages(self, requirements: list, container_id: str) -> bool:
        # Install packages in container
```

### Phase 2: Frontend Integration (Weeks 3-4)

#### 2.1 Python Node Components

**Python Node Editor**
```typescript
// frontend/src/components/PythonNode/PythonNodeEditor.vue
export default {
  name: 'PythonNodeEditor',
  components: {
    CodeMirror,
    TypeSelector,
    FunctionSelector
  },
  data() {
    return {
      code: '',
      selectedFunction: '',
      inputTypes: {},
      outputTypes: {}
    }
  },
  methods: {
    async testNode() {
      // Send code to backend for testing
    },
    async saveNode() {
      // Save node with metadata
    }
  }
}
```

**Type Inference System**
```typescript
// frontend/src/composables/useTypeInference.ts
export function useTypeInference() {
  const inferTypes = (code: string, functionName: string) => {
    // Parse Python code and extract type hints
    // Return input/output type definitions
  }
  
  return { inferTypes }
}
```

#### 2.2 Workflow Integration

**Python Node Integration**
```typescript
// frontend/src/stores/pythonNodes.ts
export const usePythonNodesStore = defineStore('pythonNodes', {
  state: () => ({
    customNodes: [],
    nodeTemplates: [],
    executionStatus: {}
  }),
  actions: {
    async createPythonNode(nodeData) {
      // Create new Python node
    },
    async executePythonNode(nodeId, inputs) {
      // Execute Python node
    }
  }
})
```

### Phase 3: Execution Engine (Weeks 5-6)

#### 3.1 Python Runtime Integration

**Code Execution Pipeline**
```python
# backend/app/core/execution.py
class PythonExecutionEngine:
    def __init__(self):
        self.container_service = ContainerService()
        self.type_checker = TypeChecker()
    
    async def execute_workflow(self, workflow_data: dict) -> dict:
        # Execute workflow with Python nodes
        # Handle data flow between nodes
        # Manage execution state
    
    async def execute_node(self, node_data: dict, inputs: dict) -> dict:
        # Execute single Python node
        # Validate inputs/outputs
        # Handle errors
```

**Type System**
```python
# backend/app/core/type_system.py
class TypeChecker:
    def validate_inputs(self, inputs: dict, expected_types: dict) -> bool:
        # Validate input data types
    
    def validate_outputs(self, outputs: dict, expected_types: dict) -> bool:
        # Validate output data types
    
    def infer_types(self, code: str, function_name: str) -> dict:
        # Infer types from Python code
```

### Phase 4: Advanced Features (Weeks 7-8)

#### 4.1 Library Management

**Dependency Resolution**
```python
# backend/app/core/dependencies.py
class DependencyManager:
    def __init__(self):
        self.pip_client = PipClient()
    
    async def install_requirements(self, requirements: list, container_id: str) -> bool:
        # Install packages with progress tracking
    
    async def resolve_conflicts(self, requirements: list) -> list:
        # Resolve version conflicts
    
    async def create_requirements_file(self, imports: list) -> str:
        # Generate requirements.txt
```

#### 4.2 Workflow Orchestration

**Workflow Execution Service**
```python
# backend/app/services/workflow_service.py
class WorkflowService:
    def __init__(self):
        self.python_engine = PythonExecutionEngine()
        self.container_service = ContainerService()
    
    async def create_workflow(self, workflow_data: dict) -> str:
        # Create new workflow
    
    async def execute_workflow(self, workflow_id: str, inputs: dict) -> dict:
        # Execute complete workflow
        # Handle node connections
        # Manage execution flow
```

## Architectural Decisions (Final)

### 1. Data Flow Between Nodes ✅ **DECIDED: Option C**

**Decision**: Hybrid approach with type-specific serialization

**Implementation**:
- **JSON serialization** for simple data types (strings, numbers, booleans, basic lists/dicts)
- **Pickle serialization** for complex Python objects (custom classes, numpy arrays, pandas DataFrames)
- **File storage** for large datasets (images, videos, large files)
- **Type-aware conversion** between Python and n8n formats

**Benefits**:
- Optimal performance for different data types
- Preserves Python object integrity
- Handles large datasets efficiently
- Maintains type safety

### 2. Python Environment Management ✅ **DECIDED: Option A**

**Decision**: One container per workflow (shared environment)

**Implementation**:
- **Shared container** for all nodes in a workflow
- **Isolated environments** per workflow execution
- **Base image pooling** for common Python versions
- **Node-specific layers** for unique dependencies

**Benefits**:
- Better performance with shared dependencies
- Reduced resource overhead
- Faster workflow execution
- Simplified container management

### 3. Type System Integration ✅ **APPROVED**

**Decision**: Implement comprehensive type conversion system

**Implementation**:
```python
# Type conversion system
class TypeConverter:
    def python_to_n8n(self, python_data: Any) -> dict:
        # Convert Python types to n8n compatible format
        if isinstance(python_data, (str, int, float, bool)):
            return {"type": "simple", "value": python_data}
        elif isinstance(python_data, (list, dict)):
            return {"type": "json", "value": json.dumps(python_data)}
        else:
            return {"type": "pickle", "value": pickle.dumps(python_data)}
    
    def n8n_to_python(self, n8n_data: dict, expected_type: type) -> Any:
        # Convert n8n data to Python types
        data_type = n8n_data.get("type")
        value = n8n_data.get("value")
        
        if data_type == "simple":
            return value
        elif data_type == "json":
            return json.loads(value)
        elif data_type == "pickle":
            return pickle.loads(value)
        else:
            return value
```

**Benefits**:
- Seamless data flow between Python and n8n nodes
- Type safety maintained throughout
- Efficient serialization/deserialization
- Support for complex Python objects

### 4. Error Handling Strategy ✅ **APPROVED**

**Decision**: Comprehensive error handling with recovery mechanisms

**Implementation**:
- **Exception Capture**: Convert Python exceptions to n8n error format
- **Stack Traces**: Provide detailed stack traces in the UI
- **Error Recovery**: Allow retry mechanisms and error recovery
- **Graceful Degradation**: Continue workflow execution when possible

**Features**:
- Real-time error display in workflow canvas
- Detailed error logs with stack traces
- Retry buttons for failed nodes
- Error categorization (network, code, resource, etc.)
- Automatic error reporting and analytics

### 5. Performance Optimization ✅ **APPROVED**

**Decision**: Multi-layered performance optimization strategy

**Implementation**:
- **Container Pooling**: Reuse containers for frequently used Python versions
- **Code Compilation**: Compile and cache Python code for faster execution
- **Parallel Execution**: Run independent nodes concurrently
- **Resource Monitoring**: Real-time monitoring of CPU, memory, and time limits

**Optimizations**:
- Pre-warmed containers for common Python versions
- JIT compilation for frequently executed code
- Intelligent parallelization based on dependency graph
- Resource usage tracking and optimization
- Caching of intermediate results

### 6. Security Considerations ✅ **APPROVED**

**Decision**: Multi-layered security approach

**Implementation**:
- **Docker Container Isolation**: Complete sandboxing of Python code execution
- **Resource Limits**: Strict CPU, memory, and time restrictions
- **Code Analysis**: Static analysis for dangerous operations
- **Import Whitelist/Blacklist**: Control which libraries can be imported

**Security Measures**:
- Container isolation with no network access by default
- Resource limits: CPU (50%), Memory (512MB), Time (30s per node)
- Code scanning for dangerous operations (file system access, network calls)
- Whitelist of safe libraries, blacklist of dangerous ones
- Real-time monitoring of resource usage
- Automatic termination of runaway processes

## Implementation Timeline

### Week 1-2: Foundation
- [ ] Set up repository structure
- [ ] Implement basic Python execution service
- [ ] Create Docker container management
- [ ] Set up FastAPI backend

### Week 3-4: Frontend Integration
- [ ] Create Python node components
- [ ] Implement code editor integration
- [ ] Add type inference system
- [ ] Integrate with n8n workflow editor

### Week 5-6: Execution Engine
- [ ] Implement Python runtime integration
- [ ] Create type system
- [ ] Add error handling
- [ ] Implement data flow between nodes

### Week 7-8: Advanced Features
- [ ] Add library management
- [ ] Implement workflow orchestration
- [ ] Add performance optimizations
- [ ] Create testing framework

### Week 9-10: Testing and Polish
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Documentation completion

## Technical Requirements

### Backend Requirements
```python
# requirements.txt
fastapi==0.104.1
uvicorn==0.24.0
celery==5.3.4
redis==5.0.1
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
docker==6.1.3
pydantic==2.5.0
python-multipart==0.0.6
```

### Frontend Requirements
```json
// package.json additions
{
  "dependencies": {
    "@codemirror/lang-python": "^6.2.2",
    "@codemirror/state": "^6.4.1",
    "@codemirror/view": "^6.26.3"
  }
}
```

### Docker Requirements
```dockerfile
# docker/python-environments/Dockerfile.python-3.10
FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

CMD ["python"]
```

## Next Steps

1. **Confirm Architecture Decisions**: Review and approve the proposed architecture
2. **Set Up Development Environment**: Create the initial repository structure
3. **Implement Core Services**: Start with Python execution and container management
4. **Create Frontend Components**: Build the Python node editor interface
5. **Integration Testing**: Test the complete workflow from frontend to backend

## Questions for Clarification

1. **Node Compatibility**: Should Python nodes be able to connect to all n8n node types, or only specific ones?

2. **Data Types**: What data types should be supported for input/output between nodes?

3. **Performance Requirements**: What are the expected performance requirements for Python execution?

4. **Security Level**: What level of code isolation is required for user-provided Python code?

5. **Deployment**: Should this be deployable as a single application or microservices?

6. **Scaling**: How should the system scale for multiple concurrent workflows?

Please provide feedback on these questions and the proposed architecture to proceed with implementation. 