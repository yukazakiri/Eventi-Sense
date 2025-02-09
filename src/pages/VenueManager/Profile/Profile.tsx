import { useEffect, useState } from 'react'; 
import supabase from '../../../api/supabaseClient'; // Adjust the import path as needed
import Modal from '../../../assets/modal/modal';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState<string>('');

  const [isEditing, setIsEditing] = useState(false);
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'success',
  });
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  useEffect(() => {
    const fetchProfileAndEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
          setFormData({
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            email: user.email || '',
          });
        }
        setEmail(user.email || '');
        console.log(email);
      }
    };

    fetchProfileAndEmail();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
        })
        .eq('id', user.id);

      if (error) {
        setModalData({
          isOpen: true,
          title: 'Update Failed',
          description: 'There was an error updating your profile.',
          type: 'error',
        });
      } else {
        setModalData({
          isOpen: true,
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.',
          type: 'success',
        });
        setIsEditing(false);
      }
    }
  };

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        {profile ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              
              <div>
                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">First name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900">Last name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                disabled
                required
              />
            </div>
            {isEditing ? (
              <div className="flex space-x-4">
                <button type="submit" className="text-white bg-green-400 hover:bg-green-600 px-5 py-2.5 rounded-lg">Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} className="text-gray-700 bg-gray-200 px-5 py-2.5 rounded-lg">Cancel</button>
              </div>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="text-white bg-navy-blue-1 hover:bg-navy-blue-3 px-5 py-2.5 rounded-lg">Edit Profile</button>
            )}
          </form>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
      <Modal isOpen={modalData.isOpen} title={modalData.title} description={modalData.description} type={modalData.type} onClose={() => setModalData({ ...modalData, isOpen: false })} />
    </div>
  );
}
