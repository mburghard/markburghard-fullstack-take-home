'use client';

import React from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import ResizableMedia from '@/components/ResizableMedia';
import { getImageAlignmentClass, getMarginStyles } from '@/utils/spacing';

interface EditableImageProps {
    id: string;
    mediaId?: string;
    properties: {
        width?: string;
        showDescription?: boolean;
        pixelWidth?: number;
        alignment?: 'left' | 'center' | 'right';
        margins?: { top?: number; bottom?: number; left?: number; right?: number };
    };
    onUpdate: (mediaId: string) => void;
    onUpdateProperty?: (property: string, value: any) => void;
}

export default function EditableImage({
    id,
    mediaId,
    properties,
    onUpdate,
    onUpdateProperty,
}: EditableImageProps) {
    const { state } = usePortfolio();

    const mediaItem = mediaId ? state.items.find(item => item.id === mediaId) : null;

    const widthClass = {
        '1/4': 'w-1/4',
        '1/2': 'w-1/2',
        '3/4': 'w-3/4',
        'full': 'w-full',
    }[properties.width || 'full'];

    const alignmentClass = getImageAlignmentClass(properties.alignment);
    const marginStyles = getMarginStyles(properties.margins);

    const handleResize = (width: number, height: number) => {
        if (onUpdateProperty) {
            onUpdateProperty('pixelWidth', width);
        }
    };

    if (!mediaItem) {
        return (
            <div className={`${widthClass} bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center`}>
                <div className="text-gray-500">
                    <div className="text-2xl mb-2">📷</div>
                    <p className="text-sm">Select an image from your media library</p>
                    <select
                        onChange={(e) => onUpdate(e.target.value)}
                        className="mt-2 p-2 border rounded"
                        defaultValue=""
                    >
                        <option value="" disabled>Choose an image...</option>
                        {state.items
                            .filter(item => item.media_type === 'image')
                            .map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.title}
                                </option>
                            ))}
                    </select>
                </div>
            </div>
        );
    }

    return (
        <div className={`${widthClass} flex flex-col`}>
            <div
                className={alignmentClass}
                style={marginStyles}
            >
                <ResizableMedia
                    initialWidth={properties.pixelWidth || 400}
                    onResize={handleResize}
                    preserveAspectRatio={true}
                    minWidth={100}
                    maxWidth={800}
                >
                    <img
                        src={mediaItem.url}
                        alt={mediaItem.title}
                        className="w-full h-auto rounded-lg shadow-sm"
                    />
                </ResizableMedia>
            </div>
            {properties.showDescription && mediaItem.description && (
                <p className="mt-2 text-sm text-gray-600">{mediaItem.description}</p>
            )}
        </div>
    );
}
