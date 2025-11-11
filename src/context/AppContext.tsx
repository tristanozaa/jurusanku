import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";
import { InterestResult, Jurusan, User } from "../types";

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

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [interestResult, setInterestResult] = useState<InterestResult | null>(
    null
  );
  const [recommendedMajors, setRecommendedMajors] = useState<Jurusan[] | null>(
    null
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        await fetchUserProfile(session.user);
      }
      setLoadingAuth(false);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await fetchUserProfile(session.user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", supabaseUser.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116: no rows found
      console.error("Error fetching user profile:", error);
    } else if (data) {
      setCurrentUser(data);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error);
  };

  const upgradeAccount = async () => {
    if (currentUser) {
      const { data, error } = await supabase
        .from("users")
        .update({ subscriptionStatus: "premium" })
        .eq("id", currentUser.id)
        .select()
        .single();

      if (error) {
        console.error("Error upgrading account:", error);
      } else if (data) {
        setCurrentUser(data);
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
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
