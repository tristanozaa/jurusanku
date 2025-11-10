import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from '../services/firebase';
import { InterestResult, Jurusan, User } from '../types';

interface AppContextType {
  // Test results
  interestResult: InterestResult | null;
  setInterestResult: (result: InterestResult | null) => void;
  recommendedMajors: Jurusan[] | null;
  setRecommendedMajors: (majors: Jurusan[] | null) => void;
  // Auth
  currentUser: User | null;
  loadingAuth: boolean; // To handle initial auth state loading
  logout: () => void;
  upgradeAccount: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [interestResult, setInterestResult] = useState<InterestResult | null>(null);
  const [recommendedMajors, setRecommendedMajors] = useState<Jurusan[] | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, get their data from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data()!;
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            subscriptionStatus: (userData.subscriptionStatus as User['subscriptionStatus']) || 'free',
          });
        } else {
            // This case might happen if user is created in Auth but not in Firestore.
            // We can create it here as a fallback.
            const newUser: Omit<User, 'uid' | 'email'> = { subscriptionStatus: 'free' };
            await setDoc(userDocRef, newUser);
            setCurrentUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                subscriptionStatus: 'free'
            });
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoadingAuth(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out: ", error);
    }
  };

  const upgradeAccount = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        try {
            await updateDoc(userDocRef, { subscriptionStatus: 'premium' });
            setCurrentUser(prev => prev ? { ...prev, subscriptionStatus: 'premium' } : null);
        } catch (error) {
            console.error("Error upgrading account: ", error);
        }
      }
  };

  const value = {
    interestResult,
    setInterestResult,
    recommendedMajors,
    setRecommendedMajors,
    currentUser,
    loadingAuth,
    logout,
    upgradeAccount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
