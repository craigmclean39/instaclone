import '../../styles/addpost.css';
import { ReactComponent as CloseIcon } from '../../media/close.svg';
import { ReactComponent as DragAndDropIcon } from '../../media/draganddrop.svg';
import { SyntheticEvent, useContext } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import uniqid from 'uniqid';
import { addPost } from '../../utilities/FirestoreHelpers';
import { AppContext, AppContextType } from '../../Context/AppContext';
import { getDownloadURL } from '@firebase/storage';
import { Firestore } from '@firebase/firestore';

export interface AddPostProps {
  cancelAddPost(): void;
}

const AddPost: React.FC<AddPostProps> = ({ cancelAddPost }) => {
  const { db, userInfo } = useContext(AppContext) as AppContextType;

  const handleChange = async (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;

    if (target.files) {
      const file = target.files[0];
      const storage = getStorage();
      const fid = uniqid();
      const fileRef = ref(storage, fid);

      const p = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      addPost(db as Firestore, userInfo?.userId as string, downloadUrl);
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
