'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Settings, User, Bot, Terminal, Zap, Brain, MessageSquare, Cpu, Sparkles } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

// Custom OpenAI Logo Component
const OpenAILogo = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142-.0852 4.783-2.7582a.7712.7712 0 0 0 .7806 0l5.8428 3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
      fill="currentColor"
    />
  </svg>
)

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !apiKey.trim()) {
      setError('ERROR: API_KEY_NOT_FOUND || MESSAGE_EMPTY')
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
        throw new Error('CONNECTION_FAILED: Backend unreachable')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('STREAM_ERROR: No response body')
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
      setError(err instanceof Error ? err.message : 'UNKNOWN_ERROR: System failure')
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

  // Generate deterministic Matrix rain characters
  const generateMatrixRain = () => {
    const characters = []
    for (let i = 0; i < 20; i++) {
      // Use a deterministic seed based on position
      const seed = i * 7 + 13
      const charCode = 0x30A0 + (seed % 96)
      characters.push({
        id: i,
        char: String.fromCharCode(charCode),
        left: `${(seed * 11) % 100}%`,
        delay: `${(seed * 3) % 5}s`,
        duration: `${3 + (seed % 2)}s`
      })
    }
    return characters
  }

  const matrixRainChars = generateMatrixRain()

  return (
    <div className="min-h-screen bg-matrix-bg p-4 relative overflow-hidden">
      {/* Matrix rain background - only render on client */}
      {isClient && (
        <div className="fixed inset-0 pointer-events-none">
          {matrixRainChars.map((char) => (
            <div
              key={char.id}
              className="absolute text-matrix-green text-xs opacity-20 animate-matrix-rain"
              style={{
                left: char.left,
                animationDelay: char.delay,
                animationDuration: char.duration
              }}
            >
              {char.char}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Main Terminal Window */}
        <div className="matrix-window">
          {/* Terminal Header */}
          <div className="matrix-title-bar">
            <div className="flex items-center space-x-2">
              <OpenAILogo size={20} className="text-matrix-green" />
              <span className="text-xl font-bold tracking-wider text-matrix-green">OpenAI Chat Terminal</span>
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-matrix-green' : 'bg-red-500'}`}></div>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-matrix-green' : 'bg-red-500'}`}></div>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-matrix-green' : 'bg-red-500'}`}></div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-matrix-dim text-xs">SYSTEM: {isConnected ? 'ONLINE' : 'OFFLINE'}</span>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="text-matrix-green hover:text-matrix-green transition-colors"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 border-b border-matrix-green bg-matrix-dark-bg">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-bold text-matrix-green mb-1">
                    OPENAI_API_KEY:
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                    className="matrix-input w-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-matrix-green' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-bold text-matrix-green">
                    STATUS: {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Chat Terminal */}
          <div className="h-96 overflow-y-auto p-4 bg-matrix-bg terminal-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center text-matrix-dim mt-20">
                <Terminal size={48} className="mx-auto mb-4 text-matrix-green" />
                <p className="text-lg font-bold text-matrix-green mb-2">YOUR OPENAI CHAT TERMINAL INITIALIZED</p>
                <p className="text-sm text-matrix-dim">Enter your OpenAI API key in settings and begin communication</p>
                <div className="mt-4 text-xs text-matrix-green">
                  <p>SYSTEM: Ready for input...</p>
                  <p>PROTOCOL: ChatGPT v4.1-mini</p>
                  <p>STATUS: Awaiting connection</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`matrix-message ${
                      message.sender === 'user' ? 'matrix-message-user' : 'matrix-message-ai'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        {message.sender === 'user' ? (
                          <User size={16} className="text-matrix-green" />
                        ) : (
                          <Bot size={16} className="text-matrix-green" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold mb-1 text-matrix-dim">
                          {message.sender === 'user' ? 'USER' : 'AI_ASSISTANT'}
                        </div>
                        <div className="whitespace-pre-wrap font-terminal">{message.content}</div>
                        <div className="text-xs text-matrix-dim mt-1">
                          [{message.timestamp.toLocaleTimeString()}]
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="matrix-message matrix-message-ai">
                    <div className="flex items-center space-x-2">
                      <Bot size={16} className="text-matrix-green" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-matrix-green rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-matrix-green rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-matrix-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-matrix-dim text-xs ml-2">PROCESSING...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-900 border border-red-500 text-red-300">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-bold text-red-300">ERROR:</span>
                <span className="font-terminal">{error}</span>
              </div>
            </div>
          )}

          {/* Input Terminal */}
          <div className="p-4 border-t border-matrix-green bg-matrix-dark-bg">
            <div className="flex space-x-2">
              <div className="flex-1 flex items-center">
                <span className="text-matrix-green mr-2 font-terminal">{'>'}</span>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your message..."
                  className="matrix-input flex-1 bg-transparent border-none focus:ring-0"
                  disabled={isLoading}
                />
                {!isLoading && <span className="terminal-cursor"></span>}
              </div>
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="matrix-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="text-xs text-matrix-dim mt-2 font-terminal">
              COMMAND: Press Enter to send | Shift+Enter for new line | Ctrl+C to abort
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-matrix-dim text-sm mt-4 font-terminal">
          <p>© 2024 YOUR OPENAI CHAT TERMINAL - ChatGPT Interface</p>
          <p className="text-xs opacity-75">Powered by OpenAI API | Protocol: v1.0</p>
          <div className="flex justify-center space-x-4 mt-2 text-xs">
            <span className="text-matrix-green">● SYSTEM_ACTIVE</span>
            <span className="text-matrix-dim">● ENCRYPTION_ENABLED</span>
            <span className="text-matrix-dim">● MATRIX_PROTOCOL</span>
          </div>
        </div>
      </div>
    </div>
  )
}
