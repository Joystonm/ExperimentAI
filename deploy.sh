#!/bin/bash
echo "Building VirtuLab..."
npm install
npm run build
echo "Build complete. Deploy the dist/ folder to your hosting service."
