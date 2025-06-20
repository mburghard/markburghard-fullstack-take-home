'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Plus, Type, Grip, Settings, X } from 'lucide-react';

interface VideoItem {
    id: string;
    type: 'video' | 'text';
    content: string;
    mediaId?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize?: number;
    color?: string;
    fontWeight?: string;
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
    backgroundColor?: string;
}

interface EditableVideoContainerProps {
    id: string;
    items: Array<{
        id: string;
        type: 'image' | 'video' | 'text';
        mediaId?: string;
        content?: string;
        gridColumn?: string;
        gridRow?: string;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        fontSize?: number;
        fontWeight?: string;
        color?: string;
        fontFamily?: string;
        textAlign?: 'left' | 'center' | 'right';
        backgroundColor?: string;
    }>;
    properties: any;
    onUpdate: (items: Array<{
        id: string;
        type: 'image' | 'video' | 'text';
        mediaId?: string;
        content?: string;
        gridColumn?: string;
        gridRow?: string;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        fontSize?: number;
        fontWeight?: string;
        color?: string;
        fontFamily?: string;
        textAlign?: 'left' | 'center' | 'right';
        backgroundColor?: string;
    }>) => void;
    onUpdateProperty?: (property: string, value: any) => void;
}

export default function EditableVideoContainer({
    id,
    items: initialItems = [],
    properties,
    onUpdate,
    onUpdateProperty
}: EditableVideoContainerProps) {
    const { state } = usePortfolio();

    // Convert from unified items to VideoItem format
    const convertToVideoItems = (items: EditableVideoContainerProps['items']): VideoItem[] => {
        return items.map(item => ({
            id: item.id,
            type: item.type as 'video' | 'text',
            content: item.content || '',
            mediaId: item.mediaId,
            x: item.x || 0,
            y: item.y || 0,
            width: item.width || 100,
            height: item.height || 100,
            fontSize: item.fontSize,
            color: item.color,
            fontWeight: item.fontWeight,
            fontFamily: item.fontFamily,
            textAlign: item.textAlign,
            backgroundColor: item.backgroundColor,
        }));
    };

    // Convert from VideoItem format to unified items
    const convertFromVideoItems = (videoItems: VideoItem[]): EditableVideoContainerProps['items'] => {
        return videoItems.map(item => ({
            id: item.id,
            type: item.type,
            content: item.content,
            mediaId: item.mediaId,
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
            fontSize: item.fontSize,
            color: item.color,
            fontWeight: item.fontWeight,
            fontFamily: item.fontFamily,
            textAlign: item.textAlign,
            backgroundColor: item.backgroundColor,
        }));
    };

    const [items, setItems] = useState<VideoItem[]>(convertToVideoItems(initialItems));
    const [dragState, setDragState] = useState<any>(null);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [editingText, setEditingText] = useState<string | null>(null);
    const [isContainerHovered, setIsContainerHovered] = useState(false);
    const [activeTextControls, setActiveTextControls] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateItems = useCallback((newItems: VideoItem[]) => {
        setItems(newItems);
        onUpdate(convertFromVideoItems(newItems));
    }, [onUpdate]);

    const handleMouseDown = useCallback((e: React.MouseEvent, itemId: string, type: 'move' | 'resize', resizeHandle?: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const item = items.find(item => item.id === itemId);
        if (!item) return;

        setDragState({
            itemId,
            startX: e.clientX,
            startY: e.clientY,
            startItemX: item.x,
            startItemY: item.y,
            startWidth: item.width,
            startHeight: item.height,
            type,
            resizeHandle
        });
        setSelectedItem(itemId);
    }, [items]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragState || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const deltaX = e.clientX - dragState.startX;
        const deltaY = e.clientY - dragState.startY;

        const updatedItems = items.map(item => {
            if (item.id === dragState.itemId) {
                if (dragState.type === 'move') {
                    return {
                        ...item,
                        x: Math.max(0, Math.min(rect.width - item.width, dragState.startItemX + deltaX)),
                        y: Math.max(0, Math.min(rect.height - item.height, dragState.startItemY + deltaY))
                    };
                } else if (dragState.type === 'resize') {
                    const handle = dragState.resizeHandle;
                    let newWidth = item.width;
                    let newHeight = item.height;
                    let newX = item.x;
                    let newY = item.y;

                    if (handle.includes('e')) newWidth = Math.max(50, dragState.startWidth + deltaX);
                    if (handle.includes('w')) {
                        newWidth = Math.max(50, dragState.startWidth - deltaX);
                        newX = Math.max(0, dragState.startItemX + deltaX);
                    }
                    if (handle.includes('s')) newHeight = Math.max(30, dragState.startHeight + deltaY);
                    if (handle.includes('n')) {
                        newHeight = Math.max(30, dragState.startHeight - deltaY);
                        newY = Math.max(0, dragState.startItemY + deltaY);
                    }

                    return { ...item, width: newWidth, height: newHeight, x: newX, y: newY };
                }
            }
            return item;
        });

        updateItems(updatedItems);
    }, [dragState, items, updateItems]);

    const handleMouseUp = useCallback(() => {
        setDragState(null);
    }, []);

    useEffect(() => {
        if (dragState) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [dragState, handleMouseMove, handleMouseUp]);

    const addVideo = (mediaId: string) => {
        const mediaItem = state.items.find(item => item.id === mediaId);
        if (!mediaItem) return;

        const newItem: VideoItem = {
            id: `item-${Date.now()}`,
            type: 'video',
            content: mediaItem.url,
            mediaId: mediaId,
            x: 20,
            y: 20,
            width: 300,
            height: 200
        };

        updateItems([...items, newItem]);
        setShowAddMenu(false);
    };

    const addText = () => {
        const newItem: VideoItem = {
            id: `item-${Date.now()}`,
            type: 'text',
            content: 'Click to edit text',
            x: 20,
            y: 20,
            width: 200,
            height: 80,
            fontSize: 16,
            color: '#000000',
            fontWeight: 'normal',
            fontFamily: 'var(--font-inter)',
            textAlign: 'left',
            backgroundColor: 'transparent'
        };

        updateItems([...items, newItem]);
        setShowAddMenu(false);
    };

    const deleteItem = (itemId: string) => {
        updateItems(items.filter(item => item.id !== itemId));
        setSelectedItem(null);
    };

    const updateItemText = (itemId: string, newContent: string) => {
        const updatedItems = items.map(item =>
            item.id === itemId ? { ...item, content: newContent } : item
        );
        updateItems(updatedItems);
    };

    const updateItemProperty = (itemId: string, property: string, value: any) => {
        const updatedItems = items.map(item =>
            item.id === itemId ? { ...item, [property]: value } : item
        );
        updateItems(updatedItems);
    };

    const ResizeHandles = ({ itemId }: { itemId: string }) => {
        const handles = ['nw', 'ne', 'sw', 'se'];
        return (
            <>
                {handles.map(handle => (
                    <div
                        key={handle}
                        className={`absolute w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-${handle}-resize ${handle === 'nw' ? '-top-1 -left-1' :
                            handle === 'ne' ? '-top-1 -right-1' :
                                handle === 'sw' ? '-bottom-1 -left-1' : '-bottom-1 -right-1'
                            }`}
                        onMouseDown={(e) => handleMouseDown(e, itemId, 'resize', handle)}
                    />
                ))}
            </>
        );
    };

    const GridItemComponent = ({ item }: { item: VideoItem }) => {
        const [isHovered, setIsHovered] = useState(false);
        const textControlsRef = useRef<HTMLDivElement>(null);

        const isSelected = selectedItem === item.id;
        const isEditingThisText = editingText === item.id;

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (textControlsRef.current && !textControlsRef.current.contains(event.target as Node)) {
                    setActiveTextControls(null);
                }
            };

            if (activeTextControls === item.id) {
                document.addEventListener('mousedown', handleClickOutside);
                return () => {
                    document.removeEventListener('mousedown', handleClickOutside);
                };
            }
        }, [activeTextControls, item.id]);

        return (
            <div
                key={item.id}
                className={`absolute border-2 rounded-lg overflow-hidden transition-all duration-200 ${isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'
                    } ${isHovered ? 'shadow-md' : ''}`}
                style={{
                    left: item.x,
                    top: item.y,
                    width: item.width,
                    height: item.height,
                    zIndex: isSelected ? 10 : 1
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item.id);
                }}
            >
                {/* Move handle */}
                {(isHovered || isSelected) && (
                    <>
                        <div
                            className="absolute -top-6 -left-1 bg-blue-500 text-white rounded p-1 cursor-move z-10"
                            onMouseDown={(e) => handleMouseDown(e, item.id, 'move')}
                        >
                            <Grip className="w-3 h-3" />
                        </div>

                        {/* Text controls for text items */}
                        {item.type === 'text' && (
                            <div className="absolute -top-6 -right-1 flex gap-1 z-10">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTextControls(activeTextControls === item.id ? null : item.id);
                                    }}
                                    className="bg-gray-600 text-white rounded p-1 hover:bg-gray-700 transition-colors"
                                    title="Text Settings"
                                >
                                    <Type className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteItem(item.id);
                                    }}
                                    className="bg-red-500 text-white rounded p-1 hover:bg-red-600 transition-colors"
                                    title="Delete"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}

                        {/* Video controls */}
                        {item.type === 'video' && (
                            <div className="absolute -top-6 -right-1 flex gap-1 z-10">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteItem(item.id);
                                    }}
                                    className="bg-red-500 text-white rounded p-1 hover:bg-red-600 transition-colors"
                                    title="Delete"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Text controls popup */}
                {activeTextControls === item.id && item.type === 'text' && (
                    <div
                        ref={textControlsRef}
                        className="fixed bg-background border-0 rounded-lg shadow-neumorphic p-3 z-50 w-64"
                        style={{
                            top: Math.max(10, item.y - 200),
                            left: Math.min(window.innerWidth - 256, item.x)
                        }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium text-gray-700">Text Properties</h4>
                            <button
                                onClick={() => setActiveTextControls(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="32"
                                    value={item.fontSize || 16}
                                    onChange={(e) => updateItemProperty(item.id, 'fontSize', parseInt(e.target.value))}
                                    className="w-full accent-primary"
                                />
                                <span className="text-xs text-gray-500">{item.fontSize || 16}px</span>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                                <input
                                    type="color"
                                    value={item.color || '#000000'}
                                    onChange={(e) => updateItemProperty(item.id, 'color', e.target.value)}
                                    className="w-full h-8 rounded-lg shadow-neumorphic-inset bg-background border-0 focus:outline-none focus:shadow-neumorphic-inset"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Font Weight</label>
                                <select
                                    value={item.fontWeight || 'normal'}
                                    onChange={(e) => updateItemProperty(item.id, 'fontWeight', e.target.value)}
                                    className="w-full p-2 rounded-lg shadow-neumorphic-inset bg-background text-sm border-0 focus:outline-none focus:shadow-neumorphic-inset"
                                >
                                    <option value="300">Light</option>
                                    <option value="normal">Normal</option>
                                    <option value="600">Semi Bold</option>
                                    <option value="bold">Bold</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Text Align</label>
                                <div className="flex gap-1">
                                    {['left', 'center', 'right'].map(align => (
                                        <button
                                            key={align}
                                            onClick={() => updateItemProperty(item.id, 'textAlign', align)}
                                            className={`flex-1 p-1 text-xs rounded-lg transition-all duration-200 ${item.textAlign === align
                                                ? 'bg-primary text-white shadow-neumorphic-inset'
                                                : 'bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset'
                                                }`}
                                        >
                                            {align.charAt(0).toUpperCase() + align.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
                                <input
                                    type="color"
                                    value={item.backgroundColor || '#transparent'}
                                    onChange={(e) => updateItemProperty(item.id, 'backgroundColor', e.target.value)}
                                    className="w-full h-8 rounded border border-gray-300"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Item content */}
                {item.type === 'video' ? (
                    <video
                        src={item.content}
                        className="w-full h-full object-cover rounded"
                        controls
                        preload="metadata"
                    />
                ) : (
                    <div
                        className="w-full h-full p-2 rounded flex items-center justify-center relative"
                        style={{
                            backgroundColor: item.backgroundColor || 'transparent'
                        }}
                    >
                        {isEditingThisText ? (
                            <textarea
                                value={item.content}
                                onChange={(e) => updateItemText(item.id, e.target.value)}
                                onBlur={() => setEditingText(null)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        setEditingText(null);
                                    }
                                }}
                                autoFocus
                                className="w-full h-full p-1 border-0 outline-none resize-none bg-transparent"
                                style={{
                                    fontSize: item.fontSize,
                                    color: item.color,
                                    fontWeight: item.fontWeight,
                                    fontFamily: item.fontFamily,
                                    textAlign: item.textAlign
                                }}
                            />
                        ) : (
                            <div
                                className="w-full h-full flex items-center cursor-pointer"
                                style={{
                                    fontSize: item.fontSize,
                                    color: item.color,
                                    fontWeight: item.fontWeight,
                                    fontFamily: item.fontFamily,
                                    textAlign: item.textAlign,
                                    justifyContent:
                                        item.textAlign === 'center' ? 'center' :
                                            item.textAlign === 'right' ? 'flex-end' : 'flex-start'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingText(item.id);
                                }}
                            >
                                <span className="break-words">{item.content || 'Click to edit text'}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Resize handles */}
                {isSelected && <ResizeHandles itemId={item.id} />}
            </div>
        );
    };

    return (
        <div
            className="w-full bg-gray-100 relative overflow-hidden rounded-lg resize-y"
            style={{
                minHeight: '400px',
                maxHeight: '800px',
                height: properties.rowHeight ? `${properties.rowHeight * 10}px` : '400px',
                ...properties.margins && {
                    marginTop: properties.margins.top || 0,
                    marginBottom: properties.margins.bottom || 0,
                    marginLeft: properties.margins.left || 0,
                    marginRight: properties.margins.right || 0
                }
            }}
            onMouseEnter={() => setIsContainerHovered(true)}
            onMouseLeave={() => setIsContainerHovered(false)}
        >
            <div
                ref={containerRef}
                className="w-full h-full relative shadow-neumorphic-inset rounded-lg"
                onClick={() => setSelectedItem(null)}
            >
                {items.map(item => (
                    <GridItemComponent key={item.id} item={item} />
                ))}

                {/* Empty state */}
                {items.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <div className="text-4xl mb-2">🎥</div>
                            <p className="text-sm">Click the + button to add videos or text</p>
                        </div>
                    </div>
                )}

                {/* Add button - always visible when container is hovered or has no items */}
                {(items.length === 0 || isContainerHovered) && (
                    <div className="absolute bottom-4 right-4 z-40">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowAddMenu(true);
                            }}
                            className="bg-primary hover:bg-primary/90 active:bg-primary/85 text-white p-3 rounded-lg shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                            title="Add content"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Add Menu Modal */}
            {showAddMenu && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background rounded-lg shadow-neumorphic p-6 w-96 max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-primary">Add Content</h3>
                            <button
                                onClick={() => setShowAddMenu(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Add Text Button */}
                            <button
                                onClick={addText}
                                className="w-full flex items-center gap-3 p-3 hover:bg-background/80 hover:shadow-neumorphic-sm rounded-lg text-left transition-all duration-200"
                            >
                                <Type className="w-5 h-5 text-blue-500" />
                                <span className="font-medium">Add Text</span>
                            </button>

                            {/* Videos Section */}
                            {state.items.filter(item => item.media_type === 'video').length > 0 && (
                                <>
                                    <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">Available Videos</h4>
                                    <div className="max-h-48 overflow-y-auto">
                                        {state.items.filter(item => item.media_type === 'video').map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => addVideo(item.id)}
                                                className="w-full flex items-center gap-3 p-2 hover:bg-background/80 hover:shadow-neumorphic-sm rounded-lg text-left transition-all duration-200"
                                            >
                                                <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                                                    <span className="text-xs">🎥</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {item.category}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            {state.items.filter(item => item.media_type === 'video').length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-2xl mb-2">🎥</div>
                                    <p className="text-sm">No videos available</p>
                                    <p className="text-xs mt-1">Upload videos in the Media section first</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
