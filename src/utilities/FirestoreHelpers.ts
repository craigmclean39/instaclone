import { doc, setDoc, Firestore } from 'firebase/firestore';

export const createNewUser = async (
  db: Firestore,
  uid: string,
  fullname: string,
  nickname: string
) => {
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
