# 📦 Manual Installation Guide

This guide explains how to manually install the MCP JSON Manager extension on different operating systems.

## 📋 Prerequisites

Before installing, ensure you have:
- **VS Code** installed (version 1.74.0 or later)
- **Extension file** (.vsix) downloaded from [GitHub Releases](https://github.com/YOUR_USERNAME/mcp-json-manager/releases)

## 🖥️ Installation by Operating System

### 🪟 Windows

#### Method 1: Command Line (Recommended)
```cmd
# Open Command Prompt or PowerShell
# Navigate to the folder containing the .vsix file
cd C:\Path\To\Download\Folder

# Install the extension
code --install-extension mcp-json-manager-x.x.x.vsix
```

#### Method 2: VS Code GUI
1. **Open VS Code**
2. **Open Command Palette**: `Ctrl + Shift + P`
3. **Type**: `Extensions: Install from VSIX...`
4. **Browse** to your downloaded `.vsix` file
5. **Select** the file and click **Install**
6. **Restart VS Code** when prompted

#### Method 3: File Explorer
1. **Right-click** on the `.vsix` file
2. **Select** "Open with VS Code" (if available)
3. **Follow** the installation prompts

### 🐧 Linux

#### Method 1: Command Line (Recommended)
```bash
# Open terminal
# Navigate to the download folder
cd ~/Downloads

# Install the extension
code --install-extension mcp-json-manager-x.x.x.vsix

# Alternative: Use full path
code --install-extension /path/to/mcp-json-manager-x.x.x.vsix
```

#### Method 2: VS Code GUI
1. **Open VS Code**
2. **Open Command Palette**: `Ctrl + Shift + P`
3. **Type**: `Extensions: Install from VSIX...`
4. **Navigate** to your downloaded `.vsix` file
5. **Select** the file and click **Install**
6. **Restart VS Code**

#### Distribution-Specific Notes:

**Ubuntu/Debian:**
```bash
# If 'code' command not found, use:
/snap/bin/code --install-extension mcp-json-manager-x.x.x.vsix
# or
/usr/bin/code --install-extension mcp-json-manager-x.x.x.vsix
```

**Fedora/RHEL:**
```bash
# If installed via RPM:
/usr/bin/code --install-extension mcp-json-manager-x.x.x.vsix
```

**Arch Linux:**
```bash
# Standard installation:
code --install-extension mcp-json-manager-x.x.x.vsix
```

### 🍎 macOS

#### Method 1: Terminal (Recommended)
```bash
# Open Terminal
# Navigate to Downloads folder
cd ~/Downloads

# Install the extension
code --install-extension mcp-json-manager-x.x.x.vsix
```

#### Method 2: VS Code GUI
1. **Open VS Code**
2. **Open Command Palette**: `Cmd + Shift + P`
3. **Type**: `Extensions: Install from VSIX...`
4. **Browse** to your downloaded `.vsix` file
5. **Select** the file and click **Install**
6. **Restart VS Code**

#### Method 3: Finder
1. **Double-click** the `.vsix` file in Finder
2. **Choose** VS Code as the application to open with
3. **Follow** installation prompts

## 🔧 Installation Verification

After installation on any platform:

1. **Restart VS Code** completely
2. **Open Command Palette**: `Ctrl/Cmd + Shift + P`
3. **Search for**: `MCP: Open MCP Manager`
4. **If found**: ✅ Installation successful!

### Alternative Verification:
1. **Open Extensions view**: `Ctrl/Cmd + Shift + X`
2. **Search for**: `MCP JSON Manager`
3. **Check status**: Should show "Installed"

## 🚨 Troubleshooting

### Common Issues:

#### Issue: "Command 'code' not found"
**Solution:**
- **Windows**: Add VS Code to PATH during installation
- **Linux**: Install via official package or snap
- **macOS**: Install command line tools via Command Palette

#### Issue: Extension doesn't appear after installation
**Solutions:**
1. **Restart VS Code completely**
2. **Check Extensions view** for any error messages
3. **Reinstall** the extension
4. **Check VS Code version** (must be 1.74.0+)

#### Issue: Permission denied (Linux/macOS)
**Solutions:**
```bash
# Make sure you have write permissions
chmod +r mcp-json-manager-x.x.x.vsix

# Try with sudo (not recommended)
sudo code --install-extension mcp-json-manager-x.x.x.vsix --user-data-dir
```

#### Issue: Extension conflicts
**Solutions:**
1. **Disable similar extensions** temporarily
2. **Check for conflicting keybindings**
3. **Reset VS Code settings** if necessary

### Getting Help:

If you encounter issues:
1. **Check the logs**: `Help → Toggle Developer Tools → Console`
2. **Create an issue**: [GitHub Issues](https://github.com/YOUR_USERNAME/mcp-json-manager/issues)
3. **Include details**:
   - Operating system and version
   - VS Code version
   - Error messages
   - Steps to reproduce

## 📱 Alternative Installation Methods

### Using VS Code Insider's:
```bash
code-insiders --install-extension mcp-json-manager-x.x.x.vsix
```

### Using Codium (VS Code alternative):
```bash
codium --install-extension mcp-json-manager-x.x.x.vsix
```

### Batch Installation (Multiple Extensions):
```bash
# Install multiple extensions at once
code --install-extension ext1.vsix --install-extension ext2.vsix
```

## 🔄 Updating the Extension

To update to a newer version:

1. **Uninstall current version**:
   ```bash
   code --uninstall-extension test-publisher.mcp-json-manager
   ```

2. **Install new version**:
   ```bash
   code --install-extension mcp-json-manager-new-version.vsix
   ```

3. **Restart VS Code**

## 🧹 Uninstalling

### Command Line:
```bash
code --uninstall-extension test-publisher.mcp-json-manager
```

### VS Code GUI:
1. **Open Extensions view**: `Ctrl/Cmd + Shift + X`
2. **Find** MCP JSON Manager
3. **Click gear icon** → **Uninstall**
4. **Restart VS Code**

## 🔐 Security Considerations

- **Download only from official sources** (GitHub Releases)
- **Verify file integrity** if checksums are provided
- **Be cautious** with extensions from unknown sources
- **Review permissions** before installation

## 📊 System Requirements

### Minimum Requirements:
- **VS Code**: 1.74.0 or later
- **Node.js**: 18.0.0 or later (for development)
- **RAM**: 1GB available
- **Disk Space**: 50MB free

### Recommended:
- **VS Code**: Latest stable version
- **RAM**: 2GB+ available
- **Disk Space**: 100MB+ free
- **Network**: Internet connection for MCP server downloads

## 🎯 Next Steps

After successful installation:
1. **Read the [Usage Guide](README.md)**
2. **Create your first MCP configuration**
3. **Explore the features**
4. **Provide feedback** via GitHub Issues

---

**💡 Tip**: Bookmark this guide for future reference and share it with team members who need to install the extension!