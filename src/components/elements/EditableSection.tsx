'use client';

import React from 'react';

interface EditableSectionProps {
    id: string;
    children: React.ReactNode;
    properties: {
        backgroundType?: 'color' | 'image';
        backgroundColor?: string;
        backgroundImage?: string;
        height?: 'auto' | 'screen' | 'half' | 'custom';
        customHeight?: number;
        padding?: 'none' | 'small' | 'normal' | 'large' | 'xl';
        contentAlignment?: 'top' | 'center' | 'bottom';
        title?: string;
    };
}

export default function EditableSection({
    id,
    children,
    properties,
}: EditableSectionProps) {
    const backgroundStyle = properties.backgroundType === 'image' && properties.backgroundImage
        ? {
            backgroundImage: `url(${properties.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }
        : {
            backgroundColor: properties.backgroundColor || '#ffffff',
        };

    const getHeightClass = () => {
        switch (properties.height) {
            case 'screen':
                return 'min-h-screen';
            case 'half':
                return 'min-h-[50vh]';
            case 'custom':
                return '';
            default:
                return 'min-h-32';
        }
    };

    const getPaddingClass = () => {
        switch (properties.padding) {
            case 'none':
                return 'p-0';
            case 'small':
                return 'p-4';
            case 'normal':
                return 'p-6';
            case 'large':
                return 'p-12';
            case 'xl':
                return 'p-16';
            default:
                return 'p-6';
        }
    };

    const getAlignmentClass = () => {
        switch (properties.contentAlignment) {
            case 'center':
                return 'flex items-center justify-center';
            case 'bottom':
                return 'flex items-end';
            default:
                return 'flex items-start';
        }
    };

    const customStyle = properties.height === 'custom' && properties.customHeight
        ? { ...backgroundStyle, minHeight: `${properties.customHeight}px` }
        : backgroundStyle;

    return (
        <section
            className={`w-full ${getHeightClass()} ${getPaddingClass()} ${getAlignmentClass()}`}
            style={customStyle}
        >
            <div className="w-full">
                {children}
            </div>
        </section>
    );
}
