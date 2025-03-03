import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../api/supabaseClient';
import { SupplierFormData, Supplier} from '../../../types/supplier';
import Breadcrumbs from '../../../components/BreadCrumbs/breadCrumbs';
import { HomeIcon } from '@heroicons/react/24/solid';
import CreateInfoSupplierForm from './CreateInfo';
import CreateAddressSupplierForm from './CreateAddress';
import { validateSupplierForm, } from './FormValidation'; // Import validations
import CreatePhotoCover from './CreateCoverPhoto'


const breadcrumbItems = [
  { label: 'Home', href: '/Supplier-Dashboard/Home', icon: <HomeIcon className="h-4 w-4 mr-1" /> },
  { label: 'Create Supplier', href: '' }
];

const SupplierForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SupplierFormData>({ // Type the state
    name: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    location: '', // This will store the coordinates as a string (e.g., "lat,lng")
    phone_number: '',
    email: '',
    website: '',
    description: '',
    cover_image_url: '',
    price_range: '',

  });


  const [isSubmitting, setIsSubmitting] = useState(false);
 

  const [_user, setUser] = useState<any | null>(null);
  const [_companyProfile, setCompanyProfile] = useState<any | null>(null);
  const [_companyProfileLoading, setCompanyProfileLoading] = useState(true);
  const [ _companyProfileError, setCompanyProfileError] = useState<string | null>(null);
  const [_formErrors, setFormErrors] = useState({});
  const [_SupplierId, setSupplierId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [initialImageUrl, _setInitialImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Move selectedFile state here
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);






  useEffect(() => {
    const fetchUserAndCompanyProfile = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.error("Error fetching user:", error);
            return;
        }

        if (user) {
            setUser(user);
            fetchCompanyProfile(user.id); // Keep this to set the company ID
        }
    };

    // Call both functions concurrently
    fetchUserAndCompanyProfile();
 
}, []);

  const fetchCompanyProfile = async (userId: string) => {
    setCompanyProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("company_profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setCompanyProfile(data);
        setFormData((prevData) => ({
          ...prevData,
          company_id: data.id,
        }));
      }
    } catch (error: any) {
      console.error("Error fetching company profile:", error.message);
      setCompanyProfileError(error.message);
    } finally {
      setCompanyProfileLoading(false);
    }
    
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);

    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result as string);
        }
        reader.readAsDataURL(file);
    } else {
        setImageUrl(null);
    }
  };
  const handleUpload = async (SupplierId: string) => {
    if (!selectedFile) {  
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const filePath = `CoverPhoto/${SupplierId}/${selectedFile.name}`; // Correct file path
      const {  error } = await supabase.storage
        .from('suppliers') // Your bucket name
        .upload(filePath, selectedFile, {
          contentType: selectedFile.type,
          upsert: false // or true, depending on your needs
        });

      if (error) {
        throw error;
      }

      // Construct the public URL correctly
      const { data: { publicUrl } } = supabase.storage.from('suppliers').getPublicUrl(filePath);
      setImageUrl(publicUrl);

      const { error: updateError } = await supabase
        .from('supplier')
        .update({ cover_image_url: publicUrl })
        .eq('id', SupplierId);

      if (updateError) throw updateError;

      alert("Image uploaded successfully!");
      setSelectedFile(null);

    } catch (error: any) {
      console.error('Error uploading image:', error);
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateSupplierForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
        return;
    }

    setIsSubmitting(true);
    setUploading(true);

    try {
        const supplierDataToInsert: Supplier = { ...formData };
 

        const { data: newSupplierData, error: SupplierError } = await supabase
            .from("supplier")
            .insert([supplierDataToInsert])
            .select("id")
            .single();

        if (SupplierError) {
            console.error("Supabase Error:", SupplierError);
            throw SupplierError;
        }

        const newSupplierId = newSupplierData?.id;
        if (!newSupplierId) {
            throw new Error("Supplier ID not found after insertion.");
        }

        setSupplierId(newSupplierId);

        if (selectedFile && newSupplierId) {
            await handleUpload(newSupplierId);
        }

        alert("Supplier successfully created!");
        navigate('/Supplier-Dashboard/Home');

    } catch (error: any) {
        console.error("Error during submission:", error);

        if (error.message.includes("duplicate key")) {
            alert("A supplier with that name/email already exists. Please check your data.");
        } else if (error.message.includes("Supplier ID not found")) {
            alert("There was an error creating the supplier. Please try again.");
        } else {
            alert("An error occurred during submission. Please try again.");
        }

    } finally {
        setIsSubmitting(false);
        setUploading(false);
    }
};




  return (
    <>
  
      <div className='flex justify-between  md:mx-4 mx-2 md:my-4 my-2'>
                <h1 className="text-2xl font-bold font-bonanova text-gray-600 dark:text-white ">Add you Business Information</h1>
                <Breadcrumbs items={breadcrumbItems} />
            </div>
          
 
    <div className="mx-8  font-sofia border-gray-300 border-[1px] rounded-3xl p-4 bg-white dark:bg-gray-950 dark:border-gray-700">
  
      <form onSubmit={handleSubmit} className='grid lg:grid-cols-2 gap-4 p-6'>
        <div className='col-span-2 '>
          <section className='flex justify-between items-center my-4'>
       
            <div className='flex items-center'>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`text-white mx-4 ${isEditing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-600'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center dark:focus:ring-blue-800`}
              >
                {isEditing ? 'Cancel ' : 'Add Supplier Informations'}
              </button>
              {isEditing && (
          <button
          type="submit" // Add this line
          disabled={isSubmitting} // Disable while submitting
          className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5 text-center  dark:focus:ring-blue-800"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Supplier'}
        </button>
              )}
            </div>
          </section>
        </div>
          <section>
          <div className='mb-8'>
          <CreateInfoSupplierForm
            formData={formData}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
          />
          </div>
          <div>
          <CreatePhotoCover
            isEditing={isEditing}
            imageUrl={imageUrl}
            handleFileChange={handleFileChange}
            uploading={uploading}
            uploadError={uploadError}
            selectedFile={selectedFile}
          />
          </div>
          </section>
          <section >
            <div className='mb-8'>
                <CreateAddressSupplierForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  isEditing={isEditing}
                />
            </div>
        
          </section>
      
  
      </form>
    </div>
    </>
  );
};

export default SupplierForm;
