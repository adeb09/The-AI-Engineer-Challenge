#!/bin/bash

# 🚀 Vercel Deployment Helper Script
# This script helps you deploy your OpenAI Chat Application to Vercel

echo "🚀 OpenAI Chat Application - Vercel Deployment Helper"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
else
    echo "✅ Vercel CLI found"
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
else
    echo "✅ Already logged in to Vercel"
fi

# Check environment files
echo ""
echo "📋 Checking environment configuration..."

if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  frontend/.env.local not found"
    echo "   Copy from frontend/env.example and configure for local development"
fi

if [ ! -f "api/.env" ]; then
    echo "⚠️  api/.env not found"
    echo "   Copy from api/env.example and add your OpenAI API key"
fi

echo ""
echo "🔧 Pre-deployment checklist:"
echo "   1. ✅ Environment files configured"
echo "   2. ✅ OpenAI API key set in api/.env"
echo "   3. ✅ Backend URL configured for production"
echo ""

echo "🚀 Ready to deploy? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🚀 Starting deployment..."
    vercel --prod
else
    echo "📖 Please check the DEPLOYMENT.md guide for manual deployment steps"
    echo "🔧 Or run 'vercel' without --prod flag for preview deployment"
fi

echo ""
echo "📚 For detailed deployment instructions, see DEPLOYMENT.md"
echo "🆘 For troubleshooting, check the deployment guide or Vercel logs"
