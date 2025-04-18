
import { BsChatSquareTextFill } from 'react-icons/bs';
import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useMessages } from '../hooks/useMessages';
import { User } from '../types/index';
import toast from 'react-hot-toast';
import {markMessagesAsRead }  from '../services/markMessageAsRead';

interface MessengerContainerProps {
    currentUser: User;
    selectedUser: User | null;

  }
  
const MessengerContainer: React.FC<MessengerContainerProps> = ({ 
  currentUser, 
  selectedUser 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);
  const { messages, sendMessage, deleteMessage, loading } = useMessages(currentUser.id, selectedUser?.id);

useEffect(() => {
    const markAsRead = async () => {
      if (selectedUser) {
        await markMessagesAsRead(currentUser.id, selectedUser.id);
        // Optionally trigger a refresh here if your unread hook exposes a refetch
        // unreadRefetch(); // <-- if available
      }
    };
    markAsRead();
}, [selectedUser, currentUser.id]);
  

  const handleSendMessage = async (content: string) => {
    if (!selectedUser || !content.trim()) return;
    
    try {
      setSending(true);
      
      await sendMessage({
        content,
        sender_id: currentUser.id,
        receiver_id: selectedUser.id
      });
      
 
      
      toast.success('Message sent successfully');
 
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message. Please try again.');
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-900 rounded-lg font-sofia p-4">
        <div className="flex flex-col items-center space-y-4">
          <BsChatSquareTextFill className="w-16 h-16 text-sky-600 animate-pulse" />
          <div className="text-center space-y-2">
            <p className="text-xl font-medium text-gray-300">No Conversation Selected</p>
            <p className="text-gray-500">Select a user from the sidebar to start messaging</p>
          </div>
          <div className="mt-4 w-32 h-1 bg-gradient-to-r from-sky-600 to-sky-400 rounded-full opacity-50" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-[1px] border-gray-800 bg-gray-900 rounded-2xl font-sofia">
      {/* Header */}
      <div className="px-4 py-3  border-b border-gray-800">
        <div className="flex items-center">
          <div className="relative">
            {selectedUser.avatar_url ? (
              <img 
                src={selectedUser.avatar_url} 
                alt={selectedUser.first_name}
                className="w-12 h-12 rounded-full mr-3 object-cover" 
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mr-3">
                <span className="text-sky-800 font-medium">
                  {selectedUser.first_name?.[0]}
                  {selectedUser.last_name?.[0]}
                </span>
              </div>
            )}
            {/* Online/Offline Dot */}
            <span
              className={`
                absolute left-10 -translate-x-1/2 -bottom-[1px]
                w-3 h-3 rounded-full border-[1px] border-gray-900/60
                ${selectedUser.online ? 'bg-green-500' : 'bg-red-500'}
              `}
            />
          </div>
          <div>
            <h2 className="font-medium text-white">{`${selectedUser.first_name} ${selectedUser.last_name}`}</h2>
            <p className="text-xs text-gray-400">
              {selectedUser.role || 'User'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 ">
        {loading ? (
          <div className="flex justify-center py-4">
            <span className="text-gray-500">Loading messages...</span>
          </div>
        ) : (
          <MessageList 
            messages={messages} 
            currentUserId={currentUser.id}
            onDeleteMessage={handleDeleteMessage}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="px-4 py-3  border-t border-gray-800">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={sending}
          isLoading={sending}
        />
      </div>
    </div>
  );
};

export default MessengerContainer;