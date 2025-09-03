# 🚀 Vercel Deployment Guide

This guide will walk you through deploying this OpenAI Chat Application to Vercel.

## 📋 Prerequisites

- [Vercel account](https://vercel.com/signup)
- [OpenAI API key](https://platform.openai.com/api-keys)
- Git repository access

## 🔧 Pre-Deployment Setup

### 1. Environment Variables

#### Frontend (.env.local)
```bash
# Copy from frontend/env.example
cp frontend/env.example frontend/.env.local

# Edit .env.local with your values
BACKEND_URL=http://localhost:8000  # For local development
```

#### Backend (.env)
```bash
# Copy from api/env.example
cp api/env.example api/.env

# Edit .env with your values
OPENAI_API_KEY=your_actual_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini  # Optional
```

### 2. Update Backend URL for Production

After deploying, update the `BACKEND_URL` in your frontend environment to point to your deployed backend.

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `/` (root of repository)
   - **Build Command**: Leave empty (Vercel will auto-detect)
   - **Output Directory**: Leave empty

3. **Environment Variables**
   - Add the following environment variables:
     ```
     OPENAI_API_KEY=your_openai_api_key
     BACKEND_URL=https://your-project.vercel.app
     ALLOWED_ORIGINS=https://your-project.vercel.app,http://localhost:3000
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add BACKEND_URL
   vercel env add ALLOWED_ORIGINS
   ```

## 🔄 Post-Deployment Configuration

### 1. Update Frontend Environment

After deployment, update your frontend environment variables:

```bash
# In Vercel Dashboard or via CLI
BACKEND_URL=https://your-project.vercel.app
```

### 2. Test the Application

1. Visit your deployed frontend URL
2. Test the chat functionality
3. Check browser console for any errors
4. Verify API endpoints are working

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `ALLOWED_ORIGINS` includes your frontend domain
   - Check that CORS middleware is properly configured

2. **API Key Not Found**
   - Verify `OPENAI_API_KEY` is set in Vercel environment variables
   - Check that the backend can access the environment variable

3. **Backend Communication Failure**
   - Verify `BACKEND_URL` is correctly set
   - Check that both frontend and backend are deployed to the same Vercel project

4. **Build Failures**
   - Check Vercel build logs for specific errors
   - Ensure all dependencies are properly specified in package.json and requirements.txt

### Debug Commands

```bash
# Check environment variables
vercel env ls

# View deployment logs
vercel logs

# Redeploy with fresh build
vercel --force
```

## 📱 Environment-Specific Configurations

### Development
- `BACKEND_URL=http://localhost:8000`
- `ALLOWED_ORIGINS=http://localhost:3000`

### Production
- `BACKEND_URL=https://your-domain.vercel.app`
- `ALLOWED_ORIGINS=https://your-domain.vercel.app`

## 🔒 Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **CORS**: Restrict allowed origins in production
3. **Environment Variables**: Use Vercel's secure environment variable storage
4. **HTTPS**: Vercel automatically provides HTTPS in production

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel build logs
3. Verify environment variable configuration
4. Test locally before deploying
