import '../../styles/addpost.css';
import { ReactComponent as CloseIcon } from '../../media/close.svg';
import { ReactComponent as DragAndDropIcon } from '../../media/draganddrop.svg';
import { ReactComponent as BackIcon } from '../../media/back.svg';
import { SyntheticEvent, useEffect, useState, useCallback } from 'react';
import Crop from './Crop';
import getCroppedImg from './GetCroppedImage';

export interface AddPostProps {
  cancelAddPost(): void;
  uploadPost(file: string): void;
}

enum PostStage {
  SelectFile,
  CropImage,
  ShareImage,
}

const AddPost: React.FC<AddPostProps> = ({ cancelAddPost, uploadPost }) => {
  const [postStage, setPostStage] = useState(PostStage.SelectFile);
  const [header, setHeader] = useState(<></>);
  const [content, setContent] = useState(<></>);
  const [imageSrc, setImageSrc] = useState('');
  const [coverMode, setCoverMode] = useState('contain');
  const [croppedArea, setCroppedArea] = useState();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState();

  useEffect(() => {
    switch (postStage) {
      case PostStage.SelectFile: {
        setHeader(
          <header className='modal__header'>
            <h1>Create new post</h1>
          </header>
        );
        setContent(
          <div className='modal__content'>
            <div className='modal__content-inner'>
              <DragAndDropIcon />
              <h2>Drag photos here</h2>

              <label
                htmlFor='select-from-computer'
                className='select-from-computer-button'>
                Select from computer
              </label>
              <input
                id='select-from-computer'
                type='file'
                accept='image/*'
                onChange={handleChange}></input>
            </div>
          </div>
        );
        break;
      }
      case PostStage.CropImage: {
        setHeader(
          <header className='modal__header crop'>
            <BackIcon className='modal__header-svg-button' />
            <h1>Crop</h1>
            <button
              className='modal__header-button'
              onClick={(e) => {
                e.preventDefault();
                setPostStage(PostStage.ShareImage);
              }}>
              Next
            </button>
          </header>
        );

        setContent(
          <Crop
            image={imageSrc}
            coverMode={coverMode}
            onCropComplete={onCropComplete}
          />
        );
        break;
      }
      case PostStage.ShareImage: {
        setHeader(
          <header className='modal__header crop'>
            <BackIcon className='modal__header-svg-button' />
            <h1>Create new post</h1>
            <button
              className='modal__header-button'
              onClick={(e) => {
                e.preventDefault();
                console.log('SHARE');
                uploadCroppedImage();
              }}>
              Share
            </button>
          </header>
        );
      }
    }
  }, [postStage]);

  const uploadCroppedImage = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    console.log(croppedImage);
    uploadPost(croppedImage);
    cancelAddPost();
  };

  const handleChange = async (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;

    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        //load the image so we can get width and height and adjust the coverMode of the cropper appropriately
        const img = new Image();
        img.onload = function () {
          console.log(img.width);
          console.log(img.height);

          if (img.width > img.height) {
            setCoverMode('vertical-cover');
          } else if (img.width < img.height) {
            setCoverMode('horizontal-cover');
          } else {
            setCoverMode('contain');
          }

          setImageSrc(ev.target?.result as string);
          setPostStage(PostStage.CropImage);
        };
        img.src = ev.target?.result as string;
      };

      //Read the file and wait for it to trigger the onload callback
      reader.readAsDataURL(file);
    }
  };

  const handleClick = (e: SyntheticEvent) => {
    e.stopPropagation();
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedArea);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  return (
    <div
      role='presentation'
      className='add-post-wrapper'
      onClick={() => {
        cancelAddPost();
      }}>
      <div className='add-post-wrapper__top-flex'>
        {' '}
        <CloseIcon className='close-icon' />
      </div>
      <div className='add-post-wrapper__bottom-flex'>
        <form
          className='add-post__modal'
          role='dialog'
          onClick={(e) => handleClick(e)}>
          {header}
          {content}
        </form>
      </div>
    </div>
  );
};

export default AddPost;
