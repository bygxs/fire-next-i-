"use client";

interface Artwork {
  id: string;
  imageUrl: string;
}

interface ArtGridProps {
  artworks: Artwork[];
  onDelete?: (id: string) => void; // Optional delete handler
}

export default function ArtGrid({ artworks, onDelete }: ArtGridProps) {
  return (
    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artworks.map((art) => (
          <div key={art.id} className="relative">
            <img
              src={art.imageUrl}
              alt="Artwork"
              className="w-full h-auto border-2 border-gray-300 dark:border-gray-700 rounded"
            />
            {onDelete && (
              <button
                onClick={() => onDelete(art.id)}
                className="absolute top-1 right-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                X
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
