import { useContext, useEffect, useState } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import { CommentType } from '../../types/userInfoType';
import { getUserNickname } from '../../utilities/FirestoreHelpers';

interface PostCommentsProps {
  comments: CommentType[];
}

const PostComments: React.FC<PostCommentsProps> = ({ comments }) => {
  const { db } = useContext(AppContext) as AppContextType;
  const [firstCommentName, setFirstCommentName] = useState('');

  useEffect(() => {
    async function getName() {
      if (db != null) {
        if (db != null && comments.length > 0) {
          const uName = await getUserNickname(db, comments[0].uid);
          setFirstCommentName(uName ?? '');
        }
      }
    }

    getName();
  }, [db, comments]);

  return (
    <div className='post__comments'>
      <span className='post__comment-user-name'>{firstCommentName}</span>
      &nbsp;
      <span className='post__comment-content'>
        {comments.length > 0 ? comments[0].content ?? '' : ''}
      </span>
    </div>
  );
};

export default PostComments;
