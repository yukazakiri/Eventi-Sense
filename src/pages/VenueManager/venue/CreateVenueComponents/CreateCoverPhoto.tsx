import React from 'react'; // Import React

interface PhotoCoverProps {
  imageUrl: string | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  uploadError: string | null;
  isEditing: boolean;
  selectedFile: File | null;
}

const CreatePhotoCover: React.FC<PhotoCoverProps> = ({ imageUrl, handleFileChange, uploading, uploadError, isEditing }) => {
  return (
    <div className={`shadow-lg bg-white p-[2rem] dark:bg-gray-900 border-[1px] border-gray-300 dark:border-gray-700 rounded-3xl mb-4 ${isEditing ? 'border-indigo-400 border-[1px] rounded-lg dark:border-indigo-400' : ''}`}>
      <label htmlFor="coverImage" className="block mb-2 text-md font-medium text-gray-800 dark:text-gray-200">
        Cover Photo
      </label>
      <section>
        <div className="py-4">
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading || !isEditing}
            readOnly={!isEditing}
            className="block w-full text-sm text-slate-500
                file:mr-4 file:py-4 file:px-6
                file:rounded-full file:border-0 
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-indigo-600
                hover:file:bg-violet-100"
          />
        </div>
        {imageUrl && <img src={imageUrl} alt="Cover Preview" className="max-w-full h-auto rounded-lg" />}
        {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
      </section>
    </div>
  );
};

export default CreatePhotoCover;