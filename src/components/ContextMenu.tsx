'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPalette, faRuler, faEye, faEyeSlash, faTrash, faArrowUp, faArrowDown, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import SpacingControls from '@/components/SpacingControls';

interface ContextMenuProps {
    isOpen: boolean;
    onClose: () => void;
    elementType: 'text' | 'image' | 'hr' | 'section' | 'video';
    position: { x: number; y: number };
    onUpdate: (property: string, value: any) => void;
    currentProperties: Record<string, any>;
    onDelete?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onMoveToPrevSection?: () => void;
    onMoveToNextSection?: () => void;
    canMoveToPrevSection?: boolean;
    canMoveToNextSection?: boolean;
    canMoveUp?: boolean;
    canMoveDown?: boolean;
}

export default function ContextMenu({
    isOpen,
    onClose,
    elementType,
    position,
    onUpdate,
    currentProperties,
    onDelete,
    onMoveUp,
    onMoveDown,
    onMoveToPrevSection,
    onMoveToNextSection,
    canMoveToPrevSection = true,
    canMoveToNextSection = true,
    canMoveUp = true,
    canMoveDown = true,
}: ContextMenuProps) {
    console.log('ContextMenu render:', { isOpen, elementType, position });
    if (!isOpen) return null;

    const renderControls = () => {
        switch (elementType) {
            case 'text':
                return (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
                            <select
                                value={currentProperties.fontFamily || 'var(--font-inter)'}
                                onChange={(e) => onUpdate('fontFamily', e.target.value)}
                                className="w-full p-2 rounded-lg shadow-neumorphic-inset bg-background text-sm border-0 focus:outline-none focus:shadow-neumorphic-inset"
                            >
                                <option value="var(--font-inter)">Inter</option>
                                <option value="Arial">Arial</option>
                                <option value="Helvetica">Helvetica</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Georgia">Georgia</option>
                                <option value="var(--font-roboto)">Roboto</option>
                                <option value="var(--font-open-sans)">Open Sans</option>
                                <option value="var(--font-lato)">Lato</option>
                                <option value="var(--font-montserrat)">Montserrat</option>
                                <option value="var(--font-poppins)">Poppins</option>
                                <option value="var(--font-merriweather)">Merriweather</option>
                                <option value="var(--font-playfair-display)">Playfair Display</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
                            <input
                                type="range"
                                min="12"
                                max="48"
                                value={currentProperties.fontSize || 16}
                                onChange={(e) => onUpdate('fontSize', parseInt(e.target.value))}
                                className="w-full accent-primary"
                            />
                            <span className="text-xs text-gray-500">{currentProperties.fontSize || 16}px</span>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Font Weight</label>
                            <select
                                value={currentProperties.fontWeight || 'normal'}
                                onChange={(e) => onUpdate('fontWeight', e.target.value)}
                                className="w-full p-2 rounded-lg shadow-neumorphic-inset bg-background text-sm border-0 focus:outline-none focus:shadow-neumorphic-inset"
                            >
                                <option value="300">Light</option>
                                <option value="normal">Normal</option>
                                <option value="600">Semi Bold</option>
                                <option value="bold">Bold</option>
                            </select>
                        </div>
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
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                            <input
                                type="color"
                                value={currentProperties.color || '#000000'}
                                onChange={(e) => onUpdate('color', e.target.value)}
                                className="w-full h-8 rounded-lg shadow-neumorphic-inset bg-background border-0 focus:outline-none focus:shadow-neumorphic-inset"
                            />
                        </div>
                        <SpacingControls
                            currentProperties={currentProperties}
                            onUpdate={onUpdate}
                            elementType={elementType}
                        />
                    </div>
                );

            case 'image':
                return (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Grid Columns</label>
                            <input
                                type="range"
                                min="1"
                                max="6"
                                value={currentProperties.columns || 3}
                                onChange={(e) => onUpdate('columns', parseInt(e.target.value))}
                                className="w-full accent-primary"
                            />
                            <span className="text-xs text-gray-500">{currentProperties.columns || 3} columns</span>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Spacing</label>
                            <input
                                type="range"
                                min="0"
                                max="32"
                                value={currentProperties.spacing || 8}
                                onChange={(e) => onUpdate('spacing', parseInt(e.target.value))}
                                className="w-full accent-primary"
                            />
                            <span className="text-xs text-gray-500">{currentProperties.spacing || 8}px</span>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Alignment</label>
                            <select
                                value={currentProperties.alignment || 'center'}
                                onChange={(e) => onUpdate('alignment', e.target.value)}
                                className="w-full p-2 rounded-lg shadow-neumorphic-inset bg-background text-sm border-0 focus:outline-none focus:shadow-neumorphic-inset"
                            >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <SpacingControls
                            currentProperties={currentProperties}
                            onUpdate={onUpdate}
                            elementType={elementType}
                        />
                    </div>
                );

            case 'video':
                return (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
                            <input
                                type="range"
                                min="200"
                                max="800"
                                value={currentProperties.width || 400}
                                onChange={(e) => onUpdate('width', parseInt(e.target.value))}
                                className="w-full accent-primary"
                            />
                            <span className="text-xs text-gray-500">{currentProperties.width || 400}px</span>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
                            <input
                                type="range"
                                min="112"
                                max="450"
                                value={currentProperties.height || 225}
                                onChange={(e) => onUpdate('height', parseInt(e.target.value))}
                                className="w-full accent-primary"
                            />
                            <span className="text-xs text-gray-500">{currentProperties.height || 225}px</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="autoplay"
                                checked={currentProperties.autoplay || false}
                                onChange={(e) => onUpdate('autoplay', e.target.checked)}
                                className="accent-primary"
                            />
                            <label htmlFor="autoplay" className="text-xs font-medium text-gray-700">Autoplay</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="loop"
                                checked={currentProperties.loop || false}
                                onChange={(e) => onUpdate('loop', e.target.checked)}
                                className="accent-primary"
                            />
                            <label htmlFor="loop" className="text-xs font-medium text-gray-700">Loop</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="muted"
                                checked={currentProperties.muted || false}
                                onChange={(e) => onUpdate('muted', e.target.checked)}
                                className="accent-primary"
                            />
                            <label htmlFor="muted" className="text-xs font-medium text-gray-700">Muted</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="controls"
                                checked={currentProperties.controls !== false}
                                onChange={(e) => onUpdate('controls', e.target.checked)}
                                className="accent-primary"
                            />
                            <label htmlFor="controls" className="text-xs font-medium text-gray-700">Show Controls</label>
                        </div>
                        <SpacingControls
                            currentProperties={currentProperties}
                            onUpdate={onUpdate}
                            elementType={elementType}
                        />
                    </div>
                );

            case 'hr':
                return (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Line Weight</label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={currentProperties.thickness || 1}
                                onChange={(e) => onUpdate('thickness', parseInt(e.target.value))}
                                className="w-full accent-primary"
                            />
                            <span className="text-xs text-gray-500">{currentProperties.thickness || 1}px</span>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={currentProperties.width || 100}
                                onChange={(e) => onUpdate('width', parseInt(e.target.value))}
                                className="w-full accent-primary"
                            />
                            <span className="text-xs text-gray-500">{currentProperties.width || 100}%</span>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                            <input
                                type="color"
                                value={currentProperties.color || '#e5e7eb'}
                                onChange={(e) => onUpdate('color', e.target.value)}
                                className="w-full h-8 rounded-lg shadow-neumorphic-inset bg-background border-0 focus:outline-none focus:shadow-neumorphic-inset"
                            />
                        </div>
                    </div>
                );

            case 'section':
                return (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Section Title</label>
                            <input
                                type="text"
                                value={currentProperties.title || ''}
                                onChange={(e) => onUpdate('title', e.target.value)}
                                className="w-full p-2 rounded-lg shadow-neumorphic-inset bg-background text-sm border-0 focus:outline-none focus:shadow-neumorphic-inset"
                                placeholder="Section title"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
                            <select
                                value={currentProperties.height || 'auto'}
                                onChange={(e) => onUpdate('height', e.target.value)}
                                className="w-full p-2 rounded-lg shadow-neumorphic-inset bg-background text-sm border-0 focus:outline-none focus:shadow-neumorphic-inset"
                            >
                                <option value="auto">Auto</option>
                                <option value="screen">Full Screen</option>
                                <option value="half">Half Screen</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>
                        {currentProperties.height === 'custom' && (
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Custom Height (px)</label>
                                <input
                                    type="number"
                                    value={currentProperties.customHeight || 400}
                                    onChange={(e) => onUpdate('customHeight', parseInt(e.target.value))}
                                    className="w-full p-2 rounded-lg shadow-neumorphic-inset bg-background text-sm border-0 focus:outline-none focus:shadow-neumorphic-inset"
                                    min="100"
                                    max="2000"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Padding</label>
                            <select
                                value={currentProperties.padding || 'normal'}
                                onChange={(e) => onUpdate('padding', e.target.value)}
                                className="w-full p-2 rounded-lg shadow-neumorphic-inset bg-background text-sm border-0 focus:outline-none focus:shadow-neumorphic-inset"
                            >
                                <option value="none">None</option>
                                <option value="small">Small</option>
                                <option value="normal">Normal</option>
                                <option value="large">Large</option>
                                <option value="xl">Extra Large</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Content Alignment</label>
                            <select
                                value={currentProperties.contentAlignment || 'top'}
                                onChange={(e) => onUpdate('contentAlignment', e.target.value)}
                                className="w-full p-2 rounded-lg shadow-neumorphic-inset bg-background text-sm border-0 focus:outline-none focus:shadow-neumorphic-inset"
                            >
                                <option value="top">Top</option>
                                <option value="center">Center</option>
                                <option value="bottom">Bottom</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
                            <select
                                value={currentProperties.backgroundType || 'color'}
                                onChange={(e) => onUpdate('backgroundType', e.target.value)}
                                className="w-full p-2 rounded-lg shadow-neumorphic-inset bg-background text-sm border-0 focus:outline-none focus:shadow-neumorphic-inset"
                            >
                                <option value="color">Color</option>
                                <option value="image">Image</option>
                            </select>
                        </div>
                        {currentProperties.backgroundType === 'color' || !currentProperties.backgroundType ? (
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
                                <input
                                    type="color"
                                    value={currentProperties.backgroundColor || '#ffffff'}
                                    onChange={(e) => onUpdate('backgroundColor', e.target.value)}
                                    className="w-full h-8 rounded-lg shadow-neumorphic-inset bg-background border-0 focus:outline-none focus:shadow-neumorphic-inset"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Background Image URL</label>
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={currentProperties.backgroundImage || ''}
                                    onChange={(e) => onUpdate('backgroundImage', e.target.value)}
                                    className="w-full p-2 rounded-lg shadow-neumorphic-inset bg-background text-sm border-0 focus:outline-none focus:shadow-neumorphic-inset"
                                />
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    // Calculate position to ensure menu stays within viewport
    const calculatePosition = () => {
        const menuHeight = 400; // Approximate height of the menu
        const menuWidth = 256; // w-64 = 16rem = 256px
        const padding = 16;

        let left = position.x;
        let top = position.y;

        // Adjust horizontal position if menu would go off-screen
        if (left + menuWidth > window.innerWidth - padding) {
            left = window.innerWidth - menuWidth - padding;
        }
        if (left < padding) {
            left = padding;
        }

        // Adjust vertical position if menu would go off-screen
        if (top + menuHeight > window.innerHeight - padding) {
            top = window.innerHeight - menuHeight - padding;
        }
        if (top < padding) {
            top = padding;
        }

        return { left, top };
    };

    const adjustedPosition = calculatePosition();

    return (
        <div
            className="fixed bg-background rounded-lg shadow-neumorphic p-4 w-64 z-[9999] max-h-96 overflow-y-auto"
            style={{ left: adjustedPosition.left, top: adjustedPosition.top }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">{elementType} Settings</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all duration-200"
                >
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                </button>
            </div>
            {renderControls()}            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-gray-200">
                {/* Move between sections buttons for non-section elements */}
                {elementType !== 'section' && (onMoveToPrevSection || onMoveToNextSection) && (
                    <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-2">Move to Section</label>
                        <div className="flex space-x-1">
                            {onMoveToPrevSection && (
                                <button
                                    onClick={() => {
                                        if (canMoveToPrevSection) onMoveToPrevSection();
                                    }}
                                    disabled={!canMoveToPrevSection}
                                    className={`flex-1 px-3 py-2 text-xs rounded-lg flex items-center justify-center space-x-1 transition-all duration-200 ${canMoveToPrevSection
                                        ? 'bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset text-primary cursor-pointer'
                                        : 'bg-background text-gray-400 cursor-not-allowed shadow-neumorphic-inset'
                                        }`}
                                    title={canMoveToPrevSection ? "Move to Previous Section" : "No previous section"}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
                                    <span>Prev</span>
                                </button>
                            )}
                            {onMoveToNextSection && (
                                <button
                                    onClick={() => {
                                        if (canMoveToNextSection) onMoveToNextSection();
                                    }}
                                    disabled={!canMoveToNextSection}
                                    className={`flex-1 px-3 py-2 text-xs rounded-lg flex items-center justify-center space-x-1 transition-all duration-200 ${canMoveToNextSection
                                        ? 'bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset text-primary cursor-pointer'
                                        : 'bg-background text-gray-400 cursor-not-allowed shadow-neumorphic-inset'
                                        }`}
                                    title={canMoveToNextSection ? "Move to Next Section" : "No next section"}
                                >
                                    <span>Next</span>
                                    <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    {/* Move buttons for sections */}
                    {elementType === 'section' && (onMoveUp || onMoveDown) && (
                        <div className="flex space-x-1">
                            {onMoveUp && (
                                <button
                                    onClick={() => {
                                        if (canMoveUp) {
                                            onMoveUp();
                                            onClose();
                                        }
                                    }}
                                    disabled={!canMoveUp}
                                    className={`px-3 py-2 text-xs rounded-lg flex items-center space-x-1 transition-all duration-200 ${canMoveUp
                                        ? 'bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset text-primary cursor-pointer'
                                        : 'bg-background text-gray-400 cursor-not-allowed shadow-neumorphic-inset'
                                        }`}
                                    title={canMoveUp ? "Move Up" : "Already at top"}
                                >
                                    <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
                                    <span>Up</span>
                                </button>
                            )}
                            {onMoveDown && (
                                <button
                                    onClick={() => {
                                        if (canMoveDown) {
                                            onMoveDown();
                                            onClose();
                                        }
                                    }}
                                    disabled={!canMoveDown}
                                    className={`px-3 py-2 text-xs rounded-lg flex items-center space-x-1 transition-all duration-200 ${canMoveDown
                                        ? 'bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset text-primary cursor-pointer'
                                        : 'bg-background text-gray-400 cursor-not-allowed shadow-neumorphic-inset'
                                        }`}
                                    title={canMoveDown ? "Move Down" : "Already at bottom"}
                                >
                                    <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3" />
                                    <span>Down</span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Spacer for non-section elements without move buttons */}
                    {elementType !== 'section' && !onMoveUp && !onMoveDown && <div></div>}

                    {/* Delete button */}
                    {onDelete && (
                        <button
                            onClick={() => {
                                if (confirm(`Are you sure you want to delete this ${elementType}?`)) {
                                    onDelete();
                                }
                            }}
                            className="px-3 py-2 text-xs bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset text-red-600 rounded-lg flex items-center space-x-1 transition-all duration-200"
                            title="Delete"
                        >
                            <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                            <span>Delete</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
