import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';

export const FeedItemImage: React.FC<{ Image: { name: string; url: string }[] }> = ({ Image }) => {
  const [showLightbox, setShowLightbox] = useState<boolean>(false);
  const [photoIndex, setPhotoIndex] = useState<number>(0);

  const images = Image.map((item) => item.url);

  return (
    <div className="grid grid-cols-3 gap-6 mt-1.5">
      {Image.map((item, index) => {
        return (
          <button
            key={item.url}
            className="col-span-1"
            onClick={() => {
              setShowLightbox(true);
              setPhotoIndex(index);
            }}
          >
            <img src={item.url} alt="image" className="h-28 w-full rounded-xl shadow object-cover" />
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
