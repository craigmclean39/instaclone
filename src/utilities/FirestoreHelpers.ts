import { doc, setDoc, Firestore } from 'firebase/firestore';

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
