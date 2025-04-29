// src/messenger/services/conversationService.js

import supabase from '../../../api/supabaseClient';

/**
 * Creates a new conversation between two users or returns existing one
 * @param {string} currentUserId - The current user's ID
 * @param {string} recipientUserId - The recipient user's ID
 * @returns {Promise<string>} - Conversation ID
 */
export const createNewConversation = async (currentUserId: string, recipientUserId: string) => {
  // First check if conversation already exists
  const { data: existingConversation, error: findError } = await supabase
    .from('conversations')
    .select('id')
    .or(`and(user1_id.eq.${currentUserId},user2_id.eq.${recipientUserId}),and(user1_id.eq.${recipientUserId},user2_id.eq.${currentUserId})`)
    .limit(1);
    
  if (findError) {
    console.error('Error finding conversation:', findError);
    throw findError;
  }
  
  // If conversation exists, return it
  if (existingConversation && existingConversation.length > 0) {
    return existingConversation[0].id;
  }
  
  // Create new conversation
  const { data: newConversation, error: createError } = await supabase
    .from('conversations')
    .insert([
      { 
        user1_id: currentUserId, 
        user2_id: recipientUserId,
        created_at: new Date().toISOString()
      }
    ])
    .select('id')
    .single();
    
  if (createError) {
    console.error('Error creating conversation:', createError);
    throw createError;
  }
  
  return newConversation.id;
};

// You can add more conversation-related services here