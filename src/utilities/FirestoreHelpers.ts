import {
  doc,
  setDoc,
  Firestore,
  getDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { AppContextActionType } from '../Context/AppContext';
import { Dispatch } from 'react';
import UserInfoType, { CommentType } from '../types/userInfoType';
import { PostType } from '../types/userInfoType';
import uniqid from 'uniqid';
import { async } from '@firebase/util';

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

export const getUsersInfoFromDb = async (
  uid: string,
  db: Firestore,
  dispatch: Dispatch<AppContextActionType>
): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log('Document data:', docSnap.data());
    const userData = docSnap.data();
    const userInfo = userData as UserInfoType;
    dispatch({ type: 'updateUserInfo', payload: userInfo });
  }
};

export const getUserInfo = async (uid: string, db: Firestore) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log('Document data:', docSnap.data());
    const userData = docSnap.data();
    const userInfo = userData as UserInfoType;
    return userInfo;
  }
};

export const addPostToPostCollection = async (
  db: Firestore,
  uid: string,
  imgUrl: string,
  description: string
) => {
  const post: PostType = {
    id: uniqid(),
    uid: uid,
    comments:
      description != ''
        ? [
            {
              content: description,
              uid: uid,
            },
          ]
        : [],
    likes: [],
    imgUrl: imgUrl,
    timestamp: serverTimestamp(),
  };

  await setDoc(doc(db, 'posts', post.id), post);
};

export const getUsersPosts = async (db: Firestore, uid: string) => {
  const ref = collection(db as Firestore, 'posts');
  const q = query(ref, where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  // console.log(querySnapshot.docs);

  const userPosts: PostType[] = [];
  querySnapshot.forEach((doc) => {
    userPosts.push(doc.data() as PostType);
  });

  return userPosts;
};

export const getRecentPostsFromFollowing = async (
  db: Firestore,
  following: string[]
) => {
  if (following.length === 0) {
    return;
  }

  const ref = collection(db, 'posts');
  const q = query(
    ref,
    where('uid', 'in', following),
    orderBy('timestamp', 'desc'),
    limit(3)
  );

  const querySnapshot = await getDocs(q);
  // console.log(querySnapshot.docs);
  const posts: PostType[] = [];
  querySnapshot.forEach((doc) => {
    posts.push(doc.data() as PostType);
  });

  return posts;
};

export const toggleLikePost = async (
  db: Firestore,
  postId: string,
  uid: string,
  like: boolean
) => {
  const postRef = doc(db, 'posts', postId);

  if (like) {
    await updateDoc(postRef, {
      likes: arrayUnion(uid),
    });
  } else {
    await updateDoc(postRef, {
      likes: arrayRemove(uid),
    });
  }
};

export const doILikePost = async (
  db: Firestore,
  postId: string,
  uid: string
) => {
  const postRef = doc(db, 'posts', postId);

  const docSnap = await getDoc(postRef);

  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());

    const postData = docSnap.data() as PostType;
    if (postData.likes.includes(uid)) {
      return true;
    }
  }

  return false;
};

export const getUserName = async (db: Firestore, uid: string) => {
  const userInfo = await getUserInfo(uid, db);
  return userInfo?.userName;
};
