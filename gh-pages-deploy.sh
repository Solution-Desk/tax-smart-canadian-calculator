#!/bin/bash

# Exit on error
set -e

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the project
echo "Building project..."
npm run build

# Clean up docs directory
echo "Preparing files..."
rm -rf docs/*

# Copy built files to docs directory
cp -r dist/* docs/

# Create CNAME file
echo "taxapp.thesolutiondesk.ca" > docs/CNAME

# Add all files
git add .

# Show status
echo "\n\nDeployment ready! Run these commands to publish:"
echo "git commit -m 'Deploy to GitHub Pages'"
echo "git push origin main"

echo "\nAfter pushing, your site will be available at:"
echo "https://taxapp.thesolutiondesk.ca"
