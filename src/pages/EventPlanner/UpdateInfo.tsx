import { useState, useEffect } from 'react';
import supabase from '../../api/supabaseClient';

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
}

export default function UpdateInfo() {
  const [profile, setProfile] = useState<EventPlannerProfile | null>(null);
  const [formData, setFormData] = useState<Partial<EventPlannerProfile>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
          .from('EventPlanners')
          .select('*')
          .eq('profile_id', user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Profile not found');

        setProfile(data);
        setFormData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !profile) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('EventPlanners')
        .update({
          ...formData,
          experience_years: Number(formData.experience_years)
        })
        .eq('planner_id', profile.planner_id);

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Your Profile</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Profile updated successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <section>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Company Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Zip Code *</label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Experience</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Years of Experience *</label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Specialization *</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md h-32"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => setFormData(profile!)}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            disabled={updating}
          >
            Reset Changes
          </button>
          <button
            type="submit"
            disabled={updating}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}