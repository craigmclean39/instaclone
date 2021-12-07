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
  limitToLast,
  updateDoc,
  arrayUnion,
  arrayRemove,
  startAt,
  startAfter,
  endAt,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
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

export const getUserInfo = async (
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

export const addPostToPostCollection = async (
  db: Firestore,
  uid: string,
  imgUrl: string,
  description: string
): Promise<void> => {
  const post: PostType = {
    id: uniqid(),
    uid: uid,
    comments:
      description !== ''
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

export const getUsersPosts = async (
  db: Firestore,
  uid: string
): Promise<PostType[]> => {
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

/* 
// Query the first page of docs
const first = query(collection(db, "cities"), orderBy("population"), limit(25));
const documentSnapshots = await getDocs(first);

// Get the last visible document
const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
console.log("last", lastVisible);

// Construct a new query starting at this document,
// get the next 25 cities.
const next = query(collection(db, "cities"),
    orderBy("population"),
    startAfter(lastVisible),
    limit(25)); */

export interface RecentPostsInterface {
  posts: PostType[];
  lastVisible: QueryDocumentSnapshot<DocumentData>;
}

export const getRecentPostsFromFollowing = async (
  db: Firestore,
  following: string[],
  pageLength = 3,
  lastVisible: null | QueryDocumentSnapshot<DocumentData> = null
): Promise<RecentPostsInterface | null> => {
  if (following.length === 0) {
    return null;
  }

  const postsCollection = collection(db, 'posts');
  const first = query(
    postsCollection,
    where('uid', 'in', following),
    orderBy('timestamp', 'desc'),
    limit(pageLength)
  );
  const documentSnapshots = await getDocs(first);

  if (lastVisible === null) {
    lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    // console.log('last', lastVisible);

    const ref = collection(db, 'posts');
    const q = query(
      ref,
      where('uid', 'in', following),
      orderBy('timestamp', 'desc'),
      limit(pageLength)
    );

    const querySnapshot = await getDocs(q);
    // console.log(querySnapshot.docs);
    const posts: PostType[] = [];
    querySnapshot.forEach((doc) => {
      posts.push(doc.data() as PostType);
    });

    return { posts: posts, lastVisible: lastVisible };
  } else {
    const ref = collection(db, 'posts');
    const q = query(
      ref,
      where('uid', 'in', following),
      orderBy('timestamp', 'desc'),
      limit(pageLength),
      startAfter(lastVisible)
    );

    const querySnapshot = await getDocs(q);
    // console.log(querySnapshot.docs);
    const posts: PostType[] = [];
    querySnapshot.forEach((doc) => {
      posts.push(doc.data() as PostType);
    });

    lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { posts: posts, lastVisible: lastVisible };
  }
};

export const getRecentPostsFromAll = async (
  db: Firestore,
  uid: string,
  maxNumPosts: number
): Promise<PostType[]> => {
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
): Promise<void> => {
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
): Promise<boolean> => {
  const postRef = doc(db, 'posts', postId);

  const docSnap = await getDoc(postRef);

  if (docSnap.exists()) {
    // console.log('Document data:', docSnap.data());

    const postData = docSnap.data() as PostType;
    if (postData.likes.includes(uid)) {
      return true;
    }
  }

  return false;
};

export const getUserNickname = async (
  db: Firestore,
  uid: string
): Promise<string> => {
  const userInfo = await getUserInfo(uid, db);
  return userInfo?.userNickname ?? '';
};

export const followUser = async (
  db: Firestore,
  postUid: string,
  uid: string,
  follow: boolean
): Promise<void> => {
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

export const getPost = async (
  db: Firestore,
  postId: string
): Promise<PostType | null> => {
  const postRef = doc(db, 'posts', postId);

  const docSnap = await getDoc(postRef);

  if (docSnap.exists()) {
    // console.log('Document data:', docSnap.data());

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
): Promise<void> => {
  const comment: CommentType = {
    content: content,
    uid: uid,
  };
  const postRef = doc(db, 'posts', postId);

  await updateDoc(postRef, {
    comments: arrayUnion(comment),
  });
};
