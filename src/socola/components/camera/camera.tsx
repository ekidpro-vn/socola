import React, { useCallback, useRef } from 'react';
import Webcam from 'react-webcam';

interface CameraProps {
  onCapture: (data: string) => void;
}

export const Camera: React.FC<CameraProps> = (props) => {
  const { onCapture } = props;
  const webcamRef = useRef(null);

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  return (
    <div>
      <div>
        <Webcam
          ref={webcamRef}
          // audio={true}?\
          screenshotFormat="image/png"
          // videoConstraints={videoConstraints}
          // onUserMedia={onUserMedia}
        />
      </div>
      <div className="mt-10 flex justify-center items-center">
        <button
          onClick={capturePhoto}
          className="focus:outline-none flex justify-center items-center rounded px-4 py-2 bg-blue-500 text-white duration-300 hover:bg-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="ml-2 font-semibold">Capture</span>
        </button>
      </div>
    </div>
  );
};
