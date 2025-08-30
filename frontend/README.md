# AOL Instant Messenger - ChatGPT Edition 🚀

Welcome to the classic AOL Instant Messenger interface reimagined for chatting with ChatGPT! This nostalgic frontend brings back the beloved AIM experience while connecting to modern AI technology.

## ✨ Features

- 🎨 **Classic AOL Instant Messenger Design** - Authentic retro styling with the iconic blue theme
- 🤖 **ChatGPT Integration** - Real-time conversations with OpenAI's AI models
- 📡 **Streaming Responses** - Watch AI responses appear in real-time, just like the old days
- 🔐 **Secure API Key Management** - Password-style input for your OpenAI API key
- 📱 **Responsive Design** - Works great on desktop and mobile devices
- ⚡ **Fast Performance** - Built with Next.js for optimal speed

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

1. Click the **Settings** icon (⚙️) in the top-right corner of the chat window
2. Enter your **OpenAI API Key** in the password field
3. The connection status will show green when connected

### 4. Start Chatting!

- Type your message in the input field
- Press **Enter** to send
- Watch ChatGPT respond in real-time with the classic AIM style

## 🎯 How to Use

### Basic Chatting
- **Send Message**: Type and press Enter
- **New Line**: Press Shift+Enter
- **Settings**: Click the gear icon to manage your API key

### Message Types
- **Your Messages**: Appear in blue bubbles on the right
- **AI Responses**: Appear in gray bubbles on the left
- **Timestamps**: Each message shows when it was sent

### Connection Status
- 🟢 **Green Dot**: Connected and ready to chat
- 🟠 **Orange Dot**: Disconnected (check your API key)

## 🔧 Development

### Project Structure
```
frontend/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main chat interface
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Styling
The app uses **Tailwind CSS** with custom AOL-themed colors:
- `aol-blue` (#0066CC) - Primary blue
- `aol-light-blue` (#3399FF) - Light blue
- `aol-green` (#00CC00) - Online status
- `aol-orange` (#FF6600) - Disconnected status

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
Edit `tailwind.config.js` to modify the AOL color scheme:

```javascript
colors: {
  'aol-blue': '#0066CC',        // Main blue
  'aol-light-blue': '#3399FF',  // Light blue
  'aol-green': '#00CC00',       // Online status
  // ... add more colors
}
```

### Modifying Styles
Update `app/globals.css` to change component styles:

```css
.aol-window {
  @apply bg-white border-2 border-aol-blue rounded-lg shadow-aol;
}
```

## 🐛 Troubleshooting

### Common Issues

**"Failed to get response from AI"**
- Check your OpenAI API key is correct
- Ensure you have sufficient API credits
- Verify the FastAPI backend is running

**"Connection Refused"**
- Make sure the FastAPI backend is running on port 8000
- Check if the backend URL is correct in the API route

**Styling Issues**
- Clear your browser cache
- Restart the development server
- Check that Tailwind CSS is properly configured

## 📞 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your OpenAI API key is valid
3. Ensure the FastAPI backend is running
4. Check the network tab for failed requests

## 🎉 Enjoy Your AOL Experience!

Relive the nostalgia of AOL Instant Messenger while chatting with modern AI technology. The familiar interface will make you feel right at home! 

---

*"You've got mail!" - but now it's from ChatGPT! 🤖✨*