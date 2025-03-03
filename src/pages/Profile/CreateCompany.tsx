import React, { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient";
import { PulseLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
import { LuPencil } from "react-icons/lu";
import { MdOutlineMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import Modal from "../../assets/modal/modal";
import { fetchProfileRole } from "../../api/utiilty/profiles";

interface Company {
  company_name: string;
  company_address: string;
  company_email: string;
  company_phone: string;
  company_website?: string;
  company_logo_url?: string;
}

interface CreateCompanyProps {
  userId?: string;
}

const CreateCompany: React.FC<CreateCompanyProps> = ({ userId }) => {
  const { userId: routeUserId } = useParams();
  const actualUserId = userId || routeUserId;
  const navigate = useNavigate();

  const [editing, setEditing] = useState<boolean>(false);
  const [company, setCompany] = useState<Company>({
    company_name: "",
    company_address: "",
    company_email: "",
    company_phone: "",
    company_website: "",
    company_logo_url: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [profileRole, setProfileRole] = useState<string | null>(null);

  useEffect(() => {
    const getRole = async () => {
      if (actualUserId) {
        const role = await fetchProfileRole(actualUserId);
        setProfileRole(role);
      }
    };
    getRole();
  }, [actualUserId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Company) => {
    setCompany({ ...company, [field]: e.target.value });
  };

  const isValidEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!file || !allowedTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, JPG, or PNG).");
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
      const fileName = `Clogos/${actualUserId}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("company_logos")
        .upload(fileName, file, { contentType: file.type, upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("company_logos")
        .getPublicUrl(fileName);

      if (!publicUrlData) {
        throw new Error("Error getting public URL");
      }

      setCompany((prev) => ({ ...prev, company_logo_url: publicUrlData.publicUrl }));
    } catch (err: any) {
      console.error("Error uploading logo:", err);
      setError("Error uploading logo: " + err.message);
    } finally {
      setLoading(false);
      if (e.target instanceof HTMLInputElement) {
        e.target.value = "";
      }
    }
  };

  const handleCreateCompany = async () => {
    if (!company.company_name || !company.company_email || !company.company_phone) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(company.company_email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("company_profiles")
        .insert([{ ...company, id: actualUserId }])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setModalTitle("Success");
        setModalDescription("Company profile created successfully!");
        setModalType("success");
        setShowModal(true);

        setTimeout(() => {
          if (profileRole === "event_planner") {
            navigate("/Event-Planner-Dashboard/Profiles");
          } else if (profileRole === "supplier") {
            navigate("/Supplier-Dashboard/Supplier");
          } else if (profileRole === "venue_manager") {
            navigate("/Venue-Manager-Dashboard/Home");
          } else {
            navigate("/"); // Default redirection if role is unknown or null
          }
        }, 2000);
      }
    } catch (err: any) {
      console.error("Error creating company profile:", err);
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
    if (modalType === "success") {
      setCompany({
        company_name: "",
        company_address: "",
        company_email: "",
        company_phone: "",
        company_website: "",
        company_logo_url: "",
      });
    }
  };

  const fallbackAvatarUrl = "/images/istockphoto-1207942331-612x612.jpg";

  return (
    <div className="pb-4 px-2">
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
        <form className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold tracking-wider text-gray-800 dark:text-gray-200 my-4 font-sofia">
              Create Business Profile
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              {editing ? (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleCreateCompany}
                    disabled={loading}
                    className="text-white bg-green-400 hover:bg-green-600 px-5 py-2 rounded-2xl dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    {loading ? <PulseLoader color="#ffffff" size={10} /> : "Create Business Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-2xl dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="text-white bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-full flex items-center"
                >
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
              <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Business Name</label>
              <input
                type="text"
                value={company.company_name}
                onChange={(e) => handleInputChange(e, "company_name")}
                disabled={!editing}
                className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            {/* Company Address */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Business Address</label>
              <input
                type="text"
                value={company.company_address}
                onChange={(e) => handleInputChange(e, "company_address")}
                disabled={!editing}
                className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            {/* Company Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Business Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none border-r-[1px] border-gray-200 dark:border-gray-800">
                  <MdOutlineMailOutline className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  value={company.company_email}
                  onChange={(e) => handleInputChange(e, "company_email")}
                  disabled={!editing}
                  className="bg-white pl-14 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            {/* Company Phone */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Business Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none border-r-[1px] border-gray-200 dark:border-gray-800">
                  <FiPhone className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={company.company_phone}
                  onChange={(e) => handleInputChange(e, "company_phone")}
                  disabled={!editing}
                  className="bg-white pl-14 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            {/* Company Website */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Business Website</label>
              <input
                type="text"
                value={company.company_website}
                onChange={(e) => handleInputChange(e, "company_website")}
                disabled={!editing}
                className="bg-white border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-950 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            {/* Company Logo Upload */}
            <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-white">Business Logo</label>
            <input
                type="file"
                onChange={handleLogoUpload}
                disabled={!editing}
                accept=".jpg, .jpeg, .png" // Restrict file types
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
        </form>
      </div>

      {/* Modal */}
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