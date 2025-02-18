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
    role: '',
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
            role: profileData.role,
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
    <div className="py-4  px-2">
      <div className="m-4 bg-white p-6 border border-gray-300 rounded-2xl font-sofia">
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden">
              <img
                src={profile?.avatar_url || '/avatar.svg'}
                alt="Profile avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="capitalize tracking-wide">
            <p className="font-semibold text-gray-700 text-lg mt-2">{formData.first_name} {formData.last_name}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <p className="text-sm text-gray-500 mt-2 pr-4 border-r border-gray-300">{formData.role}</p>
              <p className="text-sm text-gray-500 mt-2 sm:px-3 normal-case">{formData.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`m-4 bg-white p-6 border border-gray-300 rounded-2xl font-sofia ${isEditing ? 'border-2 border-indigo-300' : ''}`}>
  

        {profile ? (
          <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-lg font-bold text-gray-700 tracking-wide mb-4 sm:mb-0">Personal Information</h1>
          {isEditing ? (
            <div className="flex space-x-4">
              <button type="submit" className="text-white bg-green-400 hover:bg-green-600 px-5 py-2 rounded-2xl">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-2xl">Cancel</button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)} className="text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-2xl">Edit Profile</button>
          )}
        </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-700">First name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                   className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"                      
                    
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-700">Last name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                   className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"                      
                    
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                 className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"                      
                    
                disabled
                required
              />
            </div>
          </form>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>

      <Modal isOpen={modalData.isOpen} title={modalData.title} description={modalData.description} type={modalData.type} onClose={() => setModalData({ ...modalData, isOpen: false })} />
    </div>
  );
}