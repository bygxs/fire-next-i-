import { create } from "zustand";
import { db, storage } from "../lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

interface Artwork {
  id: string;
  imageUrl: string;
}

interface ArtStore {
  artworks: Artwork[];
  setArtworks: (artworks: Artwork[]) => void;
  deleteArtwork: (id: string, imageUrl: string) => Promise<void>;
}

export const useArtStore = create<ArtStore>((set) => ({
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
