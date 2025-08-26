# 🚀 Local Release Script Guide

This guide explains how to use the `release.sh` script for automated local releases of the MCP JSON Manager extension.

## 📋 Prerequisites

Before using the release script, ensure you have:
- ✅ **Bash shell** (Linux/macOS/WSL)
- ✅ **Git repository** properly configured
- ✅ **Node.js and npm** installed
- ✅ **VS Code** installed (for testing)
- ✅ **Clean working directory** (no uncommitted changes)
- ✅ **Main branch checked out**

## 🔧 Setup Instructions

### Step 1: Create the Release Script

Create `release.sh` in your project root:

```bash
# Download the script (if not created yet)
curl -O https://raw.githubusercontent.com/your-repo/release.sh

# Or create it manually by copying the content from the provided artifact
```

### Step 2: Make Script Executable

```bash
chmod +x release.sh
```

### Step 3: Verify Prerequisites

```bash
# Check if all tools are available
which git node npm code
```

## 📖 Script Usage

### Basic Syntax

```bash
./release.sh [VERSION_TYPE] [RELEASE_NOTES]
```

### Parameters

- **VERSION_TYPE** (optional): `patch` | `minor` | `major`
  - **Default**: `patch`
  - **patch**: Bug fixes (1.0.0 → 1.0.1)
  - **minor**: New features (1.0.0 → 1.1.0)  
  - **major**: Breaking changes (1.0.0 → 2.0.0)

- **RELEASE_NOTES** (optional): Custom release description
  - **Default**: Auto-generated from Git commits

## 🎯 Usage Examples

### Example 1: Simple Patch Release
```bash
# Creates version 0.0.1 → 0.0.2
./release.sh

# Or explicitly:
./release.sh patch
```

### Example 2: Minor Release with Notes
```bash
./release.sh minor "Added new MCP server templates and improved UI"
```

### Example 3: Major Release
```bash
./release.sh major "Complete rewrite with new architecture - breaking changes"
```

### Example 4: Interactive Release
```bash
# Script will prompt you to edit release notes
./release.sh minor
# When prompted: "Edit release notes? (y/N):" → Type 'y'
# Your default editor opens for release notes editing
```

## 🔄 Step-by-Step Process

When you run the script, it follows these steps:

### 1. **Pre-flight Checks** 🛡️
- Validates version type parameter
- Checks current Git branch (warns if not on `main`)
- Verifies no uncommitted changes exist
- Pulls latest changes from remote

### 2. **Build Process** 🔨
- Installs/updates npm dependencies
- Compiles TypeScript code
- Runs linting (if configured)
- Displays current version

### 3. **Version Management** 📈
- Bumps version according to semantic versioning
- Updates `package.json` with new version
- Shows the version change clearly

### 4. **Packaging** 📦
- Creates `.vsix` extension package
- Verifies package was created successfully
- Names file with new version number

### 5. **Changelog Generation** 📝
- Auto-generates from Git commits since last tag
- Allows manual editing if desired
- Uses custom notes if provided

### 6. **Git Operations** 📤
- Commits version bump to Git
- Creates annotated Git tag
- Pushes changes and tag to remote
- Triggers GitHub Actions (if configured)

### 7. **Local Testing** (Optional) 🧪
- Offers to install extension locally
- Installs in VS Code for immediate testing
- Prompts for VS Code restart

### 8. **Summary Report** 📊
- Shows completion status
- Displays version information
- Provides next steps
- Shows GitHub release link

## 🎨 Script Output Example

```bash
$ ./release.sh minor "Added server templates"

🚀 MCP JSON Manager Release Script
==================================
📥 Pulling latest changes...
Already up to date.
📦 Installing dependencies...
up to date, audited 150 packages in 2s
🔨 Building extension...
✅ No TypeScript errors
📋 Current version: 0.0.1
📈 Bumping minor version...
✅ New version: 0.1.0
📦 Packaging extension...
✅ Created mcp-json-manager-0.1.0.vsix
📝 Generating changelog...
💾 Committing version bump...
🏷️  Creating tag v0.1.0...
📤 Pushing changes...

Test install extension locally? (y/N): y
🧪 Installing extension locally...
✅ Extension installed! Restart VS Code to test.

🎉 Release process completed!
==================================
📋 Summary:
  • Version: v0.1.0
  • Package: mcp-json-manager-0.1.0.vsix
  • Tag pushed: v0.1.0

⏳ Next steps:
  1. Check GitHub Actions for automated release
  2. Download and test the release artifact
  3. Share the GitHub release with users

🔗 GitHub Release: https://github.com/user/mcp-json-manager/releases/tag/v0.1.0
```

## ⚙️ Configuration Options

### Environment Variables

You can customize the script behavior with environment variables:

```bash
# Set default editor for release notes
export EDITOR=code  # or vim, nano, etc.

# Set Git user info (if not already configured)
export GIT_USER_NAME="Your Name"
export GIT_USER_EMAIL="your.email@example.com"
```

### Script Customization

Edit the script to modify:

- **Default version type** (change `VERSION_TYPE=${1:-patch}`)
- **Branch checking** (modify branch validation)
- **Build commands** (add/remove build steps)
- **Output colors** (modify color variables)

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Issue: Permission Denied
```bash
# Solution: Make script executable
chmod +x release.sh
```

#### Issue: "command not found: ./release.sh"
```bash
# Solution: Run from correct directory
cd /path/to/your/project
./release.sh
```

#### Issue: Git Authentication Required
```bash
# Solution: Configure Git credentials
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Or use SSH keys for authentication
ssh-keygen -t ed25519 -C "your.email@example.com"
```

#### Issue: Uncommitted Changes
```bash
# Solution: Commit or stash changes
git add .
git commit -m "Prepare for release"
# Or
git stash
```

#### Issue: Not on Main Branch
```bash
# Solution: Switch to main branch
git checkout main
git pull origin main
```

#### Issue: Build Failures
```bash
# Solution: Fix build errors first
npm run compile  # Check for TypeScript errors
npm run lint     # Check for linting issues
```

### Debug Mode

Run with debug information:

```bash
# Enable verbose output
set -x
./release.sh
set +x
```

## 🔍 Script Internals

### Key Functions

1. **Color Output**: Uses ANSI color codes for readable output
2. **Validation**: Comprehensive pre-flight checks
3. **Error Handling**: Exits on any step failure
4. **Git Integration**: Automated Git operations
5. **User Interaction**: Prompts for confirmation

### Files Modified

- `package.json` - Version number updated
- Git history - New commit and tag created
- `*.vsix` - New package file created

### Files NOT Modified

- Source code files
- Configuration files
- Documentation (unless you edit release notes)

## 🔄 Integration with CI/CD

The script works seamlessly with GitHub Actions:

1. **Local script** creates tag and pushes
2. **GitHub Actions** detects new tag
3. **Automated workflow** creates release
4. **Marketplace publishing** happens automatically

## 📈 Best Practices

### Before Running:
- [ ] Test extension functionality locally
- [ ] Update documentation if needed
- [ ] Review and commit all changes
- [ ] Ensure you're on the correct branch

### During Release:
- [ ] Choose appropriate version type
- [ ] Write meaningful release notes
- [ ] Test local installation when prompted
- [ ] Verify GitHub Actions completion

### After Release:
- [ ] Test marketplace installation
- [ ] Monitor for user feedback
- [ ] Plan next release cycle

## 🎯 Advanced Usage

### Batch Releases
```bash
# Release multiple projects
for project in project1 project2 project3; do
    cd $project
    ./release.sh patch
    cd ..
done
```

### Pre-release Versions
```bash
# Modify script to support pre-release
./release.sh patch-beta  # Creates 1.0.0-beta.1
```

### Custom Workflows
```bash
# Chain with other scripts
./release.sh minor && ./deploy.sh && ./notify.sh
```

## 📞 Getting Help

If you encounter issues:

1. **Check script output** for error messages
2. **Review troubleshooting section** above
3. **Check Git and npm configurations**
4. **Create GitHub issue** with error details
5. **Include system information**:
   - OS version
   - Node.js version
   - Git version
   - Error messages

---

**💡 Pro Tip**: Run the script in a test repository first to familiarize yourself with the process before using it on your main project!