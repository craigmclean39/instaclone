import PostHeader from './PostHeader';
import PostImage from './PostImage';

const Post: React.FC = () => {
  return (
    <article className='post'>
      <PostHeader />
      <PostImage />
    </article>
  );
};

export default Post;
