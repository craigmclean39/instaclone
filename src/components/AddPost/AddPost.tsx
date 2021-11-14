import '../../styles/addpost.css';
import { ReactComponent as CloseIcon } from '../../media/close.svg';
import { ReactComponent as DragAndDropIcon } from '../../media/draganddrop.svg';
import { SyntheticEvent, useContext } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';

export interface AddPostProps {
  cancelAddPost(): void;
  uploadPost(file: File): void;
}

const AddPost: React.FC<AddPostProps> = ({ cancelAddPost, uploadPost }) => {
  const { db, userInfo } = useContext(AppContext) as AppContextType;

  const handleChange = async (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;

    if (target.files) {
      await uploadPost(target.files[0]);
    }
  };

  const handleClick = (e: SyntheticEvent) => {
    e.stopPropagation();
  };

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
          <header className='modal__header'>
            <h1>Create new post</h1>
          </header>
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
        </form>
      </div>
    </div>
  );
};

export default AddPost;
{
  /* <button className='select-from-computer-button' type='button'>
                  Select from computer
</button> */
}
