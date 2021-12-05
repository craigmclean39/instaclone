import { Firestore } from '@firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import UserInfoType, { CommentType } from '../../types/userInfoType';
import { getUserInfo } from '../../utilities/FirestoreHelpers';
import Avatar, { AvatarSize } from '../Avatar/Avatar';

interface PostPageCommentProps {
  comment: CommentType;
}

const PostPageComment: React.FC<PostPageCommentProps> = ({ comment }) => {
  const [commentUserInfo, setCommentUserInfo] = useState<UserInfoType | null>(
    null
  );
  const { db } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    async function fetchCommentUserInfo() {
      const fetchedData = await getUserInfo(comment.uid, db as Firestore);
      setCommentUserInfo(fetchedData);
    }

    fetchCommentUserInfo();
  }, [comment, db]);

  return (
    <div className='comment'>
      <Avatar
        profilePicSrc={commentUserInfo?.userProfilePic ?? ''}
        size={AvatarSize.Medium}
        alt=''
      />
      <div className='comment__content'>
        <span className='content__username'>
          {commentUserInfo?.userNickname}
        </span>
        &nbsp;
        {comment.content}
      </div>
    </div>
  );
};

export default PostPageComment;
