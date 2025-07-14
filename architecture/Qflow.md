# Qflow: Python-First Workflow Orchestration Platform

## Overview

Qflow is a Python-first, drag-and-drop workflow orchestration platform that builds on the visual canvas of n8n. It reuses n8n's rich editor-UI while replacing JavaScript nodes with true Python modules, enabling users to write or upload `.py` files directly in the node panels.

## Core Philosophy

Qflow bridges the gap between visual workflow design and Python development by providing:
- **Visual Workflow Design**: Intuitive drag-and-drop interface inherited from n8n
- **Native Python Execution**: Direct execution of Python code in isolated environments
- **Dynamic Node Creation**: Create custom nodes from Python functions
- **Library Management**: Automatic dependency resolution and installation
- **Version Control**: Support for multiple Python versions via Docker containers

## Key Features

### 🐍 Python-First Architecture

#### Python Node Creation
- **Code Input**: Paste Python code or upload `.py` files directly in node panels
- **Function Selection**: Choose main function from available functions in the code
- **Type Inference**: Automatic detection of input/output data types from function signatures
- **Manual Type Definition**: Fallback interface for explicit type specification when inference fails
- **Node Testing**: Built-in testing framework to validate node functionality before saving
- **Node Registration**: Save custom nodes with unique names for reuse

#### Python Environment Management
- **Version Selection**: Choose Python version (3.8, 3.9, 3.10, 3.11, 3.12) via dropdown
- **Docker Isolation**: Each workflow runs in isolated Docker containers
- **Library Installation**: Automatic `pip` installation of required dependencies
- **Progress Tracking**: Real-time feedback on library installation status
- **Error Handling**: Comprehensive error reporting for failed installations

### 🔄 Workflow Execution

#### Workflow Creation Flow
1. **Environment Selection**: Choose Python version and environment
2. **Node Addition**: Add built-in nodes or custom Python nodes
3. **Type-Aware Connection Setup**: Connect nodes with strict type compatibility validation
4. **Execution**: Run workflows with real-time monitoring
5. **Debugging**: Comprehensive execution logs and error reporting

#### Type-Based Node Linking ✅ **IMPLEMENTED**
- **Strict Type Compatibility**: Only nodes with compatible data types can be connected
- **Visual Feedback**: Real-time indication of valid/invalid connections
- **Type Suggestions**: Automatic suggestions for compatible types
- **Error Prevention**: Block invalid connections before execution
- **Type Hierarchy**: Support for type inheritance (e.g., `list` → `array`, `number` → `integer`)

#### Data Flow Strategy ✅ **DECIDED: Hybrid Approach**
- **JSON Serialization**: For simple data types (strings, numbers, booleans, basic lists/dicts)
- **Pickle Serialization**: For complex Python objects (custom classes, numpy arrays, pandas DataFrames)
- **File Storage**: For large datasets (images, videos, large files)
- **Type-Aware Conversion**: Between Python and n8n formats

#### Execution Features
- **Real-time Monitoring**: Live execution status and progress
- **Error Handling**: Detailed error messages with stack traces
- **Data Flow Visualization**: Visual representation of data passing between nodes
- **Execution History**: Complete audit trail of workflow runs
- **Performance Metrics**: Execution time and resource usage tracking

### 📦 Library Management

#### Dependency Resolution
- **Automatic Detection**: Scan Python code for `import` statements
- **Requirements.txt Support**: Upload requirements files for complex dependencies
- **Version Conflict Resolution**: Handle conflicting library versions
- **Installation Progress**: Real-time feedback during pip installations
- **Fallback Mechanisms**: Alternative installation methods for problematic packages

#### Supported Libraries
- **Data Science**: numpy, pandas, scikit-learn, matplotlib, seaborn
- **Web Development**: requests, flask, fastapi, beautifulsoup4
- **Machine Learning**: torch, tensorflow, transformers, openai
- **Utilities**: pillow, opencv-python, pytesseract, nltk

### 🎨 Visual Interface

#### Inherited from n8n
- **Drag-and-Drop Editor**: Intuitive workflow creation
- **Node Connection**: Visual data flow representation
- **Execution Monitoring**: Real-time execution status
- **Template System**: Import/export workflows as JSON
- **Error Visualization**: Clear error highlighting and reporting

#### Enhanced Features
- **Python Code Editor**: Syntax-highlighted Python code editing
- **Type Visualization**: Visual representation of data types
- **Library Status**: Real-time library installation status
- **Execution Logs**: Detailed Python execution logs
- **Data Preview**: Preview data at each node connection

## Node Types

### 🔧 Built-in Nodes

#### AI/ML Nodes
- **OpenAI Integration**: GPT models, embeddings, fine-tuning
- **OpenRouter**: Access to multiple AI models
- **Ollama**: Local AI model execution
- **Custom AI**: Integration with any AI service

#### Data Transformation
- **Data Processing**: Filter, sort, aggregate, transform
- **File Operations**: Read/write CSV, JSON, Excel, images
- **Text Processing**: Summarize, extract, analyze text
- **Data Conversion**: Format conversion between data types

#### Flow Control
- **Conditional Logic**: If/else branching based on data
- **Loops**: For loops, while loops, list iteration
- **Parallel Execution**: Concurrent node execution
- **Error Handling**: Try/catch blocks and error recovery

#### Triggers
- **Schedule**: Time-based workflow triggers
- **Webhook**: HTTP endpoint triggers
- **File Watch**: File system change triggers
- **Database**: Database change triggers

#### Human-in-the-Loop
- **User Input**: Pause workflow for human decision
- **Approval**: Require approval before proceeding
- **Manual Review**: Human review of workflow results

### 🐍 Python Nodes

#### Custom Node Creation
```python
def process_data(input_data: dict, multiplier: int = 2) -> dict:
    """
    Process input data with optional multiplier
    
    Args:
        input_data: Input dictionary containing data
        multiplier: Multiplier value (default: 2)
    
    Returns:
        Processed data dictionary
    """
    result = {}
    for key, value in input_data.items():
        if isinstance(value, (int, float)):
            result[key] = value * multiplier
        else:
            result[key] = value
    
    return result
```

#### Node Testing Interface
- **Input Data**: Provide test input data
- **Expected Output**: Define expected output format
- **Test Execution**: Run node with test data
- **Validation**: Verify output matches expectations
- **Error Testing**: Test error handling scenarios

## Architecture

### Frontend (Inherited from n8n)
- **Vue.js 3**: Modern reactive framework
- **Vue Flow**: Workflow canvas and node connections
- **Element Plus**: UI component library
- **CodeMirror**: Python code editing
- **Pinia**: State management

### Backend (Python-First)
- **FastAPI**: Modern Python web framework
- **Celery**: Asynchronous task processing
- **Docker**: Containerized Python environments
- **PostgreSQL**: Workflow and execution storage
- **Redis**: Task queue and caching

### Execution Engine
- **Python Runtime**: Isolated Python execution environments
- **Dependency Management**: Automatic pip package installation
- **Type System**: Runtime type checking and validation
- **Error Handling**: Comprehensive error capture and reporting

## Final Architectural Decisions ✅

### Container Strategy
- **One container per workflow** (shared environment) for optimal performance
- **Isolated environments** per workflow execution for security
- **Base image pooling** for common Python versions
- **Node-specific layers** for unique dependencies

### Data Flow Strategy
- **Hybrid serialization approach**:
  - JSON for simple data types (strings, numbers, booleans, basic lists/dicts)
  - Pickle for complex Python objects (custom classes, numpy arrays, pandas DataFrames)
  - File storage for large datasets (images, videos, large files)
- **Type-aware conversion** between Python and n8n formats

### Security Implementation
- **Docker container isolation** with no network access by default
- **Resource limits**: CPU (50%), Memory (512MB), Time (30s per node)
- **Code analysis** for dangerous operations (file system access, network calls)
- **Import whitelist/blacklist** for library control
- **Real-time monitoring** of resource usage

### Performance Optimization
- **Container pooling** for frequently used Python versions
- **JIT compilation** and caching for faster execution
- **Parallel execution** of independent nodes
- **Caching** of intermediate results
- **Resource monitoring** and limits

### Error Handling
- **Exception capture** and conversion to n8n format
- **Detailed stack traces** in the UI
- **Error recovery** and retry mechanisms
- **Graceful degradation** for failed nodes
- **Error categorization** and analytics

## Development Roadmap

### Alpha Release (v0.1.0)
- [ ] Basic Python node creation and execution
- [ ] Simple workflow creation and execution
- [ ] Docker container management
- [ ] Basic library installation
- [ ] Core n8n UI integration

### Beta Release (v0.2.0)
- [ ] Advanced Python node features
- [ ] Complex workflow orchestration
- [ ] Enhanced library management
- [ ] Performance optimizations
- [ ] Comprehensive testing framework

### Production Release (v1.0.0)
- [ ] Enterprise features
- [ ] Advanced security
- [ ] Scalability improvements
- [ ] Community node marketplace
- [ ] API and SDK

## Getting Started

### Prerequisites
- Docker Desktop
- Python 3.8+
- Node.js 18+
- PostgreSQL 12+

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/qflow.git
cd qflow

# Install dependencies
pip install -r requirements.txt
npm install

# Start the development environment
docker-compose up -d
python manage.py runserver
npm run dev
```

### Creating Your First Python Node

1. **Open the Editor**: Navigate to the workflow editor
2. **Add Python Node**: Click "Add Node" → "Python"
3. **Write Code**: Enter your Python function
4. **Select Function**: Choose the main function from the dropdown
5. **Define Types**: Specify input/output data types
6. **Test Node**: Run the test to verify functionality
7. **Save Node**: Give your node a name and save

### Creating Your First Workflow

1. **Choose Environment**: Select Python version (e.g., 3.10.1)
2. **Add Nodes**: Add built-in nodes or custom Python nodes
3. **Connect Nodes**: Drag connections between nodes
4. **Configure**: Set up node parameters and data flow
5. **Test**: Run the workflow with test data
6. **Execute**: Run the complete workflow

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

Qflow is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Support

- **Documentation**: [docs.qflow.dev](https://docs.qflow.dev)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/qflow/discussions)
- **Issues**: [GitHub Issues](https://github.com/your-org/qflow/issues)
- **Discord**: [Qflow Community](https://discord.gg/qflow)

---

*Qflow: Where Python meets Visual Workflow Design* 