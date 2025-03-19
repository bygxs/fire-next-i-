import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
// Fetch profile data from Firestore
export const fetchProfile = async (userId) => {
    const profileDoc = await getDoc(doc(db, "users", userId));
    return profileDoc.exists() ? profileDoc.data() : null;
};
// Save profile data to Firestore
export const saveProfile = async (userId, data) => {
    await setDoc(doc(db, "users", userId), data);
};
// Update profile data in Firestore
export const updateProfile = async (userId, data) => {
    await updateDoc(doc(db, "users", userId), data);
};
