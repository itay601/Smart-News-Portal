import React, { useState, useEffect } from 'react';

const ChatAgentPage = () => {
    const [selectedAgent, setSelectedAgent] = useState('gemenai');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your economic assistant. How can I help you today?', agent: 'gemenai' }
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const handleAgentChange = (agent) => {
        setSelectedAgent(agent);
        // Initialize with a welcome message for the selected agent
        setMessages([{ role: 'assistant', content: `Hello! I am your ${agent === 'gemenai' ? 'Gemenai' : 'Nvidia/Llama'} assistant. How can I help you today?`, agent }]);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        // Add user message to the chat
        const newUserMessage = { role: 'user', content: inputMessage, agent: selectedAgent };
        setMessages((prev) => [...prev, newUserMessage]);
        setInputMessage('');

        try {
            const url = selectedAgent === 'gemenai'
                ? `/v1/api/gemenaiChatbot`
                : `/v1/api/nvidiaAgent`;
            
            const body = selectedAgent === 'gemenai'
                ? { user_id: 'ita', message: inputMessage }
                : { message: inputMessage };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            const assistantMessage = { role: 'assistant', content: data.response || 'Sorry, I could not process your request.', agent: selectedAgent };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { role: 'assistant', content: 'Error communicating with the server.', agent: selectedAgent };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Chat Agents</h1>
            <div className="mb-4">
                <label className="mr-2 text-gray-700">Select Agent:</label>
                <select
                    value={selectedAgent}
                    onChange={(e) => handleAgentChange(e.target.value)}
                    className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                    <option value="gemenai">Gemenai</option>
                    <option value="nvidia">Nvidia/Llama</option>
                </select>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm h-[60vh] flex flex-col">
                <div className="flex-grow overflow-y-auto mb-4 border-b pb-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-3 mb-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div
                                className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold ${
                                    msg.role === 'user' ? 'bg-purple-500' : 'bg-blue-500'
                                }`}
                            >
                                {msg.role === 'user' ? 'U' : msg.agent === 'gemenai' ? 'G' : 'N'}
                            </div>
                            <div
                                className={`p-3 rounded-lg max-w-lg ${
                                    msg.role === 'user' ? 'bg-purple-100' : 'bg-gray-100'
                                }`}
                            >
                                <p className="text-sm text-gray-800">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full pl-4 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-send-horizontal"
                        >
                            <path d="m3 3 3 9-3 9 19-9Z" />
                            <path d="M6 12h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatAgentPage;

