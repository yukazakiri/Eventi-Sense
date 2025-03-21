import { useEffect, useState } from 'react';
import supabase from '../../../../api/supabaseClient';

export const useEventDetails = (id: string) => {
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [eventTags, setEventTags] = useState<any[]>([]);
    const [organizer, setOrganizer] = useState<any>(null);
    const [companyProfile, setCompanyProfile] = useState<any>(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                if (!id || id === 'undefined') {
                    setLoading(false);
                    setError('Invalid event ID.');
                    return;
                }

                // Fetch event details
                const { data: eventData, error: eventError } = await supabase
                    .from('events')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (eventError) throw eventError;
                setEvent(eventData);

                // Fetch organizer details based on organizer_type
                if (eventData.organizer_id && eventData.organizer_type) {
                    let tableName: string;
                    let queryField: string;

                    switch (eventData.organizer_type) {
                        case 'supplier':
                            tableName = 'supplier'; // Fetch from suppliers table
                            queryField = 'company_id'; // organizer_id matches suppliers.id
                            break;
                        case 'venue_manager':
                            tableName = 'company_profiles'; // Fetch from company_profiles table
                            queryField = 'id'; // organizer_id matches company_profiles.id
                            break;
                        case 'event_planner':
                            tableName = 'eventplanners'; // Fetch from eventplanners table
                            queryField = 'profile_id'; // organizer_id matches eventplanners.profile_id
                            break;
                        default:
                            throw new Error(`Unknown organizer type: ${eventData.organizer_type}`);
                    }

                    // Fetch organizer details from the appropriate table
                    const { data: organizerData, error: organizerError } = await supabase
                        .from(tableName)
                        .select('*')
                        .eq(queryField, eventData.organizer_id)
                        .single();

                    if (organizerError) throw organizerError;

                    // Set organizer or company profile based on organizer_type
                    if (eventData.organizer_type === 'supplier') {
                        setOrganizer(organizerData); // Set as organizer
                        setCompanyProfile(null); // Clear company profile
                    } else if (eventData.organizer_type === 'venue_manager') {
                        setCompanyProfile(organizerData); // Set as company profile
                        setOrganizer(null); // Clear organizer
                    } else if (eventData.organizer_type === 'event_planner') {
                        setOrganizer(organizerData); // Set as organizer
                        setCompanyProfile(null); // Clear company profile
                    }
                }

                // Fetch event tags
                const { data: tagData, error: tagError } = await supabase
                    .from('event_tags')
                    .select(`
                        id,
                        event_id,
                        tagged_entity_id,
                        tagged_entity_type,
                        is_confirmed
                    `)
                    .eq('event_id', id)
                    .eq('is_confirmed', true);

                if (tagError) throw tagError;

                // Separate venue and supplier IDs
                const venueIds = tagData
                    .filter(tag => tag.tagged_entity_type === 'venue')
                    .map(tag => tag.tagged_entity_id);

                const supplierIds = tagData
                    .filter(tag => tag.tagged_entity_type === 'supplier')
                    .map(tag => tag.tagged_entity_id);

                // Fetch venue and supplier details
                const [venueData, supplierData] = await Promise.all([
                    venueIds.length > 0
                        ? supabase.from('venues').select('id, name').in('id', venueIds)
                        : { data: [], error: null },
                    supplierIds.length > 0
                        ? supabase.from('suppliers').select('id, name').in('id', supplierIds)
                        : { data: [], error: null }
                ]);

                if (venueData.error) throw venueData.error;
                if (supplierData.error) throw supplierData.error;

                // Match tags with their corresponding names
                const processedTags = tagData.map(tag => {  
                    if (tag.tagged_entity_type === 'venue') {
                        const venue = venueData.data?.find(v => v.id === tag.tagged_entity_id);
                        return {
                            id: tag.id,
                            name: venue?.name || 'Unknown Venue',
                            type: 'venue'
                        };
                    } else {
                        const supplier = supplierData.data?.find(s => s.id === tag.tagged_entity_id);
                        return {
                            id: tag.id,
                            name: supplier?.name || 'Unknown Supplier',
                            type: 'supplier'
                        };
                    }
                });

                setEventTags(processedTags);

            } catch (error) {
                console.error('Error fetching event details:', error);
                setError('Failed to load event details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEventDetails();
        }
    }, [id]);

    return { event, loading, error, eventTags, organizer, companyProfile };
};

export default useEventDetails;