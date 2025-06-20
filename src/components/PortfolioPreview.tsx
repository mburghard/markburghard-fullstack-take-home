'use client';

import React from 'react';
import { usePortfolio, MediaItem } from '@/contexts/PortfolioContext';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function PortfolioPreview() {
    const { state, dispatch } = usePortfolio();

    const groupedItems = state.items.reduce((groups, item) => {
        const category = item.category || 'Other';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
        return groups;
    }, {} as Record<string, MediaItem[]>);

    const toggleCategory = (category: string) => {
        dispatch({ type: 'TOGGLE_CATEGORY', payload: category });
    };

    const isCategoryCollapsed = (category: string) => {
        return state.collapsedCategories.has(category);
    };

    if (state.items.length === 0) {
        return (
            <div className="bg-background font-nunito dark:bg-background rounded-2xl shadow-neumorphic p-8 lg:p-16 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                    <svg
                        className="mx-auto h-16 w-16 mb-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <h3 className="text-xl font-bold mb-4 text-primary dark:text-white uppercase tracking-wider">No media uploaded yet</h3>
                    <p className="text-base font-medium">Start building your portfolio by uploading some images or videos!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background font-nunito dark:bg-background rounded-2xl shadow-neumorphic overflow-hidden">
            <div className="px-6 py-5 lg:px-12 lg:py-6">
                <h2 className="text-xl lg:text-2xl font-bold mb-3 text-primary dark:text-white tracking-widest uppercase">
                    Portfolio Preview
                </h2>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {state.items.length} item{state.items.length !== 1 ? 's' : ''} in your portfolio
                </p>
            </div>

            <div className="space-y-8 px-6 lg:px-12 pb-6 lg:pb-12">
                {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category} className=" rounded-2xl p-4">
                        {/* Category Header */}
                        <button
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between p-3 rounded-lg bg-background text-primary dark:bg-white/10 dark:text-white
                                hover:bg-primary/20 dark:hover:bg-white/20 transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99]
                                shadow-neumorphic"
                        >
                            <div className="flex items-center">
                                {isCategoryCollapsed(category) ? (
                                    <ChevronRightIcon className="h-5 w-5 mr-2" />
                                ) : (
                                    <ChevronDownIcon className="h-5 w-5 mr-2" />
                                )}
                                <h3 className="text-base font-bold uppercase tracking-wider">
                                    {category}
                                </h3>
                            </div>
                            <span className="bg-primary/20 dark:bg-white/20 text-primary dark:text-white px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wide">
                                {items.length}
                            </span>
                        </button>

                        {/* Category Content */}
                        {!isCategoryCollapsed(category) && (
                            <div className="mt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group relative bg-background rounded-2xl shadow-neumorphic overflow-hidden 
                                                hover:shadow-neumorphic-lg transition-all duration-300 ease-out hover:scale-[1.02]"
                                        >
                                            {/* Media Display */}
                                            <div className="aspect-video bg-background/50">
                                                {item.media_type === 'image' ? (
                                                    <img
                                                        src={item.url}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover rounded-t-xl"
                                                    />
                                                ) : (
                                                    <video
                                                        src={item.url}
                                                        className="w-full h-full object-cover rounded-t-xl"
                                                        controls
                                                        preload="metadata"
                                                    />
                                                )}
                                            </div>

                                            {/* Media Info */}
                                            <div className="p-6">
                                                <h4 className="font-bold text-primary dark:text-white mb-2 line-clamp-2 uppercase tracking-wider">
                                                    {item.title}
                                                </h4>
                                                {item.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 font-medium">
                                                        {item.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide">
                                                    <span>
                                                        {item.media_type}
                                                    </span>
                                                    {item.date && (
                                                        <span>
                                                            {new Date(item.date).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Hover Actions */}
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                                                    className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white p-2 rounded-xl shadow-neumorphic
                                                        transition-all duration-200 ease-out hover:scale-[1.05] active:scale-[0.95]"
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
