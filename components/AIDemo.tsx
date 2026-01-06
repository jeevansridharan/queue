import React from 'react';
import { AIAssistant } from './AIAssistant';

const AIDemo: React.FC = () => {
    // Example queue data
    const exampleQueueData = {
        currentWaitTime: 15,
        queueLength: 8,
        shopType: 'canteen' as const
    };

    return (
        <div className="ai-demo-container">
            <div className="demo-header">
                <h1>🤖 AI Assistant Demo</h1>
                <p>Powered by Google Gemini AI</p>
            </div>

            <div className="demo-content">
                <div className="info-card">
                    <h3>📊 Current Queue Status</h3>
                    <div className="queue-stats">
                        <div className="stat">
                            <span className="stat-label">Wait Time:</span>
                            <span className="stat-value">{exampleQueueData.currentWaitTime} min</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Queue Length:</span>
                            <span className="stat-value">{exampleQueueData.queueLength} people</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Shop Type:</span>
                            <span className="stat-value">{exampleQueueData.shopType}</span>
                        </div>
                    </div>
                </div>

                <AIAssistant queueData={exampleQueueData} />

                <div className="instructions-card">
                    <h3>💡 How to Use</h3>
                    <ol>
                        <li>Click <strong>"Get AI Suggestion"</strong> to receive personalized queue recommendations</li>
                        <li>Click <strong>"Chat with AI"</strong> to ask questions about the queue system</li>
                        <li>Try asking: "When is the best time to visit?" or "What are the alternatives?"</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default AIDemo;
