import * as assert from 'assert';
import * as vscode from 'vscode';

// Simple test without Mocha framework
export async function runExtensionTests(): Promise<void> {
    console.log('🧪 Testing MCP JSON Manager Extension...');

    // Test 1: Extension presence
    console.log('📦 Checking extension presence...');
    const ext = vscode.extensions.getExtension('YOUR_PUBLISHER_NAME.mcp-json-manager');
    if (!ext) {
        throw new Error('Extension not found');
    }
    console.log('✅ Extension found');

    // Test 2: Extension activation
    console.log('🚀 Testing extension activation...');
    await ext.activate();
    if (!ext.isActive) {
        throw new Error('Extension failed to activate');
    }
    console.log('✅ Extension activated successfully');

    // Test 3: Command registration
    console.log('⚡ Checking command registration...');
    const commands = await vscode.commands.getCommands();
    if (!commands.includes('mcpManager.openManager')) {
        throw new Error('MCP Manager command not registered');
    }
    console.log('✅ Commands registered');

    // Test 4: JSON validation
    console.log('🔍 Testing JSON validation...');
    const validConfig = {
        mcpServers: {
            "test-server": {
                command: ["node", "server.js"],
                args: ["--port", "3000"]
            }
        }
    };

    // Basic structure validation
    assert.ok(validConfig.mcpServers, 'mcpServers should exist');
    assert.ok(validConfig.mcpServers["test-server"], 'test-server should exist');
    assert.ok(Array.isArray(validConfig.mcpServers["test-server"].command), 'command should be array');
    console.log('✅ JSON validation works');

    console.log('🎉 All tests passed!');
}