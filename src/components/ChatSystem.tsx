import React, { useState } from 'react';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

interface ChatSystemProps {
  playerUsername: string;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ playerUsername }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      username: 'BingoMaster',
      message: 'Good luck everyone!',
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: '2', 
      username: 'LuckyPlayer',
      message: 'This is exciting!',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        username: playerUsername,
        message: newMessage.trim(),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 bg-white rounded-lg shadow-lg transition-all duration-300 z-40 ${
      isExpanded ? 'w-80 h-96' : 'w-12 h-12'
    }`}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full h-full flex items-center justify-center text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-semibold text-gray-800">Game Chat</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="text-sm">
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-purple-600">{msg.username}:</span>
                  <span className="text-gray-800">{msg.message}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-3 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={100}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatSystem;