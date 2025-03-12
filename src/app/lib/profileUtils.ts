import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Fetch profile data from Firestore
export const fetchProfile = async (userId: string) => {
  const profileDoc = await getDoc(doc(db, "users", userId));
  return profileDoc.exists() ? profileDoc.data() : null;
};

// Save profile data to Firestore
export const saveProfile = async (userId: string, data: any) => {
  await setDoc(doc(db, "users", userId), data);
};

// Update profile data in Firestore
export const updateProfile = async (userId: string, data: any) => {
  await updateDoc(doc(db, "users", userId), data);
};