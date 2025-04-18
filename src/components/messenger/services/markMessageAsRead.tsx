import supabase from '../../../api/supabaseClient';

/**
 * Marks all unread messages from `fromUserId` to `toUserId` as read.
 */
export const markMessagesAsRead = async (currentUserId: string, selectedUserId: string) => {
  const { error } =await supabase
  .from('messages')
  .update({ read: true })
  .eq('receiver_id', currentUserId)
  .eq('sender_id', selectedUserId)
  .eq('read', false);


  if (error) {
    console.error('Error marking messages as read:', error.message);
  }
};
console.log('Marked messages as read', markMessagesAsRead);
