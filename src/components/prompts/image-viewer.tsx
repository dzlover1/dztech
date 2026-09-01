"use client";

import * as React from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/utils";

interface ImageViewerProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function ImageViewer({ images, currentIndex, isOpen, onClose, onIndexChange }: ImageViewerProps) {
  const [zoom, setZoom] = React.useState(1);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onIndexChange(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < images.length - 1) onIndexChange(currentIndex + 1);
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.25, 3));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.25, 0.5));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onIndexChange]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
        <span className="text-white text-sm">
          {currentIndex + 1} / {images.length}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.min(z + 0.25, 3))} className="text-white hover:text-white hover:bg-white/20">
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))} className="text-white hover:text-white hover:bg-white/20">
            <ZoomOut className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => downloadFile(images[currentIndex], `image-${currentIndex + 1}.jpg`, "image/jpeg")}
            className="text-white hover:text-white hover:bg-white/20"
          >
            <Download className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Left arrow */}
      {currentIndex > 0 && (
        <button
          onClick={() => onIndexChange(currentIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <div className="flex items-center justify-center w-full h-full p-16 overflow-auto">
        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          width={1200}
          height={800}
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
          unoptimized
        />
      </div>

      {/* Right arrow */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={() => onIndexChange(currentIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
