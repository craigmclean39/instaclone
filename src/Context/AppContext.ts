import React from 'react';
import UserInfoType from '../types/userInfoType';

export enum Page {
  HomePage,
  ExplorePage,
  ProfilePage,
  SignUpPage,
  LogInPage,
}

export type AppContextType = {
  currentPage: Page;
  signedIn: boolean;
  userInfo: UserInfoType | null;
};

export const AppContext = React.createContext<AppContextType | null>(null);

export type AppContextActionType =
  | { type: 'changePage'; payload: Page }
  | { type: 'updateUserInfo'; payload: UserInfoType }
  | { type: 'signIn'; payload: boolean };

export const appContextReducer = (
  state: AppContextType,
  action: AppContextActionType
): AppContextType => {
  switch (action.type) {
    case 'changePage': {
      console.log('CHANGE PAGE');
      const updateState = Object.assign({}, state);
      updateState.currentPage = action.payload;
      return updateState;
    }
    case 'updateUserInfo': {
      console.log('UPDATE USER INFO');
      const updateState = Object.assign({}, state);
      updateState.userInfo = action.payload;
      return updateState;
    }
    case 'signIn': {
      console.log('SignIn');
      const updateState = Object.assign({}, state);
      updateState.signedIn = action.payload;
      return updateState;
    }
  }
};
