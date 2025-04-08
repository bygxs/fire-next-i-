import { create } from "zustand";
import { db, storage } from "../lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
export const useArtStore = create((set) => ({
    artworks: [],
    setArtworks: (artworks) => set({ artworks }),
    deleteArtwork: async (id, imageUrl) => {
        const storageRef = ref(storage, `art/${id}`);
        await deleteObject(storageRef);
        await deleteDoc(doc(db, "artworks", id));
        set((state) => ({
            artworks: state.artworks.filter((art) => art.id !== id),
        }));
    },
}));
