import React, { useState, useRef } from 'react';

export interface ImageUploadProps {
  images: File[];
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
  maxSizeInMB?: number;
  acceptedFormats?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  maxSizeInMB = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
}) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError('');

    // Validações
    if (images.length + files.length > maxImages) {
      setError(`Você pode fazer upload de no máximo ${maxImages} imagens`);
      return;
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const invalidFiles = files.filter(
      (file) => file.size > maxSizeInBytes || !acceptedFormats.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError(
        `Algumas imagens são inválidas. Tamanho máximo: ${maxSizeInMB}MB. Formatos aceitos: ${acceptedFormats.join(', ')}`
      );
      return;
    }

    // Adicionar novas imagens
    const newImages = [...images, ...files];
    onImagesChange(newImages);

    // Criar previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);

    // Revogar URL do preview para liberar memória
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleClick}
          disabled={images.length >= maxImages}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Adicionar Imagens
        </button>

        <span className="text-sm text-gray-500">
          {images.length} / {maxImages} imagens
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Tamanho máximo: {maxSizeInMB}MB por imagem. Formatos aceitos: JPEG, PNG, WebP.
      </p>
    </div>
  );
};

export default ImageUpload;
