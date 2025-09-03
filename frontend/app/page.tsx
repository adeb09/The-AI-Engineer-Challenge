'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Send, Settings, User, Bot, Terminal, Zap, Brain, MessageSquare, Cpu, Sparkles, Signal, WifiOff, Plus } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface MatrixRainColumn {
  id: number
  left: string
  delay: string
  chars: string[]
}

// Available OpenAI models
const AVAILABLE_MODELS = [
  { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', description: 'Fast and efficient' },
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Latest and most capable' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Balanced performance' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Previous generation' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and affordable' }
]

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

  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [cursorOffset, setCursorOffset] = useState(0)
  
  // Model selection and chat session state
  const [selectedModel, setSelectedModel] = useState('gpt-4.1-mini')
  const [chatStarted, setChatStarted] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const calculateCursorPosition = (text: string, offset: number) => {
    if (!inputRef.current) return 0
    
    // Get the text up to the cursor position
    const textBeforeCursor = text.substring(0, offset)
    
    // Create a temporary span to measure text width
    const tempSpan = document.createElement('span')
    tempSpan.style.font = window.getComputedStyle(inputRef.current).font
    tempSpan.style.visibility = 'hidden'
    tempSpan.style.position = 'absolute'
    tempSpan.style.whiteSpace = 'pre'
    tempSpan.textContent = textBeforeCursor
    
    document.body.appendChild(tempSpan)
    const width = tempSpan.getBoundingClientRect().width
    document.body.removeChild(tempSpan)
    
    return width
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isInputFocused) {
      setCursorPosition(calculateCursorPosition(inputMessage, cursorOffset))
    }
  }, [isInputFocused, inputMessage, cursorOffset])



  const startNewChat = () => {
    setMessages([])
    setChatStarted(false)
    setError('')
    setIsConnected(false)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) {
      setError('ERROR: MESSAGE_EMPTY')
      return
    }

    // Mark chat as started when first message is sent
    if (!chatStarted) {
      setChatStarted(true)
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
          model: selectedModel
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

  // Generate Matrix rain columns with falling characters
  const generateMatrixRain = (): MatrixRainColumn[] => {
    const columns: MatrixRainColumn[] = []
    const numColumns = 40 // Much more columns for intense overlap
    
    for (let i = 0; i < numColumns; i++) {
      const left = `${(i * 2.5) % 100}%` // Very close spacing for heavy overlap
      const delay = `${(i * 0.05) % 1.5}s` // Even shorter delays for more simultaneous start
      
      // Create a column of characters with variety
      const columnChars: string[] = []
      for (let j = 0; j < 30; j++) { // More characters per column for longer trails
        // Authentic Matrix-style characters: numbers, letters, and symbols
        let char
        if (Math.random() > 0.6) {
          // Numbers (most common in Matrix)
          char = Math.floor(Math.random() * 10).toString()
        } else if (Math.random() > 0.3) {
          // Letters (both uppercase and lowercase)
          const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
          char = letters[Math.floor(Math.random() * letters.length)]
        } else {
          // Matrix symbols and special characters
          const matrixSymbols = ['@', '#', '$', '%', '&', '*', '+', '=', '<', '>', '|', '\\', '/', '~', '^', '!', '?', ':', ';', '.', ',', '_', '-']
          char = matrixSymbols[Math.floor(Math.random() * matrixSymbols.length)]
        }
        columnChars.push(char)
      }
      
      columns.push({
        id: i,
        left,
        delay,
        chars: columnChars
      })
    }
    
    // Add some random offset columns for even more overlap
    for (let i = 0; i < 15; i++) {
      const left = `${Math.random() * 100}%` // Random positions
      const delay = `${Math.random() * 1}s` // Random delays
      
      const columnChars: string[] = []
      for (let j = 0; j < 25; j++) {
        let char
        if (Math.random() > 0.6) {
          char = Math.floor(Math.random() * 10).toString()
        } else if (Math.random() > 0.3) {
          const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
          char = letters[Math.floor(Math.random() * letters.length)]
        } else {
          const matrixSymbols = ['@', '#', '$', '%', '&', '*', '+', '=', '<', '>', '|', '\\', '/', '~', '^', '!', '?', ':', ';', '.', ',', '_', '-']
          char = matrixSymbols[Math.floor(Math.random() * matrixSymbols.length)]
        }
        columnChars.push(char)
      }
      
      columns.push({
        id: numColumns + i,
        left,
        delay,
        chars: columnChars
      })
    }
    
    return columns
  }

  // Use useMemo to generate Matrix rain only once and keep it stable
  const matrixRainColumns = useMemo(() => generateMatrixRain(), [])

  // Matrix rain animation effect - intense and fast
  useEffect(() => {
    if (!isClient) return

    // Fast, intense animation using setInterval
    const intervals: NodeJS.Timeout[] = []
    
    matrixRainColumns.forEach((column, index) => {
      const speed = 20 + (index % 5) * 8 // Much faster: 20ms, 28ms, 36ms, 44ms, 52ms
      const moveDistance = 3 + (index % 3) * 1 // Faster movement: 3px, 4px, 5px
      
      const interval = setInterval(() => {
        const element = document.querySelector(`[data-matrix-column="${column.id}"]`) as HTMLElement
        if (element) {
          const currentTop = parseFloat(element.style.top || '0')
          const newTop = currentTop + moveDistance
          
          if (newTop > window.innerHeight + 300) {
            element.style.top = '-300px' // Reset to top when off screen
          } else {
            element.style.top = `${newTop}px`
          }
        }
      }, speed)
      
      intervals.push(interval)
    })
    
    // Cleanup intervals on unmount
    return () => {
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [isClient, matrixRainColumns])

  return (
    <div className="min-h-screen bg-matrix-bg p-4 relative overflow-hidden">
      {/* Matrix rain background - only render on client */}
      {isClient && (
        <>
          {/* Matrix grid overlay */}
          <div className="matrix-grid"></div>
          
          {/* Matrix rain characters - JavaScript animated */}
          <div className="fixed inset-0 pointer-events-none">

            
            {matrixRainColumns.map((column) => (
              <div
                key={column.id}
                data-matrix-column={column.id}
                style={{
                  position: 'fixed',
                  top: '0vh',
                  left: column.left,
                  color: '#00FF00',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '24px',
                  lineHeight: '1.8',
                  textShadow: '0 0 20px #00FF00, 0 0 30px #00FF00',
                  zIndex: -1,
                  whiteSpace: 'nowrap',
                  fontWeight: 'bold',
                  opacity: 1.0
                }}
              >
                {column.chars.join('\n')}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Main Terminal Window */}
        <div className="matrix-window">
          {/* Terminal Header */}
          <div className="matrix-title-bar">
            <div className="flex items-center space-x-2">
              <OpenAILogo size={20} className="text-matrix-green" />
              <span className="text-xl font-bold tracking-wider text-matrix-green">OpenAI Chat Terminal</span>
              <div className="flex items-center">
                {isLoading ? (
                  <div className="w-4 h-4 rounded-full bg-matrix-green animate-pulse"></div>
                ) : isConnected ? (
                  <div className="w-4 h-4 rounded-full bg-matrix-green"></div>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                )}
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

          {/* Model Selection and New Chat Panel */}
          {!chatStarted && (
            <div className="p-4 border-b border-matrix-green bg-matrix-dark-bg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-matrix-green">MODEL:</span>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="matrix-select bg-matrix-bg border border-matrix-green text-matrix-green px-3 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-matrix-green"
                      disabled={chatStarted}
                    >
                      {AVAILABLE_MODELS.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} - {model.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-xs text-matrix-dim">
                    <span>Selected: {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}</span>
                  </div>
                </div>
                <button
                  onClick={startNewChat}
                  className="matrix-button flex items-center space-x-2 px-3 py-1"
                >
                  <Plus size={14} />
                  <span>New Chat</span>
                </button>
              </div>
            </div>
          )}

          {/* Model Display (when chat is active) */}
          {chatStarted && (
            <div className="p-3 border-b border-matrix-green bg-matrix-dark-bg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-matrix-green">ACTIVE MODEL:</span>
                  <span className="text-matrix-dim text-sm">{AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}</span>
                </div>
                <button
                  onClick={startNewChat}
                  className="matrix-button flex items-center space-x-2 px-2 py-1 text-sm"
                >
                  <Plus size={14} />
                  <span>New Chat</span>
                </button>
              </div>
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 border-b border-matrix-green bg-matrix-dark-bg">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {isLoading ? (
                    <div className="w-4 h-4 rounded-full bg-matrix-green animate-pulse"></div>
                  ) : isConnected ? (
                    <div className="w-4 h-4 rounded-full bg-matrix-green"></div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  )}
                  <span className="text-sm font-bold text-matrix-green">
                    STATUS: {isLoading ? 'PROCESSING' : isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                  </span>
                </div>
                <div className="text-xs text-matrix-dim">
                  <p>API Key: Configured via environment variables</p>
                  <p>Current Model: {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}</p>
                  <p>Model ID: {selectedModel}</p>
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
                <p className="text-sm text-matrix-dim">Ready to communicate - API key configured via backend</p>
                <div className="mt-4 text-xs text-matrix-green">
                  <p>SYSTEM: Ready for input...</p>
                  <p>PROTOCOL: {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}</p>
                  <p>STATUS: Connected to backend</p>
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
              <div className="flex-1 flex items-center relative">
                <span className="text-matrix-green mr-2 font-terminal">{'>'}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value)
                    setCursorOffset(e.target.value.length)
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder={isInputFocused ? "" : "Enter your message..."}
                  className="matrix-input flex-1 bg-transparent border-none focus:ring-0"
                  disabled={isLoading}
                  onFocus={(e) => {
                    e.target.style.caretColor = 'transparent';
                    setIsInputFocused(true);
                    setCursorOffset(e.target.selectionStart || 0);
                  }}
                  onBlur={(e) => {
                    e.target.style.caretColor = '#00FF00';
                    setIsInputFocused(false);
                  }}
                  onSelect={(e) => {
                    const target = e.target as HTMLInputElement;
                    setCursorOffset(target.selectionStart || 0);
                  }}
                  onKeyUp={(e) => {
                    const target = e.target as HTMLInputElement;
                    setCursorOffset(target.selectionStart || 0);
                  }}
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement;
                    setCursorOffset(target.selectionStart || 0);
                  }}
                />
                {/* Custom thick cursor */}
                {isInputFocused && (
                  <div 
                    className="absolute w-3 h-6 bg-matrix-green opacity-80 animate-pulse"
                    style={{
                      left: `${cursorPosition + 28}px`,
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                )}
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
          <p className="text-xs opacity-75">Powered by OpenAI API | Protocol: v1.0 | Backend Configured</p>
          <div className="flex justify-center space-x-4 mt-2 text-xs">
            <span className="text-matrix-green">● SYSTEM_ACTIVE</span>
            <span className="text-matrix-green">● API_CONFIGURED</span>
            <span className="text-matrix-dim">● MATRIX_PROTOCOL</span>
          </div>
        </div>
      </div>
    </div>
  )
}
