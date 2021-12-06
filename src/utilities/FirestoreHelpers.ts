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

import UserInfoType from '../types/userInfoType';
import { PostType, CommentType } from '../types/userInfoType';
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

export const getUsersInfoFromDb = async (
  uid: string,
  db: Firestore
): Promise<UserInfoType | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log('Document data:', docSnap.data());
    const userData = docSnap.data();
    const userInfo = userData as UserInfoType;
    return userInfo;
  }
  return null;
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

  return null;
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
    limit(10)
  );

  const querySnapshot = await getDocs(q);
  // console.log(querySnapshot.docs);
  const posts: PostType[] = [];
  querySnapshot.forEach((doc) => {
    posts.push(doc.data() as PostType);
  });

  return posts;
};

export const getRecentPostsFromAll = async (
  db: Firestore,
  uid: string,
  maxNumPosts: number
) => {
  const ref = collection(db, 'posts');
  const q = query(ref, orderBy('timestamp', 'desc'), limit(maxNumPosts));

  const querySnapshot = await getDocs(q);
  // console.log(querySnapshot.docs);
  const posts: PostType[] = [];
  querySnapshot.forEach((doc) => {
    const post = doc.data() as PostType;

    if (post.uid !== uid) {
      posts.push(post);
    }
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

export const getUserNickname = async (db: Firestore, uid: string) => {
  const userInfo = await getUserInfo(uid, db);
  return userInfo?.userNickname;
};

export const followUser = async (
  db: Firestore,
  postUid: string,
  uid: string,
  follow: boolean
) => {
  //Get references to the users document, and the author of the posts user document
  const userRef = doc(db, 'users', uid);
  const postUserRef = doc(db, 'users', postUid);

  if (postUid === uid) {
    return;
  }

  if (follow) {
    await updateDoc(userRef, {
      //Add the post author to your following list
      following: arrayUnion(postUid),
    });
    await updateDoc(postUserRef, {
      //add yourself to their followers
      followers: arrayUnion(uid),
    });
  } else {
    await updateDoc(userRef, {
      //remove them from your following array
      following: arrayRemove(postUid),
    });
    await updateDoc(postUserRef, {
      //add yourself to their followers array
      followers: arrayUnion(uid),
    });
  }
};

export const getPost = async (db: Firestore, postId: string) => {
  const postRef = doc(db, 'posts', postId);

  const docSnap = await getDoc(postRef);

  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());

    const postData = docSnap.data() as PostType;
    return postData;
  }

  return null;
};

export const addComment = async (
  db: Firestore,
  postId: string,
  content: string,
  uid: string
) => {
  const comment: CommentType = {
    content: content,
    uid: uid,
  };
  const postRef = doc(db, 'posts', postId);

  await updateDoc(postRef, {
    comments: arrayUnion(comment),
  });
};
