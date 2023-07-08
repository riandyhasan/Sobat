import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@services/firebase";

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return "success";
  } catch (error) {
    console.log("Error logging in:", error);
    return "failed";
  }
};

export const logout = async (): Promise<string> => {
  try {
    await signOut(auth);
    return "success";
  } catch (error) {
    console.log("Error logging out:", error);
    return "failed";
  }
};

export const checkAuth = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        reject("User not authenticated");
      }
    });
  });
};
