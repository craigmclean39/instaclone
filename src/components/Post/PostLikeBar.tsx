import { ReactComponent as LikeButton } from '../../media/like.svg';
import { ReactComponent as LikeFilledButton } from '../../media/likefilled.svg';
import { ReactComponent as CommentButton } from '../../media/comment.svg';

interface PostLikeBarProps {
  likeThePost(like: boolean): void;
  handleCommentIconClick(): void;
  liked: boolean;
}

const PostLikeBar: React.FC<PostLikeBarProps> = ({
  likeThePost,
  liked,
  handleCommentIconClick,
}) => {
  return (
    <div className={`post__like-bar ${liked ? 'post__like-bar--liked' : ''}`}>
      {liked ? (
        <LikeFilledButton onClick={() => likeThePost(false)} />
      ) : (
        <LikeButton onClick={() => likeThePost(true)} />
      )}
      <CommentButton onClick={handleCommentIconClick} />
    </div>
  );
};

export default PostLikeBar;
