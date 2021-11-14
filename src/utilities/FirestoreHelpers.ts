import {
  doc,
  setDoc,
  Firestore,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { AppContextActionType } from '../Context/AppContext';
import { Dispatch } from 'react';
import UserInfoType from '../types/userInfoType';
import { PostType } from '../types/userInfoType';
import uniqid from 'uniqid';

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
    dispatch({ type: 'updateUserInfo', payload: userInfo });
  }
};

export const addPost = async (db: Firestore, uid: string, imgUrl: string) => {
  const post: PostType = {
    id: uniqid(),
    uid: uid,
    comments: [],
    likes: [],
    imgUrl: imgUrl,
    timestamp: serverTimestamp(),
  };

  await setDoc(doc(db, 'posts', post.id), post);
};
