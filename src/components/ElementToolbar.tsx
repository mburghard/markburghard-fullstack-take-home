'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faFont,
    faImage,
    faMinus,
    faSquare,
} from '@fortawesome/free-solid-svg-icons';

interface ElementToolbarProps {
    onAddElement: (type: 'text' | 'image' | 'hr' | 'section') => void;
}

export default function ElementToolbar({ onAddElement }: ElementToolbarProps) {
    const tools = [
        { type: 'text' as const, icon: faFont, label: 'Add Text' },
        { type: 'image' as const, icon: faImage, label: 'Add Image' },
        { type: 'hr' as const, icon: faMinus, label: 'Add Divider' },
        { type: 'section' as const, icon: faSquare, label: 'Add Section' },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2 text-blue-600" />
                Add Elements
            </h3>
            <div className="grid grid-cols-2 gap-2">
                {tools.map((tool) => (
                    <button
                        key={tool.type}
                        onClick={() => onAddElement(tool.type)}
                        className="flex items-center space-x-2 p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                        <FontAwesomeIcon icon={tool.icon} className="w-4 h-4 text-gray-500" />
                        <span>{tool.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
