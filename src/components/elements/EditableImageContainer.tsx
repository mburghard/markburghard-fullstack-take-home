import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Grip, Plus, X, Type } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';

interface GridItem {
    id: string;
    type: 'image' | 'text';
    content: string;
    mediaId?: string; // For linking to portfolio images
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize?: number;
    color?: string;
    fontWeight?: 'normal' | 'bold' | 'semibold' | 'light';
    fontFamily?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
}

interface DragState {
    itemId: string;
    startX: number;
    startY: number;
    startItemX: number;
    startItemY: number;
    startWidth: number;
    startHeight: number;
    type: 'move' | 'resize';
    resizeHandle?: string;
}

interface EditableImageContainerProps {
    id: string;
    items?: GridItem[];
    properties: {
        spacing?: number;
        alignment?: 'left' | 'center' | 'right';
        margins?: { top?: number; bottom?: number; left?: number; right?: number };
        columns?: number;
        rowHeight?: number;
    };
    onUpdate: (items: GridItem[]) => void;
    onUpdateProperty?: (property: string, value: any) => void;
}

export default function EditableImageContainer({
    id,
    items: initialItems = [],
    properties,
    onUpdate,
    onUpdateProperty,
}: EditableImageContainerProps) {
    const { state } = usePortfolio();
    const [items, setItems] = useState<GridItem[]>(initialItems);
    const [dragState, setDragState] = useState<DragState | null>(null);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [editingText, setEditingText] = useState<string | null>(null);
    const [isContainerHovered, setIsContainerHovered] = useState(false);
    const [activeTextControls, setActiveTextControls] = useState<string | null>(null); // Track which item has text controls open
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync initial items from parent only once
    useEffect(() => {
        if (initialItems.length > 0 && items.length === 0) {
            setItems(initialItems);
        }
    }, [initialItems]);

    // Helper function to update items and notify parent
    const updateItems = useCallback((newItems: GridItem[]) => {
        setItems(newItems);
        onUpdate(newItems);
    }, [onUpdate]);

    const snapToGrid = (value: number, gridSize: number = 20) => {
        return Math.round(value / gridSize) * gridSize;
    };

    const handleMouseDown = useCallback((e: React.MouseEvent, itemId: string, type: 'move' | 'resize', resizeHandle?: string) => {
        e.preventDefault();
        e.stopPropagation();

        const item = items.find(i => i.id === itemId);
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

        setItems(prevItems => prevItems.map(item => {
            if (item.id !== dragState.itemId) return item;

            if (dragState.type === 'move') {
                // Constrain movement within container bounds
                const newX = snapToGrid(Math.max(0, Math.min(rect.width - item.width, dragState.startItemX + deltaX)));
                const newY = snapToGrid(Math.max(0, Math.min(rect.height - item.height, dragState.startItemY + deltaY)));

                return { ...item, x: newX, y: newY };
            } else if (dragState.type === 'resize') {
                let newWidth = dragState.startWidth;
                let newHeight = dragState.startHeight;
                let newX = dragState.startItemX;
                let newY = dragState.startItemY;

                const minSize = 60;

                switch (dragState.resizeHandle) {
                    case 'se':
                        newWidth = snapToGrid(Math.max(minSize, Math.min(rect.width - newX, dragState.startWidth + deltaX)));
                        newHeight = snapToGrid(Math.max(minSize, Math.min(rect.height - newY, dragState.startHeight + deltaY)));
                        break;
                    case 'sw':
                        newWidth = snapToGrid(Math.max(minSize, dragState.startWidth - deltaX));
                        newHeight = snapToGrid(Math.max(minSize, Math.min(rect.height - newY, dragState.startHeight + deltaY)));
                        newX = snapToGrid(Math.max(0, dragState.startItemX - (newWidth - dragState.startWidth)));
                        break;
                    case 'ne':
                        newWidth = snapToGrid(Math.max(minSize, Math.min(rect.width - newX, dragState.startWidth + deltaX)));
                        newHeight = snapToGrid(Math.max(minSize, dragState.startHeight - deltaY));
                        newY = snapToGrid(Math.max(0, dragState.startItemY - (newHeight - dragState.startHeight)));
                        break;
                    case 'nw':
                        newWidth = snapToGrid(Math.max(minSize, dragState.startWidth - deltaX));
                        newHeight = snapToGrid(Math.max(minSize, dragState.startHeight - deltaY));
                        newX = snapToGrid(Math.max(0, dragState.startItemX - (newWidth - dragState.startWidth)));
                        newY = snapToGrid(Math.max(0, dragState.startItemY - (newHeight - dragState.startHeight)));
                        break;
                }

                return { ...item, width: newWidth, height: newHeight, x: newX, y: newY };
            }

            return item;
        }));
    }, [dragState]);

    const handleMouseUp = useCallback(() => {
        if (dragState) {
            // Update parent with final state
            updateItems(items);
        }
        setDragState(null);
    }, [dragState, items, updateItems]);

    // Add event listeners
    React.useEffect(() => {
        if (dragState) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [dragState, handleMouseMove, handleMouseUp]);

    const addImage = (mediaId: string) => {
        const mediaItem = state.items.find(item => item.id === mediaId);
        if (!mediaItem) return;

        const newItem: GridItem = {
            id: `item-${Date.now()}`,
            type: 'image',
            content: mediaItem.url,
            mediaId: mediaId,
            x: 20,
            y: 20,
            width: 200,
            height: 150
        };
        updateItems([...items, newItem]);
        setShowAddMenu(false);
    };

    const addText = () => {
        const newItem: GridItem = {
            id: `item-${Date.now()}`,
            type: 'text',
            content: 'Click to edit text',
            x: 20,
            y: 20,
            width: 200,
            height: 80,
            fontSize: 16,
            color: '#333333',
            fontWeight: 'normal',
            fontFamily: 'Inter, sans-serif',
            backgroundColor: 'transparent',
            textAlign: 'center'
        };
        updateItems([...items, newItem]);
        setShowAddMenu(false);
    };

    const deleteItem = (itemId: string) => {
        updateItems(items.filter(item => item.id !== itemId));
        setSelectedItem(null);
    };

    const updateItemProperty = (itemId: string, property: string, value: any) => {
        updateItems(items.map(item =>
            item.id === itemId ? { ...item, [property]: value } : item
        ));
    };

    const ResizeHandles: React.FC<{ itemId: string }> = ({ itemId }) => (
        <>
            {['nw', 'ne', 'sw', 'se'].map(handle => (
                <div
                    key={handle}
                    className={`absolute w-3 h-3 bg-blue-500 border border-white rounded-sm cursor-${handle}-resize ${handle === 'nw' ? '-top-1 -left-1' :
                        handle === 'ne' ? '-top-1 -right-1' :
                            handle === 'sw' ? '-bottom-1 -left-1' :
                                '-bottom-1 -right-1'
                        }`}
                    onMouseDown={(e) => handleMouseDown(e, itemId, 'resize', handle)}
                />
            ))}
        </>
    );

    const GridItemComponent: React.FC<{ item: GridItem }> = ({ item }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [editContent, setEditContent] = useState(item.content);
        const [isHovered, setIsHovered] = useState(false);
        const textControlsRef = useRef<HTMLDivElement>(null);
        const isSelected = selectedItem === item.id;
        const showTextControls = activeTextControls === item.id;

        const handleTextEdit = () => {
            if (item.type === 'text') {
                setIsEditing(true);
            }
        };

        const saveText = () => {
            updateItemProperty(item.id, 'content', editContent);
            setIsEditing(false);
        };

        const toggleTextControls = (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            setActiveTextControls(activeTextControls === item.id ? null : item.id);
        };

        // No automatic closing - only manual toggle
        // Removed the useEffect for click outside detection

        return (
            <div
                className={`absolute border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'} 
                   hover:border-blue-300 transition-colors group`}
                style={{
                    left: item.x,
                    top: item.y,
                    width: item.width,
                    height: item.height,
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item.id);
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Controls - only show on hover or selection */}
                {(isHovered || isSelected) && (
                    <>
                        {/* Move handle */}
                        <div
                            className="absolute -top-6 left-0 bg-primary text-white px-2 py-1 rounded-lg text-xs 
                             cursor-move flex items-center gap-1 transition-all duration-200 hover:bg-primary/90 shadow-neumorphic hover:shadow-neumorphic-sm"
                            onMouseDown={(e) => handleMouseDown(e, item.id, 'move')}
                        >
                            <Grip size={12} />
                            Move
                        </div>                        {/* Top-right controls for text */}
                        {item.type === 'text' && (
                            <div className="absolute -top-6 -right-1 flex gap-1 z-10">
                                {/* Text controls button */}
                                <button
                                    className="bg-green-500 text-white p-1 rounded-lg text-xs 
                                     transition-all duration-200 text-controls-button hover:bg-green-600 shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset"
                                    onClick={toggleTextControls}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    title="Text styling"
                                >
                                    <Type size={12} />
                                </button>

                                {/* Delete button */}
                                <button
                                    className="bg-red-500 text-white p-1 rounded-lg text-xs 
                                     transition-all duration-200 hover:bg-red-600 shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteItem(item.id);
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}

                        {/* Delete button for images */}
                        {item.type === 'image' && (
                            <button
                                className="absolute -top-6 right-0 bg-red-500 text-white p-1 rounded-lg text-xs 
                                 transition-all duration-200 hover:bg-red-600 z-10 shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteItem(item.id);
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <X size={12} />
                            </button>
                        )}
                    </>
                )}

                {/* Simple Text Controls */}
                {activeTextControls === item.id && item.type === 'text' && (
                    <div
                        className="fixed bg-background border-0 rounded-lg shadow-neumorphic p-3 z-50 w-64"
                        style={{
                            top: Math.max(10, item.y - 200),
                            left: Math.min(window.innerWidth - 256, item.x)
                        }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">Text Style</span>
                            <button
                                onClick={() => setActiveTextControls(null)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:shadow-neumorphic-sm transition-all duration-200"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div>
                                <label className="text-xs text-gray-600 font-medium">Size: {item.fontSize || 16}px</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="48"
                                    value={item.fontSize || 16}
                                    onChange={(e) => updateItemProperty(item.id, 'fontSize', parseInt(e.target.value))}
                                    className="w-full accent-primary"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 font-medium">Weight</label>
                                <select
                                    value={item.fontWeight || 'normal'}
                                    onChange={(e) => updateItemProperty(item.id, 'fontWeight', e.target.value)}
                                    className="w-full text-xs rounded-lg px-2 py-1 shadow-neumorphic-inset bg-background border-0 focus:outline-none focus:shadow-neumorphic-inset"
                                >
                                    <option value="light">Light</option>
                                    <option value="normal">Normal</option>
                                    <option value="semibold">Semi Bold</option>
                                    <option value="bold">Bold</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 font-medium">Color</label>
                                <input
                                    type="color"
                                    value={item.color || '#333333'}
                                    onChange={(e) => updateItemProperty(item.id, 'color', e.target.value)}
                                    className="w-full h-8 rounded-lg shadow-neumorphic-inset bg-background border-0 focus:outline-none focus:shadow-neumorphic-inset"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 font-medium">Alignment</label>
                                <div className="flex gap-1">
                                    {['left', 'center', 'right'].map(align => (
                                        <button
                                            key={align}
                                            onClick={() => updateItemProperty(item.id, 'textAlign', align)}
                                            className={`flex-1 px-2 py-1 text-xs rounded-lg transition-all duration-200 font-medium ${item.textAlign === align
                                                ? 'bg-primary text-white shadow-neumorphic-inset'
                                                : 'bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset'
                                                }`}
                                        >
                                            {align}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                {item.type === 'image' ? (
                    <img
                        src={item.content}
                        alt="Grid item"
                        className="w-full h-full object-cover rounded"
                        draggable={false}
                    />
                ) : (
                    <div
                        className="w-full h-full p-2 rounded flex items-center justify-center relative"
                        style={{
                            backgroundColor: item.backgroundColor || 'transparent',
                        }}
                    >
                        {isEditing ? (
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                onBlur={saveText}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        saveText();
                                    }
                                    if (e.key === 'Escape') {
                                        setIsEditing(false);
                                        setEditContent(item.content);
                                    }
                                }}
                                className="w-full h-full resize-none border-none outline-none bg-transparent cursor-text"
                                style={{
                                    fontSize: item.fontSize,
                                    color: item.color,
                                    fontWeight: item.fontWeight,
                                    fontFamily: item.fontFamily,
                                    textAlign: item.textAlign
                                }}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
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
                                    justifyContent: item.textAlign === 'center' ? 'center' :
                                        item.textAlign === 'right' ? 'flex-end' : 'flex-start'
                                }}
                                onClick={handleTextEdit}
                            >
                                {item.content}
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
            className="w-fullrelative overflow-hidden rounded-lg resize-y"
            style={{
                minHeight: '400px',
                maxHeight: '800px',
                height: properties.rowHeight ? `${properties.rowHeight * 10}px` : '400px',
                ...properties.margins && {
                    marginTop: properties.margins.top || 0,
                    marginBottom: properties.margins.bottom || 0,
                    marginLeft: properties.margins.left || 0,
                    marginRight: properties.margins.right || 0,
                }
            }}
            onMouseEnter={() => setIsContainerHovered(true)}
            onMouseLeave={() => setIsContainerHovered(false)}
        >
            {/* Grid container */}
            <div
                ref={containerRef}
                className="w-full h-full relative"
                onClick={() => setSelectedItem(null)}
            >
                {items.map(item => (
                    <GridItemComponent key={item.id} item={item} />
                ))}

                {/* Empty state */}
                {items.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <div className="text-4xl mb-4">🖼️</div>
                            <h3 className="text-lg font-medium mb-2">Create Your Layout</h3>
                            <p className="text-sm mb-4">Start by adding images from your portfolio or text blocks</p>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowAddMenu(true);
                                }}
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 active:bg-primary/85 transition-all duration-200 text-sm shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset hover:scale-[1.01] active:scale-[0.99] font-bold uppercase tracking-wider"
                            >
                                <Plus size={16} className="inline mr-2" />
                                Add First Item
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Single Add Menu Modal */}
            {showAddMenu && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddMenu(false)}>
                    <div className="bg-background rounded-lg shadow-neumorphic p-4 w-80 max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-primary uppercase tracking-wider">Add Content</h3>
                            <button
                                onClick={() => setShowAddMenu(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:shadow-neumorphic-sm transition-all duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <button
                            onClick={addText}
                            className="w-full flex items-center gap-3 p-3 bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset rounded-lg text-left transition-all duration-200 mb-2"
                        >
                            <Type size={20} className="text-green-500" />
                            <div>
                                <div className="font-bold text-primary">Add Text</div>
                                <div className="text-xs text-gray-500">Editable text block</div>
                            </div>
                        </button>

                        {state.items.filter(item => item.media_type === 'image').length > 0 && (
                            <>
                                <hr className="my-3" />
                                <div className="text-sm font-medium text-gray-700 mb-2">Portfolio Images</div>
                                <div className="max-h-48 overflow-y-auto">
                                    {state.items
                                        .filter(item => item.media_type === 'image')
                                        .map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => addImage(item.id)}
                                                className="w-full flex items-center gap-3 p-2 bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset rounded-lg text-left transition-all duration-200"
                                            >
                                                <img
                                                    src={item.url}
                                                    alt={item.title}
                                                    className="w-10 h-10 object-cover rounded-lg shadow-neumorphic"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-sm text-primary truncate">{item.title}</div>
                                                    <div className="text-xs text-gray-500 truncate">{item.category}</div>
                                                </div>
                                            </button>
                                        ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Floating add button - only show when items exist and container is hovered */}
            {items.length > 0 && isContainerHovered && (
                <div className="absolute bottom-4 right-4 z-40">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowAddMenu(true);
                        }}
                        className="bg-primary hover:bg-primary/90 active:bg-primary/85 text-white p-3 rounded-lg shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                        title="Add content"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};