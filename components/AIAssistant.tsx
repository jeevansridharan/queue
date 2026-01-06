import React, { useState } from 'react';
import { generateQueueSuggestions, chatWithAI } from '../AIUtils';
import './AIAssistant.css';

interface AIAssistantProps {
    queueData?: {
        currentWaitTime: number;
        queueLength: number;
        shopType: 'canteen' | 'xerox';
    };
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ queueData }) => {
    const [suggestion, setSuggestion] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [showChat, setShowChat] = useState(false);

    const handleGetSuggestion = async () => {
        if (!queueData) return;

        setLoading(true);
        try {
            const result = await generateQueueSuggestions(queueData);
            setSuggestion(result);
        } catch (error) {
            setSuggestion('Unable to generate suggestions. Please check your API key.');
        } finally {
            setLoading(false);
        }
    };

    const handleChat = async () => {
        if (!chatMessage.trim()) return;

        setLoading(true);
        try {
            const result = await chatWithAI(chatMessage);
            setChatResponse(result);
            setChatMessage('');
        } catch (error) {
            setChatResponse('Unable to get response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-assistant">
            <div className="ai-header">
                <span className="ai-icon">🤖</span>
                <h3>AI Assistant</h3>
            </div>

            {queueData && (
                <div className="ai-suggestions">
                    <button
                        onClick={handleGetSuggestion}
                        disabled={loading}
                        className="ai-btn primary"
                    >
                        {loading ? '🔄 Analyzing...' : '✨ Get AI Suggestion'}
                    </button>

                    {suggestion && (
                        <div className="ai-response">
                            <p>{suggestion}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="ai-chat">
                <button
                    onClick={() => setShowChat(!showChat)}
                    className="ai-btn secondary"
                >
                    {showChat ? '❌ Close Chat' : '💬 Chat with AI'}
                </button>

                {showChat && (
                    <div className="chat-container">
                        <div className="chat-input-group">
                            <input
                                type="text"
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                                placeholder="Ask me anything about queues..."
                                className="chat-input"
                            />
                            <button
                                onClick={handleChat}
                                disabled={loading || !chatMessage.trim()}
                                className="chat-send-btn"
                            >
                                📤
                            </button>
                        </div>

                        {chatResponse && (
                            <div className="chat-response">
                                <strong>AI:</strong>
                                <p>{chatResponse}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
