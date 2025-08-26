# MCP JSON Manager for VS Code

A Visual Studio Code extension that provides a user-friendly GUI for managing MCP (Model Context Protocol) JSON configurations, eliminating the need to manually edit JSON files or use command palette commands.

## Features

- **Visual Form Interface**: Manage MCP configurations through an intuitive web-based form instead of raw JSON editing
- **File Management**: Browse and select configuration files, working directories, and executables
- **Server Management**: Add, remove, and configure MCP servers with ease
- **Dynamic Arrays**: Manage command arguments and environment variables with add/remove functionality
- **JSON Preview**: Preview the generated JSON configuration before saving
- **Workspace Integration**: Automatically discovers MCP configuration files in your workspace
- **Tree View**: View all MCP configurations in the Explorer sidebar

## Usage

### Opening the MCP Manager

1. **From Command Palette**: 
   - Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
   - Type "MCP: Open MCP Manager"

2. **From Context Menu**:
   - Right-click on any `.mcp.json` file in the Explorer
   - Select "Open MCP Manager"

3. **From Editor**:
   - Open any `.mcp.json` file
   - Click the "Open MCP Manager" button in the editor toolbar

4. **From Tree View**:
   - Check the "MCP Configurations" section in the Explorer sidebar
   - Click on any discovered configuration file

### Managing MCP Servers

1. **Load Configuration**:
   - Specify the path to your MCP configuration file
   - Click "Browse" to select a file or "Load" to load the specified path

2. **Add Servers**:
   - Click "Add Server" and enter a unique server name
   - Configure the server properties using the form

3. **Configure Server Properties**:
   - **Command**: The executable command (required) - can be split into multiple parts
   - **Arguments**: Command-line arguments for the server
   - **Working Directory**: The directory to run the server in
   - **Environment Variables**: Key-value pairs for environment variables

4. **Save Configuration**:
   - Click "Save Configuration" to write the changes to the JSON file
   - Use "Preview JSON" to see the generated JSON before saving

### Server Configuration Fields

- **Command** (Required): The command to execute the MCP server
  - Example: `["python", "-m", "my_mcp_server"]` or `["node", "server.js"]`
- **Arguments**: Additional command-line arguments
- **Working Directory**: The directory where the server should run
- **Environment Variables**: Environment variables to set for the server process

## Configuration File Locations

The extension automatically searches for MCP configuration files in these common locations:

- `.mcp.json` (workspace root)
- `mcp.json` (workspace root)
- `.claude/mcp.json`
- `config/mcp.json`

## Example Configuration

```json
{
  "mcpServers": {
    "filesystem": {
      "command": ["python", "-m", "mcp_filesystem"],
      "args": ["--path", "/home/user/documents"],
      "cwd": "/home/user/mcp-servers",
      "env": {
        "DEBUG": "1",
        "LOG_LEVEL": "info"
      }
    },
    "web-search": {
      "command": ["node", "web-search-server.js"],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

## Installation

1. Clone or download this repository
2. Open the folder in VS Code
3. Install dependencies: `npm install`
4. Compile TypeScript