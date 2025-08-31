# Matrix Terminal - ChatGPT Interface 🖥️

Welcome to the Matrix Terminal interface for ChatGPT! This cyberpunk-themed terminal brings the iconic Matrix aesthetic to modern AI conversations. Experience the future of chat with a retro-futuristic terminal interface.

## ✨ Features

- 🎨 **Matrix Terminal Design** - Authentic cyberpunk styling with green text on black backgrounds
- 🤖 **ChatGPT Integration** - Real-time conversations with OpenAI's AI models
- 📡 **Streaming Responses** - Watch AI responses appear in real-time with terminal-style typing
- 🔐 **Secure API Key Management** - Password-style input for your OpenAI API key
- 📱 **Responsive Design** - Works great on desktop and mobile devices
- ⚡ **Fast Performance** - Built with Next.js for optimal speed
- 🌧️ **Matrix Rain Effect** - Animated background with falling characters
- 💻 **Terminal Cursor** - Authentic blinking cursor effect
- 🎭 **Cyberpunk Aesthetics** - Glowing effects, terminal fonts, and Matrix colors

## 🛠️ Prerequisites

Before you begin, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **OpenAI API Key** - Get one from [OpenAI's website](https://platform.openai.com/api-keys)
- **FastAPI Backend Running** - The Python backend should be running on `http://localhost:8000`

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 3. Configure Your API Key

1. Click the **Settings** icon (⚙️) in the top-right corner of the terminal
2. Enter your **OpenAI API Key** in the password field
3. The connection status will show green when connected

### 4. Begin Communication

- Type your message in the terminal input
- Press **Enter** to send
- Watch ChatGPT respond in real-time with Matrix-style text

## 🎯 How to Use

### Basic Terminal Commands
- **Send Message**: Type and press Enter
- **New Line**: Press Shift+Enter
- **Settings**: Click the gear icon to manage your API key
- **Abort**: Ctrl+C (visual only)

### Message Types
- **Your Messages**: Appear in bright green with USER label
- **AI Responses**: Appear in standard green with AI_ASSISTANT label
- **Timestamps**: Each message shows when it was sent in [HH:MM:SS] format

### Connection Status
- 🟢 **Green Dots**: Connected and ready for communication
- 🔴 **Red Dots**: Disconnected (check your API key)

## 🔧 Development

### Project Structure
```
frontend/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles with Matrix theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main terminal interface
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS with Matrix colors
└── tsconfig.json          # TypeScript configuration
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Styling
The app uses **Tailwind CSS** with custom Matrix-themed colors:
- `matrix-green` (#00FF00) - Primary green text
- `matrix-bright` (#00FF41) - Bright green for highlights
- `matrix-bg` (#000000) - Pure black background
- `matrix-dark-bg` (#0A0A0A) - Dark background for panels
- `matrix-gray` (#1A1A1A) - Gray for secondary elements

### Animations
- **Matrix Rain**: Falling characters in the background
- **Terminal Cursor**: Blinking cursor effect
- **Glow Effects**: Hover effects on interactive elements
- **Pulse Animations**: Loading indicators

## 🌐 Deployment

This frontend is designed to work with **Vercel** deployment:

1. **Build the Project**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   npx vercel
   ```

3. **Configure Environment**:
   - Make sure your FastAPI backend is also deployed
   - Update the API endpoint in `app/api/chat/route.ts` if needed

## 🔗 Backend Integration

This frontend connects to the FastAPI backend located in the `../api/` directory. Make sure:

1. The FastAPI server is running on `http://localhost:8000`
2. The backend has CORS enabled (already configured)
3. Your OpenAI API key is valid

## 🎨 Customization

### Changing Colors
Edit `tailwind.config.js` to modify the Matrix color scheme:

```javascript
colors: {
  'matrix-green': '#00FF00',        // Main green
  'matrix-bright': '#00FF41',       // Bright green
  'matrix-bg': '#000000',           // Background
  'matrix-dark-bg': '#0A0A0A',      // Dark panels
  // ... add more colors
}
```

### Modifying Styles
Update `app/globals.css` to change component styles:

```css
.matrix-window {
  @apply bg-matrix-bg border border-matrix-green rounded-none shadow-matrix;
}
```

### Animation Effects
Customize animations in `tailwind.config.js`:

```javascript
animation: {
  'matrix-fade': 'matrixFade 2s ease-in-out infinite',
  'terminal-blink': 'terminalBlink 1s infinite',
  // ... add more animations
}
```

## 🐛 Troubleshooting

### Common Issues

**"ERROR: API_KEY_NOT_FOUND"**
- Check your OpenAI API key is correct
- Ensure you have sufficient API credits
- Verify the FastAPI backend is running

**"CONNECTION_FAILED: Backend unreachable"**
- Make sure the FastAPI backend is running on port 8000
- Check if the backend URL is correct in the API route

**Styling Issues**
- Clear your browser cache
- Restart the development server
- Check that Tailwind CSS is properly configured

**Matrix Rain Not Showing**
- Ensure your browser supports CSS animations
- Check if JavaScript is enabled
- Try refreshing the page

## 📞 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your OpenAI API key is valid
3. Ensure the FastAPI backend is running
4. Check the network tab for failed requests

## 🎉 Welcome to the Matrix!

Experience the future of AI communication through the lens of cyberpunk aesthetics. The Matrix Terminal brings together the nostalgic feel of classic terminals with the power of modern AI technology.

---

*"Wake up, Neo... The Matrix has you." - Now with ChatGPT integration! 🤖✨*