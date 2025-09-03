import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get backend URL from environment variables, fallback to localhost for development
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    
    // Forward the request to the FastAPI backend
    const response = await fetch(`${backendUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      console.error(`Backend responded with status: ${response.status}`)
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    // Check if the response is streaming
    if (response.body) {
      // Return the streaming response from the backend
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Transfer-Encoding': 'chunked',
        },
      })
    } else {
      // Handle non-streaming response
      const text = await response.text()
      return new Response(text, {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache',
        },
      })
    }
  } catch (error) {
    console.error('Error in chat API route:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to communicate with backend'
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorMessage = 'Backend server is not running or unreachable'
      } else if (error.message.includes('status')) {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
