// File: src/app/art-show/page.tsx
"use client";
import { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward, faHome, faImages, faTh, } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
export default function ArtShowPage() {
    const [artworks, setArtworks] = useState([]);
    const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isGridView, setIsGridView] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                setLoading(true);
                const storage = getStorage();
                const artRef = ref(storage, "art/");
                const result = await listAll(artRef);
                const urls = await Promise.all(result.items.map(async (item) => ({
                    id: item.name,
                    imageUrl: await getDownloadURL(item),
                })));
                const shuffledUrls = shuffleArray(urls);
                setArtworks(shuffledUrls);
            }
            catch (error) {
                console.error("Error fetching images from Firebase Storage:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchArtworks();
    }, []);
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    const handleNextArtwork = () => {
        setCurrentArtworkIndex((prevIndex) => (prevIndex + 1) % artworks.length);
    };
    const handlePreviousArtwork = () => {
        setCurrentArtworkIndex((prevIndex) => (prevIndex - 1 + artworks.length) % artworks.length);
    };
    if (loading) {
        return (<div className="min-h-screen flex justify-center items-center bg-white">
        Loading...
      </div>);
    }
    return (<div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Home and Toggle Buttons */}
      <div className="fixed top-4 left-4 right-4 flex justify-between z-20">
        <button onClick={() => setIsGridView(!isGridView)} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 opacity-50 hover:opacity-100 transition-opacity" title={isGridView ? "Back to Carousel" : "View All in Grid"}>
          <FontAwesomeIcon icon={isGridView ? faImages : faTh}/>
        </button>
        <Link href="/" className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 opacity-50 hover:opacity-100 transition-opacity" title="Back to Home">
          <FontAwesomeIcon icon={faHome}/>
        </Link>
      </div>

      {artworks.length > 0 && (<>
          {isGridView ? (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 max-h-[80vh] overflow-y-auto">
              {artworks.map((artwork, index) => (<div key={artwork.id} className="relative">
                  <img src={artwork.imageUrl} alt={`Artwork ${index + 1}`} className="w-full h-48 object-cover rounded-lg select-none drag-none" onContextMenu={(e) => e.preventDefault()}/>
                  <div className="absolute inset-0 z-10"></div>
                </div>))}
            </div>) : (<div className="flex justify-center items-center flex-grow relative max-h-[80vh]">
              <div className="relative">
                <img src={artworks[currentArtworkIndex].imageUrl} alt={`Artwork ${currentArtworkIndex + 1}`} className="max-w-full max-h-full object-contain select-none drag-none" onContextMenu={(e) => e.preventDefault()}/>
                <div className="absolute inset-0 z-10"></div>
              </div>
              <button title="Previous Artwork" onClick={handlePreviousArtwork} className="absolute left-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 z-10 opacity-50 hover:opacity-100 transition-opacity">
                <FontAwesomeIcon icon={faBackward}/>
              </button>
              <button title="Next Artwork" onClick={handleNextArtwork} className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 z-10 opacity-50 hover:opacity-100 transition-opacity">
                <FontAwesomeIcon icon={faForward}/>
              </button>
            </div>)}
        </>)}
    </div>);
}
