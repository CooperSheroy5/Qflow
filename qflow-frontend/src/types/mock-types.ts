// Type definitions for Qflow standalone frontend
// These replace the n8n types that are not available in the isolated frontend

export interface IRestApiContext {
  baseUrl: string;
  sessionId?: string;
  apiKey?: string;
}

export interface IDataObject {
  [key: string]: any;
}

export interface ExecutionFilters {
  [key: string]: any;
}

export interface ExecutionOptions {
  [key: string]: any;
}

export interface ExecutionSummary {
  id: string;
  workflowId: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
}

export interface IWorkflowDb {
  id: string;
  name: string;
  description?: string;
  nodes: any[];
  connections: any;
  settings: any;
  active: boolean;
  python_version?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewWorkflowResponse {
  name: string;
  defaultSettings: any;
}

export interface WorkflowListResource {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IExecutionResponse {
  id: string;
  workflowId: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  data?: any;
  error?: string;
}

export interface IExecutionsCurrentSummaryExtended {
  id: string;
  workflowId: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
}

export interface FolderCreateResponse {
  id: string;
  name: string;
  parentFolderId?: string;
}

export interface FolderTreeResponseItem {
  id: string;
  name: string;
  parentFolderId?: string;
  children?: FolderTreeResponseItem[];
}

export interface IUsedCredential {
  id: string;
  name: string;
  type: string;
}

export interface ChangeLocationSearchResponseItem {
  id: string;
  name: string;
  type: string;
} 