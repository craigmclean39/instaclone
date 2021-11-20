import { ReactComponent as LikeButton } from '../../media/like.svg';
import { ReactComponent as LikeFilledButton } from '../../media/likefilled.svg';
import { ReactComponent as CommentButton } from '../../media/comment.svg';

interface PostLikeBarProps {
  likeThePost(like: boolean): void;
  liked: boolean;
}

const PostLikeBar: React.FC<PostLikeBarProps> = ({ likeThePost, liked }) => {
  return (
    <div className={`post__like-bar ${liked ? 'post__like-bar--liked' : ''}`}>
      {liked ? (
        <LikeFilledButton onClick={() => likeThePost(false)} />
      ) : (
        <LikeButton onClick={() => likeThePost(true)} />
      )}
      <CommentButton />
    </div>
  );
};

export default PostLikeBar;
