import { createContext, useContext, useState, useEffect, useCallback } from "react";
import AuthService from "../services/AuthService";
import type { UserProfile, UserState } from "../types";

interface AppContextType {
  user: UserState | null;
  setUser: React.Dispatch<React.SetStateAction<UserState | null>>;
  loginUser: (data: any) => void;
  logoutUser: () => void;
  syncProfile: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<UserState | null>(() => {
    const storedData = localStorage.getItem('user');
    return storedData ? JSON.parse(storedData) : null;
  });

  const syncProfile = useCallback(async () => {
    try {
      if (!user?.access_token) return;
      const profile = await AuthService.getProfile();
      if (profile) {
        const profileWithRole = { 
          ...profile, 
          role: profile.role || profile.role_id 
        };

        setUser((prev) => {
          if (!prev) return null;
          let updatedState: UserState;
          if (prev.user) {
            updatedState = {
              ...prev,
              user: { ...prev.user, ...profileWithRole },
              ...profileWithRole
            };
          } else {
            updatedState = { ...prev, ...profileWithRole };
          }

          localStorage.setItem('user', JSON.stringify(updatedState));
          return updatedState;
        });
      }
    } catch (error) {
      console.error("Error syncing profile:", error);
    }
  }, [user?.access_token]);

  useEffect(() => {
    if (user?.access_token) {
      syncProfile();
    }

    const handleWalletUpdated = () => {
      setTimeout(() => {
        syncProfile();
      }, 3000);
    };

    window.addEventListener('wallet-updated', handleWalletUpdated);
    return () => window.removeEventListener('wallet-updated', handleWalletUpdated);
  }, [user?.access_token, syncProfile]);

  /**
   * Guarda los datos de autenticación tras el login.
   * @param {Object} data - Contiene el access_token y el objeto user.
   */
  interface LoginUserData {
    access_token: string;
    user: UserProfile;
  }

  const loginUser = (data: LoginUserData) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  /**
   * Elimina los datos de autenticación al cerrar sesión.
   */
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      loginUser,
      logoutUser,
      syncProfile
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
