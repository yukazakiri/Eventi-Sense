 import React, { useState, useEffect } from "react";
import supabase from "../../api/supabaseClient";
import {Modal} from "../../assets/modal/modal"; // Import your Modal component
import { LuPencil } from "react-icons/lu";
import { MdOutlineMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { PulseLoader } from "react-spinners";
interface Company {
  id?: string;
  company_name: string;
  company_address: string;
  company_email: string;
  company_phone: string;
  company_website?: string | null;
  company_logo_url?: string | null;
}

interface User {
  id: string;
}

const CompanyProfile: React.FC = () => {
  const [company, setCompany] = useState<Company>({
    company_name: "", // Initialize with empty string
    company_address: "",
    company_email: "",
    company_phone: "",
    company_website: "",
    company_logo_url: null,
  });
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isNewCompany, setIsNewCompany] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      console.log(session); // Add this line to debug
      if (error) {
        console.error(error.message);
        setError(error.message);
        return;
      }

      if (session?.session?.user) {
        setUser(session.session.user);
        fetchCompany(session.session.user.id);
      }
    };

    fetchUser();
  }, []);

  const fetchCompany = async (userId: string) => {
    try {
      const { data: companyData, error: companyError } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (companyError) {
        if (companyError.message.includes("not found")) {
          setCompany({
            id: userId,
            company_name: "",
            company_address: "",
            company_email: "",
            company_phone: "",
            company_website: "",
            company_logo_url: null,
          });
          setIsNewCompany(true); // Set the flag to true for new companies
        } else {
          console.error("Error fetching company profile:", companyError.message);
          setError(companyError.message);
        }
      } else if (companyData) {
        setCompany(companyData);
        setIsNewCompany(false); // Set the flag to false for existing companies
      }
    } catch (err: any) {
      console.error("Error fetching company profile:", err.message);
      setError(err.message);
    } finally {
      setInitialLoad(false);
    }
  };

  const fallbackAvatarUrl = '/images/istockphoto-1207942331-612x612.jpg';
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Company) => {
        setCompany({ ...company, [field]: e.target.value });
    };

  // Email validation function
  const isValidEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files) return;
  
    const file = e.target.files[0];
  
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
  
    // Client-side file size validation (example: 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError("Image size exceeds the limit (5MB).");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const fileName = `Clogos/${user.id}_${file.name}`;
  
      console.log("Uploading file:", fileName);
      console.log("File type:", file.type);
      console.log("File size:", file.size);
  
      const { error: uploadError } = await supabase.storage
        .from("company_logos")
        .upload(fileName, file, { contentType: file.type, upsert: true });
  
      if (uploadError) {
        console.error("Supabase Storage Upload Error:", uploadError);
        setError("Error uploading logo: " + uploadError.message);
        throw uploadError;
      }
  
      const { data: publicUrlData } = supabase.storage
        .from("company_logos")
        .getPublicUrl(fileName);
  
      if (!publicUrlData) {
        console.error("Error getting public URL");
        setError("Error getting public URL");
        throw new Error("Error getting public URL");
      }
  
      console.log("Public URL:", publicUrlData.publicUrl);
  
     
      const { error: updateError } = await supabase
        .from("company_profiles")
        .update({ company_logo_url: publicUrlData.publicUrl })
        .eq("id", user.id);
  
      if (updateError) {
        console.error("Supabase Database Update Error:", updateError);
        setError("Error updating profile: " + updateError.message);
        throw updateError;
      }
  
      setCompany((prev) => ({ ...prev, company_logo_url: publicUrlData.publicUrl }));
  
    } catch (err: any) {
      console.error("Error in handleLogoUpload:", err);
      setError("Error uploading logo: " + err.message);
    } finally {
      setLoading(false);
      if (e.target instanceof HTMLInputElement) {
        e.target.value = ""; // Clear the input
      }
    }
  };
const handleSave = async () => {
    if (!user) return;
  
    if (!isValidEmail(company.company_email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const companyToSave = { ...company }; // Create a copy
  
      let query: any = supabase.from("company_profiles");
  
      if (isNewCompany) {
        companyToSave.id = user.id; // Ensure ID is set for new company
        query = query.insert([companyToSave]); // Use insert for new company
      } else {
        query = query.upsert([companyToSave]).eq("id", user.id); // Use upsert for existing company
      }
  
      const { error } = await query.select("*"); // Select the updated/inserted data
  
      if (error) {
        throw error;
      }
  
      if (isNewCompany) {
        setModalTitle("Success");
        setModalDescription("Company profile created successfully!");
      } else {
        setModalTitle("Success");
        setModalDescription("Company profile updated successfully!");
      }
  
      setModalType("success");
      setShowModal(true);
      setEditing(false);
  
      fetchCompany(user.id); // Refresh company data
  
      setIsNewCompany(false); // Reset the flag after successful save
  
    } catch (err: any) {
      setError(err.message);
      setModalTitle("Error");
      setModalDescription(err.message);
      setModalType("error");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };
  

  const closeModal = () => {
    setShowModal(false);
  };

  if (initialLoad) {
    return <div><PulseLoader color="#0000ff" /></div>;
  }

  return (
    <div className="pb-4  px-2">
      <div className="m-4 bg-white p-6 border border-gray-300 rounded-2xl font-sofia dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden">
              <img
                src={company.company_logo_url || fallbackAvatarUrl}
                alt="Profile avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="capitalize tracking-wide ">
            <p className="font-semibold text-gray-700 dark:text-gray-200 text-lg mt-2">{company.company_name} </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <p className="text-sm text-gray-500 mt-2 pr-4 border-r border-gray-300 dark:text-gray-400">{company.company_phone}</p>
              <p className="text-sm text-gray-500 mt-2 sm:px-3 normal-case dark:text-gray-400">{company.company_email}</p>
            </div>
          </div>
        </div>
      </div>
<div className={`m-4 bg-white p-6 border border-gray-300 rounded-2xl font-sofia dark:bg-gray-900 dark:border-gray-700 ${editing ? 'border-[1px] border-indigo-300 dark:border-indigo-300' : ''}`}>
     
   <form className="space-y-6 ">
   <div className=" flex items-center justify-between">
          <h2 className="text-[16px] font-semibold tracking-wider text-gray-800 dark:text-gray-200 my-4  font-sofia  ">
            {company?.id ? "Edit Business Profile" : "Create Business Profile"}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
          {editing ? (
            <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="text-white bg-green-400 hover:bg-green-600 px-5 py-2 rounded-2xl dark:bg-green-600 dark:hover:bg-green-700"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-2xl dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">Cancel</button>
            </div>
            
          ) : (
          <button type="button" onClick={() => setEditing(true)} className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-full flex items-center">
                       <LuPencil className="mr-2" />
                       Edit 
                     </button>
          )}
        </div>
        </div>
  {/* Grid for inputs */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {/* Company Name */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-800  dark:text-white">Business Name</label>
      <input
        type="text"
        value={company.company_name}
        onChange={(e) => handleInputChange(e, "company_name")}
        disabled={!editing}
       className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"                      
                    
      />
    </div>

    {/* Company Address */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-800  dark:text-white">Business Address</label>
      <input
        type="text"
        value={company.company_address}
        onChange={(e) => handleInputChange(e, "company_address")}
        disabled={!editing}
       className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"                      
                    
      />
    </div>

    {/* Company Email */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-800  dark:text-white">Business Email</label>
          <div className='relative'>
           <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none border-r-[1px]  border-gray-200 dark:border-gray-800">
              <MdOutlineMailOutline className="w-5 h-5 text-gray-500" />
          </div>
      <input
        type="email"
        value={company.company_email}
        onChange={(e) => handleInputChange(e, "company_email")}
        disabled={!editing}
       className="bg-white pl-14  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"                      
                    
      />
    </div>
    </div>

    {/* Company Phone */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-800  dark:text-white">Business Phone</label>
      <div className='relative'>
           <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none border-r-[1px]  border-gray-200 dark:border-gray-800">
              <FiPhone className="w-4 h-4 text-gray-500" />
          </div>
      <input
        type="text"
        value={company.company_phone}
        onChange={(e) => handleInputChange(e, "company_phone")}
        disabled={!editing}
       className="bg-white  pl-14 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"                      
                    
      />
    </div>
    </div>

    {/* Company Website */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-800  dark:text-white">Business Website</label>
    
      <input
        type="text"
        value={company.company_website || ""}
        onChange={(e) => handleInputChange(e, "company_website")}
        disabled={!editing}
       className="bg-white  border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"                      
                    
      />
    </div>


    {/* Company Logo */}
    <div className="col-span-2">
      <label className="block mb-2 text-sm font-medium text-gray-800  dark:text-white">Business Logo</label>
      <input
        type="file"
        onChange={handleLogoUpload}
        disabled={!editing}
        className="mt-2 block w-full text-sm text-gray-600"
      />
      {company.company_logo_url && (
        <img
          src={company.company_logo_url}
          alt="Company Logo"
          className="mt-4 w-48 h-48 rounded-md"
          onError={(e) => console.error("Image load error", e)}
        />
      )}
    </div>
  </div>

  {/* Error Message */}
  {error && <p className="text-red-500 text-sm">{error}</p>}

  {/* Buttons */}
 
      </form>
      </div>
      <Modal
        isOpen={showModal}
        title={modalTitle}
        description={modalDescription}
        onClose={closeModal}
        type={modalType}
      />
    </div>
  );
};

export default CompanyProfile;