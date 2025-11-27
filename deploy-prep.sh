#!/bin/bash

# Pre-deployment setup script for E-Learning Platform

echo "🚀 Preparing E-Learning Platform for Deployment..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your actual values:"
    echo "   - MONGO_URL (your MongoDB connection string)"
    echo "   - SESSION_SECRET (generate a secure 32+ character string)"
    echo ""
fi

# Test the application locally
echo "🧪 Testing application locally..."
echo "Starting server in background..."

# Start the app in background
npm start &
APP_PID=$!

# Wait for app to start
sleep 3

# Test if app is running
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Application is running successfully on http://localhost:3000"
else
    echo "❌ Application failed to start. Check the logs above."
fi

# Kill the background process
kill $APP_PID 2>/dev/null

echo ""
echo "📋 Pre-deployment checklist:"
echo "  [ ] MongoDB database created (MongoDB Atlas recommended)"
echo "  [ ] Environment variables configured in .env"
echo "  [ ] Application tested locally"
echo "  [ ] Code committed to Git repository"
echo ""
echo "🌐 Ready for deployment! Check DEPLOYMENT.md for platform-specific instructions."
echo ""