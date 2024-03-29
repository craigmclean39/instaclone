import { ReactComponent as HomeIcon } from '../../media/home.svg';
import { ReactComponent as HomeIconFilled } from '../../media/homefilled.svg';
// import { ReactComponent as DirectIcon } from '../../media/direct.svg';
import { ReactComponent as PostIcon } from '../../media/newpost.svg';
import { ReactComponent as ExploreIcon } from '../../media/explore.svg';
import { ReactComponent as ExploreIconFilled } from '../../media/explorefilled.svg';
// import { ReactComponent as FeedIcon } from '../../media/activityfeed.svg';
import InstagramLogo from '../../media/instagram-header1.png';
import '../../styles/header.css';
import { AppContext, AppContextType } from '../../Context/AppContext';
import { useContext } from 'react';
import { Page } from '../../Context/AppContext';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Avatar, { AvatarSize } from '../Avatar/Avatar';

export interface HeaderProps {
  addPost(): void;
}

const Header: React.FC<HeaderProps> = ({ addPost }): JSX.Element => {
  const { currentPage, userInfo } = useContext(AppContext) as AppContextType;

  const isSmall = useMediaQuery('(max-width: 720px)');

  return (
    <nav>
      <header
        className={isSmall ? 'header-container--small' : 'header-container'}>
        <div className='header'>
          <Link to='/'>
            <img
              className='header__instagram'
              src={InstagramLogo}
              alt='Instagram'></img>
          </Link>
          <ul className='header-icons'>
            <li className='header__icon'>
              <Link to='/'>
                {currentPage === Page.HomePage ? (
                  <HomeIconFilled />
                ) : (
                  <HomeIcon />
                )}
              </Link>
            </li>

            {/* <li className='header__icon'>
              <DirectIcon />
            </li> */}
            <li className='header__icon'>
              <PostIcon
                onClick={() => {
                  addPost();
                }}
              />
            </li>

            <li className='header__icon'>
              <Link to='explore'>
                {currentPage === Page.ExplorePage ? (
                  <ExploreIconFilled />
                ) : (
                  <ExploreIcon />
                )}
              </Link>
            </li>

            {/* <li className='header__icon'>
              <FeedIcon />
            </li> */}
            <li className='header__icon'>
              <Link to='profile'>
                {currentPage === Page.ProfilePage ? (
                  <div className='profile-pic__circle'>
                    <Avatar
                      size={AvatarSize.ExtraSmall}
                      alt='Profile pic'
                      profilePicSrc={userInfo?.userProfilePic ?? ''}
                    />
                  </div>
                ) : (
                  <div className='profile-pic__no-circle'>
                    <Avatar
                      size={AvatarSize.ExtraSmall}
                      alt='Profile pic'
                      profilePicSrc={userInfo?.userProfilePic ?? ''}
                    />
                  </div>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </nav>
  );
};

export default Header;
