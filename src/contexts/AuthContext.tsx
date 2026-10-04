import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseAuth, firestore } from '../lib/firebase';

export interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
  provider: 'google' | 'email';
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_AVATAR = '/dashboard_iimg.png';

function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  const name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Optivsa User';
  return {
    name,
    email: firebaseUser.email || '',
    role: 'ML Engineer',
    avatar: firebaseUser.photoURL || '',
    provider: firebaseUser.providerData.some((provider) => provider.providerId === 'google.com') ? 'google' : 'email'
  };
}

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

export function AuthProvider({
  children,
  startSignedIn = false



}: {children: React.ReactNode;startSignedIn?: boolean;}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => onAuthStateChanged(firebaseAuth, (firebaseUser) => {
    setUser(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
    setIsLoading(false);
  }), []);

  useEffect(() => {
    if (!startSignedIn) return;
    setPersistence(firebaseAuth, browserLocalPersistence).catch(() => undefined);
  }, [startSignedIn]);

  const signInWithEmail = async (email: string, password: string) => {
    await setPersistence(firebaseAuth, browserLocalPersistence);
    await signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  const signUp = async (name: string, email: string, password: string) => {
    await setPersistence(firebaseAuth, browserLocalPersistence);
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await updateProfile(credential.user, { displayName: name });
    await setDoc(doc(firestore, 'users', credential.user.uid), {
      name,
      email,
      role: 'ML Engineer',
      createdAt: new Date().toISOString()
    });
  };

  const signInWithGoogle = async () => {
    await setPersistence(firebaseAuth, browserLocalPersistence);
    await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
  };

  const signOut = () => firebaseSignOut(firebaseAuth);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signInWithEmail,
      signUp,
      signInWithGoogle,
      signOut
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export { initials, DEMO_AVATAR };