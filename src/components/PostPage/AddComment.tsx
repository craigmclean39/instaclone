import { SyntheticEvent, useEffect, useRef } from 'react';

interface AddCommentProps {
  value: string;
  doFocus: boolean;
  handleValueChange(e: SyntheticEvent): void;
  submitComment(e: SyntheticEvent, content: string): void;
}

const AddComment: React.FC<AddCommentProps> = ({
  value,
  submitComment,
  handleValueChange,
  doFocus,
}) => {
  const commentField = useRef(null);

  useEffect(() => {
    if (commentField.current != null && doFocus) {
      const cf = commentField.current as HTMLInputElement;
      cf.focus();
    }
  }, [doFocus]);

  return (
    <div className='add-comment'>
      <form
        className='add-comment__form'
        onSubmit={(e) => {
          submitComment(e, value);
        }}>
        <input
          className='add-comment__input'
          type='text'
          placeholder='Add a comment...'
          ref={commentField}
          onChange={(e) => {
            handleValueChange(e);
          }}
          value={value}></input>
        <button
          className={`add-comment__button ${value !== '' ? '' : '--inactive'}`}
          type='submit'>
          Post
        </button>
      </form>
    </div>
  );
};

export default AddComment;
