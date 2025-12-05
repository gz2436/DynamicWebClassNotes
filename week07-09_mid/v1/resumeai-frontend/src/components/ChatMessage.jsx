import React from 'react';
import '../styles/ChatMessage.css';

const ChatMessage = ({ message, isUser }) => {
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'ai-message'}`}>
      <div className="message-avatar">
        {isUser ? (
          <div className="user-avatar"></div>
        ) : (
          <div className="ai-avatar"></div>
        )}
      </div>
      <div className="message-content">
        <div className="message-text">{message}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
