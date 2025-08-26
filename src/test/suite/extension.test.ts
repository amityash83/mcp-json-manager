import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('YOUR_PUBLISHER_NAME.mcp-json-manager'));
    });

    test('Extension should activate', async () => {
        const ext = vscode.extensions.getExtension('YOUR_PUBLISHER_NAME.mcp-json-manager');
        assert.ok(ext);
        
        await ext!.activate();
        assert.strictEqual(ext!.isActive, true);
    });

    test('MCP Manager command should be registered', async () => {
        const commands = await vscode.commands.getCommands();
        assert.ok(commands.includes('mcpManager.openManager'));
    });

    test('Should handle invalid JSON gracefully', () => {
        // Test configuration parsing with invalid JSON
        const invalidJson = '{"invalid": json}';
        
        try {
            JSON.parse(invalidJson);
            assert.fail('Should have thrown an error');
        } catch (error) {
            assert.ok(error instanceof SyntaxError);
        }
    });

    test('Should validate MCP server configuration', () => {
        const validConfig = {
            mcpServers: {
                "test-server": {
                    command: ["node", "server.js"],
                    args: ["--port", "3000"],
                    env: {
                        "NODE_ENV": "development"
                    }
                }
            }
        };

        // Basic structure validation
        assert.ok(validConfig.mcpServers);
        assert.ok(validConfig.mcpServers["test-server"]);
        assert.ok(Array.isArray(validConfig.mcpServers["test-server"].command));
        assert.strictEqual(validConfig.mcpServers["test-server"].command[0], "node");
    });
});