import { useState } from 'react';
import Cropper from 'react-easy-crop';
import '../../styles/addpost.css';

export interface CropProps {
  image: string;
  coverMode: string;
  onCropComplete(croppedArea: any, croppedAreaPixels: any): void;
  size: string;
  locked: boolean;
}

const Crop: React.FC<CropProps> = ({
  image,
  coverMode,
  onCropComplete,
  size,
  locked,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <div className='crop-relative'>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1 / 1}
        onCropChange={
          locked
            ? () => {
                /**/
              }
            : setCrop
        }
        onCropComplete={
          locked
            ? () => {
                /**/
              }
            : onCropComplete
        }
        onZoomChange={
          locked
            ? () => {
                /**/
              }
            : setZoom
        }
        objectFit={coverMode as any}
        showGrid={locked ? false : true}
        style={{
          containerStyle: {
            width: size,
            height: size,
          },
          cropAreaStyle: {
            width: size,
            height: size,
          },
        }}
      />
    </div>
  );
};

export default Crop;
