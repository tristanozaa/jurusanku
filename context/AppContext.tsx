import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { InterestResult, Jurusan, User } from '../types';
import { Session } from '@supabase/supabase-js';

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
    const fetchUser = async (session: Session | null) => {
        if (session?.user) {
            const { data: userProfile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
                console.error("Error fetching user profile:", error);
                setCurrentUser(null);
            } else if (userProfile) {
                setCurrentUser({
                    uid: userProfile.id,
                    email: session.user.email || null,
                    subscription_status: userProfile.subscription_status,
                });
            } else {
                 // Profile doesn't exist, let's create it.
                 // This can happen if a user signs up but the profile creation fails,
                 // or for users who existed before the profile table was properly set up.
                const { data: newUserProfile, error: insertError } = await supabase
                    .from('users')
                    .insert({ id: session.user.id, subscription_status: 'free' })
                    .select()
                    .single();

                if (insertError) {
                    console.error("Error creating user profile:", insertError);
                    setCurrentUser(null);
                } else if (newUserProfile) {
                     setCurrentUser({
                        uid: newUserProfile.id,
                        email: session.user.email || null,
                        subscription_status: newUserProfile.subscription_status,
                    });
                }
            }
        } else {
            setCurrentUser(null);
        }
        setLoadingAuth(false);
    };

    // Fetch user on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
        fetchUser(session);
    });
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        fetchUser(session);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
        await supabase.auth.signOut();
    } catch (error) {
        console.error("Error signing out: ", error);
    }
  };

  const upgradeAccount = async () => {
      if (currentUser) {
        try {
            const { error } = await supabase
                .from('users')
                .update({ subscription_status: 'premium' })
                .eq('id', currentUser.uid);

            if (error) throw error;
            setCurrentUser(prev => prev ? { ...prev, subscription_status: 'premium' } : null);
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