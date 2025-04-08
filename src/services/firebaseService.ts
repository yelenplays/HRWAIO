import { initializeApp } from 'firebase/app';
import {
  getFirestore, doc, setDoc, getDoc, updateDoc, DocumentData
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8difZgq4-ramBC0W6PoUr1P2_Tk3RGiY",
  authDomain: "hrwaio.firebaseapp.com",
  projectId: "hrwaio",
  storageBucket: "hrwaio.firebasestorage.app",
  messagingSenderId: "585774324732",
  appId: "1:585774324732:web:d5fb7f6606740e6ab5f079",
  measurementId: "G-VP3MWXVF3K"
};

// Initialize Firebase with simpler configuration
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// User profile data interface (stored in Firestore)
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  universityData?: {
    totalCredits: number;
    gpa: number;
    remainingModules: number;
  };
}

// --- Firebase Auth Integration ---

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Auth state changed: User signed in:', user.uid, user.email);
  } else {
    console.log('Auth state changed: User signed out');
  }
});

// Firebase Service Object
export const firebaseService = {
  // Register a new user using Firebase Auth and store profile in Firestore
  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile document in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userProfileData: Omit<UserProfile, 'universityData'> = {
        uid: user.uid,
        email: user.email || email,
        name: name,
      };
      await setDoc(userRef, userProfileData);
      console.log('User registered and profile created:', user.uid);
      return user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login a user using Firebase Auth
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout the current user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Get user profile data from Firestore using UID
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!uid) return null;
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        console.warn('User profile not found in Firestore for uid:', uid);
        return null;
      }
      return userDoc.data() as UserProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Update user profile data in Firestore
  async updateUserProfile(uid: string, data: Partial<Pick<UserProfile, 'name' | 'universityData'>>): Promise<void> {
    if (!uid) throw new Error("User ID is required to update profile.");
    try {
      const userRef = doc(db, 'users', uid);
      const updateData: Partial<UserProfile> = { ...data };
      delete (updateData as any).uid;
      delete (updateData as any).email;

      await updateDoc(userRef, updateData);
      console.log('User profile updated for uid:', uid);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Save/Update university data
  async saveUniversityData(uid: string, data: UserProfile['universityData']): Promise<void> {
    if (!uid) throw new Error("User ID is required to save university data.");
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { universityData: data });
      console.log('University data saved for uid:', uid);
    } catch (error) {
      console.error('Error saving university data:', error);
      throw error;
    }
  },

  // Get current Auth user
  getCurrentAuthUser(): User | null {
    return auth.currentUser;
  }
};

// Export Firestore db, Storage instance, and auth
export { db, storage, auth }; 