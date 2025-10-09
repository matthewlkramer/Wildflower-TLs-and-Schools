import React, { useState } from 'react';
import { supabase } from '@/core/supabase/client';

interface FileUploadProps {
  bucket: string;
  onUploadComplete: (objectIds: string[], publicUrls: string[]) => void;
  existingUrls?: string[];
  label?: string;
  multiple?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  bucket,
  onUploadComplete,
  existingUrls = [],
  label = 'Upload Files',
  multiple = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingUrls);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const objectIds: string[] = [];
    const publicUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          alert(`Failed to upload ${file.name}`);
          continue;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        objectIds.push(uploadData.path);
        publicUrls.push(publicUrl);
      }

      const allUrls = [...uploadedUrls, ...publicUrls];
      setUploadedUrls(allUrls);
      onUploadComplete(objectIds, publicUrls);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newUrls = uploadedUrls.filter((_, i) => i !== index);
    setUploadedUrls(newUrls);
    // Note: We're not deleting from storage here, just removing from UI
    // The parent component should handle the updated list
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        multiple={multiple}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
      />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}

      {uploadedUrls.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
          <ul className="space-y-1">
            {uploadedUrls.map((url, index) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate max-w-md"
                >
                  {url.split('/').pop()}
                </a>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="ml-2 text-red-600 hover:text-red-800 text-xs"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
