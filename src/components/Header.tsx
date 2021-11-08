import { ReactComponent as HomeIcon } from '../media/home.svg';
import { ReactComponent as DirectIcon } from '../media/direct.svg';
import { ReactComponent as PostIcon } from '../media/newpost.svg';
import { ReactComponent as ExploreIcon } from '../media/explore.svg';
import { ReactComponent as FeedIcon } from '../media/activityfeed.svg';
import InstagramLogo from '../media/instagram-header.png';
import '../styles/header.css';

const Header = (): JSX.Element => {
  return (
    <nav>
      <header className='header-container'>
        <div className='header'>
          <img
            className='header__instagram'
            src={InstagramLogo}
            alt='Instagram'></img>
          <ul className='header-icons'>
            <li className='header__icon'>
              <HomeIcon />
            </li>
            <li className='header__icon'>
              <DirectIcon />
            </li>
            <li className='header__icon'>
              <PostIcon />
            </li>
            <li className='header__icon'>
              <ExploreIcon />
            </li>
            <li className='header__icon'>
              <FeedIcon />
            </li>
          </ul>
        </div>
      </header>
    </nav>
  );
};

export default Header;
