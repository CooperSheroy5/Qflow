# Qflow Architecture Documentation

This directory contains comprehensive documentation for the Qflow architecture, covering all aspects of the Python-first workflow orchestration platform.

## 📚 Documentation Index

### Core Architecture
- **[Qflow.md](./Qflow.md)** - Main project overview and core features
- **[Qflow_Architecture.md](./Qflow_Architecture.md)** - Complete system architecture with diagrams
- **[Qflow_Development_Plan.md](./Qflow_Development_Plan.md)** - Implementation strategy and roadmap

### Node System
- **[python_node_linking_strategy.md](./python_node_linking_strategy.md)** - How Python nodes are linked and communicate
- **[type_based_node_linking.md](./type_based_node_linking.md)** - Type-based node linking system with strict compatibility
- **[type_based_node_linking_diagram.md](./type_based_node_linking_diagram.md)** - Visual diagrams for type-based linking

### Visual Diagrams
- **[n8narc.svg](./n8narc.svg)** - n8n architecture reference diagram
- **[qflow_architecture_diagram.md](./qflow_architecture_diagram.md)** - Complete Qflow architecture diagrams

## 🎯 Key Features Documented

### Type Safety ✅ **IMPLEMENTED**
- **Strict Type Compatibility**: Only nodes with compatible data types can be connected
- **Type Hierarchy**: Support for type inheritance (e.g., `int` → `number`)
- **Visual Feedback**: Real-time indication of valid/invalid connections
- **Error Prevention**: Block invalid connections before execution

### Python Integration ✅ **DECIDED**
- **Native Python Execution**: Direct execution in isolated Docker containers
- **Library Management**: Automatic dependency resolution and installation
- **Version Control**: Support for multiple Python versions
- **Code Analysis**: Type inference and validation

### Data Flow Strategy ✅ **DECIDED: Hybrid Approach**
- **JSON Serialization**: For simple data types (strings, numbers, booleans, basic lists/dicts)
- **Pickle Serialization**: For complex Python objects (custom classes, numpy arrays, pandas DataFrames)
- **File Storage**: For large datasets (images, videos, large files)
- **Type-Aware Conversion**: Between Python and n8n formats

### Workflow Orchestration ✅ **APPROVED**
- **Visual Workflow Design**: Inherit n8n's powerful drag-and-drop interface
- **Real-time Monitoring**: Live execution status and progress tracking
- **Error Handling**: Comprehensive error capture and reporting
- **Performance Optimization**: Container pooling and parallel execution

## 🏗️ Architecture Components

### Frontend Layer (n8n-based)
- **Vue.js 3** with Composition API
- **Vue Flow** for workflow canvas
- **CodeMirror 6** for Python code editing
- **Element Plus** for UI components
- **Type-aware connection validation**

### Backend Layer (Python-First)
- **FastAPI** for REST API
- **Python Execution Service** for code execution
- **Container Management Service** for Docker isolation
- **Type Validation Service** for connection validation

### Data Layer
- **PostgreSQL** for workflow and execution storage
- **Redis** for caching and task queues
- **File Storage** for large datasets

### Python Environments
- **Docker Containers** for Python versions (3.8-3.12)
- **Library Management** with pip and requirements.txt
- **Isolated Execution** with resource limits

## 🔧 Implementation Strategy

### Phase 1: Foundation (Weeks 1-2)
- [ ] Repository structure setup
- [ ] Basic Python execution service
- [ ] Docker container management
- [ ] FastAPI backend setup

### Phase 2: Frontend Integration (Weeks 3-4)
- [ ] Python node components
- [ ] Type validation system
- [ ] Visual connection interface
- [ ] n8n workflow editor integration

### Phase 3: Execution Engine (Weeks 5-6)
- [ ] Python runtime integration
- [ ] Type system implementation
- [ ] Error handling
- [ ] Data flow between nodes

### Phase 4: Advanced Features (Weeks 7-8)
- [ ] Library management
- [ ] Workflow orchestration
- [ ] Performance optimizations
- [ ] Testing framework

## 🛡️ Security & Performance ✅ **FINAL DECISIONS**

### Security Measures
- **Container Isolation**: Complete sandboxing of Python code with no network access by default
- **Resource Limits**: CPU (50%), Memory (512MB), Time (30s per node)
- **Code Analysis**: Static analysis for dangerous operations (file system access, network calls)
- **Import Control**: Whitelist/blacklist for library imports
- **Real-time Monitoring**: Resource usage tracking and automatic termination

### Performance Optimizations
- **Container Pooling**: Reuse containers for frequently used Python versions
- **JIT Compilation**: Code compilation and caching for faster execution
- **Parallel Execution**: Run independent nodes concurrently
- **Caching Strategy**: Multi-level caching for intermediate results
- **Resource Optimization**: Intelligent resource allocation and monitoring

## ✅ **Final Architectural Decisions**

### Container Strategy
- **One container per workflow** (shared environment) for optimal performance
- **Isolated environments** per workflow execution for security
- **Base image pooling** for common Python versions

### Data Flow Strategy
- **Hybrid serialization approach**:
  - JSON for simple data types
  - Pickle for complex Python objects
  - File storage for large datasets
- **Type-aware conversion** between Python and n8n formats

### Error Handling Strategy
- **Exception capture** and conversion to n8n format
- **Detailed stack traces** in the UI
- **Error recovery** and retry mechanisms
- **Graceful degradation** for failed nodes

## 📊 Type System

### Supported Types
- **Basic Types**: string, number, integer, float, boolean, null
- **Collection Types**: list, array, tuple, set, dict, object
- **Special Types**: file, image, audio, video, dataframe, tensor
- **Universal Type**: any (accepts all types)

### Type Compatibility Rules
- **Exact Match**: Output type must exactly match input type
- **Type Hierarchy**: Support for type inheritance
- **Collection Types**: Proper handling of lists, dictionaries, arrays
- **Custom Types**: Support for user-defined data types

## 🚀 Getting Started

1. **Review Architecture**: Start with [Qflow.md](./Qflow.md) for project overview
2. **Understand Type System**: Read [type_based_node_linking.md](./type_based_node_linking.md)
3. **Plan Implementation**: Follow [Qflow_Development_Plan.md](./Qflow_Development_Plan.md)
4. **View Diagrams**: Check [type_based_node_linking_diagram.md](./type_based_node_linking_diagram.md)

## 🤝 Contributing

When contributing to Qflow architecture:

1. **Update Documentation**: Keep all architecture docs in sync
2. **Add Diagrams**: Include visual diagrams for complex concepts
3. **Type Safety**: Ensure type-based linking is maintained
4. **Security**: Follow security best practices
5. **Performance**: Consider performance implications

## 📝 Documentation Standards

- **Clear Structure**: Use consistent headings and organization
- **Code Examples**: Include practical code snippets
- **Visual Diagrams**: Use Mermaid diagrams for complex flows
- **Type Safety**: Always consider type compatibility
- **Security**: Document security considerations
- **Performance**: Include performance implications

---

*Qflow: Where Python meets Visual Workflow Design with Type Safety* 