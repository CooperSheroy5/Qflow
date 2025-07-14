// Mock API Service for Qflow Frontend
// This service provides dummy responses for all API calls when running in standalone mode

import type { IRestApiContext } from '@/types/mock-types';

interface MockResponse {
  data?: any;
  count?: number;
  results?: any[];
  estimated?: boolean;
}

class MockApiService {
  private mockData = {
    workflows: [
      {
        id: '1',
        name: 'Sample Python Workflow',
        description: 'A sample workflow with Python nodes',
        nodes: [
          {
            id: 'node-1',
            type: 'qflow.python',
            position: [100, 100],
            data: {
              label: 'Data Processing',
              code: 'def process_data(data):\n    return {"processed": data}',
              python_version: '3.11'
            }
          },
          {
            id: 'node-2',
            type: 'qflow.python',
            position: [400, 100],
            data: {
              label: 'Data Analysis',
              code: 'def analyze_data(data):\n    return {"analysis": "complete"}',
              python_version: '3.11'
            }
          }
        ],
        connections: {
          'node-1': {
            outputs: {
              main: [
                {
                  node: 'node-2',
                  type: 'main',
                  index: 0
                }
              ]
            }
          }
        },
        settings: {},
        active: false,
        python_version: '3.11',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    executions: [
      {
        id: 'exec-1',
        workflowId: '1',
        status: 'completed',
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date().toISOString(),
        duration: 5000,
        data: {
          result: 'Workflow executed successfully'
        }
      }
    ],
    users: [
      {
        id: 'user-1',
        email: 'admin@qflow.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'owner',
        isOwner: true,
        isActive: true
      }
    ],
    credentials: [],
    containers: [
      {
        id: 'container-1',
        python_version: '3.11',
        status: 'running',
        created_at: new Date().toISOString(),
        resource_usage: {
          cpu_percent: 15.5,
          memory_bytes: 512000000
        }
      }
    ],
    types: [
      {
        id: 'type-1',
        name: 'list',
        category: 'collection',
        python_type: 'list',
        description: 'Python list type',
        is_builtin: true
      },
      {
        id: 'type-2',
        name: 'dict',
        category: 'collection',
        python_type: 'dict',
        description: 'Python dictionary type',
        is_builtin: true
      },
      {
        id: 'type-3',
        name: 'str',
        category: 'basic',
        python_type: 'str',
        description: 'Python string type',
        is_builtin: true
      },
      {
        id: 'type-4',
        name: 'int',
        category: 'basic',
        python_type: 'int',
        description: 'Python integer type',
        is_builtin: true
      }
    ]
  };

  // Generic mock request handler
  private async mockRequest<T>(
    method: string,
    endpoint: string,
    data?: any,
    params?: any
  ): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    const path = endpoint.replace(/^\//, '');
    const pathParts = path.split('/');

    switch (method) {
      case 'GET':
        return this.handleGetRequest(pathParts, params) as T;
      case 'POST':
        return this.handlePostRequest(pathParts, data) as T;
      case 'PATCH':
        return this.handlePatchRequest(pathParts, data) as T;
      case 'DELETE':
        return this.handleDeleteRequest(pathParts) as T;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }

  private handleGetRequest(pathParts: string[], params?: any): any {
    const [resource, id, action] = pathParts;

    switch (resource) {
      case 'workflows':
        if (id === 'new') {
          return {
            name: 'New Workflow',
            defaultSettings: {
              python_version: '3.11'
            }
          };
        }
        if (id) {
          return this.mockData.workflows.find(w => w.id === id);
        }
        return {
          data: this.mockData.workflows,
          count: this.mockData.workflows.length
        };

      case 'executions':
        if (id) {
          return this.mockData.executions.find(e => e.id === id);
        }
        return {
          count: this.mockData.executions.length,
          results: this.mockData.executions,
          estimated: false
        };

      case 'active-workflows':
        return this.mockData.workflows.filter(w => w.active).map(w => w.id);

      case 'users':
        if (id === 'me') {
          return this.mockData.users[0];
        }
        if (id) {
          return this.mockData.users.find(u => u.id === id);
        }
        return this.mockData.users;

      case 'credentials':
        if (id === 'types') {
          return [
            { name: 'httpBasicAuth', displayName: 'HTTP Basic Auth' },
            { name: 'httpHeaderAuth', displayName: 'HTTP Header Auth' },
            { name: 'oAuth2', displayName: 'OAuth2' }
          ];
        }
        return this.mockData.credentials;

      case 'nodes':
        if (id === 'python') {
          return {
            type: 'qflow.python',
            displayName: 'Python Node',
            description: 'Execute Python code in isolated containers',
            inputs: ['main'],
            outputs: ['main'],
            properties: {
              code: {
                type: 'string',
                displayName: 'Python Code',
                description: 'Python code to execute'
              },
              python_version: {
                type: 'string',
                displayName: 'Python Version',
                description: 'Python version to use',
                default: '3.11',
                options: ['3.8', '3.9', '3.10', '3.11', '3.12']
              }
            }
          };
        }
        return [];

      case 'types':
        if (id === 'compatibility') {
          return {
            matrix: [
              { source: 'str', target: 'int', compatible: false, conversion_required: true },
              { source: 'int', target: 'str', compatible: true, conversion_required: false },
              { source: 'list', target: 'dict', compatible: false, conversion_required: true }
            ]
          };
        }
        return { types: this.mockData.types };

      case 'containers':
        if (id) {
          return this.mockData.containers.find(c => c.id === id);
        }
        return { containers: this.mockData.containers };

      case 'health':
        return {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          checks: {
            database: { status: 'healthy', response_time_ms: 5.2 },
            redis: { status: 'healthy', response_time_ms: 2.1 },
            docker: { status: 'healthy', active_containers: 1 },
            python_environments: { status: 'healthy', available_versions: ['3.8', '3.9', '3.10', '3.11', '3.12'] }
          }
        };

      case 'settings':
        return {
          python: {
            default_version: '3.11',
            available_versions: ['3.8', '3.9', '3.10', '3.11', '3.12']
          },
          containers: {
            max_memory: '1GB',
            max_cpu: '50%',
            timeout: 300
          }
        };

      default:
        return { message: `Mock response for ${resource}` };
    }
  }

  private handlePostRequest(pathParts: string[], data?: any): any {
    const [resource, id, action] = pathParts;

    switch (resource) {
      case 'workflows':
        const newWorkflow = {
          id: `wf-${Date.now()}`,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.mockData.workflows.push(newWorkflow);
        return newWorkflow;

      case 'executions':
        const newExecution = {
          id: `exec-${Date.now()}`,
          workflowId: id,
          status: 'running',
          startedAt: new Date().toISOString(),
          data: data
        };
        this.mockData.executions.push(newExecution);
        return newExecution;

      case 'nodes':
        if (id === 'python' && action === 'validate') {
          return {
            valid: true,
            errors: [],
            warnings: [],
            functions: ['process_data', 'analyze_data'],
            suggested_types: {
              input: 'dict',
              output: 'dict'
            }
          };
        }
        if (id === 'python' && action === 'execute') {
          return {
            success: true,
            output: { result: 'Python code executed successfully' },
            execution_time: 150,
            error: null
          };
        }
        break;

      case 'types':
        if (action === 'compatibility' && id === 'check') {
          return {
            compatible: true,
            conversion_required: false,
            conversion_method: null
          };
        }
        break;

      case 'containers':
        if (id && action === 'dependencies') {
          return {
            success: true,
            installed_packages: data.packages || [],
            failed_packages: [],
            installation_time: 5000
          };
        }
        break;

      case 'login':
        return {
          user: this.mockData.users[0],
          token: 'mock-jwt-token'
        };

      default:
        return { message: `Mock POST response for ${resource}` };
    }
  }

  private handlePatchRequest(pathParts: string[], data?: any): any {
    const [resource, id] = pathParts;

    switch (resource) {
      case 'workflows':
        const workflow = this.mockData.workflows.find(w => w.id === id);
        if (workflow) {
          Object.assign(workflow, data, { updatedAt: new Date().toISOString() });
          return workflow;
        }
        break;

      case 'users':
        const user = this.mockData.users.find(u => u.id === id);
        if (user) {
          Object.assign(user, data);
          return user;
        }
        break;

      default:
        return { message: `Mock PATCH response for ${resource}` };
    }
  }

  private handleDeleteRequest(pathParts: string[]): any {
    const [resource, id] = pathParts;

    switch (resource) {
      case 'workflows':
        const workflowIndex = this.mockData.workflows.findIndex(w => w.id === id);
        if (workflowIndex !== -1) {
          this.mockData.workflows.splice(workflowIndex, 1);
        }
        break;

      case 'executions':
        const executionIndex = this.mockData.executions.findIndex(e => e.id === id);
        if (executionIndex !== -1) {
          this.mockData.executions.splice(executionIndex, 1);
        }
        break;

      case 'containers':
        const containerIndex = this.mockData.containers.findIndex(c => c.id === id);
        if (containerIndex !== -1) {
          this.mockData.containers.splice(containerIndex, 1);
        }
        break;

      default:
        return { message: `Mock DELETE response for ${resource}` };
    }

    return { success: true };
  }

  // Public API methods that match the original API structure
  async makeRestApiRequest<T>(
    context: IRestApiContext,
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    return this.mockRequest<T>(method, endpoint, data);
  }

  async getFullApiResponse<T>(
    context: IRestApiContext,
    method: string,
    endpoint: string,
    params?: any
  ): Promise<{ data: T; count: number }> {
    const response = await this.mockRequest<{ data: T; count: number }>(
      method,
      endpoint,
      undefined,
      params
    );
    return response;
  }
}

// Create singleton instance
export const mockApiService = new MockApiService();

// Export mock functions that match the original API structure
export const makeRestApiRequest = mockApiService.makeRestApiRequest.bind(mockApiService);
export const getFullApiResponse = mockApiService.getFullApiResponse.bind(mockApiService); 