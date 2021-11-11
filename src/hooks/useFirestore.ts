import { Firestore, getFirestore } from '@firebase/firestore';
import { useEffect, useState } from 'react';

export const useFirestore = () => {
  const [db, setDb] = useState<Firestore | null>(null);

  useEffect(() => {
    setDb(getFirestore());
  }, []);

  return { db };
};
