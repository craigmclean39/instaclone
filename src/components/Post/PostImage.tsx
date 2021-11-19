interface PostImageProps {
  imgUrl: string;
}

const PostImage: React.FC<PostImageProps> = ({ imgUrl }) => {
  return <img className='post-image' src={imgUrl} alt=''></img>;
};

export default PostImage;
