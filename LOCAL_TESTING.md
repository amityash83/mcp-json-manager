# 🧪 Local Testing Guide

This guide explains how to test your MCP JSON Manager extension locally before publishing to the marketplace.

## 🚀 Quick Start Testing

### 1. Build the Extension Locally

```bash
# Compile TypeScript
npm run compile

# Package the extension (creates .vsix file)
npm run package

# This creates: mcp-json-manager-0.0.1.vsix
```

### 2. Install in VS Code for Testing

```bash
# Install the extension locally
code --install-extension mcp-json-manager-0.0.1.vsix

# Or use the npm script
npm run install:local
```

### 3. Test the Extension

1. **Restart VS Code** after installation
2. **Open Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. **Search for "MCP"** - you should see "MCP: Open MCP Manager"
4. **Test the functionality** with sample MCP files

## 🔧 Development Workflow

### Watch Mode Development

```bash
# Start watch mode (rebuilds on changes)
npm run watch

# In another terminal, repackage and reinstall after changes
npm run package && npm run install:local
```

### Manual Testing Steps

1. **Create test MCP file**:
   ```bash
   mkdir -p .vscode
   cat > .vscode/mcp.json << 'EOF'
   {
     "mcpServers": {
       "test-server": {
         "command": ["node", "server.js"],
         "args": ["--port", "3000"]
       }
     }
   }
   EOF
   ```

2. **Test Context Menu**:
   - Right-click on the `mcp.json` file
   - Look for "Open MCP Manager" option

3. **Test Tree View**:
   - Check Explorer sidebar for "MCP Configurations" section

## 🔍 Debugging

### Enable Extension Debugging

1. Open the extension project in VS Code
2. Press `F5` to launch Extension Development Host
3. Test your extension in the new window
4. Check the Debug Console for logs

### View Extension Logs

```bash
# View VS Code extension logs
code --log-level debug

# Check installed extensions
code --list-extensions --show-versions | grep mcp
```

### Common Issues and Fixes

| Issue | Solution |
|-------|----------|
| Extension not appearing | Restart VS Code after installation |
| Commands not found | Check `contributes.commands` in package.json |
| UI not loading | Check webview console for JavaScript errors |
| File detection not working | Verify file pattern matching in `when` clauses |

## 📦 CI/CD Testing

### Automated Test Builds

Every push to `main` or `develop` creates a test artifact:

1. **Check GitHub Actions** tab in your repository
2. **Download the artifact** from successful builds
3. **Install and test** the downloaded `.vsix` file

### GitHub Actions Artifact Testing

```bash
# Download artifact from GitHub Actions
# Install the downloaded file
code --install-extension downloaded-artifact.vsix
```

## 🛠️ Publisher Setup (When Ready)

When you're ready to publish, you'll need:

### 1. Create Azure DevOps Account
- Go to [dev.azure.com](https://dev.azure.com)
- Sign in with Microsoft account
- Create Personal Access Token with Marketplace scope

### 2. Create VS Code Publisher Account
- Go to [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
- Create publisher with unique ID

### 3. Configure GitHub Secrets
Add these secrets to your repository:
- `VSCE_PAT` - Your Azure DevOps Personal Access Token
- `PUBLISHER_NAME` - Your marketplace publisher ID

### 4. Update package.json
Replace `"publisher": "test-publisher"` with your real publisher name.

## ✅ Testing Checklist

Before publishing, verify:

- [ ] Extension installs without errors
- [ ] Command palette shows MCP commands
- [ ] Context menus appear on MCP files
- [ ] Tree view displays MCP configurations
- [ ] Webview opens and displays form
- [ ] Form validation works
- [ ] File operations (load/save) work
- [ ] No console errors in webview
- [ ] Extension activates on command execution
- [ ] All UI elements are properly styled

## 🎯 Testing Scenarios

### Basic Functionality
1. Install extension
2. Create sample MCP file
3. Open MCP Manager
4. Add/edit/remove servers
5. Save configuration
6. Verify JSON output

### Edge Cases
1. Invalid JSON files
2. Missing MCP files
3. Permission errors
4. Large configuration files
5. Special characters in server names

### UI Testing
1. Form validation
2. File browser dialogs
3. Dynamic array operations
4. Environment variable management
5. JSON preview functionality

## 📊 Performance Testing

```bash
# Time extension loading
time code --install-extension mcp-json-manager-0.0.1.vsix

# Monitor memory usage
# Use VS Code's built-in performance tools
# Developer: Show Running Extensions command
```

## 🔄 Uninstalling for Clean Testing

```bash
# Uninstall the extension
code --uninstall-extension test-publisher.mcp-json-manager

# Clear extension data (optional)
rm -rf ~/.vscode/extensions/test-publisher.mcp-json-manager-*
```

This testing approach lets you validate all functionality before committing to marketplace publication! 🚀