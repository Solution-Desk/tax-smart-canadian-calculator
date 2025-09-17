#!/bin/bash

# Build the project
npm run build

# Move files from dist to root
cp -r dist/* .

# Create CNAME file
echo "taxapp.thesolutiondesk.ca" > CNAME

# Add all files
git add .

echo "\n\nNow run these commands to deploy:"
echo "git commit -m 'Deploy to GitHub Pages'"
echo "git push origin main"
