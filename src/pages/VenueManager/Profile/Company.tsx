 import React, { useState, useEffect } from "react";
import supabase from "../../../api/supabaseClient";
import Modal from "../../../assets/modal/modal"; // Import your Modal component

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

const CreateCompany: React.FC = () => {
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
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        {company?.id ? "Edit Company Profile" : "Create Company Profile"}
      </h2>

      <form className="space-y-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            value={company.company_name}
            onChange={(e) => handleInputChange(e, "company_name")}
            disabled={!editing}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company Address</label>
          <input
            type="text"
            value={company.company_address}
            onChange={(e) => handleInputChange(e, "company_address")}
            disabled={!editing}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company Email</label>
          <input
            type="email"
            value={company.company_email}
            onChange={(e) => handleInputChange(e, "company_email")}
            disabled={!editing}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company Phone</label>
          <input
            type="text"
            value={company.company_phone}
            onChange={(e) => handleInputChange(e, "company_phone")}
            disabled={!editing}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Website</label>
          <input
            type="text"
            value={company.company_website || ""}
            onChange={(e) => handleInputChange(e, "company_website")}
            disabled={!editing}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company Logo</label>
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
             className="mt-4 max-w-full h-auto rounded-md" 
             onError={(e) => console.error("Image load error", e)} // Error handling for image display
           />
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {editing ? (
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full py-2 px-4 mt-4 bg-indigo-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-700"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="w-full py-2 px-4 mt-4 bg-gray-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 hover:bg-gray-700"
          >
            Edit Profile
          </button>
        )}
      </form>

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

export default CreateCompany;