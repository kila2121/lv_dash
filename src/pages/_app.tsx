import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useContext, useEffect, useState } from 'react';
import { SettingUser } from "../../component/Settings/settings"

interface User {
  login: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
  userSetting: SettingUser | null;
  setUserSetting: (setting: SettingUser | null) => void;
}


const userContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(userContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userSetting, setUserSettingState] = useState<SettingUser | null>(null);

  const setUser = (newUser: User | null) => {
      setUserState(newUser);
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('user');
      }
    };

    const setUserSetting = (newSetting: SettingUser | null) => {
      setUserSettingState(newSetting);
      if (newSetting) {
        localStorage.setItem('setting', JSON.stringify(newSetting));
      } else {
        localStorage.removeItem('setting');
      }
    };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedSetting = localStorage.getItem('setting');

    if (storedUser) {
      try {
        setTimeout(()=>{
          setUser(JSON.parse(storedUser));
        },100)
        
      } catch (error) {
          console.error('Ошибка при чтении пользователя из localStorage:', error);
          localStorage.removeItem('user');
      }
    }
    if (storedSetting) {
        try {
          const parsedSetting = JSON.parse(storedSetting);
          if (parsedSetting) {
            setTimeout(()=>{
              setUserSettingState(parsedSetting);
            },100)
          }
        } catch (error) {
          console.error('Ошибка при чтении настроек из localStorage:', error);
          localStorage.removeItem('setting');
        }
      }

    setTimeout(()=>{
      setIsLoading(false);
    })
  }, []);


  const logout = () => {
    setUser(null);
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    logout,
    isLoading,
    userSetting,
    setUserSetting
  };

  return (
    <userContext.Provider value={contextValue}>
      {children}
    </userContext.Provider>
  );
}

export default function App({ Component, pageProps }: AppProps) {

  return(
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  ) 
}