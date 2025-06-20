'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface SpacingControlsProps {
    currentProperties: Record<string, any>;
    onUpdate: (property: string, value: any) => void;
    elementType: 'text' | 'image' | 'video' | 'hr' | 'section';
}

export default function SpacingControls({
    currentProperties,
    onUpdate,
    elementType,
}: SpacingControlsProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Get current margin values or defaults
    const margins = currentProperties.margins || { top: 16, bottom: 16, left: 0, right: 0 };

    const handleMarginChange = (side: 'top' | 'bottom' | 'left' | 'right', value: number) => {
        const newMargins = { ...margins, [side]: value };
        onUpdate('margins', newMargins);
    };

    const presets = [
        { name: 'None', values: { top: 0, bottom: 0, left: 0, right: 0 } },
        { name: 'Small', values: { top: 8, bottom: 8, left: 0, right: 0 } },
        { name: 'Normal', values: { top: 16, bottom: 16, left: 0, right: 0 } },
        { name: 'Large', values: { top: 32, bottom: 32, left: 0, right: 0 } },
    ];

    const applyPreset = (preset: { top: number; bottom: number; left: number; right: number }) => {
        onUpdate('margins', preset);
    };

    return (
        <div className="rounded-lg shadow-neumorphic-inset bg-background/50">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-3 py-2 flex items-center justify-between text-sm font-bold text-primary bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all duration-200 rounded-lg"
            >
                <span>Spacing & Margins</span>
                <FontAwesomeIcon
                    icon={isExpanded ? faChevronUp : faChevronDown}
                    className="w-3 h-3"
                />
            </button>

            {isExpanded && (
                <div className="p-3 border-t border-gray-200/50 space-y-4">
                    {/* Quick Presets */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Quick Presets</label>
                        <div className="grid grid-cols-2 gap-1">
                            {presets.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => applyPreset(preset.values)}
                                    className="px-2 py-1 text-xs bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset rounded-lg text-gray-700 transition-all duration-200"
                                >
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Individual Margin Controls */}
                    <div className="space-y-3">
                        <label className="block text-xs font-medium text-gray-700">Custom Margins (px)</label>

                        {/* Visual margin representation */}
                        <div className="relative bg-background/30 rounded-lg p-4 shadow-neumorphic-inset">
                            {/* Top margin */}
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                <div className="flex flex-col items-center">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={margins.top || 0}
                                        onChange={(e) => handleMarginChange('top', parseInt(e.target.value))}
                                        className="w-16 h-1 accent-primary"
                                    />
                                    <span className="text-xs text-gray-600 mt-1">{margins.top || 0}</span>
                                </div>
                            </div>

                            {/* Left margin */}
                            <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 rotate-90">
                                <div className="flex flex-col items-center">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={margins.left || 0}
                                        onChange={(e) => handleMarginChange('left', parseInt(e.target.value))}
                                        className="w-16 h-1 accent-primary"
                                    />
                                    <span className="text-xs text-gray-600 mt-1 -rotate-90">{margins.left || 0}</span>
                                </div>
                            </div>

                            {/* Right margin */}
                            <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 -rotate-90">
                                <div className="flex flex-col items-center">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={margins.right || 0}
                                        onChange={(e) => handleMarginChange('right', parseInt(e.target.value))}
                                        className="w-16 h-1 accent-primary"
                                    />
                                    <span className="text-xs text-gray-600 mt-1 rotate-90">{margins.right || 0}</span>
                                </div>
                            </div>

                            {/* Bottom margin */}
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-gray-600 mb-1">{margins.bottom || 0}</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={margins.bottom || 0}
                                        onChange={(e) => handleMarginChange('bottom', parseInt(e.target.value))}
                                        className="w-16 h-1 accent-primary"
                                    />
                                </div>
                            </div>

                            {/* Center element representation */}
                            <div className="w-16 h-12 bg-primary/20 rounded-lg mx-auto flex items-center justify-center shadow-neumorphic-inset">
                                <span className="text-xs text-primary font-bold">
                                    {elementType === 'text' ? 'T' : elementType === 'image' ? '📷' : elementType === 'hr' ? '—' : 'S'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Alignment for images and text */}
                    {(elementType === 'image' || elementType === 'text') && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Alignment</label>
                            <select
                                value={currentProperties.alignment || (elementType === 'image' ? 'center' : 'left')}
                                onChange={(e) => onUpdate('alignment', e.target.value)}
                                className="w-full p-2 rounded-lg shadow-neumorphic-inset bg-background text-sm border-0 focus:outline-none focus:shadow-neumorphic-inset"
                            >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                    )}

                    {/* Text alignment for text elements */}
                    {elementType === 'text' && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Text Alignment</label>
                            <select
                                value={currentProperties.textAlign || 'left'}
                                onChange={(e) => onUpdate('textAlign', e.target.value)}
                                className="w-full p-2 rounded-lg shadow-neumorphic-inset bg-background text-sm border-0 focus:outline-none focus:shadow-neumorphic-inset"
                            >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                                <option value="justify">Justify</option>
                            </select>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
