import React, { useState } from 'react';
import { Button } from './ui/Button';
import { extractTextFromImage } from '../services/geminiService';

interface OCRModalProps {
  onClose: () => void;
  onTextExtracted: (text: string) => void;
}

export const OCRModal: React.FC<OCRModalProps> = ({ onClose, onTextExtracted }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const text = await extractTextFromImage(image);
      onTextExtracted(text);
      onClose();
    } catch (err) {
      setError("Failed to process image. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Scan Handwriting / Doc</h2>
        
        {!image ? (
          <div className="border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-xl h-48 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900/50">
             <p className="mb-4 text-gray-500">Upload a photo</p>
             <input 
               type="file" 
               accept="image/*" 
               onChange={handleFileChange} 
               className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
             />
          </div>
        ) : (
          <div className="space-y-4">
            <img src={image} alt="Preview" className="w-full h-48 object-contain rounded-lg bg-black/10" />
            <div className="flex gap-4">
              <Button label="Clear" onClick={() => setImage(null)} variant="secondary" />
              <Button 
                label={loading ? "Analyzing..." : "Extract Text"} 
                onClick={processImage} 
                disabled={loading}
                className="flex-1"
              />
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button label="Cancel" variant="ghost" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};
