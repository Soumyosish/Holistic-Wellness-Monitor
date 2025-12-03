import React, { useState, useRef, useEffect, useMemo } from "react";
import { Send, MessageSquare } from "lucide-react";
import chat from "../assets/chat.png";
const ChatBot = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "doctor",
      text: "Hi there! I'm Dr. Wellness, your AI health assistant. How can I help you today?",
      time: "Just now",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const conversationHistory = useMemo(() => {
    return messages.slice(1).map((message) => ({
      role: message.sender === "doctor" ? "model" : "user",
      parts: [{ text: message.text }],
    }));
  }, [messages]);
  const callGeminiAPI = async (userMessage) => {
    if (!GEMINI_API_KEY) {
      console.error("Gemini API Key is missing!");
      return "ERROR: AI service not configured. Please set the VITE_GEMINI_API_KEY.";
    }
    const systemInstruction = {
      role: "user",
      parts: [
        {
          text: `You are Dr. Wellness, an AI health assistant. Provide helpful, accurate, and compassionate health advice. 
            Always remind users to consult with real healthcare professionals for serious concerns.
            Response guidelines: 1. Be empathetic and professional. 2. Provide practical advice. 3. Mention when to seek immediate medical attention. 4. Keep responses concise but informative. 5. Ask follow-up questions if needed.`,
        },
      ],
    };
    const currentMessage = {
      role: "user",
      parts: [{ text: userMessage }],
    };
    const contents = [
      systemInstruction,
      ...conversationHistory,
      currentMessage,
    ];
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API request failed: ${
            errorData.error?.message || response.statusText
          }`
        );
      }
      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm sorry, I couldn't process your question. Please try again."
      );
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return `I'm having trouble connecting to my knowledge base. Error: ${error.message}. Please check your API key and network connection.`;
    }
  };
  const handleSendMessage = async () => {
    const messageText = newMessage.trim();
    if (!messageText) return;
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: messageText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const aiResponse = await callGeminiAPI(messageText);
        const aiMessage = {
          id: Date.now() + 1,
          sender: "doctor", // Use 'doctor' for UI styling
          text: aiResponse,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error in chat processing:", error);
        const errorMessage = {
          id: Date.now() + 1,
          sender: "doctor",
          text: "I apologize, an unexpected error occurred while processing your request. Please try again.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
        setIsLoading(false);
      }
    }, 1000);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleQuickQuestion = (question) => {
    setNewMessage(question);
    setTimeout(() => handleSendMessage(), 10);
  };
  const quickQuestions = [
    "What are the symptoms of dehydration?",
    "How much water should I drink daily?",
    "What's a good exercise routine?",
    "How to improve sleep quality?",
  ];
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Logo/Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform ease-in-out"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <span className="text-blue-800 text-lg font-bold leading-none mb-0.5  ">
            X
          </span>
        ) : (
          <img
            src={chat}
            alt="Open chat"
            className="w-20 h-20 font-bold object-contain"
          />
        )}
      </button>
      {/* Chat Container (Conditional Render) */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[300px] h-[540px] bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 flex flex-col transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden  flex items-center justify-center">
                <img
                  src={chat}
                  alt="Dr. Wellness"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Dr. Wellness
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Online</span>
            </div>
          </div>
          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "doctor" ? "justify-start" : "justify-end"
                }`}
              >
                <div className="max-w-[85%]">
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === "doctor"
                        ? "bg-blue-50 text-gray-800 rounded-tl-none"
                        : "bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-tr-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </p>
                    <p
                      className={`text-xs mt-1 text-right ${
                        message.sender === "doctor"
                          ? "text-gray-500"
                          : "text-blue-100"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[85%]">
                  <div className="rounded-2xl px-4 py-3 bg-blue-50 text-gray-800 rounded-tl-none">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                      <span className="text-xs text-gray-500 ml-2">
                        Dr. Wellness is typing...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Quick Questions */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isLoading}
                  className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          {/* Input Area */}
          <div className="mt-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about health, symptoms, or wellness..."
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  rows="2"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isLoading}
                className="w-10 h-10 p-2 mt-0.5 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatBot;
