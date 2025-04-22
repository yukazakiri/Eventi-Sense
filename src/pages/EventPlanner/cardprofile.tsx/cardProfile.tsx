import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Star, Building, ExternalLink, Edit, Settings } from 'lucide-react';
import supabase from '../../../api/supabaseClient';


interface EventPlannerProfile {
  planner_id: number;
  company_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  experience_years: number;
  specialization: string;
  website: string;
  bio: string;
  avatar_url: string;
}

const ProfileCard = () => {
  const [profile, setProfile] = useState<EventPlannerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
          .from('eventplanners')
          .select('*')
          .eq('profile_id', user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Profile not found');

        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  const fallbackAvatarUrl = '/images/istockphoto-1207942331-612x612.jpg';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="ml-4 text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
          <p className="text-gray-600">Unable to retrieve your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      {/* Profile card */}
      <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-lg">
        {/* Header with gradient */}
        <div className="relative -m-6 mb-4">
          <div className="h-32 rounded-t-3xl bg-gradient-to-r from-orange-400 via-pink-500 to-teal-400"></div>
          
          {/* External link icon - links to website if available */}
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 bg-white rounded-full p-1">
              <ExternalLink size={16} />
            </a>
          )}
          
          {/* Profile picture */}
          <div className="absolute -bottom-10 left-6">
            <div className="border-4 border-white rounded-full overflow-hidden w-20 h-20 bg-gray-200">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <img src={fallbackAvatarUrl} alt="Fallback Avatar" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Current role section */}
        <div className="flex justify-end mb-1">
          <div className="text-gray-500 text-sm flex items-center gap-1">
            Current role <Building size={14} />
          </div>
        </div>
        <div className="flex justify-end mb-6">
          <div className="font-medium">{profile.specialization}</div>
        </div>
        
        {/* Profile info */}
        <div className="mt-12 mb-2">
          <h2 className="text-2xl font-bold">{profile.company_name}</h2>
          <p className="text-gray-500">{profile.specialization}</p>
          <p className="text-gray-500 text-sm">{profile.city}, {profile.state}</p>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2 mb-6">
          <NavLink 
            to="/edit-profile" 
            className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm flex items-center gap-1"
          >
            <Edit size={14} /> Edit Profile
          </NavLink>
          <NavLink 
            to="/settings" 
            className="bg-white border border-gray-300 px-4 py-2 rounded-full text-sm flex items-center gap-1"
          >
            <Settings size={14} /> Settings
          </NavLink>
        </div>
        
        {/* Skills section */}
        <div className="flex justify-end mb-1">
          <div className="text-gray-500 text-sm flex items-center gap-1">
            Skills <Star size={14} />
          </div>
        </div>
        
        {/* Experience tag */}
        <div className="flex justify-end gap-2 mb-6">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">{profile.experience_years} Years Experience</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">Event Planning</span>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">{profile.specialization}</span>
        </div>
        
        {/* Three feature sections */}
        <div className="grid grid-cols-3 gap-2 border-t pt-4">
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm">Company Info</h3>
            <p className="text-gray-500 text-xs mb-2">
              {profile.address}, {profile.zip_code}, {profile.country}
            </p>
            <div className="flex justify-end">
              <div className="bg-gray-100 rounded-full p-1">
                <ChevronRight size={16} className="text-gray-500" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm">Website</h3>
            <p className="text-gray-500 text-xs mb-2 truncate">
              {profile.website || "No website provided"}
            </p>
            <div className="flex justify-end">
              <div className="bg-gray-100 rounded-full p-1">
                <ChevronRight size={16} className="text-gray-500" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm">Bio</h3>
            <p className="text-gray-500 text-xs mb-2 line-clamp-2">
              {profile.bio || "No bio provided"}
            </p>
            <div className="flex justify-end">
              <div className="bg-gray-100 rounded-full p-1">
                <ChevronRight size={16} className="text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;