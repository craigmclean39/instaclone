import { doc, setDoc, Firestore, getDoc } from 'firebase/firestore';
import { AppContextActionType } from '../Context/AppContext';
import { Dispatch } from 'react';
import UserInfoType from '../types/userInfoType';

export const createNewUser = async (
  db: Firestore,
  uid: string,
  fullname: string,
  nickname: string
): Promise<void> => {
  await setDoc(doc(db, 'users', uid), {
    userId: uid,
    userName: fullname,
    userNickname: nickname,
    userProfilePic: '',
    followers: [],
    following: [],
    description: '',
  });
};

export const getUserInfoFromDb = async (
  uid: string,
  db: Firestore,
  dispatch: Dispatch<AppContextActionType>
): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
    const userData = docSnap.data();
    const userInfo = userData as UserInfoType;

    /* if (userInfo.userProfilePic !== '') {
      const storage = getStorage();
      const imageRef = ref(storage, `${userInfo.userProfilePic}.jpg`);
      const dlUrl = await getDownloadURL(imageRef);
      userInfo.userProfilePic = dlUrl;
    } */

    dispatch({ type: 'updateUserInfo', payload: userInfo });
  }
};
