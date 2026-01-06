import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error('⚠️ VITE_GEMINI_API_KEY is not set in .env file');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

/**
 * Generate AI-powered suggestions for queue optimization
 */
export async function generateQueueSuggestions(
    queueData: {
        currentWaitTime: number;
        queueLength: number;
        shopType: 'canteen' | 'xerox';
    }
): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are an AI assistant for Campus QuickServe, a queue management system.
    
Current queue status:
- Shop type: ${queueData.shopType}
- Current wait time: ${queueData.currentWaitTime} minutes
- Queue length: ${queueData.queueLength} people

Provide a brief, helpful suggestion (2-3 sentences) for students about:
1. Whether they should join the queue now or wait
2. Alternative options if available
3. Estimated best time to visit

Keep it friendly and concise.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating AI suggestions:', error);
        return 'Unable to generate suggestions at this time. Please try again later.';
    }
}

/**
 * Generate personalized recommendations based on user order history
 */
export async function generatePersonalizedRecommendations(
    orderHistory: string[]
): Promise<string[]> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Based on this order history: ${orderHistory.join(', ')}
    
Suggest 3 items the user might like to order. Return only the item names, one per line.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text.split('\n').filter(line => line.trim()).slice(0, 3);
    } catch (error) {
        console.error('Error generating recommendations:', error);
        return [];
    }
}

/**
 * Chat with AI assistant about the queue system
 */
export async function chatWithAI(userMessage: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are a helpful assistant for Campus QuickServe, a college queue management system.
    
User question: ${userMessage}

Provide a helpful, concise response about queue management, ordering, or campus services.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error in AI chat:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
}

export default {
    generateQueueSuggestions,
    generatePersonalizedRecommendations,
    chatWithAI,
};
