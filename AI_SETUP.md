# 🤖 AI Integration Guide - Campus QuickServe

## 🚀 Quick Start

### 1. Get Your Google Gemini API Key

1. Visit: [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key

### 2. Configure Environment Variables

Open the `.env` file in the root directory and add your API key:

```env
VITE_GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

⚠️ **Important**: Never commit your `.env` file to Git! It's already in `.gitignore`.

### 3. Restart Development Server

After adding your API key, restart the dev server:

```bash
npm run dev
```

## 📦 What's Included

### 1. **AIUtils.ts** - Core AI Functions
- `generateQueueSuggestions()` - Get AI-powered queue recommendations
- `generatePersonalizedRecommendations()` - Get personalized order suggestions
- `chatWithAI()` - Interactive AI chat assistant

### 2. **AIAssistant Component** - Ready-to-Use UI
- Beautiful glassmorphic design
- Queue suggestion button
- Interactive chat interface
- Smooth animations

### 3. **AIDemo Component** - Example Implementation
- Shows how to use the AI Assistant
- Includes sample queue data
- Ready to integrate into your app

## 🎯 How to Use in Your App

### Option 1: Add to Existing Component

```tsx
import { AIAssistant } from './components/AIAssistant';

// In your component:
<AIAssistant 
  queueData={{
    currentWaitTime: 15,
    queueLength: 8,
    shopType: 'canteen'
  }} 
/>
```

### Option 2: Use AI Functions Directly

```tsx
import { generateQueueSuggestions, chatWithAI } from './AIUtils';

// Get queue suggestions
const suggestion = await generateQueueSuggestions({
  currentWaitTime: 15,
  queueLength: 8,
  shopType: 'canteen'
});

// Chat with AI
const response = await chatWithAI("When is the best time to visit?");
```

## 🎨 Features

✅ **Smart Queue Analysis** - AI analyzes current queue status and provides recommendations  
✅ **Interactive Chat** - Ask questions about queues, ordering, and campus services  
✅ **Personalized Recommendations** - Get suggestions based on order history  
✅ **Beautiful UI** - Modern glassmorphic design with smooth animations  
✅ **Error Handling** - Graceful fallbacks if API calls fail  

## 🔧 Customization

### Change AI Model

Edit `AIUtils.ts` to use a different model:

```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
// or
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
```

### Customize Prompts

Modify the prompts in `AIUtils.ts` to change AI behavior:

```typescript
const prompt = `Your custom prompt here...`;
```

### Style the Component

Edit `components/AIAssistant.css` to match your design system.

## 📊 API Usage & Limits

- **Free Tier**: 60 requests per minute
- **Rate Limit**: Automatically handled by the SDK
- **Cost**: Free for development and testing

## 🐛 Troubleshooting

### "API key not set" Error
- Make sure `.env` file exists in the root directory
- Verify `VITE_GEMINI_API_KEY` is set correctly
- Restart the dev server after adding the key

### "Failed to fetch" Error
- Check your internet connection
- Verify API key is valid
- Check if you've exceeded rate limits

### AI Responses Not Showing
- Open browser console (F12) to check for errors
- Verify API key has proper permissions
- Try a different prompt

## 🎓 Learn More

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Gemini API Quickstart](https://ai.google.dev/tutorials/get_started_web)
- [Best Practices](https://ai.google.dev/docs/best_practices)

## 🚀 Next Steps

1. ✅ Get API key
2. ✅ Add to `.env` file
3. ✅ Restart dev server
4. 🎯 Integrate AI Assistant into your app
5. 🎨 Customize prompts and styling
6. 🚢 Deploy to production

---

**Need Help?** Check the console for detailed error messages or ask in the chat!
