import { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, Auth } from 'firebase/auth';

export const useAuth = () => {
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    setAuth(getAuth());
  }, []);

  return { auth };
};
