# Release Process Guide

This guide explains how to release new versions of the MCP JSON Manager extension using the automated GitHub Actions workflow.

## 🚀 Quick Release Process

### 1. Prepare for Release

```bash
# Ensure you're on main branch and up to date
git checkout main
git pull origin main

# Verify everything builds locally
npm run compile
npm run lint
npm run test
```

### 2. Create and Push Tag

```bash
# Create a new semantic version tag
git tag v1.0.0

# Push the tag to trigger release
git push origin v1.0.0
```

### 3. Create GitHub Release

1. Go to your repository on GitHub
2. Click **"Releases"** → **"Create a new release"**
3. Select your tag (`v1.0.0`)
4. Fill in release details:
   - **Title**: `v1.0.0 - Initial Release`
   - **Description**: List of changes and features
5. Click **"Publish release"**

### 4. Automated Process Begins! 🤖

The GitHub Action will automatically:
- ✅ Build and test the extension
- ✅ Package the `.vsix` file
- ✅ Publish to VS Code Marketplace
- ✅ Publish to Open VSX Registry
- ✅ Attach `.vsix` to GitHub release
- ✅ Post success comment

## 📋 Setup Requirements

### GitHub Secrets Configuration

Add these secrets in your repository settings (`Settings → Secrets and variables → Actions`):

#### Required Secrets:

1. **`VSCE_PAT`** - Visual Studio Code Extension Personal Access Token
   - Get from: [Azure DevOps Personal Access Tokens](https://dev.azure.com/_usersSettings/tokens)
   - Scope: **Marketplace (Manage)**

#### Optional Secrets:

2. **`OVSX_PAT`** - Open VSX Registry Token (for wider distribution)
   - Get from: [Open VSX Registry](https://open-vsx.org/user-settings/tokens)
   - Required for publishing to non-Microsoft editors

### Branch Protection (Recommended)

Set up branch protection for `main`:
1. Go to `Settings → Branches`
2. Add rule for `main` branch
3. Enable:
   - Require status checks to pass before merging
   - Require branches to be up to date before merging

## 📊 Release Workflow Details

### Trigger Events

| Event | Action |
|-------|--------|
| Push to `main`/`develop` | Run tests only |
| Pull Request | Run tests only |
| Create Release | Full build and publish |

### Build Matrix

The workflow runs on:
- **OS**: Ubuntu Latest
- **Node.js**: Version 18
- **Cache**: npm dependencies

### Version Management

- **Tag Format**: `v1.2.3` (semantic versioning)
- **Auto-version**: Updates `package.json` from Git tag
- **Validation**: Ensures proper semver format

## 🏷️ Versioning Strategy

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (`v2.0.0`): Breaking changes
- **MINOR** (`v1.1.0`): New features, backward compatible
- **PATCH** (`v1.0.1`): Bug fixes, backward compatible

### Examples:

```bash
# Bug fix release
git tag v1.0.1

# New feature release  
git tag v1.1.0

# Breaking change release
git tag v2.0.0
```

## 🔧 Manual Release (Fallback)

If automated release fails, you can publish manually:

```bash
# Install publishing tools
npm install -g @vscode/vsce ovsx

# Login to publishers (one-time setup)
vsce login YOUR_PUBLISHER_NAME
ovsx create-namespace YOUR_PUBLISHER_NAME

# Build and publish
npm run compile
vsce package
vsce publish
ovsx publish *.vsix
```

## 📈 Release Checklist

Before creating a release:

- [ ] All tests pass locally
- [ ] Update CHANGELOG.md
- [ ] Update README.md if needed
- [ ] Version number follows semver
- [ ] GitHub secrets are configured
- [ ] Tag follows `v1.2.3` format

After release:

- [ ] Verify extension appears in marketplace
- [ ] Test installation from marketplace
- [ ] Check GitHub release has `.vsix` attachment
- [ ] Monitor for any issues or user feedback

## 🚨 Troubleshooting

### Common Issues:

1. **Authentication Failed**
   - Verify `VSCE_PAT` secret is correct
   - Check token hasn't expired
   - Ensure token has Marketplace (Manage) scope

2. **Version Conflicts**
   - Check if version already exists in marketplace
   - Ensure tag format is correct (`v1.2.3`)

3. **Build Failures**
   - Check TypeScript compilation errors
   - Verify all dependencies are installed
   - Review GitHub Actions logs

### Debug Steps:

```bash
# Local debugging
npm run compile  # Check for TypeScript errors
npm run lint     # Check for linting issues
npm run test     # Run tests
vsce package     # Test packaging locally
```

## 📞 Support

If you encounter issues:
1. Check the [GitHub Actions logs](../../actions)
2. Review the [troubleshooting section](#troubleshooting)
3. Create an issue with detailed error messages

## 🔄 Future Improvements

Potential workflow enhancements:
- [ ] Automated changelog generation
- [ ] Pre-release versions support
- [ ] Integration tests with VS Code
- [ ] Automated security scanning
- [ ] Performance benchmarking