import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { getProps } from '../../../../utils/helper';

const getGridSm = (data: number) => {
  if (data === 5 || data === 4 || data === 2) {
    return 2;
  }
  return data;
};

export const FeedItemImage: React.FC<{ Image: { name: string; url: string }[] }> = memo(({ Image }) => {
  const dataProps = useSelector(getProps);
  const { onShowImageFeed } = dataProps;
  const images = Image.map((item) => item.url);
  const gridSm = getGridSm(images.length);

  return (
    <div
      className={`mt-1.5 grid grid-cols-1 sm:grid-cols-${gridSm} lg:grid-cols-${images.length} gap-1 rounded-xl shadow overflow-hidden`}
    >
      {Image.map((item, index) => {
        return (
          <button key={item.url} className="col-span-1 h-28" onClick={() => onShowImageFeed(item.url, index)}>
            <img src={item.url} alt="image" className="h-full w-full object-cover" />
          </button>
        );
      })}
    </div>
  );
});
