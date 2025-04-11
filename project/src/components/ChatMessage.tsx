import React from 'react';
import { MessageCircle, Bot } from 'lucide-react';
import { Message } from '../types/chat';
import ReactMarkdown from 'react-markdown';
import { trackArticleClick } from '../services/tracking';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Custom renderer for links to open in new tab and track clicks
  const renderers = {
    a: ({ href, children }: { href?: string; children: React.ReactNode }) => {
      const handleClick = () => {
        if (href) {
          // Track the click before opening the link
          trackArticleClick(children as string, href);
        }
      };

      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
          onClick={handleClick}
        >
          {children}
        </a>
      );
    },
  };

  return (
    <div className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-600' : 'bg-gray-600'
      }`}>
        {isUser ? <MessageCircle size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
      </div>
      <div className={`flex flex-col w-full max-w-[85%] leading-1.5 p-4 border-gray-200 ${
        isUser ? 'bg-blue-100' : 'bg-gray-100'
      } rounded-lg`}>
        <div className="text-sm font-normal text-gray-900 prose prose-sm max-w-none">
          <ReactMarkdown components={renderers}>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

// Thinking animation component
export const ThinkingMessage: React.FC = () => {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-600">
        <Bot size={18} className="text-white" />
      </div>
      <div className="flex flex-col w-full max-w-[85%] leading-1.5 p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
        </div>
      </div>
    </div>
  );
};