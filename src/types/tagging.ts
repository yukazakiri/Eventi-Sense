import supabase from '../api/supabaseClient';

interface TagEntityParams {
  eventId: string;
  taggedEntityId: string;
  taggedEntityType: 'venue' | 'supplier';
  taggedBy: string; // ID of the event creator
}

// Tag a venue or supplier
export const tagEntity = async ({
  eventId,
  taggedEntityId,
  taggedEntityType,
  taggedBy,
}: TagEntityParams) => {
  const { data, error } = await supabase
    .from('event_tags')
    .insert([
      {
        event_id: eventId,
        tagged_entity_id: taggedEntityId,
        tagged_entity_type: taggedEntityType,
        tagged_by: taggedBy,
      },
    ])
    .select();

  if (error) {
    console.error('Error tagging entity:', error);
    throw error;
  }

  return data;
};

// Confirm a tag
export const confirmTag = async (tagId: string) => {
  const { data, error } = await supabase
    .from('event_tags')
    .update({ is_confirmed: true })
    .eq('id', tagId)
    .select();

  if (error) {
    console.error('Error confirming tag:', error);
    throw error;
  }

  return data;
};

// Untag (delete a tag)
export const untagEntity = async (tagId: string) => {
  const { error } = await supabase
    .from('event_tags')
    .delete()
    .eq('id', tagId);

  if (error) {
    console.error('Error untagging entity:', error);
    throw error;
  }

  return { success: true };
};

// Fetch tags for an event
export const fetchEventTags = async (eventId: string) => {
  const { data, error } = await supabase
    .from('event_tags')
    .select(`
      id,
      event_id,
      tagged_entity_id,
      tagged_entity_type,
      is_confirmed,
      created_at,
      updated_at,
      venues:tagged_entity_id (name),
      supplier:tagged_entity_id (name)
    `)
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching event tags:', error);
    throw error;
  }

  return data;
};

// Send notification to tagged entity
export const sendNotification = async (entityId: string, entityType: 'venue' | 'supplier') => {
  const { data: entity } = await supabase
    .from(entityType === 'venue' ? 'venues' : 'supplier')
    .select('email')
    .eq('id', entityId)
    .single();

  if (entity?.email) {
    // Send email or in-app notification
    console.log(`Notification sent to ${entity.email}`);
  }
};

// Add new interface for hashtags
interface HashtagParams {
  eventId: string;
  hashtag: string;
  createdBy: string;
}

// Add new function to handle hashtags
export const addHashtag = async ({ eventId, hashtag, createdBy }: HashtagParams) => {
  const { data, error } = await supabase
    .from('event_hashtags')
    .insert([
      {
        event_id: eventId,
        hashtag: hashtag.startsWith('#') ? hashtag : `#${hashtag}`,
        created_by: createdBy,
      },
    ])
    .select();

  if (error) {
    console.error('Error adding hashtag:', error);
    throw error;
  }

  return data;
};

// Add function to fetch hashtags
export const fetchEventHashtags = async (eventId: string) => {
  const { data, error } = await supabase
    .from('event_hashtags')
    .select('*')
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching hashtags:', error);
    throw error;
  }

  return data;
};