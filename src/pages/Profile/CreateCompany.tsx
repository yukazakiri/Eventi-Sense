import React, { useState, useEffect } from "react";
import supabase from "../../api/supabaseClient";
import Modal from "../../assets/modal/modal";
import { useNavigate } from "react-router-dom";

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
 const navigate = useNavigate(); // Initialize useNavigate
  const [company, setCompany] = useState<Company>({
    company_name: "",
    company_address: "",
    company_email: "",
    company_phone: "",
    company_website: "",
    company_logo_url: null,
  });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Supabase Auth Error:", error.message);
        setError(error.message);
        return;
      }

      if (session?.session?.user) {
        setUser(session.session.user);
      }
    };

    fetchUser();
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Company) => {
    setCompany({ ...company, [field]: e.target.value });
  };

  const isValidEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      setError("User not authenticated");
      return;
    }
    if (!user || !e.target.files) return;

    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Image size exceeds the limit (5MB).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
        const fileName = `Clogos/${user.id}_${file.name}`;

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
        e.target.value = "";
      }
    }
  };


  const handleCreate = async () => {
    if (!user) return;

    if (!isValidEmail(company.company_email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("company_profiles")
        .insert([{ ...company, id: user.id }]);

      if (error) {
        console.error("Supabase Create Error:", error.message);
        setError(error.message);
        throw new Error(error.message);
      }

      setModalTitle("Success");
      setModalDescription("Company profile created successfully!");
      setModalType("success");
      setShowModal(true);
      setCompany({ // Clear the form after success
        company_name: "",
        company_address: "",
        company_email: "",
        company_phone: "",
        company_website: "",
        company_logo_url: null,
      });

      const handleModalCloseAndRedirect = () => {
        closeModal(); // Close the modal first
        navigate("/Supplier-Dashboard/Profiles"); // Then redirect
      }
      setTimeout(handleModalCloseAndRedirect, 500); 

    } catch (err: any) {
      console.error("Create Error:", err);
      setError("An error occurred during creation: " + err.message);
      setModalTitle("Error");
      setModalDescription("An error occurred during creation.");
      setModalType("error");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };


  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div className="py-4 px-2">
      <div className="m-4 bg-white p-6 border border-gray-300 rounded-2xl font-sofia">
        <form className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-700 tracking-wide mb-4 sm:mb-0">
              Create Company Profile
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Company Name</label>
              <input
                type="text"
                value={company.company_name}
                onChange={(e) => handleInputChange(e, "company_name")}
                className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
  
            <div>
              <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Company Address</label>
              <input
                type="text"
                value={company.company_address}
                onChange={(e) => handleInputChange(e, "company_address")}
                className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
  
            <div>
              <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Company Email</label>
              <input
                type="email"
                value={company.company_email}
                onChange={(e) => handleInputChange(e, "company_email")}
                className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
  
            <div>
              <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Company Phone</label>
              <input
                type="text"
                value={company.company_phone}
                onChange={(e) => handleInputChange(e, "company_phone")}
                className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
  
            <div>
              <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Company Website</label>
              <input
                type="text"
                value={company.company_website || ""}
                onChange={(e) => handleInputChange(e, "company_website")}
                className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
  
            <div className="col-span-2">
              <label className="block mb-2 text-md font-medium text-gray-800 dark:text-white">Company Logo</label>
              <input
                type="file"
                onChange={handleLogoUpload}
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
  
          {error && <p className="text-red-500 text-sm">{error}</p>}
  
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className="text-white bg-green-400 hover:bg-green-600 px-5 py-2 rounded-2xl"
          >
            {loading ? "Creating..." : "Create Company"}
          </button>
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
export default CreateCompany;