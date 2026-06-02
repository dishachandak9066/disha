'use client';
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthResponse = {
  user: User;
  token: string;
  message?: string;
  error?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load stored user
  useEffect(() => {
  if (status === "loading") {
    return;
  }

  try {
    // Google Login
    if (session?.user) {
      const googleUser = {
        id: session.user.email || "",
        name: session.user.name || "",
        email: session.user.email || "",
      };

      setUser(googleUser);

      localStorage.setItem(
        "readeverse_user",
        JSON.stringify(googleUser)
      );

      document.cookie = `readeverse_user=${encodeURIComponent(
        JSON.stringify(googleUser)
      )}; path=/; max-age=2592000; samesite=lax`;

      setIsLoading(false);
      return;
    }

    // Normal Login
    const storedUser = localStorage.getItem("readeverse_user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  } catch (error) {
    console.error("Failed to load user:", error);
  } finally {
    setIsLoading(false);
  }
}, [session, status]);

  // Save auth data
  const saveAuthData = (data: AuthResponse) => {
    setUser(data.user);

    localStorage.setItem(
      'readeverse_user',
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      'readeverse_token',
      data.token
    );

    document.cookie = `readeverse_user=${encodeURIComponent(
      JSON.stringify(data.user)
    )}; path=/; max-age=2592000; samesite=lax`;
  };

  // Login
  const login = async (
    email: string,
    password: string
  ) => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      let data: AuthResponse;

      try {
        data = await res.json();
      } catch {
        throw new Error('Invalid server response');
      }

      if (!res.ok) {
        throw new Error(
          data.message ||
            data.error ||
            'Login failed'
        );
      }

      saveAuthData(data);
    } catch (error) {
      console.error('Login Error:', error);

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      let data: AuthResponse;

      try {
        data = await res.json();
      } catch {
        throw new Error('Invalid server response');
      }

      if (!res.ok) {
        throw new Error(
          data.message ||
            data.error ||
            'Registration failed'
        );
      }

      saveAuthData(data);
    } catch (error) {
      console.error('Register Error:', error);

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
    // Logout
  const logout = async () => {
    setUser(null);

    localStorage.removeItem('readeverse_user');
    localStorage.removeItem('readeverse_token');

    document.cookie =
      'readeverse_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    await signOut({
      callbackUrl: '/login',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
}