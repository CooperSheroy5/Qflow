# Type-Based Node Linking System

## Overview

Qflow implements a strict type-based node linking system that ensures only nodes with compatible data types can be connected. This system provides compile-time and runtime type safety, preventing data type mismatches and ensuring reliable workflow execution.

## Core Principles

### 🎯 **Type Safety First**
- **Compile-time Validation**: Type checking during workflow design
- **Runtime Validation**: Type verification during execution
- **Visual Feedback**: Clear indication of compatible/incompatible connections
- **Error Prevention**: Block invalid connections before they cause runtime errors

### 🔗 **Compatibility Rules**
- **Exact Match**: Output type must exactly match input type
- **Type Hierarchy**: Support for type inheritance (e.g., `int` → `number`)
- **Collection Types**: Proper handling of lists, dictionaries, arrays
- **Custom Types**: Support for user-defined data types

## Type System Architecture

### Supported Data Types

```python
# Basic Types
BASIC_TYPES = {
    'string': str,
    'number': (int, float),
    'integer': int,
    'float': float,
    'boolean': bool,
    'null': type(None),
    'any': object
}

# Collection Types
COLLECTION_TYPES = {
    'list': list,
    'array': list,
    'tuple': tuple,
    'set': set,
    'dict': dict,
    'object': dict
}

# Special Types
SPECIAL_TYPES = {
    'file': 'file',
    'image': 'image',
    'audio': 'audio',
    'video': 'video',
    'dataframe': 'pandas.DataFrame',
    'tensor': 'torch.Tensor',
    'numpy_array': 'numpy.ndarray'
}
```

### Type Compatibility Matrix

```python
TYPE_COMPATIBILITY = {
    # Basic type compatibility
    'string': ['string', 'any'],
    'number': ['number', 'integer', 'float', 'any'],
    'integer': ['integer', 'number', 'any'],
    'float': ['float', 'number', 'any'],
    'boolean': ['boolean', 'any'],
    'null': ['null', 'any'],
    
    # Collection type compatibility
    'list': ['list', 'array', 'any'],
    'array': ['array', 'list', 'any'],
    'tuple': ['tuple', 'list', 'array', 'any'],
    'set': ['set', 'list', 'array', 'any'],
    'dict': ['dict', 'object', 'any'],
    'object': ['object', 'dict', 'any'],
    
    # Special type compatibility
    'file': ['file', 'any'],
    'image': ['image', 'file', 'any'],
    'audio': ['audio', 'file', 'any'],
    'video': ['video', 'file', 'any'],
    'dataframe': ['dataframe', 'object', 'any'],
    'tensor': ['tensor', 'numpy_array', 'any'],
    'numpy_array': ['numpy_array', 'tensor', 'any']
}
```

## Frontend Implementation

### Type Validation Service

```typescript
// frontend/src/services/TypeValidationService.ts
export class TypeValidationService {
  private typeCompatibility: Record<string, string[]> = {
    'string': ['string', 'any'],
    'number': ['number', 'integer', 'float', 'any'],
    'integer': ['integer', 'number', 'any'],
    'float': ['float', 'number', 'any'],
    'boolean': ['boolean', 'any'],
    'list': ['list', 'array', 'any'],
    'dict': ['dict', 'object', 'any'],
    'file': ['file', 'any'],
    'dataframe': ['dataframe', 'object', 'any'],
    'tensor': ['tensor', 'numpy_array', 'any'],
    'numpy_array': ['numpy_array', 'tensor', 'any']
  };

  /**
   * Check if two types are compatible for connection
   */
  public areTypesCompatible(outputType: string, inputType: string): boolean {
    if (outputType === 'any' || inputType === 'any') {
      return true;
    }
    
    const compatibleTypes = this.typeCompatibility[outputType] || [];
    return compatibleTypes.includes(inputType);
  }

  /**
   * Get all compatible types for a given output type
   */
  public getCompatibleTypes(outputType: string): string[] {
    return this.typeCompatibility[outputType] || [];
  }

  /**
   * Validate node connection based on types
   */
  public validateConnection(sourceNode: Node, targetNode: Node): ValidationResult {
    const sourceOutputs = sourceNode.outputs || [];
    const targetInputs = targetNode.inputs || [];
    
    const results: ValidationResult[] = [];
    
    for (const output of sourceOutputs) {
      for (const input of targetInputs) {
        const isCompatible = this.areTypesCompatible(output.type, input.type);
        results.push({
          sourceOutput: output,
          targetInput: input,
          compatible: isCompatible,
          reason: isCompatible ? 'Types are compatible' : `Cannot connect ${output.type} to ${input.type}`
        });
      }
    }
    
    return {
      valid: results.some(r => r.compatible),
      results: results
    };
  }
}
```

### Visual Connection Interface

```typescript
// frontend/src/components/NodeConnection/TypeAwareConnection.vue
<template>
  <div class="type-aware-connection">
    <!-- Connection validation indicator -->
    <div v-if="connectionValidation" class="connection-status">
      <div :class="['status-indicator', connectionValidation.valid ? 'valid' : 'invalid']">
        <i :class="connectionValidation.valid ? 'fas fa-check' : 'fas fa-times'"></i>
        {{ connectionValidation.message }}
      </div>
    </div>
    
    <!-- Type compatibility details -->
    <div v-if="showTypeDetails" class="type-details">
      <div class="type-info">
        <span class="label">Output Type:</span>
        <span class="type">{{ sourceType }}</span>
      </div>
      <div class="type-info">
        <span class="label">Input Type:</span>
        <span class="type">{{ targetType }}</span>
      </div>
      <div class="compatibility-status">
        <span :class="['status', isCompatible ? 'compatible' : 'incompatible']">
          {{ isCompatible ? '✓ Compatible' : '✗ Incompatible' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useTypeValidation } from '@/composables/useTypeValidation';

const props = defineProps<{
  sourceNode: Node;
  targetNode: Node;
  sourceOutput: NodeOutput;
  targetInput: NodeInput;
}>();

const { validateTypes, getCompatibleTypes } = useTypeValidation();

const isCompatible = computed(() => {
  return validateTypes(props.sourceOutput.type, props.targetInput.type);
});

const connectionValidation = computed(() => {
  if (isCompatible.value) {
    return {
      valid: true,
      message: 'Types are compatible'
    };
  } else {
    return {
      valid: false,
      message: `Cannot connect ${props.sourceOutput.type} to ${props.targetInput.type}`
    };
  }
});

const compatibleTypes = computed(() => {
  return getCompatibleTypes(props.sourceOutput.type);
});
</script>

<style scoped>
.type-aware-connection {
  padding: 8px;
  border-radius: 4px;
  background: #f5f5f5;
}

.connection-status {
  margin-bottom: 8px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-indicator.valid {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-indicator.invalid {
  background: #ffebee;
  color: #c62828;
}

.type-details {
  font-size: 11px;
}

.type-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
}

.compatibility-status {
  margin-top: 4px;
  text-align: center;
}

.status.compatible {
  color: #2e7d32;
  font-weight: bold;
}

.status.incompatible {
  color: #c62828;
  font-weight: bold;
}
</style>
```

### Node Connection Validation

```typescript
// frontend/src/composables/useNodeConnection.ts
export function useNodeConnection() {
  const { validateTypes } = useTypeValidation();
  
  /**
   * Validate if two nodes can be connected
   */
  const validateNodeConnection = (sourceNode: Node, targetNode: Node): ConnectionValidation => {
    const sourceOutputs = sourceNode.outputs || [];
    const targetInputs = targetNode.inputs || [];
    
    const validConnections: ValidConnection[] = [];
    const invalidConnections: InvalidConnection[] = [];
    
    for (const output of sourceOutputs) {
      for (const input of targetInputs) {
        const isCompatible = validateTypes(output.type, input.type);
        
        if (isCompatible) {
          validConnections.push({
            sourceOutput: output,
            targetInput: input,
            reason: 'Types are compatible'
          });
        } else {
          invalidConnections.push({
            sourceOutput: output,
            targetInput: input,
            reason: `Cannot connect ${output.type} to ${input.type}`,
            suggestions: getCompatibleTypes(output.type)
          });
        }
      }
    }
    
    return {
      valid: validConnections.length > 0,
      validConnections,
      invalidConnections,
      canConnect: validConnections.length > 0
    };
  };
  
  /**
   * Get connection suggestions for incompatible types
   */
  const getConnectionSuggestions = (outputType: string): string[] => {
    return getCompatibleTypes(outputType);
  };
  
  /**
   * Block invalid connections
   */
  const blockInvalidConnection = (sourceNode: Node, targetNode: Node): boolean => {
    const validation = validateNodeConnection(sourceNode, targetNode);
    return validation.canConnect;
  };
  
  return {
    validateNodeConnection,
    getConnectionSuggestions,
    blockInvalidConnection
  };
}
```

## Backend Implementation

### Type Validation Service

```python
# backend/app/services/type_validation_service.py
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
from enum import Enum

class TypeCategory(Enum):
    BASIC = "basic"
    COLLECTION = "collection"
    SPECIAL = "special"
    CUSTOM = "custom"

@dataclass
class TypeInfo:
    name: str
    category: TypeCategory
    python_type: type
    compatible_types: List[str]
    description: str

class TypeValidationService:
    def __init__(self):
        self.type_registry = self._initialize_type_registry()
        self.type_compatibility = self._build_compatibility_matrix()
    
    def _initialize_type_registry(self) -> Dict[str, TypeInfo]:
        """Initialize the type registry with all supported types"""
        return {
            # Basic types
            'string': TypeInfo('string', TypeCategory.BASIC, str, ['string', 'any'], 'Text string'),
            'number': TypeInfo('number', TypeCategory.BASIC, (int, float), ['number', 'integer', 'float', 'any'], 'Numeric value'),
            'integer': TypeInfo('integer', TypeCategory.BASIC, int, ['integer', 'number', 'any'], 'Integer value'),
            'float': TypeInfo('float', TypeCategory.BASIC, float, ['float', 'number', 'any'], 'Floating point value'),
            'boolean': TypeInfo('boolean', TypeCategory.BASIC, bool, ['boolean', 'any'], 'Boolean value'),
            'null': TypeInfo('null', TypeCategory.BASIC, type(None), ['null', 'any'], 'Null value'),
            
            # Collection types
            'list': TypeInfo('list', TypeCategory.COLLECTION, list, ['list', 'array', 'any'], 'List of items'),
            'array': TypeInfo('array', TypeCategory.COLLECTION, list, ['array', 'list', 'any'], 'Array of items'),
            'tuple': TypeInfo('tuple', TypeCategory.COLLECTION, tuple, ['tuple', 'list', 'array', 'any'], 'Tuple of items'),
            'set': TypeInfo('set', TypeCategory.COLLECTION, set, ['set', 'list', 'array', 'any'], 'Set of items'),
            'dict': TypeInfo('dict', TypeCategory.COLLECTION, dict, ['dict', 'object', 'any'], 'Dictionary'),
            'object': TypeInfo('object', TypeCategory.COLLECTION, dict, ['object', 'dict', 'any'], 'Object'),
            
            # Special types
            'file': TypeInfo('file', TypeCategory.SPECIAL, 'file', ['file', 'any'], 'File object'),
            'image': TypeInfo('image', TypeCategory.SPECIAL, 'image', ['image', 'file', 'any'], 'Image file'),
            'audio': TypeInfo('audio', TypeCategory.SPECIAL, 'audio', ['audio', 'file', 'any'], 'Audio file'),
            'video': TypeInfo('video', TypeCategory.SPECIAL, 'video', ['video', 'file', 'any'], 'Video file'),
            'dataframe': TypeInfo('dataframe', TypeCategory.SPECIAL, 'pandas.DataFrame', ['dataframe', 'object', 'any'], 'Pandas DataFrame'),
            'tensor': TypeInfo('tensor', TypeCategory.SPECIAL, 'torch.Tensor', ['tensor', 'numpy_array', 'any'], 'PyTorch Tensor'),
            'numpy_array': TypeInfo('numpy_array', TypeCategory.SPECIAL, 'numpy.ndarray', ['numpy_array', 'tensor', 'any'], 'NumPy Array'),
            
            # Universal type
            'any': TypeInfo('any', TypeCategory.BASIC, object, ['any'], 'Any type')
        }
    
    def _build_compatibility_matrix(self) -> Dict[str, List[str]]:
        """Build the type compatibility matrix"""
        matrix = {}
        for type_name, type_info in self.type_registry.items():
            matrix[type_name] = type_info.compatible_types
        return matrix
    
    def are_types_compatible(self, output_type: str, input_type: str) -> bool:
        """Check if two types are compatible for connection"""
        if output_type not in self.type_registry or input_type not in self.type_registry:
            return False
        
        if output_type == 'any' or input_type == 'any':
            return True
        
        compatible_types = self.type_compatibility.get(output_type, [])
        return input_type in compatible_types
    
    def get_compatible_types(self, output_type: str) -> List[str]:
        """Get all compatible types for a given output type"""
        if output_type not in self.type_registry:
            return []
        return self.type_compatibility.get(output_type, [])
    
    def validate_node_connection(self, source_node: dict, target_node: dict) -> dict:
        """Validate if two nodes can be connected based on their types"""
        source_outputs = source_node.get('outputs', [])
        target_inputs = target_node.get('inputs', [])
        
        valid_connections = []
        invalid_connections = []
        
        for output in source_outputs:
            for input_port in target_inputs:
                is_compatible = self.are_types_compatible(output['type'], input_port['type'])
                
                connection_info = {
                    'source_output': output,
                    'target_input': input_port,
                    'compatible': is_compatible
                }
                
                if is_compatible:
                    connection_info['reason'] = 'Types are compatible'
                    valid_connections.append(connection_info)
                else:
                    connection_info['reason'] = f"Cannot connect {output['type']} to {input_port['type']}"
                    connection_info['suggestions'] = self.get_compatible_types(output['type'])
                    invalid_connections.append(connection_info)
        
        return {
            'valid': len(valid_connections) > 0,
            'valid_connections': valid_connections,
            'invalid_connections': invalid_connections,
            'can_connect': len(valid_connections) > 0
        }
    
    def infer_type_from_value(self, value: Any) -> str:
        """Infer the type from a Python value"""
        if value is None:
            return 'null'
        elif isinstance(value, bool):
            return 'boolean'
        elif isinstance(value, int):
            return 'integer'
        elif isinstance(value, float):
            return 'float'
        elif isinstance(value, str):
            return 'string'
        elif isinstance(value, list):
            return 'list'
        elif isinstance(value, tuple):
            return 'tuple'
        elif isinstance(value, set):
            return 'set'
        elif isinstance(value, dict):
            return 'dict'
        else:
            return 'object'
    
    def validate_type_annotation(self, annotation: str) -> bool:
        """Validate if a type annotation is supported"""
        return annotation in self.type_registry
```

### Workflow Validation Service

```python
# backend/app/services/workflow_validation_service.py
from typing import List, Dict, Any
from .type_validation_service import TypeValidationService

class WorkflowValidationService:
    def __init__(self):
        self.type_validator = TypeValidationService()
    
    def validate_workflow_connections(self, workflow_data: dict) -> dict:
        """Validate all connections in a workflow"""
        nodes = workflow_data.get('nodes', [])
        connections = workflow_data.get('connections', [])
        
        validation_results = {
            'valid': True,
            'errors': [],
            'warnings': [],
            'connection_validations': []
        }
        
        for connection in connections:
            source_node_id = connection['source']['nodeId']
            target_node_id = connection['target']['nodeId']
            
            source_node = self._find_node_by_id(nodes, source_node_id)
            target_node = self._find_node_by_id(nodes, target_node_id)
            
            if not source_node or not target_node:
                validation_results['errors'].append({
                    'type': 'missing_node',
                    'message': f"Node not found for connection {source_node_id} -> {target_node_id}"
                })
                validation_results['valid'] = False
                continue
            
            # Validate connection types
            connection_validation = self.type_validator.validate_node_connection(
                source_node, target_node
            )
            
            validation_results['connection_validations'].append({
                'connection': connection,
                'validation': connection_validation
            })
            
            if not connection_validation['can_connect']:
                validation_results['errors'].append({
                    'type': 'incompatible_types',
                    'message': f"Incompatible types in connection {source_node_id} -> {target_node_id}",
                    'details': connection_validation['invalid_connections']
                })
                validation_results['valid'] = False
        
        return validation_results
    
    def _find_node_by_id(self, nodes: List[dict], node_id: str) -> dict:
        """Find a node by its ID"""
        for node in nodes:
            if node['id'] == node_id:
                return node
        return None
    
    def get_workflow_errors(self, workflow_data: dict) -> List[dict]:
        """Get all validation errors in a workflow"""
        validation = self.validate_workflow_connections(workflow_data)
        return validation['errors']
    
    def can_execute_workflow(self, workflow_data: dict) -> bool:
        """Check if a workflow can be executed (all connections valid)"""
        validation = self.validate_workflow_connections(workflow_data)
        return validation['valid']
```

## API Endpoints

### Type Validation Endpoints

```python
# backend/app/api/type_validation.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from ..services.type_validation_service import TypeValidationService

router = APIRouter(prefix="/api/type-validation", tags=["type-validation"])

class TypeValidationRequest(BaseModel):
    output_type: str
    input_type: str

class TypeValidationResponse(BaseModel):
    compatible: bool
    reason: str
    suggestions: List[str] = []

class NodeConnectionRequest(BaseModel):
    source_node: Dict[str, Any]
    target_node: Dict[str, Any]

class NodeConnectionResponse(BaseModel):
    can_connect: bool
    valid_connections: List[Dict[str, Any]]
    invalid_connections: List[Dict[str, Any]]
    errors: List[str] = []

@router.post("/validate-types", response_model=TypeValidationResponse)
async def validate_types(request: TypeValidationRequest):
    """Validate if two types are compatible"""
    validator = TypeValidationService()
    
    compatible = validator.are_types_compatible(request.output_type, request.input_type)
    
    response = TypeValidationResponse(
        compatible=compatible,
        reason="Types are compatible" if compatible else f"Cannot connect {request.output_type} to {request.input_type}"
    )
    
    if not compatible:
        response.suggestions = validator.get_compatible_types(request.output_type)
    
    return response

@router.post("/validate-connection", response_model=NodeConnectionResponse)
async def validate_node_connection(request: NodeConnectionRequest):
    """Validate if two nodes can be connected"""
    validator = TypeValidationService()
    
    validation = validator.validate_node_connection(
        request.source_node, request.target_node
    )
    
    return NodeConnectionResponse(
        can_connect=validation['can_connect'],
        valid_connections=validation['valid_connections'],
        invalid_connections=validation['invalid_connections']
    )

@router.get("/compatible-types/{output_type}")
async def get_compatible_types(output_type: str):
    """Get all compatible types for a given output type"""
    validator = TypeValidationService()
    compatible_types = validator.get_compatible_types(output_type)
    
    return {
        "output_type": output_type,
        "compatible_types": compatible_types
    }

@router.get("/supported-types")
async def get_supported_types():
    """Get all supported types"""
    validator = TypeValidationService()
    
    return {
        "types": list(validator.type_registry.keys()),
        "categories": {
            "basic": [name for name, info in validator.type_registry.items() if info.category.value == "basic"],
            "collection": [name for name, info in validator.type_registry.items() if info.category.value == "collection"],
            "special": [name for name, info in validator.type_registry.items() if info.category.value == "special"]
        }
    }
```

## Frontend Integration

### Connection Blocking

```typescript
// frontend/src/composables/useConnectionBlocking.ts
export function useConnectionBlocking() {
  const { validateNodeConnection } = useNodeConnection();
  
  /**
   * Block invalid connections in the workflow canvas
   */
  const blockInvalidConnections = (sourceNode: Node, targetNode: Node): boolean => {
    const validation = validateNodeConnection(sourceNode, targetNode);
    
    if (!validation.canConnect) {
      // Show error message
      showConnectionError(validation.invalidConnections);
      return false;
    }
    
    return true;
  };
  
  /**
   * Show connection error with suggestions
   */
  const showConnectionError = (invalidConnections: InvalidConnection[]) => {
    const errorMessages = invalidConnections.map(conn => 
      `Cannot connect ${conn.sourceOutput.type} to ${conn.targetInput.type}`
    );
    
    // Show error notification
    ElMessage.error({
      message: errorMessages.join('\n'),
      duration: 5000
    });
  };
  
  /**
   * Validate connection on drag
   */
  const validateConnectionOnDrag = (sourceNode: Node, targetNode: Node) => {
    const validation = validateNodeConnection(sourceNode, targetNode);
    
    // Update visual feedback
    updateConnectionVisualFeedback(validation);
    
    return validation.canConnect;
  };
  
  /**
   * Update visual feedback for connection validation
   */
  const updateConnectionVisualFeedback = (validation: ConnectionValidation) => {
    // Update connection line color/style based on validation
    const connectionElement = document.querySelector('.connection-line');
    if (connectionElement) {
      if (validation.valid) {
        connectionElement.classList.add('valid-connection');
        connectionElement.classList.remove('invalid-connection');
      } else {
        connectionElement.classList.add('invalid-connection');
        connectionElement.classList.remove('valid-connection');
      }
    }
  };
  
  return {
    blockInvalidConnections,
    validateConnectionOnDrag,
    showConnectionError
  };
}
```

### Visual Feedback Components

```vue
<!-- frontend/src/components/ConnectionValidation/ConnectionIndicator.vue -->
<template>
  <div class="connection-indicator" :class="indicatorClass">
    <div class="indicator-icon">
      <i :class="iconClass"></i>
    </div>
    <div class="indicator-message">
      {{ message }}
    </div>
    <div v-if="showSuggestions" class="suggestions">
      <div class="suggestion-title">Compatible types:</div>
      <div class="suggestion-list">
        <span 
          v-for="suggestion in suggestions" 
          :key="suggestion"
          class="suggestion-item"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  validation: ConnectionValidation;
  showSuggestions?: boolean;
}>();

const emit = defineEmits<{
  suggestionSelected: [type: string];
}>();

const indicatorClass = computed(() => ({
  'valid': props.validation.valid,
  'invalid': !props.validation.valid
}));

const iconClass = computed(() => 
  props.validation.valid ? 'fas fa-check' : 'fas fa-times'
);

const message = computed(() => 
  props.validation.valid ? 'Types are compatible' : 'Types are incompatible'
);

const suggestions = computed(() => 
  props.validation.invalidConnections?.[0]?.suggestions || []
);

const selectSuggestion = (type: string) => {
  emit('suggestionSelected', type);
};
</script>

<style scoped>
.connection-indicator {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  max-width: 300px;
}

.connection-indicator.valid {
  border-color: #4caf50;
  background: #f1f8e9;
}

.connection-indicator.invalid {
  border-color: #f44336;
  background: #ffebee;
}

.indicator-icon {
  margin-bottom: 4px;
}

.indicator-icon.valid {
  color: #4caf50;
}

.indicator-icon.invalid {
  color: #f44336;
}

.suggestions {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
}

.suggestion-title {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
}

.suggestion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.suggestion-item {
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 11px;
  cursor: pointer;
  transition: background 0.2s;
}

.suggestion-item:hover {
  background: #bbdefb;
}
</style>
```

## Error Handling and User Experience

### Connection Error Messages

```typescript
// frontend/src/utils/connectionErrors.ts
export const CONNECTION_ERROR_MESSAGES = {
  INCOMPATIBLE_TYPES: (outputType: string, inputType: string) => 
    `Cannot connect ${outputType} output to ${inputType} input`,
  
  MISSING_TYPE: (nodeName: string) => 
    `Node "${nodeName}" has undefined type`,
  
  UNSUPPORTED_TYPE: (type: string) => 
    `Type "${type}" is not supported`,
  
  NO_COMPATIBLE_CONNECTIONS: (sourceNode: string, targetNode: string) => 
    `No compatible connections between "${sourceNode}" and "${targetNode}"`
};

export const getConnectionError = (error: ConnectionError): string => {
  switch (error.type) {
    case 'incompatible_types':
      return CONNECTION_ERROR_MESSAGES.INCOMPATIBLE_TYPES(
        error.outputType, 
        error.inputType
      );
    case 'missing_type':
      return CONNECTION_ERROR_MESSAGES.MISSING_TYPE(error.nodeName);
    case 'unsupported_type':
      return CONNECTION_ERROR_MESSAGES.UNSUPPORTED_TYPE(error.type);
    case 'no_compatible_connections':
      return CONNECTION_ERROR_MESSAGES.NO_COMPATIBLE_CONNECTIONS(
        error.sourceNode, 
        error.targetNode
      );
    default:
      return 'Unknown connection error';
  }
};
```

### Type Conversion Suggestions

```typescript
// frontend/src/utils/typeConversion.ts
export const TYPE_CONVERSION_SUGGESTIONS = {
  'list_to_array': {
    from: 'list',
    to: 'array',
    suggestion: 'Use list() to convert array to list',
    code: 'list(array_data)'
  },
  'dict_to_object': {
    from: 'dict',
    to: 'object',
    suggestion: 'Use dict() to convert object to dictionary',
    code: 'dict(object_data)'
  },
  'number_to_integer': {
    from: 'number',
    to: 'integer',
    suggestion: 'Use int() to convert number to integer',
    code: 'int(number_data)'
  },
  'number_to_float': {
    from: 'number',
    to: 'float',
    suggestion: 'Use float() to convert number to float',
    code: 'float(number_data)'
  }
};

export const getTypeConversionSuggestion = (
  fromType: string, 
  toType: string
): TypeConversionSuggestion | null => {
  const key = `${fromType}_to_${toType}`;
  return TYPE_CONVERSION_SUGGESTIONS[key] || null;
};
```

## Testing

### Type Validation Tests

```python
# backend/tests/test_type_validation.py
import pytest
from app.services.type_validation_service import TypeValidationService

class TestTypeValidationService:
    def setup_method(self):
        self.validator = TypeValidationService()
    
    def test_basic_type_compatibility(self):
        """Test basic type compatibility"""
        assert self.validator.are_types_compatible('string', 'string') == True
        assert self.validator.are_types_compatible('number', 'integer') == True
        assert self.validator.are_types_compatible('integer', 'number') == True
        assert self.validator.are_types_compatible('boolean', 'boolean') == True
    
    def test_collection_type_compatibility(self):
        """Test collection type compatibility"""
        assert self.validator.are_types_compatible('list', 'array') == True
        assert self.validator.are_types_compatible('array', 'list') == True
        assert self.validator.are_types_compatible('dict', 'object') == True
        assert self.validator.are_types_compatible('object', 'dict') == True
    
    def test_incompatible_types(self):
        """Test incompatible type combinations"""
        assert self.validator.are_types_compatible('string', 'number') == False
        assert self.validator.are_types_compatible('list', 'dict') == False
        assert self.validator.are_types_compatible('boolean', 'string') == False
    
    def test_any_type_compatibility(self):
        """Test 'any' type compatibility"""
        assert self.validator.are_types_compatible('any', 'string') == True
        assert self.validator.are_types_compatible('string', 'any') == True
        assert self.validator.are_types_compatible('any', 'any') == True
    
    def test_get_compatible_types(self):
        """Test getting compatible types"""
        compatible = self.validator.get_compatible_types('string')
        assert 'string' in compatible
        assert 'any' in compatible
        
        compatible = self.validator.get_compatible_types('list')
        assert 'list' in compatible
        assert 'array' in compatible
        assert 'any' in compatible
    
    def test_node_connection_validation(self):
        """Test node connection validation"""
        source_node = {
            'outputs': [{'name': 'data', 'type': 'list'}]
        }
        target_node = {
            'inputs': [{'name': 'input', 'type': 'array'}]
        }
        
        validation = self.validator.validate_node_connection(source_node, target_node)
        assert validation['can_connect'] == True
        assert len(validation['valid_connections']) > 0
        assert len(validation['invalid_connections']) == 0
```

### Frontend Type Validation Tests

```typescript
// frontend/tests/unit/TypeValidationService.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { TypeValidationService } from '@/services/TypeValidationService';

describe('TypeValidationService', () => {
  let validator: TypeValidationService;

  beforeEach(() => {
    validator = new TypeValidationService();
  });

  it('should validate compatible types', () => {
    expect(validator.areTypesCompatible('string', 'string')).toBe(true);
    expect(validator.areTypesCompatible('number', 'integer')).toBe(true);
    expect(validator.areTypesCompatible('list', 'array')).toBe(true);
  });

  it('should reject incompatible types', () => {
    expect(validator.areTypesCompatible('string', 'number')).toBe(false);
    expect(validator.areTypesCompatible('list', 'dict')).toBe(false);
    expect(validator.areTypesCompatible('boolean', 'string')).toBe(false);
  });

  it('should handle any type compatibility', () => {
    expect(validator.areTypesCompatible('any', 'string')).toBe(true);
    expect(validator.areTypesCompatible('string', 'any')).toBe(true);
  });

  it('should get compatible types', () => {
    const compatible = validator.getCompatibleTypes('string');
    expect(compatible).toContain('string');
    expect(compatible).toContain('any');
  });

  it('should validate node connections', () => {
    const sourceNode = {
      outputs: [{ name: 'data', type: 'list' }]
    };
    const targetNode = {
      inputs: [{ name: 'input', type: 'array' }]
    };

    const validation = validator.validateConnection(sourceNode, targetNode);
    expect(validation.valid).toBe(true);
    expect(validation.results.length).toBeGreaterThan(0);
  });
});
```

## Summary

The type-based node linking system ensures:

1. **Type Safety**: Only compatible types can be connected
2. **Visual Feedback**: Clear indication of valid/invalid connections
3. **Error Prevention**: Block invalid connections before execution
4. **User Guidance**: Provide suggestions for compatible types
5. **Extensibility**: Support for custom types and type hierarchies

This system provides a robust foundation for reliable workflow execution while maintaining an intuitive user experience. 