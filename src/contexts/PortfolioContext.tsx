'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface MediaItem {
    id: string;
    filename: string;
    media_type: 'image' | 'video';
    title: string;
    description: string;
    category: string;
    date?: string;
    url: string;
    file?: File; // For preview before upload
}

export interface PortfolioElement {
    id: string;
    type: 'text' | 'image' | 'video' | 'hr' | 'section';
    content?: string;
    mediaId?: string;
    items?: Array<{
        id: string;
        type: 'image' | 'video' | 'text';
        mediaId?: string;
        content?: string;
        // Grid-based layout (for image/text containers)
        gridColumn?: string; // e.g., "1/4" for spanning from column 1 to 4
        gridRow?: string; // e.g., "1/6" for spanning from row 1 to 6
        // Absolute positioning layout (for video containers)
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        // Common properties
        fontSize?: number;
        fontWeight?: string;
        color?: string;
        fontFamily?: string;
        textAlign?: 'left' | 'center' | 'right';
        backgroundColor?: string;
    }>;
    properties: Record<string, any>;
    sectionId?: string; // For elements that belong to a section
    children?: PortfolioElement[]; // For sections that contain other elements
}

export interface PortfolioLayout {
    elements: PortfolioElement[];
    sections: PortfolioElement[];
}

export interface PortfolioState {
    items: MediaItem[];
    layout: PortfolioLayout;
    categories: string[];
    collapsedCategories: Set<string>;
    isLoading: boolean;
    userId: string;
}

type PortfolioAction =
    | { type: 'ADD_ITEM'; payload: MediaItem }
    | { type: 'UPDATE_ITEM'; payload: { id: string; updates: Partial<MediaItem> } }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'TOGGLE_CATEGORY'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'LOAD_PORTFOLIO'; payload: MediaItem[] }
    | { type: 'CLEAR_PORTFOLIO' }
    | { type: 'ADD_ELEMENT'; payload: PortfolioElement }
    | { type: 'UPDATE_ELEMENT'; payload: { id: string; updates: Partial<PortfolioElement> } }
    | { type: 'REMOVE_ELEMENT'; payload: string }
    | { type: 'REORDER_ELEMENTS'; payload: { activeId: string; overId: string; sectionId?: string } }
    | { type: 'MOVE_ELEMENT_TO_SECTION'; payload: { elementId: string; sectionId: string } }
    | { type: 'UPDATE_ELEMENT_PROPERTY'; payload: { id: string; property: string; value: any } }
    | { type: 'LOAD_LAYOUT'; payload: PortfolioLayout };

const initialState: PortfolioState = {
    items: [],
    layout: {
        elements: [],
        sections: [{
            id: 'default-section',
            type: 'section',
            properties: { title: 'Main Section', backgroundColor: '#ffffff', padding: '0' },
            children: [],
        }],
    },
    categories: ['Photography', 'Video Work', 'Digital Art', 'Other'],
    collapsedCategories: new Set(),
    isLoading: false,
    userId: 'default-user',
};

function portfolioReducer(state: PortfolioState, action: PortfolioAction): PortfolioState {
    switch (action.type) {
        case 'ADD_ITEM':
            return {
                ...state,
                items: [...state.items, action.payload],
            };
        case 'UPDATE_ITEM':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, ...action.payload.updates }
                        : item
                ),
            };
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
            };
        case 'TOGGLE_CATEGORY':
            const newCollapsed = new Set(state.collapsedCategories);
            if (newCollapsed.has(action.payload)) {
                newCollapsed.delete(action.payload);
            } else {
                newCollapsed.add(action.payload);
            }
            return {
                ...state,
                collapsedCategories: newCollapsed,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'LOAD_PORTFOLIO':
            return {
                ...state,
                items: action.payload,
                isLoading: false,
            };
        case 'CLEAR_PORTFOLIO':
            return {
                ...state,
                items: [],
                layout: { elements: [], sections: [] },
            };
        case 'ADD_ELEMENT':
            if (action.payload.type === 'section') {
                return {
                    ...state,
                    layout: {
                        ...state.layout,
                        sections: [...state.layout.sections, action.payload],
                    },
                };
            } else {
                // Add elements to the first section by default
                const firstSection = state.layout.sections[0];
                if (firstSection) {
                    return {
                        ...state,
                        layout: {
                            ...state.layout,
                            sections: state.layout.sections.map(section =>
                                section.id === firstSection.id
                                    ? { ...section, children: [...(section.children || []), action.payload] }
                                    : section
                            ),
                        },
                    };
                } else {
                    // If no sections exist, create a default one
                    const defaultSection = {
                        id: 'default-section',
                        type: 'section' as const,
                        properties: { title: 'Main Section', backgroundColor: '#ffffff', padding: '0' },
                        children: [action.payload],
                    };
                    return {
                        ...state,
                        layout: {
                            ...state.layout,
                            sections: [defaultSection],
                        },
                    };
                }
            }
        case 'UPDATE_ELEMENT':
            return {
                ...state,
                layout: {
                    ...state.layout,
                    elements: state.layout.elements.map(element =>
                        element.id === action.payload.id
                            ? { ...element, ...action.payload.updates }
                            : element
                    ),
                    sections: state.layout.sections.map(section =>
                        section.id === action.payload.id
                            ? { ...section, ...action.payload.updates }
                            : {
                                ...section,
                                children: section.children?.map(child =>
                                    child.id === action.payload.id
                                        ? { ...child, ...action.payload.updates }
                                        : child
                                ) || [],
                            }
                    ),
                },
            };
        case 'UPDATE_ELEMENT_PROPERTY':
            return {
                ...state,
                layout: {
                    ...state.layout,
                    elements: state.layout.elements.map(element =>
                        element.id === action.payload.id
                            ? {
                                ...element,
                                properties: {
                                    ...element.properties,
                                    [action.payload.property]: action.payload.value,
                                },
                            }
                            : element
                    ),
                    sections: state.layout.sections.map(section =>
                        section.id === action.payload.id
                            ? {
                                ...section,
                                properties: {
                                    ...section.properties,
                                    [action.payload.property]: action.payload.value,
                                },
                            }
                            : {
                                ...section,
                                children: section.children?.map(child =>
                                    child.id === action.payload.id
                                        ? {
                                            ...child,
                                            properties: {
                                                ...child.properties,
                                                [action.payload.property]: action.payload.value,
                                            },
                                        }
                                        : child
                                ) || [],
                            }
                    ),
                },
            };
        case 'REMOVE_ELEMENT':
            // Prevent deletion of the last section
            if (state.layout.sections.find(s => s.id === action.payload)?.type === 'section' &&
                state.layout.sections.length <= 1) {
                return state;
            }

            return {
                ...state,
                layout: {
                    elements: state.layout.elements.filter(element => element.id !== action.payload),
                    sections: state.layout.sections
                        .filter(section => section.id !== action.payload)
                        .map(section => ({
                            ...section,
                            children: section.children?.filter(child => child.id !== action.payload) || [],
                        })),
                },
            };
        case 'LOAD_LAYOUT':
            return {
                ...state,
                layout: action.payload,
            };
        default:
            return state;
    }
}

const PortfolioContext = createContext<{
    state: PortfolioState;
    dispatch: React.Dispatch<PortfolioAction>;
} | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(portfolioReducer, initialState);

    // Auto-load portfolio on initial mount
    useEffect(() => {
        const loadInitialPortfolio = async () => {
            try {
                const { loadPortfolio } = await import('@/lib/api');
                const items = await loadPortfolio(state.userId);
                if (items.length > 0) {
                    dispatch({ type: 'LOAD_PORTFOLIO', payload: items });
                }
            } catch (error) {
                // Silently fail if no portfolio exists or API is unavailable
                console.log('No existing portfolio found or API unavailable');
            }
        };

        loadInitialPortfolio();
    }, []); // Only run once on mount

    return (
        <PortfolioContext.Provider value={{ state, dispatch }}>
            {children}
        </PortfolioContext.Provider>
    );
}

export function usePortfolio() {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
}
