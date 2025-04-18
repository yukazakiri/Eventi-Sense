// MessageInput.tsx
import React, { useState } from 'react';
import { PaperAirplaneIcon, FaceSmileIcon } from '@heroicons/react/24/solid';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  isLoading = false
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    onSendMessage(trimmedMessage);
    setMessage('');
    setShowEmojiPicker(false);
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center font-sofia">
      <button
        type="button"
        onClick={() => setShowEmojiPicker(prev => !prev)}
        className="p-2 text-gray-400 hover:text-white"
      >
        <FaceSmileIcon className="h-5 w-5" />
      </button>

      {showEmojiPicker && (
        <div className="absolute bottom-12 left-0 z-50">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} />
        </div>
      )}

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 border border-gray-800 text-white rounded-full py-2 px-4 focus:outline-none bg-gray-800 focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:bg-gray-800 disabled:text-gray-500"
      />

      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="ml-2 p-2 rounded-full bg-sky-600 text-white disabled:bg-sky-300 disabled:cursor-not-allowed relative"
      >
        {isLoading ? (
          <span className="flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <PaperAirplaneIcon className="h-5 w-5 relative" />
          </span>
        ) : (
          <PaperAirplaneIcon className="h-5 w-5" />
        )}
      </button>
    </form>
  );
};

export default MessageInput;
