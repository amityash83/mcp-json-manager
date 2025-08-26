#!/bin/bash

# MCP JSON Manager Release Script
# Usage: ./release.sh [patch|minor|major] [release-notes]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
VERSION_TYPE=${1:-patch}
RELEASE_NOTES=${2:-""}

echo -e "${BLUE}🚀 MCP JSON Manager Release Script${NC}"
echo "=================================="

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo -e "${RED}❌ Invalid version type. Use: patch, minor, or major${NC}"
    exit 1
fi

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    echo -e "${YELLOW}⚠️  Warning: You're not on main branch (current: $CURRENT_BRANCH)${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check for uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${RED}❌ You have uncommitted changes. Please commit or stash them first.${NC}"
    git status --short
    exit 1
fi

# Pull latest changes
echo -e "${BLUE}📥 Pulling latest changes...${NC}"
git pull origin main

# Install dependencies and build
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

echo -e "${BLUE}🔨 Building extension...${NC}"
npm run compile

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}📋 Current version: ${CURRENT_VERSION}${NC}"

# Bump version
echo -e "${BLUE}📈 Bumping ${VERSION_TYPE} version...${NC}"
NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)
NEW_VERSION=${NEW_VERSION#v}  # Remove 'v' prefix

echo -e "${GREEN}✅ New version: ${NEW_VERSION}${NC}"

# Package extension
echo -e "${BLUE}📦 Packaging extension...${NC}"
npm run package

# Check if .vsix was created
VSIX_FILE="mcp-json-manager-${NEW_VERSION}.vsix"
if [[ ! -f "$VSIX_FILE" ]]; then
    echo -e "${RED}❌ Failed to create $VSIX_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Created ${VSIX_FILE}${NC}"

# Generate changelog
echo -e "${BLUE}📝 Generating changelog...${NC}"
if [[ -z "$RELEASE_NOTES" ]]; then
    # Auto-generate from git commits
    LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
    if [[ -n "$LAST_TAG" ]]; then
        CHANGELOG=$(git log --oneline --pretty=format:"- %s" ${LAST_TAG}..HEAD)
    else
        CHANGELOG=$(git log --oneline --pretty=format:"- %s" --max-count=10)
    fi
    
    echo -e "${YELLOW}Auto-generated changelog:${NC}"
    echo "$CHANGELOG"
    echo ""
    read -p "Edit release notes? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Open editor for release notes
        TEMP_FILE=$(mktemp)
        echo "$CHANGELOG" > "$TEMP_FILE"
        ${EDITOR:-nano} "$TEMP_FILE"
        RELEASE_NOTES=$(cat "$TEMP_FILE")
        rm "$TEMP_FILE"
    else
        RELEASE_NOTES="$CHANGELOG"
    fi
fi

# Commit version bump
echo -e "${BLUE}💾 Committing version bump...${NC}"
git add package.json
git commit -m "chore: bump version to v${NEW_VERSION}"

# Create and push tag
echo -e "${BLUE}🏷️  Creating tag v${NEW_VERSION}...${NC}"
git tag "v${NEW_VERSION}"

echo -e "${BLUE}📤 Pushing changes...${NC}"
git push origin main
git push origin "v${NEW_VERSION}"

# Test local installation (optional)
echo ""
read -p "Test install extension locally? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🧪 Installing extension locally...${NC}"
    code --install-extension "$VSIX_FILE" --force
    echo -e "${GREEN}✅ Extension installed! Restart VS Code to test.${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Release process completed!${NC}"
echo "=================================="
echo -e "${BLUE}📋 Summary:${NC}"
echo "  • Version: v${NEW_VERSION}"
echo "  • Package: ${VSIX_FILE}"
echo "  • Tag pushed: v${NEW_VERSION}"
echo ""
echo -e "${YELLOW}⏳ Next steps:${NC}"
echo "  1. Check GitHub Actions for automated release"
echo "  2. Download and test the release artifact"  
echo "  3. Share the GitHub release with users"
echo ""
echo -e "${BLUE}🔗 GitHub Release:${NC} https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/releases/tag/v${NEW_VERSION}"