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

### Development Setup

1. Clone or download this repository
2. Open the folder in VS Code
3. Install dependencies: `npm install`
4. Compile TypeScript: `npm run compile`
5. Press `F5` to run the extension in a new Extension Development Host window

### Building for Distribution

1. Install `vsce` (Visual Studio Code Extension manager): `npm install -g @vscode/vsce`
2. Package the extension: `vsce package`
3. Install the generated `.vsix` file: `code --install-extension mcp-json-manager-0.0.1.vsix`

## Project Structure

```
mcp-json-manager/
├── src/
│   └── extension.ts          # Main extension code
├── package.json              # Extension manifest
├── tsconfig.json            # TypeScript configuration
├── README.md                # This file
└── out/                     # Compiled JavaScript (generated)
    └── extension.js
```

## Requirements

- VS Code 1.74.0 or higher
- Node.js (for development)
- TypeScript (for development)

## Extension Activation

The extension activates when:
- You run the "Open MCP Manager" command
- You work with `.mcp.json` files
- You have workspace folders open (for the tree view)

## Features in Detail

### Smart File Discovery
- Automatically finds MCP configuration files in common locations
- Updates the tree view when files are added/removed
- Supports multiple workspace folders

### Form Validation
- Ensures required fields (like command) are not empty
- Filters out empty values when saving
- Provides helpful error messages

### Interactive Elements
- Browse buttons for file and folder selection
- Add/remove buttons for dynamic arrays
- Real-time form updates
- JSON preview functionality

### VS Code Integration
- Uses VS Code's native file dialogs
- Follows VS Code theming
- Integrates with Explorer sidebar
- Context menu integration

## Troubleshooting

### Common Issues

1. **Extension not activating**
   - Make sure you have workspace folders open
   - Try running the "Open MCP Manager" command manually

2. **Configuration not loading**
   - Verify the JSON file syntax is valid
   - Check file permissions
   - Ensure the file path is correct

3. **Styling issues**
   - The webview uses VS Code's CSS variables for theming
   - Try restarting VS Code if styles don't load properly

### Debug Mode

To enable debug logging:
1. Open VS Code Developer Tools (`Help > Toggle Developer Tools`)
2. Check the Console tab for extension logs
3. Look for messages starting with "MCP JSON Manager"

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test the extension thoroughly
5. Submit a pull request

### Development Tips

- Use `npm run watch` for continuous compilation during development
- The webview HTML is embedded in the TypeScript file for simplicity
- VS Code's webview API handles security and sandboxing automatically
- Test with various MCP configuration formats to ensure compatibility

## Roadmap

- [ ] Validation for common MCP server configurations
- [ ] Templates for popular MCP servers
- [ ] Import/export functionality
- [ ] Server status checking
- [ ] Configuration backup and restore
- [ ] Multi-configuration file support
- [ ] Syntax highlighting in JSON preview
- [ ] Drag-and-drop reordering of servers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter issues or have feature requests:
1. Check the troubleshooting section above
2. Search existing issues on the repository
3. Create a new issue with detailed information about your problem

## Changelog

### 0.0.1 (Initial Release)
- Basic MCP configuration management
- Visual form interface
- File browsing capabilities
- JSON preview functionality
- Tree view integration
- Context menu support