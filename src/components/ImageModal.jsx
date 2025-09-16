import React from "react";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";

const ImageModal = ({ images = [], currentIndex = 0, onClose, onNext, onPrev, onSelect }) => {
  const [zoom, setZoom] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const currentImage = images[currentIndex] || {}; // ✅ safe fallback

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 0.5));

  const handleDownload = () => {
    if (!currentImage.url) return;
    const link = document.createElement("a");
    link.href = currentImage.url;
    link.download = `issue-image-${currentIndex + 1}.jpg`;
    link.click();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose?.();
    if (e.key === "ArrowLeft" && onPrev) onPrev();
    if (e.key === "ArrowRight" && onNext) onNext();
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!images.length) return null; // ✅ prevent rendering when no images

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="text-white">
          <span className="text-sm">
            {currentIndex + 1} of {images.length}
          </span>
          <p className="text-sm mt-1 opacity-75">
            {currentImage.caption || "No Title"}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
          >
            <Download size={20} />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          {onPrev && (
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors z-10"
            >
              ←
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors z-10"
            >
              →
            </button>
          )}
        </>
      )}

      {/* Image */}
      <div className="flex items-center justify-center w-full h-full p-16">
        <img
          src={currentImage.url || ""}
          alt={currentImage.caption || `Issue image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain cursor-move"
          style={{
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
            transition: "transform 0.2s ease",
          }}
          draggable={false}
        />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 p-2 rounded-lg">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelect?.(index)} // ✅ parent can switch image
              className={`w-12 h-12 rounded overflow-hidden border-2 ${
                index === currentIndex ? "border-white" : "border-transparent"
              }`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageModal;
