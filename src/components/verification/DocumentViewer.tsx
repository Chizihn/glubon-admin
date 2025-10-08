import { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  doc: {
    images: string[];
    userName: string;
    documentType: string;
    documentNumber: string;
    submittedAt: string;
  };
  onApprove: () => void;
  onReject: () => void;
  isReviewing: boolean;
}

export function DocumentViewer({
  isOpen,
  onClose,
  doc,
  onApprove,
  onReject,
  isReviewing,
}: DocumentViewerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const currentImage = doc.images[currentImageIndex];
  const totalImages = doc.images.length;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    resetView();
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    resetView();
  };

  const zoomIn = () => setScale((s) => Math.min(3, s + 0.25));
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.25));
  const rotate = () => setRotation((r) => (r + 90) % 360);
  const resetView = () => {
    setScale(1);
    setRotation(0);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `document-${doc.documentNumber}-${currentImageIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="text-white">
          <h2 className="text-lg font-medium">
            {doc.userName}'s {doc.documentType}
          </h2>
          <p className="text-sm text-gray-400">
            {doc.documentNumber} • {new Date(doc.submittedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={zoomIn}
            className="p-2 text-white hover:bg-gray-800 rounded-full"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={zoomOut}
            className="p-2 text-white hover:bg-gray-800 rounded-full"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={rotate}
            className="p-2 text-white hover:bg-gray-800 rounded-full"
            title="Rotate"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button
            onClick={downloadImage}
            className="p-2 text-white hover:bg-gray-800 rounded-full"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-gray-800 rounded-full"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-4">
        <div className="relative">
          {totalImages > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full z-10"
              disabled={totalImages <= 1}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          
          <div className="max-w-4xl max-h-[70vh] overflow-auto">
            <div 
              className="transition-transform duration-200 ease-in-out"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <img
                src={currentImage}
                alt={`Document ${currentImageIndex + 1}`}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>

          {totalImages > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full z-10"
              disabled={totalImages <= 1}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {totalImages > 1 && (
        <div className="p-4 border-t border-gray-800 overflow-x-auto">
          <div className="flex space-x-2 justify-center">
            {doc.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentImageIndex(idx);
                  resetView();
                }}
                className={`w-16 h-16 flex-shrink-0 border-2 rounded overflow-hidden transition-all ${
                  currentImageIndex === idx
                    ? 'border-blue-500 ring-2 ring-blue-300'
                    : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          {currentImageIndex + 1} of {totalImages} • {Math.round(scale * 100)}%
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onReject}
            disabled={isReviewing}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isReviewing ? 'Processing...' : 'Reject'}
          </button>
          <button
            onClick={onApprove}
            disabled={isReviewing}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isReviewing ? 'Processing...' : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  );
}