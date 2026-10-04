import { getAnalytics, isSupported } from 'firebase/analytics';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDGu7KCX6EtNmwJ6pJwfc66E0q5eJWCscI',
  authDomain: 'altitude1-b56fa.firebaseapp.com',
  projectId: 'altitude1-b56fa',
  storageBucket: 'altitude1-b56fa.firebasestorage.app',
  messagingSenderId: '408999694187',
  appId: '1:408999694187:web:ffe039f48acc2c83bfc62e',
  measurementId: 'G-Q13STK0SDX'
};

export const firebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

export const analyticsPromise = isSupported().then((supported) =>
  supported ? getAnalytics(firebaseApp) : null
);
