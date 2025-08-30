'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Settings, User, Bot } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showSettings, setShowSettings] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !apiKey.trim()) {
      setError('Please enter both a message and your OpenAI API key')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: "You are a helpful AI assistant. Respond in a friendly, conversational manner.",
          user_message: inputMessage,
          model: "gpt-4.1-mini",
          api_key: apiKey
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        sender: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])

      const decoder = new TextDecoder()
      let aiResponse = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        aiResponse += chunk

        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, content: aiResponse }
              : msg
          )
        )
      }

      setIsConnected(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aol-blue to-aol-light-blue p-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Chat Window */}
        <div className="aol-window">
          {/* Title Bar */}
          <div className="aol-title-bar">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-aol-green rounded-full"></div>
              <span>AOL Instant Messenger - ChatGPT Edition</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:text-aol-yellow transition-colors"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 border-b border-aol-gray bg-aol-light-gray">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-bold text-aol-dark-gray mb-1">
                    OpenAI API Key:
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                    className="aol-input w-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-aol-green' : 'bg-aol-orange'}`}></div>
                  <span className="text-sm font-bold">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 bg-white">
            {messages.length === 0 ? (
              <div className="text-center text-aol-dark-gray mt-20">
                <Bot size={48} className="mx-auto mb-4 text-aol-blue" />
                <p className="text-lg font-bold">Welcome to AOL Instant Messenger!</p>
                <p className="text-sm">Enter your OpenAI API key in settings and start chatting with ChatGPT</p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`aol-message ${
                      message.sender === 'user' ? 'aol-message-user' : 'aol-message-ai'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        {message.sender === 'user' ? (
                          <User size={16} className="text-white" />
                        ) : (
                          <Bot size={16} className="text-aol-blue" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold mb-1">
                          {message.sender === 'user' ? 'You' : 'ChatGPT'}
                        </div>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs text-aol-dark-gray mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="aol-message aol-message-ai">
                    <div className="flex items-center space-x-2">
                      <Bot size={16} className="text-aol-blue" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-aol-blue rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-aol-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-aol-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-bold">Error:</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-aol-gray bg-aol-light-gray">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="aol-input flex-1"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="aol-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="text-xs text-aol-dark-gray mt-2">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white text-sm mt-4">
          <p>© 2024 AOL Instant Messenger - ChatGPT Edition</p>
          <p className="text-xs opacity-75">Powered by OpenAI API</p>
        </div>
      </div>
    </div>
  )
}
