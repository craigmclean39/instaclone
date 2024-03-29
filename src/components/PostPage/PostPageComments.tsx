import { useEffect, useState } from 'react';
import { CommentType } from '../../types/userInfoType';
import PostPageComment from './PostPageComment';

export interface PostPageCommentsProps {
  comments: CommentType[];
}

const PostPageComments: React.FC<PostPageCommentsProps> = ({ comments }) => {
  const [sortedComments, setSortedComments] = useState<CommentType[]>([]);

  useEffect(() => {
    if (comments.length > 2) {
      const firstComment = [comments[0]];
      const restOfComments = [];
      for (let i = 1; i < comments.length; i++) {
        restOfComments.push(comments[i]);
      }
      restOfComments.reverse();

      setSortedComments(firstComment.concat(restOfComments));
    } else if (comments.length > 0) {
      setSortedComments(comments);
    }
  }, [comments]);

  const commentElements = sortedComments.map((comment) => {
    return (
      <PostPageComment key={comment.uid + comment.content} comment={comment} />
    );
  });

  return <div className='comments'>{commentElements}</div>;
};
export default PostPageComments;
