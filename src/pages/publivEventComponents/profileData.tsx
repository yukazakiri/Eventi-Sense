import { LuBuilding, LuMapPin, LuBriefcase, LuUser } from 'react-icons/lu';
import { EventPlannerProfile } from '../../pages/EventPlanner/components/profileupdate/api'; // Import the interface from your main component
interface ProfileDisplayProps {
  profile: EventPlannerProfile | null;
  fallbackAvatarUrl: string;
}

export default function ProfileDisplay({
  profile,
}: ProfileDisplayProps) {
  return (
    <div className="font-sofia transition-colors duration-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bonanova md:text-3xl font-bold text-gray-600 dark:text-gray-100">
          Business Profile
        </h1>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* About Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl border-[1px] border-gray-300 dark:border-gray-700 transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl mr-4">
              <LuUser className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">About</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            {profile?.bio || 'No bio provided.'}
          </p>
        </div>

        {/* Main Info Cards */}
        <div className="space-y-6">
          {/* Company Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl border-[1px] border-gray-300 dark:border-gray-700 transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl mr-4">
                <LuBuilding className="text-indigo-600 dark:text-indigo-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Company Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Company Name</p>
                <p className="text-base text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {profile?.company_name || 'Not provided'}
                </p>
              </div>
              <div className="group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Website</p>
                <p className="text-base">
                  {profile?.website ? (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-500 hover:text-sky-600 dark:text-sky-500 dark:hover:text-sky-600 transition-colors hover:underline"
                    >
                      {profile.website}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </p>
              </div>
              <div className="md:col-span-2 group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</p>
                <p className="text-base text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {profile?.address || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl border-[1px] border-gray-300 dark:border-gray-700 transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl mr-4">
                <LuMapPin className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Location Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">City</p>
                <p className="text-base text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {profile?.city || 'Not provided'}
                </p>
              </div>
              <div className="group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">State</p>
                <p className="text-base text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {profile?.state || 'Not provided'}
                </p>
              </div>
              <div className="group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Zip Code</p>
                <p className="text-base text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {profile?.zip_code || 'Not provided'}
                </p>
              </div>
              <div className="group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Country</p>
                <p className="text-base text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {profile?.country || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl border-[1px] border-gray-300 dark:border-gray-700 transition-all duration-300 p-6 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl mr-4">
                <LuBriefcase className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Experience</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Years of Experience</p>
                <p className="text-base text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {profile?.experience_years || '0'} Years
                </p>
              </div>
              <div className="group">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Specialization</p>
                <p className="text-base text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {profile?.specialization || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}