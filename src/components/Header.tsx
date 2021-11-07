import { ReactComponent as HomeIcon } from '../media/home.svg';
import { ReactComponent as DirectIcon } from '../media/direct.svg';
import { ReactComponent as PostIcon } from '../media/newpost.svg';
import { ReactComponent as ExploreIcon } from '../media/explore.svg';
import { ReactComponent as FeedIcon } from '../media/activityfeed.svg';
import InstagramLogo from '../media/instagram-header.png';
import '../styles/header.css';

const Header = () => {
  return (
    <nav>
      <div className='header-container'>
        <div className='header'>
          <img
            className='header__instagram'
            src={InstagramLogo}
            alt='Instagram'></img>
          <div className='header-icons'>
            <HomeIcon className='header__icon' />
            <DirectIcon className='header__icon' />
            <PostIcon className='header__icon' />
            <ExploreIcon className='header__icon' />
            <FeedIcon className='header__icon' />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
