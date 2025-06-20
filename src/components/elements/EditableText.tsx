'use client';

import React, { useState } from 'react';
import { getMarginStyles, getTextAlignmentClass } from '@/utils/spacing';

interface EditableTextProps {
    id: string;
    content: string;
    properties: {
        fontSize?: number;
        fontWeight?: string;
        fontFamily?: string;
        color?: string;
        textAlign?: string;
        margins?: { top?: number; bottom?: number; left?: number; right?: number };
    };
    onUpdate: (content: string) => void;
}

export default function EditableText({
    id,
    content,
    properties,
    onUpdate,
}: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(content);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleSubmit = () => {
        onUpdate(editContent);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
        if (e.key === 'Escape') {
            setEditContent(content);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onBlur={handleSubmit}
                onKeyDown={handleKeyDown}
                className="w-full p-2 shadow-neumorphic-inset bg-background border-0 rounded-lg resize-none focus:outline-none focus:shadow-neumorphic-inset"
                style={{
                    fontSize: `${properties.fontSize || 16}px`,
                    fontFamily: properties.fontFamily || 'var(--font-inter)',
                    color: properties.color || '#000000',
                    minHeight: '40px',
                }}
                autoFocus
            />
        );
    }

    return (
        <div
            onDoubleClick={handleDoubleClick}
            className={`cursor-pointer hover:shadow-neumorphic-sm p-2 rounded-lg transition-all duration-200 ${getTextAlignmentClass(properties.textAlign)}`}
            style={{
                fontSize: `${properties.fontSize || 16}px`,
                fontFamily: properties.fontFamily || 'var(--font-inter)',
                fontWeight: properties.fontWeight || 'normal',
                color: properties.color || '#000000',
                ...getMarginStyles(properties.margins),
            }}
        >
            {content || 'Double-click to edit text'}
        </div>
    );
}
