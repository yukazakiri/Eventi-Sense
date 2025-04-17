import { AlertCircle, Check, Upload } from 'lucide-react';
import { FormData } from './types';

interface FileUploadProps {
  id: string;
  name: keyof FormData;
  label: string;
  accept: string;
  multiple?: boolean;
  error?: string;
  value: File | File[] | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUpload = ({ 
  id,
  name,
  label,
  accept,
  multiple = false,
  error,
  value,
  onChange
}: FileUploadProps) => (
  <div>
    <label htmlFor={id} className="block text-white font-medium mb-2">
      {label}
    </label>
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor={id}
        className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-navy-blue-3 ${
          error ? 'border-red-500' : 'border-gray-600'
        } hover:bg-navy-blue-2`}
      >
        <div className="flex flex-col items-center justify-center pt-3 pb-3">
          <Upload className="w-6 h-6 text-gray-400 mb-1" />
          <p className="text-sm text-gray-400">
            <span className="font-semibold">Upload document</span>
            {!error && multiple && ' (Optional)'}
          </p>
        </div>
        <input
          id={id}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={onChange}
        />
      </label>
    </div>
    {value && !(value instanceof File) && value.length > 0 && (
      <p className="mt-2 text-sm text-green-500 flex items-center">
        <Check size={16} className="mr-1" /> {value.length} file(s) uploaded
      </p>
    )}
    {value instanceof File && (
      <p className="mt-2 text-sm text-green-500 flex items-center">
        <Check size={16} className="mr-1" /> File uploaded: {value.name}
      </p>
    )}
    {error && (
      <p className="mt-1 text-red-500 text-sm flex items-center">
        <AlertCircle size={16} className="mr-1" /> {error}
      </p>
    )}
  </div>
);