import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface MCPServer {
  command: string[];
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
}

interface MCPConfig {
  mcpServers?: Record<string, MCPServer>;
}

export function activate(context: vscode.ExtensionContext) {
  console.log('MCP JSON Manager extension is now active!');

  const provider = new MCPTreeDataProvider(context);
  vscode.window.createTreeView('mcpManager', { treeDataProvider: provider });

  // Register command to open MCP manager
  const openManagerCommand = vscode.commands.registerCommand('mcpManager.openManager', (uri?: vscode.Uri) => {
    const panel = vscode.window.createWebviewPanel(
      'mcpManager',
      'MCP Configuration Manager',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    let configPath: string = '';
    if (uri) {
      configPath = uri.fsPath;
    } else {
      // Try to find MCP config in workspace
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (workspaceFolders) {
        const commonPaths = [
          '.mcp.json',
          'mcp.json',
          '.claude/mcp.json',
          'config/mcp.json'
        ];
        
        for (const folder of workspaceFolders) {
          for (const commonPath of commonPaths) {
            const fullPath = path.join(folder.uri.fsPath, commonPath);
            if (fs.existsSync(fullPath)) {
              configPath = fullPath;
              break;
            }
          }
          if (configPath) break;
        }
      }
    }

    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, configPath);

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(
      async message => {
        switch (message.type) {
          case 'loadConfig':
            try {
              if (fs.existsSync(message.path)) {
                const content = fs.readFileSync(message.path, 'utf8');
                const config = JSON.parse(content);
                panel.webview.postMessage({ type: 'configLoaded', config, path: message.path });
              } else {
                panel.webview.postMessage({ type: 'configLoaded', config: { mcpServers: {} }, path: message.path });
              }
            } catch (error) {
              vscode.window.showErrorMessage(`Error loading MCP config: ${error}`);
            }
            break;

          case 'saveConfig':
            try {
              const dir = path.dirname(message.path);
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
              }
              
              fs.writeFileSync(message.path, JSON.stringify(message.config, null, 2));
              vscode.window.showInformationMessage('MCP configuration saved successfully!');
              provider.refresh();
            } catch (error) {
              vscode.window.showErrorMessage(`Error saving MCP config: ${error}`);
            }
            break;

          case 'selectFile':
            const result = await vscode.window.showOpenDialog({
              canSelectFiles: true,
              canSelectFolders: false,
              filters: {
                'JSON files': ['json']
              }
            });
            
            if (result && result[0]) {
              panel.webview.postMessage({ type: 'fileSelected', path: result[0].fsPath });
            }
            break;

          case 'selectFolder':
            const folderResult = await vscode.window.showOpenDialog({
              canSelectFiles: false,
              canSelectFolders: true
            });
            
            if (folderResult && folderResult[0]) {
              panel.webview.postMessage({ type: 'folderSelected', path: folderResult[0].fsPath });
            }
            break;
        }
      },
      undefined,
      context.subscriptions
    );
  });

  context.subscriptions.push(openManagerCommand);
}

class MCPTreeDataProvider implements vscode.TreeDataProvider<MCPTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<MCPTreeItem | undefined | null | void> = new vscode.EventEmitter<MCPTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<MCPTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: MCPTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: MCPTreeItem): Thenable<MCPTreeItem[]> {
    if (!element) {
      // Root level - find MCP config files
      return Promise.resolve(this.getMCPConfigs());
    }
    return Promise.resolve([]);
  }

  private getMCPConfigs(): MCPTreeItem[] {
    const configs: MCPTreeItem[] = [];
    const workspaceFolders = vscode.workspace.workspaceFolders;
    
    if (workspaceFolders) {
      const commonPaths = [
        '.mcp.json',
        'mcp.json',
        '.claude/mcp.json',
        'config/mcp.json'
      ];
      
      for (const folder of workspaceFolders) {
        for (const commonPath of commonPaths) {
          const fullPath = path.join(folder.uri.fsPath, commonPath);
          if (fs.existsSync(fullPath)) {
            configs.push(new MCPTreeItem(
              path.basename(fullPath),
              vscode.TreeItemCollapsibleState.None,
              fullPath,
              'mcp-config'
            ));
          }
        }
      }
    }
    
    return configs;
  }
}

class MCPTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly configPath: string,
    public readonly contextValue: string
  ) {
    super(label, collapsibleState);
    this.tooltip = configPath;
    this.command = {
      command: 'mcpManager.openManager',
      title: 'Open MCP Manager',
      arguments: [vscode.Uri.file(configPath)]
    };
  }
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri, initialPath?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MCP Configuration Manager</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            margin: 0;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: var(--vscode-foreground);
        }
        
        input, textarea, select {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--vscode-input-border);
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border-radius: 3px;
            font-family: var(--vscode-font-family);
            box-sizing: border-box;
        }
        
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 16px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        
        .secondary-button {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        
        .secondary-button:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
        
        .server-card {
            border: 1px solid var(--vscode-panel-border);
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 15px;
            background-color: var(--vscode-editor-background);
        }
        
        .server-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .server-name {
            font-size: 18px;
            font-weight: bold;
        }
        
        .remove-server {
            background-color: var(--vscode-errorForeground);
            color: white;
        }
        
        .array-input {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }
        
        .array-input input {
            flex: 1;
            margin-right: 10px;
        }
        
        .file-input-group {
            display: flex;
            align-items: center;
        }
        
        .file-input-group input {
            flex: 1;
            margin-right: 10px;
        }
        
        .env-var {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }
        
        .env-var input {
            flex: 1;
            margin-right: 10px;
        }
        
        .env-var input:first-child {
            max-width: 200px;
        }
        
        h1, h2, h3 {
            color: var(--vscode-foreground);
        }
        
        .json-preview {
            background-color: var(--vscode-textCodeBlock-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 3px;
            padding: 15px;
            margin-top: 20px;
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            white-space: pre-wrap;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>MCP Configuration Manager</h1>
        
        <div class="form-group">
            <label for="configPath">Configuration File Path:</label>
            <div class="file-input-group">
                <input type="text" id="configPath" placeholder="Path to MCP configuration file" value="${initialPath || ''}">
                <button type="button" onclick="selectFile()" class="secondary-button">Browse</button>
                <button type="button" onclick="loadConfig()" class="secondary-button">Load</button>
            </div>
        </div>
        
        <div id="serversContainer">
            <h2>MCP Servers</h2>
            <div id="serversList"></div>
            <button type="button" onclick="addServer()" class="secondary-button">Add Server</button>
        </div>
        
        <div style="margin-top: 30px;">
            <button type="button" onclick="saveConfig()">Save Configuration</button>
            <button type="button" onclick="previewJson()" class="secondary-button">Preview JSON</button>
        </div>
        
        <div id="jsonPreview" class="json-preview" style="display: none;"></div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let currentConfig = { mcpServers: {} };
        let currentPath = '${initialPath || ''}';
        
        // Load initial config if path is provided
        if (currentPath) {
            loadConfig();
        }
        
        function selectFile() {
            vscode.postMessage({ type: 'selectFile' });
        }
        
        function loadConfig() {
            const path = document.getElementById('configPath').value.trim();
            if (path) {
                currentPath = path;
                vscode.postMessage({ type: 'loadConfig', path });
            }
        }
        
        function saveConfig() {
            if (!currentPath) {
                alert('Please specify a configuration file path');
                return;
            }
            
            const config = buildConfigFromForm();
            vscode.postMessage({ type: 'saveConfig', config, path: currentPath });
        }
        
        function addServer() {
            const serverName = prompt('Enter server name:');
            if (serverName && serverName.trim()) {
                currentConfig.mcpServers[serverName.trim()] = {
                    command: [''],
                    args: [],
                    env: {},
                    cwd: ''
                };
                renderServers();
            }
        }
        
        function removeServer(serverName) {
            if (confirm(\`Are you sure you want to remove server "\${serverName}"?\`)) {
                delete currentConfig.mcpServers[serverName];
                renderServers();
            }
        }
        
        function renderServers() {
            const container = document.getElementById('serversList');
            container.innerHTML = '';
            
            Object.keys(currentConfig.mcpServers || {}).forEach(serverName => {
                const server = currentConfig.mcpServers[serverName];
                const serverDiv = document.createElement('div');
                serverDiv.className = 'server-card';
                serverDiv.innerHTML = \`
                    <div class="server-header">
                        <div class="server-name">\${serverName}</div>
                        <button class="remove-server" onclick="removeServer('\${serverName}')">Remove</button>
                    </div>
                    
                    <div class="form-group">
                        <label>Command (required):</label>
                        <div id="command-\${serverName}">
                            \${(server.command || ['']).map((cmd, i) => \`
                                <div class="array-input">
                                    <input type="text" value="\${cmd}" onchange="updateServerCommand('\${serverName}', \${i}, this.value)">
                                    <button type="button" onclick="removeCommandItem('\${serverName}', \${i})" class="secondary-button">Remove</button>
                                </div>
                            \`).join('')}
                        </div>
                        <button type="button" onclick="addCommandItem('\${serverName}')" class="secondary-button">Add Command Part</button>
                    </div>
                    
                    <div class="form-group">
                        <label>Arguments:</label>
                        <div id="args-\${serverName}">
                            \${(server.args || []).map((arg, i) => \`
                                <div class="array-input">
                                    <input type="text" value="\${arg}" onchange="updateServerArgs('\${serverName}', \${i}, this.value)">
                                    <button type="button" onclick="removeArgsItem('\${serverName}', \${i})" class="secondary-button">Remove</button>
                                </div>
                            \`).join('')}
                        </div>
                        <button type="button" onclick="addArgsItem('\${serverName}')" class="secondary-button">Add Argument</button>
                    </div>
                    
                    <div class="form-group">
                        <label>Working Directory:</label>
                        <div class="file-input-group">
                            <input type="text" value="\${server.cwd || ''}" onchange="updateServerCwd('\${serverName}', this.value)">
                            <button type="button" onclick="selectFolder('\${serverName}')" class="secondary-button">Browse</button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Environment Variables:</label>
                        <div id="env-\${serverName}">
                            \${Object.entries(server.env || {}).map(([key, value]) => \`
                                <div class="env-var">
                                    <input type="text" placeholder="Variable name" value="\${key}" onchange="updateServerEnvKey('\${serverName}', '\${key}', this.value)">
                                    <input type="text" placeholder="Variable value" value="\${value}" onchange="updateServerEnvValue('\${serverName}', '\${key}', this.value)">
                                    <button type="button" onclick="removeEnvVar('\${serverName}', '\${key}')" class="secondary-button">Remove</button>
                                </div>
                            \`).join('')}
                        </div>
                        <button type="button" onclick="addEnvVar('\${serverName}')" class="secondary-button">Add Environment Variable</button>
                    </div>
                \`;
                container.appendChild(serverDiv);
            });
        }
        
        function updateServerCommand(serverName, index, value) {
            if (!currentConfig.mcpServers[serverName].command) {
                currentConfig.mcpServers[serverName].command = [];
            }
            currentConfig.mcpServers[serverName].command[index] = value;
        }
        
        function addCommandItem(serverName) {
            if (!currentConfig.mcpServers[serverName].command) {
                currentConfig.mcpServers[serverName].command = [];
            }
            currentConfig.mcpServers[serverName].command.push('');
            renderServers();
        }
        
        function removeCommandItem(serverName, index) {
            currentConfig.mcpServers[serverName].command.splice(index, 1);
            renderServers();
        }
        
        function updateServerArgs(serverName, index, value) {
            if (!currentConfig.mcpServers[serverName].args) {
                currentConfig.mcpServers[serverName].args = [];
            }
            currentConfig.mcpServers[serverName].args[index] = value;
        }
        
        function addArgsItem(serverName) {
            if (!currentConfig.mcpServers[serverName].args) {
                currentConfig.mcpServers[serverName].args = [];
            }
            currentConfig.mcpServers[serverName].args.push('');
            renderServers();
        }
        
        function removeArgsItem(serverName, index) {
            currentConfig.mcpServers[serverName].args.splice(index, 1);
            renderServers();
        }
        
        function updateServerCwd(serverName, value) {
            currentConfig.mcpServers[serverName].cwd = value;
        }
        
        function selectFolder(serverName) {
            vscode.postMessage({ type: 'selectFolder', serverName });
        }
        
        function updateServerEnvKey(serverName, oldKey, newKey) {
            const env = currentConfig.mcpServers[serverName].env || {};
            if (oldKey !== newKey && newKey.trim()) {
                env[newKey] = env[oldKey] || '';
                delete env[oldKey];
                currentConfig.mcpServers[serverName].env = env;
                renderServers();
            }
        }
        
        function updateServerEnvValue(serverName, key, value) {
            if (!currentConfig.mcpServers[serverName].env) {
                currentConfig.mcpServers[serverName].env = {};
            }
            currentConfig.mcpServers[serverName].env[key] = value;
        }
        
        function addEnvVar(serverName) {
            const key = prompt('Environment variable name:');
            if (key && key.trim()) {
                if (!currentConfig.mcpServers[serverName].env) {
                    currentConfig.mcpServers[serverName].env = {};
                }
                currentConfig.mcpServers[serverName].env[key.trim()] = '';
                renderServers();
            }
        }
        
        function removeEnvVar(serverName, key) {
            delete currentConfig.mcpServers[serverName].env[key];
            renderServers();
        }
        
        function buildConfigFromForm() {
            // Clean up the config by removing empty values
            const cleanConfig = { mcpServers: {} };
            
            Object.keys(currentConfig.mcpServers).forEach(serverName => {
                const server = currentConfig.mcpServers[serverName];
                const cleanServer = {
                    command: (server.command || []).filter(cmd => cmd.trim() !== '')
                };
                
                if (server.args && server.args.length > 0) {
                    cleanServer.args = server.args.filter(arg => arg.trim() !== '');
                }
                
                if (server.cwd && server.cwd.trim()) {
                    cleanServer.cwd = server.cwd.trim();
                }
                
                if (server.env && Object.keys(server.env).length > 0) {
                    const cleanEnv = {};
                    Object.entries(server.env).forEach(([key, value]) => {
                        if (key.trim() && value.trim()) {
                            cleanEnv[key.trim()] = value.trim();
                        }
                    });
                    if (Object.keys(cleanEnv).length > 0) {
                        cleanServer.env = cleanEnv;
                    }
                }
                
                if (cleanServer.command.length > 0) {
                    cleanConfig.mcpServers[serverName] = cleanServer;
                }
            });
            
            return cleanConfig;
        }
        
        function previewJson() {
            const config = buildConfigFromForm();
            const preview = document.getElementById('jsonPreview');
            preview.textContent = JSON.stringify(config, null, 2);
            preview.style.display = preview.style.display === 'none' ? 'block' : 'none';
        }
        
        // Handle messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.type) {
                case 'configLoaded':
                    currentConfig = message.config;
                    currentPath = message.path;
                    document.getElementById('configPath').value = currentPath;
                    renderServers();
                    break;
                    
                case 'fileSelected':
                    document.getElementById('configPath').value = message.path;
                    break;
                    
                case 'folderSelected':
                    // Find which server requested folder selection
                    const serverName = message.serverName;
                    if (serverName) {
                        currentConfig.mcpServers[serverName].cwd = message.path;
                        renderServers();
                    }
                    break;
            }
        });
        
        // Initialize
        renderServers();
    </script>
</body>
</html>`;
}

export function deactivate() {}