'use client';

import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../contexts/PortfolioContext';

interface EditableVideoProps {
    id: string;
    content: string;
    properties: {
        width?: number;
        height?: number;
        autoplay?: boolean;
        controls?: boolean;
        loop?: boolean;
        muted?: boolean;
        margins?: { top?: number; bottom?: number; left?: number; right?: number };
        mediaId?: string;
    };
    onUpdate: (content: string) => void;
    onUpdateProperty?: (property: string, value: any) => void;
}

export default function EditableVideo({
    id,
    content,
    properties,
    onUpdate,
    onUpdateProperty
}: EditableVideoProps) {
    const { state } = usePortfolio();
    const [isSelecting, setIsSelecting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragDirection, setDragDirection] = useState<'horizontal' | 'vertical' | null>(null);
    const resizeRef = useRef<HTMLDivElement>(null);
    const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

    const handleSelectVideo = () => {
        setIsSelecting(true);
    };

    const handleVideoSelect = (mediaId: string) => {
        onUpdate(mediaId);
        setIsSelecting(false);
    };

    const handleMouseDown = (e: React.MouseEvent, direction: 'horizontal' | 'vertical') => {
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(true);
        setDragDirection(direction);

        startPos.current = {
            x: e.clientX,
            y: e.clientY,
            width: properties.width || 400,
            height: properties.height || 225
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startPos.current.x;
            const deltaY = e.clientY - startPos.current.y;

            if (direction === 'horizontal') {
                const newWidth = Math.max(200, startPos.current.width + deltaX);
                onUpdateProperty?.('width', newWidth);
            } else if (direction === 'vertical') {
                const newHeight = Math.max(112, startPos.current.height + deltaY);
                onUpdateProperty?.('height', newHeight);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setDragDirection(null);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const getSelectedVideo = () => {
        if (!content) return null;
        return state.items.find(item => item.id === content);
    };

    const getAvailableVideos = () => {
        return state.items.filter(item => item.url && (item.url.includes('.mp4') || item.url.includes('.webm') || item.url.includes('.ogg')));
    };

    const renderVideo = () => {
        const selectedVideo = getSelectedVideo();

        if (!selectedVideo) {
            return (
                <div
                    className="flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg cursor-pointer shadow-neumorphic-inset"
                    style={{
                        width: properties.width || 400,
                        height: properties.height || 225
                    }}
                    onClick={handleSelectVideo}
                >
                    <p className="text-sm">Click to select video from assets</p>
                </div>
            );
        }

        return (
            <div
                className="relative group rounded-lg overflow-hidden shadow-neumorphic"
                style={{
                    width: properties.width || 400,
                    height: properties.height || 225
                }}
            >
                <video
                    src={selectedVideo.url}
                    width="100%"
                    height="100%"
                    controls={properties.controls !== false}
                    autoPlay={properties.autoplay || false}
                    loop={properties.loop || false}
                    muted={properties.muted || false}
                    className="rounded-lg"
                />

                {/* Resize handles */}
                <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-8 bg-primary/50 rounded-l cursor-col-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleMouseDown(e, 'horizontal')}
                    title="Resize width"
                />
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-8 bg-primary/50 rounded-t cursor-row-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => handleMouseDown(e, 'vertical')}
                    title="Resize height"
                />
            </div>
        );
    };

    const renderVideoSelector = () => {
        const availableVideos = getAvailableVideos();

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-background rounded-lg shadow-neumorphic p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-primary">Select Video</h3>
                        <button
                            onClick={() => setIsSelecting(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    {availableVideos.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <p>No videos available. Upload some videos first.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {availableVideos.map((video) => (
                                <div
                                    key={video.id}
                                    className="cursor-pointer group"
                                    onClick={() => handleVideoSelect(video.id)}
                                >
                                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-neumorphic-sm hover:shadow-neumorphic transition-all">
                                        <video
                                            src={video.url}
                                            className="w-full h-full object-cover"
                                            muted
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                            <div className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                ▶️
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2 truncate">{video.title}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (isSelecting) {
        return renderVideoSelector();
    }

    return (
        <div
            ref={resizeRef}
            className="inline-block"
            style={{
                marginTop: properties.margins?.top ? `${properties.margins.top}px` : undefined,
                marginBottom: properties.margins?.bottom ? `${properties.margins.bottom}px` : undefined,
                marginLeft: properties.margins?.left ? `${properties.margins.left}px` : undefined,
                marginRight: properties.margins?.right ? `${properties.margins.right}px` : undefined,
            }}
        >
            {renderVideo()}
        </div>
    );
}
