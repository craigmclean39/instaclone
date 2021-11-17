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
          <div
            className='modal__content'
            style={{ height: 'clamp(348px, 70vw, 855px)' }}>
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
            <BackIcon
              className='modal__header-svg-button'
              onClick={handleBack}
            />
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
          <div style={{ height: 'clamp(348px, 70vw, 855px)' }}>
            <Crop
              image={imageSrc}
              coverMode={coverMode}
              onCropComplete={onCropComplete}
              size={'clamp(348px, 70vw, 855px)'}
            />
          </div>
        );
        break;
      }
      case PostStage.ShareImage: {
        setHeader(
          <header className='modal__header share'>
            <BackIcon
              className='modal__header-svg-button'
              onClick={handleBack}
            />
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
        setContent(
          <div
            className='modal__content-flex'
            style={{ height: 'calc(clamp(695px, 100vw, 1195px) - 340px)' }}>
            <Crop
              image={imageSrc}
              coverMode={coverMode}
              onCropComplete={onCropComplete}
              size={'calc(clamp(695px, 100vw, 1195px) - 340px)'}
            />
            <div className='modal__content-share'>Test</div>
          </div>
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

  const handleBack = () => {
    switch (postStage) {
      case PostStage.ShareImage: {
        setPostStage(PostStage.CropImage);
        break;
      }
      case PostStage.CropImage: {
        setPostStage(PostStage.SelectFile);
        break;
      }
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedArea);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  return (
    <div
      role='presentation'
      className='add-post-wrapper'
      onMouseDown={(e) => {
        cancelAddPost();
      }}>
      <div className='add-post-wrapper__top-flex'>
        {' '}
        <CloseIcon className='close-icon' />
      </div>
      <div className='add-post-wrapper__bottom-flex'>
        <form
          className={
            postStage != PostStage.ShareImage
              ? 'add-post__modal'
              : 'add-post__modal large'
          }
          role='dialog'
          onMouseDown={(e) => handleClick(e)}>
          {header}
          {content}
        </form>
      </div>
    </div>
  );
};

export default AddPost;
