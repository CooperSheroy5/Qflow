# Qflow Frontend - Standalone Version

## Overview

This is the isolated frontend for Qflow, a Python-first workflow orchestration platform. The frontend has been separated from the n8n backend and now runs with mock API responses, allowing the frontend team to work independently.

## Key Changes from n8n

### 1. **Branding Changes**
- All "n8n" references changed to "Qflow"
- Updated package name: `qflow-editor-ui`
- Updated theme file: `qflow-theme.scss`

### 2. **API Integration**
- **Mock API Service**: `src/api/mock-api.ts` provides dummy responses for all API calls
- **Type Definitions**: `src/types/mock-types.ts` contains local type definitions
- **No Backend Dependencies**: Frontend can run completely standalone

### 3. **Python Node Support**
- Added support for Python nodes (`qflow.python` type)
- Mock data includes sample Python workflows
- Type system support for Python data types

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation
```bash
cd qflow-frontend
pnpm install
```

### Development
```bash
# Start development server
pnpm dev

# The app will be available at http://localhost:8080
```

### Building
```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
qflow-frontend/
├── src/
│   ├── api/
│   │   ├── mock-api.ts          # Mock API service
│   │   ├── workflows.ts         # Workflow API calls
│   │   └── ...                  # Other API modules
│   ├── types/
│   │   └── mock-types.ts        # Local type definitions
│   ├── components/              # Vue components
│   ├── views/                   # Page components
│   ├── stores/                  # Pinia stores
│   ├── composables/             # Vue composables
│   ├── utils/                   # Utility functions
│   ├── styles/                  # Styling
│   ├── main.ts                  # App entry point
│   ├── router.ts               # Vue Router configuration
│   └── qflow-theme.scss        # Qflow theme styles
├── public/                     # Static assets
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.mts            # Vite configuration
└── README.md                  # This file
```

## Mock Data

The frontend includes comprehensive mock data for testing:

### Sample Workflows
- **Sample Python Workflow**: Contains two Python nodes with sample code
- **Workflow with Connections**: Demonstrates node linking
- **Different Python Versions**: Shows version selection

### Mock API Responses
- **Workflows**: CRUD operations with realistic data
- **Executions**: Execution history and status
- **Users**: User management and authentication
- **Containers**: Docker container management
- **Types**: Python type system
- **Health Checks**: System status monitoring

## API Endpoints

All API endpoints are documented in `API_ENDPOINTS.md`. The mock service implements:

### Core Endpoints
- `GET /workflows` - List workflows
- `POST /workflows` - Create workflow
- `GET /workflows/:id` - Get workflow
- `PATCH /workflows/:id` - Update workflow
- `DELETE /workflows/:id` - Delete workflow

### Python-Specific Endpoints
- `POST /nodes/python/validate` - Validate Python code
- `POST /nodes/python/execute` - Execute Python node
- `GET /types` - Get type definitions
- `POST /types/compatibility/check` - Check type compatibility

### Container Management
- `GET /containers` - List containers
- `POST /containers/:id/dependencies` - Install dependencies
- `GET /containers/:id/resources` - Get resource usage

## Development Guidelines

### 1. **Adding New Features**
- Create components in `src/components/`
- Add API calls in `src/api/`
- Update mock data in `src/api/mock-api.ts`

### 2. **Python Node Development**
- Focus on the Python node editor
- Implement type validation UI
- Add Python code syntax highlighting
- Create node testing interface

### 3. **Workflow Editor**
- Enhance the drag-and-drop interface
- Add Python node specific properties
- Implement type-based node linking
- Add execution monitoring

### 4. **Styling**
- Use the existing design system
- Update `qflow-theme.scss` for Qflow branding
- Maintain consistency with the original n8n design

### 5. **Testing**
- Add unit tests for new components
- Test Python node functionality
- Verify type system integration
- Test workflow execution flow

## Integration with Backend

When the backend is ready:

1. **Replace Mock API**: Update `src/api/mock-api.ts` to use real API calls
2. **Update Types**: Replace mock types with real backend types
3. **Environment Configuration**: Set up proper API endpoints
4. **Authentication**: Implement real user authentication

## Key Features to Implement

### 1. **Python Node Editor**
- Code editor with syntax highlighting
- Function selection dropdown
- Type inference and validation
- Dependency management UI

### 2. **Type System UI**
- Type compatibility visualization
- Type conversion options
- Custom type creation
- Type validation feedback

### 3. **Container Management**
- Python version selection
- Dependency installation progress
- Resource usage monitoring
- Container status display

### 4. **Workflow Execution**
- Real-time execution monitoring
- Progress indicators
- Error handling and display
- Execution logs

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Check `tsconfig.json` configuration
2. **Import Errors**: Verify path mappings in `tsconfig.json`
3. **Styling Issues**: Check `qflow-theme.scss` imports
4. **API Errors**: Review mock API implementation

### Development Tips

1. **Hot Reload**: The dev server supports hot reload for most changes
2. **Mock Data**: Modify `mock-api.ts` to test different scenarios
3. **TypeScript**: Use strict mode for better type safety
4. **Vue DevTools**: Install Vue DevTools for debugging

## Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include unit tests for new features
4. Update documentation as needed
5. Maintain consistency with the design system

## Next Steps

1. **Set up development environment**
2. **Explore the mock data and API structure**
3. **Start with Python node editor development**
4. **Implement type system UI components**
5. **Add workflow execution monitoring**
6. **Test and refine the user experience**

The frontend is now ready for independent development while the backend team works on the API implementation!
