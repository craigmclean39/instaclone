import { ReactComponent as LikeButton } from '../../media/like.svg';
import { ReactComponent as CommentButton } from '../../media/comment.svg';

const PostLikeBar = () => {
  return (
    <div className='post__like-bar'>
      <LikeButton />
      <CommentButton />
    </div>
  );
};

export default PostLikeBar;
