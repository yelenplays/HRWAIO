import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// User data interface
export interface UserData {
  username: string;
  name: string;
  password: string;
  universityData?: {
    totalCredits: number;
    gpa: number;
    remainingModules: number;
  };
}

// Hardcoded user for testing
const hardcodedUser: UserData = {
  username: "yeyotrap",
  name: "Test User",
  password: "Collen5050",
  universityData: {
    totalCredits: 120,
    gpa: 3.5,
    remainingModules: 5
  }
};

// Simple user management
export const firebaseService = {
  // Register a new user
  async register(username: string, password: string, name: string): Promise<UserData> {
    try {
      // For testing, just return the hardcoded user if credentials match
      if (username === hardcodedUser.username && password === hardcodedUser.password) {
        return hardcodedUser;
      }
      
      // Check if username already exists
      const userRef = doc(db, 'users', username);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        throw new Error('Username already exists');
      }

      // Create new user
      const userData: UserData = {
        username,
        name,
        password, // In a real app, you would hash the password
      };
      await setDoc(userRef, userData);
      return userData;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login a user
  async login(username: string, password: string): Promise<UserData> {
    try {
      // For testing, just return the hardcoded user if credentials match
      if (username === hardcodedUser.username && password === hardcodedUser.password) {
        return hardcodedUser;
      }
      
      const userRef = doc(db, 'users', username);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data() as UserData;
      if (userData.password !== password) {
        throw new Error('Invalid password');
      }

      return userData;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout
  async logout(): Promise<void> {
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    localStorage.removeItem('password');
  },

  // Save university data
  async saveUniversityData(username: string, data: UserData['universityData'] | undefined): Promise<void> {
    try {
      // For testing, just update the hardcoded user
      if (username === hardcodedUser.username) {
        hardcodedUser.universityData = data;
        return;
      }
      
      const userRef = doc(db, 'users', username);
      await updateDoc(userRef, { universityData: data });
    } catch (error) {
      console.error('Error saving university data:', error);
      throw error;
    }
  },

  // Get user data
  async getUserData(username: string): Promise<UserData | null> {
    try {
      // For testing, just return the hardcoded user if username matches
      if (username === hardcodedUser.username) {
        return hardcodedUser;
      }
      
      const userRef = doc(db, 'users', username);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        return null;
      }
      return userDoc.data() as UserData;
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  },

  // Get current user (from localStorage)
  getCurrentUser(): UserData | null {
    const username = localStorage.getItem('username');
    if (!username) {
      return null;
    }
    
    // For testing, just return the hardcoded user if username matches
    if (username === hardcodedUser.username) {
      return hardcodedUser;
    }
    
    return { 
      username, 
      name: localStorage.getItem('name') || '', 
      password: localStorage.getItem('password') || '' 
    };
  },

  // Update user profile
  async updateUserProfile(username: string, data: Partial<UserData>): Promise<void> {
    try {
      // For testing, just update the hardcoded user
      if (username === hardcodedUser.username) {
        Object.assign(hardcodedUser, data);
        return;
      }
      
      const userRef = doc(db, 'users', username);
      await updateDoc(userRef, data);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
}; 