# Qflow Architecture Diagram

## Complete System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer (n8n-based)"
        UI[Qflow Editor UI]
        
        subgraph "Python Node Components"
            PN[Python Node Editor]
            PE[Python Code Editor]
            TS[Type Selector]
            FS[Function Selector]
            TN[Node Tester]
            ND[Node Designer]
        end
        
        subgraph "Workflow Components"
            WF[Workflow Canvas]
            NC[Node Connections]
            EM[Execution Monitor]
            EL[Execution Logs]
            DV[Data Visualizer]
        end
        
        subgraph "State Management"
            PS[Python Nodes Store]
            WS[Workflows Store]
            ES[Execution Store]
            TS[Type System Store]
        end
    end
    
    subgraph "Backend Layer (Python-First)"
        API[FastAPI Backend]
        
        subgraph "Core Services"
            PES[Python Execution Service]
            CMS[Container Management Service]
            DMS[Dependency Management Service]
            WFS[Workflow Service]
            TSS[Type System Service]
            NS[Node Service]
        end
        
        subgraph "Execution Engine"
            PE[Python Execution Engine]
            TC[Type Checker]
            DC[Data Converter]
            EH[Error Handler]
            VM[Version Manager]
        end
        
        subgraph "Container Management"
            DC[Docker Client]
            CP[Container Pool]
            CI[Container Isolation]
            RL[Resource Limits]
        end
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL)]
        REDIS[(Redis Cache)]
        FS[File Storage]
        
        subgraph "Data Models"
            WD[Workflow Data]
            ED[Execution Data]
            ND[Node Data]
            UD[User Data]
        end
    end
    
    subgraph "Python Environments"
        subgraph "Docker Containers"
            PY38[Python 3.8]
            PY39[Python 3.9]
            PY310[Python 3.10]
            PY311[Python 3.11]
            PY312[Python 3.12]
        end
        
        subgraph "Library Management"
            PIP[Pip Installer]
            REQ[Requirements Manager]
            DEP[Dependency Resolver]
            CACHE[Package Cache]
        end
    end
    
    subgraph "External Integrations"
        subgraph "AI Services"
            AI[AI Services]
            OPENAI[OpenAI API]
            OPENROUTER[OpenRouter]
            OLLAMA[Ollama]
        end
        
        subgraph "Data Sources"
            WEB[Web Services]
            FILE[File Systems]
            DB_EXT[External Databases]
            API_EXT[External APIs]
        end
        
        subgraph "Triggers"
            SCHEDULE[Scheduled Tasks]
            WEBHOOK[Webhooks]
            FILE_WATCH[File Watchers]
            DB_TRIGGER[Database Triggers]
        end
    end
    
    subgraph "Security & Performance"
        subgraph "Security"
            CS[Container Sandboxing]
            CL[Resource Limits]
            CA[Code Analysis]
            NS[Network Security]
        end
        
        subgraph "Performance"
            CPOOL[Container Pooling]
            PEXEC[Parallel Execution]
            CACHE[Result Caching]
            MONITOR[Performance Monitoring]
        end
    end
    
    %% Frontend connections
    UI --> PN
    UI --> WF
    UI --> EM
    
    PN --> PE
    PN --> TS
    PN --> FS
    PN --> TN
    PN --> ND
    
    WF --> NC
    WF --> EL
    WF --> DV
    
    PS --> API
    WS --> API
    ES --> API
    TS --> API
    
    %% Backend connections
    API --> PES
    API --> CMS
    API --> DMS
    API --> WFS
    API --> TSS
    API --> NS
    
    PES --> PE
    PE --> TC
    PE --> DC
    PE --> EH
    PE --> VM
    
    CMS --> DC
    DC --> CP
    CP --> CI
    CI --> RL
    
    DMS --> PIP
    DMS --> REQ
    DMS --> DEP
    DEP --> CACHE
    
    %% Data connections
    API --> DB
    API --> REDIS
    API --> FS
    
    DB --> WD
    DB --> ED
    DB --> ND
    DB --> UD
    
    %% Container connections
    PE --> PY38
    PE --> PY39
    PE --> PY310
    PE --> PY311
    PE --> PY312
    
    PIP --> PY38
    PIP --> PY39
    PIP --> PY310
    PIP --> PY311
    PIP --> PY312
    
    %% External connections
    PE --> AI
    PE --> WEB
    PE --> FILE
    PE --> DB_EXT
    PE --> API_EXT
    
    AI --> OPENAI
    AI --> OPENROUTER
    AI --> OLLAMA
    
    WEB --> SCHEDULE
    WEB --> WEBHOOK
    WEB --> FILE_WATCH
    WEB --> DB_TRIGGER
    
    %% Security connections
    CS --> CI
    CL --> RL
    CA --> PE
    NS --> API
    
    %% Performance connections
    CPOOL --> CP
    PEXEC --> PE
    CACHE --> REDIS
    MONITOR --> API
    
    %% Styling
    classDef frontend fill:#e3f2fd,stroke:#2196f3,stroke-width:2
    classDef backend fill:#f3e5f5,stroke:#9c27b0,stroke-width:2
    classDef data fill:#e8f5e8,stroke:#4caf50,stroke-width:2
    classDef containers fill:#fff3e0,stroke:#ff9800,stroke-width:2
    classDef external fill:#ffebee,stroke:#f44336,stroke-width:2
    classDef security fill:#f1f8e9,stroke:#8bc34a,stroke-width:2
    
    class UI,PN,PE,TS,FS,TN,ND,WF,NC,EM,EL,DV,PS,WS,ES,TS frontend
    class API,PES,CMS,DMS,WFS,TSS,NS,PE,TC,DC,EH,VM,DC,CP,CI,RL backend
    class DB,REDIS,FS,WD,ED,ND,UD data
    class PY38,PY39,PY310,PY311,PY312,PIP,REQ,DEP,CACHE containers
    class AI,OPENAI,OPENROUTER,OLLAMA,WEB,FILE,DB_EXT,API_EXT,SCHEDULE,WEBHOOK,FILE_WATCH,DB_TRIGGER external
    class CS,CL,CA,NS,CPOOL,PEXEC,CACHE,MONITOR security
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant C as Container
    participant D as Database
    participant E as External
    
    U->>F: Create Python Node
    F->>B: Send Python Code
    B->>B: Extract Dependencies
    B->>C: Create Container
    B->>C: Install Libraries
    C->>B: Installation Status
    B->>F: Return Node Metadata
    F->>D: Save Node Definition
    
    U->>F: Create Workflow
    F->>B: Send Workflow Data
    B->>D: Save Workflow
    D->>B: Workflow ID
    B->>F: Confirm Workflow Created
    
    U->>F: Execute Workflow
    F->>B: Execute Request
    B->>C: Run Python Code
    C->>E: Call External APIs
    E->>C: Return Data
    C->>B: Execution Results
    B->>D: Save Execution Log
    B->>F: Return Results
    F->>U: Display Results
```

## Python Node Creation Flow

```mermaid
flowchart TD
    A[User Inputs Python Code] --> B[Code Analysis]
    B --> C[Extract Functions]
    C --> D[Select Main Function]
    D --> E[Type Inference]
    E --> F{Types Detected?}
    F -->|Yes| G[Auto-fill Types]
    F -->|No| H[Manual Type Definition]
    G --> I[Node Testing]
    H --> I
    I --> J{Test Passed?}
    J -->|Yes| K[Save Node]
    J -->|No| L[Error Display]
    L --> M[Code Correction]
    M --> I
    K --> N[Node Available in Library]
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#f3e5f5
    style D fill:#f3e5f5
    style E fill:#f3e5f5
    style F fill:#fff3e0
    style G fill:#e8f5e8
    style H fill:#e8f5e8
    style I fill:#fff3e0
    style J fill:#ffebee
    style K fill:#e8f5e8
    style L fill:#ffebee
    style M fill:#fff3e0
    style N fill:#e8f5e8
```

## Workflow Execution Architecture

```mermaid
graph LR
    subgraph "Workflow Creation"
        A[Choose Python Version] --> B[Select Environment]
        B --> C[Add Nodes]
        C --> D[Connect Nodes]
        D --> E[Configure Parameters]
    end
    
    subgraph "Execution Engine"
        F[Parse Workflow] --> G[Validate Connections]
        G --> H[Create Execution Plan]
        H --> I[Execute Nodes]
        I --> J[Handle Data Flow]
        J --> K[Monitor Progress]
    end
    
    subgraph "Container Management"
        L[Select Container] --> M[Install Dependencies]
        M --> N[Execute Code]
        N --> O[Capture Results]
        O --> P[Cleanup Resources]
    end
    
    subgraph "Error Handling"
        Q[Exception Detection] --> R[Error Classification]
        R --> S[Retry Logic]
        S --> T[Error Reporting]
        T --> U[User Notification]
    end
    
    E --> F
    K --> L
    P --> Q
    
    style A fill:#e3f2fd
    style B fill:#e3f2fd
    style C fill:#e3f2fd
    style D fill:#e3f2fd
    style E fill:#e3f2fd
    style F fill:#f3e5f5
    style G fill:#f3e5f5
    style H fill:#f3e5f5
    style I fill:#f3e5f5
    style J fill:#f3e5f5
    style K fill:#f3e5f5
    style L fill:#fff3e0
    style M fill:#fff3e0
    style N fill:#fff3e0
    style O fill:#fff3e0
    style P fill:#fff3e0
    style Q fill:#ffebee
    style R fill:#ffebee
    style S fill:#ffebee
    style T fill:#ffebee
    style U fill:#ffebee
```

## Security Architecture

```mermaid
graph TB
    subgraph "Container Security"
        CS[Container Sandboxing]
        CL[Resource Limits]
        CT[Timeout Controls]
        CN[Network Isolation]
    end
    
    subgraph "Code Security"
        CA[Code Analysis]
        CW[Whitelist/Blacklist]
        CV[Vulnerability Scanning]
        CS[Static Analysis]
    end
    
    subgraph "Runtime Security"
        RS[Runtime Monitoring]
        RM[Memory Protection]
        RF[File System Isolation]
        RN[Network Restrictions]
    end
    
    subgraph "Data Security"
        DE[Data Encryption]
        DA[Access Control]
        DB[Audit Logging]
        DS[Secure Communication]
    end
    
    CS --> CL
    CL --> CT
    CT --> CN
    
    CA --> CW
    CW --> CV
    CV --> CS
    
    RS --> RM
    RM --> RF
    RF --> RN
    
    DE --> DA
    DA --> DB
    DB --> DS
    
    style CS fill:#f1f8e9
    style CL fill:#f1f8e9
    style CT fill:#f1f8e9
    style CN fill:#f1f8e9
    style CA fill:#f1f8e9
    style CW fill:#f1f8e9
    style CV fill:#f1f8e9
    style CS fill:#f1f8e9
    style RS fill:#f1f8e9
    style RM fill:#f1f8e9
    style RF fill:#f1f8e9
    style RN fill:#f1f8e9
    style DE fill:#f1f8e9
    style DA fill:#f1f8e9
    style DB fill:#f1f8e9
    style DS fill:#f1f8e9
```

## Performance Architecture

```mermaid
graph TB
    subgraph "Container Optimization"
        CP[Container Pooling]
        CR[Container Reuse]
        CC[Container Cleanup]
        CM[Container Monitoring]
    end
    
    subgraph "Execution Optimization"
        PE[Parallel Execution]
        PQ[Queue Management]
        PR[Resource Allocation]
        PT[Task Prioritization]
    end
    
    subgraph "Caching Strategy"
        MC[Memory Cache]
        DC[Disk Cache]
        RC[Redis Cache]
        CC[Code Cache]
    end
    
    subgraph "Monitoring"
        PM[Performance Monitoring]
        RM[Resource Monitoring]
        EM[Execution Metrics]
        AM[Alert Management]
    end
    
    CP --> CR
    CR --> CC
    CC --> CM
    
    PE --> PQ
    PQ --> PR
    PR --> PT
    
    MC --> DC
    DC --> RC
    RC --> CC
    
    PM --> RM
    RM --> EM
    EM --> AM
    
    style CP fill:#e0f2f1
    style CR fill:#e0f2f1
    style CC fill:#e0f2f1
    style CM fill:#e0f2f1
    style PE fill:#e0f2f1
    style PQ fill:#e0f2f1
    style PR fill:#e0f2f1
    style PT fill:#e0f2f1
    style MC fill:#e0f2f1
    style DC fill:#e0f2f1
    style RC fill:#e0f2f1
    style CC fill:#e0f2f1
    style PM fill:#e0f2f1
    style RM fill:#e0f2f1
    style EM fill:#e0f2f1
    style AM fill:#e0f2f1
```

## Key Architectural Features

### 🎯 **Core Design Principles**
- **Python-First**: Native Python execution in isolated containers
- **Visual Workflow**: Inherit n8n's powerful drag-and-drop interface
- **Type Safety**: Comprehensive type checking and validation
- **Security**: Multi-layered security with container isolation
- **Performance**: Optimized execution with caching and pooling

### 🔧 **Technology Stack**
- **Frontend**: Vue.js 3, Vue Flow, CodeMirror 6, Element Plus
- **Backend**: FastAPI, Celery, Docker, PostgreSQL, Redis
- **Execution**: Python runtime, pip, type checking, error handling
- **Security**: Container sandboxing, resource limits, code analysis

### 📊 **Scalability Features**
- **Container Pooling**: Reuse containers for better performance
- **Parallel Execution**: Run independent nodes concurrently
- **Caching Strategy**: Multi-level caching for faster execution
- **Auto Scaling**: Dynamic resource allocation based on load

### 🛡️ **Security Measures**
- **Container Isolation**: Complete sandboxing of Python code
- **Resource Limits**: CPU, memory, and time restrictions
- **Code Analysis**: Static analysis for security vulnerabilities
- **Network Security**: Restricted network access for containers

This architecture provides a robust foundation for Qflow while maintaining the visual workflow design capabilities of n8n and adding powerful Python execution capabilities. 