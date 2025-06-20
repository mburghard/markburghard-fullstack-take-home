'use client';

import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faChevronDown,
    faEye,
    faCog,
    faImages,
    faArrowUp,
    faArrowDown,
    faTrash,
    faFont,
    faImage,
    faVideo,
    faMinus,
    faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import DraggableElement from '@/components/DraggableElement';
import ContextMenu from '@/components/ContextMenu';
import EditableText from '@/components/elements/EditableText';
import EditableImageContainer from '@/components/elements/EditableImageContainer';
import EditableVideo from '@/components/elements/EditableVideo';
import EditableHR from '@/components/elements/EditableHR';
import EditableSection from '@/components/elements/EditableSection';
import Navigation from '@/components/Navigation';
import QuickStartGuide from '@/components/QuickStartGuide';
import { usePortfolio, PortfolioElement } from '@/contexts/PortfolioContext';

export default function EditView() {
    const { state, dispatch } = usePortfolio();
    const [showNavigation, setShowNavigation] = useState(false);
    const [showElementToolbar, setShowElementToolbar] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragTimer, setDragTimer] = useState<NodeJS.Timeout | null>(null);
    const [activeElement, setActiveElement] = useState<PortfolioElement | null>(null);
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
    const [contextMenu, setContextMenu] = useState<{
        isOpen: boolean;
        elementId: string;
        elementType: 'text' | 'image' | 'video' | 'hr' | 'section';
        position: { x: number; y: number };
    }>({
        isOpen: false,
        elementId: '',
        elementType: 'text',
        position: { x: 0, y: 0 },
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px of movement before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setIsDragging(true);
        closeContextMenu();

        // Find and store the active element for the overlay
        const draggedElement = findElement(event.active.id as string);
        setActiveElement(draggedElement);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setIsDragging(false);
        setActiveElement(null);

        if (over && active.id !== over.id) {
            const activeId = active.id as string;
            const overId = over.id as string;

            // Find the active and over elements
            const activeElement = findElement(activeId);
            const overElement = findElement(overId);

            if (!activeElement || !overElement) return;

            // Handle moving elements within the same section
            if (activeElement.sectionId === overElement.sectionId) {
                const sectionId = activeElement.sectionId;
                if (sectionId) {
                    const section = state.layout.sections.find(s => s.id === sectionId);
                    if (section && section.children) {
                        const oldIndex = section.children.findIndex(child => child.id === activeId);
                        const newIndex = section.children.findIndex(child => child.id === overId);

                        if (oldIndex !== -1 && newIndex !== -1) {
                            const newChildren = arrayMove(section.children, oldIndex, newIndex);
                            const updatedSections = state.layout.sections.map(s =>
                                s.id === sectionId ? { ...s, children: newChildren } : s
                            );

                            dispatch({
                                type: 'LOAD_LAYOUT',
                                payload: {
                                    ...state.layout,
                                    sections: updatedSections,
                                },
                            });
                        }
                    }
                }
            }
            // Handle moving elements between sections or to sections
            else if (overElement.type === 'section' || overElement.sectionId) {
                const targetSectionId = overElement.type === 'section' ? overElement.id : overElement.sectionId;
                const sourceSectionId = activeElement.sectionId;

                if (targetSectionId && sourceSectionId && targetSectionId !== sourceSectionId) {
                    // Remove from source section
                    const sourceSection = state.layout.sections.find(s => s.id === sourceSectionId);
                    const targetSection = state.layout.sections.find(s => s.id === targetSectionId);

                    if (sourceSection && targetSection) {
                        const elementToMove = sourceSection.children?.find(child => child.id === activeId);
                        if (elementToMove) {
                            const updatedSections = state.layout.sections.map(section => {
                                if (section.id === sourceSectionId) {
                                    return {
                                        ...section,
                                        children: section.children?.filter(child => child.id !== activeId) || [],
                                    };
                                } else if (section.id === targetSectionId) {
                                    return {
                                        ...section,
                                        children: [...(section.children || []), elementToMove],
                                    };
                                }
                                return section;
                            });

                            dispatch({
                                type: 'LOAD_LAYOUT',
                                payload: {
                                    ...state.layout,
                                    sections: updatedSections,
                                },
                            });
                        }
                    }
                }
            }
        }
    };

    const findElement = (id: string): PortfolioElement | null => {
        // Search in global elements
        const globalElement = state.layout.elements.find(el => el.id === id);
        if (globalElement) return globalElement;

        // Search in section children
        for (const section of state.layout.sections) {
            if (section.id === id) return section;
            const childElement = section.children?.find(child => child.id === id);
            if (childElement) return { ...childElement, sectionId: section.id };
        }

        return null;
    };

    const addElement = (type: 'text' | 'image' | 'video' | 'hr' | 'section') => {
        const isFirstSection = type === 'section' && state.layout.sections.length === 0;
        const newElement: PortfolioElement = {
            id: `element-${Date.now()}`,
            type,
            content: type === 'text' ? 'Click to edit text' : undefined,
            properties: getDefaultProperties(type, isFirstSection),
            children: type === 'section' ? [] : undefined,
        };

        dispatch({ type: 'ADD_ELEMENT', payload: newElement });
        setShowElementToolbar(false);
    };

    const getDefaultProperties = (type: string, isFirstSection: boolean = false) => {
        switch (type) {
            case 'text':
                return {
                    fontSize: 16,
                    fontWeight: 'normal',
                    fontFamily: 'var(--font-inter)',
                    color: '#000000',
                    textAlign: 'left',
                    margins: { top: 16, bottom: 16, left: 0, right: 0 }
                };
            case 'image':
                return {
                    columns: 3,
                    spacing: 8,
                    alignment: 'center',
                    margins: { top: 16, bottom: 16, left: 0, right: 0 }
                };
            case 'video':
                return {
                    width: 400,
                    height: 225,
                    controls: true,
                    autoplay: false,
                    loop: false,
                    muted: false,
                    margins: { top: 16, bottom: 16, left: 0, right: 0 }
                };
            case 'hr':
                return { thickness: 1, width: 100, color: '#e5e7eb' };
            case 'section':
                return {
                    title: 'New Section',
                    backgroundColor: '#ffffff',
                    padding: 'normal',
                    height: isFirstSection ? 'screen' : 'auto',
                    contentAlignment: 'top'
                };
            default:
                return {};
        }
    };

    const handleElementContextMenu = (e: React.MouseEvent, element: PortfolioElement) => {
        console.log('Element context menu triggered:', element.id, element.type);

        // Don't show context menu for image/video elements - they handle their own
        if (element.type === 'image' || element.type === 'video') {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        setContextMenu({
            isOpen: true,
            elementId: element.id,
            elementType: element.type as 'text' | 'image' | 'video' | 'hr' | 'section',
            position: { x: e.clientX, y: e.clientY },
        });
    };

    const handleSectionContextMenu = (e: React.MouseEvent, sectionId: string) => {
        console.log('Section context menu triggered:', sectionId);
        e.preventDefault();
        e.stopPropagation();

        setContextMenu({
            isOpen: true,
            elementId: sectionId,
            elementType: 'section',
            position: { x: e.clientX, y: e.clientY },
        });
    };

    const moveElementToSection = (elementId: string, direction: 'prev' | 'next') => {
        const element = findElement(elementId);
        if (!element || !element.sectionId) return;

        const currentSectionIndex = state.layout.sections.findIndex(s => s.id === element.sectionId);
        if (currentSectionIndex === -1) return;

        const targetSectionIndex = direction === 'prev' ? currentSectionIndex - 1 : currentSectionIndex + 1;
        if (targetSectionIndex < 0 || targetSectionIndex >= state.layout.sections.length) return;

        const sourceSection = state.layout.sections[currentSectionIndex];
        const targetSection = state.layout.sections[targetSectionIndex];

        const elementToMove = sourceSection.children?.find(child => child.id === elementId);
        if (!elementToMove) return;

        const updatedSections = state.layout.sections.map((section, index) => {
            if (index === currentSectionIndex) {
                return {
                    ...section,
                    children: section.children?.filter(child => child.id !== elementId) || [],
                };
            } else if (index === targetSectionIndex) {
                return {
                    ...section,
                    children: [...(section.children || []), elementToMove],
                };
            }
            return section;
        });

        dispatch({
            type: 'LOAD_LAYOUT',
            payload: {
                ...state.layout,
                sections: updatedSections,
            },
        });

        closeContextMenu();
    };

    const closeContextMenu = () => {
        setContextMenu((prev) => ({ ...prev, isOpen: false }));
    };

    const toggleSectionCollapse = (sectionId: string) => {
        setCollapsedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            return newSet;
        });
    };

    const updateElementProperty = (id: string, property: string, value: any) => {
        dispatch({
            type: 'UPDATE_ELEMENT_PROPERTY',
            payload: { id, property, value },
        });
    };

    const moveSection = (sectionId: string, direction: 'up' | 'down') => {
        const sectionIndex = state.layout.sections.findIndex(s => s.id === sectionId);
        if (sectionIndex === -1) return;

        const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
        if (newIndex < 0 || newIndex >= state.layout.sections.length) return;

        const newSections = [...state.layout.sections];
        [newSections[sectionIndex], newSections[newIndex]] = [newSections[newIndex], newSections[sectionIndex]];

        dispatch({
            type: 'LOAD_LAYOUT',
            payload: {
                ...state.layout,
                sections: newSections,
            },
        });
    };

    const canMoveToSection = (elementId: string, direction: 'prev' | 'next'): boolean => {
        const element = findElement(elementId);
        if (!element || !element.sectionId) return false;

        const currentSectionIndex = state.layout.sections.findIndex(s => s.id === element.sectionId);
        if (currentSectionIndex === -1) return false;

        if (direction === 'prev') {
            return currentSectionIndex > 0;
        } else {
            return currentSectionIndex < state.layout.sections.length - 1;
        }
    };

    const canMoveSection = (sectionId: string, direction: 'up' | 'down'): boolean => {
        const sectionIndex = state.layout.sections.findIndex(s => s.id === sectionId);
        if (sectionIndex === -1) return false;

        if (direction === 'up') {
            return sectionIndex > 0;
        } else {
            return sectionIndex < state.layout.sections.length - 1;
        }
    };

    const deleteElement = (elementId: string) => {
        // Prevent deletion of the last section
        const element = findElement(elementId);
        if (element?.type === 'section' && state.layout.sections.length <= 1) {
            alert('You must have at least one section in your portfolio.');
            closeContextMenu();
            return;
        }

        dispatch({ type: 'REMOVE_ELEMENT', payload: elementId });
        closeContextMenu();
    };

    const renderElement = (element: PortfolioElement, isInSection = false) => {
        const ElementComponent = () => {
            switch (element.type) {
                case 'text':
                    return (
                        <EditableText
                            id={element.id}
                            content={element.content || ''}
                            properties={element.properties}
                            onUpdate={(content) => dispatch({
                                type: 'UPDATE_ELEMENT',
                                payload: { id: element.id, updates: { content } }
                            })}
                        />
                    );
                case 'image':
                    // Ensure items have grid properties for backward compatibility
                    const ensureGridProperties = (items: any[] = []) => {
                        return items.map((item, index) => {
                            if (!item.gridColumn || !item.gridRow) {
                                // Auto-assign grid positions for items without them
                                const cols = 3; // Default width
                                const rows = item.type === 'text' ? 2 : 4; // Text is shorter than images
                                const startCol = (index % 4) * 3 + 1; // Distribute in 4 columns
                                const startRow = Math.floor(index / 4) * 4 + 1;

                                return {
                                    ...item,
                                    gridColumn: `${startCol}/${Math.min(startCol + cols, 13)}`,
                                    gridRow: `${startRow}/${startRow + rows}`
                                };
                            }
                            return item;
                        });
                    };

                    return (
                        <EditableImageContainer
                            id={element.id}
                            items={ensureGridProperties(element.items)}
                            properties={element.properties}
                            onUpdate={(items) => dispatch({
                                type: 'UPDATE_ELEMENT',
                                payload: { id: element.id, updates: { items } }
                            })}
                            onUpdateProperty={(property, value) => updateElementProperty(element.id, property, value)}
                        />
                    );
                case 'video':
                    return (
                        <EditableVideo
                            id={element.id}
                            content={element.content || ''}
                            properties={element.properties}
                            onUpdate={(content) => dispatch({
                                type: 'UPDATE_ELEMENT',
                                payload: { id: element.id, updates: { content } }
                            })}
                            onUpdateProperty={(property, value) => updateElementProperty(element.id, property, value)}
                        />
                    );
                case 'hr':
                    return (
                        <EditableHR
                            id={element.id}
                            properties={element.properties}
                        />
                    );
                default:
                    return null;
            }
        };

        if (element.type === 'section') {
            const isCollapsed = collapsedSections.has(element.id);

            // If collapsed, show only a minimal collapsed state
            if (isCollapsed) {
                return (
                    <div key={element.id} className="group relative bg-background/50 border border-gray-200 rounded-lg p-4 my-2 shadow-neumorphic-sm">
                        {/* Section title */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                                {element.properties.title || 'Untitled Section'} ({element.children?.length || 0} element{element.children?.length !== 1 ? 's' : ''})
                            </span>
                            {/* Section controls - positioned on the right */}
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleSectionCollapse(element.id);
                                    }}
                                    className="p-2 bg-background shadow-neumorphic-sm hover:shadow-neumorphic-inset text-gray-600 hover:text-primary transition-all rounded-full"
                                    title="Expand Section"
                                >
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className="w-4 h-4 transition-transform duration-200 -rotate-90"
                                    />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleSectionContextMenu(e, element.id);
                                    }}
                                    className="p-2 bg-background shadow-neumorphic-sm hover:shadow-neumorphic-inset text-gray-600 hover:text-primary transition-all rounded-full"
                                    title="Section Settings"
                                >
                                    <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div key={element.id} className="group relative">
                    {/* Section title - only visible on hover */}
                    <div className="absolute top-2 right-20 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-neumorphic-sm text-sm font-medium text-gray-700 z-10 pointer-events-none">
                        {element.properties.title || 'Untitled Section'}
                    </div>

                    {/* Section controls - only visible on hover, positioned on the right */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 z-10">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleSectionCollapse(element.id);
                            }}
                            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-neumorphic-sm hover:shadow-neumorphic-inset text-gray-600 hover:text-primary transition-all"
                            title="Collapse Section"
                        >
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className="w-4 h-4 transition-transform duration-200"
                            />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSectionContextMenu(e, element.id);
                            }}
                            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-neumorphic-sm hover:shadow-neumorphic-inset text-gray-600 hover:text-primary transition-all"
                            title="Section Settings"
                        >
                            <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
                        </button>
                    </div>

                    <EditableSection
                        id={element.id}
                        properties={element.properties}
                    >
                        <div className="w-full relative">
                            <div className="w-full">
                                {element.children?.length === 0 ? (
                                    <div className="text-center text-gray-400 py-12 pointer-events-none">
                                        <p>Drop elements here or add new ones</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {element.children?.map((child) => (
                                            <DraggableElement
                                                key={child.id}
                                                id={child.id}
                                                onContextMenu={(e) => handleElementContextMenu(e, child)}
                                                className="hover:outline-2 hover:outline-primary/50 rounded-lg p-0.5"
                                            >
                                                {renderElement(child, true)}
                                            </DraggableElement>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </EditableSection>
                </div>
            );
        }

        if (isInSection) {
            return <ElementComponent />;
        }

        return (
            <DraggableElement
                key={element.id}
                id={element.id}
                onContextMenu={(e) => handleElementContextMenu(e, element)}
                className="hover:outline-2 hover:outline-blue-200 rounded p-2 mb-4"
            >
                <ElementComponent />
            </DraggableElement>
        );
    };

    // Simplified render function for drag overlay (no interactive elements)
    const renderElementForOverlay = (element: PortfolioElement) => {
        switch (element.type) {
            case 'text':
                return (
                    <div
                        className="p-2 rounded transition-colors text-left min-w-32"
                        style={{
                            fontSize: `${Math.min(element.properties.fontSize || 16, 16)}px`, // Cap font size for overlay
                            fontFamily: element.properties.fontFamily || 'var(--font-inter)',
                            fontWeight: element.properties.fontWeight || 'normal',
                            color: element.properties.color || '#000000',
                            maxWidth: '250px', // Limit width
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {element.content || 'Text element'}
                    </div>
                );
            case 'image':
                const items = element.items || [];
                if (items.length > 0) {
                    const firstImageItem = items.find(item => item.type === 'image');
                    if (firstImageItem) {
                        const mediaItem = state.items.find(item => item.id === firstImageItem.mediaId);
                        if (mediaItem) {
                            return (
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <img
                                            src={mediaItem.url}
                                            alt={mediaItem.title}
                                            className="rounded-lg shadow-sm"
                                            style={{
                                                width: '100px', // Fixed size for drag overlay
                                                height: '80px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        {items.length > 1 && (
                                            <div className="absolute top-1 right-1 bg-black bg-opacity-75 text-white px-1 py-0.5 rounded text-xs">
                                                +{items.length - 1}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }
                    }
                }
                return (
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center w-24 h-20 flex items-center justify-center">
                        <div className="text-gray-500">
                            <div className="text-lg">🖼️</div>
                        </div>
                    </div>
                );
            case 'video':
                if (element.content && element.content.trim()) {
                    return (
                        <div className="flex justify-center">
                            <div className="relative">
                                <div
                                    className="rounded-lg shadow-sm bg-black flex items-center justify-center"
                                    style={{
                                        width: '100px',
                                        height: '60px'
                                    }}
                                >
                                    <div className="text-white text-xl">▶️</div>
                                </div>
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center w-24 h-16 flex items-center justify-center">
                        <div className="text-gray-500">
                            <div className="text-lg">🎥</div>
                        </div>
                    </div>
                );
            case 'hr':
                return (
                    <div className="flex justify-center my-2">
                        <hr
                            style={{
                                borderWidth: `${element.properties.thickness || 1}px`,
                                borderColor: element.properties.color || '#e5e7eb',
                                borderStyle: 'solid',
                                width: '100px', // Fixed width for drag overlay
                                maxWidth: '100px',
                            }}
                        />
                    </div>
                );
            case 'section':
                return (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-16 w-48">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                            📦 {element.properties.title || 'Untitled Section'}
                        </div>
                        <div className="text-xs text-gray-500">
                            {element.children?.length || 0} element(s)
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen bg-background relative overflow-auto font-nunito">
            {/* Floating Add Elements Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setShowElementToolbar(!showElementToolbar)}
                    className="bg-background hover:bg-background/90 active:bg-background/80 text-primary rounded-lg p-4 shadow-neumorphic hover:shadow-neumorphic-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] active:shadow-neumorphic-inset group"
                    title="Add Elements"
                >
                    <FontAwesomeIcon
                        icon={faPlus}
                        className={`w-5 h-5 transition-transform duration-300 ${showElementToolbar ? 'rotate-45' : 'group-hover:rotate-12'
                            }`}
                    />
                </button>

                {/* Element Toolbar */}
                {showElementToolbar && (
                    <div className="absolute bottom-16 right-0 bg-background rounded-lg shadow-neumorphic p-8 min-w-56 backdrop-blur-sm">
                        <h3 className="font-bold text-lg text-primary mb-8 text-center uppercase tracking-wider">Add Elements</h3>
                        <div className="space-y-4">
                            <button
                                onClick={() => addElement('text')}
                                className="w-full text-left px-6 py-4 rounded-lg bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all duration-200 text-primary font-medium flex items-center space-x-4 text-sm"
                            >
                                <FontAwesomeIcon icon={faFont} className="w-5 h-5 text-primary" />
                                <span className="uppercase tracking-wider">TEXT</span>
                            </button>
                            <button
                                onClick={() => addElement('image')}
                                className="w-full text-left px-6 py-4 rounded-lg bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all duration-200 text-primary font-medium flex items-center space-x-4 text-sm"
                            >
                                <FontAwesomeIcon icon={faImage} className="w-5 h-5 text-primary" />
                                <span className="uppercase tracking-wider">IMAGE</span>
                            </button>
                            <button
                                onClick={() => addElement('video')}
                                className="w-full text-left px-6 py-4 rounded-lg bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all duration-200 text-primary font-medium flex items-center space-x-4 text-sm"
                            >
                                <FontAwesomeIcon icon={faVideo} className="w-5 h-5 text-primary" />
                                <span className="uppercase tracking-wider">VIDEO</span>
                            </button>
                            <button
                                onClick={() => addElement('hr')}
                                className="w-full text-left px-6 py-4 rounded-lg bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all duration-200 text-primary font-medium flex items-center space-x-4 text-sm"
                            >
                                <FontAwesomeIcon icon={faMinus} className="w-5 h-5 text-primary" />
                                <span className="uppercase tracking-wider">DIVIDER</span>
                            </button>
                            <button
                                onClick={() => addElement('section')}
                                className="w-full text-left px-6 py-4 rounded-lg bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all duration-200 text-primary font-medium flex items-center space-x-4 text-sm"
                            >
                                <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5 text-primary" />
                                <span className="uppercase tracking-wider">SECTION</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div
                className="w-full"
                onClick={(e) => {
                    // Close context menu when clicking on empty space
                    if (e.target === e.currentTarget) {
                        closeContextMenu();
                    }
                }}
            >
                {state.layout.sections.length === 0 ? (
                    <div className="text-center text-gray-500 py-32">
                        <div className="text-6xl mb-6 animate-pulse">✨</div>
                        <h2 className="text-3xl font-bold mb-4 text-primary uppercase tracking-widest">Start creating your portfolio</h2>
                        <p className="text-lg font-medium text-gray-600">Click the + button to add your first element</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={[
                                ...state.layout.sections.map(s => s.id),
                                ...state.layout.sections.flatMap(s => s.children?.map(c => c.id) || [])
                            ]}
                            strategy={verticalListSortingStrategy}
                        >
                            <div>
                                {state.layout.sections.map((section) => renderElement(section))}
                            </div>
                        </SortableContext>
                        <DragOverlay>
                            {activeElement ? (
                                <div
                                    className="bg-background shadow-neumorphic rounded-lg border-2 border-primary/50 p-2 opacity-90 max-w-xs"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {renderElementForOverlay(activeElement)}
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                )}
            </div>

            {/* Context Menu */}
            <ContextMenu
                isOpen={contextMenu.isOpen}
                onClose={closeContextMenu}
                elementType={contextMenu.elementType}
                position={contextMenu.position}
                currentProperties={
                    findElement(contextMenu.elementId)?.properties || {}
                }
                onUpdate={(property, value) =>
                    updateElementProperty(contextMenu.elementId, property, value)
                }
                onDelete={() => deleteElement(contextMenu.elementId)}
                onMoveUp={
                    contextMenu.elementType === 'section'
                        ? () => moveSection(contextMenu.elementId, 'up')
                        : undefined
                }
                onMoveDown={
                    contextMenu.elementType === 'section'
                        ? () => moveSection(contextMenu.elementId, 'down')
                        : undefined
                }
                onMoveToPrevSection={
                    contextMenu.elementType !== 'section'
                        ? () => moveElementToSection(contextMenu.elementId, 'prev')
                        : undefined
                }
                onMoveToNextSection={
                    contextMenu.elementType !== 'section'
                        ? () => moveElementToSection(contextMenu.elementId, 'next')
                        : undefined
                }
                canMoveToPrevSection={
                    contextMenu.elementType !== 'section' && canMoveToSection(contextMenu.elementId, 'prev')
                }
                canMoveToNextSection={
                    contextMenu.elementType !== 'section' && canMoveToSection(contextMenu.elementId, 'next')
                }
                canMoveUp={
                    contextMenu.elementType === 'section' && canMoveSection(contextMenu.elementId, 'up')
                }
                canMoveDown={
                    contextMenu.elementType === 'section' && canMoveSection(contextMenu.elementId, 'down')
                }
            />

            {/* Quick Start Guide */}
            <QuickStartGuide />
        </div>
    );
}
