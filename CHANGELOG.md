# Changelog

All notable changes to the MCP JSON Manager extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Planned features go here

### Changed
- Planned changes go here

### Fixed
- Planned fixes go here

## [0.0.1] - 2025-08-26

### Added
- Initial release of MCP JSON Manager
- Visual form-based interface for MCP configuration management
- Support for adding/editing/removing MCP servers
- Dynamic arrays for command arguments and environment variables
- File browser integration for selecting executables and directories
- JSON preview functionality
- Context menu integration for .mcp.json files
- Command palette integration
- Tree view for discovering MCP configurations in workspace
- VS Code theming support

### Features
- **Server Management**: Add, edit, and remove MCP servers through intuitive forms
- **Command Configuration**: Visual editing of server commands with dynamic array support
- **Arguments Management**: Easy addition and removal of command-line arguments
- **Environment Variables**: Key-value pair management for server environment
- **Working Directory**: File browser integration for selecting server directories
- **File Operations**: Load existing configurations and save changes
- **JSON Preview**: Real-time preview of generated configuration
- **Workspace Integration**: Automatic discovery of MCP files in common locations
- **User Interface**: Clean, VS Code-native styling with proper theming

### Technical
- Built with TypeScript and VS Code Extension API
- Uses webview for rich UI components
- Supports VS Code 1.74.0 and later
- Node.js 18+ compatibility
- Comprehensive error handling and validation

---

## Template for Future Releases

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed  
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Now removed features

### Fixed
- Bug fixes

### Security
- Vulnerability fixes
```

---

## Release Notes Guidelines

When creating releases, include:

1. **Version number** following semantic versioning
2. **Release date** in YYYY-MM-DD format
3. **Changes categorized** by type (Added, Changed, Fixed, etc.)
4. **Breaking changes** clearly marked
5. **Migration instructions** if needed
6. **Installation instructions**
7. **Links to issues/PRs** when relevant

## Automated Release Process

This changelog supports automated release generation:
- Sections are parsed by release scripts
- Unreleased section is automatically managed  
- Version sections are created automatically
- Git commit messages can supplement changelog entries

## Contributing

When contributing, please:
1. Add entries to the [Unreleased] section
2. Follow the established format
3. Include issue/PR references when applicable
4. Keep entries concise but descriptive