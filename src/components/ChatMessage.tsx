
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          isUser
            ? 'bg-purple-600 text-white ml-12'
            : 'bg-gray-100 text-gray-900 mr-12'
        }`}
      >
        <div className="flex items-start space-x-2">
          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
            isUser ? 'bg-purple-500' : 'bg-gray-300'
          }`}>
            {isUser ? (
              <User className="w-3 h-3 text-white" />
            ) : (
              <Bot className="w-3 h-3 text-gray-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm whitespace-pre-wrap">{message}</p>
            <p className={`text-xs mt-1 ${
              isUser ? 'text-purple-200' : 'text-gray-500'
            }`}>
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
