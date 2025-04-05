// api/venueApi.js
import supabase from '../supabaseClient';
// Add this interface at the top of the file after the imports
import { Venue, CompanyProfile } from '../../types/venue';

interface VenueTypes {
  [key: string]: string;
}

interface VenueWithCompany extends Venue {
  company_info?: CompanyProfile;
  venue_types: Array<{ id: string; name: string }>;
  venue_accessibilities: Array<{ id: string; name: string }>;
  venue_pricing_models: Array<{ id: string; name: string }>;
}

export const fetchVenueTypes = async (): Promise<VenueTypes> => {
  try {
    const { data, error } = await supabase.from('venue_types').select('id, name');
    if (error) {
      console.error('Error fetching venue types:', error);
      throw new Error('Error fetching venue types.');
    } else {
      const venueTypesMap: VenueTypes = {};
      data?.forEach((type) => {
        venueTypesMap[type.id] = type.name;
      });
      return venueTypesMap;
    }
  } catch (err) {
    console.error('Error fetching venue types:', err);
    throw new Error('An error occurred while fetching venue types.');
  }
};

export const fetchVenuesWithTypes = async (
  companyId: any,
  venueTypes: VenueTypes
): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*, venues_venue_types(venue_type_id)')
      .eq('company_id', companyId);

    if (error) {
      throw error;
    }

    const venuesWithTypesData = data?.map((venue) => {
      const venueTypeIds =
        venue.venues_venue_types?.map((item: any) => item.venue_type_id) || [];
      const venueTypeNames = venueTypeIds
        .map((id: string) => venueTypes[id])
        .filter((name: string) => name !== undefined)
        .join(', ');

      return {
        ...venue,
        venue_type_name: venueTypeNames,
      };
    });

    return venuesWithTypesData || [];
  } catch (err) {
    console.error('Error fetching venues:', err);
    throw new Error('An error occurred while fetching venues.');
  }
};

interface Amenity {
  id: string;
  name: string;
}

interface VenueAmenity {
  venue_id: string;
  amenity_id: string;
  quantity: number | null;
  description: string | null;
}

export const fetchVenue = async (venueId: string | number): Promise<Venue | null> => {
  try {
    const { data: venueData, error: venueError } = await supabase
      .from('venues')
      .select('*')
      .eq('id', venueId)
      .single();

    if (venueError) {
      console.error('Error fetching venue:', venueError);
      throw new Error('Venue not found.');
    }
    return venueData;
  } catch (err) {
    console.error('Error in fetchVenue:', err);
    throw new Error('An error occurred while fetching venue data.');
  }
};

export const fetchVenueAmenities = async (venueId: string | number): Promise<VenueAmenity[]> => {
  try {
    const { data: venueAmenitiesData, error: venueAmenitiesError } = await supabase
      .from('venue_amenities')
      .select('*')
      .eq('venue_id', venueId);

    if (venueAmenitiesError) {
      console.error('Error fetching venue amenities:', venueAmenitiesError);
      throw new Error('Error fetching venue amenities.');
    }
    return venueAmenitiesData || [];
  } catch (err) {
    console.error('Error in fetchVenueAmenities:', err);
    throw new Error('An error occurred while fetching venue amenities data.');
  }
};

export const fetchAmenities = async (): Promise<Amenity[]> => {
  try {
    const { data: amenitiesData, error: amenitiesError } = await supabase
      .from('amenities')
      .select('*');

    if (amenitiesError) {
      console.error('Error fetching amenities:', amenitiesError);
      throw new Error('Error fetching amenities.');
    }
    return amenitiesData || [];
  } catch (err) {
    console.error('Error in fetchAmenities:', err);
    throw new Error('An error occurred while fetching amenities data.');
  }
};



export const updateVenueAmenities = async (
  venue: Venue,
  updatedVenueAmenities: VenueAmenity[]
): Promise<void> => {
  try {
    if (!venue || !venue.id) {
      console.error('Venue object or ID is missing.');
      throw new Error('Venue information is missing. Cannot update amenities.');
    }

    const { data: existingVenueAmenities, error: fetchError } = await supabase
      .from('venue_amenities')
      .select('*')
      .eq('venue_id', venue.id);

    if (fetchError) throw fetchError;

    const amenitiesToDelete = existingVenueAmenities.filter(
      (existing) => !updatedVenueAmenities.some((updated) => updated.amenity_id === existing.amenity_id)
    );

    for (const amenity of amenitiesToDelete) {
      const { error: deleteError } = await supabase
        .from('venue_amenities')
        .delete()
        .eq('venue_id', venue.id)
        .eq('amenity_id', amenity.amenity_id);

      if (deleteError) throw deleteError;
    }

    for (const updatedAmenity of updatedVenueAmenities) {
      const { error: upsertError } = await supabase
        .from('venue_amenities')
        .upsert([updatedAmenity], { onConflict: 'venue_id,amenity_id' });

      if (upsertError) throw upsertError;
    }
  } catch (err: any) {
    console.error('Error updating venue amenities:', err);
    throw new Error(err?.message || 'An error occurred while updating venue amenities.');
  }


};
export const updateVenue = async (venue: Venue): Promise<void> => {
  try {
    const { error } = await supabase.from('venues').update(venue).eq('id', venue.id);
    if (error) throw error;
  } catch (err: any) {
    console.error('Error updating venue:', err);
    throw new Error(err?.message || 'An error occurred while updating.');
  }
};
export const deleteVenue = async (venueId: string): Promise<void> => {
  try {
    console.log("Attempting to delete venue with ID:", venueId);
    const { error } = await supabase.from('venues').delete().eq('id', venueId);
    if (error) {
      console.error("Supabase delete error:", error);
      throw error;
    }
    console.log("Venue deleted successfully.");
  } catch (err: any) {
    console.error('Error deleting venue:', err);
    throw new Error(err?.message || 'An error occurred while deleting the venue.');
  }
};


export const fetchAllVenues = async (): Promise<VenueWithCompany[]> => {
  try {
    const { data: venuesData, error: venuesError } = await supabase
      .from('venues')
      .select(`
        *,
        company_profiles(
          company_name,
          company_address,
          company_email,
          company_phone,
          company_website,
          company_logo_url
        )
      `)
      .order('created_at', { ascending: false });

    if (venuesError) throw venuesError;

    const formattedVenues: VenueWithCompany[] = venuesData?.map(venue => ({
      ...venue,
      venue_types: [],
      venue_accessibilities: [],
      venue_pricing_models: [],
      company_info: venue.company_profiles
    }));

    return formattedVenues || [];
  } catch (err) {
    console.error('Error fetching all venues:', err);
    throw new Error('An error occurred while fetching all venues.');
  }
};