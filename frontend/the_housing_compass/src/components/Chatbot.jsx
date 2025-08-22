import React, { useState, useEffect, useRef } from 'react';
import './styles/Chatbot.css';

// --- Send Icon (paper plane, can be animated later) ---
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Welcome to The Housing Compass! How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // --- API Base URL (from env or fallback to local) ---
  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

  // --- Scroll to latest message when messages update ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // --- Auto focus input when chat opens ---
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // --- Handle sending message ---
  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call API
      const response = await fetch(`${API_BASE_URL}/listings/chatbot/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();

      // Bot reply
      const botMessage = { text: data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Error fallback
      const errorMessage = { text: 'Sorry, I am having trouble connecting. Please try again later.', sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
      console.error("Chatbot API error:", error);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // --- Handle "Enter" key ---
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- Toggle Chat Window ---
  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="chatbot-container">
      {/* --- CHAT WINDOW --- */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        
        {/* --- HEADER --- */}
        <div className="chatbot-header">
          <h3>Compass AI</h3>
          <button className="chatbot-close-btn" onClick={toggleChat} aria-label="Close Chat">&times;</button>
        </div>
        
        {/* --- MESSAGES --- */}
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="message-bubble bot">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* --- INPUT --- */}
        <div className="chatbot-input-area">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
          />
          <button className="chatbot-send-btn" onClick={handleSend} aria-label="Send Message">
            <SendIcon />
          </button>
        </div>
      </div>

      {/* --- TOGGLE BUTTON (hidden when chat open) --- */}
      {!isOpen && (
        <button className="chatbot-toggle-button" onClick={toggleChat} aria-label="Open Chat">
          💬
        </button>
      )}
    </div>
  );
};

export default Chatbot;
