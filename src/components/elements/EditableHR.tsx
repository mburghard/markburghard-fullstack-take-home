'use client';

import React from 'react';

interface EditableHRProps {
    id: string;
    properties: {
        thickness?: number;
        width?: number;
        color?: string;
    };
}

export default function EditableHR({ id, properties }: EditableHRProps) {
    return (
        <div className="flex justify-center my-4">
            <hr
                style={{
                    borderWidth: `${properties.thickness || 1}px`,
                    borderColor: properties.color || '#e5e7eb',
                    borderStyle: 'solid',
                    width: `${properties.width || 100}%`,
                    maxWidth: '100%',
                }}
            />
        </div>
    );
}
