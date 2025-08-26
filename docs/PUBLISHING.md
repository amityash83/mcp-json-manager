# 🏪 VS Code Marketplace Publishing Guide

This comprehensive guide walks you through publishing the MCP JSON Manager extension to the VS Code Marketplace.

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- ✅ **Working extension** (builds and packages successfully)
- ✅ **Microsoft account** (personal or work)
- ✅ **Azure DevOps account** (free)
- ✅ **Extension tested locally** (.vsix file works)
- ✅ **Clean Git repository** (all changes committed)

## 🚀 Step-by-Step Publishing Process

### Step 1: Create Azure DevOps Account

1. **Navigate to Azure DevOps**: [https://dev.azure.com](https://dev.azure.com)
2. **Sign in** with your Microsoft account
3. **Create organization** (choose any name, e.g., "your-name-dev")
4. **Skip project creation** (not needed for publishing)

### Step 2: Generate Personal Access Token (PAT)

1. **Click your profile picture** (top-right corner)
2. **Select "Personal Access Tokens"**
3. **Click "+ New Token"**
4. **Configure the token**:
   - **Name**: `VS Code Marketplace Publishing`
   - **Organization**: Select your organization
   - **Expiration**: 1 year (or custom)
   - **Scopes**: Click "Show all scopes"
   - **Find "Marketplace"** → Check ✅ **"Manage"**
5. **Click "Create"**
6. **⚠️ IMPORTANT**: Copy and save the token immediately (you can't see it again!)

### Step 3: Create VS Code Publisher Account

1. **Navigate to Publisher Management**: [https://marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage)
2. **Sign in** with the same Microsoft account
3. **Create Publisher**:
   - **Publisher ID**: Choose unique identifier (e.g., `john-smith-dev`)
     - ⚠️ Must be lowercase, no spaces, hyphens/underscores allowed
     - ⚠️ Cannot be changed later!
   - **Publisher Name**: Display name (e.g., "John Smith")
   - **Email**: Your contact email
4. **Click "Create"**
5. **Save your Publisher ID** - you'll need it later

### Step 4: Install Publishing Tools

```bash
# Install VS Code Extension Manager globally
npm install -g @vscode/vsce

# Install Open VSX Registry tool (optional)
npm install -g ovsx
```

### Step 5: Configure Your Extension

#### Update package.json:
```bash
# Replace "test-publisher" with your real publisher ID
npm pkg set publisher="your-publisher-id"

# Example:
npm pkg set publisher="john-smith-dev"
```

#### Verify package.json contains required fields:
```json
{
  "name": "mcp-json-manager",
  "displayName": "MCP JSON Manager",
  "description": "Visual form-based manager for MCP (Model Context Protocol) JSON configurations",
  "version": "0.0.1",
  "publisher": "your-publisher-id",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/mcp-json-manager.git"
  },
  "license": "MIT"
}
```

### Step 6: Login to VSCE

```bash
# Login with your publisher ID
vsce login your-publisher-id

# Enter your Personal Access Token when prompted
# Paste the PAT you saved from Step 2
```

### Step 7: Publish the Extension

#### Option A: Direct Publish
```bash
# Publish with automatic version increment
vsce publish patch  # 0.0.1 → 0.0.2
vsce publish minor  # 0.0.1 → 0.1.0  
vsce publish major  # 0.0.1 → 1.0.0

# Or publish current version
vsce publish
```

#### Option B: Package Then Publish
```bash
# Package first (for testing)
vsce package

# Test the .vsix file locally
code --install-extension mcp-json-manager-0.0.1.vsix

# If everything works, publish
vsce publish
```

### Step 8: Verify Publication

1. **Check marketplace**: Visit `https://marketplace.visualstudio.com/items?itemName=your-publisher-id.mcp-json-manager`
2. **Search in VS Code**: Extensions view → Search "MCP JSON Manager"
3. **Install from marketplace**: `code --install-extension your-publisher-id.mcp-json-manager`

## 🤖 Automated Publishing Setup

### Configure GitHub Secrets

1. **Go to GitHub repository**: Settings → Secrets and variables → Actions
2. **Add repository secrets**:
   - **Name**: `VSCE_PAT`
   - **Value**: Your Personal Access Token from Step 2
   - **Name**: `PUBLISHER_NAME`  
   - **Value**: Your publisher ID from Step 3

### Enable Automated Publishing

With secrets configured, your automated release workflow will:
- ✅ **Package the extension**
- ✅ **Create GitHub release**
- ✅ **Publish to VS Code Marketplace**
- ✅ **Update release notes with marketplace link**

Trigger it via:
```bash
# Tag and push (triggers automation)
git tag v0.0.2
git push origin v0.0.2
```

Or use GitHub Actions UI:
1. **Actions** tab → **"Automated Release"**
2. **"Run workflow"** → Select version type
3. **"Run workflow"**

## 🌐 Optional: Open VSX Registry

For broader compatibility (non-Microsoft editors):

### Step 1: Create Account
1. **Visit**: [https://open-vsx.org](https://open-vsx.org)
2. **Sign up** (GitHub account recommended)
3. **Generate access token**: User Settings → Tokens

### Step 2: Publish
```bash
# Create namespace (one-time)
ovsx create-namespace your-publisher-id -p YOUR_OVSX_TOKEN

# Publish extension
ovsx publish mcp-json-manager-0.0.1.vsix -p YOUR_OVSX_TOKEN
```

### Step 3: Automate (Optional)
Add to GitHub secrets:
- **Name**: `OVSX_PAT`
- **Value**: Your Open VSX token

## 📊 Post-Publication Checklist

### Immediate Verification:
- [ ] Extension appears in marketplace
- [ ] Installation works: `code --install-extension your-publisher-id.mcp-json-manager`
- [ ] All features function correctly
- [ ] No console errors in VS Code

### Marketing & Distribution:
- [ ] Update README with marketplace installation instructions
- [ ] Create release announcement
- [ ] Share on social media/developer communities
- [ ] Add marketplace badge to repository

### Monitoring:
- [ ] Check download statistics regularly
- [ ] Monitor user reviews and ratings
- [ ] Respond to issues and feedback
- [ ] Plan feature updates

## 🚨 Troubleshooting Common Issues

### Issue: "Invalid publisher name"
**Solution**: Ensure publisher ID is lowercase with hyphens/underscores only

### Issue: "Authentication failed"
**Solutions**:
- Verify PAT token is correct and hasn't expired
- Ensure token has "Marketplace (Manage)" scope
- Try `vsce logout` then `vsce login` again

### Issue: "Extension already exists"
**Solutions**:
- Check if you've already published this version
- Increment version number
- Use `vsce publish patch/minor/major`

### Issue: "Missing required fields"
**Solutions**:
- Ensure package.json has all required fields
- Add repository, license, description fields
- Validate with `vsce package` first

### Issue: "File size too large"
**Solutions**:
- Add `.vscodeignore` file to exclude unnecessary files
- Remove node_modules, tests, source files from package
- Use `vsce package --out extension.vsix` to check size

## 🔄 Updating Published Extensions

### Version Management:
```bash
# Patch release (bug fixes): 1.0.0 → 1.0.1
vsce publish patch

# Minor release (new features): 1.0.0 → 1.1.0  
vsce publish minor

# Major release (breaking changes): 1.0.0 → 2.0.0
vsce publish major
```

### Update Process:
1. **Make changes** to your extension
2. **Test thoroughly** locally
3. **Update CHANGELOG.md** with changes
4. **Commit changes** to Git
5. **Publish new version**
6. **Create GitHub release** (if using automation)

## 📈 Best Practices

### Before Publishing:
- **Test extensively** on different platforms
- **Write comprehensive README**
- **Add meaningful keywords** for discoverability
- **Create attractive icon** (128x128 PNG)
- **Set appropriate categories**

### After Publishing:
- **Monitor feedback** and reviews
- **Respond to issues** promptly
- **Regular updates** with new features
- **Maintain backward compatibility**
- **Follow semantic versioning**

### Security:
- **Never commit PAT tokens** to Git
- **Use GitHub secrets** for CI/CD
- **Regenerate tokens** periodically
- **Review permissions** regularly

## 💰 Marketplace Economics

### Costs:
- **Publishing**: Free
- **Hosting**: Free
- **Distribution**: Free
- **Analytics**: Free

### Revenue:
- **Extensions are free** by default
- **No built-in monetization** in VS Code Marketplace
- **Alternative monetization**: Premium support, commercial licenses

## 📞 Getting Help

### Official Resources:
- **VS Code Extension API**: [https://code.visualstudio.com/api](https://code.visualstudio.com/api)
- **Publishing Guide**: [https://code.visualstudio.com/api/working-with-extensions/publishing-extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- **VSCE Documentation**: [https://github.com/Microsoft/vscode-vsce](https://github.com/Microsoft/vscode-vsce)

### Community:
- **VS Code GitHub**: Issues and discussions
- **Stack Overflow**: Tag "visual-studio-code"
- **Discord/Reddit**: VS Code communities

---

**🎉 Congratulations! Your extension is now live on the VS Code Marketplace and available to millions of developers worldwide!**