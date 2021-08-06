import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';

const getGridSm = (data: number) => {
  // data = 1,2,3,4,5
  if (data === 5 || data === 4 || data === 2) {
    return 2;
  }
  // 1,3
  return data;
};

export const FeedItemImage: React.FC<{ Image: { name: string; url: string }[] }> = ({ Image }) => {
  const [showLightbox, setShowLightbox] = useState<boolean>(false);
  const [photoIndex, setPhotoIndex] = useState<number>(0);

  const images = Image.map((item) => item.url);

  const gridSm = getGridSm(images.length);

  return (
    <div
      className={`mt-1.5 grid grid-cols-1 sm:grid-cols-${gridSm} lg:grid-cols-${images.length} gap-1 rounded-xl shadow overflow-hidden`}
    >
      {Image.map((item, index) => {
        return (
          <button
            key={item.url}
            className="col-span-1 h-28"
            onClick={() => {
              setShowLightbox(true);
              setPhotoIndex(index);
            }}
          >
            <img src={item.url} alt="image" className="h-full w-full object-cover" />
          </button>
        );
      })}

      {showLightbox && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setShowLightbox(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
        />
      )}
    </div>
  );
};
