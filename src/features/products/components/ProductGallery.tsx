import { useState } from 'react';

interface ProductImage {
  id: string;
  url: string;
  sortOrder?: number;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productTitle }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Se não houver imagens, usar placeholder
  const displayImages = images.length > 0 
    ? images 
    : [{ id: 'placeholder', url: 'https://via.placeholder.com/800x800?text=Sem+Imagem', sortOrder: 0 }];

  return (
    <div className="flex flex-col gap-4">
      {/* Imagem Principal */}
      <div
        className="w-full bg-center bg-no-repeat bg-cover aspect-[4/5] rounded-xl bg-gray-200 dark:bg-gray-700"
        style={{ backgroundImage: `url("${displayImages[selectedImage]?.url}")` }}
        role="img"
        aria-label={`Imagem principal - ${productTitle}`}
      />
      
      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {displayImages.slice(0, 4).map((image, index) => (
            <div key={image.id} className="flex flex-col">
              <div
                className={`w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg cursor-pointer transition-opacity ${
                  selectedImage === index 
                    ? 'border-2 border-primary' 
                    : 'opacity-70 hover:opacity-100'
                } bg-gray-200 dark:bg-gray-700`}
                style={{ backgroundImage: `url("${image.url}")` }}
                onClick={() => setSelectedImage(index)}
                role="button"
                tabIndex={0}
                aria-label={`Visualizar imagem ${index + 1}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedImage(index);
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
