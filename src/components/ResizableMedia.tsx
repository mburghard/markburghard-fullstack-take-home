'use client';

import React, { useState, useRef, useCallback } from 'react';

interface ResizableMediaProps {
    children: React.ReactNode;
    initialWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    onResize?: (width: number, height: number) => void;
    preserveAspectRatio?: boolean;
    className?: string;
}

export default function ResizableMedia({
    children,
    initialWidth = 300,
    minWidth = 100,
    maxWidth = 800,
    onResize,
    preserveAspectRatio = true,
    className = '',
}: ResizableMediaProps) {
    const [width, setWidth] = useState(initialWidth);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [aspectRatio, setAspectRatio] = useState<number | null>(null);

    // Calculate aspect ratio from the first image child
    const calculateAspectRatio = useCallback(() => {
        const img = containerRef.current?.querySelector('img');
        if (img && img.naturalWidth && img.naturalHeight) {
            return img.naturalWidth / img.naturalHeight;
        }
        return null;
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent drag events from parent
        setIsResizing(true);

        // Calculate aspect ratio if not already set
        if (!aspectRatio && preserveAspectRatio) {
            const ratio = calculateAspectRatio();
            if (ratio) setAspectRatio(ratio);
        }

        const startX = e.clientX;
        const startWidth = width;

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - startX;
            let newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX));

            setWidth(newWidth);

            if (onResize) {
                const height = aspectRatio ? newWidth / aspectRatio : 'auto';
                onResize(newWidth, typeof height === 'number' ? height : newWidth * 0.6);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [width, minWidth, maxWidth, aspectRatio, preserveAspectRatio, onResize, calculateAspectRatio]);

    return (
        <div
            ref={containerRef}
            className={`relative group inline-block ${className}`}
            style={{ width: `${width}px` }}
            data-resizing={isResizing}
        >
            {children}

            {/* Resize handles - only visible on hover */}
            <div className="absolute inset-0 pointer-events-none group-hover:pointer-events-auto">
                {/* Right resize handle */}
                <div
                    className="resize-handle absolute top-0 right-0 w-2 h-full cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ marginRight: '-4px' }}
                    onMouseDown={handleMouseDown}
                >
                    <div className="w-1 h-full bg-blue-500 ml-1 rounded"></div>
                </div>

                {/* Corner resize handle */}
                <div
                    className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ marginRight: '-8px', marginBottom: '-8px' }}
                    onMouseDown={handleMouseDown}
                >
                    <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
            </div>

            {/* Visual feedback during resize */}
            {isResizing && (
                <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-mono z-10">
                    {width}px
                </div>
            )}
        </div>
    );
}
