import { useEffect } from 'react';
import { CommentType } from '../../types/userInfoType';
import PostPageComment from './PostPageComment';

export interface PostPageComments {
  comments: CommentType[];
}

const PostPageComments: React.FC<PostPageComments> = ({ comments }) => {
  useEffect(() => {
    if (comments.length > 0) {
    }
  }, [comments]);

  const commentElements = comments.map((comment) => {
    return <PostPageComment comment={comment} />;
  });

  return <div className='comments'>{commentElements}</div>;
};
export default PostPageComments;
