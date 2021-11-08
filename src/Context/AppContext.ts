import React from 'react';

export enum Page {
  HomePage,
  ExplorePage,
}

export type AppContextType = {
  currentPage: Page;
};

export const AppContext = React.createContext<AppContextType | null>(null);

export type AppContextActionType = { type: 'changePage'; payload: Page };

export const appContextReducer = (
  state: AppContextType,
  action: AppContextActionType
): AppContextType => {
  /* console.log('resumeReducer ' + action.type);
  console.dir(state);
  console.dir(action); */

  switch (action.type) {
    case 'changePage': {
      console.log('CHANGE PAGE');
      const updateState = Object.assign({}, state);
      updateState.currentPage = action.payload;
      return updateState;
    }
  }
};
