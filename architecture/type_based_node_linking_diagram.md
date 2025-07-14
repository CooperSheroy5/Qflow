# Type-Based Node Linking Diagrams

## Type Compatibility Flow

```mermaid
graph TD
    subgraph "Type Validation Process"
        A[User Attempts Connection] --> B[Extract Output Type]
        B --> C[Extract Input Type]
        C --> D[Check Type Compatibility]
        D --> E{Types Compatible?}
        E -->|Yes| F[Allow Connection]
        E -->|No| G[Block Connection]
        F --> H[Create Connection]
        G --> I[Show Error Message]
        I --> J[Provide Suggestions]
    end
    
    subgraph "Type System"
        K[Basic Types] --> L[string, number, boolean]
        M[Collection Types] --> N[list, array, dict, object]
        O[Special Types] --> P[file, image, dataframe, tensor]
        Q[Universal Type] --> R[any]
    end
    
    D --> K
    D --> M
    D --> O
    D --> Q
    
    style A fill:#e3f2fd
    style F fill:#e8f5e8
    style G fill:#ffebee
    style H fill:#e8f5e8
    style I fill:#ffebee
    style J fill:#fff3e0
```

## Compatible vs Incompatible Connections

```mermaid
graph LR
    subgraph "Compatible Connections ✓"
        A1[list] --> A2[array]
        B1[number] --> B2[integer]
        C1[string] --> C2[string]
        D1[dict] --> D2[object]
        E1[any] --> E2[string]
        F1[list] --> F2[any]
    end
    
    subgraph "Incompatible Connections ✗"
        G1[string] -.-> G2[number]
        H1[list] -.-> H2[dict]
        I1[boolean] -.-> I2[string]
        J1[file] -.-> J2[dataframe]
        K1[number] -.-> K2[list]
        L1[dict] -.-> L2[array]
    end
    
    style A1 fill:#e8f5e8
    style A2 fill:#e8f5e8
    style B1 fill:#e8f5e8
    style B2 fill:#e8f5e8
    style C1 fill:#e8f5e8
    style C2 fill:#e8f5e8
    style D1 fill:#e8f5e8
    style D2 fill:#e8f5e8
    style E1 fill:#e8f5e8
    style E2 fill:#e8f5e8
    style F1 fill:#e8f5e8
    style F2 fill:#e8f5e8
    
    style G1 fill:#ffebee
    style G2 fill:#ffebee
    style H1 fill:#ffebee
    style H2 fill:#ffebee
    style I1 fill:#ffebee
    style I2 fill:#ffebee
    style J1 fill:#ffebee
    style J2 fill:#ffebee
    style K1 fill:#ffebee
    style K2 fill:#ffebee
    style L1 fill:#ffebee
    style L2 fill:#ffebee
```

## Type Hierarchy and Inheritance

```mermaid
graph TB
    subgraph "Type Hierarchy"
        ANY[any] --> BASIC[Basic Types]
        ANY --> COLLECTION[Collection Types]
        ANY --> SPECIAL[Special Types]
        
        BASIC --> STRING[string]
        BASIC --> NUMBER[number]
        BASIC --> BOOLEAN[boolean]
        BASIC --> NULL[null]
        
        NUMBER --> INTEGER[integer]
        NUMBER --> FLOAT[float]
        
        COLLECTION --> LIST[list]
        COLLECTION --> ARRAY[array]
        COLLECTION --> DICT[dict]
        COLLECTION --> OBJECT[object]
        
        LIST --> TUPLE[tuple]
        LIST --> SET[set]
        
        DICT --> OBJECT
        
        SPECIAL --> FILE[file]
        SPECIAL --> DATAFRAME[dataframe]
        SPECIAL --> TENSOR[tensor]
        
        FILE --> IMAGE[image]
        FILE --> AUDIO[audio]
        FILE --> VIDEO[video]
        
        TENSOR --> NUMPY[numpy_array]
    end
    
    style ANY fill:#f1f8e9
    style BASIC fill:#e3f2fd
    style COLLECTION fill:#f3e5f5
    style SPECIAL fill:#fff3e0
```

## Frontend Validation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Canvas
    participant V as Validator
    participant UI as UI Components
    
    U->>C: Drag connection line
    C->>V: Validate connection types
    V->>V: Check type compatibility
    alt Types are compatible
        V->>C: Allow connection
        C->>UI: Show valid indicator
        UI->>U: Display green connection
    else Types are incompatible
        V->>C: Block connection
        C->>UI: Show error indicator
        UI->>U: Display error message
        UI->>U: Show type suggestions
    end
    
    U->>C: Attempt to connect
    C->>V: Final validation
    V->>C: Connection result
    C->>U: Confirm or reject
```

## Backend Type Validation

```mermaid
graph TD
    subgraph "Type Validation Service"
        A[Connection Request] --> B[Extract Node Types]
        B --> C[Load Type Registry]
        C --> D[Check Compatibility Matrix]
        D --> E{Valid Connection?}
        E -->|Yes| F[Return Success]
        E -->|No| G[Return Error]
        F --> H[Create Connection]
        G --> I[Return Suggestions]
    end
    
    subgraph "Type Registry"
        J[Basic Types] --> K[string, number, boolean]
        L[Collection Types] --> M[list, array, dict]
        N[Special Types] --> O[file, dataframe, tensor]
        P[Compatibility Matrix] --> Q[Type Pairs]
    end
    
    C --> J
    C --> L
    C --> N
    D --> P
    
    style A fill:#e3f2fd
    style F fill:#e8f5e8
    style G fill:#ffebee
    style H fill:#e8f5e8
    style I fill:#fff3e0
```

## Error Handling and User Feedback

```mermaid
graph LR
    subgraph "Error Detection"
        A[Invalid Connection] --> B[Error Classification]
        B --> C[Type Mismatch]
        B --> D[Missing Type]
        B --> E[Unsupported Type]
    end
    
    subgraph "User Feedback"
        C --> F[Show Error Message]
        D --> G[Request Type Definition]
        E --> H[Suggest Alternative Types]
        
        F --> I[Display Error UI]
        G --> J[Type Selection Dialog]
        H --> K[Suggestion List]
    end
    
    subgraph "Recovery Options"
        I --> L[Manual Type Correction]
        J --> M[Auto Type Inference]
        K --> N[Type Conversion]
    end
    
    style A fill:#ffebee
    style C fill:#ffebee
    style D fill:#ffebee
    style E fill:#ffebee
    style F fill:#fff3e0
    style G fill:#fff3e0
    style H fill:#fff3e0
    style L fill:#e8f5e8
    style M fill:#e8f5e8
    style N fill:#e8f5e8
```

## Example Workflow with Type Validation

```mermaid
graph TD
    subgraph "Data Processing Workflow"
        A[CSV Reader<br/>Output: list] --> B[Data Filter<br/>Input: list<br/>Output: list]
        B --> C[Data Transform<br/>Input: list<br/>Output: dict]
        C --> D[JSON Writer<br/>Input: dict]
        
        E[Image Loader<br/>Output: image] --> F[Image Processor<br/>Input: image<br/>Output: image]
        F --> G[File Saver<br/>Input: file]
        
        H[Number Generator<br/>Output: number] --> I[Calculator<br/>Input: number<br/>Output: number]
        I --> J[Chart Creator<br/>Input: number]
    end
    
    subgraph "Type Validation Results"
        K[✓ Compatible] --> L[list → list]
        L --> M[✓ Compatible]
        M --> N[✓ Compatible]
        
        O[✓ Compatible] --> P[image → image]
        P --> Q[✓ Compatible]
        
        R[✓ Compatible] --> S[number → number]
        S --> T[✓ Compatible]
    end
    
    style A fill:#e8f5e8
    style B fill:#e8f5e8
    style C fill:#e8f5e8
    style D fill:#e8f5e8
    style E fill:#e8f5e8
    style F fill:#e8f5e8
    style G fill:#e8f5e8
    style H fill:#e8f5e8
    style I fill:#e8f5e8
    style J fill:#e8f5e8
```

## Type Conversion Examples

```mermaid
graph LR
    subgraph "Automatic Type Conversions"
        A[list] --> B[array]
        C[dict] --> D[object]
        E[integer] --> F[number]
        G[tuple] --> H[list]
    end
    
    subgraph "Manual Type Conversions"
        I[string] --> J[number<br/>int() or float()]
        K[list] --> L[dict<br/>dict() conversion]
        M[number] --> N[string<br/>str() conversion]
        O[dict] --> P[list<br/>list() conversion]
    end
    
    subgraph "Type Conversion Nodes"
        Q[Type Converter Node] --> R[Input: any<br/>Output: target_type]
        S[Data Transformer] --> T[Input: source_type<br/>Output: target_type]
    end
    
    style A fill:#e8f5e8
    style B fill:#e8f5e8
    style C fill:#e8f5e8
    style D fill:#e8f5e8
    style E fill:#e8f5e8
    style F fill:#e8f5e8
    style G fill:#e8f5e8
    style H fill:#e8f5e8
    
    style I fill:#fff3e0
    style J fill:#fff3e0
    style K fill:#fff3e0
    style L fill:#fff3e0
    style M fill:#fff3e0
    style N fill:#fff3e0
    style O fill:#fff3e0
    style P fill:#fff3e0
    
    style Q fill:#f3e5f5
    style R fill:#f3e5f5
    style S fill:#f3e5f5
    style T fill:#f3e5f5
```

## Performance Optimization

```mermaid
graph TD
    subgraph "Caching Strategy"
        A[Type Validation Request] --> B{Check Cache}
        B -->|Hit| C[Return Cached Result]
        B -->|Miss| D[Perform Validation]
        D --> E[Cache Result]
        E --> F[Return Result]
    end
    
    subgraph "Optimization Techniques"
        G[Type Registry Cache] --> H[Pre-computed Compatibility]
        I[Connection Validation Cache] --> J[Node Pair Results]
        K[Type Inference Cache] --> L[Code Analysis Results]
    end
    
    C --> G
    F --> I
    D --> K
    
    style A fill:#e3f2fd
    style C fill:#e8f5e8
    style F fill:#e8f5e8
    style G fill:#fff3e0
    style I fill:#fff3e0
    style K fill:#fff3e0
```

## Security Considerations

```mermaid
graph TB
    subgraph "Type Security"
        A[User Input] --> B[Type Validation]
        B --> C[Sanitize Types]
        C --> D[Check Whitelist]
        D --> E{Valid Type?}
        E -->|Yes| F[Allow Connection]
        E -->|No| G[Block Connection]
    end
    
    subgraph "Security Measures"
        H[Type Whitelist] --> I[Allowed Types Only]
        J[Type Blacklist] --> K[Blocked Types]
        L[Type Sanitization] --> M[Remove Dangerous Types]
        N[Type Isolation] --> O[Container Boundaries]
    end
    
    D --> H
    D --> J
    C --> L
    F --> N
    
    style A fill:#e3f2fd
    style F fill:#e8f5e8
    style G fill:#ffebee
    style H fill:#f1f8e9
    style J fill:#ffebee
    style L fill:#f1f8e9
    style N fill:#f1f8e9
```

## Key Benefits

### 🎯 **Type Safety**
- **Prevents Runtime Errors**: Catch type mismatches before execution
- **Compile-time Validation**: Validate connections during design
- **Visual Feedback**: Clear indication of valid/invalid connections

### 🔧 **Developer Experience**
- **Intuitive Interface**: Easy-to-understand type system
- **Helpful Suggestions**: Automatic suggestions for compatible types
- **Error Recovery**: Multiple ways to fix type issues

### 🚀 **Performance**
- **Fast Validation**: Cached type compatibility checks
- **Efficient Execution**: No runtime type conversion overhead
- **Optimized Memory**: Minimal memory footprint for type system

### 🛡️ **Security**
- **Type Isolation**: Prevent malicious type manipulation
- **Whitelist Control**: Only allow safe type combinations
- **Container Security**: Type validation within isolated environments

This type-based node linking system ensures reliable, safe, and efficient workflow execution while providing an excellent user experience. 