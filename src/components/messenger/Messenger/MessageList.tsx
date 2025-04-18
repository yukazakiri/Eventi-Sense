import { BsChatDots } from 'react-icons/bs';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useState } from 'react';
import { Message } from '../types/index';
import { formatMessageTime } from '../utils/dateUtils';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onDeleteMessage?: (messageId: string) => void;

}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, onDeleteMessage }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full space-y-4">
        <BsChatDots className="w-12 h-12 text-sky-500 animate-bounce" />
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-gray-300">No messages yet</p>
          <p className="text-gray-500">Be the first one to start the conversation!</p>
        </div>
        <div className="w-24 h-0.5 bg-gradient-to-r from-sky-500/20 to-sky-500/40 rounded-full mt-2" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 py-2">
      {messages.map((message) => {
        const isSender = message.sender_id === currentUserId;

        return (
          <div key={message.id} className="w-full">
       
            
            <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} w-full`}>
              {/* Avatar for receiver messages */}
              {!isSender && (
                <div className="mr-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full overflow-hidden flex-shrink-0">
                    {message.sender_avatar ? (
                      <img 
                        src={message.sender_avatar} 
                        alt={message.sender_name || "User avatar"} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white">
                        {(message.sender_name || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            
              
              <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-3/4`}>
                <div className="flex items-start group">
                   {/* Three dots menu for sender */}
                   {isSender && (
                    <div className="relative self-start ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === message.id.toString() ? null : message.id.toString())}
                        className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <BsThreeDotsVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      
                      {activeDropdown === message.id.toString() && (
                        <div className="absolute right-0 top-full mt-1 w-32 py-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                      
                          <button
                            onClick={() => {
                              onDeleteMessage?.(message.id.toString());
                              setActiveDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 transition-colors"
                          >
                            Unsend
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Message bubble */}
                  <div 
                    className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md ${
                      isSender 
                        ? 'bg-sky-600 text-white rounded-br-none' 
                        : 'bg-slate-700 text-white rounded-bl-none'
                    }`}
                  >
                   
                    <p className="whitespace-normal break-words text-sm">{message.content}</p>
                  </div>
                      {/* Three dots menu for receiver */}
                      {!isSender && (
                    <div className="relative self-start mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === message.id.toString() ? null : message.id.toString())}
                        className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <BsThreeDotsVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      
                      {activeDropdown === message.id.toString() && (
                        <div className="absolute left-0 top-full mt-1 w-32 py-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                     
                          <button
                            onClick={() => {
                              onDeleteMessage?.(message.id.toString());
                              setActiveDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
             
                </div>
                
                {/* Time for sender messages */}
                {isSender && (
                  <span className="text-xs text-gray-400 mt-1 px-1">
                    {formatMessageTime(message.created_at)}
                  </span>
                )}
              </div>
            </div>
                 {/* Sender name and time for receiver messages */}
                 {!isSender && (
              <div className="text-xs text-gray-400  ml-12 mt-1">
                 {formatMessageTime(message.created_at)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;