import { useState } from 'react';
import Cropper from 'react-easy-crop';
import '../../styles/addpost.css';

export interface CropProps {
  image: string;
  coverMode: string;
  onCropComplete(croppedArea: any, croppedAreaPixels: any): void;
}

const Crop: React.FC<CropProps> = ({ image, coverMode, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <div className='crop-relative'>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1 / 1}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        objectFit={coverMode as any}
        style={{
          containerStyle: {
            width: 'clamp(348px, 70vw, 855px)',
            height: 'clamp(348px, 70vw, 855px)',
          },
          cropAreaStyle: {
            width: 'clamp(348px, 70vw, 855px)',
            height: 'clamp(348px, 70vw, 855px)',
          },
        }}
      />
    </div>
  );
};

export default Crop;
