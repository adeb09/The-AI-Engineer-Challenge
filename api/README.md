# OpenAI Chat API Backend

This is a FastAPI-based backend service that provides a streaming chat interface using OpenAI's API.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- An OpenAI API key

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

2. Install the required dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
   - Copy the example below and create a `.env` file in the `api` directory
   - Or set the environment variable directly in your shell

```bash
# Required: Your OpenAI API key
export OPENAI_API_KEY="your_openai_api_key_here"

# Optional: Override the default model
export OPENAI_MODEL="gpt-4.1-mini"
```

## Running the Server

1. Make sure you're in the `api` directory:
```bash
cd api
```

2. Start the server:
```bash
python app.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### Chat Endpoint
- **URL**: `/api/chat`
- **Method**: POST
- **Request Body**:
```json
{
    "developer_message": "string",
    "user_message": "string",
    "model": "gpt-4.1-mini"  // optional, defaults to gpt-4.1-mini
}
```
- **Response**: Streaming text response

### Health Check
- **URL**: `/api/health`
- **Method**: GET
- **Response**: `{"status": "ok"}`

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## CORS Configuration

The API is configured to accept requests from any origin (`*`). This can be modified in the `app.py` file if you need to restrict access to specific domains.

## Error Handling

The API includes comprehensive error handling for:
- Missing or invalid OpenAI API keys
- OpenAI API errors
- General server errors

All errors will return appropriate HTTP status codes with descriptive error messages.

## Deployment to Vercel

This backend is configured for easy deployment to Vercel! 🚀

### Environment Variables on Vercel

1. **Deploy your project** to Vercel (it will automatically detect the Python/FastAPI setup)
2. **Set environment variables** in your Vercel project dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `OPENAI_API_KEY` with your actual OpenAI API key
   - Optionally add `OPENAI_MODEL` if you want to override the default

### Why Vercel is Awesome for Secrets

- 🔐 **Secure**: Environment variables are encrypted and never exposed in your code
- 🚀 **Easy**: Just click and type in the dashboard - no complex configuration needed
- 🔄 **Automatic**: Variables are automatically available to your deployed app
- 📱 **Mobile-friendly**: Manage secrets from anywhere via the Vercel dashboard

### Local Development vs Production

- **Local**: Use `.env` file or shell environment variables
- **Production**: Set variables in Vercel dashboard
- **No code changes needed** between environments! ✨ 